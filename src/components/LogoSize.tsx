"use client";

import logo_white from '../app/images/logo_white.png';
import logo_black from '../app/images/logo_black.png';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';

/**
 * 네비게이션 로고 컴포넌트
 * useTheme을 사용하여 resolvedTheme에 따라 이미지를 동적으로 변경합니다.
 * 하이드레이션 불일치 방지를 위해 useEffect를 사용합니다.
 */
export function NaviLogo(){
    const { resolvedTheme } = useTheme();
    
    // 1. 컴포넌트가 마운트되었는지 여부를 추적하는 상태
    const [isMounted, setIsMounted] = useState(false);

    // 2. 컴포넌트가 클라이언트에서 마운트되면 isMounted를 true로 설정
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // 3. 서버 렌더링 및 클라이언트 초기 렌더링 시 사용할 기본 로고 (예: 블랙)
    let logoSrc = logo_black;

    // 4. 클라이언트에서 마운트된 후에만 resolvedTheme에 따라 실제 로고 경로를 결정
    if (isMounted) {
        // resolvedTheme이 'dark'이면 white 로고, 아니면 black 로고를 사용합니다.
        logoSrc = resolvedTheme === 'dark' ? logo_white : logo_black;
    }

    return (
        <Image 
            // src={logoSrc}는 이제 isMounted 상태에 따라 결정됩니다.
            src={logoSrc} 
            alt="projectwj" 
            style={{ width: '90px', height: '30px' }}
        />
    )
}

/**
 * 푸터 로고 컴포넌트
 * useTheme을 사용하여 resolvedTheme에 따라 이미지를 동적으로 변경합니다.
 * 하이드레이션 불일치 방지를 위해 useEffect를 사용합니다.
 */
export function FooterLogo(){
    const { resolvedTheme } = useTheme();
    
    // 1. 컴포넌트가 마운트되었는지 여부를 추적하는 상태
    const [isMounted, setIsMounted] = useState(false);

    // 2. 컴포넌트가 클라이언트에서 마운트되면 isMounted를 true로 설정
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // 3. 서버 렌더링 및 클라이언트 초기 렌더링 시 사용할 기본 로고 (예: 블랙)
    let logoSrc = logo_black;
    
    // 4. 클라이언트에서 마운트된 후에만 resolvedTheme에 따라 실제 로고 경로를 결정
    if (isMounted) {
        logoSrc = resolvedTheme === 'dark' ? logo_white : logo_black;
    }

    return (
        <Image
            width={64}
            height={64}
            src={logoSrc}
            alt="projectwj logo"
        />
    )
}