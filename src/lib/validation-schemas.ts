// lib/validation-schemas.ts
// 입력값 검증

import { z } from "zod";

export const LoginSchema = z.object({
  email: z.email("유효한 이메일 형식이 아닙니다."),
  password: z
    .string()
    .min(8, "비밀번호 입력이 유효하지 않습니다.")
    .max(30, "비밀번호 입력이 유효하지 않습니다."),
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

// HTML 태그를 제거하는 함수
const sanitizeHtml = (input: string) => {
  if (!input) return input;
  // <tag> 형태의 모든 HTML 태그를 제거하는 정규표현식
  return input.replace(/<[^>]*>?/gm, "");
};

export const SearchSchema = z.object({
  q: z
    .string()
    .min(1, { message: "검색어는 최소 1자 이상이어야 합니다." }) // 최소 길이 제한
    .max(50, { message: "검색어는 50자를 초과할 수 없습니다." }) // 최대 길이 제한
    .trim() // 앞뒤 공백 제거
    .transform(sanitizeHtml)
    // 변환 후, 다시 최소 길이 조건을 확인하여 태그 제거 후 빈 문자열이 되는 경우 방지
    .refine((val) => val.length > 0, {
      message: "유효한 검색어가 남아있지 않습니다.",
    })
    .optional(), // 검색어가 없을 수도 있음
});

export type TLoginSchema = z.infer<typeof LoginSchema>;
export type TOTPSchema = z.infer<typeof OTPSchema>;
export type SearchInput = z.infer<typeof SearchSchema>;
