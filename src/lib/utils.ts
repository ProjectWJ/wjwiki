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