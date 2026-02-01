"use client";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";

function ToggleThemeMode() {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by only rendering theme-dependent UI after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  const classNameToggleItem =
    "  dark:text-white   flex justify-center items-center size-10 rounded-full cursor-pointer    ";

  // Return placeholder during SSR to avoid hydration mismatch
  if (!mounted) {
    return (
      <div className="flex  rtl:mr-auto items-center gap-4">
        <Button className={"bg-transparent text-[#677185] " + classNameToggleItem}>
          <Sun />
        </Button>
        <Button className={"bg-transparent text-[#677185] " + classNameToggleItem}>
          <Moon />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex  rtl:mr-auto items-center gap-4">
      <Button
        onClick={() => setTheme("light")}
        className={
          `${
            theme === "light"
              ? "bg-green-primary text-white hover:bg-green-primary"
              : "bg-transparent text-[#677185] hover:bg-green-primary/50"
          } ` + classNameToggleItem
        }
      >
        <Sun />
      </Button>

      <Button
        onClick={() => setTheme("dark")}
        className={
          `${
            theme === "dark"
              ? "bg-green-primary text-white hover:bg-green-primary"
              : "bg-transparent text-[#677185] hover:bg-green-primary/50"
          } ` + classNameToggleItem
        }
      >
        <Moon />
      </Button>
    </div>
  );
}

{
  /* <ToggleGroup
      className={"justify-self-end"}
      defaultValue={mode}
      type="single"
      spacing={4}
    >
      <ToggleGroupItem
        defaultValue={"light"}
        className={
          `${theme === "light" && "bg-green-primary text-white"} ` +
          classNameToggleItem
        }
        value="light"
        aria-label="Toggle light"
        onClick={() => setTheme("light")}
        defaultChecked={theme === "light"}
      >
        <Sun />
      </ToggleGroupItem>

      <ToggleGroupItem
        onClick={() => setTheme("dark")}
        className={
          `${theme === "dark" && "bg-green-primary text-white"} ` +
          classNameToggleItem
        }
        value="dark"
        aria-label="Toggle dark"
      >
        <Moon className="" />
      </ToggleGroupItem>
    </ToggleGroup> */
}
export default ToggleThemeMode;
