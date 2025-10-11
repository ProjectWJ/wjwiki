// components/DeleteButton.tsx

'use client';
import { deletePost } from '@/lib/action'; 
import { useFormStatus } from 'react-dom';

interface DeleteButtonProps {
    postId: number; // 삭제할 게시글의 ID
}

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className="px-3 py-1 bg-red-600 text-white text-sm font-semibold rounded-md shadow hover:bg-red-700 disabled:opacity-50 transition duration-150"
        >
            {pending ? '삭제 중...' : '게시글 삭제'}
        </button>
    );
}

export default function DeleteButton({ postId }: DeleteButtonProps) {
    // 1. Server Action 바인딩 (postId를 첫 번째 인자로 고정)
    const handleDelete = deletePost.bind(null, postId.toString());

    return (
        <form 
            action={handleDelete}
            // 🚨 핵심: onSubmit 이벤트 핸들러 추가
            onSubmit={(e) => {
                // 사용자에게 삭제 확인 요청
                const confirmed = confirm('정말로 이 게시글을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.');
                
                // 사용자가 '취소'를 누른 경우
                if (!confirmed) {
                    e.preventDefault(); // 폼 제출(Server Action 호출)을 중단시킵니다.
                }
            }}
        >
            <SubmitButton />
        </form>
    );
}