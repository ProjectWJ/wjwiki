// src/lib/totp.ts (2FA 헬퍼 파일)
import { authenticator } from 'otplib';
import * as QRCode from 'qrcode';

// 서비스 이름과 사용자 계정을 정의
const SERVICE_NAME = "WJwiki";

/**
 * TOTP 설정을 위한 비밀 키와 URI를 생성
 */
export function generateTotpSetup(userId: string, email: string) {
    // 1. 비밀 키 생성
    const secret = authenticator.generateSecret();
    
    // 2. OTPAuth URI 생성 (QR 코드를 위한 포맷)
    const otpAuthUri = authenticator.keyuri(email, SERVICE_NAME, secret);

    return {
        secret,      // DB에 저장할 값
        otpAuthUri,  // QR 코드를 위한 값
    };
}

/**
 * OTPAuth URI를 Base64 인코딩된 이미지 데이터 URL로 변환
 * @param uri - otplib에서 생성된 otpAuthUri
 * @returns Base64 데이터 URL
 */

export async function generateQrCodeDataUrl(uri: string): Promise<string> {
    try {
        // toDataURL 메소드를 사용하여 Base64 PNG 이미지 문자열을 생성
        const dataUrl = await QRCode.toDataURL(uri, {
            errorCorrectionLevel: 'H', // 높은 오류 복구 수준 설정
            type: 'image/png',
            width: 200, // QR 코드 너비 설정 (픽셀)
        });
        return dataUrl;
    } catch (error) {
        console.error("QR 코드 생성 실패:", error);
        throw new Error("QR 코드 생성 중 오류가 발생했습니다.");
    }
}


/**
 * 사용자 입력 코드가 현재 시간 기준으로 유효한지 검증
 */
export function verifyTotpCode(secret: string, code: string): boolean {
    // 30초의 시간 창 내에서 코드가 유효한지 확인
    const isValid = authenticator.verify({ token: code, secret: secret });
    
    // 시간 오차를 감안하여 허용 범위를 조정할 수 있음
    authenticator.options = { window: 1 }; // 30초 이전, 이후 코드도 허용 (총 3개의 시간 창)

    return isValid;
}