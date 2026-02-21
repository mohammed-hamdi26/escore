# Phase 05 — Visual Enhancements & Polish

## Milestone 01 — Bracket Visualization & Progress Indicators

### Milestone Objective

Add visual bracket diagrams and progress indicators that give users a clear picture of bracket structure, completion status, and overall tournament progress. Transform the text-based match display into something visually intuitive.

### Milestone Status: Planned

---

### Task 05.01.01 — Add Bracket Progress Summary Bar

**Task ID:** 05.01.01
**Task Description:**
Create a `BracketProgressBar.jsx` component that shows overall bracket completion progress.

The component should:
- Receive `bracket` object
- Calculate and display:
  - **Progress bar:** filled percentage = `completedMatches / totalMatches × 100`
  - **Text stats:** "{completed} of {total} matches completed ({percentage}%)"
  - **Round progress:** "Current: Round {N} of {totalRounds}" (for sequential bracket types)
  - **Status indicator:** colored dot + status text (Generated, In Progress, Completed)
- Visual style:
  - Horizontal progress bar with rounded corners
  - Color: primary color fill, muted background
  - Height: 6px (subtle but visible)
  - Stats text: muted color, small font (12px)
- Placement: below `BracketHeader`, above bracket content

Calculation per bracket type:
- **Single/Double Elimination:** count all matches across all rounds (winners + losers + grand_finals)
- **Round Robin:** count all matches across all groups and rounds
- **Swiss:** count matches in all rounds up to current round
- **Battle Royale:** count matches in all rounds
- **Multi-Stage:** show per-stage progress + overall across stages
- **Custom:** count all matches in all custom rounds

**Expected Output:**
- New file: `components/Tournaments Management/bracket-display/BracketProgressBar.jsx`
- Shows progress bar + stats below bracket header
- Accurate calculation for each bracket type
- Updates when bracket data changes

**Task Status:** Planned

---

### Task 05.01.02 — Add Round Progress Indicators to Display Components

**Task ID:** 05.01.02
**Task Description:**
Add per-round completion indicators to bracket display components (SingleElimDisplay, DoubleElimDisplay, SwissDisplay, etc.).

For each round column/section header, show:
- **Completion badge:** "{completed}/{total}" matches completed
- **Visual indicator:**
  - All complete: green checkmark + "Complete"
  - Some complete: orange clock + "{completed}/{total}"
  - None complete: gray circle + "Pending"
- **Round name + bestOf:** "Round 1 (Bo3)" with completion badge inline

Components to update:
1. `SingleElimDisplay` — round column headers
2. `DoubleElimDisplay` — round column headers for each bracket (winners, losers, GF)
3. `SwissDisplay` — round headers/tabs
4. `BattleRoyaleDisplay` — round headers
5. `RoundRobinDisplay` — round headers per group
6. Custom bracket rounds — already have this in `CustomRoundColumnWidget` (Flutter), replicate pattern in dashboard `CustomRoundCard`

**Expected Output:**
- Round-level completion badges on all display components
- Consistent visual language (green=complete, orange=partial, gray=pending)
- Match count shown per round

**Task Status:** Planned

---

### Task 05.01.03 — Add Empty State Illustrations

**Task ID:** 05.01.03
**Task Description:**
Create meaningful empty states for bracket-related screens that currently show blank areas or generic "no data" messages.

Empty states to create:

1. **No bracket generated (generation form view):**
   - Illustration: bracket tree outline (simple SVG)
   - Title: "No Bracket Generated"
   - Description: "Generate a bracket to create matches for this tournament. You'll need at least {min} teams."
   - CTA: "Generate Bracket" button (scrolls to form)

2. **Empty round (no matches):**
   - Text: "No matches in this round"
   - Small bracket icon
   - For custom brackets: "+ Add Match" button

3. **Empty group (round robin, no teams assigned):**
   - Text: "No teams assigned to this group"
   - CTA: "Assign Teams" button

4. **Swiss/BR no rounds generated yet:**
   - Text: "Waiting for first round"
   - Description: "Generate the bracket to create Round 1 matches"

5. **Multi-stage no stages configured:**
   - Text: "No stages configured"
   - CTA: "Add First Stage" button

6. **Team assignment search (no results):**
   - Text: "No teams match '{searchQuery}'"
   - CTA: "Clear search" link

Create a shared `EmptyState.jsx` component:
- Props: `icon` (React node), `title`, `description`, `actionLabel`, `onAction`
- Centered layout with icon, text, and optional button
- Muted colors, medium icon size (48px)

**Expected Output:**
- New file: `components/shared/EmptyState.jsx`
- 6 contextual empty states implemented across bracket components
- Each empty state has relevant icon, description, and action

**Task Status:** Planned

---

### Task 05.01.04 — Add Quick Stats Cards to Bracket Header

**Task ID:** 05.01.04
**Task Description:**
Add summary statistics cards to the bracket header area for at-a-glance tournament bracket information.

Create a `BracketQuickStats.jsx` component showing:

| Stat | Icon | Example |
|------|------|---------|
| Total Matches | `Swords` | "24 Matches" |
| Completed | `CheckCircle` | "18 Completed" |
| Remaining | `Clock` | "6 Remaining" |
| Teams/Players | `Users` | "16 Teams" |
| Current Round | `SkipForward` | "Round 3" |
| Bracket Type | `GitBranch` | "Double Elimination" |

Layout:
- **Desktop:** horizontal row of mini cards (4-6 across)
- **Tablet:** 3 per row, 2 rows
- **Mobile:** 2 per row, 3 rows
- Each card: icon + number + label, compact (48px height)
- Colors: muted background, primary icon, dark number

Show different stats based on bracket type:
- Single/Double Elim: matches, completed, remaining, teams, current round
- Swiss: rounds played, qualified, eliminated, active teams
- Battle Royale: rounds, lobbies, eliminated, remaining teams
- Custom: rounds, total matches, completed, teams

**Expected Output:**
- New file: `components/Tournaments Management/bracket-display/BracketQuickStats.jsx`
- 4-6 stat cards showing bracket overview
- Responsive grid layout
- Type-specific stats

**Task Status:** Planned
