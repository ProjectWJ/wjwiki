// src/auth.ts

// =================================================================
// 🚨 NextAuth.js 타입 확장 (Session, User, JWT에 id 속성 추가)
// v5 (beta)에서는 DefaultSession, DefaultUser 타입이 next-auth의 하위 모듈에 위치하거나
// @auth/core/types에서 가져와야 합니다. 
// 현재 설치된 next-auth@beta 버전의 경로를 따릅니다.
// =================================================================
/* import "next-auth"; 
// 🚨 수정: next-auth/core/types에서 가져오거나, 
//         next-auth가 재익스포트하는 경로를 사용합니다.
//         다음 경로가 v5의 표준입니다.
import type { Session as DefaultSession, User as DefaultUser } from "@auth/core/types"; 
import type { JWT } from "next-auth/jwt"; // 이 경로는 v5에서도 유지될 가능성이 높습니다.


declare module "next-auth" {
    interface Session {
        user: {
            id: string; // 🚨 session.user에 id 추가
        } & DefaultSession["user"];
    }
    interface User extends DefaultUser {
        id: string; // 🚨 User 타입에도 id 추가
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string; // 🚨 JWT 토큰에 id 추가
    }
}
// =================================================================
// 🚨 타입 확장 끝
// ================================================================= */


import NextAuth from "next-auth"; // NextAuth v5 (beta) 임포트
import { authConfig } from "./auth.config"; // 🚨 authConfig 임포트

// 🚨 v5의 NextAuth(config)를 호출하고, 구조 분해하여 익스포트합니다.
//    이 방식으로 인해 'signIn is not a function' 오류가 해결될 것입니다.
export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

// 🚨 API Route Handler를 위해 handlers를 기본 익스포트합니다.
export default handlers;