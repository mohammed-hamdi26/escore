# Phase 03 — Battle Royale Bracket & Multi-Participant

## Milestone 01 — BR Bracket Type in BracketView

### Objective

Extend `BracketView.jsx` to support the `battle_royale` bracket type. Add BR-specific config fields to the bracket generation form (totalRounds, teamsPerLobby, eliminationRules) and render BR rounds as a vertical list of lobby matches instead of the tree-based bracket view.

### Status: `Planned`

---

### Task 3.1.1 — Add battle_royale option to bracket type selector

- **Task ID:** 3.1.1
- **Description:** In `BracketView.jsx`, add `"battle_royale"` as a new option in the bracket type selector (alongside single_elimination, double_elimination, round_robin, swiss). Label it "Battle Royale". Show it only when the tournament's `competitionType` is `"battle_royale"` or `"ffa"` (or always show it and let the user choose — match the existing pattern). When selected, show the BR-specific configuration fields instead of the standard bracket config.
- **Expected Output:** "Battle Royale" appears as a selectable bracket type. Selecting it changes the configuration panel.
- **Status:** `Planned`

---

### Task 3.1.2 — Add BR config fields to generation form

- **Task ID:** 3.1.2
- **Description:** When `bracketType === "battle_royale"` is selected in BracketView, render these configuration fields:

  1. **Total Rounds** — Number input, min 1, default 3. Maps to `battleRoyaleConfig.totalRounds`.
  2. **Teams per Lobby** — Number input, min 2, default 10. Maps to `battleRoyaleConfig.teamsPerLobby`.
  3. **Total Lobbies** — Number input, optional. If empty, auto-calculated from teams/teamsPerLobby. Maps to `battleRoyaleConfig.totalLobbies`.
  4. **Elimination Rules** — Dynamic list of rules. Each rule has:
     - "After Round" — number input (which round triggers elimination)
     - "Eliminate Bottom" — number input (how many teams to eliminate)
     - "Add Rule" / "Remove Rule" buttons
     Maps to `battleRoyaleConfig.eliminationRules: [{ afterRound, eliminateBottom }]`.

  These fields replace the standard bestOf/groups/swiss config when BR is selected.
- **Expected Output:** A complete BR configuration form with all fields needed for the `generateBracketAction` API call.
- **Status:** `Planned`

---

### Task 3.1.3 — Send battleRoyaleConfig in bracket generation

- **Task ID:** 3.1.3
- **Description:** Update the bracket generation handler in `BracketView.jsx` to include `battleRoyaleConfig` in the payload when `bracketType === "battle_royale"`. The payload shape:
  ```json
  {
    "bracketType": "battle_royale",
    "seeds": ["TEAM_1", "TEAM_2", ...],
    "battleRoyaleConfig": {
      "totalRounds": 3,
      "teamsPerLobby": 10,
      "totalLobbies": 2,
      "eliminationRules": [
        { "afterRound": 2, "eliminateBottom": 3 }
      ]
    }
  }
  ```
  Also update `generateBracketAction` in `actions.js` if it doesn't already forward all fields.
- **Expected Output:** Generating a BR bracket sends the correct payload. The backend creates round 1 matches and returns the bracket data.
- **Status:** `Planned`

---

### Task 3.1.4 — Render BR bracket rounds view

- **Task ID:** 3.1.4
- **Description:** When the bracket data has `bracketType === "battle_royale"`, render a BR-specific view instead of the tree bracket. The BR view shows:

  1. **Round tabs or vertical list** — Each round (from `brRounds` array) is a section/tab. Show round number and status.
  2. **Lobby cards** — Within each round, show each match as a "lobby card". Each lobby shows the `round` label (e.g., "BR Round 1 Lobby A") and a list of participants sorted by placement.
  3. **Participant list in lobby** — Each participant shows: position badge, team/player name, logo/photo, placement, kills, points. Use a compact table or list layout.
  4. **Current round highlight** — The current round (from `currentBRRound`) should be highlighted or auto-scrolled to.

  The `brRounds` response shape:
  ```json
  [
    { "round": 1, "matches": [...] },
    { "round": 2, "matches": [...] }
  ]
  ```
- **Expected Output:** A clear, round-by-round view of the BR bracket with lobby cards showing participant rankings.
- **Status:** `Planned`
