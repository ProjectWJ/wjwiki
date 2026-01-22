"use client";

import React from "react";
import { NavigationMenuDemo } from "./NavigationMenu";
import { ThemeToggle } from "./ThemeToggle";

interface HeaderProps {
  isVisible: boolean;
  loginMenu: React.ReactNode;
}

export function Header({ isVisible, loginMenu }: HeaderProps) {
  // 내비게이션 바의 동적 클래스 설정
  const headerClasses = `
        bg-card text-card-foreground shadow-xl rounded-2xl flex justify-between items-center 
        w-[calc(100%-2rem)] max-w-7xl mx-auto px-4 py-4 
        fixed z-50 top-2 left-1/2 -translate-x-1/2
        transition-transform duration-300 ease-in-out
        ${isVisible ? "translate-y-0" : "-translate-y-[150%]"} 
    `;

  return (
    <>
      {/* Header 본체에 동적 클래스 적용 */}
      <div className={headerClasses}>
        <NavigationMenuDemo />
        <ThemeToggle />

        {/*
            page.tsx -> Header.event.tsx -> Header.tsx
            이렇게 전달되어 옴
        */}
        {loginMenu}
      </div>
    </>
  );
}
