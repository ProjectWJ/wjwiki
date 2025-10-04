// 개별 게시물 페이지
// 이 컴포넌트는 Server Component로 동작합니다.
// import { getPostById } from '@/lib/post';
// import { notFound } from 'next/navigation';

export default async function PostDetailPage(){
    
/*     // 1. 문자열 id를 숫자로 변환합니다. (DB 타입에 맞춤)
    const postId = parseInt(params.id, 10); 
    
    // 2. 유효하지 않은 값이면 즉시 404 처리
    if (isNaN(postId) || postId <= 0) {
        notFound();
    }
    
    // 3. 숫자로 변환된 id로 DB 조회 함수 호출
    //    (getPostById 함수도 number 타입을 받도록 수정되어야 합니다.)
    const post = await getPostById(postId); 

    // 4. 게시물이 없으면 404 페이지로 리다이렉트
    if (!post) {
      notFound();
    } */
    
    // 5. 게시물이 있으면 상세 페이지 렌더링
    return (
        <div>
{/*             <h1>{post.title}</h1>
            <p>{post.content}</p> */}
        </div>
    );
}

// 📌 lib/post.ts의 getPostById 함수 시그니처도 number를 받도록 수정해야 합니다.
// export async function getPostById(postId: number) { ... }