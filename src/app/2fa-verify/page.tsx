// app/2fa-verify/page.tsx
import { cookies } from 'next/headers';
import { prisma } from '@/lib/db';
import TwoFaVerifyClient from './TwoFaVerifyClient';

/*
    /2fa-verify는 직접 접근 불가 (쿠키 없거나 만료 시 강제 /login)

    DB 내 임시 토큰 유효기간도 검사

    브라우저 개발자 도구로 쿠키 조작해도 DB 유효성 검증에서 막힘

    2FA 과정 완료 시 authenticate 서버 액션이 DB에서 토큰을 삭제하면,
    /2fa-verify 재접근 시 바로 로그인 페이지로 튕김 (완벽한 일회성 흐름)
*/

function renderForbiddenHtml() {
  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>403 Forbidden</title>
  <style>
    html,body{height:100%;margin:0;font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,'Helvetica Neue',Arial}
    body{display:flex;align-items:center;justify-content:center;background:#f3f4f6;color:#111}
    .card{max-width:720px;padding:32px;border-radius:12px;background:#fff;box-shadow:0 10px 30px rgba(2,6,23,0.08);text-align:center}
    .title{font-size:28px;margin:0 0 8px}
    .desc{color:#6b7280;margin:0 0 18px}
    .actions a{display:inline-block;padding:10px 16px;border-radius:8px;background:#4f46e5;color:#fff;text-decoration:none}
  </style>
</head>
<body>
  <div class="card" role="alert" aria-labelledby="title">
    <h1 id="title" class="title">403 — 접근 불가</h1>
    <p class="desc">잘못된 접근입니다.</p>
    <div class="actions">
      <a href="/login">로그인 페이지로 이동</a>
    </div>
  </div>
</body>
</html>`;
}

export default async function TwoFaVerifyPage() {
  const cookieStore = await cookies();
  const tempToken = cookieStore.get('2fa-temp-token')?.value;

  // 1) 쿠키가 없으면 403
  if (!tempToken) {
    throw new Response(renderForbiddenHtml(), {
      status: 403,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }

  // 2) DB에서 임시 토큰 유효성 검사
  const user = await prisma.user.findFirst({
    where: {
      temp2FaToken: tempToken,
      tempTokenExpiresAt: { gt: new Date() }, // 만료 검사
    },
    select: { id: true }, // 필요한 필드만 선택
  });

  // DB에 없거나 만료되었으면 403
  if (!user) {
    throw new Response(renderForbiddenHtml(), {
      status: 403,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }

  // 통과하면 클라이언트 컴포넌트 렌더링 (폼)
  return <TwoFaVerifyClient />;
}
