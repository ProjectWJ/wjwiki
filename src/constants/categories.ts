// src/constants/categories.ts
// 카테고리 나누기
export const CATEGORIES = [
  { label: "개발 일지", value: "devlog" },        // 개발 일지. 직접 구현한 기능, 해결한 문제, 실험 기록
  { label: "기술 정리 / 레퍼런스", value: "technote" },    // 기술 정리/레퍼런스. 기술이나 개념 공부
  { label: "프로젝트 로그", value: "project" },       // 프로젝트 로그. 프로젝트 단위로 구조화된 문서
  { label: "사고 / 철학 / 관찰", value: "insight" },       // 사고/철학/관찰. 기술 외적인 부분
  { label: "팁 / 메모", value: "tips" },             // 팁. 단편 지식, 짧은 메모
  { label: "일기", value: "diary" },           // 개인적 일상 기록.
] as const;

export type CategoryValue = (typeof CATEGORIES)[number]["value"];
