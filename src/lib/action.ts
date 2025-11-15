// Server Actions 함수들 모아두는 곳
'use server'; // 이 함수를 서버 액션으로 명시합니다.

import { redirect } from 'next/navigation';
import { createPost } from '@/lib/post';
import { del, copy } from '@vercel/blob';
import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache'; // 데이터 갱신을 위해 필요
import { extractFirstMediaUrl, findThumbnailUrl, ResizedImages, generateResizedImagesSharp, generateUUID, getFileExtension, howManyMedia } from '@/lib/server-utils' // 썸네일 생성
import { vercelBlobUrl } from '@/constants/vercelblobURL';
import DOMPurify from "isomorphic-dompurify";
import * as cheerio from 'cheerio';

const VIDEO_FORMATS = [
    ".mp4",
    ".wmv",
    ".flv",
    ".mpeg",
    ".mov",
    ".asf",
    ".f4v",
    ".avi",
    ".mkv",
    // 기존 코드에 있던 ".ts"를 포함하려면 여기에 추가해야 합니다.
];
/* 
import createDOMPurify from "dompurify";
import { JSDOM } from "jsdom";
function sanitizeContent(rawHtml: string): string {

  const window = new JSDOM('').window;
  const DOMPurify = createDOMPurify(window);
  // DOMPurify의 기본 설정은 매우 강력하고 안전합니다.
  // 특별한 설정이 필요 없다면 옵션 없이 사용합니다.
  return DOMPurify.sanitize(rawHtml); 
}
 */
