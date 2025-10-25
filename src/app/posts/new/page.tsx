// 새 글 작성 페이지
import PostForm from '@/components/PostForm';

// 이 컴포넌트는 클라이언트 컴포넌트로 유지됩니다.
export default function NewPostPage() {
  return (
    <main className="container mx-auto p-6">
      <div className="mb-6"></div>

      {/* 클라이언트 폼 컴포넌트 렌더링 */}
      <PostForm />
    </main>
  );
}