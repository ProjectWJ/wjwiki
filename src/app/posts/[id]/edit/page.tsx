// app/posts/[id]/edit/page.tsx
import { getPostById } from '@/lib/post';
import { notFound } from 'next/navigation';
import UpdateForm from '@/components/UpdateForm';

// 서버 컴포넌트: props로 URL 파라미터를 받습니다.
export default async function PostEditPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    // 1. 게시글 데이터 가져오기
    const post = await getPostById(parseInt(id, 10));

    // 2. 데이터가 없으면 404
    if (!post) {
        notFound();
    }
    
    // 3. 수정 폼 렌더링 (기존 데이터를 초기값으로 전달)
    return (
        <main className="container mx-auto p-6">
            <div className="mb-6">
            </div>
            <UpdateForm post={post} />
        </main>

    );
}

// 간단한 메타데이터 설정
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const post = await getPostById(parseInt(id, 10));

    return {
        title: post ? `${post.title} 수정하기` : '게시글 수정',
    };
}