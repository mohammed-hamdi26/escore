# Phase 05 — Translations & Final Polish

## Milestone 02 — Server Actions & API Functions

### Objective

Add all new server actions to `actions.js` required by Phases 01-04. These server actions wrap API calls to the backend endpoints for BR bracket operations, participant result updates, and round advancement.

### Status: `Planned`

---

### Task 5.2.1 — Add BR bracket server actions

- **Task ID:** 5.2.1
- **Description:** In `app/[locale]/_Lib/actions.js`, add server actions for Battle Royale bracket operations:

  1. **`advanceBRRoundAction(tournamentId)`** — Calls `POST /tournaments/:tournamentId/bracket/advance-br-round`. Returns the updated bracket data with the new round's matches.

  2. **`generateBracketAction` update** — Verify the existing `generateBracketAction` correctly forwards `battleRoyaleConfig` when `bracketType === "battle_royale"`. The payload should include:
     ```
     {
       bracketType: "battle_royale",
       seeds: [...],
       battleRoyaleConfig: {
         totalRounds, teamsPerLobby, totalLobbies, eliminationRules
       }
     }
     ```
     If not already forwarding these fields, update the action.

  Both actions should use the existing `apiClient` pattern and handle errors consistently (return `{ success, data, message }`).
- **Expected Output:** Server actions for BR bracket generation and round advancement.
- **Status:** `Planned`

---

### Task 5.2.2 — Add participant results server actions

- **Task ID:** 5.2.2
- **Description:** In `actions.js`, add server actions for multi-participant match operations:

  1. **`updateParticipantResultsAction(matchId, participants)`** — Calls `PATCH /matches/:matchId/participants` with the participants array. Each participant object:
     ```
     {
       team: "TEAM_ID",        // or player: "PLAYER_ID"
       placement: 1,
       kills: 8,
       deaths: 2,
       assists: 5,
       points: 20,
       isEliminated: false,
       // Racing fields (only for racing tournaments):
       finishTimeMs: 93450,
       bestLapMs: 30200,
       totalLaps: 3,
       penaltyMs: 0,
       dnf: false,
       dsq: false
     }
     ```

  2. **`getMatchParticipantsAction(matchId)`** — Calls `GET /matches/:matchId` and extracts the `participants` array from the response. Used to pre-populate the participant editor form.

  Follow the existing action patterns in the file for error handling and response format.
- **Expected Output:** Server actions for reading and updating participant results.
- **Status:** `Planned`

---

### Task 5.2.3 — Add standings recalculation action

- **Task ID:** 5.2.3
- **Description:** In `actions.js`, add a server action for recalculating standings:

  **`recalculateStandingsAction(tournamentId)`** — Calls `POST /standings/tournament/:tournamentId/recalculate-from-matches`. This triggers the backend to recalculate all standings from match results, including racing aggregate fields.

  This action is used by:
  - The "Recalculate Standings" button in StandingsManagement
  - After bulk participant result updates
  - After BR round advancement (standings may auto-update, but a manual trigger is useful)

  Show loading state during the call and success/error toast after.
- **Expected Output:** A server action for triggering standings recalculation.
- **Status:** `Planned`

---

### Task 5.2.4 — Verify all existing actions forward new fields

- **Task ID:** 5.2.4
- **Description:** Audit existing server actions in `actions.js` to ensure they correctly handle the new fields:

  1. **`createTournamentAction`** — Must forward `competitionType`, `participationType`, `scoringType`, `standingConfig.placementConfig`, `standingConfig.killPoints`.
  2. **`updateTournamentAction`** — Must forward the same new fields.
  3. **`generateBracketAction`** — Must forward `battleRoyaleConfig` for BR brackets.
  4. **`updateMatchAction`** — Must handle `isMultiParticipant` and `participants` if sent.

  For each action, verify the payload is not stripping or filtering fields. If the actions use explicit field lists (destructuring), add the new fields. If they forward the entire payload object, no changes needed.
- **Expected Output:** All existing server actions correctly pass through new competition format fields.
- **Status:** `Planned`
