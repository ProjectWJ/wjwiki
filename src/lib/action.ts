// Server Actions 함수들 모아두는 곳
'use server'; // 이 함수를 서버 액션으로 명시합니다.

import { redirect } from 'next/navigation';
import { createPost } from '@/lib/post';
import { del, copy } from '@vercel/blob';
import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache'; // 데이터 갱신을 위해 필요
import { extractFirstMediaUrl, generateThumbnailUrl, generateUUID, getFileExtension, howManyMedia } from '@/lib/utils' // 썸네일 생성

// 게시물 생성 폼 제출을 처리하는 서버 액션
// @param formData 폼 데이터를 포함하는 객체
export async function handleCreatePost(formData: FormData) {

  // FormData 객체에서 필드 값을 추출합니다.
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  const is_published = formData.get('is_published') === 'on' ? false : true; // 체크박스가 off일 때 true
  const summary = content.substring(0, 50); // 요약은 내용의 앞 50자로 자동 생성
  const firstMedia = extractFirstMediaUrl(content); // 첫 번째 미디어
  let thumbnail_url;

  if(firstMedia) {
    thumbnail_url = generateThumbnailUrl(firstMedia);
  }
  else {
    thumbnail_url = "";
  }

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

  // media가 있고, createPost가 성공하면 본문에 포함된 모든 미디어를 USED로 변경
  // 컨텐츠에 써진 모든 미디어 찾기
  const mediaArray = howManyMedia(content);
  if(mediaArray) {
    // 비공개 상태인지에 따라 다른 쿼리
    if(is_published === false){
      await prisma.media.updateMany ({
        where: { blob_url: { in: mediaArray }, status: 'PENDING'},
        data: {
          status: "USED",
          is_public: false
        }
      })
    }
    else{
      await prisma.media.updateMany ({
        where: { blob_url: { in: mediaArray }, status: 'PENDING'},
        data: {
          status: "USED",
          is_public: true
        }
      })
    }
  }

  // 공개 게시물이면 거기로, 아니면 전체 게시물로 이동
  if(is_published === true){
    redirect(`/posts/${newPostId}`);
  }
  else {
    redirect('/posts/all');
  }
}

/**
 * 게시글을 수정하고 데이터베이스에 반영하는 Server Action
 * @param formData 수정 폼에서 제출된 FormData 객체
 * @returns {void}
 */
