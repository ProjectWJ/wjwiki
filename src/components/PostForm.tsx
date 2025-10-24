'use client';

import { useState } from 'react';
import { useFormStatus } from 'react-dom'; // server action의 상태를 알기 위해 사용
import { handleCreatePost } from '@/lib/action'; // 기존의 서버 액션 함수 임포트
import { NativeSelectGroups } from './CategorySelect';

type UploadedFileResponse = {
  url: {
    thumbnailUrl: string;
    mediumUrl: string;
    originalUrl: string;
  };
  originalFilename: string;
};

// 실제 업로드 로직을 담을 함수
async function uploadFile(file: File): Promise<UploadedFileResponse | null> {
    try {
        // api route 호출
        const response = await fetch(`/api/upload?filename=${file.name}`, {
            method: 'POST',
            body: file // 파일 객체를 요청 본문에 직접 담아 전송
        });

        if (!response.ok) {
            throw new Error('파일 업로드 API 호출 실패');
        }

        const result: UploadedFileResponse = await response.json();

        // vercel blob에서 반환된 최종 url 리턴
        return result;
    } catch (error) {
        console.error('파일 업로드 중 오류 발생:', error);
        alert("파일 업로드에 실패했습니다. 콘솔을 확인하세요.");
        return null;
    }
}

export default function PostForm() {
    const [content, setContent] = useState('');
    const { pending } = useFormStatus(); // 폼 제출 상태

    // 파일 선택 시 실행될 핸들러
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if(!file) return;

        // 파일 업로드 실행
        const uploadedFileUrl = await uploadFile(file);
        if (!uploadedFileUrl) return;

        // 파일 타입에 따라 다른 마크다운/HTML 구문 생성(이미지냐 영상이냐)
        let mediaTag = '';
        const mimeType = file.type; // 파일의 mime 타입(예: image/png, video/mp4 등)

        if (mimeType.startsWith('image/')) {
            // 이미지 파일인 경우 표준 마크다운 링크 사용
            mediaTag = `\n![${file.name}](${uploadedFileUrl.url.mediumUrl})\n`;
        }
        else if (mimeType.startsWith('video/')) {
            // 영상 파일인 경우 video: 표식 사용
            const videoTitle = `video:${file.name}`;
            mediaTag = `\n![${videoTitle}](${uploadedFileUrl.url.mediumUrl})\n`;
        } 
        else {
            // 기타 파일 (예: PDF나 오디오 등)은 단순 링크로 처리
            mediaTag = `\n[${file.name}](${uploadedFileUrl.url.mediumUrl})\n`;
        }
        
        // 기존 내용에 마크다운 링크 추가
        setContent(prev => prev + mediaTag);

        // 파일 인풋 초기화 (같은 파일을 다시 선택할 수 있도록)
        e.target.value = '';
    };

    return (
        // action은 서버 액션을 가리킴
        <form action={handleCreatePost} className='space-y-4'>
            {/* 제목 */}
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">제목</label>
                <input type="text" id="title" name="title" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
            </div>

            {/* 공개 여부 */}
            <div>
                <label htmlFor="is_published" className="ml-2 block text-sm text-gray-900">비공개</label>
                <input type="checkbox" id="is_published" name="is_published" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
            </div>

            {/* 카테고리 선택 */}
            <NativeSelectGroups />

            {/* 파일 업로드 인풋 추가 */}
            <div>
                <label htmlFor='file_upload' className="block text-sm font-medium text-gray-700">
                    본문 내 미디어 삽입
                </label>
                <input
                    type='file'
                    id='file_upload'
                    accept='image/*,video/*' //이미지와 영상 파일만 허용
                    onChange={handleFileUpload}
                    disabled={pending} // 제출 중에는 비활성화
                    className='mt-1 block w-full text-sm text-gray-500'
                />
                <p className='text-xs text-gray-500 mt-1'>
                    파일을 선택하면, 본문(내용)에 마크다운 링크로 삽입됩니다.
                </p>
            </div>

            {/* 내용(content) 텍스트 영역 */}
            <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700">내용 (마크다운)</label>
                <textarea 
                id="content" 
                name="content" 
                rows={10} 
                required
                // 클라이언트 상태와 연결
                value={content} 
                onChange={(e) => setContent(e.target.value)} 
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                ></textarea>
            </div>
            
            {/* 등록 버튼 */}
            <button 
                type="submit" 
                disabled={pending}
                className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow hover:bg-blue-700 disabled:opacity-50"
            >
                {pending ? '등록 중...' : '게시물 등록'}
            </button>
        </form>
    )
}