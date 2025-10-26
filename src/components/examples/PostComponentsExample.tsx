/**
 * Example usage of PostListPage and PostDetailPage components
 * 
 * These examples demonstrate how to use the components with:
 * - Props-based data passing (no internal data fetching)
 * - Loading states
 * - Optional props
 */

'use client';

import { useState, useEffect } from 'react';
import { PostListPage } from '../PostListPage';
import { PostDetailPage } from '../PostDetailPage';

// Example: Using PostListPage with loading state
export function PostListExample() {
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate data fetching
    const fetchPosts = async () => {
      setIsLoading(true);
      // Your data fetching logic here
      // const data = await fetchFromAPI();
      // setPosts(data);
      setIsLoading(false);
    };

    fetchPosts();
  }, []);

  return (
    <PostListPage
      posts={posts}
      isLoading={isLoading}
      currentPage={1}
      totalPages={3}
    />
  );
}

// Example: Using PostDetailPage with loading state
export function PostDetailExample() {
  const [post, setPost] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate data fetching
    const fetchPost = async () => {
      setIsLoading(true);
      // Your data fetching logic here
      // const data = await fetchFromAPI();
      // setPost(data);
      setIsLoading(false);
    };

    fetchPost();
  }, []);

  return (
    <PostDetailPage post={post} isLoading={isLoading}>
      {/* Render markdown or HTML content here */}
      <div dangerouslySetInnerHTML={{ __html: post?.content || '' }} />
    </PostDetailPage>
  );
}

// Example: Server Component usage (in page.tsx)
/*
// app/posts/all/page.tsx
export default async function PostsPage({ searchParams }: { searchParams: Promise<any> }) {
  const params = await searchParams;
  const posts = await getPublishedPosts();
  
  return (
    <main className="container mx-auto px-4 py-12">
      <PostListPage
        posts={posts}
        currentPage={params.page ? parseInt(params.page) : 1}
        totalPages={Math.ceil(posts.length / 9)}
      />
    </main>
  );
}
*/

// Example: With ReactMarkdown
/*
// app/posts/[id]/page.tsx
import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getPostById(parseInt(id));
  
  return (
    <main className="container mx-auto px-4 py-12">
      <PostDetailPage post={post}>
        <ReactMarkdown rehypePlugins={[rehypeSanitize]}>
          {post.content}
        </ReactMarkdown>
      </PostDetailPage>
    </main>
  );
}
*/
