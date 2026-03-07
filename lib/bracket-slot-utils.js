/**
 * Bracket Slot Utilities
 *
 * Transforms the flat slots[] array from the API into the round-based
 * data structures that existing display components (SingleElimDisplay,
 * DoubleElimDisplay, etc.) already consume.
 */

/**
 * Map slot status to match status expected by display components.
 * Slots use: pending, ready, in_progress, completed, cancelled
 * Display expects: scheduled, live, completed
 */
function mapSlotStatus(slotStatus) {
  switch (slotStatus) {
    case "in_progress":
      return "live";
    case "completed":
      return "completed";
    case "cancelled":
      return "completed";
    default:
      return "scheduled";
  }
}

/**
 * Convert a single slot to a match-like object that BracketMatchCard expects.
 */
function slotToMatch(slot) {
  const match = {
    id: slot.matchId || slot.slotId,
    _id: slot.matchId || slot.slotId,
    bracketSlotId: slot.slotId,
    team1: slot.participant1 || null,
    team2: slot.participant2 || null,
    status: mapSlotStatus(slot.status),
    isBye: slot.isBye || false,
    isResetMatch: slot.isResetMatch || false,
    bestOf: slot.bestOf || 1,
    group: slot.group || undefined,
    round: slot.roundLabel || slot.name || undefined,
    roundName: slot.roundLabel || slot.name || undefined,
    bracketRound: slot.round,
    bracketPosition: slot.position,
    bracketStage: slot.stage,
    result: null,
    scheduledDate: slot.scheduledDate || undefined,
    // Preserve slot metadata for MatchResultDialog
    _slotId: slot.slotId,
    _slotStatus: slot.status,
    _hasMatch: !!slot.matchId,
  };

  // Build result object if there's a winner or score
  if (slot.winnerId || slot.score) {
    match.result = {
      winner: slot.winnerId || null,
      team1Score: slot.score?.p1 ?? null,
      team2Score: slot.score?.p2 ?? null,
    };
  }

  return match;
}

/**
 * Group slots by round number and build round objects.
 * Returns: [{ name, round, matches[] }]
 */
function groupSlotsByRound(slots, stageLabel) {
  const roundMap = new Map();

  for (const slot of slots) {
    const roundNum = slot.round;
    if (!roundMap.has(roundNum)) {
      roundMap.set(roundNum, []);
    }
    roundMap.get(roundNum).push(slot);
  }

  const rounds = [];
  const sortedRoundNums = [...roundMap.keys()].sort((a, b) => a - b);

  for (const roundNum of sortedRoundNums) {
    const roundSlots = roundMap.get(roundNum);
    // Sort by position within each round
    roundSlots.sort((a, b) => a.position - b.position);

    // Use roundLabel from first slot, or generate a name
    const firstSlot = roundSlots[0];
    const name =
      firstSlot.roundLabel ||
      firstSlot.name ||
      `${stageLabel ? stageLabel + " " : ""}Round ${roundNum}`;

    rounds.push({
      name,
      round: roundNum,
      matches: roundSlots.map(slotToMatch),
    });
  }

  return rounds;
}

/**
 * Transform slots for Single Elimination display.
 * Returns: { rounds: { winners: Round[] } }
 */
export function transformSESlots(slots) {
  const winnersSlots = slots.filter((s) => s.stage === "winners");
  return {
    winners: groupSlotsByRound(winnersSlots, ""),
  };
}

/**
 * Transform slots for Double Elimination display.
 * Returns: { rounds: { winners: Round[], losers: Round[], grandFinals: Match[] } }
 */
export function transformDESlots(slots) {
  const winnersSlots = slots.filter((s) => s.stage === "winners");
  const losersSlots = slots.filter((s) => s.stage === "losers");
  const gfSlots = slots.filter((s) => s.stage === "grand_finals");

  return {
    winners: groupSlotsByRound(winnersSlots, "Winners"),
    losers: groupSlotsByRound(losersSlots, "Losers"),
    grandFinals: gfSlots
      .sort((a, b) => (a.isResetMatch ? 1 : 0) - (b.isResetMatch ? 1 : 0))
      .map(slotToMatch),
  };
}

/**
 * Transform slots for Round Robin display.
 * Returns: { groups: [{ name, rounds: Round[] }] }
 */
export function transformRRSlots(slots) {
  const groupMap = new Map();

  for (const slot of slots) {
    const groupName = slot.group || "Group";
    if (!groupMap.has(groupName)) {
      groupMap.set(groupName, []);
    }
    groupMap.get(groupName).push(slot);
  }

  const groups = [];
  for (const [name, groupSlots] of groupMap) {
    groups.push({
      name,
      rounds: groupSlotsByRound(groupSlots, name),
    });
  }

  return { groups };
}

/**
 * Transform slots for Swiss display.
 * Returns: { swissRounds: Round[], currentSwissRound: number }
 */
export function transformSwissSlots(slots) {
  const rounds = groupSlotsByRound(slots, "Swiss");

  // Current round = highest round that has any non-completed slot
  let currentRound = 1;
  for (const round of rounds) {
    const hasActive = round.matches.some(
      (m) => m.status !== "completed"
    );
    if (hasActive) {
      currentRound = round.round;
      break;
    }
    currentRound = round.round + 1;
  }

  return {
    swissRounds: rounds,
    currentSwissRound: currentRound,
  };
}

/**
 * Transform slots for Battle Royale display.
 * Returns: { brRounds: Round[], currentBRRound: number }
 */
export function transformBRSlots(slots) {
  const rounds = groupSlotsByRound(slots, "BR");

  let currentRound = 1;
  for (const round of rounds) {
    const hasActive = round.matches.some(
      (m) => m.status !== "completed"
    );
    if (hasActive) {
      currentRound = round.round;
      break;
    }
    currentRound = round.round + 1;
  }

  return {
    brRounds: rounds,
    currentBRRound: currentRound,
  };
}

/**
 * Main transformer: converts bracket.slots into the format each display expects.
 * Merges the transformed data into the existing bracket object.
 *
 * @param {object} bracket - The bracket response from API
 * @returns {object} bracket with slot-derived round data merged in
 */
export function transformBracketSlots(bracket) {
  if (!bracket?.usesSlots || !bracket?.slots?.length) {
    return bracket;
  }

  const slots = bracket.slots;
  const result = { ...bracket };

  switch (bracket.bracketType) {
    case "single_elimination": {
      result.rounds = {
        ...result.rounds,
        ...transformSESlots(slots),
      };
      break;
    }
    case "double_elimination": {
      result.rounds = {
        ...result.rounds,
        ...transformDESlots(slots),
      };
      break;
    }
    case "round_robin": {
      const rr = transformRRSlots(slots);
      result.groups = rr.groups;
      break;
    }
    case "swiss": {
      const sw = transformSwissSlots(slots);
      result.swissRounds = sw.swissRounds;
      result.currentSwissRound = sw.currentSwissRound;
      break;
    }
    case "battle_royale": {
      const br = transformBRSlots(slots);
      result.brRounds = br.brRounds;
      result.currentBRRound = br.currentBRRound;
      break;
    }
    default:
      break;
  }

  return result;
}
