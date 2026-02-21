# Phase 05 — Translations, Polish & Testing

## Milestone 01: Translations (en + ar)

### Milestone Objective

Add all English and Arabic translation strings for the custom bracket feature to `messages/en.json` and `messages/ar.json`. Cover all UI labels, button text, dialog titles, status messages, error messages, and empty states.

### Status: Pending

---

### Tasks

| Task ID | Description | Expected Output | Status |
|---------|-------------|-----------------|--------|
| 5.1.1 | Add English translations to `messages/en.json` under a `customBracket` key namespace. Include all labels: bracket type name ("Custom"), generation form labels, round management labels, match management labels, dialog titles, button text, status badges, confirmation messages, error messages, and empty states. | Complete English translation keys for all custom bracket UI text. | Pending |
| 5.1.2 | Add Arabic translations to `messages/ar.json` under the same `customBracket` key namespace. Translate all keys from Task 5.1.1 into Arabic. Ensure RTL-friendly text (no hardcoded LTR punctuation). | Complete Arabic translation keys matching all English keys. | Pending |
| 5.1.3 | Replace all hardcoded English strings in custom bracket components with `t('customBracket.keyName')` calls using next-intl's `useTranslations` hook. Cover: `CustomBracketEditor.jsx`, `CustomRoundCard.jsx`, `CustomMatchRow.jsx`, `TeamAssignmentDialog.jsx`, `MatchResultDialog.jsx`. | All user-facing text uses translation keys, no hardcoded strings. | Pending |
| 5.1.4 | Replace hardcoded strings in `BracketView.jsx` custom bracket sections (generation form, type label). Use existing translation patterns from the file. | Generation form text for custom type uses translation keys. | Pending |

---

### Translation Key Structure (Reference)

```json
{
  "customBracket": {
    "typeName": "Custom",
    "generateTitle": "Custom Bracket Configuration",
    "numberOfRounds": "Number of Rounds",
    "defaultBestOf": "Default Best Of",
    "roundName": "Round Name",
    "addRound": "Add Round",
    "editRound": "Edit Round",
    "deleteRound": "Delete Round",
    "deleteRoundConfirm": "Delete this round and all its matches?",
    "addMatch": "Add Match",
    "deleteMatch": "Delete Match",
    "deleteMatchConfirm": "Delete this match?",
    "assignTeam": "Assign Team",
    "assignPlayer": "Assign Player",
    "clearSlot": "Clear Slot",
    "setResult": "Set Result",
    "clearResult": "Clear Result",
    "clearResultConfirm": "Clear this match's result?",
    "completeBracket": "Complete Bracket",
    "completeBracketConfirm": "Mark this bracket as completed?",
    "noMatches": "No matches yet. Click + to add a match.",
    "noTeams": "No teams registered for this tournament",
    "clickToAssign": "Click to assign",
    "currentlyAssigned": "Currently assigned",
    "overrideWinner": "Override Winner",
    "searchTeams": "Search teams...",
    "searchPlayers": "Search players...",
    "matchCount": "{count} matches",
    "tbd": "TBD"
  }
}
```
