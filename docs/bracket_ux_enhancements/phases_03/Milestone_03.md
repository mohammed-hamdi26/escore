# Phase 03 — Form Validation & Input UX

## Milestone 03 — Match Result Entry UX

### Milestone Objective

Improve the match result entry experience in `MatchResultDialog.jsx` and `TeamAssignmentDialog.jsx` — better score input, keyboard navigation, validation, and team search.

### Milestone Status: Planned

---

### Task 03.03.01 — Improve Score Input Controls

**Task ID:** 03.03.01
**Task Description:**
Enhance score input in `MatchResultDialog.jsx` for faster and more intuitive score entry.

Current issues:
- +/- buttons increment by 1 (tedious for large scores)
- Score input field accepts negative numbers
- No keyboard shortcuts

Improvements:
- **Score input field:**
  - `type="number"` with `min=0`, `max=99` attributes
  - Prevent negative values (clamp to 0 on blur)
  - Larger font size for score display (24px+)
  - Center-aligned number
- **Stepper buttons (+/-):**
  - Larger touch targets (40px × 40px)
  - Long-press to auto-increment (hold button to rapidly increase)
  - Disable minus at 0
- **Quick score buttons:** Add preset buttons below score input:
  - For Bo3: show "2-0", "2-1", "1-2", "0-2" as quick-select buttons
  - For Bo5: show "3-0", "3-1", "3-2", "2-3", "1-3", "0-3"
  - For Bo1: show "1-0", "0-1"
  - Clicking a preset fills both scores immediately
  - Only show presets when `bestOf` is known
- **Keyboard navigation:**
  - Tab moves between team1 score and team2 score fields
  - Enter submits the form
  - Escape closes the dialog
  - Up/Down arrows increment/decrement the focused score

**Expected Output:**
- Score inputs with min=0, max=99 constraints
- Quick score preset buttons based on bestOf value
- Larger touch targets on stepper buttons
- Keyboard shortcuts (Tab, Enter, Escape, Up/Down)
- No negative scores allowed

**Task Status:** Planned

---

### Task 03.03.02 — Add Score Validation Logic

**Task ID:** 03.03.02
**Task Description:**
Add client-side validation to match result entry in `MatchResultDialog.jsx`.

Validation rules:
- Both scores must be non-negative integers
- At least one score must be > 0 (can't save 0-0 as a result — or warn)
- **Best-of enforcement** (when bestOf is known):
  - In Bo3: max score is 2. If a team reaches 2, they win.
  - In Bo5: max score is 3.
  - In Bo{N}: max score is `ceil(N/2)`.
  - Validate that exactly one team has the winning score (unless override is set)
  - Warning (not error) if scores don't match bestOf format
- **Override winner:**
  - If override is toggled ON, a winner must be selected (show error if not)
  - If override is OFF, winner is auto-determined from scores
  - Show auto-determined winner label: "Winner: {team name}" based on higher score
- **Tie warning:**
  - If scores are equal and no override: show warning "Scores are tied. Select a winner using Override."

Display:
- `<InlineError>` below each score field for validation errors
- Warning banner for bestOf mismatches
- Auto-winner display

**Expected Output:**
- Score validation (non-negative, bestOf-aware)
- Auto-winner determination from scores
- Tie detection with guidance to use override
- Inline error messages and warnings

**Task Status:** Planned

---

### Task 03.03.03 — Improve Override Winner UX

**Task ID:** 03.03.03
**Task Description:**
Redesign the "Override Winner" UI in `MatchResultDialog.jsx` for clarity.

Current issues:
- Toggle shows/hides radio buttons (confusing — users don't expect hidden content)
- Radio button labels are team IDs, not team names
- No explanation of when to use override

Improvements:
- **Replace toggle + radio with a clearer pattern:**
  - Below the score inputs, show a "Winner" section:
    - Auto-detected winner based on scores (displayed by default)
    - "Override winner" link/button that expands to show team selection
  - When override is active:
    - Show team selector as two clickable cards (not radio buttons):
      - Team logo + name (large, clickable)
      - Selected card has primary color border + checkmark
      - Unselected card has muted border
    - Show "Auto (higher score)" option as third choice to go back to auto-detection
- **Helper text:**
  - "Winner is automatically determined by the higher score"
  - "Use override to manually set the winner (e.g., for walkovers or admin decisions)"
- **Visual indicator:**
  - When override is active: show warning badge "Manual override" near the winner display
  - When auto: show info badge "Auto-detected from score"

**Expected Output:**
- Winner section below scores with auto-detection display
- Override uses clickable team cards instead of radio buttons
- Helper text explaining auto vs. override
- Visual badges for auto vs. manual winner

**Task Status:** Planned

---

### Task 03.03.04 — Improve Team Assignment Dialog

**Task ID:** 03.03.04
**Task Description:**
Enhance `TeamAssignmentDialog.jsx` with better search, filtering, and visual feedback.

Current issues:
- Search is basic text match
- Large team lists not paginated
- Already-assigned teams not clearly distinguished
- No visual feedback on assignment

Improvements:
- **Search field:**
  - Auto-focus on dialog open
  - Search icon inside input (left side)
  - Clear button (X) inside input (right side) when text present
  - Case-insensitive matching (already works, just ensure)
  - Debounced search (150ms) for large lists
- **Team list:**
  - Show team logo + name + tag/abbreviation
  - **Already assigned** (to other slot in same match): show with reduced opacity + "Assigned to Slot {N}" label, not clickable
  - **Already used** (in another match in same round): show with yellow badge "In Match #{N}", still clickable (might be valid)
  - **Empty state:** "No teams match your search" with clear search button
  - **Scrollable list** with max height (300px) and scroll indicators (shadow at top/bottom)
- **Current assignment display:**
  - Show current team at top with prominent styling: logo + name + "Currently assigned" label
  - "Remove Assignment" button (red text) to unassign
- **Assignment feedback:**
  - On click: brief loading spinner, then close dialog + show toast
  - Optimistic UI: immediately show assignment in match row before API confirms

**Expected Output:**
- Auto-focus search with clear button
- Team list with assignment status indicators
- Empty search state
- Scrollable list with max height
- Assignment feedback (loading, toast)
- Current assignment display with remove option

**Task Status:** Planned

---

### Task 03.03.05 — Add Clear Result Confirmation

**Task ID:** 03.03.05
**Task Description:**
Add proper confirmation when clearing a match result in `MatchResultDialog.jsx`.

Current issues:
- "Clear Result" button exists but confirmation is minimal
- No information about what will be lost

Improvements:
- Use `<ConfirmationDialog>` (from Phase 01) for clear result:
  - Title: "Clear Match Result"
  - Description: "Remove the recorded result ({score1}-{score2}) for this match? The winner will be unset."
  - Include team names in the description if available
  - Red "Clear" button
  - Loading spinner during API call
- After clearing:
  - Reset score fields to 0-0
  - Clear override winner
  - Show success toast "Match result cleared"

**Expected Output:**
- Descriptive confirmation dialog for result clearing
- Shows current scores and team names in confirmation
- Loading state on clear button
- Success toast after clearing

**Task Status:** Planned
