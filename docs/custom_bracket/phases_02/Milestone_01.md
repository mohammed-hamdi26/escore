# Phase 02 — Bracket Generation Form

## Milestone 01: Add Custom Type to Generation Form

### Milestone Objective

Extend the existing bracket generation form in `BracketView.jsx` to include the `custom` bracket type option. When selected, it should show a simplified form (just round count and default bestOf) since custom brackets don't need seeds, groups, or swiss config. Integrate with the existing `generateBracketAction`.

### Status: Pending

---

### Tasks

| Task ID | Description | Expected Output | Status |
|---------|-------------|-----------------|--------|
| 2.1.1 | Add `custom` to the bracket type selection grid in `BracketView.jsx`. Follow the existing button grid pattern (lines ~1015-1062). Use a `Wrench` or `Settings2` icon from lucide-react. Label: "Custom". The button should follow the same styling: `bg-[color]/10 text-[color]` when selected, glass card when not. | New "Custom" button appears in the bracket type selection grid alongside existing types. | Pending |
| 2.1.2 | Create the custom bracket configuration section that renders when `bracketType === 'custom'`. Show: (a) "Number of Rounds" — number input, min 1, max 20, default 1. (b) "Default Best Of" — select with options 1, 3, 5, 7, default 1. (c) Optional "Round Names" — text inputs for naming each round (auto-generated defaults like "Round 1", "Quarter-Finals" etc.). Use existing form styling patterns (glass card background, label styling). | When "Custom" is selected, a clean configuration form appears below the type grid. | Pending |
| 2.1.3 | Hide irrelevant form sections when `custom` is selected. The following should NOT render for custom brackets: seed order section, grand finals reset toggle, round robin groups config, swiss config, battle royale config, multi-stage config. Only show the custom-specific config from Task 2.1.2. | Clean form with no irrelevant options visible for custom bracket type. | Pending |
| 2.1.4 | Update the `handleGenerate` function in `BracketView.jsx` to handle `bracketType === 'custom'`. Build the payload: `{ bracketType: 'custom', customConfig: { rounds: number, defaultBestOf: number, roundNames?: string[] } }`. Call the existing `generateBracketAction` with this payload. | Clicking "Generate Bracket" with custom type sends correct payload to backend. | Pending |
| 2.1.5 | Add loading state and error handling for custom bracket generation. Show spinner on the Generate button during API call. Display error toast/alert on failure using existing error display pattern. On success, refresh bracket data to show the generated custom bracket. | Proper loading + error feedback during custom bracket generation. | Pending |
| 2.1.6 | Add validation before generation: at least 1 round required, bestOf must be odd number (1, 3, 5, 7). Show inline validation errors matching existing form error styling. | Form prevents invalid generation attempts with clear error messages. | Pending |

---

### Implementation Notes

- The existing bracket type buttons use a specific color scheme per type. Suggested color for custom: `orange` or `amber` to distinguish from existing types.
- The `generateBracketAction` already exists in `actions.js` — it POSTs to `/tournaments/${id}/bracket/generate`. The backend already handles `bracketType: 'custom'`.
- Round names are optional — if not provided, the backend auto-generates them (e.g., "Round 1", "Round 2").
- The `handleGenerate` function (lines ~311-393) uses a switch/conditional pattern based on `bracketType` to build the payload. Add the `custom` case.
