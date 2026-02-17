# Phase 04 — Racing / Time-Based UI

## Milestone 01 — Time Fields in Participant Editor

### Objective

Extend the `ParticipantResultsEditor` (from Phase 03) with racing/time-based fields: finish time, best lap, total laps, penalty time, DNF, and DSQ. These fields are shown conditionally when the tournament's `competitionType` is `"racing"`.

### Status: `Planned`

---

### Task 4.1.1 — Add time columns to ParticipantResultsEditor

- **Task ID:** 4.1.1
- **Description:** In `ParticipantResultsEditor.jsx`, when the tournament's `competitionType === "racing"`, add additional columns to the editable table:

  | Column | Field | Input Type | Notes |
  |--------|-------|-----------|-------|
  | Finish Time | `finishTimeMs` | Time input (mm:ss.SSS) | Converted to/from ms |
  | Best Lap | `bestLapMs` | Time input (mm:ss.SSS) | Converted to/from ms |
  | Laps | `totalLaps` | Number input | Integer, min 0 |
  | Penalty | `penaltyMs` | Time input (ss.SSS) | Converted to/from ms |
  | DNF | `dnf` | Checkbox | Did Not Finish |
  | DSQ | `dsq` | Checkbox | Disqualified |

  The time inputs should accept human-readable format (e.g., "1:33.450") and convert to milliseconds for the API payload. When DNF or DSQ is checked, disable the finish time input (it becomes irrelevant).

  Hide the standard kills/deaths/assists columns for racing (they don't apply), or show both sets if the tournament uses kills too (hybrid like some racing games).
- **Expected Output:** Racing matches show time-specific input fields in the participant editor.
- **Status:** `Planned`

---

### Task 4.1.2 — Create TimeInput component

- **Task ID:** 4.1.2
- **Description:** Create a reusable `components/ui/TimeInput.jsx` component that:
  1. Accepts a value in milliseconds and displays it as `mm:ss.SSS` or `ss.SSS`
  2. Allows the user to type a time in human-readable format
  3. On blur/change, converts the input back to milliseconds
  4. Validates format (must be valid time)
  5. Shows "DNF" or "DSQ" label when the corresponding flag is set

  Parsing rules:
  - `"1:33.450"` → 93450 ms
  - `"33.450"` → 33450 ms
  - `"0.500"` → 500 ms
  - Empty/null → null (no time recorded)

  Props: `value` (ms or null), `onChange(ms)`, `disabled`, `placeholder`.
- **Expected Output:** A reusable time input component that handles ms ↔ human-readable conversion.
- **Status:** `Planned`

---

### Task 4.1.3 — Include time fields in submission payload

- **Task ID:** 4.1.3
- **Description:** Update the participant results save handler to include time fields in the payload when present:
  ```json
  {
    "participants": [
      {
        "team": "TEAM_ID",
        "placement": 1,
        "points": 25,
        "finishTimeMs": 93450,
        "bestLapMs": 30200,
        "totalLaps": 3,
        "penaltyMs": 0,
        "dnf": false,
        "dsq": false
      }
    ]
  }
  ```
  Only include time fields when the tournament is a racing type. For non-racing tournaments, omit them from the payload (backend accepts but doesn't require them).
- **Expected Output:** Racing participant results are correctly sent to the backend with all time fields.
- **Status:** `Planned`

---

### Task 4.1.4 — DNF/DSQ interaction logic

- **Task ID:** 4.1.4
- **Description:** Implement interaction logic for DNF/DSQ checkboxes:
  - When DNF is checked: Clear `finishTimeMs` (set to null), keep `bestLapMs` and `totalLaps` (partial race data is useful). Disable finish time input. Auto-set placement to last position if not already set.
  - When DSQ is checked: Clear `finishTimeMs` (set to null). Disable finish time input. Show the row with a visual "disqualified" indicator (strikethrough or red background).
  - DNF and DSQ are mutually exclusive: checking one unchecks the other.
  - Unchecking both re-enables the finish time input.
- **Expected Output:** DNF/DSQ checkboxes interact correctly with other fields, preventing invalid combinations.
- **Status:** `Planned`
