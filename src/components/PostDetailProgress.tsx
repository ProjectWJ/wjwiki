"use client"

import * as React from "react"
import { Progress } from "@/components/ui/progress"

export function PostDetailProgress() {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    // 1. 스크롤 위치를 계산하는 핸들러 함수 정의
    const updateScrollProgress = () => {
      // 문서 전체 높이
      const scrollHeight = document.documentElement.scrollHeight; 
      // 뷰포트 높이
      const clientHeight = window.innerHeight; 
      // 현재 스크롤 위치 (0 ~ 스크롤 가능 높이)
      const scrollTop = document.documentElement.scrollTop; 
      
      // 스크롤 가능한 전체 높이 (문서 전체 높이 - 뷰포트 높이)
      const totalScrollableHeight = scrollHeight - clientHeight; 

      // 전체 스크롤 가능 높이가 0보다 클 때만 계산 (페이지가 짧을 경우를 대비)
      if (totalScrollableHeight > 0) {
        // 비율 계산 (0~100)
        const newProgress = (scrollTop / totalScrollableHeight) * 100;
        setProgress(Math.round(newProgress)); // 정수로 반올림하여 state 업데이트
      } else {
        setProgress(0);
      }
    };

    // 2. 스크롤 이벤트 리스너 등록
    window.addEventListener('scroll', updateScrollProgress);
    
    // 컴포넌트 마운트 시 초기 값 설정
    updateScrollProgress();

    // 3. 클린업 함수에서 이벤트 리스너 제거
    return () => {
      window.removeEventListener('scroll', updateScrollProgress);
    };
  }, []); // 의존성 배열이 빈 배열이므로, 컴포넌트 마운트 시 한 번만 등록 및 언마운트 시 한 번만 해제

  // 모바일 환경에서는 성능을 위해 보이지 않도록 설정
  return <Progress value={progress} className="sticky hidden sm:block top-0 z-50 h-1 rounded-none" />
}