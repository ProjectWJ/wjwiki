'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
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

interface TiptapEditorProps {
  value: string;
  onChange: (value: string) => void;
  onImageUpload?: (file: File) => Promise<UploadedFileResponse | null>;
  initialData?: PostEditProps // 업데이트값이 있을 때 쓸 것
}

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
      Underline,
      Link.configure({
        openOnClick: false,
      }),
      Image,
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
    content: value,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none min-h-[500px] lg:min-h-[700px] max-w-none',
      },
    },
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const markdown = editor.getHTML();
      onChange(markdown);
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  // update에서 기존 데이터 불러오는 로직
  useEffect(() => {
    if(editor && initialData) {
      editor.commands.setContent(initialData.post.content);
    }
  }, [initialData, editor]);

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
        editor.chain().focus().setImage({ src: uploadResponse.url.mediumUrl, alt: `video:${uploadResponse.originalFilename}`, title: uploadResponse.originalFilename }).run();
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
    const url = window.prompt('URL을 입력하세요:');
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