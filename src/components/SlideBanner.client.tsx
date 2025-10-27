'use client'; // 🚨 클라이언트 컴포넌트로 지정

import * as React from 'react';
// Next.js 환경에서 사용되므로 모듈 임포트는 유지합니다.
// 현재 빌드 환경 제약으로 인해 실제 사용은 <img>와 <a> 태그를 활용합니다.
import Image from 'next/image';
import Link from 'next/link';

import { cn } from '@/lib/utils'; // cn 유틸리티 함수
import { Button } from '@/components/ui/button'; // shadcn/ui Button
import { Progress } from '@/components/ui/progress'; // shadcn/ui Progress

// 아이콘 임포트 (lucide-react 가정)
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';

// 🚨 PostCardProps 인터페이스를 사용하여 데이터 구조를 통일합니다.
interface PostCardProps {
    id: number;
    title: string;
    summary?: string | null;
    thumbnailUrl?: string | null;
    author?: {
        name: string;
        avatarUrl?: string | null;
    };
    date: Date | string;
    variant?: 'default' | 'horizontal' | 'featured';
    className?: string;
    url?: string;
}

// 🚨 임시 배너 데이터 (PostCardProps 타입 사용)
const BANNER_ITEMS: PostCardProps[] = [
    {
        id: 1,
        title: "Webtools Lite: 초경량 웹 도구 모음집 🚀",
        thumbnailUrl: "https://hyamwcz838h4ikyf.public.blob.vercel-storage.com/%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202025-10-27%20130217.png",
        url: "https://github.com/ProjectWJ/webtools_lite_extension",
        date: new Date().toISOString(), // Date 객체 또는 string 사용
        author: { name: "ProjectWJ", avatarUrl: "https://hyamwcz838h4ikyf.public.blob.vercel-storage.com/%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202025-10-27%20130217.png" },
    },
    {
        id: 2,
        title: "Labs: Redux 연습 환경 구축 (시작하기)",
        thumbnailUrl: "https://hyamwcz838h4ikyf.public.blob.vercel-storage.com/default_thumbnail.png",
        url: "/labs",
        date: new Date().toISOString(),
        author: { name: "ProjectWJ", avatarUrl: "https://hyamwcz838h4ikyf.public.blob.vercel-storage.com/%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202025-10-27%20130217.png" },
    }
];

// 자동 슬라이드 간격 (5초)
const INTERVAL_TIME = 5000;

// Next/Link의 임포트 에러를 방지하기 위한 임시 래퍼 (실제 Next.js 프로젝트에서는 Link를 직접 사용)
/* const CustomLink = ({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) => (
    <Link href={href} className={className}>
        {children}
    </Link>
); */

export function SlideBanner({ className }: { className?: string }) {
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const [isPlaying, setIsPlaying] = React.useState(true);
    const [progress, setProgress] = React.useState(0);
    const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

    const data = BANNER_ITEMS;
    const totalSlides = data.length;

    // 슬라이드 이동 로직
    const nextSlide = React.useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % totalSlides);
        setProgress(0); // 슬라이드 이동 시 진행률 초기화
    }, [totalSlides]);

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
        setProgress(0);
    };

    // 자동 재생 로직 (useEffect)
    React.useEffect(() => {
        // progressInterval은 isPlaying 상태와 무관하게 매 5초마다 progress를 0으로 리셋하고,
        // 100ms마다 progress를 증가시켜 시각적으로 보여줍니다.
        const progressInterval = setInterval(() => {
             if (isPlaying) {
                setProgress((prev) => {
                    // 매 100ms마다 증가할 비율
                    const newProgress = prev + (100 / (INTERVAL_TIME / 100)); 
                    if (newProgress >= 100) {
                        return 100;
                    }
                    return newProgress;
                });
            }
        }, 100);

        if (isPlaying) {
            // 슬라이드 이동 타이머
            timeoutRef.current = setTimeout(() => {
                nextSlide();
            }, INTERVAL_TIME);

            return () => {
                clearTimeout(timeoutRef.current!);
                clearInterval(progressInterval);
            };
        } else {
            // 정지 상태일 때는 슬라이드 이동 타이머만 제거합니다.
            clearTimeout(timeoutRef.current!);
            // progressInterval은 return 함수에서 정리됩니다.
            return () => {
                clearTimeout(timeoutRef.current!);
                clearInterval(progressInterval);
            };
        }
    }, [currentIndex, isPlaying, nextSlide]);

    // Hover 이벤트 핸들러
    const handleMouseEnter = () => setIsPlaying(false);
    const handleMouseLeave = () => setIsPlaying(true);
    
    // 현재 표시될 배너 데이터
    const currentItem = data[currentIndex];

    // Progress Bar 색상 정의 (재생 중에는 흰색, 정지 중에는 회색)
    const progressColor = isPlaying ? 'bg-white' : 'bg-gray-500';

    return (
        <div 
            className={cn('relative w-full mx-auto max-w-7xl', className)}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <Link
                href={`${currentItem.url}`}
                target='_blank'
                className={cn(
                    'group relative overflow-hidden rounded-3xl block h-[280px] md:h-[400px]',
                )}
            >
                {/* 1. 이미지 및 오버레이 */}
                {currentItem.thumbnailUrl && (
                    <div className='absolute inset-0'>
                         {/* Next/Image 대신 <img> 태그 사용 (환경 제약) */}
                         <Image
                            src={currentItem.thumbnailUrl}
                            alt={currentItem.title}
                            width={1200}
                            height={500}
                            style={{ objectFit: 'cover' }}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                {/* 2. 텍스트 콘텐츠 */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12 text-white z-10">
                    <div className="space-y-2 max-h-[120px] md:max-h-none overflow-hidden pb-12 md:pb-0">
                        <h2 className="text-2xl md:text-4xl font-bold line-clamp-2 leading-tight">
                            {currentItem.title}
                        </h2>
                    </div>
                </div>

                {/* 3. 컨트롤 영역 (우측 하단) */}
                <div className="absolute bottom-6 right-6 flex items-center gap-4 p-3 bg-black/50 backdrop-blur-sm rounded-full text-white z-20">
                    
                    {/* 3-1. 좌/우 화살표 버튼 */}
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={(e) => { e.preventDefault(); prevSlide(); }} 
                        className="w-8 h-8 rounded-full hover:bg-white/20 transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </Button>

                    {/* 3-2. 현재/총 슬라이드 수 */}
                    <span className="text-lg font-semibold whitespace-nowrap">
                        {currentIndex + 1} / {totalSlides}
                    </span>

                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={(e) => { e.preventDefault(); nextSlide(); }} 
                        className="w-8 h-8 rounded-full hover:bg-white/20 transition-colors"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </Button>
                    
                    {/* 3-3. 재생/일시 정지 버튼 */}
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={(e) => { e.preventDefault(); setIsPlaying(!isPlaying); }} 
                        className="w-8 h-8 rounded-full hover:bg-white/20 transition-colors"
                    >
                        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    </Button>
                                    
                    {/* 4. 진행률 표시줄 (Progress Bar) */}
                    <div className="absolute -bottom-3 left-0 right-0 h-1 bg-black/50 z-20">
                        <Progress value={progress} className={cn("h-full transition-colors", progressColor)} />
                    </div>
                </div>
            </Link>
        </div>
    );
}
