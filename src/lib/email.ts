// src/lib/email.ts

import nodemailer from "nodemailer";

// 환경 변수로부터 트랜스포터 설정
const transporter = nodemailer.createTransport({
  service: "gmail", // Gmail 서비스 명시
  auth: {
    type: "OAuth2",
    user: process.env.EMAIL_SERVER_USER, // Gmail 주소
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    refreshToken: process.env.GOOGLE_REFRESH_TOKEN, // 이 토큰으로 인증
  },
});

interface LoginAlertData {
  loginTime: string;
  os: string;
  browser: string;
  ip: string;
}

export async function sendLoginAlertEmail(
  toEmail: string,
  data: LoginAlertData,
) {
  const { loginTime, os, browser, ip } = data;

  const htmlBody = `
        <p><strong>[로그인 감지]</strong></p>
        <p>관리자 계정 로그인이 감지되었습니다. 본인 확인이 필요한 경우 즉시 비밀번호를 변경해 주세요.</p>
        <hr>
        <p><strong>로그인 시간:</strong> ${loginTime}</p>
        <p><strong>운영체제:</strong> ${os}</p>
        <p><strong>브라우저:</strong> ${browser}</p>
        <p><strong>로그인 IP:</strong> ${ip}</p>
    `;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: toEmail,
    subject: "[보안 알림] WJwiki 관리자 계정 로그인이 감지되었습니다.",
    html: htmlBody,
  });
}
