import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface PostCardProps {
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
}

export function PostCard({
  id,
  title,
  summary,
  thumbnailUrl,
  author,
  date,
  variant = 'default',
  className,
}: PostCardProps) {
  const formattedDate = new Date(date).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const imageUrl = thumbnailUrl 
    ? `${thumbnailUrl}${thumbnailUrl.includes('?') ? '&' : '?'}w=800&q=75`
    : null;

  if (variant === 'featured') {
    return (
        // <SlideBanner /> use server 상태라 안됨
        <></>        
/*       <Link
        href={`/posts/${id}`}
        className={cn(
          'group relative overflow-hidden rounded-3xl block h-[400px]',
          className
        )}
      >
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#2980B9] to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-12 text-white">
          <div />
          <div className="space-y-4">
            <h2 className="text-2xl md:text-4xl font-bold line-clamp-2 leading-tight">
              {title}
            </h2>
            <div className="flex items-center justify-between">
              <span className="text-sm md:text-lg">{formattedDate}</span>
              {author && (
                <div className="flex items-center gap-3">
                  {author.avatarUrl && (
                    <div className="relative w-10 h-10 rounded-full overflow-hidden">
                      <Image
                        src={author.avatarUrl}
                        alt={author.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <p className="text-base font-medium">{author.name}</p>
                    <p className="text-sm opacity-90">Author</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Link> */
    );
  }

  if (variant === 'horizontal') {
    return (
      <Link
        href={`/posts/${id}`}
        className={cn(
          'group flex flex-col md:flex-row gap-6 md:gap-8',
          className
        )}
      >
        {imageUrl && (
          <div className="relative w-full md:w-48 h-48 md:h-56 flex-shrink-0 rounded-xl overflow-hidden">
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}
        <div className="flex-1 flex flex-col justify-center gap-3 md:gap-5">
          <h3 className="text-xl md:text-2xl font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <div className="flex items-center justify-between text-sm">
            {author && (
              <div className="flex items-center gap-2">
                {author.avatarUrl && (
                  <div className="relative w-8 h-8 rounded-full overflow-hidden">
                    <Image
                      src={author.avatarUrl}
                      alt={author.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <span className="text-foreground">{author.name}</span>
              </div>
            )}
            <span className="text-muted-foreground">{formattedDate}</span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/posts/${id}`}
      className={cn('group flex flex-col gap-4 md:gap-5', className)}
    >
      {imageUrl && (
        <div className="relative w-full h-60 md:h-80 rounded-xl overflow-hidden">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}
      <div className="space-y-3 md:space-y-5">
        <h3 className="text-xl md:text-2xl font-bold text-foreground line-clamp-3 group-hover:text-primary transition-colors leading-snug">
          {title}
        </h3>
        <div className="flex items-center justify-between text-sm">
          {author && (
            <div className="flex items-center gap-2">
              {author.avatarUrl && (
                <div className="relative w-8 h-8 rounded-full overflow-hidden">
                  <Image
                    src={author.avatarUrl}
                    alt={author.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <span className="text-foreground">{author.name}</span>
            </div>
          )}
          <span className="text-muted-foreground">{formattedDate}</span>
        </div>
      </div>
    </Link>
  );
}
