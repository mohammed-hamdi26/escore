# Phase 05 — Visual Enhancements & Polish

## Milestone 03 — Confirmation Dialogs & Destructive Action Safety

### Milestone Objective

Ensure all destructive actions have proper confirmation dialogs with contextual information. Prevent accidental data loss by requiring explicit user confirmation with clear descriptions of consequences.

### Milestone Status: Planned

---

### Task 05.03.01 — Enhance Delete Bracket Confirmation

**Task ID:** 05.03.01
**Task Description:**
Enhance the "Delete Bracket" confirmation in `BracketHeader.jsx` to be more informative and safe.

Current: Generic confirmation with minimal text.

Enhanced version using `<ConfirmationDialog>`:
- **Title:** "Delete Bracket" (translated)
- **Description:** Dynamic based on bracket state:
  - If `bracketStatus === "in_progress"`: "This bracket is currently in progress. Deleting it will permanently remove all {matchCount} matches, including {completedCount} completed matches with recorded results. This action cannot be undone."
  - If `bracketStatus === "completed"`: "This bracket is completed. Deleting it will permanently remove all {matchCount} matches and their results. This action cannot be undone."
  - If `bracketStatus === "generated"`: "Delete this bracket and all {matchCount} generated matches? This action cannot be undone."
- **Impact summary:** Show quick stats of what will be lost:
  - Total matches: {N}
  - Completed matches with results: {N}
  - Teams/players affected: {N}
- **Confirm button:** "Delete Bracket" (red, destructive variant)
- **Confirm input (extra safety for in_progress/completed):** Require user to type "DELETE" to confirm (prevents accidental clicks)
- **Loading state:** Spinner on confirm button during API call

**Expected Output:**
- Dynamic confirmation text based on bracket status
- Impact summary showing what will be lost
- Type-to-confirm for active/completed brackets
- Loading state on delete button

**Task Status:** Planned

---

### Task 05.03.02 — Add Advance Round Confirmation

**Task ID:** 05.03.02
**Task Description:**
Add confirmation dialogs before advancing rounds in Swiss and Battle Royale brackets.

Currently, "Advance to Next Round" executes immediately without confirmation.

**Swiss Advance Confirmation:**
- **Title:** "Advance to Round {N+1}"
- **Description:** "Generate Round {N+1} matches based on current standings. Teams with the same W-L record will be paired."
- **Pre-check:** Verify all current round matches are completed. If not:
  - Show warning: "{incompleteCount} matches in Round {N} are not yet completed"
  - Optionally allow advancing anyway (with checkbox: "I understand some matches are incomplete")
- **Info display:**
  - Teams qualified: {N} (reached winsToQualify)
  - Teams eliminated: {N} (reached lossesToEliminate)
  - Teams remaining: {N} (will play next round)
- **Confirm:** "Generate Round {N+1}"

**Battle Royale Advance Confirmation:**
- **Title:** "Advance to Round {N+1}"
- **Description:** "Generate Round {N+1} lobbies with remaining teams."
- **Pre-check:** Same as Swiss (verify all lobbies completed)
- **Info display:**
  - Elimination rule (if applicable): "After this round, bottom {X} teams will be eliminated"
  - Teams remaining: {N}
  - Lobbies to generate: {N}
  - Teams to be eliminated: {N} (based on elimination rules)
- **Eliminated teams preview:** If elimination rule applies, show which teams are at risk (bottom N in current standings)
- **Confirm:** "Generate Round {N+1}"

**Expected Output:**
- Confirmation dialog for Swiss round advancement with pre-checks
- Confirmation dialog for BR round advancement with elimination preview
- Incomplete match warning with option to proceed
- Stats display (qualified/eliminated/remaining)

**Task Status:** Planned

---

### Task 05.03.03 — Add Multi-Stage Advancement Safety Checks

**Task ID:** 05.03.03
**Task Description:**
Enhance multi-stage advancement flow with additional safety checks and clearer UI.

Current: Calculates proposal, shows modal, user confirms.

Enhancements:

1. **Pre-advancement validation:**
   - Check all matches in current stage are completed
   - If incomplete: show warning with incomplete match count
   - Block advancement if current stage has no results at all

