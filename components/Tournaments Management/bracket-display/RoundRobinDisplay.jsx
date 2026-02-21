"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import BracketRounds from "./BracketRounds";

function RoundRobinDisplay({ bracket }) {
  const t = useTranslations("TournamentDetails");
  const [activeGroupTab, setActiveGroupTab] = useState(0);

  if (!bracket.groups || bracket.groups.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      <h4 className="text-sm font-medium text-muted-foreground mb-4">
        {t("roundRobinGroups") || "Groups"} ({bracket.groups.length})
      </h4>

      {/* Mobile: dropdown select */}
      <div className="sm:hidden mb-4">
        <select
          value={activeGroupTab}
          onChange={(e) => setActiveGroupTab(Number(e.target.value))}
          className="w-full px-3 py-2 rounded-lg bg-background border border-gray-300 dark:border-gray-600 text-foreground text-sm"
          aria-label={t("selectGroup") || "Select group"}
        >
          {bracket.groups.map((group, index) => (
            <option key={index} value={index}>
              {group.name}
            </option>
          ))}
        </select>
      </div>

      {/* Tablet/Desktop: horizontal tabs */}
      <div className="hidden sm:flex gap-2 mb-4 overflow-x-auto" role="tablist">
        {bracket.groups.map((group, index) => (
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
      {bracket.groups[activeGroupTab] && (
        <BracketRounds rounds={bracket.groups[activeGroupTab].rounds} />
      )}
    </div>
  );
}

export default RoundRobinDisplay;
