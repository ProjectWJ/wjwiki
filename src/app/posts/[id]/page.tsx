// 개별 게시물 페이지
// 이 컴포넌트는 Server Component로 동작합니다.
import { getPostById } from '@/lib/post';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { auth } from '@/auth';
import { PostDetailPage } from '@/components/PostDetailPage';
import Footer from '@/components/Footer';
import { NaviEventListener } from '@/components/Header.event';
import { PostDetailProgress } from '@/components/PostDetailProgress';
import LoginMenu from '@/components/loginMenu';


// <img> 렌더러 컴포넌트 정의. 영상 나오게 하려고 추가
// 현재 미사용 상태
/* const components = {
    // img 태그 렌더링하는 부분 재정의
    // 미사용 width, height 경고 제거 위한 아래 주석 추가
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    img: ({ alt, src, width, height, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => {

        // alt 텍스트에 "video:"가 포함되어 있는지 확인
        if (alt?.startsWith('video:')) {
            // 영상이면 <video> 태그 반환
            const videoTitle = alt.substring('video:'.length);
            // source도 있지만 src로 대부분 작동
            return (
                <video
                    controls 
                    src={src} 
                    title={videoTitle} 
                    style={{ maxWidth: '100%', height: 'auto', display: 'block', margin: '15px auto' }}
                >
                </video>
            );
        }

        // 이미지인 경우 next.js의 Image 컴포넌트 사용해서 최적화
        // 다른 링크에서 가져온 이미지일 경우에는 X 
        if (src && src.toString().includes(vercelBlobUrl)) {
            return (
                <Link
                    href={`/api/media?url=${encodeURIComponent(src as string)}`}
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
                        {...props}
                    />
                </Link>
            );
        }

        // 기본 <img />태그 반환 (fallback).
        // eslint 경고 해제를 위해 아래 주석 추가
        // eslint-disable-next-line @next/next/no-img-element
        return <img src={src} alt={alt} {...props} />;
    }
} */

/* const replace = (node: DOMNode) => {
    // DOMPurify로 정제된 후의 'Element' 타입 노드만 처리
    if (node instanceof Element) {

        // 1. <img> 태그 처리
        if (node.name === 'img') {
            const { alt, src } = node.attribs;
            const props = node.attribs; // 나머지 속성 (className, style 등)
            
            // a. 비디오 처리 (alt="video:..." 기준)
            if (alt?.startsWith('video:')) {
                const videoTitle = alt.substring('video:'.length);
                return (
                    <video
                        controls 
                        src={src} 
                        title={videoTitle} 
                        style={{ maxWidth: '100%', height: 'auto', display: 'block', margin: '15px auto' }}
                        {...props}
                    >
                    </video>
                );
            }

            // b. Next.js Image 최적화 처리 (vercelBlobUrl 포함 시)
            if (src && src.includes(vercelBlobUrl)) {
                // width, height를 직접 지정하거나, layout='responsive' 대신 style={{ width: '100%', height: 'auto' }}를 사용
                return (
                    <Link
                        href={`/api/media?url=${encodeURIComponent(src)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Image
                            src={`${src}?w=800&q=75`}
                            alt={alt || ''}
                            width={800} 
                            height={600} 
                            style={{ width: '100%', height: 'auto', objectFit: "contain" }}
                            priority={true}
                            {...props}
                        />
                    </Link>
                );
            }
            
            // c. 기본 <img> 태그 반환 (외부 링크 이미지 등)
            // eslint-disable-next-line @next/next/no-img-element
            return <img src={src} alt={alt} {...props} />;
        }
    }
}

const options: HTMLReactParserOptions = { replace }; */

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
export default async function PostDetailPageRoute({ params } : { params: PageParams }) {
    // 1. URL에서 id 추출
    const { id } = await params;
    const session = await auth(); // 🚨 서버 컴포넌트에서 세션 정보 가져오기

    const isAdmin = session?.user ? true : false;

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

    // Transform post to include author information
    const transformedPost = {
        ...post,
        author: {
        name: 'WJwiki', // Replace with actual author data from your DB
        avatarUrl: null, // Replace with actual avatar URL from your DB
        }
    };

    // 1. DOMPurify를 사용하여 HTML 정제
    // 저장 시점에 이미 정화되었으므로 렌더링 성능을 위해 비활성화

    // 6. 렌더링
    return (
      <>
        <PostDetailProgress />
        <main className="container mx-auto px-4 py-8 mt-12 md:py-12">
        <NaviEventListener loginMenu={<LoginMenu />}>
            {/* Post Detail Component */}
            <PostDetailPage post={transformedPost} isAdmin={isAdmin}>
                <div id='main-content' dangerouslySetInnerHTML={{ __html: post.content }} />
            </PostDetailPage>
            {/* Footer */}
            <Footer />
          </NaviEventListener>
        </main>
      </>
    );
}