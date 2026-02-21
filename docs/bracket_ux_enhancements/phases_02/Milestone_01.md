# Phase 02 — Loading States, Error Handling & User Feedback

## Milestone 01 — Loading States & Skeleton Screens

### Milestone Objective

Add proper loading indicators to every async operation in the bracket management UI. Users should always have visual feedback that an operation is processing. Replace blank/flash states with skeleton loaders.

### Milestone Status: Planned

---

### Task 02.01.01 — Add Bracket Fetch Loading Skeleton

**Task ID:** 02.01.01
**Task Description:**
Replace the current "Loading bracket..." text with a proper skeleton screen when the bracket data is being fetched on initial page load.

Create a `BracketSkeleton.jsx` component that mimics the bracket layout:
- Skeleton header bar (type badge + status badge + delete button)
- Skeleton content area:
  - 3-4 skeleton columns (representing rounds)
  - Each column has 2-4 skeleton match cards (rectangle with rounded corners)
- Use shadcn/ui `Skeleton` component (`<Skeleton className="h-4 w-[200px]" />`)
- Animate with Tailwind `animate-pulse`

Integrate into `BracketView.jsx` (or the refactored orchestrator): when `loading` is true, show `<BracketSkeleton />` instead of the empty/text state.

**Expected Output:**
- New file: `components/Tournaments Management/BracketSkeleton.jsx`
- BracketView shows skeleton during initial fetch
- Smooth transition from skeleton to actual content (no flash)

**Task Status:** Planned

---

### Task 02.01.02 — Add Generation Button Loading State

**Task ID:** 02.01.02
**Task Description:**
Improve the "Generate Bracket" button to show a clear loading state during bracket generation.

Changes to `BracketGenerationForm.jsx`:
- When `generating` is true:
  - Disable the Generate button
  - Replace button text with spinner icon + "Generating..." (translated)
  - Disable all form inputs (bracket type selector, config fields, seed manager)
  - Add a subtle overlay or opacity reduction on the form body
- After generation completes:
  - On success: show brief success state (checkmark icon + "Bracket Generated!") for 1.5s
  - On error: restore form to editable state

**Expected Output:**
- Generate button shows spinner during generation
- Form inputs disabled during generation
- Clear success/error visual feedback after operation

**Task Status:** Planned

---

### Task 02.01.03 — Add Operation Spinners to Custom Bracket Actions

**Task ID:** 02.01.03
**Task Description:**
Add loading spinners to all custom bracket CRUD operations that currently only disable buttons.

Operations to enhance in `CustomBracketEditor.jsx`, `CustomRoundCard.jsx`, and `CustomMatchRow.jsx`:

1. **Add Round** — show spinner on "Add Round" button, disable form
2. **Edit Round** — show spinner on "Save" button in edit form
3. **Delete Round** — show spinner on "Delete" confirm button
4. **Reorder Round** — show spinner on arrow buttons being clicked (brief)
5. **Add Match** — show spinner on "+" button
6. **Delete Match** — show spinner on confirm button
7. **Reorder Match** — show spinner on arrow buttons
8. **Assign Team** — show spinner in TeamAssignmentDialog on team click
9. **Set Result** — show spinner on "Save Result" button in MatchResultDialog
10. **Complete Bracket** — show spinner on "Complete" confirm button

For each operation:
- Use `lucide-react` `Loader2` icon with `animate-spin` class
- Replace button text/icon with spinner during operation
- Disable the button during operation
- Restore after success or error

**Expected Output:**
- Every async operation shows a spinner on its trigger button
- No more "silent" operations where user can't tell if action is processing
- Consistent spinner style (Loader2 with animate-spin) across all operations

**Task Status:** Planned

---

### Task 02.01.04 — Add Round Advancement Loading States

**Task ID:** 02.01.04
**Task Description:**
Add loading states to Swiss, Battle Royale, and Multi-Stage round advancement operations.

Changes:

1. **Swiss Advance Round** (in `SwissDisplay.jsx`):
   - "Advance to Next Round" button: show spinner + "Advancing..." during operation
   - Disable all match cards in current round during advancement
   - Show brief success banner: "Round X generated with Y matches"

2. **Battle Royale Advance Round** (in `BattleRoyaleDisplay.jsx`):
   - Same pattern as Swiss
   - After advancement: show eliminated teams banner with team logos/names
   - Show new round match count

3. **Multi-Stage Advancement** (in `MultiStageDisplay.jsx`):
   - "Calculate Advancement" button: spinner + "Calculating..."
   - Advancement modal "Confirm & Generate" button: spinner + "Generating..."
   - After confirmation: auto-switch tab to the new stage

**Expected Output:**
- All advancement buttons show spinners during operation
- Success messages after advancement (round/stage generated)
- Match cards disabled during advancement to prevent edits

**Task Status:** Planned

---

### Task 02.01.05 — Add Delete Bracket Loading State

**Task ID:** 02.01.05
**Task Description:**
Improve the bracket delete flow with loading state and transition.

Changes to `BracketHeader.jsx`:
- "Delete Bracket" confirmation dialog: "Delete" button shows spinner + "Deleting..."
- After successful delete:
  - Brief transition animation (fade out bracket display)
  - Smooth fade-in of the generation form (bracket type selector)
  - Optional: show toast "Bracket deleted successfully"
- On error: show error in dialog, keep dialog open, restore button

**Expected Output:**
- Delete confirmation button shows spinner during operation
- Smooth visual transition from bracket view back to generation form
- Error handling keeps dialog open for retry

**Task Status:** Planned
