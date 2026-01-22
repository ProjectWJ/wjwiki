import { vercelBlobUrl } from "./vercelblobURL";
import homebg from "../app/images/homebg.jpg";

export interface PostCardProps {
  id: number;
  title: string;
  summary?: string | null;
  thumbnailUrl?: string | null;
  author?: {
    name: string;
    avatarUrl?: string | null;
  };
  date: Date | string;
  variant?: "default" | "horizontal" | "featured";
  className?: string;
  url?: string;
}

// 배너에 들어갈 데이터 배열 (각 항목은 PostCardProps 형태)
export const BANNER_ITEMS: PostCardProps[] = [
  {
    id: 1,
    title: "Webtools Lite: 경량 웹 도구 모음 🚀",
    thumbnailUrl: `${vercelBlobUrl}%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202025-10-27%20130217.png`,
    url: "https://github.com/ProjectWJ/webtools_lite_extension",
    date: new Date().toISOString(),
    author: { name: "ProjectWJ" },
  },
  {
    id: 2,
    title: "WJwiki - ProjectWJ의 블로그입니다.",
    thumbnailUrl:
      // `${vercelBlobUrl}default_thumbnail.png`,
      `${homebg.src}`,
    url: "/",
    date: new Date().toISOString(),
    author: { name: "ProjectWJ" },
  },
];