// 게시물 생성 폼 제출을 처리하는 서버 액션
// @param formData 폼 데이터를 포함하는 객체
export async function handleCreatePost(formData: FormData) {
  // FormData 객체에서 필드 값을 추출합니다.
  const title = formData.get('title') as string;
  const category_select = formData.get('category_select') as string || "diary";
  const rawContent = formData.get('content') as string;
  const content = DOMPurify.sanitize(rawContent); // xss 정화
  const is_published = formData.get('is_published') === 'on' ? false : true; // 체크박스가 off일 때 true
  const summary = cheerio.load(content).text().trim().substring(0, 50); // 요약은 내용의 앞 50자로 자동 생성
  const firstMedia = extractFirstMediaUrl(content); // 첫 번째 미디어
  const thumbnail_url = await findThumbnailUrl(firstMedia);

  let newPostId: number;

  // 필수 필드 검증
  if (!title || !content) {
    alert("제목 및 내용을 모두 입력해주세요.");
    return;
  }

  // 컨텐츠에 써진 모든 미디어 찾기
  const mediaArray = howManyMedia(content);

  // 1단계에서 정의한 Prisma 함수 호출
  try {
    const newPost = await createPost({
      title,
      category: category_select,
      content,
      is_published,
      summary,
      thumbnail_url: thumbnail_url,
    });
    
    newPostId = newPost.id;
  } catch (error) {
    console.error("게시물 생성 중 오류 발생:", error);
    // 오류 발생 시 사용자에게 오류 알림 생성 또는 오류 페이지 리다이렉트
    return;
  }

  // media가 있고, createPost가 성공하면 본문에 포함된 모든 미디어를 USED로 변경
  if(mediaArray) {

    // 비공개 상태인지에 따라 다른 쿼리
    if(is_published === false){
      await prisma.media.updateMany ({
        where: { medium_url: { in: mediaArray }, status: 'PENDING'},
        data: {
          status: "USED",
          post_id: newPostId,
          is_public: false
        }
      })
    }
    else{
      await prisma.media.updateMany ({
        where: { medium_url: { in: mediaArray }, status: 'PENDING'},
        data: {
          status: "USED",
          post_id: newPostId,
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
    const category_select = formData.get('category_select') as string || "diary";
    const legacyContent = formData.get("legacy_content") as string;
    const rawContent = formData.get('content') as string;
    const content = DOMPurify.sanitize(rawContent); // xss 정화
    const legacyIs_published = formData.get('legacy_is_published') === 'on' ? false : true;
    const is_published = formData.get('is_published') === 'on' ? false : true; // 체크박스가 off일 때 true
/*     const summary = content.substring(0, 50); // 요약은 내용의 앞 50자로 자동 생성
    const firstMedia = extractFirstMediaUrl(content); // 첫 번째 미디어
 */
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
      const replicateResult = await replicateMediaAndGetNewUrls(postId, content);

      // 새 썸네일 생성
      const newFirstMedia = extractFirstMediaUrl(replicateResult);
      const newThumbnailUrl = newFirstMedia ? await findThumbnailUrl(newFirstMedia) : `${vercelBlobUrl}default_thumbnail.png`;
      
      await prisma.post.update({
        where: { id: postId },
        data: {
          title,
          category: category_select,
          content: replicateResult,
          updated_at: new Date(),
          is_published: false,
          summary: cheerio.load(replicateResult).text().trim().substring(0, 50),
          thumbnail_url: newThumbnailUrl,
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
      const newFirstMedia = extractFirstMediaUrl(content);
      const newThumbnailUrl = newFirstMedia ? await findThumbnailUrl(newFirstMedia) : `${vercelBlobUrl}default_thumbnail.png`;

      try {
          await prisma.post.update({
              where: { id: postId },
              data: {
                  title: title,
                  category: category_select,
                  content: content,
                  updated_at: new Date(),
                  is_published: true,
                  summary: cheerio.load(content).text().trim().substring(0, 50),
                  thumbnail_url: newThumbnailUrl,
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
              medium_url: { in: mediaArray }
            },
            data: {
              status: "USED",
              is_public: is_published ? true : false, // 기본값 true
              post_id: postId,
              updated_at: new Date(),
            },
          });
        }

/*         // 더 이상 사용하지 않는 미디어를 SCHEDULED_FOR_DELETION로 업데이트
        if (scheduledDeleteMedia && scheduledDeleteMedia.length > 0) {
          await prisma.media.updateMany({
            where: {
              medium_url: { in: scheduledDeleteMedia }
            },
            data: {
              status: "SCHEDULED_FOR_DELETION",
              is_public: false,
              updated_at: new Date(),
            },
          });
        } */

      if (scheduledDeleteMedia && scheduledDeleteMedia.length > 0) {
        await deleteMediaAndBlob(scheduledDeleteMedia, "legacy_public");
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
        where: { id: postId }
    });

    if (!postToDelete) {
        // 이미 삭제되었거나 존재하지 않는 경우
        console.log("게시글이 이미 삭제되었습니다.");
        revalidatePath('/posts'); 
        redirect('/posts');
    }

    // 1. DB 삭제 로직
    try {
/*       // 🚨 3일 후 삭제되도록 예약 시간을 설정합니다.
      const scheduledDeleteTime = new Date();
      scheduledDeleteTime.setDate(scheduledDeleteTime.getDate() + 3); // 3일 후

      await prisma.media.updateMany({
        where: {
            post_id: postId,
            status: 'USED', // USED 상태인 파일만 정리 대상으로 삼습니다.
        },
        data: {
            status: 'SCHEDULED_FOR_DELETION',
            scheduled_delete_at: scheduledDeleteTime,
            is_public: false // 비공개로 전환
        },
      }); */

      // 괜히 유예기간 주지 않는 게 좋을듯
      // 삭제가 무서우면 유예기간 X 백업 O

      // 해당 id에서 사용된 모든 미디어 불러오기
      const mediaList = await prisma.media.findMany({
        where: { post_id: postId }
      })

      // 미디어 삭제
      if (mediaList.length > 0) {
        for (const media of mediaList) {
          // 동영상이면 영상 하나만 폐기하면 됨
          if (VIDEO_FORMATS.includes(media.mime_type)){
            await del(media.blob_url);
            console.log("Blob Delete Complete:", media.original_name);
            continue;
          }

          // Blob에서 이미지 파일들 폐기
          const urlsToDelete = [media.blob_url, media.medium_url, media.thumbnail_url]
            .filter((url): url is string => !!url); // null/undefined/빈 문자열 제외

          await Promise.all(urlsToDelete.map(url => del(url)));
          console.log("Blob Delete Complete:", urlsToDelete);
        }

        // DB에서 파일들 폐기
        await prisma.media.deleteMany({
          where: { post_id: postId }
        });
        console.log("prisma Media Delete Complete:", JSON.stringify(mediaList, null, 2));
      }

      await prisma.post.delete({
          where: { id: postId },
      });
      console.log("Posts Delete Complete: " + postId);
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

/**
 * 게시글 비공개 전환 시 미디어를 새 Blob으로 복제하고, content 안의 마크다운 URL을 교체합니다.
 *
 * @param postId 게시글 ID
 * @param content 수정 중인 게시글 내용 (textarea에서 입력된 상태)
 * @returns 새로 복제된 미디어 URL이 적용된 content
 */
async function replicateMediaAndGetNewUrls(postId: number, content: string): Promise<string> {
  // 0️⃣ content에서 medium_url 추출
  const mediaArray = howManyMedia(content); // 현재 textarea에서 수정된 컨텐츠 안의 medium_url 배열
  if (!mediaArray) return content; // 미디어가 없으면 바로 원본 content 반환

  // 1️⃣ DB에서 medium_url 기준으로 기존 blob_url, 썸네일 URL 가져오기
  // => content에 있는 medium_url을 키로 blob_url 매핑
  const blobMap = await prisma.media.findMany({
    where: { medium_url: { in: mediaArray } },
    select: { blob_url: true, medium_url: true, thumbnail_url: true }
  });
  const mediumToBlobMap = new Map(blobMap.map(m => [m.medium_url, m.blob_url]));

  // 2️⃣ 병렬 복제 작업을 위한 Promise 배열 생성
  const replicationPromises = mediaArray.map(async (mediumUrl) => {
      try {
          const oldBlobUrl = mediumToBlobMap.get(mediumUrl);
          if (!oldBlobUrl) throw new Error(`Blob not found for mediumUrl: ${mediumUrl}`);

          // 2-1️⃣ Vercel Blob 복제
          const mime_type = getFileExtension(oldBlobUrl);
          const newBlob = await copy(oldBlobUrl, generateUUID() + mime_type, { access: 'public' });

          // 2-2️⃣ 썸네일, mediumUrl 등 리사이징된 이미지 생성
          const fileURL: ResizedImages = await generateResizedImagesSharp(newBlob.url);

          // 2-3️⃣ 새 Media 레코드 DB에 생성
          await prisma.media.create({
              data: {
                  blob_url: newBlob.url,                       // 새 복제 Blob URL
                  original_name: generateUUID() + mime_type,    // newBlob.pathname.split('/').pop() || 'replicated-file',
                  mime_type: mime_type,                        // 파일 확장자
                  uploaded_by: "projectwj",                    // uploader 정보
                  status: "USED",                              // 사용 중인 미디어로 상태 설정
                  created_at: new Date(),
                  updated_at: new Date(),
                  is_public: false,                            // 비공개용으로 마킹
                  post_id: postId,                             // 게시글 ID 연결
                  medium_url: fileURL.mediumUrl,               // 새 medium_url
                  thumbnail_url: fileURL.thumbnailUrl,        // 썸네일 URL
              }
          });

          // 2-4️⃣ 교체용 정보 반환
          return {
            newUrl: fileURL.mediumUrl,     // 새 medium_url
            oldUrl: mediumUrl,             // 기존 medium_url
            newFilename: newBlob.pathname.split('/').pop(), // 파일명
          };

      } catch (error) {
          console.error(`[Security] Failed to replicate Blob URL ${mediumUrl}. Skipping replication.`, error);
          throw new Error("복제 작업에 실패했습니다.");
      }
  });

  // 3️⃣ 모든 복제 작업 병렬 실행
  const replicationResults = (await Promise.all(replicationPromises)).filter(result => result !== null);

  // 4️⃣ content 안의 기존 medium_url을 새 medium_url로 교체
  let newContent = content;
  replicationResults.forEach(result => {
      if (!result) return;

      // 1️⃣ 정규식에서 사용할 수 있도록 특수 문자 이스케이프
      const escapedOldUrl = result.oldUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

      // 2️⃣ <img> 또는 <video> 태그의 src 속성을 찾는 정규식
      // src="OLD_URL" 또는 src='OLD_URL' 모두 처리
      const htmlSrcRegex = new RegExp(`<(img|video)([^>]*?)\\s+src=(["'])${escapedOldUrl}\\3([^>]*)>`, 'gi');

      // 3️⃣ 새로운 태그로 교체
      newContent = newContent.replace(htmlSrcRegex, (_match, tagName, beforeAttrs, quote, afterAttrs) => {
          return `<${tagName}${beforeAttrs} src=${quote}${result.newUrl}${quote}${afterAttrs}>`;
      });
  });
/*   replicationResults.forEach(result => {
      if (!result) return;

      // 4-1️⃣ 정규식에서 사용할 수 있도록 특수 문자 이스케이프
      const escapedOldUrl = result.oldUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

      // 4-2️⃣ 기존 마크다운 이미지 태그 전체를 찾는 정규식
      const markdownTagRegex = new RegExp(`!\\[.*?\\]\\(${escapedOldUrl}\\)`, 'g');

      // 4-3️⃣ 동영상인지 판단
      const fileExtension = getFileExtension(result.newUrl);
      const isVideo = VIDEO_FORMATS.includes(fileExtension);

      // 4-4️⃣ 새로운 마크다운 태그 생성
      const newMarkdownTag = isVideo
                          ? `![video:${result.newFilename}](${result.newUrl})`
                          : `![${result.newFilename}](${result.newUrl})`;

      // 4-5️⃣ 기존 content의 옛날 마크다운 태그를 새 태그로 교체
      newContent = newContent.replace(markdownTagRegex, newMarkdownTag);
  }); */

  // 5️⃣ 새 content 반환
  return newContent;
}


// 불필요 미디어 삭제(Update에서 공개->비공개 전환할 때 사용)
async function deleteMediaAndBlob(mediaArray: string[] | null, label: string) {
  if (!mediaArray || mediaArray.length === 0) return;

  // 트랜잭션 실행
  const transaction = prisma.$transaction(async (tx) => {
    // blob에서 삭제할 목록 찾기
    const mediaList = await tx.media.findMany({
      where: { medium_url: { in: mediaArray }}
    })

    try {
      // blob에서 파일들 삭제
      for (const media of mediaList) {
        // 동영상이면 영상 하나만 폐기하면 됨
        if (VIDEO_FORMATS.includes(media.mime_type)){
          await del(media.blob_url);
          console.log("Blob Delete Complete:", media.original_name);
          continue;
        }

        const urlsToDelete = [media.blob_url, media.medium_url, media.thumbnail_url]
          .filter((url): url is string => !!url); // null/undefined/빈 문자열 제외

        await Promise.all(urlsToDelete.map(url => del(url)));
      }

      console.log(`✅ Vercel Blob에서 삭제 완료 [${label}]:`, mediaList);
    } catch (error) {
      console.error(`❌ Vercel Blob에서 삭제 실패 [${label}]:\n`, error);
      // Blob 삭제 실패 → 트랜잭션 롤백 유도
      throw new Error(`Blob 삭제 실패 [${label}]`);
    }

    await tx.media.deleteMany({
      where: { medium_url: { in: mediaArray } },
    });
    console.log(`✅ media 테이블에서 삭제 완료 [${label}]:`, mediaList);
  });

  try {
    await transaction;
  } catch (error) {
    console.error(`❌ 전체 삭제 트랜잭션 실패 [${label}]:\n`, error);
  }
}