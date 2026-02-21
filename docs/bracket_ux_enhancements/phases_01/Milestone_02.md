# Phase 01 — Component Architecture & Decomposition

## Milestone 02 — Extract Bracket Display Components

### Milestone Objective

Decompose the bracket display section of `BracketView.jsx` (the view shown when a bracket already exists) into focused display components. Each bracket type gets its own display component. The goal is to reduce `BracketView.jsx` to a thin router that shows either the generation form or the appropriate display component.

### Milestone Status: Planned

---

### Task 01.02.01 — Create BracketHeader Component

**Task ID:** 01.02.01
**Task Description:**
Extract the bracket header bar (shown when a bracket exists) into `BracketHeader.jsx`.

The component should:
- Receive `bracket` object, `onDelete` callback, and `deleting` boolean
- Render:
  - **Bracket type badge** — colored label showing type name (translated)
  - **Bracket status badge** — colored pill (not_generated=gray, generated=blue, in_progress=orange, completed=green)
  - **Total teams/players count**
  - **Delete Bracket button** — red outline button with trash icon
  - **Confirmation dialog** — "Are you sure? This will delete all X matches" (currently inline in BracketView)
- Manage `showDeleteConfirm` state internally

Find the bracket header area in `BracketView.jsx` (rendered when `bracket` exists — includes bracket type label, status, delete button and confirmation modal), extract it.

**Expected Output:**
- New file: `components/Tournaments Management/bracket-display/BracketHeader.jsx`
- `BracketView.jsx` uses `<BracketHeader>` when bracket exists
- Delete confirmation dialog moved to new component

**Task Status:** Planned

---

### Task 01.02.02 — Create SingleElimDisplay Component

**Task ID:** 01.02.02
**Task Description:**
Extract the Single Elimination bracket display into `SingleElimDisplay.jsx`.

The component should:
- Receive `bracket` object (with `rounds.winners` array)
- Render rounds as columns (left to right: Round 1 → Quarter Finals → Semi Finals → Finals)
- Each round column shows `BracketMatchCard` components for each match
- Show round headers with round name and bestOf indicator
- Handle BYE matches (grayed out or with "BYE" label)
- Horizontal scroll container for overflow on smaller screens

Find the single elimination display in `BracketView.jsx` (rendered when `bracket.bracketType === "single_elimination"` and bracket exists — shows winners rounds with match cards), extract it.

**Expected Output:**
- New file: `components/Tournaments Management/bracket-display/SingleElimDisplay.jsx`
- Renders winners bracket rounds with match cards
- Reuses existing `BracketMatchCard.jsx`

**Task Status:** Planned

---

### Task 01.02.03 — Create DoubleElimDisplay Component

**Task ID:** 01.02.03
**Task Description:**
Extract the Double Elimination bracket display into `DoubleElimDisplay.jsx`.

The component should:
- Receive `bracket` object (with `rounds.winners`, `rounds.losers`, `rounds.grandFinals`)
- Render three sections with tab navigation or stacked layout:
  1. **Winners Bracket** — rounds as columns with match cards
  2. **Losers Bracket** — rounds as columns with match cards
  3. **Grand Finals** — GF1 and optional GF2 (reset match)
- Section headers with match counts
- Grand Finals Reset indicator (GF2 badge)

Find the double elimination display in `BracketView.jsx` (rendered when `bracket.bracketType === "double_elimination"` — shows winners/losers/grand finals sections), extract it.

**Expected Output:**
- New file: `components/Tournaments Management/bracket-display/DoubleElimDisplay.jsx`
- Three-section layout for winners/losers/grand finals
- Reuses `BracketMatchCard.jsx`

**Task Status:** Planned

---

### Task 01.02.04 — Create RoundRobinDisplay Component

**Task ID:** 01.02.04
**Task Description:**
Extract the Round Robin bracket display into `RoundRobinDisplay.jsx`.

The component should:
- Receive `bracket` object (with `groups` array, each containing name and rounds)
- Render:
  - **Group tabs** — clickable tabs for each group (Group A, Group B, ...)
  - **Round list** — for selected group, show rounds with match cards
  - **Match cards** — reuse `BracketMatchCard` for each match
- Manage `activeGroupTab` state internally

Find the round robin display in `BracketView.jsx` (rendered when `bracket.bracketType === "round_robin"` — shows group tabs and matches per group/round), extract it.

**Expected Output:**
- New file: `components/Tournaments Management/bracket-display/RoundRobinDisplay.jsx`
- Group tab navigation with match cards per round
- `activeGroupTab` state moved from BracketView to this component

**Task Status:** Planned

---

### Task 01.02.05 — Create SwissDisplay Component

**Task ID:** 01.02.05
**Task Description:**
Extract the Swiss System bracket display into `SwissDisplay.jsx`.

