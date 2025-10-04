// 새 글 작성 페이지
import { redirect } from 'next/navigation';
import { createPost } from '@/lib/post';

// 이 함수는 서버에서 실행될 서버 액션입니다.
// 폼의 'action' 속성과 연결되어 폼 데이터를 자동으로 받습니다.
async function handleCreatePost(formData: FormData) {
  'use server'; // 이 함수를 서버 액션으로 명시합니다.

  // FormData 객체에서 필드 값을 추출합니다.
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  const is_published = formData.get('is_published') === 'on' ? false : true; // 체크박스가 off일 때 true
  const summary = content.substring(0, 50); // 요약은 내용의 앞 50자로 자동 생성
  const thumbnail_url = "";
  
  let newPostId: number;

  // 필수 필드 검증
  if (!title || !content) {
    alert("제목 및 내용을 모두 입력해주세요.");
    return;
  }

  // 1단계에서 정의한 Prisma 함수 호출
  try {
    const newPost = await createPost({
      title,
      content,
      is_published,
      summary,
      thumbnail_url,
    });
    
    newPostId = newPost.id;
  } catch (error) {
    console.error("게시물 생성 중 오류 발생:", error);
    // 오류 발생 시 사용자에게 오류 알림 생성 또는 오류 페이지 리다이렉트
    return;
  }

  // 공개 게시물이면 거기로, 아니면 전체 게시물로 이동
  if(is_published === true){
    redirect(`/posts/${newPostId}`);
  }
  else {
    redirect('/posts/all');
  }
}

// 이 컴포넌트는 서버 컴포넌트로 유지됩니다.
export default function NewPostPage() {
  return (
    <main className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">새 게시물 작성</h1>
      
      {/* form의 action 속성에 서버 액션 함수를 바로 연결합니다. */}
      <form action={handleCreatePost} className="space-y-4">
        
        {/* 제목 */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">제목</label>
          <input type="text" id="title" name="title" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
        </div>

        {/* 공개 여부 */}
        <div>
          <label htmlFor="is_published" className="ml-2 block text-sm text-gray-900">비공개</label>
          <input type="checkbox" id="is_published" name="is_published" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
        </div>

        {/* 내용 */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">내용 (마크다운)</label>
          <textarea id="content" name="content" rows={10} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"></textarea>
        </div>
        
        {/* 등록 버튼 */}
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow hover:bg-blue-700">
          게시물 등록
        </button>
      </form>
    </main>
  );
}