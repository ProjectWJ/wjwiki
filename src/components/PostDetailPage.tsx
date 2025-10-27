import { Spinner } from '@/components/ui/spinner';
import Image from 'next/image';
import Link from 'next/link';
import { Instagram, Facebook, Twitter, LinkIcon } from 'lucide-react';
import Footer from './Footer';

interface Post {
  id: string; // number로 바꾸기?
  title: string;
  content?: string | null;
  summary?: string | null;
  created_at: string | Date;
  thumbnail_url?: string | null;
  category?: string;
  author?: {
    name: string;
    avatarUrl?: string | null;
    bio?: string;
  };
}

interface PostDetailPageProps {
  post?: Post;
  isLoading?: boolean;
  relatedPosts?: Post[];
  children?: React.ReactNode;
}

export function PostDetailPage({
  post,
  isLoading = false,
  relatedPosts = [],
  children,
}: PostDetailPageProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner className="w-12 h-12" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <p className="text-xl text-muted-foreground">게시물을 찾을 수 없습니다.</p>
        <Link
          href="/posts/all"
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
        >
          목록으로 돌아가기
        </Link>
      </div>
    );
  }

  const formattedDate = new Date(post.created_at).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const imageUrl = post.thumbnail_url
    ? `${post.thumbnail_url}${post.thumbnail_url.includes('?') ? '&' : '?'}w=1440&q=75`
    : null;

  return (
    <div className="w-full">
      {/* Header Section */}
      <header className="mb-8 md:mb-12 flex flex-col items-center gap-6 md:gap-8">
        {/* Author Profile */}
        {post.author && (
          <div className="flex flex-col items-center gap-3">
            {post.author.avatarUrl && (
              <div className="relative w-14 h-14 rounded-full overflow-hidden">
                <Image
                  src={post.author.avatarUrl}
                  alt={post.author.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="text-center space-y-0.5">
              <p className="text-lg font-normal text-foreground">
                {post.author.name}
              </p>
              <p className="text-base text-muted-foreground">Author</p>
            </div>
          </div>
        )}

        {/* Title */}
        <h1 className="text-3xl md:text-5xl font-bold text-foreground text-center max-w-3xl leading-tight">
          {post.title}
        </h1>

        {/* Meta Information */}
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
              />
            </svg>
            <span>4 Mins Read</span>
          </div>
          <div className="w-3 h-3 rounded-full bg-muted" />
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
              />
            </svg>
            <span>{formattedDate}</span>
          </div>
        </div>

        <div className="w-full max-w-3xl h-px bg-border" />
      </header>

      {/* Main Content Area */}
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Article Content */}
        <article className="flex-1 min-w-0">
          {/* Summary */}
          {post.summary && (
            <p className="text-base md:text-lg text-foreground mb-8 md:mb-10 leading-relaxed">
              {post.summary}
            </p>
          )}

          {/* Featured Image */}
          {imageUrl && (
            <div className="relative w-full h-64 md:h-96 rounded-xl overflow-hidden mb-8 md:mb-10">
              <Image
                src={imageUrl}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Blockquote / Highlight */}
          {post.summary && (
            <div className="flex gap-4 md:gap-6 mb-8 md:mb-10">
              <div className="w-0.5 bg-muted flex-shrink-0" />
              <p className="text-base md:text-lg text-foreground font-normal leading-relaxed">
                Here&aposs a country-by-country guide to some of the best culinary
                experiences in Europe.
              </p>
            </div>
          )}

          {/* Prose Content */}
          <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-bold prose-headings:text-foreground prose-p:text-foreground prose-p:leading-relaxed prose-a:text-primary prose-strong:text-foreground prose-ul:text-foreground prose-ol:text-foreground">
            {children}
          </div>
        </article>

        {/* Sidebar - Desktop Only */}
        <aside className="hidden lg:flex lg:flex-col gap-6 w-14 flex-shrink-0 sticky top-24 self-start">
          {/* Share Actions */}
          <div className="flex flex-col gap-4">
            <button
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-muted hover:bg-muted/80 transition-colors"
              aria-label="Share on Instagram"
            >
              <Instagram className="w-6 h-6 text-muted-foreground" />
            </button>
            <button
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-muted hover:bg-muted/80 transition-colors"
              aria-label="Share on Facebook"
            >
              <Facebook className="w-6 h-6 text-muted-foreground" />
            </button>
            <button
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-muted hover:bg-muted/80 transition-colors"
              aria-label="Share on Twitter"
            >
              <Twitter className="w-6 h-6 text-muted-foreground" />
            </button>
            <button
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-muted hover:bg-muted/80 transition-colors"
              aria-label="Copy link"
            >
              <LinkIcon className="w-6 h-6 text-muted-foreground" />
            </button>
          </div>
        </aside>
      </div>

      {/* Mobile Share Actions */}
      <div className="flex lg:hidden items-center justify-center gap-4 mt-8 md:mt-12">
        <button
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-muted hover:bg-muted/80 transition-colors"
          aria-label="Share on Instagram"
        >
          <Instagram className="w-6 h-6 text-muted-foreground" />
        </button>
        <button
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-muted hover:bg-muted/80 transition-colors"
          aria-label="Share on Facebook"
        >
          <Facebook className="w-6 h-6 text-muted-foreground" />
        </button>
        <button
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-muted hover:bg-muted/80 transition-colors"
          aria-label="Share on Twitter"
        >
          <Twitter className="w-6 h-6 text-muted-foreground" />
        </button>
        <button
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-muted hover:bg-muted/80 transition-colors"
          aria-label="Copy link"
        >
          <LinkIcon className="w-6 h-6 text-muted-foreground" />
        </button>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
