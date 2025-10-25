# WYSIWYG Editor 통합 가이드

Figma 디자인을 기반으로 한 Next.js WYSIWYG 에디터가 성공적으로 통합되었습니다.

## 📦 설치된 패키지

```bash
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-link @tiptap/extension-image @tiptap/extension-text-align @tiptap/extension-underline @tiptap/extension-color @tiptap/extension-text-style @tiptap/extension-highlight @tiptap/extension-task-list @tiptap/extension-task-item @tiptap/extension-typography
```

## 📁 생성된 파일

### 컴포넌트
1. **`src/components/WysiwygEditor.tsx`** - 기본 WYSIWYG 에디터 (Tiptap 없이 사용 가능)
2. **`src/components/TiptapEditor.tsx`** - Tiptap 기반 풀기능 에디터 ⭐ 권장
3. **`src/components/PostFormWithEditor.tsx`** - 에디터가 통합된 PostForm

### 유틸리티
4. **`src/lib/markdown-converter.ts`** - HTML ↔ Markdown 변환 유틸리티

### 스타일
5. **`src/app/css/editor.css`** - 에디터 전용 스타일

### 데모 페이지
6. **`src/app/editor-demo/page.tsx`** - 데모 및 테스트 페이지

### 문서
7. **`WYSIWYG_SETUP.md`** - 상세 설정 가이드
8. **`EDITOR_INTEGRATION_README.md`** - 이 문서

## 🚀 빠른 시작

### 1. 데모 페이지 확인

```bash
npm run dev
```

브라우저에서 `http://localhost:3000/editor-demo` 접속

### 2. 기존 PostForm 교체

#### 옵션 A: 새 게시물 작성 페이지에서 사용

`src/app/posts/new/page.tsx`:

```tsx
import PostFormWithEditor from '@/components/PostFormWithEditor';

export default function NewPostPage() {
  return (
    <main className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">새 게시물 작성</h1>
      <PostFormWithEditor />
    </main>
  );
}
```

#### 옵션 B: 기존 PostForm 컴포넌트 교체

`src/components/PostForm.tsx`를 `PostFormWithEditor.tsx`의 내용으로 교체

## ✨ 주요 기능

### Desktop 뷰 (1008px+)
- ✅ 완전한 메뉴 바 (File, Edit, View, Insert, Format, Tools, Help)
- ✅ 전체 툴바 (텍스트 포맷팅, 리스트, 정렬, 링크, 이미지 등)
- ✅ 실시간 WYSIWYG 편집
- ✅ 마크다운 출력 지원

### Mobile 뷰 (360px - 1007px)
- ✅ 햄버거 메뉴
- ✅ 간소화된 툴바
- ✅ 터치 친화적 버튼 크기
- ✅ 반응형 레이아웃

### 공통 기능
- ✅ **텍스트 포맷팅**: Bold, Italic, Underline, Strikethrough
- ✅ **리스트**: Bullet, Numbered, Checklist (Task List)
- ✅ **정렬**: Left, Center, Right, Justify
- ✅ **색상**: 텍스트 색상, 하이라이트
- ✅ **미디어**: 이미지 업로드 및 삽입
- ✅ **링크**: 하이퍼링크 생성
- ✅ **Undo/Redo**: 실행 취소/다시 실행
- ✅ **단축키 지원**: Ctrl+B (Bold), Ctrl+I (Italic), Ctrl+U (Underline) 등
- ✅ **단어 수 카운터**
- ✅ **HTML → Markdown 자동 변환**

## 🎨 디자인 매칭

