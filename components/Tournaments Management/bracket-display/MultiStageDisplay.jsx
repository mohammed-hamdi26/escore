"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Layers, ArrowLeftRight } from "lucide-react";
import toast from "react-hot-toast";
import BracketMatchCard from "../BracketMatchCard";
import BracketRounds from "./BracketRounds";
import MatchResultDialog from "../MatchResultDialog";
import { updateBracketMatchResultAction, reassignMatchParticipantsAction } from "@/app/[locale]/_Lib/actions";

function MultiStageDisplay({ bracket, activeStageTab, tournament, onRefresh, participationType }) {
  const t = useTranslations("TournamentDetails");
  const [activeGroupTab, setActiveGroupTab] = useState(0);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [reassignMode, setReassignMode] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [reassignLoading, setReassignLoading] = useState(false);

  if (!bracket.stages) return null;

  const activeStage = bracket.stages.find(
    (s) => s.stageOrder === activeStageTab
  );

  if (!activeStage || !activeStage.isGenerated) {
    return (
      <div className="text-center py-8">
        <Layers className="size-12 text-muted-foreground/30 mx-auto mb-3" />
        <p className="text-muted-foreground">
          {t("stagePending") || "This stage has not been generated yet"}
        </p>
      </div>
    );
  }

  const handleMatchClick = tournament ? (match) => {
    setSelectedMatch(match);
  } : undefined;

  const handleParticipantClick = async (matchId, field, team) => {
    if (reassignLoading) return;

    if (selectedParticipant?.matchId === matchId && selectedParticipant?.field === field) {
      setSelectedParticipant(null);
      return;
    }

    if (!selectedParticipant) {
      setSelectedParticipant({ matchId, field, team });
      return;
    }

    setReassignLoading(true);
    try {
      const result = await reassignMatchParticipantsAction(tournament.id, {
        match1Id: selectedParticipant.matchId,
        match1Field: selectedParticipant.field,
        match2Id: matchId,
        match2Field: field,
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

  return (
    <div>
      {/* RR Groups */}
      {activeStage.groups && activeStage.groups.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
            {/* Mobile: dropdown */}
            <div className="sm:hidden flex-1">
              <select
                value={activeGroupTab}
                onChange={(e) => { setActiveGroupTab(Number(e.target.value)); setSelectedParticipant(null); }}
                className="w-full px-3 py-2 rounded-lg bg-background border border-gray-300 dark:border-gray-600 text-foreground text-sm"
                aria-label={t("selectGroup") || "Select group"}
              >
                {activeStage.groups.map((group, index) => (
                  <option key={index} value={index}>{group.name}</option>
                ))}
              </select>
            </div>
            {/* Tablet/Desktop: tabs */}
            <div className="hidden sm:flex gap-2 overflow-x-auto" role="tablist">
              {activeStage.groups.map((group, index) => (
                <button
                  key={index}
                  role="tab"
                  aria-selected={activeGroupTab === index}
                  onClick={() => { setActiveGroupTab(index); setSelectedParticipant(null); }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap min-h-[40px] ${
                    activeGroupTab === index
                      ? "bg-green-primary text-white"
                      : "bg-muted/30 text-muted-foreground hover:bg-muted/50"
                  }`}
                >
                  {group.name}
                </button>
              ))}
            </div>
            {/* Reassign Toggle */}
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

          {activeStage.groups[activeGroupTab] && (
            <BracketRounds
              rounds={activeStage.groups[activeGroupTab].rounds}
              onMatchClick={handleMatchClick}
              reassignMode={reassignMode}
              selectedParticipant={selectedParticipant}
              onParticipantClick={handleParticipantClick}
            />
          )}
        </div>
      )}

      {/* Swiss Rounds */}
      {activeStage.swissRounds && activeStage.swissRounds.length > 0 && (
        <div>
          <div className="space-y-6">
            {activeStage.swissRounds.map((round, roundIndex) => (
              <div key={roundIndex}>
                <div className="text-center mb-3">
                  <span className="text-xs font-medium px-3 py-1 rounded-full bg-muted/50 text-muted-foreground">
                    {round.name || `Round ${roundIndex + 1}`}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 justify-items-center">
                  {round.matches.map((match) => (
                    <BracketMatchCard key={match.id} match={match} onClick={handleMatchClick} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SE/DE Rounds (skip if groups are displayed — DE groups already show per-group brackets) */}
      {activeStage.rounds && !(activeStage.groups && activeStage.groups.length > 0) && (
        <>
          {activeStage.rounds.winners &&
            activeStage.rounds.winners.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-medium text-muted-foreground mb-4">
                  {t("winnersBracket") || "Winners Bracket"}
                </h4>
                <BracketRounds rounds={activeStage.rounds.winners} onMatchClick={handleMatchClick} />
              </div>
            )}
          {activeStage.rounds.losers &&
            activeStage.rounds.losers.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-medium text-muted-foreground mb-4">
                  {t("losersBracket") || "Losers Bracket"}
                </h4>
                <BracketRounds rounds={activeStage.rounds.losers} onMatchClick={handleMatchClick} />
              </div>
            )}
          {activeStage.rounds.grandFinals &&
            activeStage.rounds.grandFinals.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-medium text-muted-foreground mb-4">
                  {t("grandFinals") || "Grand Finals"}
                </h4>
                <div className="flex justify-center">
                  <div className="flex flex-col gap-3">
                    {activeStage.rounds.grandFinals.map((match) => (
                      <BracketMatchCard key={match.id} match={match} onClick={handleMatchClick} />
                    ))}
                  </div>
                </div>
              </div>
            )}
        </>
      )}

      {selectedMatch && tournament && (
        <MatchResultDialog
          open={!!selectedMatch}
          onOpenChange={(open) => { if (!open) setSelectedMatch(null); }}
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

export default MultiStageDisplay;
