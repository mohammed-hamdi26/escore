# Phase 01 — Server Actions & API Layer

## Milestone 02: Team Assignment, Result & Lifecycle Server Actions

### Milestone Objective

Create the remaining server actions for team/player assignment, match result entry, match linking, and bracket completion. These cover the operational side of custom bracket management.

### Status: Pending

---

### Tasks

| Task ID | Description | Expected Output | Status |
|---------|-------------|-----------------|--------|
| 1.2.1 | Add `assignTeamToCustomMatchAction(tournamentId, matchId, data)` server action — PUT to `/tournaments/${id}/bracket/custom/matches/${matchId}/assign` with `{ slot, teamId }`. `slot` is `team1`/`team2` (or `player1`/`player2` for player tournaments). `teamId` can be `null` to clear a slot. | New function in `actions.js` for single team/player assignment. | Pending |
| 1.2.2 | Add `bulkAssignTeamsAction(tournamentId, data)` server action — PUT to `/tournaments/${id}/bracket/custom/bulk-assign` with `{ assignments: [{ matchId, slot, teamId }] }`. | New function in `actions.js` for bulk team assignment across multiple matches. | Pending |
| 1.2.3 | Add `setCustomMatchResultAction(tournamentId, matchId, data)` server action — PUT to `/tournaments/${id}/bracket/custom/matches/${matchId}/result`. Body supports two modes: `{ team1Score, team2Score, winnerId? }` for setting results, or `{ clear: true }` for clearing results. | New function in `actions.js` for setting or clearing match results. | Pending |
| 1.2.4 | Add `linkCustomMatchAction(tournamentId, matchId, data)` server action — PUT to `/tournaments/${id}/bracket/custom/matches/${matchId}/link` with `{ nextWinnerMatchId, nextLoserMatchId? }`. | New function in `actions.js` for linking match progression. | Pending |
| 1.2.5 | Add `completeCustomBracketAction(tournamentId)` server action — PUT to `/tournaments/${id}/bracket/custom/complete`. | New function in `actions.js` for manually completing the bracket. | Pending |

---

### Implementation Notes

- The `assignTeamToCustomMatchAction` must handle nullable `teamId` — sending `null` clears the slot.
- The `setCustomMatchResultAction` must support the union body: either `{ team1Score, team2Score, winnerId? }` OR `{ clear: true }`.
- The `completeCustomBracketAction` takes no body — it's a simple PUT.
- All actions follow the same error handling and revalidation pattern from Milestone 01.
- The `bulkAssignTeamsAction` may return partial success — handle accordingly in the response.
