// lib/validation-schemas.ts
// 입력값 검증

import { z } from 'zod';

export const LoginSchema = z.object({
    email: z.string().email("유효한 이메일 형식이 아닙니다."),
    password: z.string().min(8, "비밀번호는 최소 8자 이상이어야 합니다."),
});
// export type TLoginSchema = z.infer<typeof LoginSchema>;

export const OTPSchema = z.object({
    // OTP 코드: 문자열이어야 하며, 정확히 6자리의 숫자로만 이루어져야 함
    otpCode: z
        .string({
            error: "OTP 코드는 필수 입력 항목입니다.",
        })
        .length(6, "OTP 코드는 정확히 6자리여야 합니다.")
        .regex(/^\d{6}$/, "OTP 코드는 6자리의 숫자로만 이루어져야 합니다."),
});

export type TLoginSchema = z.infer<typeof LoginSchema>;
export type TOTPSchema = z.infer<typeof OTPSchema>;