'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Markdown } from '@tiptap/markdown'
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import { Table } from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';
import { useState, useEffect } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Undo,
  Redo,
  Printer,
  Copy,
  ChevronDown,
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Link2,
  ImageIcon,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Indent,
  Outdent,
  Menu,
  RemoveFormatting,
  Type,
  ListTodo,
  ArrowUpFromLine
} from 'lucide-react';
import { UploadedFileResponse } from './PostForm';
import { PostSelectGroups, UpdateSelectGroups } from './CategorySelect';
import { toast } from 'sonner';
import { PostEditProps } from './UpdateForm';
import { Button } from './ui/button';
import { useFormStatus } from 'react-dom';
import { Spinner } from './ui/spinner';
import DOMPurify from "isomorphic-dompurify";
import { Node, mergeAttributes } from '@tiptap/core'
import "./TiptapEditor.css";

interface TiptapEditorProps {
  value: string;
  onChange: (html: string, markdown: string) => void;
  onImageUpload?: (file: File) => Promise<UploadedFileResponse | null>;
  initialData?: PostEditProps // 업데이트값이 있을 때 쓸 것
}

// PostForm, UpdateForm에서 마크다운 미리보기
// video를 업로드하면 마크다운으로 변환을 못해서(마크다운 문법 자체가 없으니까)
// 미리보기에서 video 태그는 생략되는 현상 있음

export default function TiptapEditor({ value, onChange, onImageUpload, initialData }: TiptapEditorProps) {
  const [zoom, setZoom] = useState('100%');
  const [fontSize, setFontSize] = useState(16);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Markdown,
      Table.configure({
        resizable: true, // 드래그로 크기 조정 가능
      }),
      TableRow,
      TableHeader,
      // Note: TableCell은 기본적으로 단락 노드를 포함합니다.
      TableCell,
      Underline,
      Link.configure({
        openOnClick: false,
        autolink: true,
      }),
      Image,
      Video,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Highlight.configure({
        multicolor: true,
      }),
      TextStyle,
      Color,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
    ],
    parseOptions: {
      preserveWhitespace: "full",
    },
    content: value,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none min-h-[500px] lg:min-h-[700px] max-w-none',
      },
      // handlePaste(view, event, slice) {
      handlePaste(view, event) {
        const text = event.clipboardData?.getData('text/plain');

        if (text && editor) {
          const markdownStorage = editor.markdown;

          // 🧹 1. 복붙한 텍스트 즉시 정화 (XSS 방지)
          // - Markdown 내 HTML 블록 (<script>, <iframe> 등) 제거
          // - 단순 텍스트라면 영향 거의 없음
          const cleanText = DOMPurify.sanitize(text, { ALLOWED_TAGS: [] });

          if (markdownStorage && markdownStorage.parse) {
            try {
              // 2. 정화된 Markdown을 ProseMirror JSON으로 파싱
              const parsedContent = markdownStorage.parse(cleanText);

              if (parsedContent) {
                // 3. 삽입
                editor.chain()
                  .focus()
                  .insertContent(parsedContent)
                  .run();

                return true; // 기본 붙여넣기 방지
              }
            } catch (e) {
              console.warn("Markdown parse failed:", e);
              toast.warning("Parse 실패. 공격 시도에 주의하세요. " + e)
            }
          }

          // 파서 실패 시 그냥 정화된 텍스트 삽입
          editor.commands.insertContent(cleanText);
          return true;
        }

        return false;
      }

      // xss 방지 전 백업용
