import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Extract a display URL from a value that may be a string or ImageSizes object.
 * Handles both legacy string URLs and new { thumbnail, medium, large } format.
 */
export function getImgUrl(value) {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object") return value.large || value.medium || value.thumbnail || "";
  return "";
}
