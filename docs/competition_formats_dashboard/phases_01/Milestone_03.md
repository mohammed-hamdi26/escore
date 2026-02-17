# Phase 01 — Tournament Form & Core Fields

## Milestone 03 — Tournament Table & Filter Updates

### Objective

Update the tournaments list table to display `competitionType` as a column with color-coded badges. Add `competitionType` as a filter option in the filter sidebar. Update the `participationType` display in the table.

### Status: `Planned`

---

### Task 1.3.1 — Add competitionType column to TournamentsTable

- **Task ID:** 1.3.1
- **Description:** In `components/Tournaments Management/TournamentsTable.jsx`, add a new column `Competition Type` after the `Status` column. Display the value as a colored badge (similar to how `status` and `tier` badges work). Badge colors:
  - `standard` → gray/default
  - `battle_royale` → red
  - `fighting` → orange
  - `racing` → blue
  - `ffa` → purple
  - `sports_sim` → green

  Use translated labels from the i18n keys added in Task 1.1.3. Handle undefined/missing values by showing "Standard" as fallback.
- **Expected Output:** The tournaments table shows a new color-coded "Competition Type" column for every tournament.
- **Status:** `Planned`

---

### Task 1.3.2 — Add participationType indicator to TournamentsTable

- **Task ID:** 1.3.2
- **Description:** In `TournamentsTable.jsx`, update the "Teams" column to be context-aware:
  - When `participationType === "team"`: Show team count as before (e.g., "8 teams")
  - When `participationType === "player"`: Show player count instead (e.g., "16 players") with a different icon (user icon instead of users icon)

  This reuses the existing column but adapts the label and icon based on participation type.
- **Expected Output:** Player tournaments show "X players" instead of "X teams" in the table.
- **Status:** `Planned`

---

### Task 1.3.3 — Add competitionType filter to TournamentsFilter

- **Task ID:** 1.3.3
- **Description:** In `components/Tournaments Management/TournamentsFilter.jsx`, add a `competitionType` select filter. Options: All (default/empty), Standard, Battle Royale, Fighting, Racing, FFA, Sports Sim. When selected, pass `competitionType` as a query parameter to the tournaments list API call (`GET /tournaments?competitionType=battle_royale`). Use the same filter pattern as existing status/tier filters.
- **Expected Output:** Users can filter the tournament list by competition type. Selecting "Racing" shows only racing tournaments.
- **Status:** `Planned`

---

### Task 1.3.4 — Pass competitionType filter to API

- **Task ID:** 1.3.4
- **Description:** In the tournament list page (`tournaments-management/page.jsx`) and the `getTournaments` API function, ensure the `competitionType` query parameter is forwarded to the API when present. Check how other filters (status, tier, game) are passed and follow the same pattern. The backend already supports `?competitionType=` filtering.
- **Expected Output:** Changing the competitionType filter in the UI triggers a new API call with the filter applied, and the table updates.
- **Status:** `Planned`
