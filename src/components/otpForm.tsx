'use client';

import {
  InputOTP,
  InputOTPGroup,
  // InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"

import { useActionState, useRef, useState } from 'react';
import { authenticate } from '@/lib/auth.actions';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card } from "./ui/card";
import { useFormStatus } from "react-dom";
import { Spinner } from "./ui/spinner";

export function InputOTPDemo() {
    const router = useRouter();
    const [totpCode, setTotpCode] = useState<string>("");
    const formRef = useRef<HTMLFormElement>(null);
    const [errorMessage, dispatch] = useActionState(authenticate, undefined);

    // 코드가 유효한지 확인하는 함수 (6자리가 모두 채워졌는지)
    const isCodeValid = totpCode.length === 6;

    // 1. 코드가 완성되면 폼을 자동으로 제출
    useEffect(() => {
            if (isCodeValid) {
                // 코드가 유효하고 폼이 존재하면 제출을 요청합니다.
                // requestSubmit()은 <button type="submit">을 누른 것과 동일하게 작동합니다.
                formRef.current?.requestSubmit();
                
            }
        }, [isCodeValid]); // totpCode가 바뀔 때마다 실행됩니다.

    // 2. 인증 결과에 따라 리다이렉트
    useEffect(() => {
        // 인증에 성공했다는 신호가 오면 (예: 빈 문자열)
        if (errorMessage === '') { 
            router.push('/');
        }
        // 에러 메시지가 undefined가 아니지만 빈 문자열도 아니면 (실패) 사용자에게 에러 표시 로직 추가 가능
    }, [errorMessage, router]);
  return (
    <Card className="w-full max-w-sm">
        <form ref={formRef} action={dispatch}>
            <TOTPFormContent 
                totpCode={totpCode} 
                setTotpCode={setTotpCode} 
                errorMessage={errorMessage} 
                // formRef={formRef}
            />
        </form>
    </Card>

  )
}

function TOTPFormContent({ 
    totpCode, 
    setTotpCode, 
    errorMessage, 
    // formRef 
}: { 
    totpCode: string, 
    setTotpCode: (value: string) => void, 
    errorMessage: string | undefined,
    // formRef: React.RefObject<HTMLFormElement | null>
}) {
    const { pending } = useFormStatus();

    if(pending){
        return (
            <div className="flex justify-center">
                {pending ? <Spinner className="size-8" /> : ""}
            </div>
        )
    }

    return (
        <>
            {/* ⭐ 중요: InputOTP는 일반적인 <input>이 아니며,
                자동으로 폼 데이터를 구성하지 않을 수 있습니다. 
                따라서 name 속성과 함께 hidden input을 추가하여
                formData에 totpCode가 확실히 포함되도록 합니다.
            */}
            <input 
                type="hidden" 
                name="totpCode" 
                value={totpCode} 
            />
            <div>
                <div className="flex justify-center mb-2">Enter your one-time password.</div>
                <div className="flex justify-center">
                    
                    <InputOTP
                        id="totpCode"
                        type="text"
                        name="totpCode"
                        placeholder="123456"
                        maxLength={6}
                        required
                        value={totpCode}
                        autoFocus
                        onChange={(value) => setTotpCode(value)}
                    >
                    <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                    </InputOTPGroup>
                    <InputOTPGroup>
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                    </InputOTPGroup>
                    </InputOTP>
                </div>
                    {/* 에러 메시지 표시 */}
                    {errorMessage && <p className={"flex justify-center text-red-500 mt-2"}>{errorMessage}</p>}
            </div>
        </>
    )
}