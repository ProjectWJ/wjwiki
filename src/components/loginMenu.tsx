// 로그인, 로그아웃 헤더
import Link from 'next/link';
import Image from 'next/image'
import accountImg from '../../public/account.png'
import { auth, signOut } from '@/auth'; // auth와 signOut 임포트
import { DropdownMenuDialog } from './loginDropdown';

// 로그아웃을 처리할 Server Action
async function handleSignOut() {
  'use server';
  await signOut(); // NextAuth의 signOut 함수 호출
}

export default async function LoginMenu() {
  const session = await auth(); // 🚨 서버 컴포넌트에서 세션 정보 가져오기

  return (
    <div className='relative flex items-center ml-auto px-4'>
      {/* 로그인 상태에 따른 버튼 분기 처리 */}
      {session?.user ? (
        <>
          {/* props로 로그아웃 함수 전달해서 use client에서 처리할 수 있게 */}
          <DropdownMenuDialog onSignOut={handleSignOut} />
        </>
      ) : (
        // 로그아웃된 사용자에게 로그인 버튼 표시
        <Link href="/login">
          <Image 
            alt="login-image" 
            src={accountImg}
            width={24}
            height={24}
          />
        </Link>
      )}
    </div>
  );
}