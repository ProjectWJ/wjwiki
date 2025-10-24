// src/constants/categories.ts
// 카테고리 나누기
export const CATEGORIES = [
  { label: "개발 일지", value: "devlog", detail: "직접 구현한 기능, 해결한 문제, 실험 기록"},
  { label: "기술 정리 / 레퍼런스", value: "technote", detail: "특정 기술이나 개념을 공부하면서 정리한 것들"},
  { label: "프로젝트 로그", value: "project", detail: "프로젝트 단위로 구조화된 문서"},
  { label: "사고 / 철학 / 관찰", value: "insight", detail: "인간관계, 사고방식, 사색한 내용들" },       
  { label: "팁 / 메모", value: "tips", detail: "짧은 코드 트릭, 유용한 설정, 명령어 등을 모은 공간" },
  { label: "일기", value: "diary", detail: "생각이나 감정의 흐름을 남기는 곳" },  
] as const;

export type CategoryValue = (typeof CATEGORIES)[number]["value"];
