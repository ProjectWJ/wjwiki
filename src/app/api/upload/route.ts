// 본문에 삽입한 미디어 파일 업로드 api
import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get("filename");

    // request.body를 stream으로 직접 처리해 blob에 업로드
    if (!request.body || !filename){
        return NextResponse.json({ error: "파일과 파일명이 필요합니다."}, { status: 400 });
    }

    let responseJson;
    // put 함수를 사용해 vercel blob storage에 파일 업로드
    try {
        const blob = await put(filename, request.body, {
            access: "public" // 공개 접근 가능하도록 설정
            // content-type은 브라우저 요청 헤더에서 자동 설정됨
        });

        responseJson = blob;
    }
    catch (error) {
        console.error("파일 업로드 중 오류 발생:", error);
        return NextResponse.json({ error: "파일 업로드 실패"}, { status: 500 });
    }

    return NextResponse.json(responseJson);
}