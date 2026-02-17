# Phase 01 — Tournament Form & Core Fields

## Milestone 04 — Tournament Detail View Updates

### Objective

Update the tournament detail/view page to display the new `competitionType` and `participationType` fields. Show players list for player tournaments. Update info cards and metadata sections.

### Status: `Planned`

---

### Task 1.4.1 — Display competitionType in TournamentDetails

- **Task ID:** 1.4.1
- **Description:** In `components/Tournaments Management/TournamentDetails.jsx`, add `competitionType` to the tournament info section. Display it as a labeled badge (same color scheme as Task 1.3.1) in the metadata area alongside status, tier, and format. Place it prominently near the top of the detail view.
- **Expected Output:** The tournament detail view shows the competition type as a colored badge.
- **Status:** `Planned`

---

### Task 1.4.2 — Display participationType in TournamentDetails

- **Task ID:** 1.4.2
- **Description:** In `TournamentDetails.jsx`, add `participationType` indicator. Show "Team Tournament" or "Player Tournament" as a subtle label/tag near the competition type. When `participationType === "player"`, the teams tab/section should be replaced with a players section.
- **Expected Output:** The detail view clearly indicates whether this is a team or player tournament.
- **Status:** `Planned`

---

### Task 1.4.3 — Show players list for player tournaments

- **Task ID:** 1.4.3
- **Description:** In `TournamentDetails.jsx`, when `participationType === "player"`, render a players list section instead of (or in addition to) the teams section. Each player entry shows: photo (light/dark), nickname, slug. Use the same card/list pattern used for the teams section. The tournament response includes a `players` array with populated player objects (`_id`, `nickname`, `slug`, `photo`).
- **Expected Output:** Viewing a player tournament shows the list of participating players with their photos and nicknames.
- **Status:** `Planned`

---

### Task 1.4.4 — Update bracket seeds display for player tournaments

- **Task ID:** 1.4.4
- **Description:** In `BracketView.jsx`, the seed management section currently shows team names and logos. When `participationType === "player"`, it should show player nicknames and photos instead. Update the seed list rendering to check `tournament.participationType` and render the appropriate entity (team or player). The bracket seeds array contains IDs — the display names come from the tournament's `teams` or `players` array.
- **Expected Output:** Bracket seed management for player tournaments shows player names/photos. Drag-to-reorder and remove work the same as for teams.
- **Status:** `Planned`
