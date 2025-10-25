# WYSIWYG Editor 설정 가이드

## 1. Tiptap 라이브러리 설치

```bash
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-link @tiptap/extension-image @tiptap/extension-text-align @tiptap/extension-underline @tiptap/extension-color @tiptap/extension-text-style @tiptap/extension-highlight @tiptap/extension-task-list @tiptap/extension-task-item
```

## 2. 컴포넌트 사용법

### 기본 사용
```tsx
import WysiwygEditor from '@/components/WysiwygEditor';

function MyComponent() {
  const [content, setContent] = useState('');

  return (
    <WysiwygEditor 
      value={content} 
      onChange={setContent}
      onImageUpload={handleImageUpload}
    />
  );
}
```

### 이미지 업로드 핸들러
```tsx
const handleImageUpload = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });
  
  const data = await response.json();
  return data.url;
};
```

## 3. PostForm에 통합

### 방법 1: 새로운 PostFormWithEditor 사용 (권���)

기존 `PostForm`을 유지하고 새로운 에디터 폼을 사용:

```tsx
// src/app/posts/new/page.tsx
import PostFormWithEditor from '@/components/PostFormWithEditor';

export default function NewPostPage() {
  return (
    <div>
      <h1>새 게시물 작성</h1>
      <PostFormWithEditor />
    </div>
  );
}
```

### 방법 2: 기존 PostForm 수정

`src/components/PostForm.tsx`를 직접 수정:

```tsx
'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { htmlToMarkdown } from '@/lib/markdown-converter';

const TiptapEditor = dynamic(() => import('@/components/TiptapEditor'), { ssr: false });

export default function PostForm() {
  const [content, setContent] = useState('');
  const [contentHtml, setContentHtml] = useState('');

  const handleContentChange = (html: string) => {
    setContentHtml(html);
    const markdown = htmlToMarkdown(html);
    setContent(markdown);
  };

  return (
    <form action={handleCreatePost}>
      {/* 제목 */}
      <div>
        <label>제목</label>
        <input type="text" name="title" />
      </div>

      {/* WYSIWYG 에디터 */}
      <div>
        <label>내용</label>
        <TiptapEditor
          value={contentHtml}
          onChange={handleContentChange}
          onImageUpload={uploadFile}
        />
        <input type="hidden" name="content" value={content} />
      </div>

      <button type="submit">게시물 등록</button>
    </form>
  );
}
```

## 4. 특징

- ✅ 반응형 디자인 (Desktop & Mobile)
- ✅ Tailwind CSS 스타일링
- ✅ 마크다운 출력
- ✅ 이미지 업로드 지원
- ✅ 리스트, 체크박스, 정렬 등 다양한 포맷팅
- ✅ 실시간 미리보기

## 5. 데모 페이지

`/editor-demo` 페이지에서 에디터를 테스트할 수 있습니다.

## 6. 커스터마이징

### 스타일 변경
컴포넌트의 Tailwind 클래스를 수정하여 디자인을 변경할 수 있습니다.

### 툴바 확장
추가 버튼을 툴바에 추가하여 기능을 확장할 수 있습니다.

### 단축키 지원
Tiptap은 기본적으로 다음 단축키를 지원합니다:
- Ctrl/Cmd + B: Bold
- Ctrl/Cmd + I: Italic
- Ctrl/Cmd + U: Underline
- Ctrl/Cmd + Z: Undo
- Ctrl/Cmd + Shift + Z: Redo
