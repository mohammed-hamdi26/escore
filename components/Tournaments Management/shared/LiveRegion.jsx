"use client";

import { useState, useCallback, createContext, useContext } from "react";

const LiveRegionContext = createContext(null);

export function useLiveAnnounce() {
  const ctx = useContext(LiveRegionContext);
  if (!ctx) return () => {};
  return ctx;
}

export function LiveRegionProvider({ children }) {
  const [message, setMessage] = useState("");

  const announce = useCallback((text) => {
    // Clear first to ensure re-announcement of same message
    setMessage("");
    requestAnimationFrame(() => {
      setMessage(text);
      // Auto-clear after 5 seconds
      setTimeout(() => setMessage(""), 5000);
    });
  }, []);

  return (
    <LiveRegionContext.Provider value={announce}>
      {children}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {message}
      </div>
    </LiveRegionContext.Provider>
  );
}
