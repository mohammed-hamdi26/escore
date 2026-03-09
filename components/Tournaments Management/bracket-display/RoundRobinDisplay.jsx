"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Trophy, Users, CheckCircle, Clock, Circle, ChevronDown, ArrowLeftRight } from "lucide-react";
import { getImgUrl } from "@/lib/utils";
import toast from "react-hot-toast";
import MatchResultDialog from "../MatchResultDialog";
import { updateBracketMatchResultAction, reassignParticipantsAction } from "@/app/[locale]/_Lib/actions";

// ── Standings Table ──────────────────────────────────────────────

function GroupStandings({ group, t }) {
  const standings = useMemo(() => {
    if (!group.rounds) return [];

    // Build stats per team from match results
    const stats = new Map();

    // Initialize teams from the group
    for (const team of group.teams || []) {
      stats.set(team.id, {
        id: team.id,
        name: team.name,
        logo: team.logo,
        played: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        points: 0,
      });
    }

    // Process all matches
    for (const round of group.rounds) {
      for (const match of round.matches || []) {
        if (match.status !== "completed" && !match.result?.winner) continue;

        const t1Id = match.team1?.id || match.team1?._id;
        const t2Id = match.team2?.id || match.team2?._id;
        const s1 = match.result?.team1Score ?? 0;
        const s2 = match.result?.team2Score ?? 0;
        const winnerId = match.result?.winner?.id || match.result?.winner?._id || match.result?.winner;

        // Initialize if team not in stats (populated teams)
        if (t1Id && !stats.has(t1Id)) {
          stats.set(t1Id, {
            id: t1Id,
            name: match.team1?.name || "?",
            logo: match.team1?.logo,
            played: 0, wins: 0, draws: 0, losses: 0,
            goalsFor: 0, goalsAgainst: 0, points: 0,
          });
        }
        if (t2Id && !stats.has(t2Id)) {
          stats.set(t2Id, {
            id: t2Id,
            name: match.team2?.name || "?",
            logo: match.team2?.logo,
            played: 0, wins: 0, draws: 0, losses: 0,
            goalsFor: 0, goalsAgainst: 0, points: 0,
          });
        }

        const st1 = t1Id ? stats.get(t1Id) : null;
        const st2 = t2Id ? stats.get(t2Id) : null;

        if (st1) {
          st1.played++;
          st1.goalsFor += s1;
          st1.goalsAgainst += s2;
          // Update team name/logo from match data if available
          if (match.team1?.name) st1.name = match.team1.name;
          if (match.team1?.logo) st1.logo = match.team1.logo;
        }
        if (st2) {
          st2.played++;
          st2.goalsFor += s2;
          st2.goalsAgainst += s1;
          if (match.team2?.name) st2.name = match.team2.name;
          if (match.team2?.logo) st2.logo = match.team2.logo;
        }

        if (winnerId) {
          if (st1 && winnerId === t1Id) { st1.wins++; st1.points += 3; }
          else if (st1) { st1.losses++; }
          if (st2 && winnerId === t2Id) { st2.wins++; st2.points += 3; }
          else if (st2) { st2.losses++; }
        } else {
          // Draw
          if (st1) { st1.draws++; st1.points += 1; }
          if (st2) { st2.draws++; st2.points += 1; }
        }
      }
    }

    return [...stats.values()].sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      const gdA = a.goalsFor - a.goalsAgainst;
      const gdB = b.goalsFor - b.goalsAgainst;
      if (gdB !== gdA) return gdB - gdA;
      return b.goalsFor - a.goalsFor;
    });
  }, [group]);

  if (standings.length === 0) return null;

  return (
    <div className="rounded-xl border border-white/5 overflow-hidden mb-5">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-muted/30 text-muted-foreground text-xs">
            <th className="py-2.5 px-3 text-start font-medium w-8">#</th>
            <th className="py-2.5 px-2 text-start font-medium">{t("teams") || "Team"}</th>
            <th className="py-2.5 px-2 text-center font-medium w-10">{t("played") || "P"}</th>
            <th className="py-2.5 px-2 text-center font-medium w-10">{t("winsShort") || "W"}</th>
            <th className="py-2.5 px-2 text-center font-medium w-10">{t("drawsShort") || "D"}</th>
            <th className="py-2.5 px-2 text-center font-medium w-10">{t("lossesShort") || "L"}</th>
            <th className="py-2.5 px-2 text-center font-medium w-12 hidden sm:table-cell">{t("goalDiff") || "+/-"}</th>
            <th className="py-2.5 px-3 text-center font-medium w-12">{t("ptsShort") || "Pts"}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {standings.map((team, i) => (
            <tr
              key={team.id}
              className={`transition-colors hover:bg-muted/10 ${
                i === 0 ? "bg-green-500/5" : ""
              }`}
            >
              <td className="py-2 px-3 text-xs font-bold text-muted-foreground">{i + 1}</td>
              <td className="py-2 px-2">
                <div className="flex items-center gap-2 min-w-0">
                  {team.logo?.light ? (
                    <img
                      src={getImgUrl(team.logo.light, "thumbnail")}
                      alt={team.name}
                      className="size-5 rounded object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="size-5 rounded bg-muted flex items-center justify-center flex-shrink-0">
                      <Trophy className="size-3 text-muted-foreground" />
                    </div>
                  )}
                  <span className="text-sm font-medium text-foreground truncate">
                    {team.name}
                  </span>
                </div>
              </td>
              <td className="py-2 px-2 text-center text-xs text-muted-foreground">{team.played}</td>
              <td className="py-2 px-2 text-center text-xs text-green-500 font-medium">{team.wins}</td>
              <td className="py-2 px-2 text-center text-xs text-muted-foreground">{team.draws}</td>
              <td className="py-2 px-2 text-center text-xs text-red-400 font-medium">{team.losses}</td>
              <td className="py-2 px-2 text-center text-xs text-muted-foreground hidden sm:table-cell">
                {team.goalsFor - team.goalsAgainst > 0 ? "+" : ""}
                {team.goalsFor - team.goalsAgainst}
              </td>
              <td className="py-2 px-3 text-center text-sm font-bold text-foreground">{team.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Match Card (inline, simpler than BracketMatchCard) ───────────

function RRMatchCard({ match, onClick, t, reassignMode, selectedParticipant, onParticipantClick }) {
  const winnerId = match.result?.winner?.id || match.result?.winner?._id || match.result?.winner;
  const s1 = match.result?.team1Score;
  const s2 = match.result?.team2Score;
  const isCompleted = match.status === "completed" || winnerId;
  const isLive = match.status === "live";

  const t1 = match.team1;
  const t2 = match.team2;
  const t1Id = t1?.id || t1?._id;
  const t2Id = t2?.id || t2?._id;
  const isT1Winner = winnerId && t1Id && winnerId === t1Id;
  const isT2Winner = winnerId && t2Id && winnerId === t2Id;

  const canClick = !reassignMode && onClick && (t1 || t2);
  const canReassign = reassignMode && !isCompleted;
  const isT1Selected = selectedParticipant?.slotId === match._slotId && selectedParticipant?.field === "participant1";
  const isT2Selected = selectedParticipant?.slotId === match._slotId && selectedParticipant?.field === "participant2";

  return (
    <div
      className={`rounded-xl border overflow-hidden transition-all ${
        isLive
          ? "border-green-500/40 bg-green-500/5 ring-1 ring-green-500/20"
          : isCompleted
          ? "border-white/10 bg-white/[0.02]"
          : "border-white/5 bg-white/[0.01]"
      } ${
        canClick
          ? "cursor-pointer hover:border-green-primary/40 hover:bg-green-primary/5 active:scale-[0.99]"
          : ""
      }`}
      onClick={canClick ? () => onClick(match) : undefined}
      role={canClick ? "button" : undefined}
      tabIndex={canClick ? 0 : undefined}
      onKeyDown={
        canClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick(match);
              }
            }
          : undefined
      }
    >
      {/* Team 1 */}
      {/* Team 1 */}
      <div
        className={`flex items-center justify-between px-3 py-2.5 ${
          isT1Winner ? "bg-green-500/10" : ""
        } ${
          canReassign && t1 ? "cursor-pointer hover:bg-amber-500/10 transition-colors" : ""
        } ${
          isT1Selected ? "ring-2 ring-inset ring-amber-500 bg-amber-500/15" : ""
        } ${
          reassignMode && isCompleted ? "opacity-40" : ""
        }`}
        onClick={canReassign && t1 && onParticipantClick
          ? (e) => { e.stopPropagation(); onParticipantClick(match._slotId, "participant1", t1); }
          : undefined}
      >
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {t1?.logo?.light ? (
            <img
              src={getImgUrl(t1.logo.light, "thumbnail")}
              alt={t1.name}
              className="size-6 rounded object-cover flex-shrink-0"
            />
          ) : t1 ? (
            <div className="size-6 rounded bg-muted/50 flex items-center justify-center flex-shrink-0">
              <Trophy className="size-3.5 text-muted-foreground" />
            </div>
          ) : null}
          <span
            className={`text-sm truncate ${
              isT1Winner ? "font-bold text-green-500" : t1 ? "text-foreground" : "text-muted-foreground italic"
            }`}
          >
            {t1?.name || (t("tbd") || "TBD")}
          </span>
        </div>
        <span
          className={`text-sm font-mono tabular-nums min-w-[20px] text-end ${
            isT1Winner ? "font-bold text-green-500" : "text-muted-foreground"
          }`}
        >
          {s1 ?? "-"}
        </span>
      </div>

      {/* Divider */}
      <div className="border-t border-white/5" />

      {/* Team 2 */}
      <div
        className={`flex items-center justify-between px-3 py-2.5 ${
          isT2Winner ? "bg-green-500/10" : ""
        } ${
          canReassign && t2 ? "cursor-pointer hover:bg-amber-500/10 transition-colors" : ""
        } ${
          isT2Selected ? "ring-2 ring-inset ring-amber-500 bg-amber-500/15" : ""
        } ${
          reassignMode && isCompleted ? "opacity-40" : ""
        }`}
        onClick={canReassign && t2 && onParticipantClick
          ? (e) => { e.stopPropagation(); onParticipantClick(match._slotId, "participant2", t2); }
          : undefined}
      >
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {t2?.logo?.light ? (
            <img
              src={getImgUrl(t2.logo.light, "thumbnail")}
              alt={t2.name}
              className="size-6 rounded object-cover flex-shrink-0"
            />
          ) : t2 ? (
            <div className="size-6 rounded bg-muted/50 flex items-center justify-center flex-shrink-0">
              <Trophy className="size-3.5 text-muted-foreground" />
            </div>
          ) : null}
          <span
            className={`text-sm truncate ${
              isT2Winner ? "font-bold text-green-500" : t2 ? "text-foreground" : "text-muted-foreground italic"
            }`}
          >
            {t2?.name || (t("tbd") || "TBD")}
          </span>
        </div>
        <span
          className={`text-sm font-mono tabular-nums min-w-[20px] text-end ${
            isT2Winner ? "font-bold text-green-500" : "text-muted-foreground"
          }`}
        >
          {s2 ?? "-"}
        </span>
      </div>

      {/* Status footer */}
      {(isLive || (match.bestOf && match.bestOf > 1)) && (
        <div className="px-3 py-1 bg-muted/20 border-t border-white/5 flex items-center justify-between">
          {match.bestOf > 1 && (
            <span className="text-[10px] text-muted-foreground">Bo{match.bestOf}</span>
          )}
          {isLive && (
            <span className="text-[10px] text-green-500 font-bold uppercase animate-pulse">
              {t("live") || "LIVE"}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

// ── Round Column ─────────────────────────────────────────────────

function RoundColumn({ round, groupName, onMatchClick, t, reassignMode, selectedParticipant, onParticipantClick }) {
  // Strip group name prefix from round name (e.g., "Group A - Round 1" -> "Round 1")
  const cleanName = round.name?.replace(new RegExp(`^${groupName}\\s*[-–]\\s*`, "i"), "") || round.name;

  const total = round.matches?.length || 0;
  const completed = round.matches?.filter(
    (m) => m.status === "completed" || m.result?.winner
  ).length || 0;

  return (
    <div className="flex flex-col min-w-[220px] max-w-[280px]">
      {/* Round Header */}
      <div className="text-center mb-3 flex flex-col items-center gap-1">
        <span className="text-xs font-semibold text-foreground px-3 py-1.5 rounded-lg bg-muted/30 border border-white/5">
          {cleanName}
        </span>
        <span className="inline-flex items-center gap-1 text-[10px] font-medium">
          {completed === total && total > 0 ? (
            <>
              <CheckCircle className="size-3 text-green-500" />
              <span className="text-green-500">{completed}/{total}</span>
            </>
          ) : completed > 0 ? (
            <>
              <Clock className="size-3 text-amber-500" />
              <span className="text-amber-500">{completed}/{total}</span>
            </>
          ) : (
            <>
              <Circle className="size-3 text-muted-foreground/40" />
              <span className="text-muted-foreground/60">0/{total}</span>
            </>
          )}
        </span>
      </div>

      {/* Match Cards */}
      <div className="flex flex-col gap-2.5">
        {round.matches?.map((match) => (
          <RRMatchCard
            key={match.id}
            match={match}
            onClick={onMatchClick}
            t={t}
            reassignMode={reassignMode}
            selectedParticipant={selectedParticipant}
            onParticipantClick={onParticipantClick}
          />
        ))}
      </div>
    </div>
  );
}

// ── Group Stats Bar ──────────────────────────────────────────────

function GroupStats({ group, t }) {
  const { totalMatches, completed } = useMemo(() => {
    let total = 0;
    let done = 0;
    for (const round of group.rounds || []) {
      for (const m of round.matches || []) {
        total++;
        if (m.status === "completed" || m.result?.winner) done++;
      }
    }
    return { totalMatches: total, completed: done };
  }, [group]);

  const teamCount = group.teams?.length || 0;
  const remaining = totalMatches - completed;
  const pct = totalMatches > 0 ? Math.round((completed / totalMatches) * 100) : 0;

  return (
    <div className="flex items-center gap-4 flex-wrap mb-4 px-1">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Users className="size-3.5" />
        <span>{teamCount} {t("teams") || "teams"}</span>
      </div>
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <CheckCircle className="size-3.5 text-green-500" />
        <span>{completed}/{totalMatches} {t("matchesLower") || "matches"}</span>
      </div>
      {totalMatches > 0 && (
        <div className="flex items-center gap-2 flex-1 min-w-[100px] max-w-[200px]">
          <div className="flex-1 h-1.5 rounded-full bg-muted/30 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                pct === 100 ? "bg-green-500" : pct > 0 ? "bg-amber-500" : "bg-muted/50"
              }`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="text-[10px] text-muted-foreground font-mono">{pct}%</span>
        </div>
      )}
    </div>
  );
}

// ── View Mode Toggle ─────────────────────────────────────────────

function ViewToggle({ view, onChange, t }) {
  return (
    <div className="flex items-center gap-1 rounded-lg bg-muted/20 p-0.5 border border-white/5">
      <button
        onClick={() => onChange("rounds")}
        className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
          view === "rounds"
            ? "bg-green-primary text-white shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        {t("roundByRoundView") || "Rounds"}
      </button>
      <button
        onClick={() => onChange("standings")}
        className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
          view === "standings"
            ? "bg-green-primary text-white shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        {t("standings") || "Standings"}
      </button>
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────

function RoundRobinDisplay({ bracket, tournament, onRefresh, participationType }) {
  const t = useTranslations("TournamentDetails");
  const [activeGroupTab, setActiveGroupTab] = useState(0);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [viewMode, setViewMode] = useState("rounds");
  const [reassignMode, setReassignMode] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [reassignLoading, setReassignLoading] = useState(false);

  const handleMatchClick = (match) => {
    setSelectedMatch(match);
  };

  const handleParticipantClick = async (slotId, field, team) => {
    if (reassignLoading) return;

    // Clicking the same participant → deselect
    if (selectedParticipant?.slotId === slotId && selectedParticipant?.field === field) {
      setSelectedParticipant(null);
      return;
    }

    // No participant selected yet → select this one
    if (!selectedParticipant) {
      setSelectedParticipant({ slotId, field, team });
      return;
    }

    // Second participant clicked → perform swap
    setReassignLoading(true);
    try {
      const result = await reassignParticipantsAction(tournament.id, {
        slot1Id: selectedParticipant.slotId,
        slot1Field: selectedParticipant.field,
        slot2Id: slotId,
        slot2Field: field,
      });

      if (result.success) {
        toast.success(t("reassignSuccess"));
        if (onRefresh) onRefresh();
      } else {
        toast.error(result.error || t("reassignError"));
      }
    } catch {
      toast.error(t("reassignError"));
    } finally {
      setReassignLoading(false);
      setSelectedParticipant(null);
    }
  };

  const handleResultSet = () => {
    setSelectedMatch(null);
    if (onRefresh) onRefresh();
  };

  if (!bracket.groups || bracket.groups.length === 0) {
    return null;
  }

  const activeGroup = bracket.groups[activeGroupTab];

  return (
    <div>
      {/* Header with Group Tabs + View Toggle */}
      <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
        {/* Group Tabs - Desktop */}
        <div className="hidden sm:flex gap-1.5 overflow-x-auto" role="tablist">
          {bracket.groups.map((group, index) => {
            const total = group.rounds?.reduce((s, r) => s + (r.matches?.length || 0), 0) || 0;
            const done = group.rounds?.reduce(
              (s, r) =>
                s + (r.matches?.filter((m) => m.status === "completed" || m.result?.winner).length || 0),
              0
            ) || 0;
            const allDone = total > 0 && done === total;

            return (
              <button
                key={index}
                role="tab"
                aria-selected={activeGroupTab === index}
                onClick={() => { setActiveGroupTab(index); setSelectedParticipant(null); }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  activeGroupTab === index
                    ? "bg-green-primary text-white shadow-sm shadow-green-primary/20"
                    : "bg-muted/20 text-muted-foreground hover:bg-muted/40 border border-white/5"
                }`}
              >
                {group.name}
                {allDone && <CheckCircle className="size-3.5" />}
              </button>
            );
          })}
        </div>

        {/* Group Tabs - Mobile dropdown */}
        <div className="sm:hidden relative flex-1">
          <select
            value={activeGroupTab}
            onChange={(e) => { setActiveGroupTab(Number(e.target.value)); setSelectedParticipant(null); }}
            className="w-full px-3 py-2.5 rounded-lg bg-muted/20 border border-white/5 text-foreground text-sm font-medium appearance-none pe-8"
            aria-label={t("selectGroup") || "Select group"}
          >
            {bracket.groups.map((group, index) => (
              <option key={index} value={index}>
                {group.name}
              </option>
            ))}
          </select>
          <ChevronDown className="size-4 absolute end-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground" />
        </div>

        <div className="flex items-center gap-2">
          {tournament && (
            <button
              onClick={() => { setReassignMode(!reassignMode); setSelectedParticipant(null); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                reassignMode
                  ? "bg-amber-500/20 border-amber-500/40 text-amber-500"
                  : "bg-muted/20 border-white/5 text-muted-foreground hover:text-foreground hover:bg-muted/40"
              }`}
            >
              <ArrowLeftRight className="size-3.5" />
              {reassignMode ? t("exitReassignMode") : t("reassignTeams")}
            </button>
          )}
          <ViewToggle view={viewMode} onChange={setViewMode} t={t} />
        </div>
      </div>

      {/* Reassign Mode Banner */}
      {reassignMode && (
        <div className="mb-3 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center gap-2">
          <ArrowLeftRight className={`size-4 text-amber-500 shrink-0 ${reassignLoading ? "animate-spin" : ""}`} />
          <span className="text-xs text-amber-500">
            {reassignLoading
              ? "..."
              : selectedParticipant
              ? `${t("reassignSelectSecond")} — ${selectedParticipant.team?.name}`
              : t("reassignSelectFirst")}
          </span>
          {selectedParticipant && !reassignLoading && (
            <button
              onClick={() => setSelectedParticipant(null)}
              className="ms-auto text-xs text-amber-500/70 hover:text-amber-500 underline"
            >
              {t("reassignCancel")}
            </button>
          )}
        </div>
      )}

      {/* Active Group Content */}
      {activeGroup && (
        <div>
          <GroupStats group={activeGroup} t={t} />

          {viewMode === "standings" ? (
            <GroupStandings group={activeGroup} t={t} />
          ) : (
            /* Rounds View */
            <div className="pb-4 overflow-x-auto">
              <div className="flex gap-4 min-w-fit">
                {activeGroup.rounds?.map((round) => (
                  <RoundColumn
                    key={`${round.name}-${round.round}`}
                    round={round}
                    groupName={activeGroup.name}
                    onMatchClick={tournament ? handleMatchClick : undefined}
                    t={t}
                    reassignMode={reassignMode}
                    selectedParticipant={selectedParticipant}
                    onParticipantClick={handleParticipantClick}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Always show standings below rounds view too */}
          {viewMode === "rounds" && (
            <GroupStandings group={activeGroup} t={t} />
          )}
        </div>
      )}

      {/* Match Result Dialog */}
      {selectedMatch && tournament && (
        <MatchResultDialog
          open={!!selectedMatch}
          onOpenChange={(open) => {
            if (!open) setSelectedMatch(null);
          }}
          tournament={tournament}
          match={selectedMatch}
          onResultSet={handleResultSet}
          participationType={participationType || "team"}
          saveAction={updateBracketMatchResultAction}
        />
      )}
    </div>
  );
}

export default RoundRobinDisplay;
