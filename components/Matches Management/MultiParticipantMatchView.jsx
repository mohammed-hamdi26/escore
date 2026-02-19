"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Trophy,
  Clock,
  Crosshair,
  Target,
  Skull,
  Edit,
  Calendar,
  Gamepad2,
  Eye,
} from "lucide-react";
import ParticipantResultsEditor from "./ParticipantResultsEditor";
import { getImgUrl } from "@/lib/utils";

const STATUS_CONFIG = {
  scheduled: { label: "Scheduled", className: "bg-blue-500/10 text-blue-500" },
  live: { label: "LIVE", className: "bg-green-500/10 text-green-500" },
  completed: { label: "Completed", className: "bg-purple-500/10 text-purple-500" },
  postponed: { label: "Postponed", className: "bg-yellow-500/10 text-yellow-500" },
  cancelled: { label: "Cancelled", className: "bg-red-500/10 text-red-500" },
};

function MultiParticipantMatchView({ match, tournament }) {
  const t = useTranslations("MatchDetails");
  const [isEditing, setIsEditing] = useState(
    match?.status === "scheduled" || match?.status === "live"
  );

  if (!match) return null;

  const status = STATUS_CONFIG[match.status] || STATUS_CONFIG.scheduled;
  const gameLogo = getImgUrl(match.game?.logo?.light, "medium") || getImgUrl(match.game?.logo?.dark, "medium");
  const tournamentLogo = getImgUrl(match.tournament?.logo?.light, "medium") || getImgUrl(match.tournament?.logo?.dark, "medium");

  const participants = match.participants || [];
  const sorted = [...participants].sort(
    (a, b) => (a.placement || 999) - (b.placement || 999)
  );

  const matchDate = match.scheduledAt
    ? format(new Date(match.scheduledAt), "EEEE, MMMM dd, yyyy — HH:mm")
    : null;

  return (
    <div className="space-y-6">
      {/* Match Header */}
      <div className="glass rounded-2xl p-6 border border-transparent dark:border-white/5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Crosshair className="size-6 text-orange-500" />
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                {match.matchLabel || `${t("brLobbyMatch") || "BR Lobby Match"}`}
              </h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-0.5">
                {match.bracketRound && (
                  <span>{t("round") || "Round"} {match.bracketRound}</span>
                )}
                {match.bracketStage && (
                  <span className="capitalize">{match.bracketStage.replace(/_/g, " ")}</span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.className}`}>
              {t(match.status) || status.label}
            </span>
            <Link href={`/dashboard/matches/edit/${match.id || match._id}`}>
              <Button variant="outline" size="sm" className="gap-1">
                <Edit className="size-3.5" />
                {t("edit") || "Edit"}
              </Button>
            </Link>
          </div>
        </div>

        {/* Meta info */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          {match.game && (
            <div className="flex items-center gap-2">
              {gameLogo ? (
                <img src={gameLogo} alt={match.game.name} className="size-5 rounded" />
              ) : (
                <Gamepad2 className="size-4" />
              )}
              <span>{match.game.name}</span>
            </div>
          )}
          {match.tournament && (
            <div className="flex items-center gap-2">
              {tournamentLogo ? (
                <img src={tournamentLogo} alt={match.tournament.name} className="size-5 rounded" />
              ) : (
                <Trophy className="size-4" />
              )}
              <span>{match.tournament.name}</span>
            </div>
          )}
          {matchDate && (
            <div className="flex items-center gap-2">
              <Calendar className="size-4" />
              <span>{matchDate}</span>
            </div>
          )}
        </div>
      </div>

      {/* Participants Section */}
      <div className="glass rounded-2xl p-6 border border-transparent dark:border-white/5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Target className="size-4 text-orange-500" />
            {t("participantResults") || "Participant Results"}
            <span className="text-xs text-muted-foreground font-normal ml-1">
              ({participants.length} {t("participants") || "participants"})
            </span>
          </h3>
          {participants.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
              className="gap-1 text-xs"
            >
              {isEditing ? (
                <>
                  <Eye className="size-3.5" />
                  {t("viewResults") || "View Results"}
                </>
              ) : (
                <>
                  <Edit className="size-3.5" />
                  {t("editResults") || "Edit Results"}
                </>
              )}
            </Button>
          )}
        </div>

        {isEditing && participants.length > 0 ? (
          <ParticipantResultsEditor
            match={match}
            tournament={tournament}
            onSaved={() => setIsEditing(false)}
          />
        ) : sorted.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left text-xs font-medium text-muted-foreground px-3 py-2 w-10">#</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-3 py-2">
                    {t("teamPlayer") || "Team / Player"}
                  </th>
                  <th className="text-center text-xs font-medium text-muted-foreground px-3 py-2 w-16">
                    {t("killsCol") || "Kills"}
                  </th>
                  <th className="text-center text-xs font-medium text-muted-foreground px-3 py-2 w-16">
                    {t("deathsCol") || "Deaths"}
                  </th>
                  <th className="text-center text-xs font-medium text-muted-foreground px-3 py-2 w-16">
                    {t("assistsCol") || "Assists"}
                  </th>
                  <th className="text-center text-xs font-medium text-muted-foreground px-3 py-2 w-16">
                    {t("pointsCol") || "Points"}
                  </th>
                  <th className="text-center text-xs font-medium text-muted-foreground px-3 py-2 w-24">
                    {t("statusCol") || "Status"}
                  </th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((p, index) => {
                  const entity = p.team || p.player;
                  const logo = entity?.logo || entity?.photo;
                  const name = entity?.name || entity?.nickname || t("unknown") || "Unknown";
                  const placement = p.placement;

                  return (
                    <tr
                      key={entity?.id || entity?._id || index}
                      className={`border-b border-gray-100 dark:border-gray-800 transition-colors hover:bg-muted/30 ${
                        p.isEliminated ? "opacity-60" : ""
                      }`}
                    >
                      <td className="px-3 py-3">
                        <span
                          className={`text-sm font-bold ${
                            placement === 1
                              ? "text-yellow-500"
                              : placement === 2
                              ? "text-gray-400"
                              : placement === 3
                              ? "text-orange-600"
                              : "text-muted-foreground"
                          }`}
                        >
                          {placement ? `#${placement}` : "-"}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-3">
                          {logo?.light ? (
                            <img src={getImgUrl(logo.light, "thumbnail")} alt={name} className="size-8 rounded object-cover" />
                          ) : (
                            <div className="size-8 rounded bg-muted flex items-center justify-center">
                              <Trophy className="size-4 text-muted-foreground" />
                            </div>
                          )}
                          <span className="text-sm font-medium text-foreground">{name}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-center text-sm text-foreground">{p.kills ?? "-"}</td>
                      <td className="px-3 py-3 text-center text-sm text-foreground">{p.deaths ?? "-"}</td>
                      <td className="px-3 py-3 text-center text-sm text-foreground">{p.assists ?? "-"}</td>
                      <td className="px-3 py-3 text-center text-sm font-semibold text-foreground">{p.points ?? "-"}</td>
                      <td className="px-3 py-3 text-center">
                        {p.isEliminated ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-500">
                            <Skull className="size-3" />
                            {t("eliminated") || "Eliminated"}
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Target className="size-8 mx-auto mb-2 opacity-30" />
            <p className="text-sm">{t("noParticipants") || "No participants recorded yet."}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default MultiParticipantMatchView;
