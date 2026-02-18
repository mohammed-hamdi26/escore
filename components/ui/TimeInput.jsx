"use client";

import { useState, useEffect } from "react";
import { formatTimeMs, parseTimeString } from "@/lib/timeUtils";

/**
 * Time input component that converts between ms and human-readable format.
 */
function TimeInput({ value, onChange, disabled, placeholder = "0:00.000", className = "" }) {
  const [display, setDisplay] = useState("");

  useEffect(() => {
    if (value !== null && value !== undefined) {
      setDisplay(formatTimeMs(value));
    } else {
      setDisplay("");
    }
  }, [value]);

  const handleBlur = () => {
    if (!display.trim()) {
      onChange(null);
      return;
    }
    const ms = parseTimeString(display);
    if (ms !== null) {
      onChange(ms);
      setDisplay(formatTimeMs(ms));
    }
  };

  return (
    <input
      type="text"
      value={display === "—" ? "" : display}
      onChange={(e) => setDisplay(e.target.value)}
      onBlur={handleBlur}
      disabled={disabled}
      placeholder={placeholder}
      className={`w-full px-2 py-1 rounded text-center text-sm font-mono border border-gray-300 dark:border-gray-600 bg-background text-foreground ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      } ${className}`}
    />
  );
}

/**
 * Read-only time cell with DNF/DSQ support.
 */
export function TimeCell({ value, dnf, dsq }) {
  if (dsq) {
    return <span className="text-sm font-mono text-red-500 line-through">DSQ</span>;
  }
  if (dnf) {
    return <span className="text-sm font-mono text-red-500">DNF</span>;
  }
  return (
    <span className="text-sm font-mono text-foreground">
      {formatTimeMs(value)}
    </span>
  );
}

/**
 * Read-only gap cell.
 */
export function GapCell({ gapMs }) {
  if (!gapMs || gapMs === 0) return <span className="text-xs text-muted-foreground">—</span>;
  return (
    <span className="text-xs font-mono text-muted-foreground">
      +{formatTimeMs(Math.abs(gapMs))}
    </span>
  );
}

export default TimeInput;
