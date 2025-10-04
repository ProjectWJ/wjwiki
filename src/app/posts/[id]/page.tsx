// 개별 게시물 페이지
// 이 컴포넌트는 Server Component로 동작합니다.
import { getPostById } from '@/lib/post';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import type { Metadata, ResolvingMetadata } from "next"; 

// PostParams 타입 정의는 유지하되 컴포넌트 매개변수를 Next.js 표준 타입으로 변경
interface PostParams {
    id: string;
}

// Next.js가 컴포넌트에 전달하는 표준 타입을 따름
// searchParams를 명시적으로 undefined로 처리하여 타입 충돌을 방지
type PostDetailPageProps = {
    params: PostParams;
    searchParams?: { [key: string]: string | string[] | undefined }; // Next.js 표준
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {

    // 1. params에서 id 속성을 즉시 꺼내 사용합니다. (await 사용하지 않음)
    const { id } = params; 

    // 2. id를 number로 변환
    const postId = parseInt(id, 10); 
    
    // 3. 유효성 검사 (로직은 그대로 유지)
    if (isNaN(postId) || postId <= 0) {
        notFound();
    }
    
    // 4. id로 DB 조회 함수 호출
    const post = await getPostById(postId); 

    // 5. 게시물이 없으면 404 페이지로 리다이렉트
    if (!post) {
      notFound();
    }
    
    // 6. 렌더링 (나머지 코드는 동일)
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