import { PrismaClient } from "@prisma/client";

// PrismaClient 인스턴스가 여러 번 생성되는 것을 방지하기 위한 전역 설정
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// 데이터베이스 연결 URL은 .env.local 및 Vercel 환경 변수에서 가져옴
// 전역적으로 prisma 인스턴스를 사용하거나 없으면 새로 생성
const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

// 개발 환경이 아니면 전역 객체에 저장
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export { prisma };
