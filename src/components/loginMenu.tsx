// 로그인, 로그아웃 헤더
import Link from 'next/link';
import { auth, signOut } from '@/auth';
import { DropdownMenuDialog } from './loginDropdown';
import { CircleUserRound } from 'lucide-react';
import { Button } from './ui/button';

// 로그아웃을 처리할 Server Action
async function handleSignOut() {
  'use server';
  await signOut(); // NextAuth의 signOut 함수 호출
}

/*
  LoginMenu 관련
  
  You're importing a component that needs "next/headers".
  That only works in a Server Component which is not supported in the pages/ directory.
  
  이 오류를 피하기 위해서 해당 서버 컴포넌트는 

  페이지를 렌더링하는 서버 컴포넌트(지금은 여기) ->
  Header.event.tsx의 NaviEventListener(client) ->
  Header.tsx의 Header(client)의 props로 들어가는 로직이다.

  향후 유지보수가 좀 빡세질 수 있긴 함
*/


export default async function LoginMenu() {
  const session = await auth(); // 서버 컴포넌트에서 세션 정보 가져오기

  return (
    <div className='relative flex items-center pl-2 pr-2 sm:pr-4'>
      {/* 로그인 상태에 따른 버튼 분기 처리 */}
      {session?.user ? (
        <>
          {/* props로 로그아웃 함수 전달해서 use client에서 처리할 수 있게 */}
          <DropdownMenuDialog onSignOut={handleSignOut} />
        </>
      ) : (
        // 로그아웃된 사용자에게 로그인 버튼 표시
        <Link href={"/login"}>
          <Button className="hover:cursor-pointer" variant="outline" aria-label="Open menu" size="icon-sm">
            {/* account 로고 */}
            <CircleUserRound />
          </Button>
        </Link>
      )}
    </div>
  );
}