# Phase 03 — Integration & Polish

## Milestone 02: Completed Match Protection & Edge Cases

### Milestone Objective
Ensure the UI prevents selecting teams in completed matches and handles edge cases gracefully.

### Milestone Status: Planned

---

### Tasks

#### Task 3.2.1
- **Task ID:** P03-M02-T01
- **Task Description:**
  In `RRMatchCard`, prevent team selection in reassign mode if the match status is `completed`.

  The backend already blocks completed slot swaps, but we should also prevent the click in the UI for better UX.

  **Update the team row click handlers:**
  ```javascript
  const isCompleted = match.status === "completed" || match.result?.winner;
  const canReassign = reassignMode && !isCompleted;
  ```

  Use `canReassign` instead of just `reassignMode` in the click handlers and hover styles for both team rows.

  **Also:** Add a subtle visual indicator for completed matches in reassign mode — e.g., a lock icon or reduced opacity:
  ```jsx
  {reassignMode && isCompleted && (
    // Add a small lock overlay or opacity-50 class to indicate non-swappable
  )}
  ```

- **Expected Output:**
  Completed matches are visually distinct and not clickable in reassign mode. No error toasts from trying to swap completed matches.

- **Task Status:** Planned

---

#### Task 3.2.2
- **Task ID:** P03-M02-T02
- **Task Description:**
  Handle the edge case where a user enters reassign mode, selects a team, then switches to a different group tab. The selected participant should be cleared when switching groups.

  **Add to the group tab click handler** (around line 474):
  ```javascript
  onClick={() => {
    setActiveGroupTab(index);
    setSelectedParticipant(null); // Clear selection when switching groups
  }}
  ```

  **Also add to the mobile dropdown** (around line 493):
  ```javascript
  onChange={(e) => {
    setActiveGroupTab(Number(e.target.value));
    setSelectedParticipant(null);
  }}
  ```

- **Expected Output:**
  Switching groups clears the selected participant. No stale selection across groups.

- **Task Status:** Planned
