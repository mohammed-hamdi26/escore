# Phase 04 — Racing / Time-Based UI

## Milestone 03 — Time Formatting Utility

### Objective

Create a shared JavaScript utility for converting between milliseconds and human-readable time formats (`mm:ss.SSS`, `ss.SSS`). This utility is used by the `TimeInput` component (Task 4.1.2), standings display (Milestone 02), and round history.

### Status: `Planned`

---

### Task 4.3.1 — Create time formatting utility functions

- **Task ID:** 4.3.1
- **Description:** Create `lib/timeUtils.js` (or `utils/timeUtils.js` depending on project convention) with these functions:

  ```
  formatTimeMs(ms)          → "1:33.450" or "33.450" or "0.500"
  parseTimeString(str)      → milliseconds (number) or null
  formatGap(gapMs)          → "+1.650" or "+1:02.300"
  formatPenalty(penaltyMs)  → "+5.000s penalty"
  ```

  **`formatTimeMs(ms)`:**
  - `93450` → `"1:33.450"`
  - `33450` → `"33.450"`
  - `500` → `"0.500"`
  - `null` or `undefined` → `"—"` (dash)
  - Always shows 3 decimal places for milliseconds

  **`parseTimeString(str)`:**
  - `"1:33.450"` → `93450`
  - `"33.450"` → `33450`
  - `"0.500"` → `500`
  - `""` or invalid → `null`
  - Accepts both `mm:ss.SSS` and `ss.SSS` formats
  - Must handle edge cases: leading zeros, missing milliseconds (assume `.000`)

  **`formatGap(gapMs)`:**
  - `1650` → `"+1.650"`
  - `62300` → `"+1:02.300"`
  - `0` → `"Leader"` or `"—"`

  **`formatPenalty(penaltyMs)`:**
  - `5000` → `"+5.000s"`
  - `0` or `null` → `""` (empty)

  Export all functions as named exports.
- **Expected Output:** A reusable utility file that handles all time ↔ string conversions for the racing UI.
- **Status:** `Planned`

---

### Task 4.3.2 — Add time display helpers for table cells

- **Task ID:** 4.3.2
- **Description:** Create helper components or functions for rendering time values in table cells. These are small wrappers around the utility functions that add visual styling:

  1. **`TimeCell`** — Renders a formatted time with monospace font. Props: `value` (ms), `dnf` (boolean), `dsq` (boolean).
     - Normal: displays `formatTimeMs(value)` in monospace
     - DNF: displays "DNF" in red
     - DSQ: displays "DSQ" in red with strikethrough
     - Null: displays "—" in muted color

  2. **`GapCell`** — Renders a gap from leader. Props: `gapMs` (number).
     - Positive gap: displays `formatGap(gapMs)` in muted text
     - Zero/null: displays "—"

  These can be inline functions or small components in `lib/timeUtils.js` or a separate `components/ui/TimeDisplay.jsx`.
- **Expected Output:** Reusable display helpers for time values in tables and lists.
- **Status:** `Planned`

---

### Task 4.3.3 — Validate time input format

- **Task ID:** 4.3.3
- **Description:** Add a Yup validation helper for time fields that can be used in Formik forms:

  ```
  timeValidation() → Yup schema that validates mm:ss.SSS or ss.SSS format
  ```

  The validator should:
  - Accept empty/null (time fields are optional)
  - Accept valid formats: `"1:33.450"`, `"33.450"`, `"0.500"`
  - Reject invalid formats: `"abc"`, `"-1:00.000"`, `"99:99.999"`
  - Return a user-friendly error message (e.g., "Invalid time format. Use mm:ss.SSS or ss.SSS")

  This validator is used by the `TimeInput` component (Task 4.1.2) and the participant results form.
- **Expected Output:** A Yup-compatible validation function for time input fields.
- **Status:** `Planned`
