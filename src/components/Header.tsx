// 로그인, 로그아웃 헤더
import Link from 'next/link';
import { auth, signOut } from '@/auth'; // auth와 signOut 임포트

// 로그아웃을 처리할 Server Action
async function handleSignOut() {
  'use server';
  await signOut(); // NextAuth의 signOut 함수 호출
}

export default async function Header() {
  const session = await auth(); // 🚨 서버 컴포넌트에서 세션 정보 가져오기

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto p-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-extrabold text-gray-800 hover:text-indigo-600 transition-colors">
          My Blog
        </Link>
        <nav className="flex items-center space-x-4">
          <Link href="/posts" className="text-gray-600 hover:text-indigo-600">
            게시물 목록
          </Link>
          
          {/* 로그인 상태에 따른 버튼 분기 처리 */}
          {session?.user ? (
            <>
              {/* 로그인된 사용자에게만 새 글 작성 버튼 표시 */}
              <Link href="/posts/new" className="text-gray-600 hover:text-indigo-600">
                새 글 작성
              </Link>
              
              {/* 로그아웃 버튼 (Server Action 폼 사용) */}
              <form action={handleSignOut}>
                <button 
                  type="submit" 
                  className="px-3 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600 transition-colors"
                >
                  로그아웃
                </button>
              </form>
            </>
          ) : (
            // 로그아웃된 사용자에게 로그인 버튼 표시
            <Link href="/login" className="px-3 py-1 text-sm text-white bg-indigo-500 rounded hover:bg-indigo-600 transition-colors">
              로그인
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}