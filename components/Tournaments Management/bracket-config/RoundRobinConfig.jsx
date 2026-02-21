"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { Plus, Trash2, Trophy, CheckCircle, AlertTriangle } from "lucide-react";
import { getImgUrl } from "@/lib/utils";
import InlineError from "../shared/InlineError";

function RoundRobinConfig({ config, onConfigChange, seeds }) {
  const t = useTranslations("TournamentDetails");

  const { bestOf = 1, groups = [{ name: "Group A", teamIds: [] }] } = config;

  // --- Validation ---
  const groupErrors = useMemo(() => {
    return groups.map((group) => {
      const errors = [];
      if (!group.name.trim()) errors.push(t("groupNameRequired") || "Group name is required");
      if (group.name.length > 100) errors.push(t("groupNameTooLong") || "Group name must be under 100 characters");
      if (group.teamIds.length < 2) errors.push(t("groupNeedTeams") || "Each group needs at least 2 teams");
      return errors;
    });
  }, [groups, t]);

  const assignedCount = useMemo(() => {
    return groups.reduce((sum, g) => sum + g.teamIds.length, 0);
  }, [groups]);

  const totalSeeds = seeds.length;
  const allAssigned = assignedCount === totalSeeds;

  const addGroup = () => {
    const letter = String.fromCharCode(65 + groups.length);
    onConfigChange({
      groups: [...groups, { name: `Group ${letter}`, teamIds: [] }],
    });
  };

  const removeGroup = (index) => {
    if (groups.length === 1) return;
    onConfigChange({ groups: groups.filter((_, i) => i !== index) });
  };

  const updateGroupName = (index, name) => {
    onConfigChange({
      groups: groups.map((g, i) => (i === index ? { ...g, name } : g)),
    });
  };

  const toggleTeamInGroup = (groupIndex, teamId) => {
    const newGroups = groups.map((g) => ({
      ...g,
      teamIds: g.teamIds.filter((id) => id !== teamId),
    }));
    if (!groups[groupIndex].teamIds.includes(teamId)) {
      newGroups[groupIndex].teamIds.push(teamId);
    }
    onConfigChange({ groups: newGroups });
  };

  const getTeamGroup = (teamId) => {
    return groups.findIndex((g) => g.teamIds.includes(teamId));
  };

  return (
    <div className="space-y-4">
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
              onClick={() => onConfigChange({ bestOf: n })}
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

      {/* Group Configuration */}
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

        {/* Assignment Progress */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex-1 h-1.5 rounded-full bg-muted/50 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                allAssigned ? "bg-green-primary" : "bg-amber-500"
              }`}
              style={{ width: `${totalSeeds > 0 ? (assignedCount / totalSeeds) * 100 : 0}%` }}
            />
          </div>
          <span className={`text-xs font-medium ${allAssigned ? "text-green-primary" : "text-amber-500"}`}>
            {assignedCount}/{totalSeeds} {t("assigned") || "assigned"}
          </span>
          {allAssigned && <CheckCircle className="size-3.5 text-green-primary" />}
        </div>
        {!allAssigned && totalSeeds > 0 && (
          <p className="text-xs text-amber-500 mb-3 flex items-center gap-1">
            <AlertTriangle className="size-3" />
            {t("teamsNotAssigned") || `${totalSeeds - assignedCount} team(s) not assigned to any group`}
          </p>
        )}

        <div className="space-y-3">
          {groups.map((group, groupIndex) => {
            const hasErrors = groupErrors[groupIndex]?.length > 0;
            return (
            <div
              key={groupIndex}
              className={`p-4 rounded-xl bg-muted/30 dark:bg-[#1a1d2e] border transition-colors ${
                hasErrors
                  ? "border-red-500/50"
                  : group.teamIds.length >= 2
                  ? "border-green-primary/30"
                  : "border-gray-200 dark:border-gray-700"
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <input
                  type="text"
                  value={group.name}
                  onChange={(e) => updateGroupName(groupIndex, e.target.value)}
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
                {t("selectTeams") || "Select teams"} ({group.teamIds.length})
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
                      onClick={() => toggleTeamInGroup(groupIndex, team.id)}
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
                          src={getImgUrl(team.logo.light, "thumbnail")}
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
              {/* Per-group errors */}
              {groupErrors[groupIndex]?.map((err, i) => (
                <InlineError key={i} error={err} />
              ))}
            </div>
          );
          })}
        </div>
      </div>
    </div>
  );
}

export default RoundRobinConfig;
