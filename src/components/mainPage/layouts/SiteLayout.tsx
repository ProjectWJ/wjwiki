import { ThemeToggle } from "@/components/ThemeToggle";
import Link from "next/link";
import type { ReactNode } from "react";


interface SiteLayoutProps {
  children: ReactNode;
}

export function SiteLayout({ children }: SiteLayoutProps) {
  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <header className="fixed top-0 right-0 z-50 p-4 sm:p-6">
        <ThemeToggle />
      </header>

      <main className="pt-20 sm:pt-24">{children}</main>

      <footer className="bg-blog-lighter dark:bg-muted/20 border-t border-blog-light dark:border-border/10 transition-colors duration-300">
        <div className="container px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
              <div>
                <h3 className="text-xl font-bold text-foreground dark:text-white mb-4">
                  개발 블로그
                </h3>
                <p className="text-blog-base dark:text-muted-foreground leading-relaxed">
                  깨끗하고 현대적인 디자인으로 여러분의 이야기를 전합니다.
                </p>
              </div>

              <div>
                <h4 className="text-lg font-bold text-foreground dark:text-white mb-4">
                  바로가기
                </h4>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="/posts"
                      className="text-blog-base dark:text-muted-foreground hover:text-success transition-colors"
                    >
                      글 보기
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/about"
                      className="text-blog-base dark:text-muted-foreground hover:text-success transition-colors"
                    >
                      소개
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/categories"
                      className="text-blog-base dark:text-muted-foreground hover:text-success transition-colors"
                    >
                      카테고리
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-bold text-foreground dark:text-white mb-4">
                  연결
                </h4>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="https://github.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blog-base dark:text-muted-foreground hover:text-success transition-colors"
                    >
                      GitHub
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://twitter.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blog-base dark:text-muted-foreground hover:text-success transition-colors"
                    >
                      Twitter
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-blog-light dark:border-border/10 text-center">
              <p className="text-blog-base dark:text-muted-foreground text-sm">
                © {new Date().getFullYear()} 개발 블로그. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
