"use client";

import { MoreHorizontal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { CATEGORIES } from "@/constants/categories";

interface BlogCardProps {
  title: string;
  excerpt: string;
  date: string;
  category: string;
//   categories?: string[];
  image?: string;
  slug: string;
  variant?: "default" | "featured";
}

const categoryColors: Record<string, string> = {
  "개발 일지": "bg-slate-400",
  "기술 노트": "bg-amber-500",
  "프로젝트 로그": "bg-blue-500",
  "메모, 팁": "bg-teal-400",
  "일기": "bg-violet-400",
};

export function BlogCard({
  title,
  excerpt,
  date,
  category,
  image,
  slug,
  variant = "default",
}: BlogCardProps) {
  const formattedDate = new Date(date).toLocaleDateString('ko-KR', {
/*     year: 'numeric', ex) 2025년 1월 1일
    month: 'short',
    day: 'numeric', */
  });

  const currentCategory = CATEGORIES.find((item) => {
    if(item.value === category){
      return item;
    }
  });

  return (
    <Link href={`/posts/${slug}`} className="group">
      <article
        className={`
          relative overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] lg:rounded-[3rem]
          bg-card dark:bg-blog-lighter border-2 border-blog-light dark:border-border/10
          shadow-[0_4px_16px_rgba(0,0,0,0.10),0_2px_4px_rgba(0,0,0,0.10)]
          dark:shadow-[0_4px_16px_rgba(255,255,255,0.05),0_2px_4px_rgba(255,255,255,0.05)]
          hover:shadow-[0_8px_24px_rgba(0,0,0,0.15),0_4px_8px_rgba(0,0,0,0.12)]
          dark:hover:shadow-[0_8px_24px_rgba(255,255,255,0.08),0_4px_8px_rgba(255,255,255,0.06)]
          transition-all duration-300 hover:-translate-y-1
          ${variant === "featured" ? "h-full min-h-[28rem]" : "h-full min-h-[24rem]"}
        `}
      >
        <div className="flex flex-col h-full p-6 sm:p-8 gap-4">
{/*           {categories.length > 0 && (
            <div className="flex gap-2 flex-wrap items-start overflow-hidden relative">
              {categories.slice(0, 3).map((category, idx) => (
                <span
                  key={idx}
                  className={`
                    inline-flex items-center px-4 py-1.5 rounded-full
                    text-white text-sm font-bold tracking-tight
                    ${categoryColors[category.toUpperCase()] || "bg-blog-base"}
                  `}
                >
                  {category}
                </span>
              ))}
              {categories.length > 3 && (
                <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-card dark:from-blog-lighter to-transparent"></div>
              )}
            </div>
          )} */}
          <div className="flex gap-2 flex-wrap items-start overflow-hidden relative">
            <span
              className={`
                inline-flex items-center px-4 py-1.5 rounded-full
                text-white text-sm font-bold tracking-tight
                ${currentCategory ? categoryColors[currentCategory.label] : "bg-gray-500"}
              `}
            >
              {currentCategory ? currentCategory.label : category}
            </span>
          </div>

          {image && variant === "featured" && (
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-blog-light dark:bg-muted">
              <Image
                src={image}
                alt={title}
                fill
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          )}

          <div className="flex-1 flex flex-col gap-2">
            <h3 className="text-2xl sm:text-3xl font-bold text-foreground dark:text-white tracking-tight leading-tight line-clamp-2">
              {title}
            </h3>

            <div className="flex-1 relative">
              <p className="text-base text-blog-base dark:text-muted-foreground leading-relaxed line-clamp-4 sm:line-clamp-6">
                {excerpt}
              </p>
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-card dark:from-blog-lighter to-transparent pointer-events-none"></div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-transparent">
            <time className="text-blog-base dark:text-muted-foreground font-bold text-base sm:text-lg tracking-tight">
              {formattedDate}
            </time>
            <button
              onClick={(e) => {
                e.preventDefault();
              }}
              className="text-blog-base dark:text-muted-foreground hover:text-foreground dark:hover:text-white transition-colors"
            >
              <MoreHorizontal className="h-6 w-6 sm:h-7 sm:w-7" />
            </button>
          </div>
        </div>
      </article>
    </Link>
  );
}
