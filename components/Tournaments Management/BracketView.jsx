"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Button } from "../ui/button";
import BracketMatchCard from "./BracketMatchCard";
import {
  Trophy,
  Trash2,
  RefreshCw,
  Loader2,
  AlertTriangle,
  ChevronDown,
  GripVertical,
} from "lucide-react";
import {
  getBracketAction,
  generateBracketAction,
  deleteBracketAction,
} from "@/app/[locale]/_Lib/actions";

function BracketView({ tournament }) {
  const t = useTranslations("TournamentDetails");
  const [bracket, setBracket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Generate form state
  const [bracketType, setBracketType] = useState("single_elimination");
  const [bestOf, setBestOf] = useState(3);
  const [autoAdvance, setAutoAdvance] = useState(true);
  const [seeds, setSeeds] = useState([]);

  const tournamentId = tournament.id || tournament._id;

  const fetchBracket = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getBracketAction(tournamentId);
      if (result.success) {
        setBracket(result.data);
      } else {
        setError(result.error);
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [tournamentId]);

  useEffect(() => {
    fetchBracket();
  }, [fetchBracket]);

  useEffect(() => {
    if (tournament.teams && tournament.teams.length > 0) {
      setSeeds(
        tournament.teams.map((team) => ({
          id: team.id || team._id || team,
          name: team.name || "Unknown",
          logo: team.logo,
        }))
      );
    }
  }, [tournament.teams]);

  const handleGenerate = async () => {
    setGenerating(true);
    setError(null);
    try {
      const seedIds = seeds.map((s) => s.id);
      const result = await generateBracketAction(tournamentId, {
        bracketType,
        seeds: seedIds,
        defaultBestOf: bestOf,
        autoAdvance,
      });
      if (result.success) {
        await fetchBracket();
      } else {
        setError(result.error);
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setGenerating(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    setError(null);
    try {
      const result = await deleteBracketAction(tournamentId);
      if (result.success) {
        setBracket(null);
        setShowDeleteConfirm(false);
      } else {
        setError(result.error);
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setDeleting(false);
    }
  };

  const moveSeed = (index, direction) => {
    const newSeeds = [...seeds];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= newSeeds.length) return;
    [newSeeds[index], newSeeds[targetIndex]] = [
      newSeeds[targetIndex],
      newSeeds[index],
    ];
    setSeeds(newSeeds);
  };

  if (loading) {
    return (
      <div className="glass rounded-2xl p-6 border border-transparent dark:border-white/5">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="size-6 animate-spin text-green-primary" />
          <span className="ml-3 text-muted-foreground">
            {t("loadingBracket") || "Loading bracket..."}
          </span>
        </div>
      </div>
    );
  }

  // No bracket exists — show generate form
  if (!bracket) {
    return (
      <div className="glass rounded-2xl p-6 border border-transparent dark:border-white/5">
        <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
          <Trophy className="size-5 text-green-primary" />
          {t("generateBracket") || "Generate Bracket"}
        </h3>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-500 text-sm flex items-center gap-2">
            <AlertTriangle className="size-4 flex-shrink-0" />
            {error}
          </div>
        )}

        {(!tournament.teams || tournament.teams.length < 2) ? (
          <div className="text-center py-8">
            <Trophy className="size-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">
              {t("needTeams") || "At least 2 teams are required to generate a bracket."}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Bracket Type */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                {t("bracketType") || "Bracket Type"}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setBracketType("single_elimination")}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    bracketType === "single_elimination"
                      ? "border-green-primary bg-green-primary/10 text-green-primary"
                      : "border-gray-300 dark:border-gray-600 text-muted-foreground hover:border-green-primary/50"
                  }`}
                >
                  <div className="font-medium text-sm">
                    {t("singleElimination") || "Single Elimination"}
                  </div>
                  <div className="text-xs mt-1 opacity-70">
                    {t("singleEliminationDesc") || "Lose once and you're out"}
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setBracketType("double_elimination")}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    bracketType === "double_elimination"
                      ? "border-green-primary bg-green-primary/10 text-green-primary"
                      : "border-gray-300 dark:border-gray-600 text-muted-foreground hover:border-green-primary/50"
                  }`}
                >
                  <div className="font-medium text-sm">
                    {t("doubleElimination") || "Double Elimination"}
                  </div>
                  <div className="text-xs mt-1 opacity-70">
                    {t("doubleEliminationDesc") || "Lose twice to be eliminated"}
                  </div>
                </button>
              </div>
            </div>

            {/* Best Of */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                {t("defaultBestOf") || "Default Best Of"}
              </label>
              <div className="flex gap-2">
                {[1, 3, 5, 7].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setBestOf(n)}
                    className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                      bestOf === n
                        ? "border-green-primary bg-green-primary/10 text-green-primary"
                        : "border-gray-300 dark:border-gray-600 text-muted-foreground hover:border-green-primary/50"
                    }`}
                  >
                    Bo{n}
                  </button>
                ))}
              </div>
            </div>

            {/* Auto Advance */}
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-medium text-foreground">
                  {t("autoAdvance") || "Auto-Advance Winners"}
                </label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {t("autoAdvanceDesc") || "Automatically move winners to the next round"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setAutoAdvance(!autoAdvance)}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  autoAdvance ? "bg-green-primary" : "bg-gray-400"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                    autoAdvance ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Seed Order */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                {t("seedOrder") || "Seed Order"}
              </label>
              <p className="text-xs text-muted-foreground mb-3">
                {t("seedOrderDesc") || "Drag to reorder. Seed #1 is the top seed."}
              </p>
              <div className="space-y-2">
                {seeds.map((team, index) => (
                  <div
                    key={team.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 dark:bg-[#1a1d2e] border border-transparent hover:border-green-primary/20 transition-colors"
                  >
                    <span className="text-xs font-bold text-green-primary w-6 text-center">
                      #{index + 1}
                    </span>
                    <GripVertical className="size-4 text-muted-foreground" />
                    {team.logo?.light ? (
                      <img
                        src={team.logo.light}
                        alt={team.name}
                        className="size-6 rounded object-cover"
                      />
                    ) : (
                      <div className="size-6 rounded bg-muted flex items-center justify-center">
                        <Trophy className="size-3 text-muted-foreground" />
                      </div>
                    )}
                    <span className="text-sm font-medium text-foreground flex-1">
                      {team.name}
                    </span>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => moveSeed(index, -1)}
                        disabled={index === 0}
                        className="p-1 rounded hover:bg-muted disabled:opacity-30 transition-colors"
                      >
                        <ChevronDown className="size-4 text-muted-foreground rotate-180" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveSeed(index, 1)}
                        disabled={index === seeds.length - 1}
                        className="p-1 rounded hover:bg-muted disabled:opacity-30 transition-colors"
                      >
                        <ChevronDown className="size-4 text-muted-foreground" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <Button
              onClick={handleGenerate}
              disabled={generating || seeds.length < 2}
              className="w-full gap-2 bg-green-primary hover:bg-green-primary/90 text-white"
            >
              {generating ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  {t("generating") || "Generating..."}
                </>
              ) : (
                <>
                  <Trophy className="size-4" />
                  {t("generateBracketBtn") || "Generate Bracket"}
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    );
  }

  // Bracket exists — show visualization
  return (
    <div className="space-y-6">
      {/* Bracket Header */}
      <div className="glass rounded-2xl p-6 border border-transparent dark:border-white/5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Trophy className="size-5 text-green-primary" />
            {t("bracket") || "Bracket"}
            <span className="text-sm font-normal text-muted-foreground ml-2">
              {bracket.bracketType === "single_elimination"
                ? t("singleElimination") || "Single Elimination"
                : t("doubleElimination") || "Double Elimination"}
            </span>
          </h3>
          <div className="flex items-center gap-2">
            {/* Status badge */}
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                bracket.bracketStatus === "completed"
                  ? "bg-purple-500/10 text-purple-500"
                  : bracket.bracketStatus === "in_progress"
                  ? "bg-green-500/10 text-green-500"
                  : "bg-blue-500/10 text-blue-500"
              }`}
            >
              {t(bracket.bracketStatus) || bracket.bracketStatus}
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={fetchBracket}
              className="gap-1 border-gray-300 dark:border-gray-600"
            >
              <RefreshCw className="size-3.5" />
              {t("refresh") || "Refresh"}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDeleteConfirm(true)}
              className="gap-1 border-red-500/30 text-red-500 hover:bg-red-500/10"
            >
              <Trash2 className="size-3.5" />
              {t("deleteBracket") || "Delete"}
            </Button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-500 text-sm flex items-center gap-2">
            <AlertTriangle className="size-4 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Delete Confirmation */}
        {showDeleteConfirm && (
          <div className="mb-4 p-4 rounded-xl bg-red-500/5 border border-red-500/20">
            <p className="text-sm text-foreground mb-3">
              {t("deleteBracketConfirm") ||
                "Are you sure you want to delete this bracket? All bracket matches will be removed."}
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleDelete}
                disabled={deleting}
                className="gap-1 bg-red-500 hover:bg-red-600 text-white"
              >
                {deleting ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <Trash2 className="size-3.5" />
                )}
                {deleting
                  ? t("deleting") || "Deleting..."
                  : t("confirmDelete") || "Yes, Delete"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDeleteConfirm(false)}
                className="border-gray-300 dark:border-gray-600"
              >
                {t("cancel") || "Cancel"}
              </Button>
            </div>
          </div>
        )}

        {/* Winners Bracket */}
        {bracket.rounds?.winners && bracket.rounds.winners.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-muted-foreground mb-4">
              {t("winnersBracket") || "Winners Bracket"}
            </h4>
            <BracketRounds rounds={bracket.rounds.winners} />
          </div>
        )}

        {/* Losers Bracket */}
        {bracket.rounds?.losers && bracket.rounds.losers.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-muted-foreground mb-4">
              {t("losersBracket") || "Losers Bracket"}
            </h4>
            <BracketRounds rounds={bracket.rounds.losers} />
          </div>
        )}

        {/* Grand Finals */}
        {bracket.rounds?.grandFinals &&
          bracket.rounds.grandFinals.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-4">
                {t("grandFinals") || "Grand Finals"}
              </h4>
              <div className="flex justify-center">
                <div className="flex flex-col gap-3">
                  {bracket.rounds.grandFinals.map((match) => (
                    <BracketMatchCard
                      key={match.id}
                      match={match}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
      </div>
    </div>
  );
}

function BracketRounds({ rounds }) {
  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex gap-8 min-w-fit">
        {rounds.map((round) => (
          <div key={`${round.name}-${round.round}`} className="flex flex-col">
            {/* Round Header */}
            <div className="text-center mb-3">
              <span className="text-xs font-medium text-muted-foreground px-3 py-1 rounded-full bg-muted/50">
                {round.name}
              </span>
            </div>
            {/* Matches */}
            <div className="flex flex-col justify-around flex-1 gap-4">
              {round.matches.map((match) => (
                <BracketMatchCard key={match.id} match={match} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BracketView;
