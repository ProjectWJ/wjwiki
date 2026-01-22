"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="relative flex items-center ml-auto">
        <Button type="button" variant="ghost" size="icon" className="h-8 w-8">
          <Sun className="h-5 w-5" />
        </Button>
      </div>
    );
  }

  // 현재 시스템 설정에 따라 라이트/다크 모드 설정
  const currentTheme = theme === "system" ? resolvedTheme : theme;

  return (
    <div className="relative flex items-center ml-auto sm:pl-4 pl-2 pr-2">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
        className="h-8 w-8 transition-colors"
        aria-label="테마 전환"
      >
        {mounted && currentTheme === "dark" ? (
          <Sun className="h-5 w-5 transition-all" />
        ) : (
          <Moon className="h-5 w-5 transition-all" />
        )}
        <span className="sr-only">테마 전환</span>
      </Button>
    </div>
  );
}
