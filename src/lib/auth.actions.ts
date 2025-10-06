'use server';
import { signIn } from '@/auth';

/**
 * NextAuth의 signIn 함수를 래핑하여 서버 액션으로 사용합니다.
 * @param formData - 로그인 폼에서 전달된 FormData 객체
 */
export async function authenticate(prevState: string | undefined, 
    formData: FormData): Promise<string | undefined> {
  try {
    // 폼 데이터에서 email과 password를 추출합니다.
    const email = formData.get('email');
    const password = formData.get('password');

    if (!email || !password) {
      // 오류 발생 시 오류 문자열을 반환합니다.
      return '이메일과 비밀번호를 모두 입력해야 합니다.'; 
    }

    // NextAuth의 signIn 함수를 호출하여 인증을 시도합니다.
    await signIn('credentials', {
      email,
      password,
      redirectTo: '/posts/all', // 로그인 성공 후 리다이렉트
    });

    // 성공 시 NextAuth가 redirect를 처리하므로, 여기에 도달하지 않습니다.
    return undefined;

  } catch (error) {
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