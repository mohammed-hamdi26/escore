"use client";

import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

function HelpTooltip({ text, side = "top" }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center justify-center p-0.5 rounded-full text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Help"
        >
          <Info className="size-3.5" />
        </button>
      </TooltipTrigger>
      <TooltipContent side={side} className="max-w-[250px]">
        {text}
      </TooltipContent>
    </Tooltip>
  );
}

export default HelpTooltip;
