import Develop from "@/app/images/photo-develop.jpg";
import Design from "@/app/images/photo-design.jpg";
import Diary from "@/app/images/photo-diary.jpg";
import Fountain from "@/app/images/fountain-pen_1280.jpg";
import Plan from "@/app/images/floor-plan_1280.jpg"

// src/constants/categories.ts
// 카테고리 나누기
export const CATEGORIES = [
  { 
    label: "개발 일지",
    value: "devlog",
    detail: "구현한 기능, 해결한 문제, 실험을 기록",
    introduce: "구현 과정과 문제 해결의 과정을 기록하여 기술적 성장의 궤적을 남깁니다",
    image: Develop,
  },
  { 
    label: "기술 노트",
    value: "technote",
    detail: "특정 기술이나 개념을 공부하면서 정리한 것들",
    introduce: "흥미로운 기술이나 개념을 정리하며 지식을 확장합니다",
    image: Fountain,
  },
  { 
    label: "프로젝트 로그",
    value: "project",
    detail: "프로젝트 단위로 구조화된 문서",
    introduce: "프로젝트의 구조, 설계, 시행착오를 문서화합니다",
    image: Plan,
  },
  { 
    label: "메모, 팁",
    value: "memo",
    detail: "코드 스니펫, 유용한 설정 등을 모아놓은 공간",
    introduce: "짧은 코드, 설정, 유용한 정보들을 빠르게 참고하기 위한 곳입니다",
    image: Design,
  },
  { 
    label: "일기",
    value: "diary",
    detail: "생각이나 감정의 흐름을 남기는 곳",
    introduce: "마음의 결을 따라 흐르는 생각들을 기록합니다",
    image: Diary,
  },  
] as const;

export type CategoryValue = (typeof CATEGORIES)[number]["value"];
export type CategoryLabel = (typeof CATEGORIES)[number]["label"];