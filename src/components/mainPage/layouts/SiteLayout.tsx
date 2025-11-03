import type { ReactNode } from "react";


interface SiteLayoutProps {
  children: ReactNode;
}

export function SiteLayout({ children }: SiteLayoutProps) {
  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      {/* 메인 배경화면 */}
      <div className="absolute inset-0 z-0 bg-[url('./images/homebg.jpg')] bg-fixed bg-cover bg-center w-full min-h-[100vh] bg-gradient-to-t from-background to-transparent">
        {/* 하단 그라데이션 효과 */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </div>
      <main className="">{children}</main>
    </div>
  );
}
