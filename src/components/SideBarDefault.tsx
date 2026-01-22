// components/SideBarDefault.tsx
"use client";

import { LinkIcon, List, MoveDown, MoveUp, Undo2 } from "lucide-react";
import { toast } from "sonner";

export default function SideBarDefault() {
  return (
    <>
      {/* Sidebar */}
      <button
        className="hidden lg:flex w-10 h-10 items-center justify-center rounded-xl bg-muted hover:bg-muted/80 transition-colors"
        aria-label="목차 지도"
        onClick={() => {
          toast.success("목차 지도는 구현 예정입니다.");
        }}
      >
        <List className="w-6 h-6 text-muted-foreground" />
      </button>
      <button
        className="hidden lg:flex w-10 h-10 items-center justify-center rounded-xl bg-muted hover:bg-muted/80 transition-colors"
        aria-label="맨 위로"
        onClick={() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      >
        <MoveUp className="w-6 h-6 text-muted-foreground" />
      </button>
      <button
        className="hidden lg:flex w-10 h-10 items-center justify-center rounded-xl bg-muted hover:bg-muted/80 transition-colors"
        aria-label="맨 아래로"
        onClick={() => {
          window.scrollTo({
            top: document.body.scrollHeight,
            behavior: "smooth",
          });
        }}
      >
        <MoveDown className="w-6 h-6 text-muted-foreground" />
      </button>
      <button
        className="w-10 h-10 flex items-center justify-center rounded-xl bg-muted hover:bg-muted/80 transition-colors"
        aria-label="링크 복사"
        onClick={async () => {
          const currentUrl: string = window.location.href;

          try {
            await navigator.clipboard.writeText(currentUrl);
            toast.success("URL 복사 완료");
          } catch (err) {
            console.error(err);
            toast.error("URL 복사 실패");
          }
        }}
      >
        <LinkIcon className="w-6 h-6 text-muted-foreground" />
      </button>
      <button
        className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-300 hover:bg-gray-200 transition-colors"
        aria-label="뒤로 가기"
        onClick={() => {
          history.back();
        }}
      >
        <Undo2 className="w-6 h-6 text-muted-foreground" />
      </button>
    </>
  );
}
