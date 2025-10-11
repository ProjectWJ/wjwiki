// app/posts/[id]/edit/page.tsx
import { getPostById } from '@/lib/post'; // 2번에서 만든 DB 함수 임포트
import { notFound } from 'next/navigation';
import UpdateForm from '@/components/UpdateForm';

// 서버 컴포넌트: props로 URL 파라미터를 받습니다.
export default async function PostEditPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params; // ✅ 여기서 await로 resolve
    // 1. 게시글 데이터 가져오기
    const post = await getPostById(parseInt(id, 10));

    // 2. 데이터가 없으면 404 페이지 표시
    if (!post) {
        notFound();
    }
    
    // 3. 수정 폼 렌더링 (기존 데이터를 초기값으로 전달)
    return (
        <div className="container mx-auto mt-10">
            {/* 🚨 PostEditForm은 현재 Server Action을 호출해야 하므로, 
               'use client' 폼으로 분리하거나, Server Action을 직접 호출해야 합니다. */}
            <UpdateForm post={post} />
        </div>
    );
}

// 🚨 옵션: 메타데이터 설정
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const post = await getPostById(parseInt(id, 10));

    return {
        title: post ? `${post.title} 수정하기` : '게시글 수정',
    };
}