# Phase 02 — Placement Scoring & Standing Config

## Milestone 02 — Placement Config Editor

### Objective

Build an interactive placement config editor that lets admins define a placement-to-points mapping table, kill points, and bonus rules. This editor appears in the tournament form when `scoringType === "placement"`.

### Status: `Planned`

---

### Task 2.2.1 — Create PlacementConfigEditor component

- **Task ID:** 2.2.1
- **Description:** Create a new component `components/Tournaments Management/PlacementConfigEditor.jsx`. This component receives `formik` as a prop and manages the `standingConfig.placementConfig` object. It should render:

  1. **Placement Points Table** — A dynamic table with columns: "Place" (number, auto-incrementing) and "Points" (number input). Start with rows for places 1-5 by default. Include "Add Row" button to add more places and "Remove" button on each row (except the first). The data maps to `placementConfig.placementPoints: [{ place: 1, points: 12 }, ...]`.

  2. **Kill Points** — A single number input for `placementConfig.killPoints` (optional, default 0). Label: "Points per Kill".

  Use Formik `FieldArray` or manual array manipulation for the placement points rows. Each row's `place` field auto-fills based on index + 1 (not editable). Only `points` is editable.
- **Expected Output:** A clean, interactive table where admins can define how many points each finishing position earns, plus a kill points field.
- **Status:** `Planned`

---

### Task 2.2.2 — Integrate PlacementConfigEditor in TournamentsForm

- **Task ID:** 2.2.2
- **Description:** In `TournamentsForm.jsx`, import `PlacementConfigEditor` and render it inside the standing config section when `scoringType === "placement"` (replacing the placeholder from Task 2.1.2). Pass the `formik` instance. Add `placementConfig` to Formik `initialValues`:
  ```
  placementConfig: {
    placementPoints: [
      { place: 1, points: 12 },
      { place: 2, points: 9 },
      { place: 3, points: 7 },
      { place: 4, points: 5 },
      { place: 5, points: 4 },
    ],
    killPoints: 0,
  }
  ```
  Add Yup validation: `placementPoints` array must have at least 1 entry, each entry must have `place` (positive int) and `points` (non-negative number). `killPoints` must be a non-negative number.
- **Expected Output:** The placement config editor renders in the form and its data flows through Formik. Validation errors display correctly.
- **Status:** `Planned`

---

### Task 2.2.3 — Include placementConfig in submission payload

- **Task ID:** 2.2.3
- **Description:** In `TournamentsForm.jsx`, update the form submission handler to include `placementConfig` inside `standingConfig` when `scoringType === "placement"`. The final payload should look like:
  ```json
  {
    "standingConfig": {
      "scoringType": "placement",
      "placementConfig": {
        "placementPoints": [{ "place": 1, "points": 12 }, ...],
        "killPoints": 1
      }
    }
  }
  ```
  When `scoringType === "win_loss"`, do NOT include `placementConfig` in the payload (send the existing pointsPerWin/Draw/Loss fields). Clean the payload based on the selected scoring type.
- **Expected Output:** The correct standingConfig shape is sent to the API based on the selected scoring type.
- **Status:** `Planned`

---

### Task 2.2.4 — Populate placementConfig on edit

- **Task ID:** 2.2.4
- **Description:** When editing a tournament that has `standingConfig.placementConfig`, pre-populate the PlacementConfigEditor with the existing data. Map `placementConfig.placementPoints` to the table rows and `placementConfig.killPoints` to the kill points input.  If `placementConfig` is null/undefined (old tournament or win_loss type), use the default values from Task 2.2.2.
- **Expected Output:** Editing a BR tournament with existing placement config shows the correct point values pre-filled.
- **Status:** `Planned`

---

### Task 2.2.5 — Add preset placement tables

- **Task ID:** 2.2.5
- **Description:** Add a "Load Preset" dropdown to the PlacementConfigEditor that pre-fills common scoring tables. Presets:
  - **ALGS (Apex):** 1st=12, 2nd=9, 3rd=7, 4th=5, 5th=4, 6th-10th=3, 11th-15th=1, 16th-20th=0. Kill points: 1
  - **PUBG:** 1st=10, 2nd=6, 3rd=5, 4th=4, 5th=3, 6th=2, 7th-8th=1, 9th-16th=0. Kill points: 1
  - **F1 Racing:** 1st=25, 2nd=18, 3rd=15, 4th=12, 5th=10, 6th=8, 7th=6, 8th=4, 9th=2, 10th=1. Kill points: 0

  Selecting a preset replaces the current table data. Show a confirmation if there's existing custom data.
- **Expected Output:** A dropdown lets admins quickly load standard scoring tables. Custom editing is still possible after loading a preset.
- **Status:** `Planned`
