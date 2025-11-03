"use client";
import { ToggleGroupItem } from "@radix-ui/react-toggle-group";
import { ToggleGroup } from "../ui/toggle-group";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useLayoutEffect, useState } from "react";
import { Button } from "../ui/button";

function ToggleThemeMode() {
  const { setTheme, theme } = useTheme();
  const [mode, setMode] = useState(null);
  console.log(localStorage.getItem("theme"));
  const classNameToggleItem =
    "  dark:text-white   flex justify-center items-center size-10 rounded-full cursor-pointer    ";

  return (
    <div className="flex ml-auto items-center gap-4">
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
