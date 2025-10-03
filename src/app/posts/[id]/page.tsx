// 개별 게시물 페이지
// 이 컴포넌트는 Server Component로 동작합니다.

import { getPostById } from '@/lib/post'; // DB 조회 함수 가정

// Next.js가 URL 경로에서 캡처한 'id' 값을 자동으로 props로 전달합니다.
export default async function PostPage({ params }: { params: { id: string } }) {
  const post = await getPostById(params.id); // DB에서 해당 id 가진 게시물 조회

  if (!post) {
    return <div>게시물을 찾을 수 없습니다.</div>;
  }

  // 게시물 내용을 렌더링
  return (
    <article>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
}