/*             handlePaste(view, event) {
        const text = event.clipboardData?.getData('text/plain');

        if (text && editor) {
          // 1. tiptap-markdown 확장 인스턴스에 접근
          //    (tiptap-markdown은 일반적으로 storage에 markdown 객체를 등록합니다.)
          const markdownStorage = editor.markdown;

          // 2. 마크다운 파서가 존재하는지 확인하고 텍스트를 JSON(ProseMirror 노드)으로 파싱
          if (markdownStorage && markdownStorage.parse) {
            
            // 파싱: 마크다운 텍스트를 Tiptap/ProseMirror 노드 구조(JSON)로 변환
            // 파싱 결과는 { type: 'doc', content: [...] } 형태의 JSON 객체입니다.
            const parsedContent = markdownStorage.parse(text); 

            if (parsedContent) {
              // 3. 변환된 콘텐츠(JSON)를 현재 커서 위치에 삽입
              editor.chain()
                .focus()
                // insertContent는 JSON 객체를 잘 처리합니다.
                .insertContent(parsedContent) 
                .run();
              
              // 기본 붙여넣기 동작 방지
              return true; 
            }
          }
          
          // 파싱에 실패하거나 파서 API가 없을 경우,
          // insertContent를 한 번 더 시도하여 줄바꿈만 해결하도록 합니다.
          editor.commands.insertContent(text);
          return true;
        }

        return false;
      } */
    },
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const markdown = editor.getMarkdown();
      onChange(html, markdown);
    },
  });

