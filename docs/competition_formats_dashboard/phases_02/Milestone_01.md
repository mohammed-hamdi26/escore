# Phase 02 — Placement Scoring & Standing Config

## Milestone 01 — Scoring Type Toggle in Tournament Form

### Objective

Add a `scoringType` toggle to the standing config section of the tournament form. When set to `"placement"`, show the placement config editor instead of the standard win/draw/loss point fields.

### Status: `Planned`

---

### Task 2.1.1 — Add scoringType toggle to TournamentsForm

- **Task ID:** 2.1.1
- **Description:** In `TournamentsForm.jsx`, locate the "Standing Settings" section (which has `pointsPerWin`, `pointsPerDraw`, `pointsPerLoss` fields). Add a `scoringType` radio group or toggle above these fields with two options:
  - `"win_loss"` (default) — "Win/Loss Points" — shows existing pointsPerWin/Draw/Loss fields
  - `"placement"` — "Placement Scoring" — hides win/loss fields, shows placement config (Task 2.2.x)

  Add `scoringType` to Formik `initialValues` (default: `"win_loss"`) and Yup schema. Store as `standingConfig.scoringType` in the submission payload.
- **Expected Output:** A toggle appears in the standing settings section. Selecting "Win/Loss Points" shows the existing fields. Selecting "Placement Scoring" hides them (placeholder for now, filled in Milestone 02).
- **Status:** `Planned`

---

### Task 2.1.2 — Conditional rendering of win/loss fields

- **Task ID:** 2.1.2
- **Description:** Wrap the existing `pointsPerWin`, `pointsPerDraw`, `pointsPerLoss` fields in a conditional block that only renders when `scoringType === "win_loss"`. When `scoringType === "placement"`, render a placeholder text or empty div that will be replaced by the placement config editor in Milestone 02. Use Formik's `values.scoringType` for the conditional check.
- **Expected Output:** Switching scoringType hides/shows the appropriate config section with smooth transitions.
- **Status:** `Planned`

---

### Task 2.1.3 — Auto-set scoringType based on competitionType

- **Task ID:** 2.1.3
- **Description:** Add a Formik `useEffect` that automatically sets `scoringType` to `"placement"` when `competitionType` is changed to `"battle_royale"`, `"racing"`, or `"ffa"`. Keep `"win_loss"` as default for `"standard"`, `"fighting"`, and `"sports_sim"`. The user can still manually override this, but it provides a sensible default.
- **Expected Output:** Changing competitionType to "battle_royale" auto-switches scoring type to "placement". User can switch back if needed.
- **Status:** `Planned`

---

### Task 2.1.4 — Populate scoringType on edit

- **Task ID:** 2.1.4
- **Description:** When editing a tournament, read `standingConfig.scoringType` from the API response and set it as the initial value for the scoringType toggle. Fallback to `"win_loss"` for old tournaments that don't have this field.
- **Expected Output:** Editing a BR tournament shows "Placement Scoring" pre-selected.
- **Status:** `Planned`
