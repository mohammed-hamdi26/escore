# Phase 02 — Reassign UI in RoundRobinDisplay

## Milestone 02: Make RRMatchCard Interactive in Reassign Mode

### Milestone Objective
Modify the `RRMatchCard` component to support participant-level click handling when in reassign mode. Each team row becomes individually clickable.

### Milestone Status: Planned

---

### Tasks

#### Task 2.2.1
- **Task ID:** P02-M02-T01
- **Task Description:**
  Add new props to `RRMatchCard` for reassign mode support. The component currently accepts `{ match, onClick, t }`.

  **New props:**
  - `reassignMode: boolean` — whether reassign mode is active
  - `selectedParticipant: object|null` — the currently selected participant `{ slotId, field, team }`
  - `onParticipantClick: (slotId, field, team) => void` — callback when a team is clicked in reassign mode

  **Updated function signature** (around line 170):
  ```javascript
  function RRMatchCard({ match, onClick, t, reassignMode, selectedParticipant, onParticipantClick }) {
  ```

  **Modify the component behavior:**
  - When `reassignMode` is true, clicking the whole card should NOT trigger `onClick` (match result dialog)
  - Instead, each team row should be individually clickable via `onParticipantClick`
  - The `_slotId` property is available on match objects (added by `bracket-slot-utils.js`)

  **Replace the outer div's onClick behavior:**
  ```javascript
  const canClick = !reassignMode && onClick && (t1 || t2);
  ```

  **Make each team row clickable in reassign mode.** Replace the Team 1 div (around line 214):
  ```jsx
  <div
    className={`flex items-center justify-between px-3 py-2.5 ${
      isT1Winner ? "bg-green-500/10" : ""
    } ${
      reassignMode && t1 ? "cursor-pointer hover:bg-amber-500/10 transition-colors" : ""
    } ${
      selectedParticipant?.slotId === match._slotId && selectedParticipant?.field === "participant1"
        ? "ring-2 ring-amber-500 bg-amber-500/15"
        : ""
    }`}
    onClick={reassignMode && t1 && onParticipantClick
      ? (e) => { e.stopPropagation(); onParticipantClick(match._slotId, "participant1", t1); }
      : undefined}
  >
  ```

  **Same for Team 2 div** (around line 252):
  ```jsx
  <div
    className={`flex items-center justify-between px-3 py-2.5 ${
      isT2Winner ? "bg-green-500/10" : ""
    } ${
      reassignMode && t2 ? "cursor-pointer hover:bg-amber-500/10 transition-colors" : ""
    } ${
      selectedParticipant?.slotId === match._slotId && selectedParticipant?.field === "participant2"
        ? "ring-2 ring-amber-500 bg-amber-500/15"
        : ""
    }`}
    onClick={reassignMode && t2 && onParticipantClick
      ? (e) => { e.stopPropagation(); onParticipantClick(match._slotId, "participant2", t2); }
      : undefined}
  >
  ```

- **Expected Output:**
  In reassign mode, each team row in `RRMatchCard` is individually clickable with amber hover/selection highlight. The selected participant has an amber ring. Normal match click (result dialog) is disabled during reassign mode.

- **Task Status:** Planned
