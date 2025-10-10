'use server';
import { signIn } from '@/auth';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

/**
 * NextAuth의 signIn 함수를 래핑하여 서버 액션으로 사용합니다.
 * @param formData - 로그인 폼에서 전달된 FormData 객체
 */
export async function authenticate(prevState: string | undefined, 
    formData: FormData): Promise<string | undefined>{
    
  // 폼 데이터에서 email과 password를 추출합니다.
  const email = formData.get('email');
  const password = formData.get('password');
  const totpCode = formData.get('totpCode') as string | undefined;
  

  // 2단계 로그인 로직
  if (totpCode) {
    // 🚨 2단계 로그인 시, 비밀번호 대신 쿠키에서 임시 토큰을 가져와야 합니다.
    // 현재 Server Action은 form data만 받으므로, 임시 토큰을 form에 추가하거나,
    // Server Action 내에서 cookies().get()을 사용하여 토큰을 가져와야 합니다.

    const tempToken = (await cookies()).get('2fa-temp-token')?.value; 
    
    if (!tempToken) {
        return '인증 시간이 만료되었거나 토큰이 없습니다.';
    }
    
    // 🚨 authorize 함수에 토큰을 전달하는 것이 중요합니다.
    // credentials 객체에 totpCode 외에 임시 토큰을 전달하도록 auth.config.ts의 credentials 정의를 수정해야 합니다.
    
    try {
      await signIn('credentials', { 
          tempToken, // 🚨 임시 토큰을 전달 (credentials에 추가해야 함)
          totpCode,
          redirectTo: '/posts/all'
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
        throw error; // Next.js가 리다이렉트 처리를 완료하도록 다시 throw 해주는 것이 일반적입니다.
      }

      console.log(error);
      return '인증 코드가 정확하지 않습니다.';
    }
  }

  // 1단계 로그인 로직
  if (!totpCode){
    try {
      if (!email || !password) {
        // 오류 발생 시 오류 문자열을 반환합니다.
        return '이메일과 비밀번호를 모두 입력해야 합니다.'; 
      }

      // NextAuth의 signIn 함수를 호출하여 인증을 시도합니다.
      await signIn('credentials', {
        email,
        password,
        totpCode: '',     
        tempToken: '',
        redirect: false,
        // redirectTo: '/posts/all', // 로그인 성공 후 리다이렉트
      });

      return redirect('/2fa-verify');

    } catch (error) {
      if (error instanceof Error && error.message === "TwoFactorRequired") {
        // 2FA 인증 페이지로 리디렉션합니다. 이메일을 쿼리 파라미터로 넘겨줄 수 있습니다.
        redirect(`/2fa-verify`);
      }

      // 1. NextAuth가 리다이렉트를 시도했을 때 (성공)
      //    이 경우 'NEXT_REDIRECT' 예외를 잡고, 추가 코드 없이 함수가 종료됩니다.
      if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
          throw error; // Next.js가 리다이렉트 처리를 완료하도록 다시 throw 해주는 것이 일반적입니다.
      }
      
      // 인증 실패 시 오류 처리
      if (error instanceof Error && error.message.includes('CredentialsSignin')) {
        console.log(error);
        return '이메일이나 비밀번호가 일치하지 않습니다.';
      }
      // 다른 오류 처리
      console.log(error);
      return '로그인 중 알 수 없는 오류가 발생했습니다.';
    }
  }
}