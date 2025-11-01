'use client'

import { Button } from "@/components/mainPage/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React from "react";
import Typed from "typed.js"

export function Hero() {
  const el = React.useRef(null);

  React.useEffect(() => {
    const typed = new Typed(el.current, {
      strings: ['<i>First</i> sentence.', '&amp; 안녕하세요'],
      fadeOut: false,
      smartBackspace: true,
      cursorChar: "|",
      loop: true,
      typeSpeed: 50,
      backSpeed: 0,
    });

    return () => {
      // Destroy Typed instance during cleanup to stop animation
      typed.destroy();
    };
  }, []);

  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-blog-lighter via-background to-blog-light dark:from-background dark:via-muted dark:to-background transition-colors duration-300 py-28 sm:py-32">
      <div className="absolute inset-0 bg-grid-pattern text-foreground/10 dark:text-white/10 opacity-60"></div>

      <div className="container px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-tight">
              안녕하세요,
              <br />
              <span className="bg-gradient-to-r from-primary via-tertiary to-success bg-clip-text text-transparent">
                개발 블로그
              </span>
              입니다
            </h1>
            
            <p className="text-lg sm:text-xl md:text-2xl text-blog-base dark:text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              깨끗하고 현대적인 디자인으로 여러분의 이야기를 전합니다.
              기술, 디자인, 그리고 일상의 인사이트를 공유합니다.
            </p>
            <span ref={el} />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button
              size="lg"
              className="rounded-full px-8 h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group"
              asChild
            >
              <Link href="/posts/all">
                글 보기
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              className="rounded-full px-8 h-12 text-base font-semibold border-2 hover:bg-accent transition-all duration-300"
              asChild
            >
              <Link href="/about">
                소개 보기
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
