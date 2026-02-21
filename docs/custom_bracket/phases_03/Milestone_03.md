# Phase 03 — Custom Bracket Visualization & Editing

## Milestone 03: CustomMatchRow Component

### Milestone Objective

Build the `CustomMatchRow.jsx` component that represents a single match within a round. It shows team/player slots, scores (if result set), match status, and provides inline controls for match management (delete, reorder within round).

### Status: Pending

---

### Tasks

| Task ID | Description | Expected Output | Status |
|---------|-------------|-----------------|--------|
| 3.3.1 | Create `CustomMatchRow.jsx` with the match card layout. Structure: (a) Match number/label. (b) Team 1 slot — shows team logo + name, or "TBD" placeholder if empty. (c) Score display (if result exists) — "2 - 1" format. (d) Team 2 slot — same as team 1. (e) Action buttons on the right. Props: `match`, `tournament`, `onRefresh`, `roundMatches` (for reorder context), `participationType`. | Match card renders with team slots, score, and action area. | Pending |
| 3.3.2 | Implement clickable team slots. When a team slot is clicked, open the `TeamAssignmentDialog` (Phase 04) to assign or change the team. Empty slots show "Click to assign" with a dashed border and `UserPlus` icon. Filled slots show the team logo and name with a subtle edit indicator on hover. | Team slots are interactive and open the assignment dialog. | Pending |
| 3.3.3 | Implement clickable score area. When the score area is clicked (between the two teams), open the `MatchResultDialog` (Phase 04) to set or edit results. If no result, show "Set Result" text. If result exists, show scores with the winner highlighted (bold/green). | Score area is interactive and opens the result dialog. | Pending |
| 3.3.4 | Implement match deletion. Add a delete button (trash icon) in the action area. Shows confirmation dialog before calling `deleteCustomMatchAction`. Disabled if match has a result set (must clear result first). | Matches can be deleted individually with confirmation. | Pending |
| 3.3.5 | Implement match reordering within a round. Add up/down arrow buttons (↑/↓) in the action area. Clicking reorders the match within its round by calling `reorderCustomBracketAction` with updated match positions. Disable up on first match, down on last match. Show loading state. | Matches can be reordered within their round using arrow buttons. | Pending |

---

### Implementation Notes

- Match card styling should follow `BracketMatchCard.jsx` patterns: glass card background, team rows with logo + name, score between teams.
- For `participationType === 'player'`, show player name/avatar instead of team logo/name. Use `player1`/`player2` fields instead of `team1`/`team2`.
- Match status indicator: `scheduled` (gray dot), `live` (green pulsing dot), `completed` (purple dot) — same as `STATUS_COLORS` in `BracketMatchCard.jsx`.
- The "TBD" placeholder for empty slots should use italic muted text: `text-gray-500 italic`.
- When match has a result, the winning team should be visually emphasized (bolder text, green accent on score).
- The delete button should be small and subtle — only visible on hover of the match card row.
