'use client';

import { useCallback, useState } from 'react';
import { handleUpdatePost } from '@/lib/action'; // 기존의 서버 액션 함수 임포트
import dynamic from 'next/dynamic';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { uploadFile } from './TiptapEditor';

const TiptapEditor = dynamic(() => import('@/components/TiptapEditor'), { ssr: false });

export type UploadedFileResponse = {
  url: {
    thumbnailUrl: string;
    mediumUrl: string;
    originalUrl: string;
  };
  originalFilename: string;
};

export interface PostEditProps {
    post: {
        id: string;
        title: string;
        category: string;
        content: string;
        is_published: boolean;
        created_at: Date;
        updated_at: Date;
        summary: string | null;
        thumbnail_url: string;
    }
}

export default function PostForm(postProps: PostEditProps) {
    const [htmlContent, setHtmlContent] = useState(postProps.post.content); // html 텍스트
    const [markContent, setMarkContent] = useState(postProps.post.content); // 마크다운 문법으로 변환해줘야 함

    // useCallback으로 감싸서 무한루프 방지
    const handleContentChange = useCallback((html: string, markdown: string) => {
        setHtmlContent(html);
        setMarkContent(markdown);
    }, []);

    return (
        // action은 서버 액션을 가리킴
        <form action={handleUpdatePost} className='space-y-4'>
            <input type="hidden" name="id" defaultValue={postProps.post.id} /> 
            <input type="hidden" name="legacy_content" defaultValue={postProps.post.content} />
            <input type="hidden" name="legacy_is_published" defaultChecked={postProps.post.is_published} />
            {/* 제목 */}
            <div>
                <input 
                    type="text" 
                    id="title" 
                    name="title" 
                    defaultValue={postProps.post.title} 
                    required 
                    className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
            </div>

            {/* 공개 여부 */}
            <Label className="hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3 has-[[aria-checked=true]]:border-blue-600 has-[[aria-checked=true]]:bg-blue-50 dark:has-[[aria-checked=true]]:border-blue-900 dark:has-[[aria-checked=true]]:bg-blue-950">
                <Checkbox
                    id="is_published"
                    name="is_published"
                    defaultChecked={!postProps.post.is_published}
                    className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
                />
                <div className="grid gap-1.5 font-normal">
                    <p className="text-sm leading-none font-medium">
                        비공개
                    </p>
                    <p className="text-muted-foreground text-sm">
                        내용에 미디어가 포함되어 있으면 전환에 시간이 걸릴 수 있습니다.
                    </p>
                </div>
            </Label>

            {/* WYSIWYG 에디터 */}
            <div>
                <TiptapEditor 
                    value={htmlContent} 
                    onChange={handleContentChange}
                    onImageUpload={uploadFile}
                    initialData={postProps}
                />
                {/* 서버에 전송 */}
                <input type="hidden" name="content" value={htmlContent} />
            </div>
            
            {/* 마크다운 미리보기 (개발용, 필요시 제거) */}
            {process.env.NODE_ENV === 'development' && (
                <details className="mt-4">
                    <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-900">
                        마크다운 문법 보기
                    </summary>
                    <pre className="mt-2 p-4 bg-gray-100 rounded text-xs overflow-auto max-h-[200px]">
                        {markContent}
                    </pre>
                </details>
            )}
        </form>
    )
}