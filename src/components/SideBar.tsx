// components/SideBar.tsx

import { FilePenLine } from "lucide-react";
import Link from "next/link";
import SideBarDefault from "./SideBarDefault";
import { DeleteButton } from "./DeleteButton";

export default async function SideBar({ postId, isAdmin }: { postId: number, isAdmin: boolean}) {

    // --- 반응형 CSS 클래스 설명 ---
    // 1. 기본값 (모바일, 768px 미만): 
    //    - block: 컨텐츠 흐름에 따라 일반 블록으로 표시됩니다. (sticky 해제)
    //    - w-full, flex-row: 가로 전체 너비를 차지하고 아이콘을 가로로 배열합니다.
    // 2. lg: (1024px 이상): 
    //    - lg:hidden: 모바일 레이아웃은 숨깁니다.
    //    - lg:flex: 데스크탑 레이아웃을 표시합니다.
    //    - lg:sticky, lg:bottom-20: sticky 속성을 적용하여 스크롤에 따라 움직이게 합니다.

    const baseClasses = "flex flex-row justify-center lg:justify-start items-start " + 
                        "gap-4 lg:gap-6 w-full lg:w-14 flex-shrink-0 self-end lg:col-start-3";
    
    // 모바일에서는 sticky를 해제하고 일반 블록 요소처럼, 
    // 데스크탑에서는 sticky를 적용합니다.
    const responsiveClasses = "block lg:sticky bottom-20";


    if(isAdmin){
        return (
            <aside className={`${baseClasses} ${responsiveClasses}`}>
            <div className="flex flex-row lg:flex-col gap-4 lg:gap-4">
                <SideBarDefault />
                <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-sky-400 hover:bg-sky-300 transition-colors"
                    aria-label="수정" >
                    <Link href={`/posts/${postId}/edit`}>
                        <FilePenLine color="#e5e5e5" className="w-6 h-6 text-muted-foreground" />
                    </Link>
                </button>
                <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-400 hover:bg-red-200 transition-colors"
                    aria-label="삭제" >
                    <DeleteButton postId={postId} />
                </div>
            </div>
            </aside>
        )
    }
    else {
        return(
            <aside className={`${baseClasses} ${responsiveClasses}`}>
            <div className="flex flex-row lg:flex-col gap-4">
                <SideBarDefault />
            </div>
            </aside>
        )
    }
}