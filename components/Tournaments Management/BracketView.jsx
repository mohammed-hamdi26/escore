"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Trophy } from "lucide-react";
import { showSuccess, showError } from "@/lib/bracket-toast";
import {
  getBracketAction,
  generateBracketAction,
  deleteBracketAction,
  advanceSwissRoundAction,
  advanceBRRoundAction,
  calculateStageAdvancementAction,
  confirmStageAdvancementAction,
  updateStageVisibilityAction,
} from "@/app/[locale]/_Lib/actions";
import CustomBracketEditor from "./CustomBracketEditor";
import BracketGenerationForm from "./BracketGenerationForm";
import BracketHeader from "./bracket-display/BracketHeader";
import SingleElimDisplay from "./bracket-display/SingleElimDisplay";
import DoubleElimDisplay from "./bracket-display/DoubleElimDisplay";
import RoundRobinDisplay from "./bracket-display/RoundRobinDisplay";
import SwissDisplay from "./bracket-display/SwissDisplay";
import BattleRoyaleDisplay from "./bracket-display/BattleRoyaleDisplay";
import MultiStageDisplay from "./bracket-display/MultiStageDisplay";
import BracketSkeleton from "./BracketSkeleton";
import BracketProgressBar from "./bracket-display/BracketProgressBar";
import BracketQuickStats from "./bracket-display/BracketQuickStats";

