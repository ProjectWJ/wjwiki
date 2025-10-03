// src/lib/post.ts

import { prisma } from './db';

// 게시물 목록을 조회하는 함수
export async function getPublishedPosts() {
  // 이 함수는 Server Component나 Server Action에서만 호출됩니다.

  try {
    // published(공개) 상태인 글들을 최신 순으로 정렬하여 조회
    const posts = await prisma.post.findMany({
      where: {
        is_published: true,
      },
      select: { // 필요한 필드만 선택하여 네트워크 오버헤드 최소화
        id: true,
        title: true,
        summary: true,
        thumbnail_url: true,
        created_at: true,
      },
      orderBy: {
        created_at: 'desc', // 최신순 정렬
      },
    });
    
    // DB에서 조회한 데이터를 반환
    return posts;
    
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    // 에러 발생 시 빈 배열 반환 또는 에러 처리
    return []; 
  }
}

// id를 이용해 개별 게시물을 조회하는 함수 (동적 라우팅용)
export async function getPostById(id: number) {
  try {
    const post = await prisma.post.findUnique({
      where: {
        id: id,
      },
    });
    return post;
  } catch (error) {
    console.error('Failed to fetch post by id:', error);
    return null;
  }
}