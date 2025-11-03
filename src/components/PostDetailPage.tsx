import { Spinner } from '@/components/ui/spinner';
import { CATEGORIES } from '../constants/categories'
import SideBar from './SideBar';
import { EmptyNotFound } from '../components/ui/empty'
import "@/app/markdownStyle.css";
import { DeleteModalProvider } from './DeleteModalContext';

interface Post {
  id: string; // number로 바꾸기?
  title: string;
  content?: string | null;
  summary?: string | null;
  created_at: string | Date;
  updated_at: string | Date;
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
  isAdmin: boolean
}

export function PostDetailPage({
  post,
  isLoading = false,
  // relatedPosts = [],
  children,
  isAdmin
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
        <EmptyNotFound />
      </div>
    );
  }

  const categoryObject = CATEGORIES.find(
    (c) => c.value === post.category
  );

  const currentCategory = categoryObject
    ? categoryObject.label // 찾은 객체가 있으면 label을 사용
    : post.category; // 없으면 원본 post.category를 사용

  const cDateObj = new Date(post.created_at);
  const createDate = `${cDateObj.getFullYear()}. ${cDateObj.getMonth() + 1}. ${cDateObj.getDate()}. ${String(cDateObj.getHours()).padStart(2, '0')}:${String(cDateObj.getMinutes()).padStart(2, '0')}`;

  const dateObj = new Date(post.updated_at);
  const updatedDate = `${dateObj.getFullYear()}. ${dateObj.getMonth() + 1}. ${dateObj.getDate()}. ${String(dateObj.getHours()).padStart(2, '0')}:${String(dateObj.getMinutes()).padStart(2, '0')}`;

  return (
    <div className="w-full">
      {/* Header Section */}
      <header className="mb-8 md:mb-12 flex flex-col items-center gap-6 md:gap-8">

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
            <span>{currentCategory}</span>
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
            <span>{createDate}</span>
          </div>
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
                d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{updatedDate}</span>
          </div>
        </div>

        <div className="w-full max-w-3xl h-px bg-border" />
      </header>

      {/* Main Content Area */}
      <div className="flex flex-col gap-8 lg:gap-12 lg:grid lg:grid-cols-[1fr_minmax(0,_120ch)_1fr] lg:justify-items-center">
        {/* Article Content */}
      <article className="flex-1 w-full min-w-0 lg:col-start-2">
          {/* Content */}
          <div className="markdown-body">
            {children}
          </div>
        </article>

        {/* SideBar Componant  */}
        {/* Delete 모달창이 SideBar에 갇히지 않게 조치 */}
        <DeleteModalProvider>
          <SideBar postId={parseInt(post.id)} isAdmin={isAdmin} />
        </DeleteModalProvider>
      </div>

      {/* Mobile Share Actions */}
{/*       <div className="flex lg:hidden items-center justify-center gap-4 mt-8 md:mt-12">
        <button
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-muted hover:bg-muted/80 transition-colors"
          aria-label="Copy link"
        >
          <LinkIcon className="w-6 h-6 text-muted-foreground" />
        </button>
      </div> */}
    </div>
  );
}
