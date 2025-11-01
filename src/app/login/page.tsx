"use client";
import { LoginForm } from '@/components/loginForm';

export default function LoginPage() {

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-md p-8 space-y-6 rounded-lg shadow-lg">
          <LoginForm />
      </div>
    </div>
  );
}