# Phase 03 — Custom Bracket Visualization & Editing

## Milestone 02: CustomRoundCard Component

### Milestone Objective

Build the `CustomRoundCard.jsx` component that represents a single round column in the bracket. It displays the round name, bestOf, contains all matches for that round, and provides management controls (edit round, delete round, add match).

### Status: Pending

---

### Tasks

| Task ID | Description | Expected Output | Status |
|---------|-------------|-----------------|--------|
| 3.2.1 | Create `CustomRoundCard.jsx` with the round column layout. Structure: (a) Round header with name + bestOf badge + action dropdown menu. (b) Match list area containing `CustomMatchRow` components. (c) "Add Match" button at the bottom. Props: `round` (round metadata), `matches` (array of matches in this round), `tournament`, `onRefresh`, `isFirst`, `isLast`, `participationType`. | Round card component renders with header, matches list, and add button. | Pending |
| 3.2.2 | Implement the round header action dropdown menu (using shadcn DropdownMenu). Options: "Edit Round" (opens inline edit), "Delete Round" (with confirmation). Style with `MoreVertical` icon trigger. | Three-dot menu with edit and delete options for each round. | Pending |
| 3.2.3 | Implement "Edit Round" inline form. When triggered from dropdown, the round header transforms into editable fields: Round Name (text input with current value), Best Of (select with current value). Save/Cancel buttons. Calls `updateCustomRoundAction` on save. Shows loading state during API call. | Round name and bestOf can be edited inline. | Pending |
| 3.2.4 | Implement "Delete Round" with confirmation dialog. Show warning that all matches in the round will be deleted. Uses shadcn AlertDialog with destructive action styling. Calls `deleteCustomRoundAction`. On success, refreshes bracket data. | Round can be deleted with a confirmation step. | Pending |
| 3.2.5 | Implement "Add Match" button at the bottom of the round card. Clicking calls `addCustomMatchAction` with `{ round: roundNumber }` (adds an empty match — no teams assigned). Shows loading spinner during creation. New match appears in the list after refresh. | New empty matches can be added to any round. | Pending |
| 3.2.6 | Display match count and round info in the header. Show: round name (e.g., "Quarter-Finals"), bestOf badge (e.g., "Bo3"), match count (e.g., "4 matches"). Style the bestOf badge with a pill/chip design. | Round metadata is clearly displayed in the column header. | Pending |

---

### Implementation Notes

- Column width: recommend `min-w-[300px]` or `w-[320px]` for each round column to ensure matches display properly.
- The "Add Match" button should be a dashed-border button at the bottom: `border-2 border-dashed border-white/20 hover:border-white/40`.
- Delete confirmation should mention the round name and number of matches that will be removed.
- The round header should be visually distinct from match cards — use slightly different background or border treatment.
- Match cards within the round should be stacked vertically with consistent spacing (`space-y-3`).
