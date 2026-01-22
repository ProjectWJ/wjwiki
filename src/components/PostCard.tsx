import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { vercelBlobUrl } from "@/constants/vercelblobURL";

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
  isPublished: boolean;
  variant?: "default" | "horizontal" | "featured";
  className?: string;
}

export function PostCard({
  id,
  title,
  // summary,
  thumbnailUrl,
  author,
  date,
  isPublished,
  variant = "default",
  className,
}: PostCardProps) {
  const formattedDate = new Date(date).toLocaleDateString("ko-KR", {
    /*     year: 'numeric', ex) 2025년 1월 1일
    month: 'short',
    day: 'numeric', */
  });

  const imageUrl = thumbnailUrl
    ? `${thumbnailUrl}${thumbnailUrl.includes("?") ? "&" : "?"}w=800&q=75`
    : null;

  if (variant === "horizontal") {
    return (
      <Link
        href={`/posts/${id}`}
        className={cn(
          "group flex flex-col md:flex-row gap-6 md:gap-8",
          className,
        )}
      >
        {imageUrl?.startsWith(vercelBlobUrl) && (
          <div className="relative w-full h-full md:w-48 h-48 md:h-56 flex-shrink-0 rounded-xl overflow-hidden">
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}
        {!imageUrl?.startsWith(vercelBlobUrl) && (
          <div className="relative w-full h-full md:w-48 h-48 md:h-56 flex-shrink-0 rounded-xl overflow-hidden">
            <Image
              src={imageUrl!}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}
        <div className="flex-1 flex flex-col justify-center gap-3 md:gap-5">
          {isPublished ? (
            <h3 className="text-xl md:text-2xl font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
              {title}
            </h3>
          ) : (
            <h3 className="text-xl md:text-2xl italic text-gray-400 font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
              {title + "(비공개)"}
            </h3>
          )}
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
      className={cn("group flex flex-col gap-4 md:gap-5", className)}
    >
      {imageUrl?.startsWith(vercelBlobUrl) && (
        <div className="relative w-full h-60 md:h-80 rounded-xl overflow-hidden">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}
      {!imageUrl?.startsWith(vercelBlobUrl) && (
        <div className="relative w-full h-60 md:h-80 rounded-xl overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl!}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}
      <div className="space-y-3 md:space-y-5">
        {isPublished ? (
          <h3 className="text-xl md:text-2xl font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
        ) : (
          <h3 className="text-xl md:text-2xl italic text-gray-400 font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
            {title + "(비공개)"}
          </h3>
        )}
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
