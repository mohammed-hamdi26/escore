"use client";

import { AlertTriangle } from "lucide-react";

function InlineError({ error, className = "" }) {
  if (!error) return null;

  return (
    <div
      className={`flex items-center gap-1.5 mt-1.5 text-xs text-red-500 transition-all animate-in fade-in slide-in-from-top-1 ${className}`}
    >
      <AlertTriangle className="size-3 flex-shrink-0" />
      <span>{error}</span>
    </div>
  );
}

export default InlineError;
