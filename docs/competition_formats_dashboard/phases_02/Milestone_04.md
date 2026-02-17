# Phase 02 — Placement Scoring & Standing Config

## Milestone 04 — Round History Display

### Objective

Add a per-round history breakdown view to standings, allowing admins to see each participant's performance in every round. This is displayed as an expandable section or tab within the standings view.

### Status: `Planned`

---

### Task 2.4.1 — Add expandable round history to standing rows

- **Task ID:** 2.4.1
- **Description:** In the cumulative standings table (from Milestone 03), make each row expandable. When a row is expanded (click or chevron icon), show the `roundHistory` array as a sub-table below the row. Each round history entry shows:

  | Column | Field |
  |--------|-------|
  | Round | `round` |
  | Placement | `placement` (with ordinal: 1st, 2nd, 3rd...) |
  | PP | `placementPoints` |
  | KP | `killPoints` |
  | Bonus | `bonusPoints` |
  | Total | `totalRoundPoints` |

  Use a collapsible/accordion pattern. Only one row should be expanded at a time (or allow multiple — follow existing dashboard UX patterns).
- **Expected Output:** Clicking a standing row reveals a detailed per-round breakdown showing how points were earned in each match/round.
- **Status:** `Planned`

---

### Task 2.4.2 — Style round history sub-table

- **Task ID:** 2.4.2
- **Description:** Style the round history sub-table to be visually distinct from the main standings table. Use:
  - Indented or slightly different background color
  - Smaller font size
  - Subtle border separating it from the main table
  - Round numbers as badges (e.g., "R1", "R2", "R3")
  - Highlight the best round (highest `totalRoundPoints`) with a subtle accent
- **Expected Output:** The round history is visually clear, easy to read, and distinct from the main standings.
- **Status:** `Planned`

---

### Task 2.4.3 — Handle empty round history

- **Task ID:** 2.4.3
- **Description:** When a standing has an empty `roundHistory` array (no completed matches yet), show a message like "No rounds played yet" in the expandable area. Don't show the expand chevron if `roundHistory` is empty or undefined. Also handle the case where `roundHistory` doesn't exist (old standing data) — treat it as empty.
- **Expected Output:** Standings with no round data don't show misleading expand buttons. Empty state is handled gracefully.
- **Status:** `Planned`
