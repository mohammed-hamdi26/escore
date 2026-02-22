/**
 * Client-side bracket structure generator for preview purposes.
 * Mirrors backend bracket generation but only produces structure (no DB).
 */

/**
 * Generate standard tournament seed pairing.
 * Seeds 1v8, 4v5, 2v7, 3v6 for 8 teams.
 */
function generateSeedPairing(teamCount) {
  const size = Math.pow(2, Math.ceil(Math.log2(teamCount)));
  const pairs = [];

  function buildPairings(start, end) {
    if (end - start === 1) {
      pairs.push([start, end]);
      return;
    }
    const mid = Math.floor((start + end) / 2);
    // Interleave top and bottom halves
    buildPairings(start, mid);
    buildPairings(mid + 1, end);
  }

  if (size >= 2) {
    buildPairings(1, size);
  }

  return pairs.map(([a, b]) => ({
    seed1: a <= teamCount ? a : null,
    seed2: b <= teamCount ? b : null,
  }));
}

/**
 * Generate a single elimination bracket structure.
 */
export function generateSingleElimPreview(teamCount) {
  const numRounds = Math.ceil(Math.log2(teamCount));
  const rounds = [];

  for (let r = 1; r <= numRounds; r++) {
    const matchCount = r === 1
      ? Math.ceil(teamCount / 2)
      : Math.pow(2, numRounds - r);

    const roundName = r === numRounds
      ? "Finals"
      : r === numRounds - 1
      ? "Semi-Finals"
      : `Round ${r}`;

    const matches = [];
    for (let m = 0; m < matchCount; m++) {
      if (r === 1) {
        const pairing = generateSeedPairing(teamCount)[m];
        matches.push({
          seed1: pairing?.seed1 ? `Seed #${pairing.seed1}` : "BYE",
          seed2: pairing?.seed2 ? `Seed #${pairing.seed2}` : "BYE",
        });
      } else {
        matches.push({ seed1: "TBD", seed2: "TBD" });
      }
    }

    rounds.push({ name: roundName, matches });
  }

  return { type: "single_elimination", rounds, totalMatches: teamCount - 1 };
}

/**
 * Generate a double elimination bracket structure.
 */
export function generateDoubleElimPreview(teamCount, grandFinalsReset = true) {
  const numWinnersRounds = Math.ceil(Math.log2(teamCount));
  const numLosersRounds = Math.max(1, (numWinnersRounds - 1) * 2);

  const winnersRounds = [];
  for (let r = 1; r <= numWinnersRounds; r++) {
    const matchCount = r === 1
      ? Math.ceil(teamCount / 2)
      : Math.pow(2, numWinnersRounds - r);
    winnersRounds.push({
      name: `Winners R${r}`,
      matches: Array.from({ length: matchCount }, () => ({ seed1: r === 1 ? "Seed" : "TBD", seed2: r === 1 ? "Seed" : "TBD" })),
    });
  }

  const losersRounds = [];
  for (let r = 1; r <= numLosersRounds; r++) {
    const matchCount = Math.max(1, Math.pow(2, Math.ceil((numLosersRounds - r) / 2)));
    losersRounds.push({
      name: `Losers R${r}`,
      matches: Array.from({ length: matchCount }, () => ({ seed1: "TBD", seed2: "TBD" })),
    });
  }

  const grandFinals = [{ seed1: "W Winner", seed2: "L Winner" }];
  if (grandFinalsReset) {
    grandFinals.push({ seed1: "Reset", seed2: "Reset" });
  }

  const totalMatches = (teamCount - 1) * 2 + (grandFinalsReset ? 1 : 0);

  return {
    type: "double_elimination",
    winners: winnersRounds,
    losers: losersRounds,
    grandFinals: [{ name: "Grand Finals", matches: grandFinals }],
    totalMatches,
  };
}

/**
 * Generate a round robin bracket structure.
 */
export function generateRoundRobinPreview(groups) {
  const groupPreviews = groups.map((group) => {
    const n = group.teamIds?.length || 0;
    const numRounds = Math.max(1, n - 1);
    const matchesPerRound = Math.floor(n / 2);

    return {
      name: group.name,
      teamCount: n,
      rounds: Array.from({ length: numRounds }, (_, i) => ({
        name: `Round ${i + 1}`,
        matchCount: matchesPerRound,
      })),
      totalMatches: (n * (n - 1)) / 2,
    };
  });

  return {
    type: "round_robin",
    groups: groupPreviews,
    totalMatches: groupPreviews.reduce((sum, g) => sum + g.totalMatches, 0),
  };
}

/**
 * Generate a Swiss bracket structure.
 */
export function generateSwissPreview(teamCount, swissConfig) {
  const { totalRounds = 5 } = swissConfig;
  const matchesPerRound = Math.floor(teamCount / 2);

  const rounds = Array.from({ length: totalRounds }, (_, i) => ({
    name: `Swiss Round ${i + 1}`,
    matchCount: matchesPerRound,
  }));

  return {
    type: "swiss",
    rounds,
    totalMatches: matchesPerRound * totalRounds,
  };
}

/**
 * Generate preview structure for any bracket type.
 */
export function generatePreviewStructure(bracketType, teamCount, config = {}) {
  switch (bracketType) {
    case "single_elimination":
      return generateSingleElimPreview(teamCount);
    case "double_elimination":
      return generateDoubleElimPreview(teamCount, config.grandFinalsReset !== false);
    case "round_robin":
      return generateRoundRobinPreview(config.groups || []);
    case "swiss":
      return generateSwissPreview(teamCount, config.swissConfig || {});
    default:
      return null;
  }
}
