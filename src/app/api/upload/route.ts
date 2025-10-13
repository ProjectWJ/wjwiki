// 본문에 삽입한 미디어 파일 업로드 api
import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { getFileExtension } from '@/lib/utils'; // 🚨 새로 만든 유틸리티 임포트
import { prisma } from '@/lib/db' // model

//type mediaStatus = "PENDING" | "USED" | "SCHEDULED_FOR_DELETION";

/**
 * Media 테이블에 새 레코드를 생성(Create)할 때 필요한 데이터 구조
 * Prisma 스키마 (prisma/schema.prisma)를 기반으로 작성됨.
 */
/* interface mediaCreateData {
    // 필수 필드
    blob_url: string;        // Blob 스토리지 URL (unique)
    original_name: string;   // 파일의 원본 이름
    mime_type: string;       // 파일의 MIME 타입 (예: image/jpeg)
    
    // 선택 필드 (DB에서 default 값을 가지거나, 필수가 아님)
    uploaded_by?: string;      // 파일 업로더 ID (인증 후 사용)
    status?: mediaStatus;      // 파일 상태 ("PENDING"이 default)
} */

/**
 * Media 레코드를 업데이트(Update)할 때 사용하는 데이터 구조
 */
/* interface mediaUpdateData {
    // 모든 필드는 업데이트 시 선택 사항임
    blob_url?: string;
    original_name?: string;
    mime_type?: string;
    uploaded_by?: string;
    status?: mediaStatus;
    scheduled_delete_at?: Date | null; // 삭제 예약 시점 (Date 타입)
} */

export async function POST(request: Request) {
    const { searchParams } = new URL(request.url);
    const originalFilename = searchParams.get('filename');
    let fileIdURL;

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
            access: "public", // 초기 접근 권한 설정 (나중에 Signed URL로 변경 가능)
            // contentType은 자동으로 설정되지만, 필요하면 지정 가능
            addRandomSuffix: true // 자체 지원하는 랜덤 이름
        });

        resBlob = blob;

        // media 테이블에 업데이트
        // const mediaPrisma = await prisma.media.create({
        const originalFileId = await prisma.media.create({
            data: {
                blob_url: resBlob.url,
                original_name: originalFilename,
                mime_type: extension,
                uploaded_by: "", // 나중에 수정
                status: "PENDING"
            },
            select: {
                id: true,
            }
        })

        fileIdURL = `/api/media/${originalFileId.id}`;
    }
    catch (error) {
        console.error("파일 업로드 중 오류 발생:", error);
        return NextResponse.json({ error: "파일 업로드 실패"}, { status: 500 });
    }

    // return NextResponse.json(resBlob);
    // 3. 응답에 원본 파일 이름 포함 (DB 저장을 위해)
    return NextResponse.json({ 
        url: fileIdURL, 
        originalFilename: originalFilename, // 원본 이름은 DB 저장을 위해 클라이언트에 반환
        // 여기를 프록시 api url을 반환해야 함
    });
}