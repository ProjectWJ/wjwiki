import { Spinner } from "@/components/ui/spinner";
import { PostCard } from "./PostCard";
import { EmptyNotFound } from "./ui/empty";

interface Post {
  id: number;
  title: string;
  category: string;
  summary?: string | null;
  created_at: string | Date;
  thumbnail_url?: string | null;
  is_published: boolean;
  author?: {
    name: string;
    avatarUrl?: string | null;
  };
}

interface PostListPageProps {
  posts?: Post[];
  isLoading?: boolean;
  featuredPost?: Post;
  currentPage?: number;
  totalPosts?: number;
  totalPages?: number;
  category?: string | string[];
}

export function PostSearchListPage({
  posts,
  isLoading = false,
  // currentPage,
  // category,
  totalPosts,
  // totalPages,
}: PostListPageProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner className="w-12 h-12" />
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <EmptyNotFound />
      </div>
    );
  }

  const trendingPosts = posts.slice(0, 12);

  return (
    <div className="w-full">
      <section className="mb-14 md:mb-20">
        <div className="text-center mb-8 md:mb-12 space-y-3">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            {"검색된 게시글"}
          </h2>
          <p className="text-base md:text-lg text-muted-foreground">
            {"검색된 모든 카테고리의 글을 찾아볼 수 있습니다"}
          </p>
          <p className="text-start text-lg mb-4">{totalPosts} Posts</p>
        </div>
      </section>

      {/* Trending Post Section */}
      {trendingPosts.length > 0 && (
        <section className="mb-14 md:mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {trendingPosts.map((post) => (
              <PostCard
                key={post.id}
                id={post.id}
                title={post.title}
                thumbnailUrl={post.thumbnail_url}
                isPublished={post.is_published}
                author={post.author}
                date={post.created_at}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
