"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Header } from "./Header";

interface PostLayoutProps {
  children: React.ReactNode;
  loginMenu: React.ReactNode;
}

export function NaviEventListener({ children, loginMenu }: PostLayoutProps) {
  // 1. 상태 관리
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // 2. 클릭/터치 토글 함수: 현재 상태를 반전
  const handleToggle = useCallback(() => {
    setIsVisible((prev) => !prev);
  }, []);

  // 3. 스크롤 방향에 따라 isVisible 상태를 변경
  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;

    // 스크롤이 맨 위에 있을 때: 항상 보이게
    if (currentScrollY === 0) {
      setIsVisible(true);
      // 스크롤을 내릴 때: 사라지기 (100px 이상 스크롤해야 숨김 시작)
    } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
      setIsVisible(false);
      // 스크롤을 올릴 때: 다시 보이게
    } else if (currentScrollY < lastScrollY) {
      setIsVisible(true);
    }

    setLastScrollY(currentScrollY);
  }, [lastScrollY]);

  // 4. 스크롤 이벤트 리스너 등록 및 해제
  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  return (
    <>
      {/* Header에는 isVisible 상태만 전달하여 클래스를 동적으로 적용 */}
      <Header isVisible={isVisible} loginMenu={loginMenu} />

      {/* 이 영역을 클릭/터치할 때 Header가 토글되도록 이벤트를 적용 */}
      <div
        id="header-event-range"
        className="w-full h-full"
        onClick={handleToggle}
      >
        {/* 서버 컴포넌트에서 전달된 모든 콘텐츠 (PostDetailPage, Footer 등) */}
        {children}
      </div>
    </>
  );
}
