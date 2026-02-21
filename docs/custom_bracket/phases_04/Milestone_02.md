# Phase 04 — Team Assignment & Result Entry

## Milestone 02: MatchResultDialog Component

### Milestone Objective

Build the `MatchResultDialog.jsx` modal component that allows admins to set or clear match results. It shows score inputs for both teams/players, optional winner selection (for cases where winner isn't determined by score alone), and a clear results option.

### Status: Pending

---

### Tasks

| Task ID | Description | Expected Output | Status |
|---------|-------------|-----------------|--------|
| 4.2.1 | Create `MatchResultDialog.jsx` using shadcn Dialog component. Props: `open`, `onOpenChange`, `tournament`, `match`, `onResultSet` (callback after result is set). Header should show match info: "Set Result — [Team1] vs [Team2]". If teams not assigned, show "Set Result — TBD vs TBD". | Dialog opens with match info in the header. | Pending |
| 4.2.2 | Build the score entry form. Two number inputs side by side: Team 1 Score (left) and Team 2 Score (right). Each with team name/logo above the input. Min value: 0. Use large, centered number inputs for easy data entry. Add +/- stepper buttons for quick score adjustment. | Clean score entry form with team info and easy-to-use inputs. | Pending |
| 4.2.3 | Add optional winner override. By default, the winner is auto-determined by higher score. Add a toggle: "Override Winner" — when enabled, shows a dropdown to manually select the winner (Team 1, Team 2, or Draw). This handles edge cases where the bracket admin needs to set a specific winner regardless of score. | Winner can be auto-determined or manually overridden. | Pending |
| 4.2.4 | Implement "Save Result" button. Validates: both scores are non-negative integers. Calls `setCustomMatchResultAction(tournamentId, matchId, { team1Score, team2Score, winnerId? })`. Shows loading spinner during API call. On success, closes dialog and calls `onResultSet`. On error, shows inline error. | Results are saved with proper validation and feedback. | Pending |
| 4.2.5 | Implement "Clear Result" button. Only visible when the match already has a result. Shows confirmation: "Clear this match's result? The match will return to scheduled status." Calls `setCustomMatchResultAction` with `{ clear: true }`. On success, closes dialog and refreshes. | Existing results can be cleared with confirmation. | Pending |
| 4.2.6 | Display current result pre-filled when editing. If match already has a result (`match.result`), pre-populate the score inputs with current values and show the current winner highlighted. The form should clearly indicate this is an "edit" vs "new" result. | Editing existing results shows current values pre-filled. | Pending |

---

### Implementation Notes

- Score inputs should be type="number" with `min={0}` and `step={1}`. Consider using `Input` from shadcn with custom styling for large centered numbers.
- The +/- stepper buttons pattern: small circular buttons on either side of the score input.
- Winner auto-determination: compare team1Score vs team2Score. Higher score = winner. Equal scores = no auto-winner (admin must override or it's treated as a draw).
- The `winnerId` sent to the API should be the MongoDB ObjectId of the winning team/player. Map from team1/team2 in the match object.
- Dialog width: `max-w-lg` to accommodate two score columns side by side.
- For player tournaments, show player names/avatars instead of team logos.
