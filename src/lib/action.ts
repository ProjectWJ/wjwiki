// Server Actions 함수들 모아두는 곳
'use server'; // 이 함수를 서버 액션으로 명시합니다.

import { redirect } from 'next/navigation';
import { createPost } from '@/lib/post';

// 게시물 생성 폼 제출을 처리하는 서버 액션
// @param formData 폼 데이터를 포함하는 객체
export async function handleCreatePost(formData: FormData) {

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