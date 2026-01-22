"use client"

import { useState } from "react"
import { CircleUserRound } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useFormStatus } from "react-dom"
import { Spinner } from "./ui/spinner"

interface DropdownProps {
  // onSignOut은 서버 액션이므로 (formData: FormData) => Promise<void> 형태의 함수
  onSignOut: () => Promise<void>; 
}

export function DropdownMenuDialog({ onSignOut }: DropdownProps) {
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button className="hover:cursor-pointer" variant="outline" aria-label="Open menu" size="icon-sm">
            {/* account 로고 */}
            <CircleUserRound />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-40" align="end">
          <DropdownMenuLabel>ProjectWJ</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem 
                className="hover:cursor-pointer"
                onClick={() => {location.href="/posts/new"}}>
                글쓰기
            </DropdownMenuItem>
            <DropdownMenuItem 
                className="hover:cursor-pointer"
                onClick={() => {location.href="/admin"}}>
                관리(미구현)
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem 
                className="hover:cursor-pointer"
                onSelect={() => setShowLogoutDialog(true)}>
                로그아웃
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>로그아웃하시겠습니까?</DialogTitle>
            <DialogDescription>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">취소</Button>
            </DialogClose>
            <form action={onSignOut}>
                <LogoutSubmitButton />
            </form>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

function LogoutSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button variant="outline" type="submit" disabled={pending}
      className="bg-red-400 text-white hover:bg-red-500 hover:text-white w-full"
    >
      {pending ? <Spinner /> : '로그아웃'}
    </Button>
  );
}