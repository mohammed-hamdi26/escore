# Phase 04 — Racing / Time-Based UI

## Milestone 02 — Racing Standings Display

### Objective

Extend the standings table components (`StandingsManagement.jsx`, `TournamentStandings.jsx`) to display racing-specific aggregate fields: best finish time, best lap, total penalty time, total laps, DNF count, and DSQ count. These columns appear conditionally when the tournament's `competitionType` is `"racing"`.

### Status: `Planned`

---

### Task 4.2.1 — Add racing columns to StandingsManagement table

- **Task ID:** 4.2.1
- **Description:** In `components/Tournaments Management/StandingsManagement.jsx`, extend the standings table to show racing-specific columns when the tournament's `competitionType === "racing"`. Add these columns after the existing stats columns:

  | Column | Field | Format | Notes |
  |--------|-------|--------|-------|
  | Best Time | `bestFinishTimeMs` | mm:ss.SSS | Use `formatTimeMs()` from Task 4.3.1 |
  | Best Lap | `bestLapMs` | mm:ss.SSS | Use `formatTimeMs()` |
  | Penalties | `totalPenaltyMs` | ss.SSS | Only show if > 0 |
  | Laps | `totalLapsCompleted` | Number | Integer |
  | DNFs | `dnfCount` | Number | Red text if > 0 |
  | DSQs | `dsqCount` | Number | Red text if > 0 |

  Hide the standard W/D/L columns for racing tournaments (they don't apply), and show points + racing columns instead. The `competitionType` should be passed down from the tournament data or fetched from context.
- **Expected Output:** Racing tournament standings show time-based columns instead of win/draw/loss columns.
- **Status:** `Planned`

---

### Task 4.2.2 — Add racing columns to TournamentStandings (public view)

- **Task ID:** 4.2.2
- **Description:** In `components/Standings/TournamentStandings.jsx` (the public/detail view standings), add the same racing columns from Task 4.2.1. This component may be read-only (no editing). Apply the same conditional logic: only show racing columns when the tournament is a racing competition.

  Add visual enhancements:
  - **Medal styling** for top 3 positions (gold/silver/bronze row backgrounds)
  - **DNF/DSQ badges** — show red badges next to team names that have high DNF or DSQ counts
  - **Time formatting** — all time values displayed as `mm:ss.SSS`
- **Expected Output:** Public-facing standings for racing tournaments display racing-specific data with clear formatting.
- **Status:** `Planned`

---

### Task 4.2.3 — Add racing fields to round history detail

- **Task ID:** 4.2.3
- **Description:** In the round history display (from Phase 02, Milestone 04), extend each round entry to show racing fields when present:
  - `finishTimeMs` → formatted as `mm:ss.SSS`
  - `bestLapMs` → formatted as `mm:ss.SSS`
  - `totalLaps` → number
  - `penaltyMs` → formatted as `ss.SSS` (only if > 0)
  - `dnf` → "DNF" badge (red)
  - `dsq` → "DSQ" badge (red)

  When a round has `dnf: true`, show the finish time as "DNF" instead of a time value. Same for DSQ. These fields come from the standing's `roundHistory[]` array entries.
- **Expected Output:** Round history entries for racing tournaments show time-based data with DNF/DSQ indicators.
- **Status:** `Planned`

---

### Task 4.2.4 — Sort standings by racing criteria

- **Task ID:** 4.2.4
- **Description:** For racing tournaments, the default sort order in standings should prioritize:
  1. Points (descending) — primary sort
  2. Best finish time (ascending) — tiebreaker (lower time is better)
  3. DNF count (ascending) — fewer DNFs is better
  4. DSQ count (ascending) — fewer DSQs is better

  Add a sort toggle or automatic sorting based on tournament type. The backend already sorts by points + position, but the frontend should handle secondary visual sorting if needed. Add sort indicator arrows to the column headers.
- **Expected Output:** Racing standings are sorted by points first, then by time-based tiebreakers.
- **Status:** `Planned`