The component should:
- Receive `bracket` object (with `swissRounds`, `currentSwissRound`, `swissConfig`), `onAdvanceRound` callback, and `advancing` boolean
- Render:
  - **Round tabs or timeline** — show all rounds with current round highlighted
  - **Match cards** — for selected/current round
  - **Team status badges** — qualified (green), eliminated (red), active (default)
  - **Advance to Next Round button** — enabled only when all current round matches are completed
  - **Swiss standings summary** — W-L records per team

Find the swiss display in `BracketView.jsx` (rendered when `bracket.bracketType === "swiss"` — shows rounds, advance button, team records), extract it.

**Expected Output:**
- New file: `components/Tournaments Management/bracket-display/SwissDisplay.jsx`
- Round display with advance functionality
- Team status tracking (qualified/eliminated/active)

**Task Status:** Planned

---

### Task 01.02.06 — Create BattleRoyaleDisplay Component

**Task ID:** 01.02.06
**Task Description:**
Extract the Battle Royale bracket display into `BattleRoyaleDisplay.jsx`.

The component should:
- Receive `bracket` object (with `brRounds`, `currentBRRound`, `battleRoyaleConfig`), `onAdvanceRound` callback, and `advancing` boolean
- Render:
  - **Round selector** — tabs or dropdown for each round
  - **Lobby cards** — for each lobby in selected round, show participants with placement/kills/points
  - **Eliminated teams banner** — show teams eliminated after the round
  - **Advance to Next Round button** — enabled when all lobbies completed
  - **Cumulative standings** — running total of points across rounds

Find the battle royale display in `BracketView.jsx` (rendered when `bracket.bracketType === "battle_royale"` — shows round lobbies, participant results, elimination), extract it.

**Expected Output:**
- New file: `components/Tournaments Management/bracket-display/BattleRoyaleDisplay.jsx`
- Lobby-based display with participant results
- Round advancement with elimination rules

**Task Status:** Planned

---

### Task 01.02.07 — Create MultiStageDisplay Component

**Task ID:** 01.02.07
**Task Description:**
Extract the Multi-Stage bracket display into `MultiStageDisplay.jsx`.

The component should:
- Receive `bracket` object (with `stages` array), `tournament` object, callbacks for stage advancement (`onCalculateAdvancement`, `onConfirmAdvancement`), and related state (`advancementProposal`, `showAdvancementModal`)
- Render:
  - **Stage tabs** — horizontal tabs for each stage with status indicators (completed, active, pending)
  - **Active stage content** — render the appropriate display component based on stage bracket type (delegates to SingleElimDisplay, RoundRobinDisplay, etc.)
  - **Advancement modal** — proposal review with seed reordering before confirmation
  - **Stage visibility toggle** — eye icon to toggle `isVisibleInApp` per stage
- Manage `activeStageTab` state internally

Find the multi-stage display in `BracketView.jsx` (rendered when `bracket.bracketType === "multi_stage"` — shows stage tabs, per-stage bracket display, advancement modal), extract it.

**Expected Output:**
- New file: `components/Tournaments Management/bracket-display/MultiStageDisplay.jsx`
- Stage tab navigation, per-stage display delegation
- Advancement proposal modal with seed reordering
- Reuses other display components per stage type

**Task Status:** Planned

---

### Task 01.02.08 — Refactor BracketView as Thin Orchestrator

**Task ID:** 01.02.08
**Task Description:**
After all generation form and display components are extracted, refactor `BracketView.jsx` to be a thin orchestrator component (~200-300 lines max).

The refactored `BracketView.jsx` should:
- **State:** Only manage `bracket`, `loading`, `error`, `generating`, `deleting`
- **Fetch bracket** on mount via `useEffect`
- **Route to view:**
  - No bracket → `<BracketGenerationForm>` (from Milestone 01)
  - Bracket exists → `<BracketHeader>` + appropriate display component based on `bracket.bracketType`
  - Custom bracket → `<BracketHeader>` + `<CustomBracketEditor>` (existing, already extracted)
- **Handle callbacks:**
  - `onGenerate` → call `generateBracketAction`, update bracket state
  - `onDelete` → call `deleteBracketAction`, clear bracket state
  - `onAdvanceRound` → call appropriate advance action
- **Error boundary** — catch and display errors

Verify all flows work:
1. Generate each bracket type (all 7)
2. View existing brackets
3. Delete bracket
4. Swiss/BR advance round
5. Multi-stage advancement
6. Custom bracket CRUD

**Expected Output:**
- `BracketView.jsx` reduced from ~2,476 lines to ~200-300 lines
- All bracket flows still functional
- Clean separation: form logic in `BracketGenerationForm`, display in type-specific components
- No regressions in any bracket operation

**Task Status:** Planned
