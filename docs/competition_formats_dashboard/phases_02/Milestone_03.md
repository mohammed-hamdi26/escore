# Phase 02 — Placement Scoring & Standing Config

## Milestone 03 — Cumulative Standings Table

### Objective

Update the standings table/view to display cumulative scoring columns when a tournament uses `scoringType: "placement"`. Show placement points, kill points, total kills, average placement, and best placement instead of the standard W/L/D columns.

### Status: `Planned`

---

### Task 2.3.1 — Detect scoringType and switch standings layout

- **Task ID:** 2.3.1
- **Description:** In `components/Standings/TournamentStandings.jsx` (or `StandingsManagement.jsx`), detect the tournament's `standingConfig.scoringType`. If `"placement"`, render a different set of columns than the standard W/L/D view. Pass the tournament data (including standingConfig) to the standings component so it can determine which layout to use. This may require fetching tournament data alongside standings if not already available.
- **Expected Output:** The standings component can determine whether to show win/loss columns or placement columns based on the tournament's scoring type.
- **Status:** `Planned`

---

### Task 2.3.2 — Create cumulative standings columns

- **Task ID:** 2.3.2
- **Description:** When `scoringType === "placement"`, render these columns in the standings table:

  | Column | Field | Description |
  |--------|-------|-------------|
  | # | `position` | Rank position |
  | Team/Player | `team.name` or `player.nickname` | Entity with logo/photo |
  | Played | `matchesPlayed` | Number of rounds played |
  | Points | `points` | Total cumulative points (bold, primary) |
  | PP | `totalPlacementPoints` | Placement points subtotal |
  | KP | `totalKillPoints` | Kill points subtotal |
  | Kills | `totalKills` | Total kills |
  | Avg Place | `averagePlacement` | Average placement (1 decimal) |
  | Best | `bestPlacement` | Best single-round placement |
  | Status | `isEliminated` / `isQualified` | Elimination/qualification badge |

  Use tooltips on column headers for full names. Keep the table responsive. On mobile, hide less important columns (KP, Avg Place, Best).
- **Expected Output:** A fully functional cumulative standings table showing placement-based scoring data.
- **Status:** `Planned`

---

### Task 2.3.3 — Style cumulative standings with medals and elimination

- **Task ID:** 2.3.3
- **Description:** Apply visual styling to the cumulative standings:
  - Positions 1-3: Gold/Silver/Bronze medal icons (same as existing standings)
  - `isEliminated: true`: Row has a subtle red/muted background, "Eliminated" badge in Status column
  - `isQualified: true`: Green "Qualified" badge in Status column
  - Points column: Bold and larger font
  - Sort by `position` (ascending)
- **Expected Output:** The cumulative standings table has clear visual hierarchy with medals, elimination indicators, and emphasized point totals.
- **Status:** `Planned`

---

### Task 2.3.4 — Add "Recalculate" button for placement standings

- **Task ID:** 2.3.4
- **Description:** Add a "Recalculate Standings" button above the standings table when `scoringType === "placement"`. On click, call the server action `recalculatePlacementStandings(tournamentId)` which hits `POST /standings/tournament/:id/recalculate-placement`. Show a loading spinner during the API call, then refresh the standings data on success. Show a success/error toast.
- **Expected Output:** Admins can manually trigger a full recalculation of cumulative standings from match results.
- **Status:** `Planned`
