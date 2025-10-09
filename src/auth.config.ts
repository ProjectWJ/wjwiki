// src/auth.config.ts

import type { NextAuthConfig } from "next-auth"; // NextAuth v5 타입 사용
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from '@/lib/db'; // 기존 prisma 임포트 유지
import bcrypt from 'bcryptjs';
import { sendLoginAlertEmail } from '@/lib/email'; // 🚨 (새로 생성한 파일)
import { parseUserAgent } from '@/lib/utils'; // 🚨 (User-Agent 파싱 함수)

// 🚨 로그인 검증 로직을 포함한 NextAuth 설정 (authOptions 대신 authConfig 사용)
export const authConfig: NextAuthConfig = {
    // 🚨 v5에서는 JWT 세션이 기본이므로 session: { strategy: "jwt" }는 제거합니다.

    providers: [
        CredentialsProvider({
            // 로그인 폼에 표시될 이름
            name: "Email and Password",

            // 로그인 폼 필드 정의
            credentials: {
                email: { label: "이메일", type: "email" },
                password: { label: "비밀번호", type: "password" },
            },

            // 🚨 인증 함수 (핵심 로직)
            async authorize(credentials, req) {
                if (!credentials?.email || !credentials?.password) {
                    return null; // 이메일 또는 비밀번호 누락
                }

                // 1. DB에서 사용자 조회
                const user = await prisma.user.findUnique({
                    where: { email: credentials.email as string },
                });

                if (!user || !user.hashedPassword) {
                    return null; // 사용자가 없거나 비밀번호가 설정되지 않음
                }

                // 2. 비밀번호 검증 (DB의 해시된 비밀번호와 입력된 비밀번호 비교)
                const isValid = await bcrypt.compare(
                    credentials.password as string,
                    user.hashedPassword);

                if (!isValid) {
                    return null; // 비밀번호 불일치
                }

                // 🚨 추가: 이메일 전송을 위해 요청 헤더에서 IP와 User-Agent 정보를 추출합니다.
                const ip = req?.headers.get('x-forwarded-for') || req?.headers.get('x-real-ip') || ''; 
                const userAgent = req?.headers.get('user-agent') || '';

                // 3. 인증 성공: 사용자 객체 반환 시 임시 필드 추가
                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    // 🚨 signIn 콜백으로 전달하기 위한 임시 필드
                    ipAddress: ip,       
                    userAgent: userAgent 
                };
            },
        }),
    ],

    // 3. 페이지 설정
    pages: {
        signIn: "/login",
    },

    // 4. 콜백 설정: 세션에 사용자 ID 포함 (필수)
    callbacks: {
        // 🚨 로그인 성공 시 실행될 signIn 콜백을 추가합니다.
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        async signIn({ user, account, profile }) {
            // Credentials Provider를 통해서만 실행
            if (account?.provider === "credentials" && user.email) {
                
                // 1. 필요한 정보 추출 (authorize에서 넘겨받은 임시 필드를 사용)
                // TypeScript 오류를 피하기 위해 user 객체에 임시 필드 타입 단언 (Type Assertion)
                const extendedUser = user as typeof user & { ipAddress?: string, userAgent?: string };
                
                const loginTime = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });
                const userAgentString = extendedUser.userAgent || '';
                
                // 2. User-Agent 파싱
                const { os, browser } = parseUserAgent(userAgentString); 

                const alertData = {
                    loginTime,
                    os: os || '알 수 없음',
                    browser: browser || '알 수 없음',
                    ip: extendedUser.ipAddress || '알 수 없음',
                };

                // 3. 🚨 이메일 알림 발송 (비동기 처리)
                // 알림 실패가 로그인 실패로 이어지지 않도록 반드시 try-catch로 감쌉니다.
                try {
                    await sendLoginAlertEmail(extendedUser.email as string, alertData);
                } catch (error) {
                    console.error("로그인 알림 이메일 발송 실패:", error);
                }

                // 4. (선택적) DB에 최종 로그인 정보 업데이트
                // ... (여기에 DB 업데이트 로직 추가 가능)
            }
            
            return true; // 로그인 계속 진행
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
            }
            return session;
        },
    },
};