// 개별 게시물 페이지
// 이 컴포넌트는 Server Component로 동작합니다.
import { getPostById } from '@/lib/post';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown'; 
import rehypeSanitize from "rehype-sanitize";
import type { Metadata } from 'next';
import Image from 'next/image';
import { auth } from '@/auth';
import Link from 'next/link';
import DeleteButton from '@/components/DeleteButton';

// <img> 렌더러 컴포넌트 정의. 영상 나오게 하려고 추가
const components = {
    // img 태그 렌더링하는 부분 재정의
    // 미사용 width, height 경고 제거 위한 아래 주석 추가
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    img: ({ alt, src, width, height, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => {

        // alt 텍스트에 "video:"가 포함되어 있는지 확인
        if (alt?.startsWith('video:')) {
            // 영상이면 <video> 태그 반환
            const videoTitle = alt.substring('video:'.length);
            return (
                <video
                    controls 
                    src={src} 
                    title={videoTitle} 
                    style={{ maxWidth: '100%', height: 'auto', display: 'block', margin: '15px auto' }}
                >
                {/* <source> 추가할 수도 있지만 src로 대부분 작동 */}
                </video>
            );
        }

        // 이미지인 경우 next.js의 Image 컴포넌트 사용해서 최적화
        if (src) {
            return (
                <a
                    href={`${src}?original=true`}
                    target="_blank"
                    rel="noopener noreferrer"
                    >
                    <Image
                        src={`${src as string}?w=800&q=75`}
                        alt={alt || ''}
                        width={800} // 원하는 너비
                        height={600} // 원하는 높이
                        style={{ width: '100%', height: 'auto', objectFit: "contain" }}
                        priority={true}
                        unoptimized={true} // 비공개 게시글 보안을 위해 최적화 비활성화..
                        {...props}
                    />
                </a>
            );
        }

        // 기본 <img />태그 반환 (fallback).
        // eslint 경고 해제를 위해 아래 주석 추가
        // eslint-disable-next-line @next/next/no-img-element
        return <img src={src} alt={alt} {...props} />;
    }
}

// Type error: Type '{ params: { id: string; }; }' does not satisfy the constraint 'PageProps'.
// 이 에러 해결하려면 이렇게 Promise로 감싸야 한다.
type PageParams = Promise<{ id: string }>;

// 메타데이터 설정
export async function generateMetadata(
    { params }: { params: PageParams }
): Promise<Metadata> {
    
    // 1. 파라미터에서 ID 추출 및 유효성 검사 (page 컴포넌트와 동일)
    const { id } = await params;
    const postId = parseInt(id, 10);
    
    if (isNaN(postId) || postId <= 0) {
        // 유효하지 않은 ID라도 메타데이터를 반환해야 하므로, 기본값을 반환합니다.
        return {
            title: 'WJwiki - 게시물 없음',
            description: '요청한 게시물을 찾을 수 없습니다.',
        };
    }

    // 2. DB에서 게시물 정보 조회
    const post = await getPostById(postId);

    // 3. 메타데이터 반환
    if (!post) {
        return {
            title: 'WJwiki - 게시물 없음',
            description: '요청한 게시물을 찾을 수 없습니다.',
        };
    }

    return {
        // 게시물 제목을 사용하여 페이지 <title> 설정
        title: "WJwiki - " + post.title,
        
        // 게시물의 summary 또는 내용 일부를 사용하여 페이지 <meta name="description"> 설정
        description: post.summary || post.content?.substring(0, 150) || '블로그 게시물입니다.',
        
        // (선택 사항) Open Graph (SNS 공유 시 사용) 설정
        openGraph: {
            title: post.title,
            description: post.summary || '블로그 게시물입니다.',
            // images: post.thumbnail_url ? [post.thumbnail_url] : [],
        },
    };
}

// 상세 페이지 컴포넌트
export default async function PostDetailPage({ params } : { params: PageParams }) {
    // 1. URL에서 id 추출
    const { id } = await params;
    const session = await auth(); // 🚨 서버 컴포넌트에서 세션 정보 가져오기


    // 2. id를 number로 변환
    const postId = parseInt(id, 10); 
    
    // 3. 유효성 검사
    if (isNaN(postId) || postId <= 0) {
        notFound();
    }
    
    // 4. id로 DB 조회 함수 호출
    const post = await getPostById(postId); 

    // 5. 게시물이 없으면 404 처리
    if (!post) {
      notFound();
    }

    // 6. 렌더링
    return (
        <main className="container mx-auto p-6">
            <article>
                <h1 className="text-4xl font-extrabold mb-4">{post.title}</h1>
                <p className="text-gray-500 mb-8">
                    작성일: {new Date(post.created_at).toLocaleDateString('ko-KR')}
                </p>
                <Link href={`/posts/all`} className="px-3 py-1 text-sm text-white bg-gray-700 rounded hover:bg-black transition-colors">
                목록
                </Link>
                {session?.user ? (
                    <>
                        <Link href={`/posts/${postId}/edit`} className="px-3 py-1 text-sm text-white bg-indigo-500 rounded hover:bg-indigo-600 transition-colors">
                        수정
                        </Link>
                        <DeleteButton postId={postId} />
                        {!post.is_published && (
                        <span className="ml-2 text-sm text-gray-500">(비공개 상태)</span>
                        )}
                    </>
                ) : (
                    <></>
                )}
                <hr className="mb-8" />
                <div className="prose max-w-none">
                    <ReactMarkdown
                        // 사용자 정의 컴포넌트를 렌더러에 전달.
                        components={components}
                        rehypePlugins={[rehypeSanitize]}
                        >{post.content}
                    </ReactMarkdown>
                </div>
            </article>
        </main>
    );
}