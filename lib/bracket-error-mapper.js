/**
 * Maps raw server bracket errors to user-friendly messages.
 *
 * @param {Object|string} serverError - Error from server action
 * @param {Function} t - Translation function from next-intl
 * @returns {{ message: string, fieldErrors: Object, suggestions: string[] }}
 */
export function mapBracketError(serverError, t) {
  // Handle string errors
  if (typeof serverError === "string") {
    return {
      message: mapErrorMessage(serverError, t),
      fieldErrors: {},
      suggestions: getSuggestions(serverError, t),
    };
  }

  // Handle structured error response
  const message = serverError?.message || t?.("unknownError") || "An error occurred";
  const fieldErrors = {};
  const suggestions = [];

  // Map field-level errors
  if (serverError?.errors && Array.isArray(serverError.errors)) {
    for (const err of serverError.errors) {
      const fieldPath = (err.field || "")
        .replace(/^body\./, "")
        .replace(/^query\./, "")
        .replace(/^params\./, "");

      const friendlyField = FIELD_NAMES[fieldPath] || fieldPath;
      const friendlyMessage = mapFieldError(err.message, t);

      fieldErrors[fieldPath] = `${friendlyField}: ${friendlyMessage}`;
    }
  }

  // Add contextual suggestions
  const allText = JSON.stringify(serverError).toLowerCase();
  suggestions.push(...getSuggestions(allText, t));

  return {
    message: mapErrorMessage(message, t),
    fieldErrors,
    suggestions: [...new Set(suggestions)], // deduplicate
  };
}

// --- Field name mappings ---
const FIELD_NAMES = {
  "seeds": "Seeds",
  "bracketType": "Bracket Type",
  "defaultBestOf": "Default Best Of",
  "customConfig": "Custom Configuration",
  "customConfig.rounds": "Rounds configuration",
  "groups": "Groups",
  "swissConfig": "Swiss Configuration",
  "swissConfig.totalRounds": "Total Rounds",
  "swissConfig.winsToQualify": "Wins to Qualify",
  "swissConfig.lossesToEliminate": "Losses to Eliminate",
  "battleRoyaleConfig": "Battle Royale Configuration",
  "battleRoyaleConfig.totalRounds": "Total Rounds",
  "battleRoyaleConfig.teamsPerLobby": "Teams per Lobby",
  "stages": "Stages",
  "grandFinalsReset": "Grand Finals Reset",
  "bestOfPerRound": "Best Of Per Round",
};

// --- Error message patterns ---
function mapErrorMessage(message, t) {
  if (!message) return t?.("unknownError") || "An error occurred";

  const lower = message.toLowerCase();

  if (lower.includes("validation failed")) {
    return t?.("validationFailed") || "Please fix the errors below";
  }
  if (lower.includes("already exists") || lower.includes("bracket already")) {
    return t?.("bracketAlreadyExists") || "A bracket already exists for this tournament. Delete it first.";
  }
  if (lower.includes("at least 2")) {
    return t?.("needMoreParticipants") || "At least 2 participants are required";
  }
  if (lower.includes("not found")) {
    return t?.("tournamentNotFound") || "Tournament not found. Try refreshing the page.";
  }

  return message;
}

function mapFieldError(message, t) {
  if (!message) return t?.("invalidField") || "Invalid value";

  const lower = message.toLowerCase();

  if (lower.includes("expected array, received number") || lower.includes("expected array")) {
    return t?.("fieldMustBeList") || "This must be a list, not a single value";
  }
  if (lower.includes("required")) {
    return t?.("fieldRequired") || "This field is required";
  }
  if (lower.includes("must be >= 2")) {
    return t?.("needAtLeast2") || "At least 2 required";
  }
  if (lower.includes("must be >= 1")) {
    return t?.("needAtLeast1") || "Must be at least 1";
  }

  return message;
}

function getSuggestions(text, t) {
  const suggestions = [];
  const lower = typeof text === "string" ? text.toLowerCase() : "";

  if (lower.includes("at least 2 teams") || lower.includes("at least 2 seeds") || lower.includes("seeds")) {
    suggestions.push(
      t?.("suggestionAddTeams") || "Add more teams to the tournament before generating"
    );
  }
  if (lower.includes("groups") || lower.includes("group")) {
    suggestions.push(
      t?.("suggestionConfigureGroups") || "Make sure each group has at least 2 teams assigned"
    );
  }
  if (lower.includes("swiss") || lower.includes("swissconfig")) {
    suggestions.push(
      t?.("suggestionConfigureSwiss") || "Configure total rounds, wins to qualify, and losses to eliminate"
    );
  }
  if (lower.includes("all matches must be completed") || lower.includes("matches completed")) {
    suggestions.push(
      t?.("suggestionCompleteMatches") || "Complete all matches in the current round before advancing"
    );
  }
  if (lower.includes("duplicate")) {
    suggestions.push(
      t?.("suggestionCheckDuplicates") || "Check for duplicate team assignments across groups"
    );
  }

  return suggestions;
}
