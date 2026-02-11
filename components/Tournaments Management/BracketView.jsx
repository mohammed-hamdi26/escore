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
  Plus,
  Play,
} from "lucide-react";
import {
  getBracketAction,
  generateBracketAction,
  deleteBracketAction,
  advanceSwissRoundAction,
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

  // New feature states
  const [grandFinalsReset, setGrandFinalsReset] = useState(true);
  const [showAdvancedBestOf, setShowAdvancedBestOf] = useState(false);
  const [bestOfPerRound, setBestOfPerRound] = useState([]);
  const [groups, setGroups] = useState([{ name: "Group A", teamIds: [] }]);
  const [activeGroupTab, setActiveGroupTab] = useState(0);
  const [swissConfig, setSwissConfig] = useState({
    totalRounds: 5,
    winsToQualify: 3,
    lossesToEliminate: 3,
  });
  const [advancingRound, setAdvancingRound] = useState(false);

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

  // --- Helpers ---

  const getAvailableRounds = () => {
    if (!bracketType || seeds.length < 2) return [];
    const teamCount = seeds.length;
    const rounds = [];

    if (bracketType === "single_elimination") {
      const numRounds = Math.ceil(Math.log2(teamCount));
      for (let i = 1; i <= numRounds; i++) {
        rounds.push({ stage: "winners", round: i, label: `Winners R${i}` });
      }
    } else if (bracketType === "double_elimination") {
      const numWinnersRounds = Math.ceil(Math.log2(teamCount));
      const numLosersRounds = Math.max(1, (numWinnersRounds - 1) * 2);
      for (let i = 1; i <= numWinnersRounds; i++) {
        rounds.push({ stage: "winners", round: i, label: `Winners R${i}` });
      }
      for (let i = 1; i <= numLosersRounds; i++) {
        rounds.push({ stage: "losers", round: i, label: `Losers R${i}` });
      }
      rounds.push({ stage: "grand_finals", round: 1, label: "Grand Finals" });
    } else if (bracketType === "round_robin") {
      const maxGroupSize = Math.max(...groups.map((g) => g.teamIds.length), 2);
      const numRounds = maxGroupSize - 1;
      for (let i = 1; i <= numRounds; i++) {
        rounds.push({ stage: "group_stage", round: i, label: `Group R${i}` });
      }
    } else if (bracketType === "swiss") {
      for (let i = 1; i <= swissConfig.totalRounds; i++) {
        rounds.push({ stage: "swiss", round: i, label: `Swiss R${i}` });
      }
    }
    return rounds;
  };

  const handleBestOfChange = (stage, round, value) => {
    const exists = bestOfPerRound.find(
      (b) => b.stage === stage && b.round === round
    );
    if (exists) {
      setBestOfPerRound(
        bestOfPerRound.map((b) =>
          b.stage === stage && b.round === round ? { ...b, bestOf: value } : b
        )
      );
    } else {
      setBestOfPerRound([...bestOfPerRound, { stage, round, bestOf: value }]);
    }
  };

  const removeBestOfOverride = (stage, round) => {
    setBestOfPerRound(
      bestOfPerRound.filter((b) => !(b.stage === stage && b.round === round))
    );
  };

  const addGroup = () => {
    const letter = String.fromCharCode(65 + groups.length);
    setGroups([...groups, { name: `Group ${letter}`, teamIds: [] }]);
  };

  const removeGroup = (index) => {
    if (groups.length === 1) return;
    setGroups(groups.filter((_, i) => i !== index));
  };

  const updateGroupName = (index, name) => {
    setGroups(groups.map((g, i) => (i === index ? { ...g, name } : g)));
  };

  const toggleTeamInGroup = (groupIndex, teamId) => {
    const newGroups = groups.map((g) => ({
      ...g,
      teamIds: g.teamIds.filter((id) => id !== teamId),
    }));
    if (!groups[groupIndex].teamIds.includes(teamId)) {
      newGroups[groupIndex].teamIds.push(teamId);
    }
    setGroups(newGroups);
  };

  const getTeamGroup = (teamId) => {
    return groups.findIndex((g) => g.teamIds.includes(teamId));
  };

  // --- Handlers ---

  const handleGenerate = async () => {
    setGenerating(true);
    setError(null);
    try {
      const payload = {
        bracketType,
        defaultBestOf: bestOf,
        autoAdvance,
      };

      if (bracketType === "round_robin") {
        const allTeamIds = groups.flatMap((g) => g.teamIds);
        payload.seeds = allTeamIds;
        payload.groups = groups.map((g) => ({
          name: g.name,
          teamIds: g.teamIds,
        }));
      } else {
        payload.seeds = seeds.map((s) => s.id);
      }

      if (bracketType === "double_elimination") {
        payload.grandFinalsReset = grandFinalsReset;
      }

      if (bestOfPerRound.length > 0) {
        payload.bestOfPerRound = bestOfPerRound;
      }

      if (bracketType === "swiss") {
        payload.swissConfig = swissConfig;
      }

      const result = await generateBracketAction(tournamentId, payload);
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

  const handleAdvanceSwissRound = async () => {
    setAdvancingRound(true);
    setError(null);
    try {
      const result = await advanceSwissRoundAction(tournamentId);
      if (result.success) {
        await fetchBracket();
      } else {
        setError(result.error);
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setAdvancingRound(false);
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

  // --- Render ---

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

        {!tournament.teams || tournament.teams.length < 2 ? (
          <div className="text-center py-8">
            <Trophy className="size-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">
              {t("needTeams") ||
                "At least 2 teams are required to generate a bracket."}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Bracket Type — 2x2 grid */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                {t("bracketType") || "Bracket Type"}
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    value: "single_elimination",
                    label: t("singleElimination") || "Single Elimination",
                    desc: t("singleEliminationDesc") || "Lose once and you're out",
                  },
                  {
                    value: "double_elimination",
                    label: t("doubleElimination") || "Double Elimination",
                    desc: t("doubleEliminationDesc") || "Lose twice to be eliminated",
                  },
                  {
                    value: "round_robin",
                    label: t("roundRobin") || "Round Robin",
                    desc: t("roundRobinDesc") || "Everyone plays everyone",
                  },
                  {
                    value: "swiss",
                    label: t("swissSystem") || "Swiss System",
                    desc: t("swissSystemDesc") || "Pairing based on performance",
                  },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setBracketType(opt.value)}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      bracketType === opt.value
                        ? "border-green-primary bg-green-primary/10 text-green-primary"
                        : "border-gray-300 dark:border-gray-600 text-muted-foreground hover:border-green-primary/50"
                    }`}
                  >
                    <div className="font-medium text-sm">{opt.label}</div>
                    <div className="text-xs mt-1 opacity-70">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Grand Finals Reset — double elimination only */}
            {bracketType === "double_elimination" && (
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium text-foreground">
                    {t("grandFinalsReset") || "Grand Finals Reset"}
                  </label>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {t("grandFinalsResetDesc") ||
                      "If losers bracket winner wins GF1, a reset match is played"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setGrandFinalsReset(!grandFinalsReset)}
                  className={`relative w-11 h-6 rounded-full transition-colors ${
                    grandFinalsReset ? "bg-green-primary" : "bg-gray-400"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                      grandFinalsReset ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            )}

            {/* Swiss Configuration — swiss only */}
            {bracketType === "swiss" && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                  {t("swissConfiguration") || "Swiss Configuration"}
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">
                      {t("totalRounds") || "Total Rounds"}
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={swissConfig.totalRounds}
                      onChange={(e) =>
                        setSwissConfig({
                          ...swissConfig,
                          totalRounds: parseInt(e.target.value) || 1,
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-background border border-gray-300 dark:border-gray-600 text-foreground text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">
                      {t("winsToQualify") || "Wins to Qualify"}
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={swissConfig.winsToQualify}
                      onChange={(e) =>
                        setSwissConfig({
                          ...swissConfig,
                          winsToQualify: parseInt(e.target.value) || 1,
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-background border border-gray-300 dark:border-gray-600 text-foreground text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">
                      {t("lossesToEliminate") || "Losses to Eliminate"}
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={swissConfig.lossesToEliminate}
                      onChange={(e) =>
                        setSwissConfig({
                          ...swissConfig,
                          lossesToEliminate: parseInt(e.target.value) || 1,
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-background border border-gray-300 dark:border-gray-600 text-foreground text-sm"
                    />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {t("swissConfigDesc") ||
                    "Teams paired by record each round. Configure thresholds for qualification and elimination."}
                </p>
              </div>
            )}

            {/* Round Robin — Group Configuration */}
            {bracketType === "round_robin" && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-foreground">
                    {t("groupConfiguration") || "Group Configuration"}
                  </label>
                  <button
                    type="button"
                    onClick={addGroup}
                    className="flex items-center gap-1 text-xs text-green-primary hover:text-green-primary/80 font-medium"
                  >
                    <Plus className="size-3" />
                    {t("addGroup") || "Add Group"}
                  </button>
                </div>

                <div className="space-y-3">
                  {groups.map((group, groupIndex) => (
                    <div
                      key={groupIndex}
                      className="p-4 rounded-xl bg-muted/30 dark:bg-[#1a1d2e] border border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <input
                          type="text"
                          value={group.name}
                          onChange={(e) =>
                            updateGroupName(groupIndex, e.target.value)
                          }
                          className="flex-1 px-3 py-2 rounded-lg bg-background border border-gray-300 dark:border-gray-600 text-foreground text-sm"
                          placeholder={t("groupName") || "Group name"}
                        />
                        {groups.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeGroup(groupIndex)}
                            className="p-2 text-red-500 hover:bg-red-500/10 rounded transition-colors"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        )}
                      </div>

                      <p className="text-xs text-muted-foreground mb-2">
                        {t("selectTeams") || "Select teams"} (
                        {group.teamIds.length})
                      </p>
                      <div className="max-h-40 overflow-y-auto space-y-1">
                        {seeds.map((team) => {
                          const currentGroup = getTeamGroup(team.id);
                          const isInThisGroup = currentGroup === groupIndex;
                          const isInOtherGroup =
                            currentGroup !== -1 && currentGroup !== groupIndex;

                          return (
                            <button
                              key={team.id}
                              type="button"
                              onClick={() =>
                                toggleTeamInGroup(groupIndex, team.id)
                              }
                              disabled={isInOtherGroup}
                              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                                isInThisGroup
                                  ? "bg-green-primary/10 border border-green-primary text-green-primary"
                                  : isInOtherGroup
                                  ? "bg-muted/20 border border-transparent text-muted-foreground opacity-50 cursor-not-allowed"
                                  : "bg-background border border-gray-300 dark:border-gray-600 hover:border-green-primary/50 text-foreground"
                              }`}
                            >
                              {team.logo?.light ? (
                                <img
                                  src={team.logo.light}
                                  alt={team.name}
                                  className="size-5 rounded"
                                />
                              ) : (
                                <div className="size-5 rounded bg-muted flex items-center justify-center">
                                  <Trophy className="size-3 text-muted-foreground" />
                                </div>
                              )}
                              <span className="flex-1 text-left truncate">
                                {team.name}
                              </span>
                              {isInOtherGroup && (
                                <span className="text-xs opacity-70">
                                  ({groups[currentGroup].name})
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

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

            {/* Advanced Best-of Per Round */}
            <div>
              <button
                type="button"
                onClick={() => setShowAdvancedBestOf(!showAdvancedBestOf)}
                className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-green-primary transition-colors"
              >
                <ChevronDown
                  className={`size-4 transition-transform ${
                    showAdvancedBestOf ? "rotate-180" : ""
                  }`}
                />
                {t("advancedBestOf") || "Advanced Best-of Settings"}
              </button>

              {showAdvancedBestOf && (
                <div className="mt-4 p-4 rounded-xl bg-muted/30 dark:bg-[#1a1d2e] border border-gray-200 dark:border-gray-700 space-y-3">
                  <p className="text-xs text-muted-foreground mb-3">
                    {t("advancedBestOfDesc") ||
                      "Override best-of for specific rounds. Unset rounds use the default."}
                  </p>
                  {getAvailableRounds().map(({ stage, round, label }) => {
                    const override = bestOfPerRound.find(
                      (b) => b.stage === stage && b.round === round
                    );
                    return (
                      <div
                        key={`${stage}-${round}`}
                        className="flex items-center gap-3"
                      >
                        <span className="text-sm text-foreground w-32 flex-shrink-0">
                          {label}
                        </span>
                        <div className="flex gap-2 flex-1">
                          {[1, 3, 5, 7].map((n) => (
                            <button
                              key={n}
                              type="button"
                              onClick={() =>
                                handleBestOfChange(stage, round, n)
                              }
                              className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                                override?.bestOf === n
                                  ? "border-green-primary bg-green-primary/10 text-green-primary"
                                  : "border-gray-300 dark:border-gray-600 text-muted-foreground hover:border-green-primary/50"
                              }`}
                            >
                              Bo{n}
                            </button>
                          ))}
                        </div>
                        {override && (
                          <button
                            type="button"
                            onClick={() =>
                              removeBestOfOverride(stage, round)
                            }
                            className="px-2 py-1 text-xs text-red-500 hover:bg-red-500/10 rounded transition-colors"
                          >
                            Reset
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Auto Advance */}
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-medium text-foreground">
                  {t("autoAdvance") || "Auto-Advance Winners"}
                </label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {t("autoAdvanceDesc") ||
                    "Automatically move winners to the next round"}
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

            {/* Seed Order — hide for round robin (uses group assignment instead) */}
            {bracketType !== "round_robin" && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t("seedOrder") || "Seed Order"}
                </label>
                <p className="text-xs text-muted-foreground mb-3">
                  {t("seedOrderDesc") ||
                    "Drag to reorder. Seed #1 is the top seed."}
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
            )}

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

  // --- Bracket exists — show visualization ---

  const bracketTypeLabel = {
    single_elimination: t("singleElimination") || "Single Elimination",
    double_elimination: t("doubleElimination") || "Double Elimination",
    round_robin: t("roundRobin") || "Round Robin",
    swiss: t("swissSystem") || "Swiss System",
  };

  return (
    <div className="space-y-6">
      {/* Bracket Header */}
      <div className="glass rounded-2xl p-6 border border-transparent dark:border-white/5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Trophy className="size-5 text-green-primary" />
            {t("bracket") || "Bracket"}
            <span className="text-sm font-normal text-muted-foreground ml-2">
              {bracketTypeLabel[bracket.bracketType] || bracket.bracketType}
            </span>
            {bracket.bracketType === "swiss" && bracket.currentSwissRound && (
              <span className="text-xs font-normal text-muted-foreground">
                ({t("round") || "Round"} {bracket.currentSwissRound}/
                {bracket.swissConfig?.totalRounds || "?"})
              </span>
            )}
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
            <div className="mb-6">
              <h4 className="text-sm font-medium text-muted-foreground mb-4">
                {t("grandFinals") || "Grand Finals"}
              </h4>
              <div className="flex justify-center">
                <div className="flex flex-col gap-3">
                  {bracket.rounds.grandFinals.map((match) => (
                    <BracketMatchCard key={match.id} match={match} />
                  ))}
                </div>
              </div>
            </div>
          )}

        {/* Round Robin Groups */}
        {bracket.groups && bracket.groups.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-muted-foreground mb-4">
              {t("roundRobinGroups") || "Groups"}
            </h4>

            {/* Group Tabs */}
            <div className="flex gap-2 mb-4 overflow-x-auto">
              {bracket.groups.map((group, index) => (
                <button
                  key={index}
                  onClick={() => setActiveGroupTab(index)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                    activeGroupTab === index
                      ? "bg-green-primary text-white"
                      : "bg-muted/30 text-muted-foreground hover:bg-muted/50"
                  }`}
                >
                  {group.name}
                </button>
              ))}
            </div>

            {/* Active Group Rounds */}
            {bracket.groups[activeGroupTab] && (
              <BracketRounds
                rounds={bracket.groups[activeGroupTab].rounds}
              />
            )}
          </div>
        )}

        {/* Swiss Rounds */}
        {bracket.swissRounds && bracket.swissRounds.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-medium text-muted-foreground">
                {t("swissRounds") || "Swiss Rounds"}
              </h4>

              {bracket.bracketStatus !== "completed" && (
                <Button
                  onClick={handleAdvanceSwissRound}
                  disabled={advancingRound}
                  size="sm"
                  className="gap-2 bg-green-primary hover:bg-green-primary/90 text-white"
                >
                  {advancingRound ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      {t("advancing") || "Advancing..."}
                    </>
                  ) : (
                    <>
                      <Play className="size-4" />
                      {t("advanceToNextRound") || "Advance to Next Round"}
                    </>
                  )}
                </Button>
              )}
            </div>

            <div className="space-y-6">
              {bracket.swissRounds.map((round, roundIndex) => (
                <div key={roundIndex}>
                  <div className="text-center mb-3">
                    <span
                      className={`text-xs font-medium px-3 py-1 rounded-full ${
                        roundIndex === (bracket.currentSwissRound || 1) - 1
                          ? "bg-green-500/10 text-green-500"
                          : "bg-muted/50 text-muted-foreground"
                      }`}
                    >
                      {round.name || `Round ${roundIndex + 1}`}
                      {roundIndex === (bracket.currentSwissRound || 1) - 1 &&
                        ` (${t("current") || "Current"})`}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 justify-items-center">
                    {round.matches.map((match) => (
                      <BracketMatchCard key={match.id} match={match} />
                    ))}
                  </div>
                </div>
              ))}
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
