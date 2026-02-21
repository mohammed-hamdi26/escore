# Phase 04 — Team Assignment & Result Entry

## Milestone 01: TeamAssignmentDialog Component

### Milestone Objective

Build the `TeamAssignmentDialog.jsx` modal component that allows admins to assign a team (or player) to a match slot. It shows a searchable list of tournament participants, highlights already-assigned teams, and supports clearing a slot.

### Status: Pending

---

### Tasks

| Task ID | Description | Expected Output | Status |
|---------|-------------|-----------------|--------|
| 4.1.1 | Create `TeamAssignmentDialog.jsx` using shadcn Dialog component. Props: `open`, `onOpenChange`, `tournament`, `match`, `slot` (which slot is being assigned: team1/team2/player1/player2), `onAssign` (callback after assignment), `participationType`. Header should show "Assign Team to [slot label]" or "Assign Player to [slot label]". | Dialog opens with correct title based on slot and participation type. | Pending |
| 4.1.2 | Display the list of tournament participants. For team tournaments, use `tournament.teams` array. For player tournaments, use tournament players. Show each as a selectable row with: team/player logo, name, and an indicator if already assigned in any match. Use a scrollable list with max height. | All tournament participants are displayed in a clear selectable list. | Pending |
| 4.1.3 | Add search/filter input at the top of the dialog. Filter the participant list by name as the admin types. Use a `Search` icon and clear button. Style matches existing search input patterns in the dashboard. | Participants can be filtered by name for quick selection. | Pending |
| 4.1.4 | Implement team selection. When a participant row is clicked, call `assignTeamToCustomMatchAction(tournamentId, matchId, { slot, teamId })`. Show loading spinner on the clicked row during API call. On success, close dialog and call `onAssign` callback (which triggers bracket data refresh). On error, show error message inline in the dialog. | Clicking a team assigns it and closes the dialog. | Pending |
| 4.1.5 | Add "Clear Slot" button at the top or bottom of the dialog. Calls `assignTeamToCustomMatchAction` with `teamId: null`. Only visible when the slot currently has a team assigned. Shows confirmation before clearing. | Admin can unassign a team from a match slot. | Pending |
| 4.1.6 | Highlight the currently assigned team in the list. If the slot already has a team, that team's row should have a distinct visual indicator (e.g., green border, checkmark icon, "Currently assigned" label). The other slot's team should be shown but disabled/grayed out (can't assign same team to both slots). | Current assignment and conflicts are clearly indicated. | Pending |
| 4.1.7 | Handle edge case: if tournament has no participants registered yet, show empty state message: "No teams registered for this tournament" with a link/note to add teams in the tournament settings. | Empty state handled gracefully. | Pending |

---

### Implementation Notes

- The tournament object includes `teams` array (for team tournaments) with team IDs. Team details (name, logo) need to be available — they may already be populated in the bracket data, or you may need to use the team data from the tournament response.
- Use `ScrollArea` from shadcn for the scrollable participant list.
- The search filter should be client-side only (filter the already-loaded list, no API call).
- Dialog width: recommend `max-w-md` for a focused selection experience.
- For player tournaments, the same component works — just use `player1`/`player2` slots and show player data instead of team data.
