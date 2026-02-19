import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Extract a display URL from a value that may be a string or ImageSizes object.
 * Handles both legacy string URLs and new { thumbnail, medium, large } format.
 * @param {*} value - string URL or { thumbnail, medium, large } object
 * @param {"thumbnail"|"medium"|"large"} size - desired size (default: "large")
 */
export function getImgUrl(value, size = "large") {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object") {
    switch (size) {
      case "thumbnail":
        return value.thumbnail || value.medium || value.large || "";
      case "medium":
        return value.medium || value.large || value.thumbnail || "";
      default:
        return value.large || value.medium || value.thumbnail || "";
    }
  }
  return "";
}
