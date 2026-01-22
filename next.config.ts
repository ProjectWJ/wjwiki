import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'hyamwcz838h4ikyf.public.blob.vercel-storage.com',
          port: '',
          pathname: '/**',
        },
      ],
    }
};

export default nextConfig;
