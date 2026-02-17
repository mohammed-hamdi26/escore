# Phase 03 — Battle Royale Bracket & Multi-Participant

## Milestone 02 — BR Round Advancement UI

### Objective

Add UI controls for advancing Battle Royale rounds. After all matches in the current round are completed, the admin can advance to the next round, which eliminates bottom teams and creates new round matches.

### Status: `Planned`

---

### Task 3.2.1 — Add "Advance Round" button to BR bracket view

- **Task ID:** 3.2.1
- **Description:** In the BR bracket view (from Task 3.1.4), add an "Advance to Next Round" button. This button should:
  - Be visible only when `bracketStatus === "in_progress"` or `"generated"`
  - Be disabled when the current round's matches are not all `"completed"`
  - Show the current round number and next round number (e.g., "Advance from Round 1 to Round 2")
  - On click, call `advanceBRRoundAction(tournamentId)` which hits `POST /tournaments/:id/bracket/advance-br-round`
  - Show loading spinner during the API call
  - On success, refresh the bracket data (new round appears with new matches)
  - On error, show error toast with the message

  Add `advanceBRRoundAction` to `actions.js` if not already present.
- **Expected Output:** A button that advances the BR bracket to the next round, creating new matches with surviving teams.
- **Status:** `Planned`

---

### Task 3.2.2 — Show elimination info after advancement

- **Task ID:** 3.2.2
- **Description:** After advancing a BR round, if teams were eliminated (per `eliminationRules`), show a notification or info banner indicating which teams were eliminated. This can be derived by comparing the participant lists between the last and new round — teams present in the old round but absent in the new round were eliminated.

  Alternatively, show elimination rules summary above the round: "After Round 2: Bottom 3 teams eliminated" with the eliminated teams listed.
- **Expected Output:** Admins can clearly see which teams were eliminated after each round advancement.
- **Status:** `Planned`

---

### Task 3.2.3 — Show bracket completion state

- **Task ID:** 3.2.3
- **Description:** When all BR rounds are completed (`bracketStatus === "completed"` or `currentBRRound >= totalRounds` and all matches completed):
  - Hide the "Advance Round" button
  - Show a "Bracket Completed" banner
  - Highlight the final standings (link to standings tab if available)
  - Show the winner (team with position 1 in final standings)
- **Expected Output:** Clear visual indication that the BR bracket is finished, with a summary of results.
- **Status:** `Planned`

---

### Task 3.2.4 — Handle round advancement errors

- **Task ID:** 3.2.4
- **Description:** Handle common error cases from the advance-br-round API:
  - "Not all matches in current round are completed" — Show which matches still need completion. Highlight incomplete matches in the bracket view.
  - "All rounds already completed" — Show the completion banner from Task 3.2.3.
  - "Tournament bracket type is not battle_royale" — Should not happen in the UI, but show a generic error.

  Display errors as toast notifications or inline error messages.
- **Expected Output:** All error cases are handled gracefully with clear, actionable messages.
- **Status:** `Planned`
