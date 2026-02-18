/**
 * Time formatting utilities for racing / time-based competitions.
 * Converts between milliseconds and human-readable time strings.
 */

/**
 * Format milliseconds to human-readable time string.
 * @param {number|null|undefined} ms - Time in milliseconds
 * @returns {string} Formatted time string (e.g., "1:33.450", "33.450", "0.500") or "—"
 */
export function formatTimeMs(ms) {
  if (ms === null || ms === undefined) return "—";
  if (typeof ms !== "number" || ms < 0) return "—";

  const totalSeconds = Math.floor(ms / 1000);
  const milliseconds = ms % 1000;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  const msStr = String(milliseconds).padStart(3, "0");

  if (minutes > 0) {
    return `${minutes}:${String(seconds).padStart(2, "0")}.${msStr}`;
  }
  return `${seconds}.${msStr}`;
}

/**
 * Parse a human-readable time string to milliseconds.
 * @param {string} str - Time string (e.g., "1:33.450", "33.450", "0.500")
 * @returns {number|null} Milliseconds or null if invalid
 */
export function parseTimeString(str) {
  if (!str || typeof str !== "string") return null;
  const trimmed = str.trim();
  if (!trimmed) return null;

  // Format: mm:ss.SSS or mm:ss
  const colonMatch = trimmed.match(/^(\d+):(\d{1,2})(?:\.(\d{1,3}))?$/);
  if (colonMatch) {
    const minutes = parseInt(colonMatch[1], 10);
    const seconds = parseInt(colonMatch[2], 10);
    const msStr = (colonMatch[3] || "0").padEnd(3, "0");
    const ms = parseInt(msStr, 10);
    if (seconds >= 60) return null;
    return minutes * 60000 + seconds * 1000 + ms;
  }

  // Format: ss.SSS or ss
  const secMatch = trimmed.match(/^(\d+)(?:\.(\d{1,3}))?$/);
  if (secMatch) {
    const seconds = parseInt(secMatch[1], 10);
    const msStr = (secMatch[2] || "0").padEnd(3, "0");
    const ms = parseInt(msStr, 10);
    return seconds * 1000 + ms;
  }

  return null;
}

/**
 * Format a time gap (difference from leader).
 * @param {number|null|undefined} gapMs - Gap in milliseconds
 * @returns {string} Formatted gap (e.g., "+1.650", "+1:02.300") or "—"
 */
export function formatGap(gapMs) {
  if (gapMs === null || gapMs === undefined || gapMs === 0) return "—";
  return `+${formatTimeMs(Math.abs(gapMs))}`;
}

/**
 * Format a penalty time.
 * @param {number|null|undefined} penaltyMs - Penalty in milliseconds
 * @returns {string} Formatted penalty (e.g., "+5.000s") or ""
 */
export function formatPenalty(penaltyMs) {
  if (!penaltyMs || penaltyMs === 0) return "";
  const totalSeconds = Math.floor(penaltyMs / 1000);
  const ms = penaltyMs % 1000;
  return `+${totalSeconds}.${String(ms).padStart(3, "0")}s`;
}

/**
 * Validate a time string format.
 * @param {string} str - Time string to validate
 * @returns {boolean} Whether the string is a valid time format
 */
export function isValidTimeFormat(str) {
  if (!str || typeof str !== "string") return true; // empty is valid (optional)
  return parseTimeString(str) !== null;
}
