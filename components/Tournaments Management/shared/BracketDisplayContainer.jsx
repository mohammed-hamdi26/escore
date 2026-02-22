"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useTranslations } from "next-intl";
import { LayoutGrid, List } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import BracketZoomControls, { MIN_ZOOM, MAX_ZOOM } from "./BracketZoomControls";
import BracketMinimap from "./BracketMinimap";
import MobileBracketView from "../bracket-display/MobileBracketView";

const VIEW_STORAGE_KEY = "escore-bracket-view-mode";

function BracketDisplayContainer({ children, rounds, showMinimap = true }) {
  const t = useTranslations("TournamentDetails");
  const isMobile = useIsMobile();

  const [viewMode, setViewMode] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(VIEW_STORAGE_KEY) || "auto";
    }
    return "auto";
  });
  const [zoom, setZoom] = useState(1);
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const [, forceUpdate] = useState(0);

  // Determine effective mode
  const effectiveMode =
    viewMode === "auto" ? (isMobile ? "mobile" : "grid") : viewMode;
  const showDesktop = effectiveMode === "grid";

  // Save preference
  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    if (typeof window !== "undefined") {
      localStorage.setItem(VIEW_STORAGE_KEY, mode);
    }
  };

  // Force re-render on scroll to update minimap viewport
  useEffect(() => {
    if (!showDesktop) return;
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => forceUpdate((n) => n + 1);
    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [showDesktop]);

  // Pinch-to-zoom (desktop mode only)
  useEffect(() => {
    if (!showDesktop) return;
    const container = containerRef.current;
    if (!container) return;

    let lastDistance = 0;

    const handleTouchStart = (e) => {
      if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        lastDistance = Math.sqrt(dx * dx + dy * dy);
      }
    };

    const handleTouchMove = (e) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (lastDistance > 0) {
          const scale = distance / lastDistance;
          setZoom((prev) => {
            const next = prev * scale;
            return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, Math.round(next * 100) / 100));
          });
        }
        lastDistance = distance;
      }
    };

    const handleTouchEnd = () => {
      lastDistance = 0;
    };

    container.addEventListener("touchstart", handleTouchStart, { passive: true });
    container.addEventListener("touchmove", handleTouchMove, { passive: false });
    container.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
    };
  }, [showDesktop]);

  // Ctrl+Scroll zoom (desktop mode only)
  useEffect(() => {
    if (!showDesktop) return;
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.05 : 0.05;
        setZoom((prev) => {
          const next = prev + delta;
          return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, Math.round(next * 100) / 100));
        });
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, [showDesktop]);

  // Keyboard navigation (desktop mode only)
  useEffect(() => {
    if (!showDesktop) return;
    const container = containerRef.current;
    if (!container) return;

    const handleKeyDown = (e) => {
      if (!container.contains(document.activeElement) && document.activeElement !== container) return;

      const SCROLL_AMOUNT = 200;
      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          container.scrollBy({ left: -SCROLL_AMOUNT, behavior: "smooth" });
          break;
        case "ArrowRight":
          e.preventDefault();
          container.scrollBy({ left: SCROLL_AMOUNT, behavior: "smooth" });
          break;
        case "ArrowUp":
          e.preventDefault();
          container.scrollBy({ top: -SCROLL_AMOUNT, behavior: "smooth" });
          break;
        case "ArrowDown":
          e.preventDefault();
          container.scrollBy({ top: SCROLL_AMOUNT, behavior: "smooth" });
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [showDesktop]);

  const handleFitToScreen = useCallback(() => {
    if (!containerRef.current || !contentRef.current) return;

    const containerW = containerRef.current.clientWidth;
    const contentW = contentRef.current.scrollWidth / zoom;

    if (contentW > 0) {
      const fitZoom = Math.min(containerW / contentW, MAX_ZOOM);
      setZoom(Math.max(MIN_ZOOM, Math.round(fitZoom * 100) / 100));
    }
  }, [zoom]);

  const handleReset = useCallback(() => {
    setZoom(1);
    if (containerRef.current) {
      containerRef.current.scrollTo({ left: 0, top: 0, behavior: "smooth" });
    }
  }, []);

  // Check if rounds are available for mobile view
  const hasRounds = rounds && rounds.length > 0;

  return (
    <div className="relative">
      {/* Controls bar */}
      <div className="flex items-center justify-between mb-2 gap-2 flex-wrap">
        {showDesktop ? (
          <>
            <BracketZoomControls
              zoom={zoom}
              onZoomChange={setZoom}
              onFitToScreen={handleFitToScreen}
              onReset={handleReset}
            />
            {showMinimap && (
              <div className="hidden sm:block">
                <BracketMinimap
                  contentRef={contentRef}
                  containerRef={containerRef}
                  zoom={zoom}
                />
              </div>
            )}
          </>
        ) : (
          <div />
        )}

        {/* View toggle */}
        {hasRounds && (
          <div className="flex items-center gap-1 bg-background/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-lg p-1">
            <button
              type="button"
              onClick={() => handleViewModeChange("grid")}
              className={`p-1.5 rounded transition-colors ${
                effectiveMode === "grid"
                  ? "bg-green-primary/10 text-green-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title={t("gridView") || "Grid view"}
            >
              <LayoutGrid className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={() => handleViewModeChange("mobile")}
              className={`p-1.5 rounded transition-colors ${
                effectiveMode === "mobile"
                  ? "bg-green-primary/10 text-green-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title={t("roundByRoundView") || "Round-by-round view"}
            >
              <List className="size-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      {showDesktop ? (
        <div
          ref={containerRef}
          className="overflow-auto rounded-lg border border-gray-200/50 dark:border-gray-700/50 bg-muted/5"
          style={{ maxHeight: "70vh" }}
          tabIndex={0}
        >
          <div
            ref={contentRef}
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: "top left",
              width: `${100 / zoom}%`,
            }}
          >
            {children}
          </div>
        </div>
      ) : hasRounds ? (
        <MobileBracketView rounds={rounds} />
      ) : (
        // Fallback: show desktop content without zoom if no rounds data
        <div className="overflow-auto">{children}</div>
      )}
    </div>
  );
}

export default BracketDisplayContainer;
