import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // remotePatterns를 사용하여 신뢰할 수 있는 외부 도메인을 등록합니다.
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'hyamwcz838h4ikyf.public.blob.vercel-storage.com', // 이 도메인이 핵심
          port: '',
          pathname: '/**', // 모든 경로 허용
        },
      ],
    }
};

export default nextConfig;
