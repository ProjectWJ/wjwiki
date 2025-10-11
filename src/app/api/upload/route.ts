// 본문에 삽입한 미디어 파일 업로드 api
import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { generateUUID, getFileExtension } from '@/lib/utils'; // 🚨 새로 만든 유틸리티 임포트

export async function POST(request: Request) {
    const { searchParams } = new URL(request.url);
    const originalFilename = searchParams.get('filename');


    // request.body를 stream으로 직접 처리해 blob에 업로드
    if (!request.body || !originalFilename){
        return NextResponse.json({ error: "파일과 파일명이 필요합니다."}, { status: 400 });
    }

    // 1. 확장자 추출
    const extension = getFileExtension(originalFilename);
    
    // 2. UUID로 새로운 파일 이름 생성
    const newFilename = generateUUID() + extension; 

    let responseJson;
    // put 함수를 사용해 vercel blob storage에 파일 업로드
    try {
        const blob = await put(newFilename, request.body, {
            access: "public" // 초기 접근 권한 설정 (나중에 Signed URL로 변경 가능)
            // contentType은 자동으로 설정되지만, 필요하면 지정 가능
        });

        responseJson = blob;
    }
    catch (error) {
        console.error("파일 업로드 중 오류 발생:", error);
        return NextResponse.json({ error: "파일 업로드 실패"}, { status: 500 });
    }

    // return NextResponse.json(responseJson);
    // 3. 응답에 원본 파일 이름 포함 (DB 저장을 위해)
    return NextResponse.json({ 
        url: responseJson.url, 
        originalFilename: originalFilename, // 원본 이름은 DB 저장을 위해 클라이언트에 반환
    });
}