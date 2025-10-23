"use client"

import { useState } from "react"
// import { MoreHorizontalIcon } from "lucide-react"
import accountImg from '../../public/account.png'
import Image from 'next/image'

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
/* import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea" */

interface DropdownProps {
  // onSignOut은 서버 액션이므로 (formData: FormData) => Promise<void> 형태의 함수입니다.
  onSignOut: () => Promise<void>; 
}

export function DropdownMenuDialog({ onSignOut }: DropdownProps) {
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  // const [showShareDialog, setShowShareDialog] = useState(false)

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button className="hover:cursor-pointer" variant="outline" aria-label="Open menu" size="icon-sm">
            <Image 
                alt="login-image" 
                src={accountImg}
                width={24}
                height={24}
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-40" align="end">
          <DropdownMenuLabel>ProjectWJ</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem 
                className="hover:cursor-pointer"
                onClick={() => {location.href="/posts/new"}}>
                New Post
            </DropdownMenuItem>
{/*             <DropdownMenuItem onSelect={() => setShowNewDialog(true)}>
              New File...
            </DropdownMenuItem> */}
{/*             <DropdownMenuItem onSelect={() => setShowShareDialog(true)}>
              Share...
            </DropdownMenuItem> */}
{/*             <DropdownMenuItem disabled>Download</DropdownMenuItem> */}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem 
                className="hover:cursor-pointer"
                onSelect={() => setShowLogoutDialog(true)}>
                Log out...
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Do you want to log out?</DialogTitle>
            <DialogDescription>
            </DialogDescription>
          </DialogHeader>
{/*           <FieldGroup className="pb-3">
            <Field>
              <FieldLabel htmlFor="filename">File Name</FieldLabel>
              <Input id="filename" name="filename" placeholder="document.txt" />
            </Field>
          </FieldGroup> */}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
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
    <Button type="submit" disabled={pending}
      className="bg-red-400 hover:bg-red-500"
    >
      {pending ? <Spinner /> : 'Log out'}
    </Button>
  );
}