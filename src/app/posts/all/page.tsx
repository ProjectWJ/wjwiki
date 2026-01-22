// src/app/posts/all/page.tsx

// getPublishedPosts로 인해 posts는 동적인 값이 된다.
// Dynamic server usage: Route /posts/all couldn't be rendered statically because it used headers.
// 이 오류를 해결하기 위해 이 페이지는 동적으로 나오게 설정
export const dynamic = "force-dynamic";

import Footer from "@/components/Footer";
import { NaviEventListener } from "@/components/Header.event";
import LoginMenu from "@/components/loginMenu";
import { CustomPagination } from "@/components/Pagination.client";
import { PostDetailProgress } from "@/components/PostDetailProgress";
import { PostListPage } from "@/components/PostListPage";
import { SlideBanner } from "@/components/SlideBanner.client";
import { SearchDialog } from "@/components/ui/alert-dialog";
import { getPostsByCategory } from "@/lib/post"; // 2번에서 작성한 DB 조회 함수

interface HomePageProps {
  searchParams: Promise<{
    category?: string | string[] | undefined;
    page?: string | undefined;
  }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const category = params.category;
  const page = params.page ? parseInt(params.page, 10) : 1;

  const singleCategory = Array.isArray(category) ? category[0] : category;
  const currentPage = page ? page : 1;

  const results = await getPostsByCategory(
    singleCategory || "all",
    currentPage,
  );

  if (!results) {
    console.error("category search fail");
    return;
  }

  const transformedPosts = results.posts.map((post) => ({
    ...post,
    author: {
      name: "ProjectWJ",
      avatarUrl: null,
    },
  }));

  // 총 페이지 수 계산
  const totalPages = Math.ceil(results.count / 12);

  return (
    <>
      <PostDetailProgress />
      <NaviEventListener loginMenu={<LoginMenu />}>
        <main className="container mx-auto px-4 py-8 md:py-12">
          <SlideBanner />
          <SearchDialog />
          <PostListPage
            posts={transformedPosts}
            currentPage={currentPage}
            totalPosts={results.count}
            totalPages={totalPages}
            category={category}
          />
          <CustomPagination currentPage={currentPage} totalPages={totalPages} />

          {/* Footer */}
          <Footer />
        </main>
      </NaviEventListener>
    </>
  );
}
