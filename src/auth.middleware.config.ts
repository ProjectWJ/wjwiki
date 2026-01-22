// src/auth.middleware.config.ts (새로 생성)
// 미들웨어 1MB 넘으면 안된다고 해서 만든 파일

// 미들웨어는 DB 코드 없이 경로 설정만 필요함
import type { NextAuthConfig } from "next-auth";

export const middlewareAuthConfig: NextAuthConfig = {
  pages: {
    signIn: "/login",
  },
  providers: [],
};
