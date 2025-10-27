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
  currentPage,
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
        <p className="text-xl text-muted-foreground">아직 작성된 게시물이 없습니다.</p>
      </div>
    );
  }

  const featured = featuredPost || posts[0];
  const popularPosts = currentPage === 1 ? posts.slice(0, 3) : [];
  const trendingPosts = currentPage === 1 ? posts.slice(3, 12) : posts.slice(0, 12);

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
      {
        currentPage === 1
        ? <section className="mb-14 md:mb-20">
            <div className="text-center mb-8 md:mb-12 space-y-3">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                New on the Blog
              </h2>
              <p className="text-base md:text-lg text-muted-foreground">
                Discover some of the most engaging stories from our recent posts.
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
        : ""
      }

      {/* Trending Post Section */}
      {trendingPosts.length > 0 && (
        <section className="mb-14 md:mb-20">
          <div className="text-center mb-8 md:mb-12 space-y-3">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              All Posts
            </h2>
            <p className="text-base md:text-lg text-muted-foreground">
              Find all my stories gathered here in one place.
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
      
    </div>
  );
}
