export const dynamic = "force-dynamic";

import Footer from "@/components/Footer";
import { NaviEventListener } from "@/components/Header.event";
import LoginMenu from "@/components/loginMenu";
import { CustomPagination } from "@/components/Pagination.client";
import { PostDetailProgress } from "@/components/PostDetailProgress";
import { PostSearchListPage } from "@/components/PostSearchListPage";
import { SearchDialog } from "@/components/ui/alert-dialog";
import { getPostsBySearch } from "@/lib/post"; // 2번에서 작성한 DB 조회 함수
import { SearchSchema } from "@/lib/validation-schemas";

interface SearchPageProps {
  searchParams: Promise<{
    q: string;
    page?: string | undefined;
  }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const queryParse = SearchSchema.safeParse({ q: params.q });
  const page = params.page ? parseInt(params.page, 10) : 1;

  const currentPage = page ? page : 1;

  if (!queryParse.success || !queryParse.data.q) {
    console.error("queryParse fail");
    return;
  }

  const results = await getPostsBySearch(queryParse.data.q, currentPage);

  if (!results) {
    console.error("query fail");
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
          <SearchDialog />
          <PostSearchListPage
            posts={transformedPosts}
            currentPage={currentPage}
            totalPosts={results.count}
            totalPages={totalPages}
            category={"all"}
          />
          <CustomPagination currentPage={currentPage} totalPages={totalPages} />

          {/* Footer */}
          <Footer />
        </main>
      </NaviEventListener>
    </>
  );
}
