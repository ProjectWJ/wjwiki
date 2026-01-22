// components/SideBar.tsx

import { FilePenLine } from "lucide-react";
import Link from "next/link";
import SideBarDefault from "./SideBarDefault";
import { DeleteButton } from "./DeleteButton";

export default async function SideBar({
  postId,
  isAdmin,
}: {
  postId: number;
  isAdmin: boolean;
}) {
  const baseClasses =
    "flex flex-row justify-center lg:justify-start items-start " +
    "gap-4 lg:gap-6 w-full lg:w-14 flex-shrink-0 self-end lg:col-start-3";

  // 모바일에서는 sticky를 해제하고 일반 블록 요소처럼,
  // 데스크탑에서는 sticky를 적용
  const responsiveClasses = "block lg:sticky bottom-20";

  if (isAdmin) {
    return (
      <aside className={`${baseClasses} ${responsiveClasses}`}>
        <div className="flex flex-row lg:flex-col gap-4 lg:gap-4">
          <SideBarDefault />
          <Link href={`/posts/${postId}/edit`}>
            <button
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-sky-400 hover:bg-sky-300 transition-colors"
              aria-label="수정"
            >
              <FilePenLine
                color="#e5e5e5"
                className="w-6 h-6 text-muted-foreground"
              />
            </button>
          </Link>
          <div
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-400 hover:bg-red-200 transition-colors"
            aria-label="삭제"
          >
            <DeleteButton postId={postId} />
          </div>
        </div>
      </aside>
    );
  } else {
    return (
      <aside className={`${baseClasses} ${responsiveClasses}`}>
        <div className="flex flex-row lg:flex-col gap-4">
          <SideBarDefault />
        </div>
      </aside>
    );
  }
}
