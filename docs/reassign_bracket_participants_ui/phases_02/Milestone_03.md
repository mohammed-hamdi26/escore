# Phase 02 — Reassign UI in RoundRobinDisplay

## Milestone 03: Wire Up Selection Logic & API Call

### Milestone Objective
Implement the participant selection flow: first click selects, second click triggers the swap via the API, then refreshes the bracket.

### Milestone Status: Planned

---

### Tasks

#### Task 2.3.1
- **Task ID:** P02-M03-T01
- **Task Description:**
  Add the `handleParticipantClick` function to `RoundRobinDisplay` (after the existing `handleMatchClick`).

  **Logic:**
  ```javascript
  const handleParticipantClick = async (slotId, field, team) => {
    // If clicking the same participant → deselect
    if (selectedParticipant?.slotId === slotId && selectedParticipant?.field === field) {
      setSelectedParticipant(null);
      return;
    }

    // If no participant selected yet → select this one
    if (!selectedParticipant) {
      setSelectedParticipant({ slotId, field, team });
      return;
    }

    // Second participant clicked → perform swap
    setReassignLoading(true);
    try {
      const result = await reassignParticipantsAction(tournament.id, {
        slot1Id: selectedParticipant.slotId,
        slot1Field: selectedParticipant.field,
        slot2Id: slotId,
        slot2Field: field,
      });

      if (result.success) {
        toast.success(t("reassignSuccess"));
        if (onRefresh) onRefresh();
      } else {
        toast.error(result.error || t("reassignError"));
      }
    } catch (err) {
      toast.error(t("reassignError"));
    } finally {
      setReassignLoading(false);
      setSelectedParticipant(null);
    }
  };
  ```

- **Expected Output:**
  Selection logic implemented. First click highlights a team, second click calls the API and swaps the teams. Toast notifications show success/error. Bracket refreshes after successful swap.

- **Task Status:** Planned

---

#### Task 2.3.2
- **Task ID:** P02-M03-T02
- **Task Description:**
  Pass the new reassign props from `RoundRobinDisplay` through `RoundColumn` to `RRMatchCard`.

  **Update `RoundColumn` function signature** to accept and pass through reassign props:
  ```javascript
  function RoundColumn({ round, groupName, onMatchClick, t, reassignMode, selectedParticipant, onParticipantClick }) {
  ```

  **Update `RRMatchCard` rendering** inside `RoundColumn` (around line 344):
  ```jsx
  <RRMatchCard
    key={match.id}
    match={match}
    onClick={onMatchClick}
    t={t}
    reassignMode={reassignMode}
    selectedParticipant={selectedParticipant}
    onParticipantClick={onParticipantClick}
  />
  ```

  **Update the `RoundColumn` usage** in `RoundRobinDisplay` (around line 520):
  ```jsx
  <RoundColumn
    key={`${round.name}-${round.round}`}
    round={round}
    groupName={activeGroup.name}
    onMatchClick={tournament ? handleMatchClick : undefined}
    t={t}
    reassignMode={reassignMode}
    selectedParticipant={selectedParticipant}
    onParticipantClick={handleParticipantClick}
  />
  ```

- **Expected Output:**
  Props flow correctly from `RoundRobinDisplay` → `RoundColumn` → `RRMatchCard`. The reassign interaction works end-to-end.

- **Task Status:** Planned

---

#### Task 2.3.3
- **Task ID:** P02-M03-T03
- **Task Description:**
  Add a loading overlay when the reassign API call is in progress.

  When `reassignLoading` is true, show a subtle loading state:
  - Disable all team row clicks in `RRMatchCard` (pass `reassignLoading` as prop, disable `onParticipantClick` when true)
  - Show a small spinner or "Swapping..." text in the amber banner

  **Update the banner** (from Milestone 01 Task 2):
  ```jsx
  {reassignMode && (
    <div className="mb-3 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center gap-2">
      <ArrowLeftRight className={`size-4 text-amber-500 shrink-0 ${reassignLoading ? "animate-spin" : ""}`} />
      <span className="text-xs text-amber-500">
        {reassignLoading
          ? "..."
          : selectedParticipant
          ? `${t("reassignSelectSecond")} — ${selectedParticipant.team?.name}`
          : t("reassignSelectFirst")}
      </span>
      {selectedParticipant && !reassignLoading && (
        <button
          onClick={() => setSelectedParticipant(null)}
          className="ms-auto text-xs text-amber-500/70 hover:text-amber-500 underline"
        >
          {t("reassignCancel")}
        </button>
      )}
    </div>
  )}
  ```

- **Expected Output:**
  Loading state prevents double-clicks. Selected team name shown in banner. Spinner indicates in-progress swap.

- **Task Status:** Planned
