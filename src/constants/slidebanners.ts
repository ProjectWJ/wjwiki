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
  variant?: 'default' | 'horizontal' | 'featured';
  className?: string;
  url?: string;
}

// 배너에 들어갈 데이터 배열 (각 항목은 PostCardProps 형태)
export const BANNER_ITEMS: PostCardProps[] = [
  {
    id: 1,
    title: "Webtools Lite: 초경량 웹 도구 모음집 🚀",
    thumbnailUrl:
      "https://hyamwcz838h4ikyf.public.blob.vercel-storage.com/%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202025-10-27%20130217.png",
    url: "https://github.com/ProjectWJ/webtools_lite_extension",
    date: new Date().toISOString(),
    author: { name: "ProjectWJ" },
  },
  {
    id: 2,
    title: "Labs: Redux 연습 환경 구축 (시작하기)",
    thumbnailUrl:
      "https://hyamwcz838h4ikyf.public.blob.vercel-storage.com/default_thumbnail.png",
    url: "/labs",
    date: new Date().toISOString(),
    author: { name: "ProjectWJ" },
  },
];