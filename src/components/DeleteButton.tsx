// components/DeleteButton.tsx
"use client";

import { Trash } from "lucide-react";
import { useDeleteModal } from "./DeleteModalContext";

export function DeleteButton({ postId }: { postId: number }) {
  const { openModal } = useDeleteModal();

  return (
    <button
      type="button"
      className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-400 hover:bg-red-300 transition-colors"
      aria-label="삭제"
      onClick={() => openModal(postId)}
    >
      <Trash color="#e5e5e5" className="w-6 h-6 text-muted-foreground" />
    </button>
  );
}
