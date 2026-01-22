'use client'

import React from "react";
import Typed from "typed.js"
import "./hero.css";

export function Hero() {
  const el = React.useRef(null);

  React.useEffect(() => {
    const typed = new Typed(el.current, {
      strings: ['ProjectWJ', 'Welcome to WJwiki !'],
      fadeOut: true,
      smartBackspace: true,
      cursorChar: "|",
      loop: false,
      typeSpeed: 50,
      backSpeed: 0,
    });

    return () => {
      typed.destroy();
    };
  }, []);

  return (
    <section className="relative min-h-[100vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-blog-lighter transition-colors duration-300 py-28 sm:py-32">
{/*       section className 중 일부 via-background to-blog-light dark:from-background dark:via-muted dark:to-background 

<div className="absolute inset-0 bg-grid-pattern text-foreground/10 dark:text-white/10 opacity-60"></div>
 */}
      <div className="container px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-tight">
              <span ref={el} />
              <br />

{/* 쓰려면 이거 blob에 넣고 불러오기. 로컬에서 불러오는 건 느림 */}
{/*               <Image
                src={logo_white}
                alt="logo"
                fetchPriority="high"
                /> */}
{/*               <span className="bg-gradient-to-r from-white via-tertiary to-success bg-clip-text text-transparent">
                개발 블로그
              </span>
              입니다 */}
            </h1>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
{/*             <Button
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
            </Button> */}
{/* svg 위치 여기 */}
          </div>
        </div>
      </div>

      
    </section>
  );
}
