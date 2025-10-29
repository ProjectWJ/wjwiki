// components/DeleteModalContext.tsx
'use client';

import { createContext, useContext, useState, useTransition, ReactNode } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { handleDeletePost } from "../lib/action"; // 서버 액션 경로
import { toast } from "sonner"; // 토스트 사용 시
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { Spinner } from "./ui/spinner";

interface DeleteModalContextType {
  openModal: (postId: number) => void;
}

const DeleteModalContext = createContext<DeleteModalContextType | undefined>(undefined);

export function DeleteModalProvider({ children }: { children: ReactNode }) {
  const [postId, setPostId] = useState<number | null>(null);
  const [pending, startTransition] = useTransition();

  const handleConfirm = () => {
    if (!postId) return;

    startTransition(async () => {
      try {
        await handleDeletePost(postId.toString());
        toast.success("게시글이 삭제되었습니다.");
        setPostId(null); // 모달 닫기
      } catch (error) {
        if (isRedirectError(error)) {
          // 리디렉션은 성공적인 동작이므로, 성공 토스트를 띄우고 에러를 다시 던져서
          // Next.js 런타임이 리디렉션을 완료하도록 합니다.
          toast.success("게시글이 삭제되었습니다."); 
          throw error; // 리다이렉트가 완료되도록 에러를 다시 던지기
        }

        console.error(error);
        toast.error("삭제에 실패했습니다.");
      }
    });
  };

  return (
    <DeleteModalContext.Provider
      value={{
        openModal: (id) => setPostId(id),
      }}
    >
      {children}

      {/* ✅ 실제 모달은 여기에 렌더링됩니다.
        이 컴포넌트는 SideBar(sticky)의 부모에 위치하므로
        스태킹 컨텍스트에 갇히지 않습니다.
      */}
      <AlertDialog open={!!postId} onOpenChange={(open) => !open && setPostId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>게시글을 삭제하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              이 작업은 되돌릴 수 없습니다. 해당 게시글이 서버에서 완전히 삭제됩니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={pending} onClick={() => setPostId(null)}>
              취소
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={pending}
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={handleConfirm}
            >
              {pending ? <Spinner /> : "삭제"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DeleteModalContext.Provider>
  );
}

// 2. 트리거 버튼에서 사용할 커스텀 훅
export function useDeleteModal() {
  const context = useContext(DeleteModalContext);
  if (!context) {
    throw new Error("useDeleteModal must be used within a DeleteModalProvider");
  }
  return context;
}