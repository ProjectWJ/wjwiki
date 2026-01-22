"use client";

import Link from "next/link";
import Image, { StaticImageData } from "next/image";
import { useState } from "react";
import { CATEGORIES } from "@/constants/categories";

export function CategoryShowcase() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-blog-lighter dark:bg-muted/20 transition-colors duration-300">
      <div className="container px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 sm:mb-16 text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground dark:text-white mb-4 tracking-tight">
              모든 카테고리
            </h2>
            <p className="text-lg sm:text-xl text-blog-base dark:text-muted-foreground">
              관심있는 주제를 선택해보세요
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {CATEGORIES.map((category) => (
              <Link
                key={category.value}
                href={`/posts/all?category=${category.value}`}
                className="group"
                onMouseEnter={() => setHoveredId(category.value)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <article
                  className={`
                    relative overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] lg:rounded-[3rem]
                    bg-card dark:bg-blog-lighter border-2 border-blog-light dark:border-border/10
                    shadow-[0_4px_16px_rgba(0,0,0,0.10),0_2px_4px_rgba(0,0,0,0.10)]
                    dark:shadow-[0_4px_16px_rgba(255,255,255,0.05),0_2px_4px_rgba(255,255,255,0.05)]
                    hover:shadow-[0_12px_32px_rgba(0,0,0,0.15),0_6px_12px_rgba(0,0,0,0.12)]
                    dark:hover:shadow-[0_12px_32px_rgba(255,255,255,0.10),0_6px_12px_rgba(255,255,255,0.08)]
                    transition-all duration-500 hover:-translate-y-2
                    h-[28rem] sm:h-[32rem]
                  `}
                >
                  <div className="absolute inset-0">
                    <Image
                      src={category.image}
                      alt={category.label}
                      fill // 또는 layout="fill" (Next.js 13 이전)을 사용하여 부모 요소에 채웁니다.
                      className={`
                      w-full h-full object-cover
                      transition-all duration-700 ease-out
                      ${hoveredId === category.value ? "scale-110" : "scale-100"}
                    `}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // 반응형 크기를 지정하여 성능을 개선합니다. (선택 사항이지만 권장됨)
                      priority={false} // (선택 사항) 로딩 우선 순위가 높으면 'true'로 설정합니다.
                    />
                    <div
                      className={`
                        absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20
                        dark:from-black/90 dark:via-black/60 dark:to-black/30
                        transition-opacity duration-500
                        ${hoveredId === category.value ? "opacity-90" : "opacity-70"}
                      `}
                    ></div>
                  </div>

                  <div className="relative h-full flex flex-col justify-end p-6 sm:p-8 z-10">
                    <div
                      className={`
                        transform transition-all duration-500
                        ${hoveredId === category.value ? "translate-y-0 opacity-100" : "translate-y-2 opacity-90"}
                      `}
                    >
                      {/*                       <div className="mb-3">
                        <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-bold">
                          {category.postCount} 게시글
                        </span>
                      </div> */}

                      <h3 className="text-3xl sm:text-4xl font-bold text-white mb-3 tracking-tight">
                        {category.label}
                      </h3>

                      <p
                        className={`
                          text-white/90 text-base sm:text-lg leading-relaxed
                          transition-all duration-500
                          ${hoveredId === category.value ? "opacity-100 max-h-20" : "opacity-80 max-h-16"}
                        `}
                      >
                        {category.detail}
                      </p>

                      <div
                        className={`
                          mt-4 flex items-center text-white font-semibold
                          transition-all duration-500
                          ${hoveredId === category.value ? "translate-x-2 opacity-100" : "translate-x-0 opacity-0"}
                        `}
                      >
                        <span>카테고리 보기</span>
                        <svg
                          className="ml-2 w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
