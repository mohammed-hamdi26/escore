# Phase 01 — Component Architecture & Decomposition

## Milestone 01 — Extract Bracket Generation Form Components

### Milestone Objective

Decompose the bracket generation form (currently ~1,200 lines inside `BracketView.jsx`) into focused sub-components. Each bracket type's configuration panel becomes its own component. The parent `BracketView.jsx` becomes a thin orchestrator that delegates to these sub-components.

### Milestone Status: Planned

---

### Task 01.01.01 — Create BracketTypeSelector Component

**Task ID:** 01.01.01
**Task Description:**
Extract the bracket type selection grid (currently a 2x3 card grid inside BracketView.jsx) into a standalone `BracketTypeSelector.jsx` component.

The component should:
- Receive `selectedType`, `onTypeChange`, and `isMultiStage` as props
- Render all 7 bracket type cards (single_elimination, double_elimination, round_robin, swiss, battle_royale, multi_stage, custom) in a responsive grid (3 columns desktop, 2 columns tablet, 1 column mobile)
- Each card shows: icon, translated name (from `useTranslations("TournamentDetails")`), and short description
- Highlight selected card with primary color border
- Include a toggle/checkbox for "Multi-Stage" mode that switches to multi_stage type

Find the current bracket type selection UI in `BracketView.jsx` (look for the grid rendering bracket type cards with `bracketType` state), extract it, and replace the inline code with `<BracketTypeSelector />`.

**Expected Output:**
- New file: `components/Tournaments Management/BracketTypeSelector.jsx`
- `BracketView.jsx` imports and uses `<BracketTypeSelector>` instead of inline grid
- No functional change — same visual appearance and behavior

**Task Status:** Planned

---

### Task 01.01.02 — Create SeedOrderManager Component

**Task ID:** 01.01.02
**Task Description:**
Extract the seed ordering list (draggable team/player list with up/down arrow buttons) into a standalone `SeedOrderManager.jsx` component.

