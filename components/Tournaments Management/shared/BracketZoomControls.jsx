"use client";

import { useTranslations } from "next-intl";
import { ZoomIn, ZoomOut, Maximize, RotateCcw } from "lucide-react";

const ZOOM_STEP = 0.1;
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 1.5;

function BracketZoomControls({ zoom, onZoomChange, onFitToScreen, onReset }) {
  const t = useTranslations("TournamentDetails");

  const zoomIn = () => onZoomChange(Math.min(zoom + ZOOM_STEP, MAX_ZOOM));
  const zoomOut = () => onZoomChange(Math.max(zoom - ZOOM_STEP, MIN_ZOOM));
  const zoomPercent = Math.round(zoom * 100);

  return (
    <div className="flex items-center gap-1 bg-background/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-lg p-1 shadow-sm">
      <button
        type="button"
        onClick={zoomOut}
        disabled={zoom <= MIN_ZOOM}
        className="p-1.5 rounded hover:bg-muted/80 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        title={t("zoomOut") || "Zoom out"}
      >
        <ZoomOut className="size-3.5" />
      </button>

      <span className="text-[10px] font-mono text-muted-foreground min-w-[36px] text-center select-none">
        {zoomPercent}%
      </span>

      <button
        type="button"
        onClick={zoomIn}
        disabled={zoom >= MAX_ZOOM}
        className="p-1.5 rounded hover:bg-muted/80 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        title={t("zoomIn") || "Zoom in"}
      >
        <ZoomIn className="size-3.5" />
      </button>

      <div className="w-px h-4 bg-gray-200 dark:bg-gray-700 mx-0.5" />

      <button
        type="button"
        onClick={onFitToScreen}
        className="p-1.5 rounded hover:bg-muted/80 transition-colors"
        title={t("fitToScreen") || "Fit to screen"}
      >
        <Maximize className="size-3.5" />
      </button>

      <button
        type="button"
        onClick={onReset}
        className="p-1.5 rounded hover:bg-muted/80 transition-colors"
        title={t("resetZoom") || "Reset zoom"}
      >
        <RotateCcw className="size-3.5" />
      </button>
    </div>
  );
}

export { MIN_ZOOM, MAX_ZOOM };
export default BracketZoomControls;
