'use client';

import * as React from 'react';
import NextImage from 'next/image'; // new Image()랑 겹쳐서 별칭 설정
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { BANNER_ITEMS } from '@/constants/slidebanners'; // 배너에 쓰이는 상수 아이템들

// 자동 재생 간격 (밀리초)
const INTERVAL_TIME = 5000;

export function SlideBanner({ className }: { className?: string }) {
  // 현재 활성화된 슬라이드 인덱스 (0 기반)
  const [currentIndex, setCurrentIndex] = React.useState(0);

  // 자동 슬라이드 재생 중인지 여부 (true면 자동 재생)
  const [isPlaying, setIsPlaying] = React.useState(true);

  // 진행률(0 ~ 100) — Progress 컴포넌트에 전달
  const [progress, setProgress] = React.useState(0);

  // 타이머 ID 보관용 ref (clearTimeout 하기 위해)
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  // 총 슬라이드 수 (BANNER_ITEMS에 기반)
  const totalSlides = BANNER_ITEMS.length;

  /**
   * 이미지 미리 로드(preload)
   * - 컴포넌트 마운트 시점에 각 thumbnailUrl을 브라우저 이미지 캐시에 미리 로드함.
   * - 이렇게 하면 사용자가 슬라이드를 전환할 때 브라우저가 이미 요청을 갖고 있어
   *   네트워크 지연을 줄이고 깜빡임을 완화할 수 있음.
   *
   * 주의: next/image를 사용해도 브라우저 캐시/프리로딩은 별도 설정 필요할 수 있으므로
   * 이처럼 Image 객체로 미리 로드하는 보조 기법을 쓰는 경우가 많음.
   */
  React.useEffect(() => {
    BANNER_ITEMS.forEach((item) => {
      if (item.thumbnailUrl) {
        const img = new Image();
        img.src = item.thumbnailUrl;
        // 브라우저가 이 src를 가져가면 캐시에 저장되고, DOM에서 NextImage가 같은 URL을 쓰면
        // 네트워크 재요청이 줄어들 가능성이 높음.
      }
    });
    // 빈 의존성 배열 -> 마운트 시 1회만 실행
  }, []);

  /**
   * 다음 슬라이드로 이동
   * - currentIndex를 다음 인덱스로 갱신.
   * - 끝에 도달하면 모듈로 연산으로 첫 슬라이드로 되돌아감.
   * - progress(진행률)를 초기화.
   *
   * useCallback으로 묶어 의존성(특히 effect에서)을 안정화 함.
   */
  const nextSlide = React.useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
    setProgress(0);
  }, [totalSlides]);

  /**
   * 이전 슬라이드로 이동
   * - 음수 인덱스가 되지 않도록 (prev - 1 + totalSlides) % totalSlides 사용.
   * - progress 초기화.
   */
  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
    setProgress(0);
  };

  /**
   * 자동 재생(useEffect)
   *
   * 역할:
   * - isPlaying이 true일 때 INTERVAL_TIME(5초)마다 nextSlide 트리거.
   * - 동시에 100ms 단위로 progress 상태를 업데이트해서 Progress 바에 애니메이션을 표시.
   *
   * 상세 동작:
   * - progressInterval: setInterval로 100ms마다 실행해서 progress를 증가시킴.
   *   증가량은 (100 / (INTERVAL_TIME / 100))로 계산 -> INTERVAL_TIME 동안 100이 되게 함.
   * - timeoutRef: INTERVAL_TIME 이후에 nextSlide를 호출하도록 setTimeout을 설정.
   *
   * 클린업:
   * - effect가 재실행되거나 언마운트될 때 기존 timeout과 interval을 정리(clear)함.
   *
   * 의존성:
   * - currentIndex 포함: currentIndex가 바뀌면 effect가 재실행되어 타이머를 새로 설정.
   * - isPlaying 포함: 재생 상태가 바뀌면 타이머/인터벌을 재구성.
   * - nextSlide 포함: useCallback으로 묶인 nextSlide가 변하면 재실행.
   */
  React.useEffect(() => {
    // 100ms마다 progress를 증가시켜 시각적으로 표시
    const progressInterval = setInterval(() => {
      if (isPlaying) {
        setProgress((prev) => {
          // INTERVAL_TIME 동안 100이 되도록 분할
          const newProgress = prev + 100 / (INTERVAL_TIME / 100);
          // 100 이상이면 100으로 고정
          return newProgress >= 100 ? 100 : newProgress;
        });
      }
    }, 100);

    // 자동 재생이 켜져있으면 INTERVAL_TIME 이후에 nextSlide 트리거
    if (isPlaying) {
      timeoutRef.current = setTimeout(() => nextSlide(), INTERVAL_TIME);
    }

    // cleanup: 타이머와 인터벌을 모두 정리
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      clearInterval(progressInterval);
    };
    // currentIndex가 바뀔 때마다 effect 재실행 -> 기존 타이머/인터벌 정리 후 재설정
  }, [currentIndex, isPlaying, nextSlide]);

  // 마우스 호버 시 자동 재생 일시중지
  const handleMouseEnter = () => setIsPlaying(false);

  // 마우스가 떠나면 자동 재생 재개
  const handleMouseLeave = () => setIsPlaying(true);

  // Progress 바의 색상 클래스 결정 (재생 중 / 정지 중)
  const progressColor = isPlaying ? 'bg-white' : 'bg-gray-500';

  return (
    <div
      // 최상위 래퍼: 마우스 이벤트를 감지하고 overflow-hidden으로 슬라이드 영역을 클립
      className={cn(
        "relative w-full mx-auto max-w-7xl overflow-hidden rounded-3xl",
        className
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* 
        슬라이드 전체 컨테이너
        - 내부에 flex로 각 슬라이드를 가로로 나열(min-w-full을 써서 각 슬라이드가 전체 너비 차지)
        - transform: translateX(-N * 100%) 방식으로 현재 인덱스만큼 왼쪽으로 이동
        - transition-transform을 적용해서 부드럽게 이동 (duration-700 ease-in-out)
      */}
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{
          // 현재 인덱스에 따라 전체 컨테이너를 이동시킴
          transform: `translateX(-${currentIndex * 100}%)`,
        }}
      >
        {BANNER_ITEMS.map((item) => (
          // 각 슬라이드는 min-w-full로 부모의 전체 너비를 차지
          <Link
            key={item.id}
            href={item.url ?? "#"}
            target="_blank"
            className="relative min-w-full h-[280px] md:h-[400px] block"
          >
            {/* 
              NextImage 사용:
              - width/height 지정(레거시 레이아웃 보정용)
              - fetchPriority="high" : 브라우저에게 우선 로드 지시 (next/image의 prop)
              - decoding="async" : 이미지 디코딩을 비동기 수행
              - style objectFit: cover로 슬라이드 영역에 맞게 잘라냄
            */}
            <NextImage
              src={item.thumbnailUrl ?? "/placeholder.png"}
              alt={item.title}
              width={1200}
              height={500}
              fetchPriority="high"
              decoding="async"
              style={{ objectFit: "cover" }}
              className="w-full h-full object-cover"
            />
            {/* 이미지 위 그라데이션 오버레이: 텍스트 가독성 향상용 */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            {/* 텍스트/메타 정보(오버레이의 최상단에 위치) */}
            <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12 text-white z-10">
                <div className="space-y-2 max-h-[120px] md:max-h-none overflow-hidden pb-12 md:pb-0">
                    <h2 className="text-2xl md:text-4xl font-bold line-clamp-2 leading-tight">
                        {item.title}
                    </h2>
                </div>
            </div>
          </Link>
        ))}
      </div>

      {/* 컨트롤 패널: 좌/우 버튼, 재생/일시정지 버튼, 현재 슬라이드 인덱스 */}
      <div className="absolute bottom-6 right-6 flex items-center gap-4 p-3 bg-black/50 backdrop-blur-sm rounded-full text-white z-20">
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.preventDefault(); // 링크 네비게이션을 막기 위해 preventDefault
            prevSlide(); // 이전 슬라이드로 이동
          }}
          className="w-8 h-8 rounded-full hover:bg-white/20"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        {/* 현재 인덱스(사용자에겐 1-based로 보임) / 총 슬라이드 수 */}
        <span className="text-lg font-semibold whitespace-nowrap">
          {currentIndex + 1} / {totalSlides}
        </span>
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.preventDefault();
            nextSlide(); // 다음 슬라이드로 이동 (버튼으로 강제 이동)
          }}
          className="w-8 h-8 rounded-full hover:bg-white/20"
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.preventDefault();
            // 재생/일시정지 토글
            // (isPlaying을 반전시켜 effect가 타이머를 정리하거나 재생하도록 유도)
            setIsPlaying(!isPlaying);
          }}
          className="w-8 h-8 rounded-full hover:bg-white/20"
        >
          {isPlaying ? (
            <Pause className="w-5 h-5" />
          ) : (
            <Play className="w-5 h-5" />
          )}
        </Button>

        {/* 진행률 표시줄(컨트롤 패널과 겹치지 않게 절대 위치로 배치) */}
        <div className="absolute -bottom-3 left-0 right-0 h-1 bg-black/50 z-20">
            <Progress value={progress} className={cn("h-full transition-colors", progressColor)} />
        </div>
      </div>
    </div>
  );
}