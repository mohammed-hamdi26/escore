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
      <div className="relative flex items-center p-1 rounded-full bg-gray-100 dark:bg-[#1a1d2e] border border-gray-200 dark:border-white/10 w-[72px] h-9">
        <div className="flex items-center justify-around w-full">
          <Sun className="size-4 text-gray-400" />
          <Moon className="size-4 text-gray-400" />
        </div>
      </div>
    );
  }

  const isLight = theme === "light";

  return (
    <div className="relative flex items-center p-1 rounded-full bg-gray-100 dark:bg-[#1a1d2e] border border-gray-200 dark:border-white/10 w-[72px] h-9 shadow-inner dark:shadow-none">
      {/* Sliding indicator */}
      <div
        className={`absolute w-[30px] h-[28px] rounded-full bg-white dark:bg-green-primary shadow-md transition-all duration-300 ease-out ${
          isLight ? "left-[3px]" : "left-[37px]"
        }`}
      />

      {/* Light mode button */}
      <button
        onClick={() => setTheme("light")}
        className={`relative z-10 flex items-center justify-center w-[30px] h-[28px] rounded-full transition-all duration-200 ${
          isLight
            ? "text-amber-500"
            : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        }`}
        aria-label="Light mode"
      >
        <Sun className={`size-[16px] transition-transform duration-300 ${isLight ? "rotate-0" : "rotate-90"}`} />
      </button>

      {/* Dark mode button */}
      <button
        onClick={() => setTheme("dark")}
        className={`relative z-10 flex items-center justify-center w-[30px] h-[28px] rounded-full transition-all duration-200 ${
          !isLight
            ? "text-white"
            : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        }`}
        aria-label="Dark mode"
      >
        <Moon className={`size-[16px] transition-transform duration-300 ${!isLight ? "rotate-0" : "-rotate-90"}`} />
      </button>
    </div>
  );
}

export default ToggleThemeMode;