/*   useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]); */

  // update에서 기존 데이터 불러오는 로직
  useEffect(() => {
    if(editor && initialData) {
      const htmlContent = initialData.post.content;
      
      // 1. 에디터에 HTML 콘텐츠 설정
      editor.commands.setContent(htmlContent);
      
      // 2. Tiptap이 HTML을 노드로 파싱할 시간을 기다립니다 (필요할 경우)
      //    setContent 직후에는 일반적으로 바로 getMarkdown을 호출해도 됩니다.
      
      // 3. 설정된 노드를 마크다운으로 변환
      const markdown = editor.getMarkdown();

      // 4. 부모 컴포넌트의 상태를 이 마크다운으로 초기화하기 위해 onChange 호출
      if (markdown) {
        // ⭐ HTML과 마크다운을 함께 부모로 전달
        onChange(htmlContent, markdown); 
      }
    }
  }, [initialData, editor, onChange]);
  // 참고: useEffect의 의존성 배열에 onChange를 포함하면 무한 루프 가능성이 있으나,
  // TiptapEditor의 value 상태를 건드리지 않으므로 여기서는 괜찮습니다.
  // useCallback을 사용해서 무한루프 방지

  if (!editor) {
    return null;
  }

  const handleImageInsert = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onImageUpload) return;
    
    const uploadResponse = await onImageUpload(file);

    if (uploadResponse) {
      const mimeType = file.type;
      if (mimeType.startsWith('video/')) {
        // editor.chain().focus().setImage({ src: uploadResponse.url.mediumUrl, alt: `video:${uploadResponse.originalFilename}`, title: uploadResponse.originalFilename }).run();
        editor.chain().focus().insertContent({
          type: "video",
          attrs: {
            src: uploadResponse.url.mediumUrl,
          }
        }).run();
      }
      else {
        editor.chain().focus().setImage({ src: uploadResponse.url.mediumUrl, alt: uploadResponse.originalFilename, title: uploadResponse.originalFilename }).run();
      }

      toast.success("업로드 완료");
    }
    else {
      console.error("파일 업로드 실패");
      toast.error("파일 업로드에 실패했습니다.");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const addLink = () => {
    const url = window.prompt('텍스트를 드래그한 후 URL을 입력하면 동작합니다.\nURL을 입력하세요:\n');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const wordCount = editor.getText().split(/\s+/).filter(Boolean).length;

  return (
    <div className="w-full max-w-[1008px] lg:max-w-none mx-auto border border-[#E1E1E2] rounded-xl shadow-[0_1px_0_0_rgba(26,26,26,0.08),0_2px_4px_-1px_rgba(26,26,26,0.08)] overflow-hidden bg-white">
      {/* Desktop/Tablet Top Menu Bar */}
      <div className="hidden md:flex items-center justify-between px-4 md:px-6 py-2.5 md:py-[10px] border-b border-[#E1E1E2] bg-[#FCFCFC]">
        <div className="flex items-center gap-1 flex-1">
          <button type="button" className="h-9 px-3 flex items-center justify-center rounded-xl text-sm font-semibold text-[rgba(26,26,26,0.7)] hover:bg-accent transition-colors">File</button>
          <button type="button" className="h-9 px-3 flex items-center justify-center rounded-xl text-sm font-semibold text-[rgba(26,26,26,0.7)] hover:bg-accent transition-colors">Edit</button>
          <button type="button" className="h-9 px-3 flex items-center justify-center rounded-xl text-sm font-semibold text-[rgba(26,26,26,0.7)] hover:bg-accent transition-colors">View</button>
          <button type="button" className="h-9 px-3 flex items-center justify-center rounded-xl text-sm font-semibold text-[rgba(26,26,26,0.7)] hover:bg-accent transition-colors">Insert</button>
          <button type="button" className="h-9 px-3 flex items-center justify-center rounded-xl text-sm font-semibold text-[rgba(26,26,26,0.7)] hover:bg-accent transition-colors">Format</button>
          <button type="button" className="h-9 px-3 flex items-center justify-center rounded-xl text-sm font-semibold text-[rgba(26,26,26,0.7)] hover:bg-accent transition-colors">Tools</button>
          <button type="button" className="h-9 px-3 flex items-center justify-center rounded-xl text-sm font-semibold text-[rgba(26,26,26,0.7)] hover:bg-accent transition-colors">Help</button>
        </div>
        {/*         <Button className="h-11 bg-[#2463EB] hover:bg-[#2463EB]/90 text-white rounded-xl px-4 shadow-[0_1px_2px_0_rgba(26,26,26,0.08)] transition-colors">
                  Posting
                </Button> */}

        <div className="flex items-center gap-2">
          {/* 카테고리 선택 */}
          {initialData ? <UpdateSelectGroups value={initialData.post.category} /> : <PostSelectGroups />}
          {/* 게시 버튼 */}
          <SubmitButton />
        </div>

      </div>

      {/* Mobile Header */}
      <div className="flex md:hidden items-center justify-between px-4 py-3 border-b border-[#E1E1E2] bg-[#FCFCFC]">
        
        <button type="button" 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 hover:bg-accent rounded transition-colors"
          aria-label="Menu"
        >
          <Menu className="size-6" />
        </button>

        <div className="flex items-center gap-2">
          {/* 카테고리 선택 */}
          {initialData ? <UpdateSelectGroups value={initialData.post.category} /> : <PostSelectGroups />}
          {/* 게시 버튼 */}
          <SubmitButton />
        </div>

      </div>

      {/* Desktop/Tablet Toolbar */}
      <div className="hidden md:flex items-center gap-3 md:gap-5 px-4 md:px-5 py-4 md:py-5 border border-[#E1E1E2] bg-white flex-wrap justify-center content-center">
        {/* Undo/Redo Group */}
        <div className="flex items-center justify-center gap-3">
          <button type="button"
            onClick={() => editor.chain().focus().undo().run()}
            className="p-0 hover:opacity-70 transition-opacity"
            title="Undo"
            disabled={!editor.can().undo()}
          >
            <Undo className="size-6 text-[#52525B]" />
          </button>
          <button type="button"
            onClick={() => editor.chain().focus().redo().run()}
            className="p-0 hover:opacity-70 transition-opacity"
            title="Redo"
            disabled={!editor.can().redo()}
          >
            <Redo className="size-6 text-[#52525B]" />
          </button>
        </div>

        {/* Print & Tools Group */}
        <div className="flex items-center justify-center content-center gap-3 flex-wrap">
          <button type="button" onClick={handlePrint} className="p-0 hover:opacity-70 transition-opacity" title="Print">
            <Printer className="size-6 text-[#52525B]" />
          </button>
          <button type="button" className="p-0 hover:opacity-70 transition-opacity" title="Paint Format">
            <Copy className="size-6 text-[#52525B]" />
          </button>

          {/* Zoom */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button type="button" className="flex items-center gap-1 px-1 h-6 hover:opacity-70 transition-opacity">
                <span className="text-sm text-[#52525B]">{zoom}</span>
                <ChevronDown className="size-6 text-[#52525B]" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setZoom('50%')}>50%</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setZoom('75%')}>75%</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setZoom('100%')}>100%</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setZoom('125%')}>125%</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setZoom('150%')}>150%</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Font Group */}
          <div className="flex items-center justify-center gap-3">

            {/* Paragraph Type */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button type="button" className="flex items-center gap-1 px-1 h-6 bg-[#F4F4F5] rounded hover:bg-[#E5E5E7] transition-colors">
                  <span className="text-sm text-[#52525B]">Paragraph text</span>
                  <ChevronDown className="size-6 text-[#52525B]" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => editor.chain().focus().setParagraph().run()}>
                  Paragraph text
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
                  Heading 1
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
                  Heading 2
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
                  Heading 3
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Font Family */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button type="button" className="flex items-center gap-1 px-1 h-6 bg-[#F4F4F5] rounded hover:bg-[#E5E5E7] transition-colors">
                  <span className="text-sm text-[#52525B]">Arial</span>
                  <ChevronDown className="size-6 text-[#52525B]" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Arial</DropdownMenuItem>
                <DropdownMenuItem>Times New Roman</DropdownMenuItem>
                <DropdownMenuItem>Courier New</DropdownMenuItem>
                <DropdownMenuItem>Georgia</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Font Size Counter */}
            <div className="flex items-center h-6 gap-1 border border-[#E1E1E2] bg-[#FCFCFC] rounded-xl shadow-[0_1px_2px_0_rgba(26,26,26,0.08)]">
              <button type="button"
                onClick={() => setFontSize(Math.max(8, fontSize - 2))}
                className="w-9 h-6 flex items-center justify-center rounded-xl hover:bg-accent transition-colors"
              >
                <span className="text-[#52525B]">−</span>
              </button>
              <span className="min-w-[21px] text-sm text-[rgba(26,26,26,0.7)] text-center">{fontSize}</span>
              <button type="button"
                onClick={() => setFontSize(Math.min(72, fontSize + 2))}
                className="w-9 h-6 flex items-center justify-center rounded-xl hover:bg-accent transition-colors"
              >
                <span className="text-[#52525B]">+</span>
              </button>
            </div>
          </div>

          <div className="w-[10px] h-6 border-r border-[#E1E1E2]" />
        </div>

        {/* Text Formatting Group */}
        <div className="flex items-center justify-center gap-3">
          <button type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-0 hover:opacity-70 transition-opacity ${editor.isActive('bold') ? 'opacity-100' : ''}`}
            title="Bold (Ctrl+B)"
          >
            <Bold className="size-6 text-[#52525B]" />
          </button>
          <button type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-0 hover:opacity-70 transition-opacity ${editor.isActive('italic') ? 'opacity-100' : ''}`}
            title="Italic (Ctrl+I)"
          >
            <Italic className="size-6 text-[#52525B]" />
          </button>
          <button type="button"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`p-0 hover:opacity-70 transition-opacity ${editor.isActive('underline') ? 'opacity-100' : ''}`}
            title="Underline (Ctrl+U)"
          >
            <UnderlineIcon className="size-6 text-[#52525B]" />
          </button>
          <button type="button"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`p-0 hover:opacity-70 transition-opacity ${editor.isActive('strike') ? 'opacity-100' : ''}`}
            title="Strikethrough"
          >
            <Strikethrough className="size-6 text-[#52525B]" />
          </button>

          {/* Highlight Color */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button type="button" className="flex items-center gap-1 p-0 hover:opacity-70 transition-opacity">
                <div className="size-6 bg-[#2463EB] rounded border border-[#E1E1E2]" />
                <ChevronDown className="size-6 text-[#52525B]" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <div className="grid grid-cols-5 gap-2 p-2">
                <button type="button"
                  onClick={() => editor.chain().focus().toggleHighlight({ color: '#fef08a' }).run()}
                  className="size-6 bg-yellow-300 rounded hover:scale-110 transition-transform"
                />
                <button type="button"
                  onClick={() => editor.chain().focus().toggleHighlight({ color: '#2563eb' }).run()}
                  className="size-6 bg-blue-600 rounded hover:scale-110 transition-transform"
                />
                <button type="button"
                  onClick={() => editor.chain().focus().toggleHighlight({ color: '#22c55e' }).run()}
                  className="size-6 bg-green-500 rounded hover:scale-110 transition-transform"
                />
                <button type="button"
                  onClick={() => editor.chain().focus().toggleHighlight({ color: '#ef4444' }).run()}
                  className="size-6 bg-red-500 rounded hover:scale-110 transition-transform"
                />
                <button type="button"
                  onClick={() => editor.chain().focus().toggleHighlight({ color: '#a855f7' }).run()}
                  className="size-6 bg-purple-500 rounded hover:scale-110 transition-transform"
                />
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Text Color */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button type="button" className="p-0 hover:opacity-70 transition-opacity" title="Text Color">
                <Type className="size-6 text-[#52525B]" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <div className="grid grid-cols-5 gap-2 p-2">
                <button type="button"
                  onClick={() => editor.chain().focus().setColor('#000000').run()}
                  className="size-6 bg-black rounded hover:scale-110 transition-transform"
                />
                <button type="button"
                  onClick={() => editor.chain().focus().setColor('#ef4444').run()}
                  className="size-6 bg-red-500 rounded hover:scale-110 transition-transform"
                />
                <button type="button"
                  onClick={() => editor.chain().focus().setColor('#2563eb').run()}
                  className="size-6 bg-blue-600 rounded hover:scale-110 transition-transform"
                />
                <button type="button"
                  onClick={() => editor.chain().focus().setColor('#22c55e').run()}
                  className="size-6 bg-green-500 rounded hover:scale-110 transition-transform"
                />
                <button type="button"
                  onClick={() => editor.chain().focus().setColor('#a855f7').run()}
                  className="size-6 bg-purple-500 rounded hover:scale-110 transition-transform"
                />
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="w-[10px] h-6 border-r border-[#E1E1E2]" />
        </div>

        {/* Link & Image Group */}
        <div className="flex items-center justify-center gap-3">
          <button type="button"
            onClick={addLink}
            className={`p-0 hover:opacity-70 transition-opacity ${editor.isActive('link') ? 'opacity-100' : ''}`}
            title="Insert Link"
          >
            <Link2 className="size-6 text-[#52525B]" />
          </button>
          <label className="p-0 hover:opacity-70 cursor-pointer transition-opacity" title="Insert Image">
            <ImageIcon className="size-6 text-[#52525B]" />
            <input
              type="file"
              accept="image/*, video/*"
              onChange={handleImageInsert}
              className="hidden"
            />
          </label>

          <div className="w-[10px] h-6 border-r border-[#E1E1E2]" />
        </div>

        {/* Lists & Paragraph Group */}
        <div className="flex items-center justify-center content-center gap-5 flex-wrap">
          <div className="flex items-center justify-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button type="button" className="flex items-center gap-1 p-0 hover:opacity-70 transition-opacity">
                  <List className="size-6 text-[#52525B]" />
                  <ChevronDown className="size-6 text-[#52525B]" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => editor.chain().focus().toggleBulletList().run()}>Bullet List</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button type="button" className="flex items-center gap-1 p-0 hover:opacity-70 transition-opacity">
                  <ListOrdered className="size-6 text-[#52525B]" />
                  <ChevronDown className="size-6 text-[#52525B]" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => editor.chain().focus().toggleOrderedList().run()}>Numbered List</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button type="button" className="flex items-center gap-1 p-0 hover:opacity-70 transition-opacity">
                  <ListTodo className="size-6 text-[#52525B]" />
                  <ChevronDown className="size-6 text-[#52525B]" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => editor.chain().focus().toggleTaskList().run()}>Task List</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Alignment */}
          <div className="flex items-center justify-center gap-3">
            <button type="button"
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
              className={`p-0 hover:opacity-70 transition-opacity ${editor.isActive({ textAlign: 'left' }) ? 'opacity-100' : ''}`}
              title="Align Left"
            >
              <AlignLeft className="size-6 text-[#52525B]" />
            </button>
            <button type="button"
              onClick={() => editor.chain().focus().setTextAlign('center').run()}
              className={`p-0 hover:opacity-70 transition-opacity ${editor.isActive({ textAlign: 'center' }) ? 'opacity-100' : ''}`}
              title="Align Center"
            >
              <AlignCenter className="size-6 text-[#52525B]" />
            </button>
            <button type="button"
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
              className={`p-0 hover:opacity-70 transition-opacity ${editor.isActive({ textAlign: 'right' }) ? 'opacity-100' : ''}`}
              title="Align Right"
            >
              <AlignRight className="size-6 text-[#52525B]" />
            </button>
            <button type="button"
              onClick={() => editor.chain().focus().setTextAlign('justify').run()}
              className={`p-0 hover:opacity-70 transition-opacity ${editor.isActive({ textAlign: 'justify' }) ? 'opacity-100' : ''}`}
              title="Justify"
            >
              <AlignJustify className="size-6 text-[#52525B]" />
            </button>
          </div>

          {/* Edit Tools */}
          <div className="flex items-center justify-center gap-3">
            <button type="button" className="p-0 hover:opacity-70 transition-opacity" title="Paragraph Spacing">
              <Menu className="size-6 text-[#52525B]" />
            </button>
            <button type="button" className="p-0 hover:opacity-70 transition-opacity" title="Indent Left">
              <Indent className="size-6 text-[#52525B]" />
            </button>
            <button type="button" className="p-0 hover:opacity-70 transition-opacity" title="Indent Right">
              <Outdent className="size-6 text-[#52525B]" />
            </button>
            <button type="button"
              onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
              className="p-0 hover:opacity-70 transition-opacity"
              title="Clear Formatting"
            >
              <RemoveFormatting className="size-6 text-[#52525B]" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Toolbar */}
      <div className="flex md:hidden items-center gap-1 px-3 py-2 border-b border-[#E1E1E2] flex-wrap bg-white">
        <button type="button" 
          onClick={() => editor.chain().focus().undo().run()} 
          className="p-2 hover:bg-accent rounded transition-colors"
          disabled={!editor.can().undo()}
        >
          <Undo className="size-5 text-muted-foreground" />
        </button>
        <button type="button" 
          onClick={() => editor.chain().focus().redo().run()} 
          className="p-2 hover:bg-accent rounded transition-colors"
          disabled={!editor.can().redo()}
        >
          <Redo className="size-5 text-muted-foreground" />
        </button>
        <button type="button" 
          onClick={() => editor.chain().focus().toggleBold().run()} 
          className={`p-2 hover:bg-accent rounded transition-colors ${editor.isActive('bold') ? 'bg-accent' : ''}`}
        >
          <Bold className="size-5" />
        </button>
        <button type="button" 
          onClick={() => editor.chain().focus().toggleItalic().run()} 
          className={`p-2 hover:bg-accent rounded transition-colors ${editor.isActive('italic') ? 'bg-accent' : ''}`}
        >
          <Italic className="size-5" />
        </button>
        <button type="button" 
          onClick={() => editor.chain().focus().toggleUnderline().run()} 
          className={`p-2 hover:bg-accent rounded transition-colors ${editor.isActive('underline') ? 'bg-accent' : ''}`}
        >
          <UnderlineIcon className="size-5" />
        </button>
        <button type="button" 
          onClick={() => editor.chain().focus().toggleStrike().run()} 
          className={`p-2 hover:bg-accent rounded transition-colors ${editor.isActive('strike') ? 'bg-accent' : ''}`}
        >
          <Strikethrough className="size-5" />
        </button>
        
        <button type="button" className="flex items-center gap-1 p-2 hover:bg-accent rounded transition-colors">
          <div className="size-5 bg-blue-600 rounded" />
          <ChevronDown className="size-3 text-muted-foreground" />
        </button>

        <button type="button" className="p-2 hover:bg-accent rounded transition-colors">
          <Type className="size-5" />
        </button>

        <button type="button" 
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={`p-2 hover:bg-accent rounded transition-colors ${editor.isActive({ textAlign: 'left' }) ? 'bg-accent' : ''}`}
        >
          <AlignLeft className="size-5 text-muted-foreground" />
        </button>
        <button type="button" 
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={`p-2 hover:bg-accent rounded transition-colors ${editor.isActive({ textAlign: 'center' }) ? 'bg-accent' : ''}`}
        >
          <AlignCenter className="size-5 text-muted-foreground" />
        </button>
        <button type="button" 
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={`p-2 hover:bg-accent rounded transition-colors ${editor.isActive({ textAlign: 'right' }) ? 'bg-accent' : ''}`}
        >
          <AlignRight className="size-5 text-muted-foreground" />
        </button>
        <button type="button" 
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          className={`p-2 hover:bg-accent rounded transition-colors ${editor.isActive({ textAlign: 'justify' }) ? 'bg-accent' : ''}`}
        >
          <AlignJustify className="size-5 text-muted-foreground" />
        </button>
        <button type="button" 
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 hover:bg-accent rounded transition-colors ${editor.isActive('bulletList') ? 'bg-accent' : ''}`}
        >
          <List className="size-5 text-muted-foreground" />
        </button>
        <button type="button" 
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 hover:bg-accent rounded transition-colors ${editor.isActive('orderedList') ? 'bg-accent' : ''}`}
        >
          <ListOrdered className="size-5 text-muted-foreground" />
        </button>
        <button type="button" 
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          className={`p-2 hover:bg-accent rounded transition-colors ${editor.isActive('taskList') ? 'bg-accent' : ''}`}
        >
          <ListTodo className="size-5 text-muted-foreground" />
        </button>
        <button type="button" 
          onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
          className="p-2 hover:bg-accent rounded transition-colors"
        >
          <RemoveFormatting className="size-5 text-muted-foreground" />
        </button>
      </div>

      {/* Editor Content Area */}
      <div className="p-6 md:p-8 lg:p-8 min-h-[600px] md:min-h-[700px] lg:min-h-[800px] bg-white">
        <EditorContent editor={editor} />
      </div>

      {/* Footer */}
      <div className="px-4 md:px-4 py-2.5 md:py-[10px] border-t border-[#E1E1E2] flex items-center justify-between text-sm md:text-base text-[rgba(26,26,26,0.7)] bg-[#FCFCFC]">
        <span>{wordCount} words</span>
      </div>
    </div>
  );
}

