// app/2fa-verify/TwoFaVerifyClient.tsx
"use client";

import { InputOTPDemo } from "@/components/otpForm";

export default function TwoFaVerifyClient() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <InputOTPDemo />
    </div>
  );
}