export async function handleUpdatePost(formData: FormData): Promise<void> {
    // 1. 데이터 추출 및 유효성 검사
    const id = formData.get('id') as string;
    const title = formData.get('title') as string;
    const legacyContent = formData.get("legacy_content") as string;
    const content = formData.get('content') as string;
    const legacyIs_published = formData.get('legacy_is_published') === 'on' ? false: true;
    const is_published = formData.get('is_published') === 'on' ? false : true; // 체크박스가 off일 때 true
    const summary = content.substring(0, 50); // 요약은 내용의 앞 50자로 자동 생성
    const firstMedia = extractFirstMediaUrl(content); // 첫 번째 미디어
    const thumbnail_url = firstMedia ? generateThumbnailUrl(firstMedia) : "https://hyamwcz838h4ikyf.public.blob.vercel-storage.com/default_thumbnail.png";

    if (!id || !title || !content) {
        // 더 상세한 오류 처리 필요
        throw new Error("필수 정보(ID, 제목, 내용)가 누락되었습니다.");
    }
    
    const postId = parseInt(id, 10);
    if (isNaN(postId)) {
        throw new Error("유효하지 않은 게시글 ID입니다.");
    }


    // 게시글을 비공개로 전환하는 경우
    if (legacyIs_published === true && is_published === false){
      // 미디어 전체를 새 URL로 갈아끼우고 변경
      const replicateResult = await replicateMediaAndGetNewUrls(content);

      // 새 썸네일 생성
      const newFirstMedia = extractFirstMediaUrl(replicateResult);
      const newThumbnailUrl = newFirstMedia ? generateThumbnailUrl(newFirstMedia) : "https://hyamwcz838h4ikyf.public.blob.vercel-storage.com/default_thumbnail.png";

      await prisma.post.update({
        where: { id: postId },
        data: {
          title,
          content: replicateResult,
          is_published: false,
          summary: replicateResult.substring(0, 50),
          thumbnail_url: newThumbnailUrl,
          updated_at: new Date(),
        }
      });


    // 기존 미디어를 media DB 및 blob 저장소에서 모두 삭제
    const delLegacyMediaArray = howManyMedia(legacyContent);
    const delMediaArray = howManyMedia(content);

    await Promise.all([
      deleteMediaAndBlob(delLegacyMediaArray, "legacy"),
      deleteMediaAndBlob(delMediaArray, "current"),
    ]);

  } else {
      // 게시글을 비공개로 전환하지 않는 경우 DB 업데이트 로직
      try {
          await prisma.post.update({
              where: { id: postId },
              data: {
                  title,
                  content,
                  is_published,
                  summary,
                  thumbnail_url: thumbnail_url,
                  updated_at: new Date(), // 수정 시간 갱신
              },
          });

      } catch (error) {
          console.error("게시글 수정 실패: ", error);
          // 사용자에게 상세 오류 메시지를 전달하지 않고 일반적인 오류를 던집니다.
          throw new Error("게시글을 수정하는 도중 오류가 발생했습니다.");
      }

      // media가 있고, createPost가 성공하면 본문에 포함된 모든 미디어를 USED로 변경
      try {
        // 컨텐츠에 써진 모든 미디어 찾기
        const mediaArray = howManyMedia(content);

        // 기존에 쓰인 모든 미디어 목록
        const legacyMediaArray = howManyMedia(legacyContent);
        let scheduledDeleteMedia;

        if (legacyMediaArray) {
          // 현재 미디어 배열이 없으면 전체 삭제 예정
          scheduledDeleteMedia = !mediaArray
            ? legacyMediaArray
            : legacyMediaArray.filter(item => !mediaArray.includes(item));
        }

        // 사용하는 미디어를 USED로 업데이트
        if (mediaArray && mediaArray.length > 0) {
          await prisma.media.updateMany({
            where: {
              blob_url: { in: mediaArray }
            },
            data: {
              status: "USED",
              is_public: is_published ? true : false, // 기본값 true
              updated_at: new Date(),
            },
          });
        }

        // 더 이상 사용하지 않는 미디어를 SCHEDULED_FOR_DELETION로 업데이트
        if (scheduledDeleteMedia && scheduledDeleteMedia.length > 0) {
          await prisma.media.updateMany({
            where: {
              blob_url: { in: scheduledDeleteMedia }
            },
            data: {
              status: "SCHEDULED_FOR_DELETION",
              is_public: false,
              updated_at: new Date(),
            },
          });
        }

      } catch (error) {
        console.error("Media 테이블 수정 실패: ", error);
        throw new Error("Media 테이블을 수정하는 도중 오류가 발생했습니다.")
      }
    }

    // 3. 캐시 갱신 (선택 사항: 캐시된 목록 페이지를 갱신)
    // /posts 경로의 데이터 캐시를 무효화하여 수정된 내용이 즉시 반영되게 합니다.
    revalidatePath('/posts');
    revalidatePath(`/posts/${id}`); // 상세 페이지 캐시도 갱신

    // 4. 리다이렉션: 수정된 게시글의 상세 페이지로 이동
    // 공개 게시물이면 거기로, 아니면 전체 게시물로 이동
    if(is_published === true){
      redirect(`/posts/${id}`);
    }
    else {
      redirect('/posts/all');
    }
}

/**
 * 특정 ID의 게시글을 삭제하는 Server Action
 * @param id 삭제할 게시글의 ID (문자열)
 * @returns {void}
 */
export async function handleDeletePost(id: string): Promise<void> {
    const postId = parseInt(id, 10);

    if (isNaN(postId)) {
        throw new Error("유효하지 않은 게시글 ID입니다.");
    }
    
    // 1. 🚨 게시글을 삭제하기 전에 내용을 조회하여 미디어 URL을 확보합니다.
    const postToDelete = await prisma.post.findUnique({
        where: { id: postId },
        select: { content: true } // content 필드만 가져옵니다.
    });

    if (!postToDelete) {
        // 이미 삭제되었거나 존재하지 않는 경우
        revalidatePath('/posts'); 
        redirect('/posts');
    }

    const content = postToDelete.content;

    // 1. DB 삭제 로직
    try {
        await prisma.post.delete({
            where: { id: postId },
        });
        
        // 3. 미디어 정리 예약: 본문에 사용된 모든 파일의 상태를 변경합니다.
        const mediaArray = howManyMedia(content);

        if (mediaArray) {
            // 쿼리 파라미터 제거: DB의 id과 일치시켜야 함
            // const cleanUrls = usedUrls.map(url => url.split('?')[0]);
            
            // 🚨 일주일 후 삭제되도록 예약 시간을 설정합니다.
            const scheduledDeleteTime = new Date();
            scheduledDeleteTime.setDate(scheduledDeleteTime.getDate() + 7); // 7일 후

            await prisma.media.updateMany({
                where: {
                    blob_url: { in: mediaArray },
                    status: 'USED', // USED 상태인 파일만 정리 대상으로 삼습니다.
                },
                data: {
                    status: 'SCHEDULED_FOR_DELETION',
                    scheduled_delete_at: scheduledDeleteTime,
                    is_public: false // 비공개로 전환
                },
            });
        }

    } catch (error) {
        console.error("게시글 삭제 또는 미디어 정리 예약 실패:", error);
        throw new Error("게시글 및 관련 미디어를 처리하는 도중 오류가 발생했습니다.");
    }

    // 2. 캐시 갱신 (목록 페이지와 삭제된 상세 페이지 경로 모두 갱신)
    revalidatePath('/posts/all');
    revalidatePath(`/posts/${id}`); // 상세 페이지 캐시 무효화

    // 3. 리다이렉션: 삭제 후 게시글 목록으로 이동
    redirect('/posts/all'); 
}

