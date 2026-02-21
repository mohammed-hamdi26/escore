# Phase 02 — Bracket Generation Form

## Milestone 02: Custom Bracket State Detection & Routing

### Milestone Objective

Update `BracketView.jsx` to detect when a tournament has a custom bracket (after generation) and route to the custom bracket editor instead of the standard bracket visualization. This is the bridge between generation and editing.

### Status: Pending

---

### Tasks

| Task ID | Description | Expected Output | Status |
|---------|-------------|-----------------|--------|
| 2.2.1 | Detect custom bracket in the bracket data response. When `bracketData` is loaded and `tournament.bracketType === 'custom'`, set a flag/state to render the custom editor instead of the standard bracket tree visualization. | Component correctly identifies custom bracket and switches rendering mode. | Pending |
| 2.2.2 | Add conditional rendering in `BracketView.jsx`: if bracket is custom type AND bracket status is `generated`/`in_progress`/`completed`, render `<CustomBracketEditor>` component (to be built in Phase 03) instead of the standard bracket visualization (the `<Round>` columns). | Custom bracket editor placeholder renders when custom bracket is detected. | Pending |
| 2.2.3 | Create a placeholder `CustomBracketEditor.jsx` component in `components/Tournaments Management/`. It should accept `tournament`, `bracketData`, and `onRefresh` props. For now, render a simple message: "Custom Bracket Editor — Coming Soon" with the bracket status badge. | Placeholder component exists and renders correctly when routed from BracketView. | Pending |
| 2.2.4 | Pass correct props from `BracketView.jsx` to `CustomBracketEditor`. Props needed: `tournament` (full tournament object), `bracketData` (the bracket response including rounds, matches, customRounds), `onRefresh` (function to re-fetch bracket data), `participationType` (team or player). | All necessary data flows from BracketView to CustomBracketEditor. | Pending |
| 2.2.5 | Add a "Delete Bracket" button for custom brackets in the bracket header area (same position and style as existing bracket types). Wire it to the existing `deleteBracketAction`. On success, return to the generation form. | Admin can delete a custom bracket and regenerate from scratch. | Pending |
| 2.2.6 | Add bracket status badge display for custom brackets. Show status as colored badge: `generated` (blue), `in_progress` (yellow), `completed` (green). Follow existing badge styling patterns. | Bracket status is clearly visible in the custom bracket editor header. | Pending |

---

### Implementation Notes

- `BracketView.jsx` already has conditional rendering for different bracket types (single_elimination uses columns, round_robin shows groups, etc.). Add the custom type as another branch.
- The `bracketData` for custom brackets includes `customRounds` array alongside the standard `matches` array. Both are needed by the editor.
- The `deleteBracketAction` already exists and works with custom brackets (backend clears `customRounds` + soft-deletes matches).
- `onRefresh` should call the same `fetchBracket` function used by other bracket types.
