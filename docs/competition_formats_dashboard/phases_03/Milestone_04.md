# Phase 03 — Battle Royale Bracket & Multi-Participant

## Milestone 04 — Participant Results Editor

### Objective

Create an editor that allows admins to update participant results (placements, kills, deaths, assists, points) for multi-participant matches. This is the primary way to input BR/FFA match results.

### Status: `Planned`

---

### Task 3.4.1 — Create ParticipantResultsEditor component

- **Task ID:** 3.4.1
- **Description:** Create `components/Matches Management/ParticipantResultsEditor.jsx`. This is a form component that:

  1. Receives the match object (with populated `participants` array).
  2. Renders an editable table with one row per participant:

     | Team/Player | Placement | Kills | Deaths | Assists | Points | Eliminated |
     |-------------|-----------|-------|--------|---------|--------|------------|
     | Team Alpha  | [1]       | [8]   | [2]    | [5]     | [20]   | [ ]        |

  3. Each cell is an editable input (number inputs for stats, checkbox for eliminated).
  4. Team/Player column is read-only (shows name + logo).
  5. "Save Results" button at the bottom.
  6. Uses Formik for form state with the initial values pre-populated from existing participant data.

  The save action calls `updateParticipantResultsAction(matchId, participants)` which hits `PATCH /matches/:id/participants`.
- **Expected Output:** An editable table where admins can input all participant results for a BR/FFA match.
- **Status:** `Planned`

---

### Task 3.4.2 — Add auto-sort by placement

- **Task ID:** 3.4.2
- **Description:** In `ParticipantResultsEditor`, add an "Auto-sort by Placement" feature:
  - When the admin changes a placement value, offer to re-sort the table rows by placement (ascending).
  - Add a "Sort by Placement" button that reorders rows.
  - Validate that placements are unique and sequential (1 through N). Show a warning if there are duplicate placements.
  - Alternatively, allow auto-assignment: a "Auto-assign Placements" button that sets placements 1-N based on current row order (admin reorders rows by drag, then auto-assigns).
- **Expected Output:** Admins can efficiently order participants and assign placements.
- **Status:** `Planned`

---

### Task 3.4.3 — Add auto-calculate points

- **Task ID:** 3.4.3
- **Description:** If the tournament has `standingConfig.placementConfig`, add an "Auto-calculate Points" button that computes each participant's points based on:
  - Placement → placementPoints (from the config table)
  - Kills × killPoints (from the config)
  - Total = placementPoints + killPoints

  Pre-fill the "Points" column with the calculated values. The admin can still manually override. Fetch the tournament's placementConfig from the tournament data. If no placementConfig exists, the button is hidden.
- **Expected Output:** One-click point calculation based on the tournament's scoring rules.
- **Status:** `Planned`

---

### Task 3.4.4 — Integrate editor into match detail view

- **Task ID:** 3.4.4
- **Description:** In `MatchDetails.jsx` (or `MultiParticipantMatchView`), add the `ParticipantResultsEditor` as an editable section. Show it in an edit mode (triggered by an "Edit Results" button) or as a separate tab. When the match is `"scheduled"` or `"live"`, show the editor directly. When `"completed"`, show the read-only participant table (Task 3.3.2) with an "Edit" button to switch to editor mode.

  After saving results:
  - Refresh the match data
  - Show success toast
  - If match status was changed to completed, standings may auto-recalculate (show info toast)
- **Expected Output:** Admins can view and edit participant results directly from the match detail page.
- **Status:** `Planned`

---

### Task 3.4.5 — Add updateParticipantResults server action

- **Task ID:** 3.4.5
- **Description:** In `actions.js`, add `updateParticipantResultsAction(matchId, participants)`:
  ```javascript
  export async function updateParticipantResultsAction(matchId, participants) {
    "use server";
    const response = await apiClient.patch(`/matches/${matchId}/participants`, { participants });
    return response.data;
  }
  ```
  The `participants` array should match the backend schema: `[{ team: "id", placement: 1, kills: 8, ... }]`.
- **Expected Output:** A server action that sends participant results to the backend API.
- **Status:** `Planned`
