# Phase 01: High-Impact Quick Wins

## Milestone 02: Bracket Generation Confirmation Dialog

### Objective
Add a confirmation step with bracket config summary and estimated match count before the irreversible bracket generation.

### Status: Pending

---

### Task 01.02.01: Create BracketPreviewSummary component

- **Description:** Create `shared/BracketPreviewSummary.jsx` — read-only summary card showing bracket type, team count, best-of, type-specific config.
- **Expected Output:** Reusable summary component for bracket configuration.
- **Status:** Pending

---

### Task 01.02.02: Wrap handleGenerate in ConfirmationDialog

- **Description:** In BracketGenerationForm.jsx, show ConfirmationDialog (already exists) with BracketPreviewSummary as body before calling onGenerate.
- **Expected Output:** Users must confirm before bracket generation.
- **Status:** Pending

---

### Task 01.02.03: Create estimateMatchCount utility

- **Description:** Create `lib/bracket-preview.js` with `estimateMatchCount(type, teamCount, config)`. SE: teamCount-1, DE: (teamCount-1)*2+1-2, RR: n*(n-1)/2 per group, Swiss: floor(teamCount/2)*totalRounds.
- **Expected Output:** Accurate match count estimates for all bracket types.
- **Status:** Pending

---

### Task 01.02.04: Add i18n keys

- **Description:** Add `reviewBeforeGenerate`, `estimatedMatches`, `thisCannotBeUndone`, `bracketSummary` to en.json and ar.json.
- **Expected Output:** All confirmation dialog text is translatable.
- **Status:** Pending
