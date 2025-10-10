// app/2fa-verify/page.tsx
'use client';

import { useActionState } from 'react';
import { authenticate } from '@/lib/auth.actions'; // 기존 Server Action 임포트
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function TwoFaVerifyPage() {
    const router = useRouter();

    // Server Action의 상태와 오류 메시지를 관리합니다.
    const [errorMessage, dispatch] = useActionState(authenticate, undefined);

    useEffect(() => {
        // 💡 2단계 로그인 성공 후의 처리: 
        // authenticate가 성공하면 (errorMessage가 undefined로 초기화되거나 빈 문자열이면) 홈으로 이동합니다.
        if (errorMessage === '') {
            router.push('/');
        }
    }, [errorMessage, router]);

    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold text-center">2단계 인증</h1>
                <p className="text-center text-gray-600">
                    휴대폰의 Microsoft Authenticator 앱에서 6자리 코드를 입력해주세요.
                </p>
                
                {/* 폼 액션에 Server Action dispatch를 연결 */}
                <form action={dispatch} className="space-y-4">

                    <div>
                        <label htmlFor="totpCode" className="block text-sm font-medium text-gray-700">인증 코드 (6자리)</label>
                        <input
                            id="totpCode"
                            type="text"
                            name="totpCode"
                            placeholder="123456"
                            maxLength={6}
                            required
                            className="mt-1 block w-full text-center text-2xl tracking-widest px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    
                    {/* 오류 메시지 표시 */}
                    <div className="h-6">
                        {errorMessage && errorMessage !== "2FA_REQUIRED_FLAG" && (
                            <p className="text-sm text-red-500 text-center">{errorMessage}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        인증 및 로그인
                    </button>
                </form>
            </div>
        </div>
    );
}