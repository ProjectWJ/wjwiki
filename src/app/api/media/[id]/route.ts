// 미디어 불러오는 프록시

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@/auth';
import { head } from '@vercel/blob';

export const runtime = 'nodejs'; // Node.js 환경에서 실행

/**
 * 프록시 서버 역할: 미디어 접근 권한을 확인하고 Vercel Blob에서 파일을 가져와 스트리밍합니다.
 * @param request 요청 객체
 * @param context Next.js 라우트 컨텍스트 (params 포함)
 */
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse> {

  console.log("✅ [ROUTE ENTERED] /api/media endpoint hit");
  console.log("🔹 request.url:", request.url);

  const params = await context.params;
  
  if (!params) {
    return new NextResponse('Media ID is required.', { status: 400 });
  }

  // 1. Media ID를 UUID 형식으로 가정하고 DB에서 조회
  // 파일명(UUID)을 미디어 ID로 사용하며, DB의 blob_url을 이용하여 조회합니다.
  const mediaRecord = await prisma.media.findFirst({
    where: {
      id: parseInt(params.id),
      status: {
        in: ['USED', 'PENDING'], // 사용 중이거나 아직 정리되지 않은 파일만 허용
      }
    },
    // 파일 상태를 함께 조회해 가져옵니다.
    select: {
        blob_url: true,     // 원본 URL
        mime_type: true,    // 확장자명
        is_public: true,    // 공개 상태
        status: true,       // 현재 사용 여부
    }
  });

  if (!mediaRecord || mediaRecord.status === 'SCHEDULED_FOR_DELETION') {
    return new NextResponse('Media not found or scheduled for deletion.', { status: 404 });
  }

  // 2. 권한 확인 로직 (🚨 핵심 보안 로직)
  const isPublic = mediaRecord.is_public;
  const session = await auth(); // 로그인 인증 // Promise.all()?

  if (!isPublic) {
    if (!session || !session.user) {
      return new NextResponse('Access Denied.', { status: 403 });
    }
  }

  // 3. Vercel Blob에서 실제 파일 가져오기
  try {
    const blobUrl = mediaRecord.blob_url;
    const blobMetadata = await head(blobUrl);

    // head()를 사용해 파일의 메타데이터(콘텐츠 타입, 크기 등)를 먼저 가져옵니다.
    if (!blobMetadata) {
      return new NextResponse('Not Found', { status: 404 });
    }

    // 실제 파일 데이터를 가져옵니다
    const blobResponse = await fetch(blobUrl);

    if (!blobResponse.ok) {
        console.error(`Failed to fetch from Blob Storage: ${blobUrl}`, blobResponse.status);
        return new NextResponse('Failed to fetch media from storage.', { status: 500 });
    }

    // 4. 클라이언트에게 파일 스트리밍 반환 (프록시 역할)
    // 원본 응답의 헤더를 복사하여 캐싱 및 MIME 타입 정보를 유지합니다.
    const headers = new Headers(blobResponse.headers);

    // 캐싱 헤더 최적화: 공개 파일은 캐시를 길게, 비공개 파일은 짧게 (또는 캐시 안 함)
    if (!isPublic) {
        // 비공개 파일은 캐시를 짧게 설정 (보안 유지)
        headers.set('Cache-Control', 'public, max-age=60'); 
    } else {
        // 공개 파일은 캐시를 길게 설정 (성능 최적화)
        headers.set('Cache-Control', 'public, max-age=31536000, immutable'); 
    }
    
    // Content-Type을 DB에 저장된 타입으로 설정 (blobResponse에서 가져와도 무방)
    headers.set('Content-Type', blobMetadata.contentType || 'application/octet-stream');
    headers.set('Content-Length', blobMetadata.size.toString());

    console.log("✅ [ROUTE ENDED]")
    return new NextResponse(blobResponse.body, {
      status: 200,
      headers: headers,
    });

  } catch (error) {
    console.error('Error serving media proxy:', error);
    return new NextResponse('Internal Server Error while fetching media.', { status: 500 });
  }
}
