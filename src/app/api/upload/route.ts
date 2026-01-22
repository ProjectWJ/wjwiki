// 본문에 삽입한 미디어 파일 업로드 api
import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { getFileExtension } from "@/lib/server-utils"; // 새로 만든 유틸리티 임포트
import { prisma } from "@/lib/db"; // model
import { generateResizedImagesSharp, ResizedImages } from "@/lib/server-utils";

// Blob: 파일 저장소. 업로드, URL 반환 외에는 관여 안 함
// Prisma의 Media 테이블: 메타데이터 저장소. 파일의 상태, 주인, 접근 권한 관리
// API(지금 이 코드): 중계자. 업로드, 메타데이터 기록, 프록시 URL 반환

// Blob의 put() 함수 타입 정의에 metadata 속성이 없고
// 이미 Prisma DB의 media 테이블이 메타데이터 정보를 모두 가지고 있어서
// 아래 metadata를 blob에 put하는 건 의미없음
/* metadata: {
    tag: 'PENDING', // 초기 상태는 PENDING
    userId: currentUserId, // 업로더 ID
    originalName: originalFilename, // 원본 이름
}, */

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const originalFilename = searchParams.get("filename");
  let fileURL: ResizedImages;

  // 가상의 사용자 ID 설정 (메타데이터 및 DB 저장을 위해 추가)
  const currentUserId = "projectwj";

  // request.body를 stream으로 직접 처리해 blob에 업로드
  if (!request.body || !originalFilename) {
    return NextResponse.json(
      { error: "파일과 파일명이 필요합니다." },
      { status: 400 },
    );
  }

  // 1. 확장자 추출
  const extension = getFileExtension(originalFilename);

  // put 함수를 사용해 vercel blob storage에 파일 업로드
  try {
    // blob에 파일 업로드
    const blob = await put(originalFilename, request.body, {
      access: "public", // private 미지원
      addRandomSuffix: true, // 자체 지원하는 랜덤 이름
    });

    const resizedImages = await generateResizedImagesSharp(blob.url);

    // 2. Media 테이블에 메타데이터 저장(원본, 썸네일, 상세보기 모두 하나의 row로 관리)
    // (Prisma의 id는 자동 생성되는 숫자형 PK)
    const originalFile = await prisma.media.create({
      data: {
        blob_url: blob.url, // Blob에 저장된 원본 URL
        original_name: originalFilename, // 업로드 당시 파일명
        mime_type: extension, // 파일 확장자명
        created_at: new Date(), // row 생성 시간
        uploaded_by: currentUserId, // 업로드한 사람
        status: "PENDING", // 사용 상태
        is_public: true, // 공개 상태
        // post_id 여기서는 일단 보류                 // 연결된 posts 게시글
        thumbnail_url: resizedImages.thumbnailUrl, // 썸네일 URL
        medium_url: resizedImages.mediumUrl, // 중간화질 URL
      },
      select: {
        blob_url: true, // 원본
        thumbnail_url: true, // 썸네일에 쓸 작은거
        medium_url: true, // 상세보기에 쓸 중간거
      },
    });

    // 3. 파일의 URL들 반환
    fileURL = {
      thumbnailUrl: originalFile.thumbnail_url as string,
      mediumUrl: originalFile.medium_url as string,
      originalUrl: originalFile.blob_url,
    };
  } catch (error) {
    console.error("파일 업로드 중 오류 발생:", error);
    return NextResponse.json({ error: "파일 업로드 실패" }, { status: 500 });
  }

  // 3. 응답에 원본 파일 이름 포함 (DB 저장을 위해)
  return NextResponse.json({
    url: fileURL, //
    originalFilename: originalFilename, // 원본 이름은 DB 저장을 위해 반환
  });
}
