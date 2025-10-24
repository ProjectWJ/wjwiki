// src/app/posts/all/page.tsx

// getPublishedPosts로 인해 posts는 동적인 값이 된다.
// Dynamic server usage: Route /posts/all couldn't be rendered statically because it used headers.
// 이 오류를 해결하기 위해 이 페이지는 동적으로 나오게 설정
export const dynamic = "force-dynamic";

import LoginMenu from '@/components/loginMenu';
import { NavigationMenuDemo } from '@/components/NavigationMenu';
import { getPublishedPosts, getPostsByCategory } from '@/lib/post'; // 2번에서 작성한 DB 조회 함수
import Image from 'next/image';

interface HomePageProps {
  // searchParams 객체 자체는 항상 존재하므로 '?'(optional)를 제거합니다.
  // category는 문자열(string), 문자열 배열(string[]), 또는 없을(undefined) 수 있습니다.
  searchParams: Promise<{
    category?: string | string[] | undefined;
  }>;
// 표준:
/*   searchParams: {
    category?: string | string[] | undefined;
  } */
}
// 아니 Promise를 쓰지도 않는데 왜 넣어줘야 동적라우팅 오류가 해결되는거야??
// 원인 좀 찾아보기

// async 키워드를 사용하면 이 컴포넌트는 Server Component로 동작함
export default async function HomePage({ searchParams }: HomePageProps) {
  const category = (await searchParams).category; // /posts/all?category=devlog → "devlog"
  // 표준: const category = searchParams.category;
  const singleCategory = Array.isArray(category) ? category[0] : category;

  // 1. DB 조회 함수 호출
  const posts = singleCategory
    ? await getPostsByCategory(singleCategory)
    : await getPublishedPosts();
    
  // 2. 데이터가 없는 경우
  if (!posts || posts.length === 0) {
    return (
      <main className="container mx-auto p-4">
        <h1 className="text-3xl font-bold">블로그</h1>
        <p className="mt-4 text-gray-500">아직 작성된 게시물이 없습니다.</p>
      </main>
    );
  }

  // Post 타입 정의 (DB 스키마에 맞게 조정)
  interface Post {
      id: number;
      title: string;
      category: string;
      summary?: string | null;
      created_at: string | number | Date;
      thumbnail_url?: string;
      is_published: boolean
  }

  // 3. 게시물 목록 렌더링
  return (
    <>
      <main className="container mx-auto p-4">
        <div className='flex m-auto'>
          <NavigationMenuDemo />
          <LoginMenu />
        </div>
        <h1 className="text-3xl font-bold mb-8">최신 게시물</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">


          {posts.map((post: Post) => (
              <div key={post.id} className="border p-4 rounded-lg shadow-md">
                  {post.thumbnail_url && post.thumbnail_url.startsWith("https://hyamwcz838h4ikyf.public.blob.vercel-storage.com/") ? (
                    <Image
                      src={`${post.thumbnail_url}?w=800&q=25`}
                      alt={post.title}
                      width={250}
                      height={250}
                      className="w-full h-40 object-cover rounded-md mb-4"
                      style={{ objectFit: 'cover' }}
                      priority
                    />
                  ) : 
                    <Image
                      src={`${post.thumbnail_url}?w=800&q=25`}
                      alt={post.title}
                      width={250}
                      height={250}
                      className="w-full h-40 object-cover rounded-md mb-4"
                      style={{ objectFit: 'cover' }}
                    />}

                  {/* 동적 URL id 사용 */}
                  <a href={`/posts/${post.id}`} className="text-xl font-semibold hover:underline">
                      {post.title}
                      {!post.is_published && (
                        <span className="ml-2 text-sm text-gray-500">(비공개 상태)</span>
                      )}
                  </a>
                  <p className="text-gray-600 mt-2">{post.summary}</p>
                  <p className="text-sm text-gray-400 mt-4">
                      작성일: {new Date(post.created_at).toLocaleDateString('ko-KR')}
                  </p>
              </div>
          ))}
        </div>
      </main>
    </>

  );
}