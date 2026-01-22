// components/GithubIconLink.jsx (또는 .tsx)

import Link from 'next/link';
import { JSX } from 'react';
import { FaGithub } from 'react-icons/fa'; 

/**
 * Next.js의 <Link>를 사용하여 GitHub 아이콘에 링크를 거는 커스텀 컴포넌트
 * @param {object} props - 컴포넌트 속성
 * @param {string} props.href - GitHub 프로필 또는 레포지토리 URL (필수)
 * @param {number} [props.size=24] - 아이콘 크기 (기본값: 24)
 * @param {string} [props.color='currentColor'] - 아이콘 색상 (기본값: 'currentColor')
 * @param {string} [props.className] - 추가할 CSS 클래스
 * @param {boolean} [props.newTab=true] - 새 탭에서 열지 여부 (기본값: true)
 * @returns {JSX.Element}
 */
const GithubIconLink = (
    { href, size = 24, color = 'currentColor', className = '', newTab = true, ...rest }: 
    { href: string; size?: number; color?: string; className?: string; newTab?: boolean; }): 
    JSX.Element => {
  const targetProps = newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {};
  
  // Next.js의 <Link>는 자식 요소에 href를 전달하기 때문에
  // <a> 태그를 직접 자식으로 사용하고 거기에 props를 분산해 전달
  return (
    <Link 
        href={href} 
        passHref 
        {...targetProps} 
        className={`inline-flex items-center justify-center ${className}`} 
        {...rest}>
        <FaGithub size={size} color={color} />
    </Link>
  );
};

export default GithubIconLink;