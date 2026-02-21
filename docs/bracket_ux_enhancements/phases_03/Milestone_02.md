# Phase 03 — Form Validation & Input UX

## Milestone 02 — Custom Bracket Input Improvements

### Milestone Objective

Improve input UX for custom bracket management — add round form, edit round form, round reordering, and match management. Make operations more discoverable and less error-prone.

### Milestone Status: Planned

---

### Task 03.02.01 — Improve Add Round Form UX

**Task ID:** 03.02.01
**Task Description:**
Enhance the "Add Round" form in `CustomBracketEditor.jsx` with better UX.

Current issues:
- Form is an inline collapsible with minimal styling
- No validation on round name (accepts empty string)
- BestOf field is a plain input without constraints

Improvements:
- **Slide-down animation** when form opens (Tailwind `transition-all` + `max-h-0` to `max-h-40`)
- **Round name input:**
  - Placeholder: "e.g., Quarter Finals, Week 1" (translated)
  - Auto-focus on open
  - Max length indicator: "12/100 characters"
  - Validation: non-empty, max 100 chars
  - InlineError below field
- **Best Of selector:** Use `<BestOfSelector>` component (from Phase 01 Milestone 03)
- **Buttons:**
  - "Add Round" (primary) — disabled if name is empty
  - "Cancel" (ghost) — collapses form and clears inputs
- **After adding:** Clear form, keep form open for adding another (with fresh inputs), show success toast
- **Keyboard:** Enter to submit, Escape to cancel

**Expected Output:**
- Animated add round form with validation
- Auto-focus, max length, placeholder text
- Enter/Escape keyboard shortcuts
- Form stays open after adding for quick successive adds
- Success toast on add

**Task Status:** Planned

---

### Task 03.02.02 — Improve Edit Round Inline Form

**Task ID:** 03.02.02
**Task Description:**
Enhance the inline edit form in `CustomRoundCard.jsx` with better UX.

Current issues:
- Edit mode replaces card header with bare inputs
- No visual distinction between view mode and edit mode
- No cancel without saving option (must click outside)

Improvements:
- **Visual mode switch:** Edit mode shows a bordered form area with light background (e.g., `bg-muted/50` with `border-dashed`)
- **Round name input:** Same validation as add form (non-empty, max 100)
- **Best Of selector:** Use `<BestOfSelector>`
- **Buttons:** "Save" (primary, small) + "Cancel" (ghost, small) — inline at form bottom
- **Keyboard:** Enter to save, Escape to cancel
- **Prevent accidental loss:** If user clicks outside with unsaved changes, show brief warning or revert
- **Loading state:** Save button shows spinner during API call

**Expected Output:**
- Clear visual distinction between view and edit modes
- Input validation with inline errors
- Save/Cancel buttons with keyboard shortcuts
- Loading spinner on save

**Task Status:** Planned

---

### Task 03.02.03 — Improve Round Reorder UX

**Task ID:** 03.02.03
**Task Description:**
Make round reordering more intuitive and discoverable in `CustomBracketEditor.jsx` and `CustomRoundCard.jsx`.

Current issues:
- Reorder arrows are small and only visible on hover
- No visual feedback during reorder
- Users don't know they can reorder

Improvements:
- **Always-visible reorder handle:** Show a drag-handle icon (⠿ or grip dots) on the left side of round card header
- **Arrow buttons always visible** (not hover-only) — up and down arrows in round header
- **Reorder feedback:**
  - During reorder API call: show brief transition animation (card slides to new position)
  - After reorder: show subtle flash/highlight on the moved card
- **Disabled state:** Disable up on first round, down on last round (already done, but make visually clearer — gray out vs. hide)
- **Touch-friendly:** Arrows should be ≥ 44px touch target on mobile
- **Tooltip:** "Move round left" / "Move round right" on arrow buttons

**Expected Output:**
- Always-visible reorder controls (not hover-dependent)
- Visual transition feedback during reorder
- Touch-friendly arrow sizes (≥ 44px)
- Tooltips on reorder buttons

**Task Status:** Planned

---

### Task 03.02.04 — Improve Match Reorder UX

**Task ID:** 03.02.04
**Task Description:**
Make match reordering more intuitive within rounds in `CustomMatchRow.jsx`.

Current issues:
- Match reorder arrows only visible on hover
- No visual feedback during reorder

Improvements:
- **Always-visible controls:** Show up/down arrows on left side of match row (not hover-dependent)
- **Match number indicator:** Show match number badge (#1, #2, #3) on left edge of row
- **Reorder feedback:** Brief flash/highlight on moved match
- **Disabled states:** Up disabled on first match, down disabled on last match
- **Touch-friendly:** ≥ 44px touch targets
- **Keyboard:** Consider arrow key shortcuts when match row is focused (stretch goal)

**Expected Output:**
- Always-visible match reorder controls
- Match number badges
- Visual transition on reorder
- Touch-friendly sizes

**Task Status:** Planned

---

### Task 03.02.05 — Improve Delete Round/Match Confirmations

**Task ID:** 03.02.05
**Task Description:**
Enhance delete confirmations for rounds and matches to be more informative and safe.

Current issues:
- Delete round confirmation has generic text
- Delete match confirmation is minimal
- No information about what will be lost

Improvements:
- **Delete Round** (`CustomRoundCard.jsx`):
  - Use `<ConfirmationDialog>` (from Phase 01)
  - Title: "Delete Round: {roundName}"
  - Description: "This will permanently delete this round and its {matchCount} matches. Teams assigned to these matches will be unassigned."
  - Show match count in description
  - Red "Delete Round" button
- **Delete Match** (`CustomMatchRow.jsx`):
  - Use `<ConfirmationDialog>`
  - Title: "Delete Match"
  - Description: conditional:
    - If match has teams: "Delete the match between {team1} and {team2}?"
    - If match has result: "Delete this match? The recorded result ({score1}-{score2}) will be lost."
    - If empty match: "Delete this empty match?"
  - Red "Delete" button
- Both: show spinner on confirm button during API call

**Expected Output:**
- Contextual delete confirmation messages (include round name, match count, team names, scores)
- Uses `<ConfirmationDialog>` component
- Loading state on delete button
- Red destructive styling

**Task Status:** Planned
