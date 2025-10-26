import { Spinner } from '@/components/ui/spinner';
import { PostCard } from './PostCard';

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
  totalPages?: number;
}

export function PostListPage({
  posts,
  isLoading = false,
  featuredPost,
  currentPage = 1,
  totalPages = 1,
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
        <p className="text-xl text-muted-foreground">아직 작성된 게시물이 없습니다.</p>
      </div>
    );
  }

  const featured = featuredPost || posts[0];
  const popularPosts = posts.slice(0, 3);
  const trendingPosts = posts.slice(3, 9);

  return (
    <div className="w-full">
      {/* Featured Post */}
      <section className="mb-14 md:mb-20">
        <PostCard
          id={featured.id}
          title={featured.title}
          thumbnailUrl={featured.thumbnail_url}
          author={featured.author}
          date={featured.created_at}
          variant="featured"
        />
      </section>

      {/* Popular Post Section */}
      <section className="mb-14 md:mb-20">
        <div className="text-center mb-8 md:mb-12 space-y-3">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Popular Post
          </h2>
          <p className="text-base md:text-lg text-muted-foreground">
            Ideas, trends, and inspiration for a brighter future
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-14">
          {/* Large Card */}
          {popularPosts[0] && (
            <div className="lg:row-span-2">
              <PostCard
                id={popularPosts[0].id}
                title={popularPosts[0].title}
                thumbnailUrl={popularPosts[0].thumbnail_url}
                author={popularPosts[0].author}
                date={popularPosts[0].created_at}
              />
            </div>
          )}

          {/* Horizontal Cards */}
          <div className="space-y-8 md:space-y-10">
            {popularPosts.slice(1).map((post) => (
              <PostCard
                key={post.id}
                id={post.id}
                title={post.title}
                thumbnailUrl={post.thumbnail_url}
                author={post.author}
                date={post.created_at}
                variant="horizontal"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Trending Post Section */}
      {trendingPosts.length > 0 && (
        <section className="mb-14 md:mb-20">
          <div className="text-center mb-8 md:mb-12 space-y-3">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Trending Post
            </h2>
            <p className="text-base md:text-lg text-muted-foreground">
              Discover how innovation and creativity drive meaningful change
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {trendingPosts.map((post) => (
              <PostCard
                key={post.id}
                id={post.id}
                title={post.title}
                thumbnailUrl={post.thumbnail_url}
                author={post.author}
                date={post.created_at}
              />
            ))}
          </div>
        </section>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <section className="flex justify-center items-center gap-3">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              type="button"
              key={page}
              className={`
                w-12 h-12 rounded-xl text-base font-normal transition-colors
                ${
                  page === currentPage
                    ? 'bg-[#2980B9] text-white'
                    : 'text-foreground hover:bg-muted'
                }
              `}
              aria-label={`페이지 ${page}`}
              aria-current={page === currentPage ? 'page' : undefined}
            >
              {page}
            </button>
          ))}
        </section>
      )}
    </div>
  );
}