// 게시 버튼
export function SubmitButton() {
    const { pending } = useFormStatus();
    
    return (
        <Button 
            type="submit" 
            disabled={pending}
            className="h-11 w-16 bg-[#2463EB] hover:bg-[#2463EB]/90 text-white rounded-xl px-4 shadow-[0_1px_2px_0_rgba(26,26,26,0.08)] transition-colors"
        >
            {pending ? <Spinner color='white' /> : <ArrowUpFromLine color='white' />}
        </Button>
    );
}

// 실제 업로드 로직을 담을 함수
export async function uploadFile(file: File): Promise<UploadedFileResponse | null> {
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

const Video = Node.create({
  name: 'video', // 노드 이름 정의
  group: 'block', // 블록 요소로 처리 (단락 등과 동등)
  selectable: true, // 에디터에서 선택 가능하게 함
  draggable: true, // 드래그 가능하게 함
  atom: true, // 하나의 단위(unit)로 처리

  // 1. 속성(Attributes) 정의
  // 여기서는 비디오의 소스 URL과 너비, 높이, 컨트롤 여부를 정의합니다.
  addAttributes() {
    return {
      src: { default: null },
      controls: { default: true },
      class: { default: "md:max-h-[720px] md:h-auto md:max-w-full" } // 상세보기에서 보여지는 거 설정
    }
  },

  // 2. HTML 파싱(Parsing) 규칙 정의
  // 외부 HTML(예: 불러온 기존 콘텐츠)에서 <video> 태그를 만났을 때 이 노드로 인식하게 합니다.
  parseHTML() {
    return [{
      tag: 'video',
    }]
  },

  // 3. HTML 렌더링 규칙 정의 (에디터 콘텐츠 출력 시)
  // Tiptap 콘텐츠를 HTML로 내보낼 때 어떻게 렌더링할지 정의합니다.
  renderHTML({ HTMLAttributes }) {
    return ['video', mergeAttributes(HTMLAttributes, {
      class: "md:max-h-[720px] md:h-auto md:max-w-full", // 에디터에서 보여지는 거 설정
    })]
  },

  // 4. 입력 규칙 정의 (선택 사항: 마크다운처럼 특정 텍스트로 삽입)
  // 예를 들어, /video <URL>과 같은 명령으로 삽입하는 기능을 추가할 수 있습니다.
  // ...
})