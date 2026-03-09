# Phase 03 — Integration & Polish

## Milestone 01: MultiStage Support

### Milestone Objective
Ensure the reassign feature works when `RoundRobinDisplay` is used inside `MultiStageDisplay` (multi-stage tournaments with round robin stages).

### Milestone Status: Planned

---

### Tasks

#### Task 3.1.1
- **Task ID:** P03-M01-T01
- **Task Description:**
  Check how `MultiStageDisplay.jsx` renders `RoundRobinDisplay` and ensure the `tournament` prop (needed for the API call) is passed through correctly.

  Read `MultiStageDisplay.jsx` and verify that when it renders `<RoundRobinDisplay>`, it passes:
  - `tournament` — needed for `tournament.id` in the API call
  - `onRefresh` — needed to refresh bracket after swap

  If these props are already passed, no change needed. If `tournament` is not passed, add it.

  **Note:** The reassign button and mode are self-contained in `RoundRobinDisplay`, so no changes needed in `MultiStageDisplay` unless props are missing.

- **Expected Output:**
  Reassign feature works correctly in multi-stage tournaments. Verified by reading the code — change only if needed.

- **Task Status:** Planned