function BracketView({ tournament }) {
  const t = useTranslations("TournamentDetails");
  const [bracket, setBracket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);

  // Multi-stage advancement state
  const [advancingRound, setAdvancingRound] = useState(false);
  const [advancingBRRound, setAdvancingBRRound] = useState(false);
  const [advancementProposal, setAdvancementProposal] = useState(null);
  const [showAdvancementModal, setShowAdvancementModal] = useState(false);
  const [confirmingAdvancement, setConfirmingAdvancement] = useState(false);
  const [advancementSeeds, setAdvancementSeeds] = useState([]);
  const [activeStageTab, setActiveStageTab] = useState(0);

  const [announcement, setAnnouncement] = useState("");
  const announcementTimer = useRef(null);

  const announce = useCallback((text) => {
    setAnnouncement("");
    if (announcementTimer.current) clearTimeout(announcementTimer.current);
    requestAnimationFrame(() => {
      setAnnouncement(text);
      announcementTimer.current = setTimeout(() => setAnnouncement(""), 5000);
    });
  }, []);

  const tournamentId = tournament.id || tournament._id;

  // --- Data Fetching ---

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

  // --- Handlers ---

  const handleGenerate = async (payload) => {
    setGenerating(true);
    setError(null);
    try {
      const result = await generateBracketAction(tournamentId, payload);
      if (result.success) {
        showSuccess(t("bracketGeneratedSuccess") || "Bracket generated successfully");
        announce(t("bracketGeneratedSuccess") || "Bracket generated successfully");
        await fetchBracket();
      } else {
        setError(result.error);
        announce(`${t("error") || "Error"}: ${result.error}`);
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
        showSuccess(t("bracketDeletedSuccess") || "Bracket deleted");
        announce(t("bracketDeletedSuccess") || "Bracket deleted");
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
        showSuccess(t("advanceToNextRound") || "Advanced to next round");
        announce(t("advanceToNextRound") || "Advanced to next round");
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

  const handleAdvanceBRRound = async () => {
    setAdvancingBRRound(true);
    setError(null);
    try {
      const result = await advanceBRRoundAction(tournamentId);
      if (result.success) {
        showSuccess(t("advanceToNextRound") || "Advanced to next round");
        announce(t("advanceToNextRound") || "Advanced to next round");
        await fetchBracket();
      } else {
        setError(result.error);
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setAdvancingBRRound(false);
    }
  };

  const handleCalculateAdvancement = async () => {
    setError(null);
    setConfirmingAdvancement(false);
    try {
      const result = await calculateStageAdvancementAction(tournamentId);
      if (result.success) {
        setAdvancementProposal(result.data);
        setAdvancementSeeds(
          result.data.qualifyingTeams.map((team) => ({
            id: team.id,
            name: team.name,
            slug: team.slug,
            logo: team.logo,
            reason: team.reason,
          }))
        );
        setShowAdvancementModal(true);
      } else {
        setError(result.error);
      }
    } catch (e) {
      setError(e.message);
    }
  };

  const handleConfirmAdvancement = async () => {
    setConfirmingAdvancement(true);
    setError(null);
    try {
      const result = await confirmStageAdvancementAction(tournamentId, {
        seeds: advancementSeeds.map((s) => s.id),
      });
      if (result.success) {
        setShowAdvancementModal(false);
        setAdvancementProposal(null);
        showSuccess(t("stageAdvanced") || "Stage generated successfully");
        announce(t("stageAdvanced") || "Stage generated successfully");
        await fetchBracket();
      } else {
        setError(result.error);
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setConfirmingAdvancement(false);
    }
  };

  const handleToggleStageVisibility = async (stageOrder, currentVisibility) => {
    setError(null);
    try {
      const result = await updateStageVisibilityAction(
        tournamentId,
        stageOrder,
        !currentVisibility
      );
      if (result.success) {
        showSuccess(t("stageVisibilityUpdated") || "Stage visibility updated");
        announce(t("stageVisibilityUpdated") || "Stage visibility updated");
        await fetchBracket();
      } else {
        setError(result.error);
      }
    } catch (e) {
      setError(e.message);
    }
  };

  // --- Render: Loading ---

  if (loading) {
    return <BracketSkeleton />;
  }

  // --- Render: No bracket — show generation form ---

  if (!bracket) {
    return (
      <div className="glass rounded-2xl p-6 border border-transparent dark:border-white/5">
        <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
          <Trophy className="size-5 text-green-primary" />
          {t("generateBracket") || "Generate Bracket"}
        </h3>
        <BracketGenerationForm
          tournament={tournament}
          onGenerate={handleGenerate}
          generating={generating}
          error={error}
        />
      </div>
    );
  }

  // --- Render: Bracket exists — show display ---

  const renderBracketContent = () => {
    // Custom bracket — delegate to CustomBracketEditor
    if (bracket.bracketType === "custom") {
      return (
        <CustomBracketEditor
          tournament={tournament}
          bracketData={bracket}
          onRefresh={fetchBracket}
          participationType={tournament.participationType || "team"}
        />
      );
    }

    // Multi-stage — delegate to MultiStageDisplay
    if (bracket.isMultiStage && bracket.stages) {
      return (
        <MultiStageDisplay
          bracket={bracket}
          activeStageTab={activeStageTab}
        />
      );
    }

    // Single bracket type display
    switch (bracket.bracketType) {
      case "single_elimination":
        return <SingleElimDisplay bracket={bracket} />;

      case "double_elimination":
        return <DoubleElimDisplay bracket={bracket} />;

      case "round_robin":
        return <RoundRobinDisplay bracket={bracket} />;

      case "swiss":
        return (
          <SwissDisplay
            bracket={bracket}
            onAdvanceRound={handleAdvanceSwissRound}
            advancingRound={advancingRound}
          />
        );

      case "battle_royale":
        return (
          <BattleRoyaleDisplay
            bracket={bracket}
            onAdvanceRound={handleAdvanceBRRound}
            advancingRound={advancingBRRound}
          />
        );

      default:
        // Fallback: try to render whatever rounds exist
        if (bracket.rounds?.winners) {
          return <SingleElimDisplay bracket={bracket} />;
        }
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Screen reader announcements */}
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {announcement}
      </div>

      <div className="glass rounded-2xl p-6 border border-transparent dark:border-white/5">
        <BracketHeader
          bracket={bracket}
          error={error}
          onRefresh={fetchBracket}
          onDelete={handleDelete}
          deleting={deleting}
          onCalculateAdvancement={handleCalculateAdvancement}
          onConfirmAdvancement={handleConfirmAdvancement}
          confirmingAdvancement={confirmingAdvancement}
          advancementProposal={advancementProposal}
          advancementSeeds={advancementSeeds}
          onAdvancementSeedsChange={setAdvancementSeeds}
          showAdvancementModal={showAdvancementModal}
          onShowAdvancementModalChange={setShowAdvancementModal}
          onToggleStageVisibility={handleToggleStageVisibility}
          activeStageTab={activeStageTab}
          onActiveStageTabChange={setActiveStageTab}
        />
        <BracketQuickStats bracket={bracket} />
        <BracketProgressBar bracket={bracket} />
        {renderBracketContent()}
      </div>
    </div>
  );
}

export default BracketView;
