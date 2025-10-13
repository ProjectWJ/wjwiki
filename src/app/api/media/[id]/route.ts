// 미디어 불러오는 프록시

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@/auth';
import { head } from '@vercel/blob';
import { NextRequest } from 'next/server';
import sharp from 'sharp';

export const runtime = 'nodejs'; // Node.js 환경에서 실행

/**
 * 프록시 서버 역할: 미디어 접근 권한을 확인하고 Vercel Blob에서 파일을 가져와 스트리밍합니다.
 * @param request 요청 객체
 * @param context Next.js 라우트 컨텍스트 (params 포함)
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<Response> {

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
    // head()를 사용해 파일의 메타데이터(콘텐츠 타입, 크기 등)를 먼저 가져옵니다.
    const blobMetadata = await head(blobUrl);

    // 실제 파일 데이터를 가져옵니다
    const blobResponse = await fetch(blobUrl);

    if (!blobMetadata || !blobResponse) {
      return new NextResponse('Not Found', { status: 404 });
    }

    if (!blobResponse.ok) {
        console.error(`Failed to fetch from Blob Storage: ${blobUrl}`, blobResponse.status);
        return new NextResponse('Failed to fetch media from storage.', { status: 500 });
    }

    // 4. 클라이언트에게 파일 스트리밍 반환 (프록시 역할)
    // 원본 응답의 헤더를 복사하여 캐싱 및 MIME 타입 정보를 유지합니다.
    // const headers = new Headers(blobResponse.headers);

    // =========== 최적화 로직 ===========

    // 1. 원본 이미지 데이터를 ArrayBuffer로 변환합니다.
    const imageArrayBuffer = await blobResponse.arrayBuffer();

    // 프론트엔드에서 요청받은 파라미터
    const width = request.nextUrl.searchParams.get('w');
    const quality = request.nextUrl.searchParams.get('q');

    // 주소창으로 직접 접근했다면 원본 제공
    const original = request.nextUrl.searchParams.get('original') === 'true';

    // 2. sharp를 이용해 버퍼를 직접 최적화하고, 결과를 새로운 버퍼로 받습니다.
    const optimizedBuffer = original
        ? imageArrayBuffer
        : await sharp(Buffer.from(imageArrayBuffer)) // sharp는 Buffer로 작업합니다.
        .resize(width ? parseInt(width) : undefined)
        .webp({ quality: quality ? parseInt(quality) : 75 })
        .toBuffer(); // 최적화된 결과물을 다시 Buffer로 출력

    // =========== 헤더 설정 ===========
    const headers = new Headers();

    // 캐싱 헤더 최적화
    if (!isPublic) {
        // 비공개 파일은 캐시 안 함 또는 매우 짧게 설정
        headers.set('Cache-Control', 'private, no-store, must-revalidate'); 
    } else {
        // 공개 파일은 길게(1년) 설정하여 CDN 성능 극대화
        headers.set('Cache-Control', 'public, max-age=31536000, immutable'); 
    }

    // 🔥 중요: Content-Length를 원본이 아닌, '최적화된 버퍼'의 크기로 설정해야 합니다.
    if(original === true) {
      // Content-Type을 DB에 저장된 타입으로 설정 (blobResponse에서 가져와도 무방)
      headers.set('Content-Type', blobMetadata.contentType || 'application/octet-stream');
      headers.set('Content-Length', optimizedBuffer.byteLength.toString());
    }
    else {
      // Content-Type을 webp로 설정
      headers.set('Content-Type', 'image/webp');
      headers.set('Content-Length', (optimizedBuffer as Buffer<ArrayBufferLike>).length.toString());
    }

    // 3. 최종적으로 최적화된 버퍼를 담아 응답합니다.
    return new Response(optimizedBuffer as unknown as BodyInit, {
        status: 200,
        headers: headers,
    });

/*     return new NextResponse(blobResponse.body, {
      status: 200,
      headers: headers,
    }); */

  } catch (error) {
    console.error('Error serving media proxy:', error);
    return new NextResponse('Internal Server Error while fetching media.', { status: 500 });
  }
}
