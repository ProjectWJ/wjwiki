// 개별 게시물 페이지
// 이 컴포넌트는 Server Component로 동작합니다.

import { getPostById } from '@/lib/post'; // DB 조회 함수 가정

interface PostPageProps {
  params: {
    id: string; // URL 매개변수는 항상 string
  };
}

// Next.js가 URL 경로에서 캡처한 'id' 값을 자동으로 props로 전달합니다.
export default async function PostPage({ params }: PostPageProps) {
  // 1. URL 매개변수를 숫자로 변환
  const postId: number = parseInt(params.id, 10); 
  
  // 2. 유효성 검사 (숫자로 변환되지 않았거나 0 이하라면 404 처리)
  if (isNaN(postId) || postId <= 0) {
    return <div>유효하지 않은 게시물 ID입니다.</div>; // 혹은 notFound() 호출
  }

  // 3. 변환된 숫자로 DB 조회
  const post = await getPostById(postId); 

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