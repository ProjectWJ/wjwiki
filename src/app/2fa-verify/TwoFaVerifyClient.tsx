// app/2fa-verify/TwoFaVerifyClient.tsx
'use client';

import { useActionState } from 'react';
import { authenticate } from '@/lib/auth.actions';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function TwoFaVerifyClient() {
    const router = useRouter();
    const [errorMessage, dispatch] = useActionState(authenticate, undefined);

    useEffect(() => {
        if (errorMessage === '') {
            router.push('/');
        }
    }, [errorMessage, router]);

    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold text-center">2단계 인증</h1>
                <p className="text-center text-gray-600">
                    휴대폰의 Authenticator 앱에서 6자리 코드를 입력해주세요.
                </p>
                
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
                            className="mt-1 block w-full text-center text-2xl tracking-widest px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                        />
                    </div>
                    
                    <div className="h-6">
                        {errorMessage && errorMessage !== "2FA_REQUIRED_FLAG" && (
                            <p className="text-sm text-red-500 text-center">{errorMessage}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 px-4 rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                        인증 및 로그인
                    </button>
                </form>
            </div>
        </div>
    );
}
