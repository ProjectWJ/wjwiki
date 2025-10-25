# WYSIWYG Editor 빠른 참조

## 🚀 5분 안에 시작하기

### 1단계: 데모 확인
```bash
npm run dev
# → http://localhost:3000/editor-demo
```

### 2단계: 새 게시물 페이지에 통합
```tsx
// src/app/posts/new/page.tsx
import PostFormWithEditor from '@/components/PostFormWithEditor';

export default function Page() {
  return <PostFormWithEditor />;
}
```

끝! 🎉

---

## 📚 컴포넌트 선택 가이드

| 컴포넌트 | 사용 시기 | 의존성 |
|---------|----------|--------|
| **TiptapEditor** | 풀기능 에디터 필요 | Tiptap ✅ |
| **WysiwygEditor** | 간단한 에디터 | 없음 |
| **PostFormWithEditor** | 즉시 사용 가능한 폼 | Tiptap ✅ |

**권장**: `TiptapEditor` 또는 `PostFormWithEditor`

---

## 🎯 기본 사용법

### TiptapEditor 단독 사용
```tsx
'use client';

import { useState } from 'react';
import TiptapEditor from '@/components/TiptapEditor';
import { htmlToMarkdown } from '@/lib/markdown-converter';

export default function MyComponent() {
  const [html, setHtml] = useState('');
  
  const save = () => {
    const markdown = htmlToMarkdown(html);
    // markdown을 서버로 전송
  };

  return (
    <>
      <TiptapEditor 
        value={html}
        onChange={setHtml}
        onImageUpload={async (file) => {
          // 이미지 업로드 로직
          return 'https://cdn.example.com/image.jpg';
        }}
      />
      <button onClick={save}>저장</button>
    </>
  );
}
```

### PostFormWithEditor (All-in-One)
```tsx
import PostFormWithEditor from '@/components/PostFormWithEditor';

export default function Page() {
  return <PostFormWithEditor />;
  // 모든 기능이 이미 구현되어 있음!
}
```

---

## 🎨 주요 Props

### TiptapEditor Props
```tsx
interface TiptapEditorProps {
  value: string;              // HTML 콘텐츠
  onChange: (html: string) => void;  // 변경 시 콜백
  onImageUpload?: (file: File) => Promise<string>; // 이미지 업로드
}
```

---

## 🔧 유틸리티 함수

### HTML → Markdown
```tsx
import { htmlToMarkdown } from '@/lib/markdown-converter';

const markdown = htmlToMarkdown('<p>Hello <strong>world</strong></p>');
// → "Hello **world**"
```

### Markdown → HTML
```tsx
import { markdownToHtml } from '@/lib/markdown-converter';

const html = markdownToHtml('Hello **world**');
// → "<p>Hello <strong>world</strong></p>"
```

---

## ⌨️ 단축키

| 단축키 | 기능 |
|--------|------|
| `Ctrl+B` / `Cmd+B` | Bold |
| `Ctrl+I` / `Cmd+I` | Italic |
| `Ctrl+U` / `Cmd+U` | Underline |
| `Ctrl+Z` / `Cmd+Z` | Undo |
| `Ctrl+Shift+Z` / `Cmd+Shift+Z` | Redo |

---

## 🐛 문제 해결

### "Hydration error" 발생
```tsx
// ❌ 잘못된 방법
import TiptapEditor from '@/components/TiptapEditor';

// ✅ 올바른 방법
import dynamic from 'next/dynamic';
const TiptapEditor = dynamic(() => import('@/components/TiptapEditor'), { 
  ssr: false 
});
```

### 체크박스가 보이지 않음
```css
/* src/app/globals.css에 추가 확인 */
@import "./css/editor.css";
```

### 이미지 업로드 실패
```tsx
onImageUpload={async (file) => {
  // 반드시 문자열 URL을 반환해야 함
  return 'https://...';  // ✅
  // return null;  // ❌
}}
```

---

## 📂 파일 구조

```
src/
├── components/
│   ├── TiptapEditor.tsx          ← 메인 에디터
│   ├── WysiwygEditor.tsx         ← 기본 에디터
│   └── PostFormWithEditor.tsx    ← 통합 폼
├── lib/
│   └── markdown-converter.ts     ← 변환 유틸
├── app/
│   ├── css/
│   │   └── editor.css            ← 에디터 스타일
│   └── editor-demo/
│       └── page.tsx              ← 데모
```

---

## 🎁 주요 기능 체크리스트

### 텍스트
- [x] Bold, Italic, Underline, Strikethrough
- [x] Text Color
- [x] Highlight

### 구조
- [x] Headings (H1, H2, H3)
- [x] Paragraph
- [x] Bullet List
- [x] Numbered List
- [x] Task List (Checkbox)

### 정렬
- [x] Left, Center, Right, Justify
- [x] Indent / Outdent

### 미디어
- [x] Image Upload
- [x] Link

### 도구
- [x] Undo / Redo
- [x] Clear Formatting
- [x] Word Count
- [x] Print
- [x] Zoom

---

## 💡 팁

### 1. 성능 최적화
```tsx
// onChange에 debounce 적용
import { useMemo } from 'react';
import debounce from 'lodash/debounce';

const debouncedOnChange = useMemo(
  () => debounce((html) => setContent(html), 300),
  []
);

<TiptapEditor onChange={debouncedOnChange} />
```

### 2. 초기값 설정
```tsx
const [content, setContent] = useState(`
  <h1>제목</h1>
  <p>내용...</p>
`);

<TiptapEditor value={content} onChange={setContent} />
```

### 3. 읽기 전용 모드
Tiptap의 `editable` 옵션 사용:
```tsx
// TiptapEditor.tsx에서
const editor = useEditor({
  editable: false,  // 읽기 전용
  // ...
});
```

---

## 📞 더 많은 정보

- 📖 **상세 가이드**: `EDITOR_INTEGRATION_README.md`
- 🔧 **설정 매뉴얼**: `WYSIWYG_SETUP.md`
- 📋 **요약**: `WYSIWYG_EDITOR_SUMMARY.md`
- 🌐 **Tiptap 문서**: https://tiptap.dev/

---

## ⚡ 한 줄 요약

```tsx
import PostFormWithEditor from '@/components/PostFormWithEditor';
export default () => <PostFormWithEditor />;
```

**그게 전부입니다!** 🚀