The component should:
- Receive `seeds` (array of teams/players), `onSeedsChange` callback, and `participationType` ("team" or "player") as props
- Render a numbered list (#1, #2, ...) with team/player name and logo/avatar
- Each item has up/down arrow buttons to reorder (existing behavior)
- Disable up arrow on first item, down arrow on last item
- Show seed count badge (e.g., "8 Teams" or "16 Players")
- Use `useTranslations("TournamentDetails")` for all labels

Find the current seed reordering UI in `BracketView.jsx` (look for `seeds` state and arrow button handlers that swap items), extract it, and replace with `<SeedOrderManager />`.

**Expected Output:**
- New file: `components/Tournaments Management/SeedOrderManager.jsx`
- `BracketView.jsx` uses `<SeedOrderManager>` instead of inline seed list
- Same reordering behavior preserved

**Task Status:** Planned

---

### Task 01.01.03 — Create SingleElimConfig Component

**Task ID:** 01.01.03
**Task Description:**
Extract the Single Elimination configuration fields into `SingleElimConfig.jsx`.

The component should:
- Receive `config` object (`{ bestOf, autoAdvance, bestOfPerRound }`) and `onConfigChange` callback
- Render:
  - **Default Best Of** — select/dropdown with odd numbers 1-15 (Bo1, Bo3, Bo5...)
  - **Auto Advance** — toggle switch with label
  - **Best Of Per Round** — expandable section to customize per-round bestOf values (existing logic that builds `bestOfPerRound` array entries for `winners` stage)
- Use translations for all labels

Find the single elimination config section in `BracketView.jsx` (rendered when `bracketType === "single_elimination"` and `!isMultiStage`), extract it.

**Expected Output:**
- New file: `components/Tournaments Management/bracket-config/SingleElimConfig.jsx`
- `BracketView.jsx` conditionally renders `<SingleElimConfig>` for single elimination type
- Same fields, same behavior

**Task Status:** Planned

---

### Task 01.01.04 — Create DoubleElimConfig Component

**Task ID:** 01.01.04
**Task Description:**
Extract the Double Elimination configuration fields into `DoubleElimConfig.jsx`.

The component should:
- Receive `config` object (`{ bestOf, autoAdvance, grandFinalsReset, bestOfPerRound }`) and `onConfigChange`
- Render:
  - **Default Best Of** — select (odd 1-15)
  - **Auto Advance** — toggle
  - **Grand Finals Reset** — toggle with explanation tooltip ("If losers bracket winner wins GF1, play GF2")
  - **Best Of Per Round** — expandable section with stage selector (winners/losers/grand_finals) and per-round bestOf
- Use translations

Find the double elimination config section in `BracketView.jsx` (rendered when `bracketType === "double_elimination"`), extract it.

**Expected Output:**
- New file: `components/Tournaments Management/bracket-config/DoubleElimConfig.jsx`
- `BracketView.jsx` renders `<DoubleElimConfig>` for double elimination
- Same fields, same behavior

**Task Status:** Planned

---

### Task 01.01.05 — Create RoundRobinConfig Component

**Task ID:** 01.01.05
**Task Description:**
Extract the Round Robin configuration (groups management) into `RoundRobinConfig.jsx`.

The component should:
- Receive `config` object (`{ bestOf, groups, bestOfPerRound }`), `onConfigChange`, `availableTeams` (teams not yet assigned to any group), and `participationType`
- Render:
  - **Default Best Of** — select
  - **Groups List** — tabs or accordion for each group with:
    - Group name input
    - Team/player assignment area (add/remove from group)
    - Available teams list (teams not in any group)
  - **Add Group** button
  - **Remove Group** button (with confirmation if group has teams)
  - **Best Of Per Round** — expandable section for `group_stage` stage

Find the round robin config in `BracketView.jsx` (rendered when `bracketType === "round_robin"` — includes group tabs with `activeGroupTab` state, team assignment to groups), extract it.

**Expected Output:**
- New file: `components/Tournaments Management/bracket-config/RoundRobinConfig.jsx`
- `BracketView.jsx` renders `<RoundRobinConfig>` for round robin
- Group management logic moved to new component (including `activeGroupTab` state)

**Task Status:** Planned

---

### Task 01.01.06 — Create SwissConfig Component

**Task ID:** 01.01.06
**Task Description:**
Extract the Swiss System configuration into `SwissConfig.jsx`.

The component should:
- Receive `config` object (`{ bestOf, swissConfig: { totalRounds, winsToQualify, lossesToEliminate }, bestOfPerRound }`) and `onConfigChange`
- Render:
  - **Default Best Of** — select
  - **Total Rounds** — number input (1-20)
  - **Wins to Qualify** — number input (1-20)
  - **Losses to Eliminate** — number input (1-20)
  - **Best Of Per Round** — expandable for `swiss` stage
- Use translations (keys already exist: `swissRounds`, `winsToQualify`, `lossesToEliminate`)

Find the swiss config section in `BracketView.jsx` (rendered when `bracketType === "swiss"`), extract it.

**Expected Output:**
- New file: `components/Tournaments Management/bracket-config/SwissConfig.jsx`
- `BracketView.jsx` renders `<SwissConfig>` for swiss type
- Same fields, same behavior

**Task Status:** Planned

---

### Task 01.01.07 — Create BattleRoyaleConfig Component

**Task ID:** 01.01.07
**Task Description:**
Extract the Battle Royale configuration into `BattleRoyaleConfig.jsx`.

The component should:
- Receive `config` object (`{ battleRoyaleConfig: { totalRounds, teamsPerLobby, totalLobbies, eliminationRules } }`) and `onConfigChange`
- Render:
  - **Total Rounds** — number input (1-30)
  - **Teams Per Lobby** — number input (2-100)
  - **Total Lobbies** — optional number input (1-20)
  - **Elimination Rules** — dynamic list with add/remove:
    - Each rule: `afterRound` (number), `eliminateBottom` (number)
    - Add Rule / Remove Rule buttons
- Use translations (keys exist: `brConfiguration`, `teamsPerLobby`, etc.)

Find the battle royale config in `BracketView.jsx` (rendered when `bracketType === "battle_royale"` — includes `brConfig` state with elimination rules array), extract it.

**Expected Output:**
- New file: `components/Tournaments Management/bracket-config/BattleRoyaleConfig.jsx`
- `BracketView.jsx` renders `<BattleRoyaleConfig>` for battle royale
- Elimination rules dynamic list moved to new component

**Task Status:** Planned

---

### Task 01.01.08 — Create MultiStageConfig Component

**Task ID:** 01.01.08
**Task Description:**
Extract the Multi-Stage configuration into `MultiStageConfig.jsx`.

The component should:
- Receive `config` object (`{ stages }`) and `onConfigChange`
- Render:
  - **Stages Tab Bar** — horizontal tabs for each stage (with add/remove stage buttons)
  - **Active Stage Panel** — for each stage:
    - Stage name input
    - Stage bracket type selector (all types except `multi_stage`)
    - `isVisibleInApp` toggle
    - Advancement rule config (`top_n_per_group` or `top_n_overall` with count)
    - Type-specific config (reuse SingleElimConfig, DoubleElimConfig, etc. for each stage's type)
  - **Stage Order** — automatic numbering (0, 1, 2...)
- Manage `activeStageTab` state internally
- Use translations (keys exist: `multiStage`, `stageConfiguration`, etc.)

Find the multi-stage config in `BracketView.jsx` (rendered when `isMultiStage === true` — includes `stages` state, `activeStageTab`, stage-specific configuration panels), extract it. This is the most complex extraction.

**Expected Output:**
- New file: `components/Tournaments Management/bracket-config/MultiStageConfig.jsx`
- `BracketView.jsx` renders `<MultiStageConfig>` when `isMultiStage` is true
- Stage tab management and per-stage config moved to new component
- Can reuse other config components (SingleElimConfig, SwissConfig, etc.) for each stage's type

**Task Status:** Planned

---

### Task 01.01.09 — Create CustomBracketConfig Component

**Task ID:** 01.01.09
**Task Description:**
Extract the Custom bracket generation config (rounds count + default bestOf) into `CustomBracketConfig.jsx`.

The component should:
- Receive `config` object (`{ rounds, bestOf }`) and `onConfigChange`
- Render:
  - **Number of Initial Rounds** — number input (1-50) with label
  - **Default Best Of** — select (odd 1-15)
  - Helpful note explaining that rounds/matches can be added after generation

Find the custom bracket config in `BracketView.jsx` (rendered when `bracketType === "custom"` — includes `customRounds` and `customBestOf` state), extract it.

**Expected Output:**
- New file: `components/Tournaments Management/bracket-config/CustomBracketConfig.jsx`
- `BracketView.jsx` renders `<CustomBracketConfig>` for custom type
- Same fields, same behavior

**Task Status:** Planned

---

### Task 01.01.10 — Assemble BracketGenerationForm Component

**Task ID:** 01.01.10
**Task Description:**
Create a `BracketGenerationForm.jsx` that assembles all extracted config components into a unified generation form. This component replaces the entire generation form section in `BracketView.jsx`.

The component should:
- Receive `tournament` object (with teams/players, participationType), `onGenerate` callback (async), and `generating` state
- Manage local form state:
  - `bracketType` (selected type)
  - `seeds` (ordered team/player list)
  - Type-specific config (delegated to sub-components)
- Render in order:
  1. `<BracketTypeSelector>` — type selection
  2. `<SeedOrderManager>` — seed ordering
  3. Conditional config component based on type (SingleElimConfig, DoubleElimConfig, etc.)
  4. **Generate Button** — calls `onGenerate` with assembled payload
- Build the correct API payload based on type (currently split across BracketView.jsx)
- Show `generating` spinner state on button

Replace the entire generation form block in `BracketView.jsx` with `<BracketGenerationForm>`. After this task, `BracketView.jsx` should only handle: fetch bracket, show generation form OR show bracket display, delete bracket.

**Expected Output:**
- New file: `components/Tournaments Management/BracketGenerationForm.jsx`
- `BracketView.jsx` reduced by ~1,200 lines (generation form logic removed)
- `BracketView.jsx` passes `tournament` and `onGenerate` handler to `<BracketGenerationForm>`
- All generation flows still work identically

**Task Status:** Planned
