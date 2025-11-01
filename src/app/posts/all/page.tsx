// src/app/posts/all/page.tsx

// getPublishedPosts로 인해 posts는 동적인 값이 된다.
// Dynamic server usage: Route /posts/all couldn't be rendered statically because it used headers.
// 이 오류를 해결하기 위해 이 페이지는 동적으로 나오게 설정
export const dynamic = "force-dynamic";

import Footer from '@/components/Footer';
import LoginMenu from '@/components/loginMenu';
import { NavigationMenuDemo } from '@/components/NavigationMenu';
import { CustomPagination } from '@/components/Pagination.client';
import { PostDetailProgress } from '@/components/PostDetailProgress';
import { PostListPage } from '@/components/PostListPage';
import { SlideBanner } from '@/components/SlideBanner.client';
import { ThemeToggle } from '@/components/ThemeToggle';
import { getPostsByCategory, getPostCountByCategory } from '@/lib/post'; // 2번에서 작성한 DB 조회 함수

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

  // Fetch posts from database
  const posts = await getPostsByCategory(singleCategory || "all", currentPage)

  // Transform posts to include author information if needed
  const transformedPosts = posts?.map(post => ({
    ...post,
    author: {
      name: 'ProjectWJ', // Replace with actual author data from your DB
      avatarUrl: null, // Replace with actual avatar URL from your DB
    }
  }));

  // 총 게시물 수
  const totalCount = await getPostCountByCategory(singleCategory ? singleCategory : "all");
  
  // 총 페이지 수 계산
  const totalPages = Math.ceil(totalCount / 12);

  return (
    <>
        <PostDetailProgress />
        <div className="bg-card text-card-foreground sticky z-50 top-2 shadow-xl rounded-2xl flex justify-between items-center container mx-auto px-4 py-4">
          <NavigationMenuDemo />
          <ThemeToggle />
          <LoginMenu />
        </div>
      
      <main className="container mx-auto px-4 py-8 md:py-12">
        <SlideBanner />
        <PostListPage
          posts={transformedPosts}
          currentPage={currentPage}
          totalPages={totalPages}
        />
        <CustomPagination 
          currentPage={currentPage}
          totalPages={totalPages}
        />
              
        {/* Footer */}
        <Footer />
      </main>
    </>
  );
}