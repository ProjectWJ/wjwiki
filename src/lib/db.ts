/* 
  Neon DB 데이터를 Next.js에서 불러오는 코드
  prisma 활용

  1. DB 연결 초기화(이곳)
  2. 데이터 조회 함수(lib/post.ts)
  3. 페이지(서버) 컴포넌트에서 데이터 표시(page.tsx)
*/

import { PrismaClient } from '@prisma/client'; // 일반 환경용 Prisma
// import { Pool } from '@neondatabase/serverless'; // Neon Serverless 드라이버 (필요시)

// Neon B 연결을 위한 싱글톤 객체(단일 인스턴스) 생성

// PrismaClient 인스턴스가 여러 번 생성되는 것을 방지하기 위한 전역 설정
declare global {
  var prisma: PrismaClient | undefined;
}

// 데이터베이스 연결 URL은 .env.local 및 Vercel 환경 변수에서 가져옴
const prisma = global.prisma || new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

export { prisma };