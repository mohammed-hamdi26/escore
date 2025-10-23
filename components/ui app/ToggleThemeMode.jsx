"use client";
import { ToggleGroupItem } from "@radix-ui/react-toggle-group";
import { ToggleGroup } from "../ui/toggle-group";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

function ToggleThemeMode() {
  const { setTheme, theme } = useTheme();

  const classNameToggleItem =
    "data-[state=on]:bg-green-primary text-[#677185] dark:text-white   flex justify-center items-center size-10 rounded-full cursor-pointer";
  return (
    <ToggleGroup type="single" spacing={4}>
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
    </ToggleGroup>
  );
}

export default ToggleThemeMode;
