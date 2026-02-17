# Phase 05 — Translations & Final Polish

## Milestone 03 — Final Integration & Verification

### Objective

End-to-end verification that all dashboard features work together: tournament creation with new fields, bracket generation (all types including BR), multi-participant match management, racing time entry, standings display, and translations. Fix any integration issues found during testing.

### Status: `Planned`

---

### Task 5.3.1 — End-to-end flow: Standard tournament with placement scoring

- **Task ID:** 5.3.1
- **Description:** Verify the complete flow for a standard tournament with placement-based scoring:

  1. Create tournament → set `competitionType: "standard"`, `participationType: "team"`, `scoringType: "placement"`
  2. Configure `placementConfig` (1st = 25pts, 2nd = 18pts, etc.) and `killPoints`
  3. Generate single_elimination bracket → matches appear correctly
  4. Complete matches with participant results (placements, kills, points)
  5. View standings → cumulative points display correctly, round history accessible
  6. Recalculate standings → values update correctly

  Fix any issues found. Ensure no regressions in the standard match flow (team vs team matches still work as before).
- **Expected Output:** Standard tournament with placement scoring works end-to-end without errors.
- **Status:** `Planned`

---

### Task 5.3.2 — End-to-end flow: Battle Royale tournament

- **Task ID:** 5.3.2
- **Description:** Verify the complete BR tournament flow:

  1. Create tournament → set `competitionType: "battle_royale"`, `participationType: "team"`
  2. Add teams to the tournament
  3. Generate `battle_royale` bracket → configure `totalRounds: 3`, `teamsPerLobby: 10`, elimination rules
  4. View BR bracket → rounds displayed correctly, lobby cards show participant lists
  5. Edit Round 1 match → open participant editor, input placements/kills/points
  6. Save results → standings update
  7. Advance to Round 2 → eliminated teams removed, new matches created
  8. Complete all rounds → bracket shows completed state, final standings visible

  Fix any issues found. Pay attention to:
  - Lobby card rendering with many participants
  - Elimination info after round advancement
  - Standings table showing correct aggregate data
- **Expected Output:** BR tournament works end-to-end: generation, match editing, round advancement, completion.
- **Status:** `Planned`

---

### Task 5.3.3 — End-to-end flow: Racing tournament

- **Task ID:** 5.3.3
- **Description:** Verify the complete racing tournament flow:

  1. Create tournament → set `competitionType: "racing"`, `participationType: "team"` or `"player"`, `scoringType: "placement"`
  2. Generate bracket (any type)
  3. Edit match → participant editor shows time fields (finish time, best lap, laps, penalty, DNF, DSQ)
  4. Enter time values → verify `mm:ss.SSS` input and ms conversion
  5. Check DNF interaction → finish time disabled, placement auto-set to last
  6. Check DSQ interaction → finish time disabled, row shows disqualified indicator
  7. Save results → time fields sent correctly in payload
  8. View standings → racing columns displayed (best time, best lap, penalties, laps, DNF count, DSQ count)
  9. View round history → time data shown per round

  Fix any issues found. Pay special attention to:
  - `TimeInput` component edge cases (empty input, invalid format, very large times)
  - DNF/DSQ mutual exclusivity
  - Time formatting consistency across all views
- **Expected Output:** Racing tournament works end-to-end: time entry, DNF/DSQ handling, racing standings.
- **Status:** `Planned`

---

### Task 5.3.4 — Verify translations in both languages

- **Task ID:** 5.3.4
- **Description:** Switch the dashboard between English and Arabic and verify:

  1. All new labels are translated (no raw key strings visible)
  2. Arabic text displays correctly with RTL layout
  3. Time formats display correctly in both languages (time notation is universal)
  4. Competition type, participation type, and scoring type labels show correctly in both languages
  5. BR bracket labels (rounds, lobbies, elimination rules) show in both languages
  6. Racing field labels (finish time, best lap, DNF, DSQ) show in both languages
  7. Validation messages display in the active language
  8. Filter dropdowns show translated options

  Fix any missing or incorrect translations found during testing.
- **Expected Output:** All new UI text is properly translated and displays correctly in both en and ar.
- **Status:** `Planned`

---

### Task 5.3.5 — Fix regressions and edge cases

- **Task ID:** 5.3.5
- **Description:** Address any regressions or edge cases found during integration testing:

  1. **Standard tournaments unaffected** — Creating/editing a standard tournament with `scoringType: "match_based"` should work exactly as before. No new required fields should block the existing flow.
  2. **Empty state handling** — New columns/fields should handle null/undefined gracefully (show "—" or hide).
  3. **Mobile responsiveness** — New columns in standings and participant tables should be responsive or scrollable on small screens.
  4. **Loading states** — All new API calls (BR advance, participant save, recalculate) should show loading indicators.
  5. **Error handling** — All new server actions should show clear error toasts when the backend returns errors.

  Document any known limitations or deferred items.
- **Expected Output:** All regressions fixed, edge cases handled, and any known limitations documented.
- **Status:** `Planned`
