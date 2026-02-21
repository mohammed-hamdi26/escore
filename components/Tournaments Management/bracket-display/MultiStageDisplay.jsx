"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Layers } from "lucide-react";
import BracketMatchCard from "../BracketMatchCard";
import BracketRounds from "./BracketRounds";

function MultiStageDisplay({ bracket, activeStageTab }) {
  const t = useTranslations("TournamentDetails");
  const [activeGroupTab, setActiveGroupTab] = useState(0);

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

  return (
    <div>
      {/* RR Groups */}
      {activeStage.groups && activeStage.groups.length > 0 && (
        <div className="mb-6">
          {/* Mobile: dropdown */}
          <div className="sm:hidden mb-4">
            <select
              value={activeGroupTab}
              onChange={(e) => setActiveGroupTab(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg bg-background border border-gray-300 dark:border-gray-600 text-foreground text-sm"
              aria-label={t("selectGroup") || "Select group"}
            >
              {activeStage.groups.map((group, index) => (
                <option key={index} value={index}>{group.name}</option>
              ))}
            </select>
          </div>
          {/* Tablet/Desktop: tabs */}
          <div className="hidden sm:flex gap-2 mb-4 overflow-x-auto" role="tablist">
            {activeStage.groups.map((group, index) => (
              <button
                key={index}
                role="tab"
                aria-selected={activeGroupTab === index}
                onClick={() => setActiveGroupTab(index)}
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
          {activeStage.groups[activeGroupTab] && (
            <BracketRounds
              rounds={activeStage.groups[activeGroupTab].rounds}
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
                    <BracketMatchCard key={match.id} match={match} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SE/DE Rounds */}
      {activeStage.rounds && (
        <>
          {activeStage.rounds.winners &&
            activeStage.rounds.winners.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-medium text-muted-foreground mb-4">
                  {t("winnersBracket") || "Winners Bracket"}
                </h4>
                <BracketRounds rounds={activeStage.rounds.winners} />
              </div>
            )}
          {activeStage.rounds.losers &&
            activeStage.rounds.losers.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-medium text-muted-foreground mb-4">
                  {t("losersBracket") || "Losers Bracket"}
                </h4>
                <BracketRounds rounds={activeStage.rounds.losers} />
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
                      <BracketMatchCard key={match.id} match={match} />
                    ))}
                  </div>
                </div>
              </div>
            )}
        </>
      )}
    </div>
  );
}

export default MultiStageDisplay;