2. **Advancement proposal enhancement:**
   - Show clear section: "Qualifying from: {stageName}" → "Advancing to: {nextStageName}"
   - Team cards: show team logo, name, qualification reason (e.g., "1st in Group A", "3W-0L")
   - Highlight teams that barely qualified (borderline)
   - Show teams that were eliminated with strikethrough

3. **Seed reorder improvement:**
   - Clear instruction: "Drag or use arrows to reorder seeds for the next stage"
   - Show proposed seed number (#1, #2, ...) updating live
   - "Reset to Default" button to undo manual reordering

4. **Confirm & Generate:**
   - Summary before confirming:
     - "{N} teams advancing to {stageName}"
     - "Bracket type: {type}"
     - "This will generate {expectedMatchCount} matches"
   - Loading state with progress text: "Generating {stageName}..."

**Expected Output:**
- Pre-advancement validation (incomplete match check)
- Enhanced proposal display with team details and qualification reasons
- Improved seed reorder UI with reset option
- Summary before final confirmation

**Task Status:** Planned

---

### Task 05.03.04 — Add Complete Bracket Confirmation Enhancement

**Task ID:** 05.03.04
**Task Description:**
Enhance the "Complete Bracket" confirmation in `CustomBracketEditor.jsx` to be more thorough.

Current: Simple "Are you sure?" confirmation.

Enhanced version:
- **Title:** "Mark Bracket as Completed"
- **Pre-checks:**
  - Count incomplete matches
  - If any incomplete: show warning "There are {N} matches without results. Are you sure you want to mark the bracket as completed?"
  - List incomplete matches by round: "Round 1: 2 incomplete, Round 2: 1 incomplete"
- **Description:**
  - If all complete: "All {totalMatches} matches have been completed. Mark the bracket as finished?"
  - If some incomplete: "Marking as completed will finalize the bracket even though {incompleteCount} matches have no results."
- **Impact:**
  - "Bracket status will change to 'Completed'"
  - "This can be visible to app users"
- **Confirm:** "Complete Bracket" (primary button, not destructive)
- **Loading state:** Spinner during API call

**Expected Output:**
- Pre-completion validation (incomplete match count)
- Per-round incomplete match breakdown
- Clear description of implications
- Loading state on confirm

**Task Status:** Planned

---

### Task 05.03.05 — Final Visual Consistency Polish

**Task ID:** 05.03.05
**Task Description:**
Final pass to ensure visual consistency across all bracket components.

Audit and fix:

1. **Button variants consistency:**
   - Primary actions (Generate, Save, Confirm): `variant="default"` — filled primary color
   - Secondary actions (Cancel, Close): `variant="ghost"` or `variant="outline"`
   - Destructive actions (Delete): `variant="destructive"` — red
   - Add actions (Add Round, Add Match): `variant="outline"` with plus icon

2. **Icon consistency:**
   - Use same icon library (lucide-react) throughout
   - Standardize icon sizes: 16px for inline, 20px for buttons, 24px for headers
   - Common icons:
     - Delete: `Trash2`
     - Add: `Plus`
     - Edit: `Pencil`
     - Reorder: `GripVertical` (handle), `ArrowUp`/`ArrowDown` (arrows)
     - Status: `CheckCircle` (completed), `Clock` (pending), `Play` (live)
     - Close: `X`
     - Menu: `MoreVertical`

3. **Spacing consistency:**
   - Section gaps: 24px (`gap-6`)
   - Card gaps: 16px (`gap-4`)
   - Inline element gaps: 8px (`gap-2`)
   - Padding: 16px (`p-4`) for cards, 24px (`p-6`) for sections

4. **Color consistency:**
   - Success states: green (matches Tailwind `green-500`)
   - Warning states: amber/orange (`amber-500`)
   - Error/destructive: red (`red-500`)
   - Info: blue (`blue-500`)
   - Muted text: `text-muted-foreground`
   - Borders: `border` (uses theme)

5. **Typography consistency:**
   - Section headers: `text-lg font-semibold`
   - Card titles: `text-sm font-medium`
   - Labels: `text-sm text-muted-foreground`
   - Badges: `text-xs font-medium`

**Expected Output:**
- Consistent button variants across all bracket components
- Unified icon usage (same library, same sizes)
- Consistent spacing and padding
- Consistent color scheme for states
- Consistent typography hierarchy
- No visual mismatches between bracket components

**Task Status:** Planned
