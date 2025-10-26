// src/app/posts/[id]/page.tsx
import { getPostById } from '@/lib/post';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import rehypeSanitize from "rehype-sanitize";
import type { Metadata } from 'next';
import Image from 'next/image';
import { auth } from '@/auth';
import Link from 'next/link';
import DeleteButton from '@/components/DeleteButton';
import { PostDetailPage } from '@/components/PostDetailPage';

// Markdown components for rendering images and videos
const components = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  img: ({ alt, src, width, height, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => {
    if (alt?.startsWith('video:')) {
      const videoTitle = alt.substring('video:'.length);
      return (
        <video
          controls
          src={src}
          title={videoTitle}
          style={{ maxWidth: '100%', height: 'auto', display: 'block', margin: '15px auto' }}
        />
      );
    }

    if (src) {
      return (
        <a
          href={`/api/media?url=${encodeURIComponent(src as string)}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src={`${src as string}?w=800&q=75`}
            alt={alt || ''}
            width={800}
            height={600}
            style={{ width: '100%', height: 'auto', objectFit: "contain" }}
            priority={true}
            {...props}
          />
        </a>
      );
    }

    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} {...props} />;
  }
}

type PageParams = Promise<{ id: string }>;

// Generate metadata
export async function generateMetadata(
  { params }: { params: PageParams }
): Promise<Metadata> {
  const { id } = await params;
  const postId = parseInt(id, 10);

  if (isNaN(postId) || postId <= 0) {
    return {
      title: 'WJwiki - 게시물 없음',
      description: '요청한 게시물을 찾을 수 없습니다.',
    };
  }

  const post = await getPostById(postId);

  if (!post) {
    return {
      title: 'WJwiki - 게시물 없음',
      description: '요청한 게시물을 찾을 수 없습니다.',
    };
  }

  return {
    title: "WJwiki - " + post.title,
    description: post.summary || post.content?.substring(0, 150) || '블로그 게시물입니다.',
    openGraph: {
      title: post.title,
      description: post.summary || '블로그 게시물입니다.',
    },
  };
}

export default async function PostDetailPageRoute({ params }: { params: PageParams }) {
  const { id } = await params;
  const session = await auth();

  const postId = parseInt(id, 10);

  if (isNaN(postId) || postId <= 0) {
    notFound();
  }

  const post = await getPostById(postId);

  if (!post) {
    notFound();
  }

  // Transform post to include author information
  const transformedPost = {
    ...post,
    author: {
      name: 'WJwiki', // Replace with actual author data from your DB
      avatarUrl: null, // Replace with actual avatar URL from your DB
    }
  };

  return (
    <main className="container mx-auto px-4 py-8 md:py-12 max-w-7xl">
      {/* Action Buttons */}
      <div className="mb-8 flex gap-2">
        <Link
          href="/posts/all"
          className="px-3 py-1 text-sm text-white bg-gray-700 rounded hover:bg-black transition-colors"
        >
          목록
        </Link>
        {session?.user && (
          <>
            <Link
              href={`/posts/${postId}/edit`}
              className="px-3 py-1 text-sm text-white bg-indigo-500 rounded hover:bg-indigo-600 transition-colors"
            >
              수정
            </Link>
            <DeleteButton postId={postId} />
            {!post.is_published && (
              <span className="ml-2 text-sm text-gray-500">(비공개 상태)</span>
            )}
          </>
        )}
      </div>

      {/* Post Detail Component */}
      <PostDetailPage post={transformedPost}>
        <ReactMarkdown
          components={components}
          rehypePlugins={[rehypeSanitize]}
        >
          {post.content}
        </ReactMarkdown>
      </PostDetailPage>
    </main>
  );
}
