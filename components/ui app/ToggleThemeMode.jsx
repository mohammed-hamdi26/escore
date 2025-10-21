import { ToggleGroupItem } from "@radix-ui/react-toggle-group";
import { ToggleGroup } from "../ui/toggle-group";
import { Moon, Sun } from "lucide-react";

function ToggleThemeMode() {
  const classNameToggleItem =
    "data-[state=on]:bg-[#28954633] flex justify-center items-center size-10 rounded-full cursor-pointer";
  return (
    <ToggleGroup type="single" spacing={4}>
      <ToggleGroupItem
        className={classNameToggleItem}
        value="light"
        aria-label="Toggle light"
      >
        <Sun />
      </ToggleGroupItem>

      <ToggleGroupItem
        className={classNameToggleItem}
        value="dark"
        aria-label="Toggle dark"
      >
        <Moon />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}

export default ToggleThemeMode;
