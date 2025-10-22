// src/lib/server-utils.ts
// 기존 파일명 utils
// shadcn이랑 충돌하길래 수정

import { prisma } from "./db";
import sharp from 'sharp';
import { put } from "@vercel/blob";

/**
 * User-Agent 문자열을 파싱하여 OS 및 브라우저 정보를 추출합니다.
 */
export function parseUserAgent(userAgentString: string): { os: string, browser: string } {
    let os = '알 수 없는 OS';
    let browser = '알 수 없는 브라우저';

    if (!userAgentString) {
        return { os, browser };
    }

    // --- OS 파싱 ---
    if (userAgentString.includes('Win')) {
        os = 'Windows';
    } else if (userAgentString.includes('Mac') || userAgentString.includes('Darwin')) {
        os = 'macOS';
    } else if (userAgentString.includes('Linux')) {
        os = 'Linux';
    } else if (userAgentString.includes('Android')) {
        os = 'Android';
    } else if (userAgentString.includes('iOS') || userAgentString.includes('iPhone')) {
        os = 'iOS';
    }

    // --- 브라우저 파싱 ---
    // User-Agent 문자열은 복잡하므로 Chrome/Firefox/Safari 등 주요 브라우저만 간단히 감지합니다.
    if (userAgentString.includes('Edg/')) {
        browser = 'Edge';
    } else if (userAgentString.includes('Chrome') && !userAgentString.includes('Chromium')) {
        browser = 'Chrome';
    } else if (userAgentString.includes('Firefox')) {
        browser = 'Firefox';
    } else if (userAgentString.includes('Safari') && !userAgentString.includes('Chrome')) {
        browser = 'Safari';
    }
    
    // 모바일 환경에서의 OS/브라우저 재정의 (모바일은 브라우저 이름 대신 디바이스 이름이 흔함)
    if (os === 'Android' || os === 'iOS') {
        if (userAgentString.includes('CriOS')) {
            browser = 'Chrome Mobile (iOS)';
        } else if (userAgentString.includes('FxiOS')) {
            browser = 'Firefox Mobile (iOS)';
        } else if (userAgentString.includes('Safari') && os === 'iOS') {
            browser = 'Safari Mobile';
        }
    }


    return { os, browser };
}

/**
 * 파일 확장자를 추출합니다.
 * @param filename 원본 파일 이름 (예: my_image.jpg)
 * @returns 확장자 (예: .jpg) 또는 빈 문자열
 */
export function getFileExtension(filename: string): string {
    const parts = filename.split('.');
    if (parts.length > 1) {
        return '.' + parts.pop()?.toLowerCase();
    }
    return '';
}

/**
 * 암호학적으로 안전한 UUID를 생성합니다. (RFC4122 v4)
 * @returns 고유 식별자 문자열
 */
export function generateUUID(): string {
    // node:crypto 모듈을 사용하여 UUID v4를 생성
    // Next.js Server Component 또는 API Route 환경에서 사용 가능
    return crypto.randomUUID();
}

/**
 * 게시글 내용에서 첫 번째 이미지 또는 비디오 URL을 추출합니다.
 * 마크다운 형식: ![캡션](URL)
 * @param content 게시글 내용 (마크다운)
 * @returns 첫 번째 미디어 URL 문자열 또는 null
 */
export function extractFirstMediaUrl(content: string): string | null {
    // 마크다운 이미지/링크 패턴 (Markdown Link/Image Pattern)
    // ![...](URL) 형태를 찾습니다. ![video:...](URL)도 찾습니다.
    const markdownRegex = /!\[(?:video:[^\]]+|[^\]]*)\]\((https?:\/\/[^\s)]+)\)/;
    
    const match = content.match(markdownRegex);
    
    if (match && match.length > 0)
       return match[1];         // match[1]은 괄호 안의 URL입니다.
    
    return null;
}

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
/**
 * medium_url을 받아 thumbnail_url을 찾아줍니다.
 * 
 */
export async function findThumbnailUrl(medium_url: string | null): Promise<string> {

    if (!medium_url)
        return "https://hyamwcz838h4ikyf.public.blob.vercel-storage.com/default_thumbnail.png";

    // 영상이면 지정 썸네일 반환
    const isVideo = getFileExtension(medium_url);
    if(VIDEO_FORMATS.includes(isVideo))
        return "https://hyamwcz838h4ikyf.public.blob.vercel-storage.com/default_thumbnail_video.png"

    const mediaUrl = await prisma.media.findFirst({
        where: { medium_url: medium_url },
        select: { thumbnail_url: true }
    })

    if (!mediaUrl || !mediaUrl.thumbnail_url) 
        return "https://hyamwcz838h4ikyf.public.blob.vercel-storage.com/default_thumbnail.png";

    return mediaUrl.thumbnail_url;
}


// 본문 URL 목록 추출해서 id만 넘겨주기
export function howManyMedia(content: string) {

    const markdownRegex = /!\[.*?\]\((https?:\/\/[^\s\)]+)\)/g;
    const match = Array.from(content.matchAll(markdownRegex), mat => mat[1]);

    if(match.length > 0){
        return match;
    }

    return null;
}


/**
 * 원본 이미지를 바탕으로 다중 해상도 이미지를 만들어 반환합니다.
 * 게시글 등록 / 수정 시에 실행되어야 하는 
 */

export interface ResizedImages {
  thumbnailUrl: string;
  mediumUrl: string;
  originalUrl: string;
}

export async function generateResizedImagesSharp(originalUrl: string): Promise<ResizedImages> {
    const mimeType = getFileExtension(originalUrl);

    // 동영상이면 즉시 반환
    if(mimeType === ".mp4" || mimeType === ".mov" || mimeType === ".avi" ||
        mimeType === ".wmv" || mimeType === ".asf" || mimeType === ".mkv" ||
        mimeType === ".flv" || mimeType === ".f4v" || mimeType === ".ts" ||
        mimeType === ".mpeg") {
            return {
                thumbnailUrl: "https://hyamwcz838h4ikyf.public.blob.vercel-storage.com/default_thumbnail_video.png",
                mediumUrl: originalUrl,
                originalUrl: originalUrl
            }
        }

    const response = await fetch(originalUrl);
    const buffer = Buffer.from(await response.arrayBuffer());

    // 1️⃣ 썸네일
    const thumbnailBuffer = await sharp(buffer).resize({ width: 200 }).webp().toBuffer();
    const thumbnailBlob = await put(generateUUID() + ".webp", thumbnailBuffer, { access: 'public', addRandomSuffix: true });

    // 2️⃣ 중간 화질
    const mediumBuffer = await sharp(buffer).resize({ width: 800 }).webp().toBuffer();
    const mediumBlob = await put(generateUUID() + ".webp", mediumBuffer, { access: 'public', addRandomSuffix: true });

    return {
        thumbnailUrl: thumbnailBlob.url,
        mediumUrl: mediumBlob.url,
        originalUrl: originalUrl,
    };
}