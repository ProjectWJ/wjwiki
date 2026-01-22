import { BlogCard } from "@/components/mainPage/BlogCard";
import { getPostsByCategory } from "@/lib/post";
import Link from "next/link";

export async function LatestPosts() {
  const newPosts = await getPostsByCategory("all", 1);

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-background dark:bg-background transition-colors duration-300">
      <div className="container px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 sm:mb-16 text-center sm:text-left">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground dark:text-white mb-4 tracking-tight">
              최신 게시글
            </h2>
            <p className="text-lg sm:text-xl text-blog-base dark:text-muted-foreground">
              가장 흥미로운 이야기를 찾아보세요
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {newPosts
              ? newPosts.posts.map((post, index) => {
                  if (index > 5) {
                    return;
                  }
                  return (
                    <BlogCard
                      key={post.id}
                      title={post.title}
                      excerpt={post.summary || "..."}
                      date={post.updated_at.toLocaleDateString()}
                      category={post.category}
                      slug={post.id.toString()}
                    />
                  );
                })
              : ""}
          </div>

          <div className="mt-12 sm:mt-16 text-center">
            <Link
              href="/posts/all"
              className="inline-flex items-center text-lg font-semibold text-primary dark:text-white hover:text-success dark:hover:text-success transition-colors duration-200"
            >
              모든 글 보기
              <svg
                className="ml-2 w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
