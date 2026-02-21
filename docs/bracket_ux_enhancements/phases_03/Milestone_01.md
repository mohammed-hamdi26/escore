# Phase 03 — Form Validation & Input UX

## Milestone 01 — Generation Form Validation

### Milestone Objective

Add real-time client-side validation to the bracket generation form so users get immediate feedback before submitting. Prevent invalid submissions entirely and guide users to fix issues.

### Milestone Status: Planned

---

### Task 03.01.01 — Add Seed Count Validation

**Task ID:** 03.01.01
**Task Description:**
Add real-time validation for the minimum seed/team count in `BracketGenerationForm.jsx` (or `SeedOrderManager.jsx`).

Validation rules:
- **All types except Battle Royale:** minimum 2 teams/players
- **Battle Royale:** minimum 3 teams/players
- Show inline error below seed list: "At least {min} teams required. Currently: {count}"
- Disable Generate button if seed count is below minimum
- Show visual indicator: red count badge when below minimum, green when valid

The seed list should come from the tournament's teams/players. If tournament has fewer than minimum, show guidance: "Add more teams to this tournament before generating a bracket."

**Expected Output:**
- Seed count validated in real-time
- Generate button disabled when insufficient teams
- Clear error message with current count vs. required minimum
- Guidance when tournament needs more teams

**Task Status:** Planned

---

### Task 03.01.02 — Add Round Robin Group Validation

**Task ID:** 03.01.02
**Task Description:**
Add real-time validation for Round Robin group configuration in `RoundRobinConfig.jsx`.

Validation rules:
- At least 1 group required
- Each group needs a name (non-empty string, max 100 chars)
- Each group needs at least 2 teams
- No team can appear in multiple groups
- All teams should be assigned to a group (warning, not error)
- Show group-level errors below each group panel
- Show summary: "X of Y teams assigned" with progress indicator

Visual feedback:
- Groups with errors: red border
- Groups valid: green checkmark
- Unassigned teams: highlighted in the available teams list
- Duplicate team: red highlight on both groups containing it

**Expected Output:**
- Group name validation (non-empty, max length)
- Group team count validation (min 2)
- Duplicate team detection across groups
- Unassigned team warning with visual highlight
- Per-group error display

**Task Status:** Planned

---

### Task 03.01.03 — Add Swiss Config Validation

**Task ID:** 03.01.03
**Task Description:**
Add real-time validation for Swiss System configuration in `SwissConfig.jsx`.

Validation rules:
- `totalRounds`: must be 1-20, integer
- `winsToQualify`: must be 1-20, integer, must be ≤ `totalRounds`
- `lossesToEliminate`: must be 1-20, integer, must be ≤ `totalRounds`
- `winsToQualify + lossesToEliminate` should be ≤ `totalRounds + 1` (logical constraint — can't qualify AND eliminate if insufficient rounds)
- Show inline errors below each field
- Show logical warning: "With {totalRounds} rounds, teams can have at most {totalRounds} wins. Wins to qualify ({winsToQualify}) may be unreachable." (when `winsToQualify > totalRounds`)

Input constraints:
- Number inputs with `min`, `max`, `step=1` attributes
- Prevent non-numeric input
- +/- stepper buttons

**Expected Output:**
- All Swiss config fields validate in real-time
- Logical cross-field validation (wins + losses vs total rounds)
- Inline error messages below each field
- Input constraints prevent invalid values

**Task Status:** Planned

---

### Task 03.01.04 — Add Battle Royale Config Validation

**Task ID:** 03.01.04
**Task Description:**
Add real-time validation for Battle Royale configuration in `BattleRoyaleConfig.jsx`.

Validation rules:
- `totalRounds`: must be 1-30, integer
- `teamsPerLobby`: must be 2-100, integer, must be ≤ total teams
- `totalLobbies`: optional, 1-20, integer
- Elimination rules:
  - `afterRound`: must be 1 to `totalRounds`, integer
  - `eliminateBottom`: must be ≥ 1, integer
  - `afterRound` values must be unique (can't have two rules for same round)
  - `afterRound` values should be in ascending order
  - Warning if total eliminated > total teams - 2 (must keep at least 2 teams)
- Show inline errors below each field
- Elimination rules: per-rule error display

Visual feedback:
- Show team distribution preview: "{totalTeams} teams ÷ {teamsPerLobby} per lobby = {lobbies} lobbies"
- Show elimination impact: "After all rules: {remaining} teams remain"

**Expected Output:**
- All BR config fields validate in real-time
- Cross-field validation (afterRound uniqueness, elimination count vs total teams)
- Distribution preview calculation
- Per-rule error display in elimination rules list

**Task Status:** Planned

---

### Task 03.01.05 — Add Multi-Stage Config Validation

**Task ID:** 03.01.05
**Task Description:**
Add real-time validation for Multi-Stage configuration in `MultiStageConfig.jsx`.

Validation rules:
- At least 2 stages required
- Each stage needs:
  - `name`: non-empty string (max 100)
  - `bracketType`: must be selected (not empty)
  - `stageOrder`: auto-calculated, no user input needed
- Advancement rules (all stages except the last):
  - Must have an advancement rule set
  - `count`: must be ≥ 1, integer
  - `top_n_per_group` only valid for stages with round_robin type
- Per-stage config validation: delegate to the appropriate config component's validation (e.g., SwissConfig validation for swiss stages)
- Warning on last stage: "Last stage doesn't need an advancement rule" (clear if set)

Visual feedback:
- Stage tabs: show validation error icon (red dot) on tabs with issues
- Per-stage error list in active tab
- Progress indicator: "Stage {X} of {total}: {status}"

**Expected Output:**
- Stage count validation (min 2)
- Per-stage field validation (name, type, advancement rule)
- Cross-stage validation (advancement rule type matches bracket type)
- Tab-level error indicators
- Delegated validation to type-specific config components

**Task Status:** Planned

---

### Task 03.01.06 — Add Generate Button Validation Gate

**Task ID:** 03.01.06
**Task Description:**
Aggregate all validation results to control the Generate button state in `BracketGenerationForm.jsx`.

Implementation:
- Create a `useFormValidation` custom hook or validation function that:
  - Collects validation results from all active sub-components
  - Returns `{ isValid: boolean, errors: object, firstError: string }`
- Generate button behavior:
  - **Disabled** when `isValid === false`
  - Show tooltip on disabled button: "Fix {count} issues before generating"
  - On hover over disabled button: show summary of all validation errors
- When user clicks Generate on a valid form:
  - Run final validation check (defensive)
  - If valid: proceed with generation
  - If invalid: show all errors and scroll to first error field

**Expected Output:**
- Generate button disabled when form has validation errors
- Tooltip on disabled button showing error count
- Scroll-to-first-error on attempted submission
- All validation aggregated in one place

**Task Status:** Planned
