"use client"

import * as React from "react"
import Link from "next/link"

import { useIsMobile } from "@/hooks/use-mobile"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { CATEGORIES } from "@/constants/categories"
import { NaviLogo } from "./LogoSize"


function ListItemMap() {
  return(
    CATEGORIES.map((c, index) => {
      return (
        <ListItem key={index} href={"/posts/all?category=" + c.value} title={c.label}>
          {c.detail}
        </ListItem>
      )
    })
  )
}

export function NavigationMenuDemo() {
  const isMobile = useIsMobile()

  return (
    <NavigationMenu className="z-30 sm:px-4" viewport={isMobile}>
      <NavigationMenuList className="">
        {!isMobile ?
          <NavigationMenuItem>
            <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
              <Link href="/">
  {/*               <span className="font-bold">WJwiki</span> */}
                <NaviLogo />
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        : ""}
        <NavigationMenuItem>
          <NavigationMenuTrigger>Blog</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <Link
                    className="from-muted/50 to-muted flex h-full w-full flex-col justify-end rounded-md bg-linear-to-b p-4 no-underline outline-hidden transition-all duration-200 select-none focus:shadow-md md:p-6"
                    href="/posts/all"
                  >
                    <div className="mb-2 text-lg font-medium sm:mt-4">
                      WJwiki
                    </div>
                    <p className="text-muted-foreground text-sm leading-tight">
                      ProjectWJ의 블로그
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
              <ListItemMap />
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Tools</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <Link
                    className="from-muted/50 to-muted flex h-full w-full flex-col justify-end rounded-md bg-linear-to-b p-4 no-underline outline-hidden transition-all duration-200 select-none focus:shadow-md md:p-6"
                    href=""
                  >
                    <div className="mb-2 text-lg font-medium sm:mt-4">
                      Tools
                    </div>
                    <p className="text-muted-foreground text-sm leading-tight">
                      개발한 유틸리티 도구 및 자료들
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
              <ListItem
                href="https://github.com/ProjectWJ/webtools_lite_extension"
                title="Webtools Lite"
              >
                웹 페이지에서 유용하게 활용할 수 있는 다기능 도구 모음 확장프로그램입니다.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

function ListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link href={href}>
          <div className="text-sm leading-none font-medium">{title}</div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  )
}
