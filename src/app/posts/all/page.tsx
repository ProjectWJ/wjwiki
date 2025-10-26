// src/app/posts/all/page.tsx
export const dynamic = "force-dynamic";

import { PostListPage } from '@/components/PostListPage';
import LoginMenu from '@/components/loginMenu';
import { NavigationMenuDemo } from '@/components/NavigationMenu';
import { getPublishedPosts, getPostsByCategory } from '@/lib/post';

interface HomePageProps {
  searchParams: Promise<{
    category?: string | string[] | undefined;
    page?: string | undefined;
  }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const category = params.category;
  const page = params.page;
  
  const singleCategory = Array.isArray(category) ? category[0] : category;
  const currentPage = page ? parseInt(page, 10) : 1;

  // Fetch posts from database
  const posts = singleCategory
    ? await getPostsByCategory(singleCategory)
    : await getPublishedPosts();

  // Transform posts to include author information if needed
  const transformedPosts = posts?.map(post => ({
    ...post,
    author: {
      name: 'WJwiki', // Replace with actual author data from your DB
      avatarUrl: null, // Replace with actual avatar URL from your DB
    }
  }));

  return (
    <>
      <div className="flex justify-between items-center container mx-auto px-4 py-6">
        <NavigationMenuDemo />
        <LoginMenu />
      </div>
      
      <main className="container mx-auto px-4 py-8 md:py-12">
        <PostListPage
          posts={transformedPosts}
          currentPage={currentPage}
          totalPages={Math.ceil((posts?.length || 0) / 9)}
        />
      </main>
    </>
  );
}
