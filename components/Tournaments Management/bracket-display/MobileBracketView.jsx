"use client";

import { useState, useRef, useCallback } from "react";
import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight } from "lucide-react";
import BracketMatchCardMobile from "./BracketMatchCardMobile";

function MobileBracketView({ rounds }) {
  const t = useTranslations("TournamentDetails");
  const [currentRound, setCurrentRound] = useState(0);
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);

  const SWIPE_THRESHOLD = 50;

  const goToRound = useCallback(
    (index) => {
      if (index >= 0 && index < rounds.length) {
        setCurrentRound(index);
      }
    },
    [rounds.length]
  );

  const handleTouchStart = useCallback((e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const handleTouchEnd = useCallback(
    (e) => {
      if (touchStartX.current === null) return;

      const deltaX = e.changedTouches[0].clientX - touchStartX.current;
      const deltaY = e.changedTouches[0].clientY - touchStartY.current;

      // Only swipe if horizontal movement > vertical (prevent hijacking vertical scroll)
      if (Math.abs(deltaX) > SWIPE_THRESHOLD && Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX < 0) {
          // Swipe left → next round
          goToRound(currentRound + 1);
        } else {
          // Swipe right → previous round
          goToRound(currentRound - 1);
        }
      }

      touchStartX.current = null;
      touchStartY.current = null;
    },
    [currentRound, goToRound]
  );

  if (!rounds || rounds.length === 0) return null;

  const round = rounds[currentRound];
  const matches = round?.matches || [];

  return (
    <div
      className="space-y-4"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Navigation header */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => goToRound(currentRound - 1)}
          disabled={currentRound === 0}
          className="p-2 rounded-lg hover:bg-muted/80 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="size-5" />
        </button>

        <div className="text-center">
          <span className="text-sm font-medium text-foreground">
            {round?.name || `Round ${currentRound + 1}`}
          </span>
          <span className="text-xs text-muted-foreground block">
            {matches.length} {t("matchesLower") || "matches"}
          </span>
        </div>

        <button
          type="button"
          onClick={() => goToRound(currentRound + 1)}
          disabled={currentRound === rounds.length - 1}
          className="p-2 rounded-lg hover:bg-muted/80 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="size-5" />
        </button>
      </div>

      {/* Round indicator dots */}
      <div className="flex items-center justify-center gap-1.5">
        {rounds.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => goToRound(i)}
            className={`rounded-full transition-all ${
              i === currentRound
                ? "w-6 h-2 bg-green-primary"
                : "w-2 h-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
            }`}
            aria-label={`${t("goToRound") || "Go to round"} ${i + 1}`}
          />
        ))}
      </div>

      {/* Matches */}
      <div className="space-y-3">
        {matches.map((match) => (
          <BracketMatchCardMobile key={match.id} match={match} />
        ))}
      </div>
    </div>
  );
}

export default MobileBracketView;
