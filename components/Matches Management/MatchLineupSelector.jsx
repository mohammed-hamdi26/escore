"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Users, User, Loader2 } from "lucide-react";
import { fetchPlayersByTeam } from "@/app/[locale]/_Lib/actions";

function MatchLineupSelector({
  teamId,
  teamName,
  teamLogo,
  selectedPlayers = [],
  onSelectionChange,
}) {
  const t = useTranslations("MatchForm");
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPlayers() {
      if (!teamId) {
        setPlayers([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const data = await fetchPlayersByTeam(teamId);
        setPlayers(data || []);
      } catch (err) {
        console.error("Failed to fetch players:", err);
        setError("LOAD_ERROR");
        setPlayers([]);
      } finally {
        setLoading(false);
      }
    }

    fetchPlayers();
  }, [teamId]);

  const handlePlayerToggle = (playerId) => {
    const isSelected = selectedPlayers.includes(playerId);
    let newSelection;

    if (isSelected) {
      newSelection = selectedPlayers.filter((id) => id !== playerId);
    } else {
      newSelection = [...selectedPlayers, playerId];
    }

    onSelectionChange(newSelection);
  };

  const handleSelectAll = () => {
    const allPlayerIds = players.map((p) => p.id || p._id);
    onSelectionChange(allPlayerIds);
  };

  const handleClearAll = () => {
    onSelectionChange([]);
  };

  if (!teamId) return null;

  return (
    <div className="rounded-lg border border-[#2a2f3e] bg-[#1a1f2e]/30 flex-1 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-[#232838] flex items-center justify-center">
            {teamLogo ? (
              <Image
                src={teamLogo}
                width={32}
                height={32}
                alt={teamName || "Team"}
                className="object-contain"
              />
            ) : (
              <Users className="w-5 h-5 text-gray-400" />
            )}
          </div>
          <div>
            <h4 className="font-semibold">{teamName || t("Team Lineup")}</h4>
            <p className="text-sm text-[#677185]">
              {selectedPlayers.length} {t("selected")}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleSelectAll}
            disabled={loading || players.length === 0}
            className="text-xs"
          >
            {t("Select All")}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClearAll}
            disabled={loading || selectedPlayers.length === 0}
            className="text-xs"
          >
            {t("Clear All")}
          </Button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-[#677185]" />
          <span className="ml-2 text-[#677185]">{t("Loading players")}</span>
        </div>
      ) : error ? (
        <div className="text-center py-8 text-red-400">
          {t("Failed to load players")}
        </div>
      ) : players.length === 0 ? (
        <div className="text-center py-8 text-[#677185]">
          <User className="w-10 h-10 mx-auto mb-2 opacity-50" />
          <p>{t("No players available")}</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {players.map((player) => {
            const playerId = player.id || player._id;
            const isSelected = selectedPlayers.includes(playerId);
            const photoUrl = player?.photo?.light || player?.photo?.dark;

            return (
              <label
                key={playerId}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                  isSelected
                    ? "bg-green-primary/20 border border-green-primary/50"
                    : "bg-[#232838] hover:bg-[#2a3142]"
                }`}
              >
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={() => handlePlayerToggle(playerId)}
                  className="data-[state=checked]:bg-green-primary data-[state=checked]:border-green-primary"
                />

                <div className="w-8 h-8 rounded-full overflow-hidden bg-[#1a1f2e] flex items-center justify-center">
                  {photoUrl ? (
                    <Image
                      src={photoUrl}
                      width={32}
                      height={32}
                      alt={player.nickname || "Player"}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <User className="w-4 h-4 text-gray-400" />
                  )}
                </div>

                <div className="flex-1">
                  <p className="font-medium text-sm">{player.nickname}</p>
                  {(player.firstName || player.lastName) && (
                    <p className="text-xs text-[#677185]">
                      {player.firstName} {player.lastName}
                    </p>
                  )}
                </div>

                {/* {player.role && (
                  <span className="px-2 py-1 rounded-full bg-[#1a1f2e] text-xs text-[#677185]">
                    {player.role}
                  </span>
                )} */}

                {/* {player.country?.flag && (
                  <span className="text-sm">{player.country.code}</span>
                )} */}
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MatchLineupSelector;
