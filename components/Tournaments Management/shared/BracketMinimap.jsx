"use client";

import { useRef, useCallback } from "react";

function BracketMinimap({ contentRef, containerRef, zoom }) {
  const minimapRef = useRef(null);

  const MINIMAP_WIDTH = 160;
  const MINIMAP_HEIGHT = 80;

  const getViewportRect = useCallback(() => {
    if (!contentRef?.current || !containerRef?.current) return null;

    const content = contentRef.current;
    const container = containerRef.current;

    const contentW = content.scrollWidth;
    const contentH = content.scrollHeight;

    if (contentW === 0 || contentH === 0) return null;

    const scaleX = MINIMAP_WIDTH / contentW;
    const scaleY = MINIMAP_HEIGHT / contentH;
    const scale = Math.min(scaleX, scaleY);

    const viewportW = (container.clientWidth / contentW) * MINIMAP_WIDTH * (1 / Math.max(scaleX / scaleY, 1));
    const viewportH = (container.clientHeight / contentH) * MINIMAP_HEIGHT * (1 / Math.max(scaleY / scaleX, 1));

    const scrollLeft = container.scrollLeft;
    const scrollTop = container.scrollTop;
    const maxScrollLeft = contentW - container.clientWidth;
    const maxScrollTop = contentH - container.clientHeight;

    const vpX = maxScrollLeft > 0
      ? (scrollLeft / maxScrollLeft) * (MINIMAP_WIDTH - viewportW)
      : 0;
    const vpY = maxScrollTop > 0
      ? (scrollTop / maxScrollTop) * (MINIMAP_HEIGHT - viewportH)
      : 0;

    return {
      x: Math.max(0, vpX),
      y: Math.max(0, vpY),
      width: Math.min(viewportW, MINIMAP_WIDTH),
      height: Math.min(viewportH, MINIMAP_HEIGHT),
    };
  }, [contentRef, containerRef]);

  const handleMinimapClick = useCallback(
    (e) => {
      if (!containerRef?.current || !contentRef?.current) return;

      const rect = minimapRef.current.getBoundingClientRect();
      const clickX = (e.clientX - rect.left) / MINIMAP_WIDTH;
      const clickY = (e.clientY - rect.top) / MINIMAP_HEIGHT;

      const container = containerRef.current;
      const content = contentRef.current;

      const maxScrollLeft = content.scrollWidth - container.clientWidth;
      const maxScrollTop = content.scrollHeight - container.clientHeight;

      container.scrollTo({
        left: clickX * maxScrollLeft,
        top: clickY * maxScrollTop,
        behavior: "smooth",
      });
    },
    [containerRef, contentRef]
  );

  const viewport = getViewportRect();

  return (
    <div
      ref={minimapRef}
      onClick={handleMinimapClick}
      className="relative bg-muted/30 border border-gray-200 dark:border-gray-700 rounded cursor-pointer overflow-hidden"
      style={{ width: MINIMAP_WIDTH, height: MINIMAP_HEIGHT }}
      title="Click to navigate"
    >
      {/* Content area indicator */}
      <div className="absolute inset-1 bg-muted/20 rounded-sm" />

      {/* Viewport rectangle */}
      {viewport && (
        <div
          className="absolute border-2 border-green-primary/60 bg-green-primary/10 rounded-sm pointer-events-none"
          style={{
            left: viewport.x,
            top: viewport.y,
            width: viewport.width,
            height: viewport.height,
          }}
        />
      )}
    </div>
  );
}

export default BracketMinimap;
