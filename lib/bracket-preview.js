/**
 * Estimate match count for a bracket configuration.
 * Used in the generation confirmation dialog to show users what they're about to create.
 */
export function estimateMatchCount(bracketType, teamCount, config = {}) {
  if (teamCount < 2) return 0;

  switch (bracketType) {
    case "single_elimination":
      return teamCount - 1;

    case "double_elimination": {
      // Winners: teamCount - 1, Losers: teamCount - 2, Grand Finals: 1-2
      const base = (teamCount - 1) * 2;
      return config.grandFinalsReset ? base + 1 : base;
    }

    case "round_robin": {
      if (config.groups && config.groups.length > 0) {
        return config.groups.reduce((total, group) => {
          const n = group.teamIds?.length || 0;
          return total + (n * (n - 1)) / 2;
        }, 0);
      }
      return (teamCount * (teamCount - 1)) / 2;
    }

    case "swiss":
      return Math.floor(teamCount / 2) * (config.swissConfig?.totalRounds || 5);

    case "battle_royale":
      return config.battleRoyaleConfig?.totalRounds || 3;

    case "custom":
      return config.customRounds || 1;

    case "multi_stage": {
      if (!config.stages) return 0;
      return config.stages.reduce((total, stage) => {
        const stageTeams = stage.config?.groups
          ? stage.config.groups.reduce((sum, g) => sum + (g.teamIds?.length || 0), 0)
          : teamCount;
        return total + estimateMatchCount(stage.bracketType, stageTeams, stage.config || {});
      }, 0);
    }

    default:
      return 0;
  }
}

/**
 * Get a human-readable summary of bracket configuration.
 */
export function getBracketConfigSummary(bracketType, config = {}) {
  const details = [];

  switch (bracketType) {
    case "single_elimination":
      details.push(`Bo${config.bestOf || 3}`);
      if (config.autoAdvance === false) details.push("Manual advance");
      break;

    case "double_elimination":
      details.push(`Bo${config.bestOf || 3}`);
      details.push(config.grandFinalsReset !== false ? "GF Reset ON" : "GF Reset OFF");
      if (config.autoAdvance === false) details.push("Manual advance");
      break;

    case "round_robin":
      details.push(`Bo${config.bestOf || 1}`);
      details.push(`${config.groups?.length || 1} group(s)`);
      break;

    case "swiss":
      if (config.swissConfig) {
        const { totalRounds, winsToQualify, lossesToEliminate } = config.swissConfig;
        details.push(`${totalRounds} rounds`);
        details.push(`${winsToQualify}W to qualify`);
        details.push(`${lossesToEliminate}L to eliminate`);
      }
      details.push(`Bo${config.bestOf || 3}`);
      break;

    case "battle_royale":
      if (config.battleRoyaleConfig) {
        details.push(`${config.battleRoyaleConfig.totalRounds} rounds`);
        details.push(`${config.battleRoyaleConfig.teamsPerLobby} per lobby`);
      }
      break;

    case "custom":
      details.push(`${config.customRounds || 1} round(s)`);
      details.push(`Bo${config.customBestOf || 1}`);
      break;

    case "multi_stage":
      if (config.stages) {
        details.push(`${config.stages.length} stages`);
      }
      break;
  }

  return details;
}
