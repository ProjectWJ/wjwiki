// src/auth.config.ts

import type { NextAuthConfig } from "next-auth"; // NextAuth v5 타입 사용
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from '@/lib/db'; // 기존 prisma 임포트 유지
import bcrypt from 'bcryptjs';

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
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

                // 3. 인증 성공: 사용자 객체 반환
                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
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