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
      <div className="flex items-center bg-gray-100 dark:bg-white/5 rounded-xl p-1 w-[76px] h-9">
        <div className="flex items-center justify-around w-full h-full">
          <Sun className="size-4 text-gray-500 dark:text-gray-400" />
          <Moon className="size-4 text-gray-500 dark:text-gray-400" />
        </div>
      </div>
    );
  }

  const isLight = theme === "light";

  return (
    <div className="relative flex items-center bg-gray-100 dark:bg-white/5 rounded-xl p-1 w-[76px] h-9">
      {/* Sliding indicator */}
      <div
        className={`absolute w-[34px] h-7 rounded-lg bg-green-primary shadow-md transition-all duration-300 ease-out ${
          isLight ? "left-1" : "left-[38px]"
        }`}
      />

      {/* Icons */}
      <button
        onClick={() => setTheme("light")}
        className={`relative z-10 flex items-center justify-center w-[34px] h-7 rounded-lg transition-colors duration-200 ${
          isLight ? "text-white" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white"
        }`}
        aria-label="Light mode"
      >
        <Sun className="size-4" />
      </button>

      <button
        onClick={() => setTheme("dark")}
        className={`relative z-10 flex items-center justify-center w-[34px] h-7 rounded-lg transition-colors duration-200 ${
          !isLight ? "text-white" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white"
        }`}
        aria-label="Dark mode"
      >
        <Moon className="size-4" />
      </button>
    </div>
  );
}

export default ToggleThemeMode;