// 새 미디어 URL 반환 로직
async function replicateMediaAndGetNewUrls(content: string): Promise<string> {
  const mediaArray = howManyMedia(content);

  if (!mediaArray) return content;

  // 1. 병렬 복제 작업을 위한 Promise 배열 생성
  const replicationPromises = mediaArray.map(async (oldMediaUrl) => {
      try {
          // Vercel Blob copy 함수를 사용하여 파일을 복제하고 새로운 URL을 얻습니다.
          const mime_type = getFileExtension(oldMediaUrl)
          const newBlob = await copy(oldMediaUrl, generateUUID() + mime_type, { access: 'public' });

          // 2. Media 테이블에 복제된 새 미디어 레코드 생성
          // 이 레코드는 '비공개' 게시글에 사용될 새 파일에 대한 메타데이터입니다.
          await prisma.media.create({
              data: {
                  blob_url: newBlob.url, // 새 복제 URL
                  original_name: newBlob.pathname.split('/').pop() || 'replicated-file',
                  mime_type: mime_type, // 확장자는 원본에서 추론
                  uploaded_by: "projectwj",
                  status: "USED", // 올린 순간에 실행되는 함수니까 used
                  is_public: false, // 비공개용으로 마킹
              }
          });

          return {newUrl: newBlob.url, oldUrl: oldMediaUrl, newFilename: newBlob.pathname.split('/').pop()};

      } catch (error) {
          console.error(`[Security] Failed to replicate Blob URL ${oldMediaUrl}. Skipping replication.`, error);
          throw new Error("복제 작업에 실패했습니다.");
      }
  });

    // 4. Promise.all을 사용하여 모든 복제 작업을 병렬로 실행하고 결과를 순서대로 받습니다.
    const replicationResults = (await Promise.all(replicationPromises)).filter(result => result !== null);

    // 5. 받은 결과를 content에 적용
    // content 문자열에 포함된 오래된 URL들을 새로 복제된 URL로 교체합니다.
    let newContent = content;
    replicationResults.forEach(result => {
        if (result) {
            // CHANGED: 교체 로직 전체 변경
            // 1. 정규식에서 사용할 수 있도록 oldUrl의 특수 문자를 이스케이프 처리합니다.
            const escapedOldUrl = result.oldUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            
            // 2. oldUrl을 포함하는 전체 마크다운 이미지 태그를 찾는 정규식을 생성합니다.
            const markdownTagRegex = new RegExp(`!\\[.*?\\]\\(${escapedOldUrl}\\)`, 'g');
            
            // 동영상 판단해야 함
            const fileExtension = getFileExtension(result.newUrl);
            let isVideo = false;
            if(fileExtension === ".mp4" || fileExtension === ".mov" || fileExtension === ".avi" ||
              fileExtension === ".wmv" || fileExtension === ".asf" || fileExtension === ".mkv" ||
              fileExtension === ".flv" || fileExtension === ".f4v" || fileExtension === ".ts" ||
              fileExtension === ".mpeg"){
                isVideo = true;
              }

            // 3. `![새 파일 이름](새 URL)` 형식의 새로운 마크다운 태그를 만듭니다.
            const newMarkdownTag = isVideo
                                ? `![video:${result.newFilename}](${result.newUrl})`
                                : `![${result.newFilename}](${result.newUrl})`;

            // 4. 원본 콘텐츠에서 찾은 옛날 태그를 새로운 태그로 교체합니다.
            newContent = newContent.replace(markdownTagRegex, newMarkdownTag);
        }
    });

    // 6. 새 content 리턴
    return newContent;
}

// 불필요 미디어 삭제(Update에서 공개->비공개 전환할 때 사용)
async function deleteMediaAndBlob(mediaArray: string[] | null, label: string) {
  if (!mediaArray || mediaArray.length === 0) return;

  // 트랜잭션 실행
  const transaction = prisma.$transaction(async (tx) => {
    await tx.media.deleteMany({
      where: { blob_url: { in: mediaArray } },
    });
    console.log(`✅ media 테이블에서 삭제 완료 [${label}]:`, mediaArray);

    try {
      await del(mediaArray);
      console.log(`✅ Vercel Blob에서 삭제 완료 [${label}]:`, mediaArray);
    } catch (error) {
      console.error(`❌ Vercel Blob에서 삭제 실패 [${label}]:\n`, error);
      // Blob 삭제 실패 → 트랜잭션 롤백 유도
      throw new Error(`Blob 삭제 실패 [${label}]`);
    }
  });

  try {
    await transaction;
  } catch (error) {
    console.error(`❌ 전체 삭제 트랜잭션 실패 [${label}]:\n`, error);
  }
}