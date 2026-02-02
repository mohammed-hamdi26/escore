"use client";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

function ToggleThemeMode() {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Return placeholder during SSR to avoid hydration mismatch
  if (!mounted) {
    return (
      <div className="theme-toggle-pill w-[76px] h-9">
        <div className="flex items-center justify-around w-full h-full">
          <Sun className="size-4 text-muted-foreground" />
          <Moon className="size-4 text-muted-foreground" />
        </div>
      </div>
    );
  }

  const isLight = theme === "light";

  return (
    <div className="theme-toggle-pill w-[76px] h-9 cursor-pointer">
      {/* Sliding indicator */}
      <div
        className={`theme-toggle-indicator w-[34px] ${
          isLight ? "left-1" : "left-[38px]"
        }`}
      />

      {/* Icons */}
      <button
        onClick={() => setTheme("light")}
        className={`relative z-10 flex items-center justify-center w-[34px] h-7 rounded-full transition-colors duration-200 ${
          isLight ? "text-white" : "text-muted-foreground hover:text-foreground"
        }`}
        aria-label="Light mode"
      >
        <Sun className="size-4" />
      </button>

      <button
        onClick={() => setTheme("dark")}
        className={`relative z-10 flex items-center justify-center w-[34px] h-7 rounded-full transition-colors duration-200 ${
          !isLight ? "text-white" : "text-muted-foreground hover:text-foreground"
        }`}
        aria-label="Dark mode"
      >
        <Moon className="size-4" />
      </button>
    </div>
  );
}

export default ToggleThemeMode;
