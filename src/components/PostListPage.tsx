import { Spinner } from '@/components/ui/spinner';
import { PostCard } from './PostCard';
import { EmptyNotFound } from './ui/empty';
import { CATEGORIES } from "@/constants/categories"

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

export function PostListPage({
  posts,
  isLoading = false,
  featuredPost,
  currentPage,
  category,
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

  const featured = featuredPost || posts[0];
  const popularPosts = currentPage === 1 ? posts.slice(0, 3) : [];
  const trendingPosts = currentPage === 1 ? posts.slice(3, 12) : posts.slice(0, 12);

  const currentCategory = CATEGORIES.find((item) => item.value === category);

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
                {currentCategory ? currentCategory.label : "모든 게시글"}
              </h2>
              <p className="text-base md:text-lg text-muted-foreground">
                {currentCategory ? currentCategory.introduce : "모든 카테고리의 글을 찾아볼 수 있습니다"}
              </p>
              <p className="text-start text-lg mb-4">{totalPosts} Posts</p>
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
        : <section className="mb-14 md:mb-20">
            <div className="text-center mb-8 md:mb-12 space-y-3">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                {currentCategory ? currentCategory.label : "모든 게시글"}
              </h2>
              <p className="text-base md:text-lg text-muted-foreground">
                {currentCategory ? currentCategory.introduce : "모든 카테고리의 글을 찾아볼 수 있습니다"}
              </p>
              <p className="text-start text-lg mb-4">{totalPosts} Posts</p>
            </div>
          </section>
      }

      {/* Trending Post Section */}
      {trendingPosts.length > 0 && (
        <section className="mb-14 md:mb-20">
{/*           <div className="text-center mb-8 md:mb-12 space-y-3">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              {currentCategory ? currentCategory.label : "모든 게시글"}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground">
              {currentCategory ? currentCategory.introduce : "모든 카테고리의 글을 찾아볼 수 있습니다"}
            </p>
          </div> */}

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
