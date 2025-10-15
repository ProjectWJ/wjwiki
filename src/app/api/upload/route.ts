// 본문에 삽입한 미디어 파일 업로드 api
import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { getFileExtension } from '@/lib/utils'; // 🚨 새로 만든 유틸리티 임포트
import { prisma } from '@/lib/db' // model

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
    const originalFilename = searchParams.get('filename');
    let fileURL;

    // 가상의 사용자 ID 설정 (🚨 메타데이터 및 DB 저장을 위해 추가)
    const currentUserId = "projectwj"; 

    // request.body를 stream으로 직접 처리해 blob에 업로드
    if (!request.body || !originalFilename){
        return NextResponse.json({ error: "파일과 파일명이 필요합니다."}, { status: 400 });
    }

    // 1. 확장자 추출
    const extension = getFileExtension(originalFilename);
    
    // 2. UUID로 새로운 파일 이름 생성
    // const newFilename = generateUUID() + extension; 

    let resBlob;
    // put 함수를 사용해 vercel blob storage에 파일 업로드
    try {
        // blob에 파일 업로드
        const blob = await put(originalFilename, request.body, {
            access: "public", // private 미지원
            addRandomSuffix: true // 자체 지원하는 랜덤 이름
        });

        resBlob = blob;
        
        // 3. Media 테이블에 메타데이터 저장
        // (Prisma의 id는 자동 생성되는 숫자형 PK)
        const originalFile = await prisma.media.create({
            data: {
                blob_url: resBlob.url,
                original_name: originalFilename,
                mime_type: extension,
                uploaded_by: currentUserId,
                status: "PENDING",
                is_public: true,
            },
            select: {
                blob_url: true
            }
        })

        // 4. 파일의 원본 URL 반환
        fileURL = `${originalFile.blob_url}`;
    }
    catch (error) {
        console.error("파일 업로드 중 오류 발생:", error);
        return NextResponse.json({ error: "파일 업로드 실패"}, { status: 500 });
    }

    // return NextResponse.json(resBlob);
    // 3. 응답에 원본 파일 이름 포함 (DB 저장을 위해)
    return NextResponse.json({ 
        url: fileURL, // 원본 URL 반환
        originalFilename: originalFilename, // 원본 이름은 DB 저장을 위해 반환
    });
}