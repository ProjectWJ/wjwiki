// src/auth.config.ts

import type { NextAuthConfig } from "next-auth"; // NextAuth v5 타입 사용
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from '@/lib/db'; // 기존 prisma 임포트 유지
import bcrypt from 'bcryptjs';
import { sendLoginAlertEmail } from '@/lib/email'; // 🚨 (새로 생성한 파일)
import { parseUserAgent } from '@/lib/server-utils'; // 🚨 (User-Agent 파싱 함수)
import crypto from 'crypto'; // Node.js 기본 모듈 (토큰 생성을 위해)
import { cookies } from 'next/headers';
import { verifyTotpCode } from '@/lib/totp';
import { LoginSchema, OTPSchema } from '@/lib/validation-schemas'; // Zod 스키마 임포트

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
                totpCode: { label: "2FA 인증코드", type: "text", required: false },
                tempToken: { label: "임시 토큰", type: "text", required: false },
            },

            // 🚨 인증 함수 (핵심 로직)
            async authorize(credentials, req) {

                // 입력값 검증
                // 1차 인증에선 이메일, 비밀번호만
                if(!credentials.totpCode){
                    const validationResult = LoginSchema.safeParse({email: credentials.email, password: credentials.password});

                    if (!validationResult.success) {
                        // Zod 검증 실패 시, NextAuth는 null을 반환하면 자동으로 로그인 실패로 처리합니다.
                        // 오류 메시지를 던져 클라이언트에게 전달할 수도 있습니다.
                        const firstError = validationResult.error.issues[0].message;
                        console.error("Login validation failed:", firstError);
                        
                        // NextAuth는 여기서 Error를 throw하면 인증 실패 메시지로 클라이언트에게 전달합니다.
                        // throw new Error(firstError); // 사용자에게 구체적인 메시지를 보여주려면 활성화
                        return null; // NextAuth 표준: 인증 실패
                    }
                } else {
                // 2차 로그인에서는 otp 번호 검증 
                    const validationResult = OTPSchema.safeParse({otpCode: credentials.totpCode});
                    
                    if (!validationResult.success) {

                        const firstError = validationResult.error.issues[0].message;
                        console.error("Login validation failed:", firstError);

                        return null; 
                    }
                }


                const { email, password, totpCode, tempToken } = credentials;


                // **********************************
                // 🚨 2단계 로그인 (TOTP 코드 + 임시 토큰)
                // **********************************
                if (tempToken && totpCode) {
                    // 1. 임시 토큰으로 사용자 찾기 (DB 쿼리)
                    const user = await prisma.user.findFirst({
                        where: { 
                            temp2FaToken: tempToken as string,
                            tempTokenExpiresAt: {
                                gt: new Date() // 만료 시간이 현재 시간보다 큰지 확인 (토큰 유효성)
                            }
                        }
                    });

                    if (!user || !user.isTwoFactorEnabled || !user.twoFactorSecret) {
                        return null; // 사용자 없음, 2FA 비활성화, 또는 토큰 만료
                    }
                    
                    // 2. TOTP 코드 검증
                    const is2faValid = verifyTotpCode(user.twoFactorSecret, totpCode as string);

                    if (is2faValid) {
                        // 3. 🚨 최종 성공: DB에서 임시 토큰 삭제 후 사용자 객체 반환
                        await prisma.user.update({
                            where: { id: user.id },
                            data: { temp2FaToken: null, tempTokenExpiresAt: null },
                        });

                        // 🚨 추가: 이메일 전송을 위해 요청 헤더에서 IP와 User-Agent 정보를 추출합니다.
                        const ip = req?.headers.get('x-forwarded-for') || req?.headers.get('x-real-ip') || ''; 
                        const userAgent = req?.headers.get('user-agent') || '';

                        return {
                            id: user.id,
                            email: user.email,
                            name: user.name,
                            is2FaVerified: true, // 최종 인증 완료 플래그
                            ipAddress: ip,       
                            userAgent: userAgent 
                        };
                    }
                    return null; // TOTP 코드 불일치
                }

                // **********************************
                // 🚨 1단계 로그인 (Email + Password)
                // **********************************
                if (!email || !password) {
                    return null; // 이메일 또는 비밀번호 누락
                }

                // 1. DB에서 사용자 조회
                const user = await prisma.user.findUnique({
                    where: { email: email as string },
                });

                if (!user || !user.hashedPassword) {
                    return null; // 사용자가 없거나 비밀번호가 설정되지 않음
                }

                // 2. 비밀번호 검증 (DB의 해시된 비밀번호와 입력된 비밀번호 비교)
                const isValid = await bcrypt.compare(
                    password as string,
                    user.hashedPassword);

                if (!isValid) {
                    return null; // 비밀번호 불일치
                }

                // 4. 🚨 2FA 로직 분기 시작
                // 4-1. 2FA가 활성화된 경우
                if (user.isTwoFactorEnabled && user.twoFactorSecret) {
                    // 1. 🚨 임시 토큰 생성 (UUID 또는 강력한 난수)
                    const tempToken = crypto.randomBytes(32).toString('hex');
                    const expiryDate = new Date(Date.now() + 5 * 60 * 1000); // 5분 만료 설정

                    // 2. 🚨 DB에 토큰 저장 (Prisma 사용)
                    await prisma.user.update({
                        where: { id: user.id },
                        data: { 
                            temp2FaToken: tempToken,
                            tempTokenExpiresAt: expiryDate,
                        },
                    });

                    // B) 1단계: 비밀번호만 검증된 경우 (totpCode가 전달되지 않음)
                    if (!totpCode) {
                        // 3. 🚨 핵심: 임시 토큰을 HTTP-Only 쿠키로 설정하여 클라이언트에게 전달
                        (await
                            // 3. 🚨 핵심: 임시 토큰을 HTTP-Only 쿠키로 설정하여 클라이언트에게 전달
                            cookies()).set('2fa-temp-token', tempToken, {
                            httpOnly: true, // 🚨 JavaScript 접근 불가 (가장 중요)
                            secure: process.env.NODE_ENV === 'production', // HTTPS에서만 전송
                            maxAge: 5 * 60, // 5분
                            path: '/2fa-verify', // /2fa-verify 페이지에서만 쿠키 접근 가능
                            sameSite: 'lax',
                        });
                        // 🚨 throw 대신 임시 객체를 반환합니다. (이 객체가 signIn 콜백으로 전달됨)
                        return { 
                            id: user.id, 
                            email: user.email, 
                            is2FaRequired: true, // 🚨 이 플래그가 signIn 콜백으로 전달됨
                            name: user.name
                        };
                    } 
                }
                else {
                    console.log("2FA 비활성화됨");
                    return null;
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

    // 페이지 설정
    pages: {
        signIn: "/login",
    },

    // 🚨 1. 세션(Session) 설정: 쿠키 기반 세션 정책 정의
    session: {
        strategy: "jwt", // JWT 기반 세션 사용
        // 세션 만료 시간 (로그인 유지 기간)
        maxAge: 2 * 60 * 60, // 2시간

        // 사용자가 활동 중일 때 세션을 갱신하는 주기: 24시간 (초 단위)
        // 이 시간 내에 활동하면 maxAge가 리셋됩니다.
        updateAge: 1 * 60 * 60, // 1시간
    },

    // 🚨 2. JWT (JSON Web Token) 설정
    jwt: {
        // JWT의 만료 시간을 세션과 동일하게 설정합니다. (기본값은 session.maxAge와 동일)
        maxAge: 2 * 60 * 60, // 2시간
    },

    // 4. 콜백 설정: 세션에 사용자 ID 포함 (필수)
    callbacks: {
        // 🚨 2FA 중단 로직 및 로그인 알림 발송 분기
        async signIn({ user, account }) {

            // Credentials Provider를 통해서만 실행
            if (account?.provider === "credentials" && user) {

                // 🚨 핵심: 2FA 필요 플래그 확인
                if ((user as { is2FaRequired?: boolean }).is2FaRequired === true) { 
                    // 💡 세션 생성을 막는 대신, 리다이렉트 URL을 반환합니다.
                    // NextAuth는 signIn 콜백에서 문자열 URL이 반환되면 그곳으로 리다이렉트합니다.
                    // 리다이렉트 url 리턴
                    console.log("--- 1FA Success ---");

                    return `/2fa-verify`;
                }

                // 2. 🚨 최종 로그인 성공 시 (2FA 완료 또는 2FA 비활성화 사용자)
                if (user.email) {
                    // 이메일 알림 발송 로직은 최종 로그인 성공 시에만 실행됩니다.

                    // IP 및 User-Agent 정보를 포함한 타입 확장 (authorize에서 반환된 임시 필드)
                    const extendedUser = user as typeof user & { ipAddress?: string, userAgent?: string };
                    
                    const loginTime = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });
                    const userAgentString = extendedUser.userAgent || '';
                    
                    // User-Agent 파싱
                    const { os, browser } = parseUserAgent(userAgentString); 

                    const alertData = {
                        loginTime,
                        os: os || '알 수 없음',
                        browser: browser || '알 수 없음',
                        ip: extendedUser.ipAddress || '알 수 없음',
                    };

                    // 이메일 알림 발송 (비동기 처리)
                    try {
                        await sendLoginAlertEmail(extendedUser.email as string, alertData);
                    } catch (error) {
                        console.error("로그인 알림 이메일 발송 실패:", error);
                    }
                }
                console.log("--- 2FA Success --- ");
                console.log("--- Login Succeed --- ");
            }
            return true; // 로그인 계속 진행
        },
        async jwt({ token, user }) {
            // 1. 최초 로그인 시 사용자 ID 추가
            if (user) {
                token.id = user.id;
            }

            // 2. 🚨 추가 로직: 토큰 만료 시간 확인
            const now = Math.floor(Date.now() / 1000); // 현재 UNIX 시간 (초)
            
            // token.exp는 JWT 자체의 만료 시간입니다.
            if (token.exp && now >= token.exp) {
                console.log("JWT 토큰 만료");
                return null; // 세션을 만료된 것으로 처리하여 강제 로그아웃 유도
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