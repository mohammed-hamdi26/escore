"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Trophy, Search, X, Loader2, Check } from "lucide-react";
import { getImgUrl } from "@/lib/utils";
import { assignTeamToCustomMatchAction } from "@/app/[locale]/_Lib/actions";

export default function TeamAssignmentDialog({
  open,
  onOpenChange,
  tournament,
  match,
  slot,
  onAssign,
  participationType,
}) {
  const t = useTranslations("TournamentDetails");
  const [search, setSearch] = useState("");
  const [assigning, setAssigning] = useState(null); // teamId being assigned
  const [clearing, setClearing] = useState(false);
  const [error, setError] = useState(null);

  const tournamentId = tournament.id || tournament._id;
  const matchId = match.id || match._id;
  const isPlayer = participationType === "player";

  // Get current assignment for this slot
  const currentEntity = isPlayer
    ? slot === "player1" ? match.player1 : match.player2
    : slot === "team1" ? match.team1 : match.team2;

  // Get the other slot's entity (to prevent duplicate assignment)
  const otherEntity = isPlayer
    ? slot === "player1" ? match.player2 : match.player1
    : slot === "team1" ? match.team2 : match.team1;

  const currentEntityId = currentEntity?.id || currentEntity?._id;
  const otherEntityId = otherEntity?.id || otherEntity?._id;

  // Get list of participants
  const participants = useMemo(() => {
    const list = isPlayer
      ? tournament.players || []
      : tournament.teams || [];

    return list.filter((p) => {
      const name = p.name || p.nickname || "";
      return name.toLowerCase().includes(search.toLowerCase());
    });
  }, [tournament, isPlayer, search]);

  const handleAssign = async (entityId) => {
    setAssigning(entityId);
    setError(null);
    try {
      const result = await assignTeamToCustomMatchAction(
        tournamentId,
        matchId,
        { slot, teamId: entityId }
      );
      if (result.success) {
        onAssign();
      } else {
        setError(result.error);
      }
    } finally {
      setAssigning(null);
    }
  };

  const handleClear = async () => {
    setClearing(true);
    setError(null);
    try {
      const result = await assignTeamToCustomMatchAction(
        tournamentId,
        matchId,
        { slot, teamId: null }
      );
      if (result.success) {
        onAssign();
      } else {
        setError(result.error);
      }
    } finally {
      setClearing(false);
    }
  };

  if (!open) return null;

  const slotLabel = isPlayer
    ? slot === "player1" ? "Player 1" : "Player 2"
    : slot === "team1" ? "Team 1" : "Team 2";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-background rounded-xl max-w-md w-full mx-4 border border-gray-200 dark:border-gray-700 shadow-xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-foreground">
            {isPlayer
              ? t("assignPlayer") || "Assign Player"
              : t("assignTeam") || "Assign Team"}{" "}
            — {slotLabel}
          </h3>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="p-1 rounded hover:bg-muted transition-colors"
          >
            <X className="size-4 text-muted-foreground" />
          </button>
        </div>

        {/* Search */}
        <div className="p-3 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-8 py-2 rounded-lg bg-muted/30 border border-gray-300 dark:border-gray-600 text-foreground text-sm"
              placeholder={
                isPlayer
                  ? t("searchPlayers") || "Search players..."
                  : t("searchTeams") || "Search teams..."
              }
              autoFocus
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X className="size-3 text-muted-foreground" />
              </button>
            )}
          </div>
        </div>

        {/* Clear Slot button */}
        {currentEntityId && (
          <div className="px-3 pt-2">
            <button
              type="button"
              onClick={handleClear}
              disabled={clearing}
              className="w-full flex items-center justify-center gap-1 px-3 py-1.5 text-xs rounded-lg border border-red-500/30 text-red-500 hover:bg-red-500/10 transition-colors"
            >
              {clearing ? (
                <Loader2 className="size-3 animate-spin" />
              ) : (
                <X className="size-3" />
              )}
              {t("clearSlot") || "Clear Slot"}
            </button>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mx-3 mt-2 p-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-500 text-xs">
            {error}
          </div>
        )}

        {/* Participant list */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {participants.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-xs text-muted-foreground">
                {search
                  ? t("noSearchResults") || "No results found"
                  : t("noTeamsRegistered") || "No teams registered for this tournament"}
              </p>
            </div>
          ) : (
            participants.map((entity) => {
              const entityId = entity.id || entity._id;
              const name = entity.name || entity.nickname || "Unknown";
              const logo = isPlayer ? entity.photo : entity.logo;
              const isCurrent = entityId === currentEntityId;
              const isOtherSlot = entityId === otherEntityId;
              const isAssigningThis = assigning === entityId;

              return (
                <button
                  key={entityId}
                  type="button"
                  onClick={() => !isOtherSlot && handleAssign(entityId)}
                  disabled={isOtherSlot || assigning}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                    isCurrent
                      ? "bg-green-primary/10 border border-green-primary"
                      : isOtherSlot
                      ? "bg-muted/20 border border-transparent opacity-50 cursor-not-allowed"
                      : "bg-background border border-gray-200 dark:border-gray-700 hover:border-green-primary/50"
                  }`}
                >
                  {logo?.light ? (
                    <img
                      src={getImgUrl(logo.light, "thumbnail")}
                      alt={name}
                      className="size-6 rounded object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="size-6 rounded bg-muted flex items-center justify-center flex-shrink-0">
                      <Trophy className="size-3.5 text-muted-foreground" />
                    </div>
                  )}
                  <span className="flex-1 text-left truncate text-foreground">
                    {name}
                  </span>
                  {isCurrent && (
                    <Check className="size-4 text-green-primary flex-shrink-0" />
                  )}
                  {isOtherSlot && (
                    <span className="text-[10px] text-muted-foreground">
                      ({slot === "team1" || slot === "player1" ? slotLabel.replace("1", "2") : slotLabel.replace("2", "1")})
                    </span>
                  )}
                  {isAssigningThis && (
                    <Loader2 className="size-4 animate-spin text-green-primary flex-shrink-0" />
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
