// src/lib/post.ts
import { auth } from '@/auth';
import { prisma } from '@/lib/db';

// 카테고리 나누기
export const CATEGORIES = [
  { label: "Dev Log", value: "devlog" },
  { label: "Tech Note", value: "technote" },
  { label: "Project", value: "project" },
  { label: "Insight", value: "insight" },
  { label: "Snippet", value: "snippet" },
  { label: "Diary", value: "diary" },
] as const;

export type CategoryValue = (typeof CATEGORIES)[number]["value"];


// all에서 사용하는 게시물 목록을 조회하는 함수
export async function getPublishedPosts() {
  try {
    // 로그인 세션 확인
    const session = await auth();

    // 로그인 상태면 전체 글, 비로그인 상태면 공개 글만
    const where = session ? {} : { is_published: true };

    // 게시물 조회
    const posts = await prisma.post.findMany({
      where,
      select: {
        id: true,
        title: true,
        category: true,
        summary: true,
        thumbnail_url: true,
        created_at: true,
        is_published: true
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    return posts;
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    return [];
  }
}


// [id]에서 사용하는 id를 이용해 개별 게시물을 조회하는 함수 (동적 라우팅용)
export async function getPostById(id: number) {
  try {
    // 로그인 세션 확인
    const session = await auth();

    // 로그인 상태면 전체 글, 비로그인 상태면 공개 글만
    const where = session ? { id: id } : { id: id, is_published: true };

    // 개별 게시물 조회
    const post = await prisma.post.findUnique({
      where
    });

    if(post) {
      return {
        ...post,
        id: String(post.id),
      }
    }

    return null;
  } catch (error) {
    console.error('Failed to fetch post by id:', error);
    throw new Error('게시글 불러오기 실패');
  }
}


// 카테고리별 게시물 조회 함수
export async function getPostsByCategory(category: string) {

  // string으로 한번 걸러졌으니 이후 검증
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!CATEGORIES.map(c => c.value).includes(category as any)) {
    throw new Error("Invalid category value");
  }

  try {
    const session = await auth();
    const where = session
      ? { category }
      : { category, is_published: true };

    const posts = await prisma.post.findMany({
      where,
      select: {
        id: true,
        title: true,
        category: true,
        summary: true,
        thumbnail_url: true,
        created_at: true,
        is_published: true,
      },
      orderBy: { created_at: 'desc' },
    });

    return posts;
  } catch (error) {
    console.error(`Failed to fetch posts by category: ${category}`, error);
    return [];
  }
}


// new에서 사용하는 새 게시물 생성 함수
// 게시물 생성 시 필요한 데이터 타입 인터페이스
interface PostCreateData {
  title: string;
  content: string;
  is_published: boolean; // 기본값은 true(공개)
  summary: string;
  thumbnail_url?: string; // 선택적 필드
}

// 새 게시물을 생성하고 DB에 저장
// @param data 제목, 요약, 내용 등을 포함한 게시물 데이터
// @returns 생성된 게시물 객체
export async function createPost(data: PostCreateData) {  
  const { title, content, is_published, summary, thumbnail_url } = data;

  // thubnail_url이 제공되지 않으면 null 또는 undefined로 처리해서 pirsma 스키마와 맞춤
  const finalThumbnailUrl = thumbnail_url?.trim() || undefined;

  return prisma.post.create({
    data: {
      title,
      content,
      is_published,
      summary,
      thumbnail_url: finalThumbnailUrl,
      // create_at 등은 DB 설정에 따라 자동 생성
      // 수동 설정이 필요하면 여기에 작성
      created_at: new Date(),
    }
  });
}