# Phase 03 — Custom Bracket Visualization & Editing

## Milestone 01: CustomBracketEditor Main Component

### Milestone Objective

Build the main `CustomBracketEditor.jsx` component that displays the full custom bracket structure — rounds as columns, matches within each round, and a toolbar with management actions (add round, reorder, complete bracket). This is the primary editing interface.

### Status: Pending

---

### Tasks

| Task ID | Description | Expected Output | Status |
|---------|-------------|-----------------|--------|
| 3.1.1 | Replace the placeholder in `CustomBracketEditor.jsx` with the full layout. Structure: (a) Header bar with bracket status badge + action buttons (Add Round, Complete Bracket). (b) Horizontal scrollable container showing rounds as vertical columns (same horizontal scroll pattern as existing bracket views). (c) Each column = one round, rendered by `CustomRoundCard`. | Main editor layout with header + horizontally scrollable round columns. | Pending |
| 3.1.2 | Implement the "Add Round" button in the header. Opens an inline form or small dialog with: Round Name (text input, optional — auto-generated if empty), Best Of (select: 1/3/5/7), Position (optional — defaults to end). Calls `addCustomRoundAction`. On success, refreshes bracket data. Shows loading spinner during API call. | Admin can add new rounds to the bracket with a clean form. | Pending |
| 3.1.3 | Implement the "Complete Bracket" button. Only visible when bracket status is `in_progress`. Shows a confirmation dialog (using shadcn AlertDialog pattern) before calling `completeCustomBracketAction`. Disabled when bracket status is `generated` or already `completed`. On success, refreshes data and shows success toast. | Admin can manually mark the bracket as completed with confirmation. | Pending |
| 3.1.4 | Parse and organize bracket data for display. Map `bracketData.matches` grouped by `bracketRound` number. Cross-reference with `bracketData.customRounds` for round metadata (name, bestOf). Sort rounds by their `round` number. Pass organized data to `CustomRoundCard` components. | Bracket data is correctly parsed and mapped to the column layout. | Pending |
| 3.1.5 | Implement round reordering with arrow buttons. Each round column header should have left/right arrow buttons (←/→) to move the round's position. Clicking calls `reorderCustomBracketAction` with the new position. Disable left arrow on first round, right arrow on last round. Show loading state during reorder. | Rounds can be reordered using arrow buttons. | Pending |
| 3.1.6 | Add empty state for newly generated bracket with no matches. Show a helpful message inside each round column: "No matches yet. Click + to add a match." Style consistently with other empty states in the dashboard. | Empty rounds show a clear call-to-action for adding matches. | Pending |

---

### Implementation Notes

- The horizontal scroll container pattern is already used in `BracketView.jsx` for standard brackets — reuse the same CSS classes (`overflow-x-auto`, flex container with min-width per column).
- The glass card styling used throughout the dashboard: `bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl`.
- Action buttons should use the existing button patterns: primary actions use `bg-green-primary`, destructive use `bg-red-500`, secondary use `bg-white/10`.
- The `customRounds` array from the API contains: `{ round: number, name: string, bestOf: number }`.
- Matches have `bracketRound` field that links them to their round number.
