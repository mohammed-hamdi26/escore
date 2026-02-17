# Phase 01 — Tournament Form & Core Fields

## Milestone 02 — Participation Type & Player Selection

### Objective

Add `participationType` toggle (team/player) to the tournament form. When set to `"player"`, hide the teams multi-select and show a players multi-select instead. Add `maxPlayers` field for player tournaments. Ensure the correct payload is sent to the backend.

### Status: `Planned`

---

### Task 1.2.1 — Add participationType radio/select to TournamentsForm

- **Task ID:** 1.2.1
- **Description:** In `TournamentsForm.jsx`, add a `participationType` field with two options: `"team"` (default) and `"player"`. Use a radio group or toggle switch (shadcn `RadioGroup` or `ToggleGroup`) placed right after the `competitionType` select. Add it to Formik `initialValues` (default: `"team"`) and Yup schema (required, oneOf `["team", "player"]`). When `competitionType` is `"fighting"`, auto-set `participationType` to `"player"` (common pattern for fighting games).
- **Expected Output:** A team/player toggle appears in the form. Defaults to "team". Changing competitionType to "fighting" auto-switches to "player".
- **Status:** `Planned`

---

### Task 1.2.2 — Conditional teams/players multi-select

- **Task ID:** 1.2.2
- **Description:** In `TournamentsForm.jsx`, conditionally render the teams multi-select or players multi-select based on `participationType`:
  - When `"team"`: Show the existing teams multi-select (no change needed)
  - When `"player"`: Hide teams multi-select, show a new players multi-select using the same async search pattern. The players search should call the players API endpoint (`/players?search=...`) to fetch player options. Each option shows `nickname` and `photo`. Store selected player IDs in Formik field `players` (array of player ID strings).

  Also conditionally show `maxTeams` (for team) or `maxPlayers` (for player). Add `maxPlayers` to initialValues (default: undefined) and Yup schema (optional, positive integer).
- **Expected Output:** Switching participationType to "player" hides teams, shows players multi-select. Selected players are stored in form state.
- **Status:** `Planned`

---

### Task 1.2.3 — Add searchPlayers API function

- **Task ID:** 1.2.3
- **Description:** In `app/[locale]/_Lib/actions.js` or a dedicated `playersApi.js`, add a `searchPlayers({ search, page, limit })` function that calls `GET /players?search=...&page=...&limit=...`. This function is needed for the async player multi-select in Task 1.2.2. Return the response data with `id`, `nickname`, `slug`, `photo` fields. If a `searchPlayers` action already exists, verify it works for the multi-select pattern.
- **Expected Output:** A reusable function that searches players by nickname and returns results suitable for a select/combobox component.
- **Status:** `Planned`

---

### Task 1.2.4 — Populate participationType and players on edit

- **Task ID:** 1.2.4
- **Description:** When editing a tournament, pre-populate `participationType` from the API response (fallback: `"team"`). If `participationType === "player"`, pre-populate the `players` multi-select with the tournament's `players` array (which contains populated player objects with `_id`, `nickname`, `photo`). Also pre-populate `maxPlayers` if present.
- **Expected Output:** Editing a player tournament correctly shows "player" toggle selected, with existing players pre-loaded in the multi-select.
- **Status:** `Planned`

---

### Task 1.2.5 — Include participationType and players in server action payload

- **Task ID:** 1.2.5
- **Description:** Verify that `addTournament` and `editTournament` server actions in `actions.js` forward `participationType`, `players` (array of IDs), and `maxPlayers` fields to the API. Ensure `players` is sent as an array of string IDs (not full objects). When `participationType === "team"`, do not send `players` or `maxPlayers` (clean payload).
- **Expected Output:** Creating/updating a player tournament correctly sends participationType, players, and maxPlayers to the backend.
- **Status:** `Planned`

---

### Task 1.2.6 — Add translation keys for participationType

- **Task ID:** 1.2.6
- **Description:** Add translation keys in `messages/en.json` and `messages/ar.json` for: `participationType`, `participationType.team`, `participationType.player`, `maxPlayers`, `players`, `searchPlayers`.
- **Expected Output:** All new labels display correctly in both English and Arabic.
- **Status:** `Planned`
