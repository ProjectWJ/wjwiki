// src/lib/post.ts
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { CATEGORIES } from "@/constants/categories";

interface GetPostsResultValue {
  posts: {
    id: number;
    title: string;
    category: string;
    created_at: Date;
    updated_at: Date;
    is_published: boolean;
    summary: string | null;
    thumbnail_url: string;
  }[];
  count: number;
}

// 페이지당 게시물 개수
const POSTS_PER_PAGE = 12;

/**
 * 카테고리 및 페이지 번호에 따라 게시물을 조회
 *
 * @param category - 게시물 카테고리 (e.g., "tech", "daily", "all")
 * @param page - 현재 페이지 번호 (1부터 시작)
 * @returns Prisma가 반환하는 게시물 객체 배열
 */
export async function getPostsByCategory(
  category: string,
  page: number,
): Promise<GetPostsResultValue | null> {
  // page 값이 1보다 작을 경우 1로 고정
  const actualPage = Math.max(1, page);

  // Prisma의 skip 옵션에서 사용할 오프셋 계산
  const skipAmount = (actualPage - 1) * POSTS_PER_PAGE;

  // 카테고리 유효성 검사 ('all' 허용)
  if (
    category !== "all" &&
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    !CATEGORIES.map((c) => c.value).includes(category as any)
  ) {
    throw new Error("Invalid category value");
  }

  try {
    // 현재 로그인 세션 정보 가져오기
    const session = await auth();

    /**
     * Prisma에서 사용할 where 조건 객체
     * - 로그인 여부와 category에 따라 필터 조건이 다르게 설정됨
     */
    const where: { category?: string; is_published?: boolean } = {};

    // 1. 로그인하지 않은 사용자에게는 공개 게시물만 보여줌
    if (!session || !session.user) {
      where.is_published = true;
    }

    // 2. category가 'all'이 아닐 때만 카테고리 필터 추가
    if (category !== "all") {
      where.category = category;
    }

    // Prisma로 게시물 목록 조회
    const [posts, count] = await Promise.all([
      prisma.post.findMany({
        where,
        select: {
          id: true,
          title: true,
          category: true,
          summary: true,
          thumbnail_url: true,
          created_at: true,
          updated_at: true,
          is_published: true,
        },
        orderBy: { created_at: "desc" }, // 최신순 정렬
        take: POSTS_PER_PAGE, // 페이지당 게시물 수 제한
        skip: skipAmount, // 페이지 오프셋
      }),
      prisma.post.count({ where }), // 게시물 전체 개수 카운트
    ]);

    return { posts, count };
  } catch (error) {
    console.error(`Failed to fetch posts by category: ${category}`, error);
    return null;
  }
}

/**
 * 입력받은 검색값에 따라 게시물을 조회
 *
 * @param query - 입력받은 검색값 (제목, 내용)
 * @param page - 현재 페이지 번호 (1부터 시작)
 * @returns Prisma가 반환하는 게시물 객체 배열
 */
export async function getPostsBySearch(
  query: string,
  page: number,
): Promise<GetPostsResultValue | null> {
  // page 값이 1보다 작을 경우 안전하게 1로 고정
  const actualPage = Math.max(1, page);

  // Prisma의 skip 옵션에서 사용할 오프셋 계산
  const skipAmount = (actualPage - 1) * POSTS_PER_PAGE;

  // 카테고리는 all로 고정
  const category = "all";

  try {
    // 현재 로그인 세션 정보 가져오기
    const session = await auth();

    /**
     * Prisma에서 사용할 where 조건 객체
     * - 로그인 여부와 category에 따라 필터 조건이 다르게 설정
     */
    const where: {
      category?: string;
      is_published?: boolean;
      OR?: (
        | { title: { contains: string } }
        | { content: { contains: string } }
      )[];
    } = {};

    if (query) {
      where.OR = [
        { title: { contains: query } },
        { content: { contains: query } },
      ];
    }

    // 1. 로그인하지 않은 사용자에게는 공개 게시물만 보여줌
    if (!session) {
      where.is_published = true;
    }

    // 2. category가 'all'이 아닐 때만 카테고리 필터 추가
    if (category !== "all") {
      where.category = category;
    }

    // Prisma로 게시물 목록 조회, 수 카운트
    const [posts, count] = await Promise.all([
      prisma.post.findMany({
        where,
        select: {
          id: true,
          title: true,
          category: true,
          summary: true,
          thumbnail_url: true,
          created_at: true,
          updated_at: true,
          is_published: true,
        },
        orderBy: { created_at: "desc" }, // 최신순 정렬
        take: POSTS_PER_PAGE, // 페이지당 게시물 수 제한
        skip: skipAmount, // 페이지 오프셋
      }),
      prisma.post.count({ where }), // 게시물 전체 개수 카운트
    ]);

    return { posts, count };
  } catch (error) {
    console.error(`Failed to fetch posts by search: ${category}`, error);
    return null;
  }
}

/**
 * 카테고리별 전체 게시물 개수를 반환하는 함수
 *
 * @param category - 게시물 카테고리 ("all" 포함)
 * @returns 해당 카테고리에 속한 게시물 개수 (number)
 */
/* export async function getPostCountByCategory(category: string) {
  const session = await auth();

  // 게시물 개수 조회에도 같은 where 로직 사용
  const where: { category?: string; is_published?: boolean } = {};

  // 로그인하지 않은 경우 → 공개 게시물만 카운트
  if (!session) {
    where.is_published = true;
  }

  // 특정 카테고리 지정 시 → 해당 카테고리만 카운트
  if (category !== "all") {
    where.category = category;
  }

  try {
    // Prisma로 조건에 맞는 게시물 개수를 세어 반환
    const count = await prisma.post.count({ where });
    return count;
  } catch (error) {
    console.error(`Failed to count posts by category: ${category}`, error);
    return 0;
  }
} */

// [id]에서 사용하는 id를 이용해 개별 게시물을 조회하는 함수 (동적 라우팅용)
export async function getPostById(id: number) {
  try {
    // 로그인 세션 확인
    const session = await auth();

    // 로그인 상태면 전체 글, 비로그인 상태면 공개 글만
    const where = session ? { id: id } : { id: id, is_published: true };

    // 개별 게시물 조회
    const post = await prisma.post.findUnique({
      where,
    });

    if (post) {
      return {
        ...post,
        id: String(post.id),
      };
    }

    return null;
  } catch (error) {
    console.error("Failed to fetch post by id:", error);
    throw new Error("게시글 불러오기 실패");
  }
}

// new에서 사용하는 새 게시물 생성 함수
// 게시물 생성 시 필요한 데이터 타입 인터페이스
interface PostCreateData {
  title: string;
  category: string;
  content: string;
  is_published: boolean; // 기본값은 true(공개)
  summary: string;
  thumbnail_url?: string; // 선택적 필드
}

// 새 게시물을 생성하고 DB에 저장
// @param data 제목, 요약, 내용 등을 포함한 게시물 데이터
// @returns 생성된 게시물 객체
export async function createPost(data: PostCreateData) {
  const { title, category, content, is_published, summary, thumbnail_url } =
    data;

  // thubnail_url이 제공되지 않으면 null 또는 undefined로 처리해서 pirsma 스키마와 맞춤
  const finalThumbnailUrl = thumbnail_url?.trim() || undefined;

  return prisma.post.create({
    data: {
      title,
      category,
      content,
      is_published,
      summary,
      thumbnail_url: finalThumbnailUrl,
      // create_at 등은 DB 설정에 따라 자동 생성
      // 수동 설정이 필요하면 여기에 작성
      created_at: new Date(),
    },
  });
}
