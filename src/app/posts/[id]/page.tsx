// 개별 게시물 페이지
// 이 컴포넌트는 Server Component로 동작합니다.
import { getPostById } from '@/lib/post';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown'; 

// Type error: Type '{ params: { id: string; }; }' does not satisfy the constraint 'PageProps'.
// 이 에러 해결하려면 이렇게 Promise로 감싸야 한다.
type PageParams = Promise<{ id: string }>;

// 컴포넌트 매개변수에 정의된 타입을 적용합니다.
export default async function PostDetailPage({ params } : { params: PageParams }) {
    // 1. URL에서 id 추출
    const { id } = await params;

    // 2. id를 number로 변환
    const postId = parseInt(id, 10); 
    
    // 3. 유효성 검사
    if (isNaN(postId) || postId <= 0) {
        notFound();
    }
    
    // 4. id로 DB 조회 함수 호출
    const post = await getPostById(postId); 

    // 5. 게시물이 없으면 404 처리
    if (!post) {
      notFound();
    }
    
    // 6. 렌더링
    return (
        <main className="container mx-auto p-6">
            <article>
                <h1 className="text-4xl font-extrabold mb-4">{post.title}</h1>
                <p className="text-gray-500 mb-8">
                    작성일: {new Date(post.created_at).toLocaleDateString('ko-KR')}
                </p>
                <hr className="mb-8" />
                <div className="prose max-w-none">
                    <ReactMarkdown>{post.content}</ReactMarkdown>
                </div>
            </article>
        </main>
    );
}