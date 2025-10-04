// 개별 게시물 페이지
// 이 컴포넌트는 Server Component로 동작합니다.
import { getPostById } from '@/lib/post';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown'; 
import type { Metadata } from 'next';

// Type error: Type '{ params: { id: string; }; }' does not satisfy the constraint 'PageProps'.
// 이 에러 해결하려면 이렇게 Promise로 감싸야 한다.
type PageParams = Promise<{ id: string }>;

// 메타데이터 설정
export async function generateMetadata(
    { params }: { params: PageParams }
): Promise<Metadata> {
    
    // 1. 파라미터에서 ID 추출 및 유효성 검사 (page 컴포넌트와 동일)
    const { id } = await params;
    const postId = parseInt(id, 10);
    
    if (isNaN(postId) || postId <= 0) {
        // 유효하지 않은 ID라도 메타데이터를 반환해야 하므로, 기본값을 반환합니다.
        return {
            title: 'WJwiki - 게시물 없음',
            description: '요청한 게시물을 찾을 수 없습니다.',
        };
    }

    // 2. DB에서 게시물 정보 조회
    const post = await getPostById(postId);

    // 3. 메타데이터 반환
    if (!post) {
        return {
            title: 'WJwiki - 게시물 없음',
            description: '요청한 게시물을 찾을 수 없습니다.',
        };
    }

    return {
        // 게시물 제목을 사용하여 페이지 <title> 설정
        title: "WJwiki - " + post.title,
        
        // 게시물의 summary 또는 내용 일부를 사용하여 페이지 <meta name="description"> 설정
        description: post.summary || post.content?.substring(0, 150) || '블로그 게시물입니다.',
        
        // (선택 사항) Open Graph (SNS 공유 시 사용) 설정
        openGraph: {
            title: post.title,
            description: post.summary || '블로그 게시물입니다.',
            // images: post.thumbnail_url ? [post.thumbnail_url] : [],
        },
    };
}

// 상세 페이지 컴포넌트
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