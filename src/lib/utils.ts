// src/lib/utils.ts

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
/* export function generateUUID(): string {
    // node:crypto 모듈을 사용하여 UUID v4를 생성
    // Next.js Server Component 또는 API Route 환경에서 사용 가능
    return crypto.randomUUID();
} */

// 이 아래 아직 미사용

/**
 * 게시글 내용에서 첫 번째 이미지 또는 비디오 URL을 추출합니다.
 * 마크다운 형식: ![캡션](URL)
 * @param content 게시글 내용 (마크다운)
 * @returns 첫 번째 미디어 URL 문자열 또는 null
 */
export function extractFirstMediaUrl(content: string): string | null {
    // 마크다운 이미지/링크 패턴 (Markdown Link/Image Pattern)
    // ![...](URL) 형태를 찾습니다.
    const markdownRegex = /!\[.*?\]\((https?:\/\/[^\s\)]+)\)/;
    
    const match = content.match(markdownRegex);
    
    if (match && match[1]) {
        // match[1]은 괄호 안의 URL입니다.

        // 동영상이면 동영상 기본 썸네일
        const isVideo = getFileExtension(match[1]);
        
        if(isVideo === ".mp4" || isVideo === ".mov" || isVideo === ".avi" ||
            isVideo === ".wmv" || isVideo === ".asf" || isVideo === ".mkv" ||
            isVideo === ".flv" || isVideo === ".f4v" || isVideo === ".ts" ||
            isVideo === ".mpeg") {
            
            return "https://hyamwcz838h4ikyf.public.blob.vercel-storage.com/default_thumbnail_video%20%282%29%20%282%29.png"
        } else {
            // 이미지면 이미지 썸네일
            return match[1];
        }
    }
    
    return null;
}

/**
 * Vercel Blob URL에 썸네일 파라미터를 추가하여 반환합니다.
 * @param url 원본 Blob URL
 * @returns 썸네일 최적화 파라미터가 추가된 URL
 */
export function generateThumbnailUrl(url: string): string {
    // Vercel Blob의 이미지 변환 기능을 활용하여 썸네일 파라미터 추가
    // 300px 너비, WebP 포맷으로 변환
    return `${url}?w=300&fit=cover&format=webp`;
}

// 본문 URL 목록 추출
export function howManyMedia(content: string) {

    const markdownRegex = /!\[.*?\]\((https?:\/\/[^\s\)]+)\)/g;
    const match = Array.from(content.matchAll(markdownRegex), mat => mat[1]);

    if(match){
        return match;
    }

    return null;
}