Figma 디자인과 정확히 일치:
- ✅ 테두리: `border-black/10` (rgba(0,0,0,0.1))
- ✅ 모서리: `rounded-xl` (12px)
- ✅ 그림자: `shadow-[0_4px_64px_0_rgba(0,152,186,0.15)]`
- ✅ Post 버튼: `bg-blue-600` (#2563eb)
- ✅ 아이콘: lucide-react 사용
- ✅ 반응형: Tailwind CSS `lg:` 브레이크포인트

## 🔧 커스터마이징

### 툴바 버튼 추가

`src/components/TiptapEditor.tsx`에서:

```tsx
<button 
  onClick={() => editor.chain().focus().toggleCodeBlock().run()}
  className="p-2 hover:bg-accent rounded"
  title="Code Block"
>
  <Code className="size-5 text-muted-foreground" />
</button>
```

### 스타일 변경

`src/app/css/editor.css`에서 `.ProseMirror` 클래스 스타일 수정:

```css
.ProseMirror {
  font-family: 'Your Custom Font', sans-serif;
  font-size: 18px;
  /* ... */
}
```

### 마크다운 변환 로직 수정

`src/lib/markdown-converter.ts`에서 `htmlToMarkdown` 함수 수정

## 📝 사용 예시

### 기본 사용

```tsx
'use client';

import { useState } from 'react';
import TiptapEditor from '@/components/TiptapEditor';
import { htmlToMarkdown } from '@/lib/markdown-converter';

export default function MyPage() {
  const [content, setContent] = useState('');
  
  const handleSave = () => {
    const markdown = htmlToMarkdown(content);
    console.log('Markdown:', markdown);
    // Save to database
  };

  return (
    <div>
      <TiptapEditor 
        value={content}
        onChange={setContent}
        onImageUpload={async (file) => {
          // Upload logic
          return 'https://your-cdn.com/image.jpg';
        }}
      />
      <button onClick={handleSave}>저장</button>
    </div>
  );
}
```

### 이미지 업로드 통합

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

<TiptapEditor 
  value={content}
  onChange={setContent}
  onImageUpload={handleImageUpload}
/>
```

## 🐛 문제 해결

### 1. Tiptap이 SSR에서 에러 발생

**해결**: `dynamic` import 사용

```tsx
import dynamic from 'next/dynamic';

const TiptapEditor = dynamic(() => import('@/components/TiptapEditor'), { 
  ssr: false 
});
```

### 2. 체크박스가 제대로 렌더링되지 않음

**해결**: `editor.css`가 `globals.css`에 import되었는지 확인

```css
/* src/app/globals.css */
@import "./css/editor.css";
```

### 3. 이미지 업로드가 작동하지 않음

**해결**: `onImageUpload` prop이 올바른 URL을 반환하는지 확인

```tsx
onImageUpload={async (file) => {
  // Must return a valid image URL
  return 'https://example.com/image.jpg';
}}
```

### 4. 마크다운 변환이 정확하지 않음

**해결**: `markdown-converter.ts`의 정규식 패��� 조정 또는 `turndown` 라이브러리 사용:

```bash
npm install turndown
```

```tsx
import TurndownService from 'turndown';

const turndownService = new TurndownService();
const markdown = turndownService.turndown(html);
```

## 📚 추가 리소스

- [Tiptap 공식 문서](https://tiptap.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)
- [Radix UI](https://www.radix-ui.com/)

## 🎯 다음 단계

1. ✅ ~~Tiptap 설치~~
2. ✅ ~~에디터 컴포넌트 생성~~
3. ✅ ~~PostForm 통합~~
4. ⬜ 프로덕션 배포 전 테스트
5. ⬜ 사용자 피드백 수집
6. ⬜ 추가 기능 개발 (예: 표, 이모지, 코드 하이라이팅)

## 💡 팁

- **성능**: 큰 문서의 경우 debounce를 사용하여 onChange 이벤트 최적화
- **접근성**: ARIA 라벨 추가로 스크린 리더 지원 개선
- **보안**: 사용자 입력 HTML을 서버에서 sanitize 처리
- **SEO**: 마크다운을 서버에서 HTML로 렌더링하여 검색 엔진 최적화

## 📞 지원

문제가 발생하면 다음을 확인하세요:
1. Node.js 버전 (권장: v18+)
2. 패키지 설치 상태 (`npm install` 재실행)
3. 브라우저 콘솔 에러 메시지
4. `WYSIWYG_SETUP.md` 문서
