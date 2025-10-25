// TiptapEditor에서 사용하는 부가기능들

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
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
  Underline,
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
  MoreHorizontal,
  Menu,
  RemoveFormatting,
  Type,
} from 'lucide-react';

interface WysiwygEditorProps {
  value: string;
  onChange: (value: string) => void;
  onImageUpload?: (file: File) => Promise<string>;
}

export default function WysiwygEditor({ value, onChange, onImageUpload }: WysiwygEditorProps) {
  const [zoom, setZoom] = useState('100%');
  const [fontSize, setFontSize] = useState('00');
  const [paragraphType, setParagraphType] = useState('Paragraph text');
  const [fontFamily, setFontFamily] = useState('Arial');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleBold = () => {
    // TODO: Connect to editor command
    console.log('Bold clicked');
  };

  const handleItalic = () => {
    // TODO: Connect to editor command
    console.log('Italic clicked');
  };

  const handleUnderline = () => {
    // TODO: Connect to editor command
    console.log('Underline clicked');
  };

  const handleStrikethrough = () => {
    // TODO: Connect to editor command
    console.log('Strikethrough clicked');
  };

  const handleImageInsert = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onImageUpload) return;
    
    const imageUrl = await onImageUpload(file);
    onChange(value + `\n![Image](${imageUrl})\n`);
  };

  return (
    <div className="w-full max-w-[1008px] mx-auto border border-black/10 rounded-xl shadow-[0_4px_64px_0_rgba(0,152,186,0.15)] overflow-hidden bg-white">
      {/* Desktop Top Menu Bar */}
      <div className="hidden lg:flex items-center justify-between px-6 py-3 border-b border-border">
        <div className="flex items-center gap-6">
          <button className="text-sm text-foreground hover:bg-accent px-2 py-1 rounded">File</button>
          <button className="text-sm text-foreground hover:bg-accent px-2 py-1 rounded">Edit</button>
          <button className="text-sm text-foreground hover:bg-accent px-2 py-1 rounded">View</button>
          <button className="text-sm text-foreground hover:bg-accent px-2 py-1 rounded">Insert</button>
          <button className="text-sm text-foreground hover:bg-accent px-2 py-1 rounded">Format</button>
          <button className="text-sm text-foreground hover:bg-accent px-2 py-1 rounded">Tools</button>
          <button className="text-sm text-foreground hover:bg-accent px-2 py-1 rounded">Help</button>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
          Post
        </Button>
      </div>

      {/* Mobile Header */}
      <div className="flex lg:hidden items-center justify-between px-4 py-3 border-b border-border">
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 hover:bg-accent rounded"
        >
          <Menu className="size-6" />
        </button>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg" size="sm">
          Post
        </Button>
      </div>

      {/* Desktop Toolbar */}
      <div className="hidden lg:flex items-center gap-2 px-6 py-3 border-b border-border flex-wrap">
        {/* Undo/Redo */}
        <button onClick={() => console.log('Undo')} className="p-2 hover:bg-accent rounded" title="Undo">
          <Undo className="size-5 text-muted-foreground" />
        </button>
        <button onClick={() => console.log('Redo')} className="p-2 hover:bg-accent rounded" title="Redo">
          <Redo className="size-5 text-muted-foreground" />
        </button>

        {/* Print/Copy */}
        <button className="p-2 hover:bg-accent rounded" title="Print">
          <Printer className="size-5 text-muted-foreground" />
        </button>
        <button className="p-2 hover:bg-accent rounded" title="Copy">
          <Copy className="size-5 text-muted-foreground" />
        </button>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Zoom Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-1 px-3 py-1.5 hover:bg-accent rounded text-sm">
              {zoom}
              <ChevronDown className="size-4 text-muted-foreground" />
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

        <div className="w-px h-6 bg-border mx-1" />

        {/* Paragraph Type */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-1 px-3 py-1.5 hover:bg-accent rounded text-sm">
              {paragraphType}
              <ChevronDown className="size-4 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setParagraphType('Paragraph text')}>Paragraph text</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setParagraphType('Heading 1')}>Heading 1</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setParagraphType('Heading 2')}>Heading 2</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setParagraphType('Heading 3')}>Heading 3</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Font Family */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-1 px-3 py-1.5 hover:bg-accent rounded text-sm">
              {fontFamily}
              <ChevronDown className="size-4 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setFontFamily('Arial')}>Arial</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFontFamily('Times New Roman')}>Times New Roman</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFontFamily('Courier New')}>Courier New</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFontFamily('Georgia')}>Georgia</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Font Size */}
        <button className="px-3 py-1.5 hover:bg-accent rounded text-sm">−</button>
        <span className="px-2 text-sm">{fontSize}</span>
        <button className="px-3 py-1.5 hover:bg-accent rounded text-sm">+</button>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Text Formatting */}
        <button onClick={handleBold} className="p-2 hover:bg-accent rounded" title="Bold">
          <Bold className="size-5" />
        </button>
        <button onClick={handleItalic} className="p-2 hover:bg-accent rounded" title="Italic">
          <Italic className="size-5" />
        </button>
        <button onClick={handleUnderline} className="p-2 hover:bg-accent rounded" title="Underline">
          <Underline className="size-5" />
        </button>
        <button onClick={handleStrikethrough} className="p-2 hover:bg-accent rounded" title="Strikethrough">
          <Strikethrough className="size-5" />
        </button>

        {/* Highlight Color */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-1 p-2 hover:bg-accent rounded">
              <div className="size-5 bg-blue-600 rounded" />
              <ChevronDown className="size-4 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <div className="grid grid-cols-5 gap-2 p-2">
              <button className="size-6 bg-yellow-300 rounded hover:scale-110" />
              <button className="size-6 bg-blue-600 rounded hover:scale-110" />
              <button className="size-6 bg-green-500 rounded hover:scale-110" />
              <button className="size-6 bg-red-500 rounded hover:scale-110" />
              <button className="size-6 bg-purple-500 rounded hover:scale-110" />
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Text Color */}
        <button className="p-2 hover:bg-accent rounded" title="Text Color">
          <Type className="size-5" />
        </button>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Link & Image */}
        <button className="p-2 hover:bg-accent rounded" title="Insert Link">
          <Link2 className="size-5 text-muted-foreground" />
        </button>
        <label className="p-2 hover:bg-accent rounded cursor-pointer" title="Insert Image">
          <ImageIcon className="size-5 text-muted-foreground" />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageInsert}
            className="hidden"
          />
        </label>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Lists */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-1 p-2 hover:bg-accent rounded">
              <List className="size-5 text-muted-foreground" />
              <ChevronDown className="size-3 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Bulleted list</DropdownMenuItem>
            <DropdownMenuItem>Numbered list</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-1 p-2 hover:bg-accent rounded">
              <ListOrdered className="size-5 text-muted-foreground" />
              <ChevronDown className="size-3 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>1, 2, 3</DropdownMenuItem>
            <DropdownMenuItem>a, b, c</DropdownMenuItem>
            <DropdownMenuItem>i, ii, iii</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-1 p-2 hover:bg-accent rounded">
              <MoreHorizontal className="size-5 text-muted-foreground" />
              <ChevronDown className="size-3 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Checklist</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Alignment */}
        <button className="p-2 hover:bg-accent rounded" title="Align Left">
          <AlignLeft className="size-5 text-muted-foreground" />
        </button>
        <button className="p-2 hover:bg-accent rounded" title="Align Center">
          <AlignCenter className="size-5 text-muted-foreground" />
        </button>
        <button className="p-2 hover:bg-accent rounded" title="Align Right">
          <AlignRight className="size-5 text-muted-foreground" />
        </button>
        <button className="p-2 hover:bg-accent rounded" title="Justify">
          <AlignJustify className="size-5 text-muted-foreground" />
        </button>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Indent */}
        <button className="p-2 hover:bg-accent rounded" title="Increase Indent">
          <Indent className="size-5 text-muted-foreground" />
        </button>
        <button className="p-2 hover:bg-accent rounded" title="Decrease Indent">
          <Outdent className="size-5 text-muted-foreground" />
        </button>
        <button className="p-2 hover:bg-accent rounded" title="Increase Indent">
          <Indent className="size-5 text-muted-foreground" />
        </button>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Clear Formatting */}
        <button className="p-2 hover:bg-accent rounded" title="Clear Formatting">
          <RemoveFormatting className="size-5 text-muted-foreground" />
        </button>
      </div>

      {/* Mobile Toolbar */}
      <div className="flex lg:hidden items-center gap-1 px-3 py-2 border-b border-border flex-wrap">
        <button onClick={() => console.log('Undo')} className="p-2 hover:bg-accent rounded">
          <Undo className="size-5 text-muted-foreground" />
        </button>
        <button onClick={() => console.log('Redo')} className="p-2 hover:bg-accent rounded">
          <Redo className="size-5 text-muted-foreground" />
        </button>
        <button onClick={handleBold} className="p-2 hover:bg-accent rounded">
          <Bold className="size-5" />
        </button>
        <button onClick={handleItalic} className="p-2 hover:bg-accent rounded">
          <Italic className="size-5" />
        </button>
        <button onClick={handleUnderline} className="p-2 hover:bg-accent rounded">
          <Underline className="size-5" />
        </button>
        <button onClick={handleStrikethrough} className="p-2 hover:bg-accent rounded">
          <Strikethrough className="size-5" />
        </button>
        
        {/* Highlight Color */}
        <button className="flex items-center gap-1 p-2 hover:bg-accent rounded">
          <div className="size-5 bg-blue-600 rounded" />
          <ChevronDown className="size-3 text-muted-foreground" />
        </button>

        <button className="p-2 hover:bg-accent rounded">
          <Type className="size-5" />
        </button>

        <div className="flex lg:hidden items-center gap-1 px-3 py-2 flex-wrap">
          <button className="p-2 hover:bg-accent rounded">
            <AlignLeft className="size-5 text-muted-foreground" />
          </button>
          <button className="p-2 hover:bg-accent rounded">
            <AlignCenter className="size-5 text-muted-foreground" />
          </button>
          <button className="p-2 hover:bg-accent rounded">
            <AlignRight className="size-5 text-muted-foreground" />
          </button>
          <button className="p-2 hover:bg-accent rounded">
            <AlignJustify className="size-5 text-muted-foreground" />
          </button>
          <button className="p-2 hover:bg-accent rounded">
            <Indent className="size-5 text-muted-foreground" />
          </button>
          <button className="p-2 hover:bg-accent rounded">
            <Outdent className="size-5 text-muted-foreground" />
          </button>
          <button className="p-2 hover:bg-accent rounded">
            <Indent className="size-5 text-muted-foreground" />
          </button>
          <button className="p-2 hover:bg-accent rounded">
            <RemoveFormatting className="size-5 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Editor Content Area */}
      <div className="p-6 lg:p-12 min-h-[600px] lg:min-h-[800px]">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full min-h-[500px] lg:min-h-[700px] resize-none outline-none text-foreground"
          placeholder="Start typing..."
        />
      </div>

      {/* Footer */}
      <div className="px-6 py-3 border-t border-border flex items-center justify-between text-sm text-muted-foreground">
        <span>{value.split(/\s+/).filter(Boolean).length} words</span>
      </div>
    </div>
  );
}
