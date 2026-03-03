"use client";
import { useEffect } from "react";

/**
 * Prevents scroll-wheel from changing number input values.
 * Mount once in root layout — applies globally via event delegation.
 */
export default function NumberInputScrollFix() {
  useEffect(() => {
    const handleWheel = (e) => {
      if (
        e.target instanceof HTMLInputElement &&
        e.target.type === "number" &&
        document.activeElement === e.target
      ) {
        e.target.blur();
      }
    };

    document.addEventListener("wheel", handleWheel, { passive: true });
    return () => document.removeEventListener("wheel", handleWheel);
  }, []);

  return null;
}
