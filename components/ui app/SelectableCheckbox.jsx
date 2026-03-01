"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

export default function SelectableCheckbox({
  checked,
  onCheckedChange,
  selectionMode = false,
  className,
}) {
  return (
    <div
      className={cn(
        "absolute top-2 left-2 z-10 transition-opacity duration-200",
        selectionMode ? "opacity-100" : "opacity-0 group-hover:opacity-100",
        className
      )}
      onClick={(e) => e.stopPropagation()}
    >
      <Checkbox
        checked={checked}
        onCheckedChange={onCheckedChange}
        className="size-5 border-2 bg-background/80 backdrop-blur-sm"
      />
    </div>
  );
}
