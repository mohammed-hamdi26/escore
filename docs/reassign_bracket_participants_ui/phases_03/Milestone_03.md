# Phase 03 — Integration & Polish

## Milestone 03: Testing & Verification

### Milestone Objective
Verify the full feature works end-to-end: build passes, UI renders correctly, API calls succeed.

### Milestone Status: Planned

---

### Tasks

#### Task 3.3.1
- **Task ID:** P03-M03-T01
- **Task Description:**
  Run `npm run build` in the Dashboard project and verify zero build errors.
  Fix any issues that arise from new imports or syntax.

- **Expected Output:**
  Dashboard builds successfully with no errors.

- **Task Status:** Planned

---

#### Task 3.3.2
- **Task ID:** P03-M03-T02
- **Task Description:**
  Manual verification checklist (to be confirmed by running `npm run dev` and testing in the browser):

  1. Navigate to a tournament with a round robin bracket
  2. "Reassign Teams" button is visible next to the view toggle
  3. Clicking it activates reassign mode with amber banner
  4. Clicking a team highlights it with amber ring
  5. Clicking another team in a different match triggers the swap
  6. Toast shows success message
  7. Bracket refreshes with swapped teams
  8. Completed matches are not clickable in reassign mode
  9. Switching groups clears selection
  10. Exit reassign mode button works
  11. Works in multi-stage tournament with round robin stages
  12. Works in both English and Arabic locales

- **Expected Output:**
  All 12 checklist items verified. Feature works end-to-end.

- **Task Status:** Planned
