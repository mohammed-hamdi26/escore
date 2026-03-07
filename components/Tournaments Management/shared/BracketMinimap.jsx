"use client";

import { useRef, useCallback, useState, useEffect } from "react";

function BracketMinimap({ contentRef, containerRef, zoom }) {
  const minimapRef = useRef(null);
  const previewRef = useRef(null);
  const [dimensions, setDimensions] = useState({ contentW: 0, contentH: 0 });

  const MINIMAP_WIDTH = 180;
  const MINIMAP_HEIGHT = 90;

  // Track content dimensions
  useEffect(() => {
    if (!contentRef?.current) return;

    const updateDimensions = () => {
      const content = contentRef.current;
      if (!content) return;
      setDimensions({
        contentW: content.scrollWidth,
        contentH: content.scrollHeight,
      });
    };

    updateDimensions();

    const observer = new ResizeObserver(updateDimensions);
    observer.observe(contentRef.current);
    return () => observer.disconnect();
  }, [contentRef, zoom]);

  // Clone content into minimap for real preview
  useEffect(() => {
    if (!contentRef?.current || !previewRef?.current) return;
    if (dimensions.contentW === 0 || dimensions.contentH === 0) return;

    const scaleX = MINIMAP_WIDTH / dimensions.contentW;
    const scaleY = MINIMAP_HEIGHT / dimensions.contentH;
    const scale = Math.min(scaleX, scaleY);

    const preview = previewRef.current;
    // Clone the bracket content
    const clone = contentRef.current.cloneNode(true);

    // Remove interactivity from clone
    clone.querySelectorAll("button, a, input, select, textarea").forEach((el) => {
      el.style.pointerEvents = "none";
      el.tabIndex = -1;
    });

    // Style the clone for minimap
    clone.style.transform = `scale(${scale})`;
    clone.style.transformOrigin = "top left";
    clone.style.width = `${dimensions.contentW}px`;
    clone.style.height = `${dimensions.contentH}px`;
    clone.style.position = "absolute";
    clone.style.top = "0";
    clone.style.left = "0";

    preview.innerHTML = "";
    preview.appendChild(clone);
  }, [contentRef, dimensions, zoom]);

  const getViewportRect = useCallback(() => {
    if (!containerRef?.current || dimensions.contentW === 0) return null;

    const container = containerRef.current;
    const scaleX = MINIMAP_WIDTH / dimensions.contentW;
    const scaleY = MINIMAP_HEIGHT / dimensions.contentH;
    const scale = Math.min(scaleX, scaleY);

    const viewportW = container.clientWidth * scale;
    const viewportH = container.clientHeight * scale;

    const scrollLeft = container.scrollLeft;
    const scrollTop = container.scrollTop;

    const vpX = scrollLeft * scale;
    const vpY = scrollTop * scale;

    return {
      x: Math.max(0, Math.min(vpX, MINIMAP_WIDTH - viewportW)),
      y: Math.max(0, Math.min(vpY, MINIMAP_HEIGHT - viewportH)),
      width: Math.min(viewportW, MINIMAP_WIDTH),
      height: Math.min(viewportH, MINIMAP_HEIGHT),
    };
  }, [containerRef, dimensions]);

  const handleMinimapClick = useCallback(
    (e) => {
      if (!containerRef?.current || dimensions.contentW === 0) return;

      const rect = minimapRef.current.getBoundingClientRect();
      const scaleX = MINIMAP_WIDTH / dimensions.contentW;
      const scaleY = MINIMAP_HEIGHT / dimensions.contentH;
      const scale = Math.min(scaleX, scaleY);

      const clickX = (e.clientX - rect.left) / scale;
      const clickY = (e.clientY - rect.top) / scale;

      const container = containerRef.current;
      container.scrollTo({
        left: clickX - container.clientWidth / 2,
        top: clickY - container.clientHeight / 2,
        behavior: "smooth",
      });
    },
    [containerRef, dimensions]
  );

  const viewport = getViewportRect();

  return (
    <div
      ref={minimapRef}
      onClick={handleMinimapClick}
      className="relative bg-background/90 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer overflow-hidden shadow-sm"
      style={{ width: MINIMAP_WIDTH, height: MINIMAP_HEIGHT }}
      title="Click to navigate"
    >
      {/* Scaled-down bracket preview */}
      <div
        ref={previewRef}
        className="absolute inset-0 overflow-hidden pointer-events-none opacity-60"
      />

      {/* Viewport rectangle */}
      {viewport && viewport.width < MINIMAP_WIDTH * 0.95 && (
        <div
          className="absolute border-2 border-green-primary bg-green-primary/10 rounded-sm pointer-events-none transition-all duration-100"
          style={{
            left: viewport.x,
            top: viewport.y,
            width: Math.max(viewport.width, 8),
            height: Math.max(viewport.height, 8),
          }}
        />
      )}
    </div>
  );
}

export default BracketMinimap;
