// src/middleware.ts
import NextAuth from "next-auth";
import { middlewareAuthConfig } from './auth.middleware.config'; // 미들웨어 전용 설정
import { NextResponse } from 'next/server';

const { auth } = NextAuth(middlewareAuthConfig);

// NextAuth의 auth 함수를 미들웨어로 사용합니다.
export default auth((req) => {
    // req.auth에 인증된 세션 정보가 포함
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth; // req.auth 객체의 존재 여부로 로그인 상태 확인

    // 보호할 경로 정의
    const isProtectedPath = 
        nextUrl.pathname.startsWith('/posts/new') || 
        nextUrl.pathname.match(/\/posts\/\d+\/edit$/) ||
        nextUrl.pathname.startsWith('/api/upload');

    // 1. 보호된 경로에 미인증 사용자가 접근 시
    if (isProtectedPath && !isLoggedIn) {
        // 로그인 페이지로 리다이렉트
        const redirectUrl = new URL('/login', nextUrl.origin);
        // 'callbackUrl' 파라미터를 추가
        redirectUrl.searchParams.set('callbackUrl', nextUrl.pathname);
        
        // NextResponse.redirect 대신 표준 Response.redirect 사용
        return Response.redirect(redirectUrl);
    }

    // 2. 그 외 모든 접근 통과
    return NextResponse.next();
});

// 미들웨어를 실행할 경로 설정
export const config = {
    matcher: [
        '/posts/new',
        '/posts/((?!new).*)?/edit', // /posts/[id]/edit 패턴
        '/api/upload/:path*',       // 파일 업로드 API 보호
        '/login' // 로그인 페이지 자체도 보호할 수 있지만, 위 로직에서 처리됨
    ],
};