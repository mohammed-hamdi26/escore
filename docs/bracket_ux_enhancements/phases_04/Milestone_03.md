# Phase 04 — Mobile Responsiveness & Accessibility

## Milestone 03 — Accessibility (a11y) Improvements

### Milestone Objective

Add essential accessibility support to bracket management components — semantic HTML, ARIA labels, keyboard navigation, and focus management. The bracket UI should be usable by keyboard-only users and compatible with screen readers.

### Milestone Status: Planned

---

### Task 04.03.01 — Add ARIA Labels to Interactive Elements

**Task ID:** 04.03.01
**Task Description:**
Add `aria-label`, `aria-labelledby`, and `role` attributes to all interactive elements in bracket components.

Elements to label:

1. **Bracket type cards** (BracketTypeSelector):
   - `role="radio"` + `aria-checked` + `aria-label="Select {type name} bracket type"`
   - Container: `role="radiogroup"` + `aria-label="Bracket type selection"`

2. **Seed reorder buttons** (SeedOrderManager):
   - Up arrow: `aria-label="Move {team name} up to seed {N-1}"`
   - Down arrow: `aria-label="Move {team name} down to seed {N+1}"`
   - List: `role="list"` + `aria-label="Seed order list"`

3. **Round reorder buttons** (CustomRoundCard):
   - Left arrow: `aria-label="Move round {name} left"`
   - Right arrow: `aria-label="Move round {name} right"`

4. **Match reorder buttons** (CustomMatchRow):
   - Up: `aria-label="Move match up"`
   - Down: `aria-label="Move match down"`

5. **Delete buttons** (CustomRoundCard, CustomMatchRow):
   - `aria-label="Delete round {name}"` / `aria-label="Delete match"`

6. **Score inputs** (MatchResultDialog):
   - `aria-label="{Team name} score"`
   - Stepper buttons: `aria-label="Increase {team name} score"` / `aria-label="Decrease {team name} score"`

7. **Status badges** (StatusBadge):
   - `aria-label="Bracket status: {status}"`

8. **Team slots** (CustomMatchRow):
   - `aria-label="Assign team to slot {1/2}. Currently: {team name or 'empty'}"`

**Expected Output:**
- All interactive elements have descriptive ARIA labels
- Roles correctly assigned (radiogroup, list, button, etc.)
- Screen reader can announce all actions and current state

**Task Status:** Planned

---

### Task 04.03.02 — Add Keyboard Navigation

**Task ID:** 04.03.02
**Task Description:**
Add keyboard navigation support for bracket management components.

Keyboard patterns:

1. **Bracket type selector:**
   - Arrow keys (←→↑↓) to navigate between type cards
   - Enter/Space to select highlighted card
   - Focus visible: ring outline on focused card

2. **Seed order list:**
   - Tab to focus the seed list
   - Arrow keys (↑↓) to navigate between seeds
   - Alt+↑ / Alt+↓ to reorder (move seed up/down)
   - Focus visible on active seed item

3. **Round list** (CustomBracketEditor):
   - Tab to focus round cards
   - Arrow keys (←→) to navigate between rounds
   - Enter to expand/focus round content

4. **Match list** (CustomRoundCard):
   - Tab into match list
   - Arrow keys (↑↓) to navigate matches
   - Enter to open match result dialog
   - Delete key to trigger delete confirmation

5. **Dialogs** (MatchResultDialog, TeamAssignmentDialog, ConfirmationDialog):
   - Focus trap: Tab cycles within dialog only
   - Escape to close
   - Enter to confirm/submit
   - Auto-focus on primary input when dialog opens

6. **Score inputs** (MatchResultDialog):
   - Tab between team1 score and team2 score
   - Arrow keys (↑↓) to increment/decrement
   - Enter to save

Implementation: use `onKeyDown` handlers and `tabIndex` attributes. Consider `@radix-ui/react-roving-focus` for list navigation (shadcn/ui uses Radix).

**Expected Output:**
- All major UI sections navigable via keyboard
- Focus visible indicators on all focused elements
- Focus trap in dialogs
- Arrow key navigation for lists and grids
- Keyboard shortcuts documented (optional tooltip on first use)

**Task Status:** Planned

---

### Task 04.03.03 — Add Focus Management in Dialogs

**Task ID:** 04.03.03
**Task Description:**
Ensure proper focus management when dialogs open, close, and during operations.

Focus rules:

1. **Dialog open:**
   - `MatchResultDialog`: auto-focus on team1 score input
   - `TeamAssignmentDialog`: auto-focus on search input
   - `ConfirmationDialog`: auto-focus on cancel button (safer default — prevents accidental confirm)

2. **Dialog close:**
   - Return focus to the element that triggered the dialog
   - E.g., clicking team slot opens TeamAssignmentDialog → closing returns focus to that team slot

3. **After operations:**
   - After adding a round: focus on the new round's name (or the new round card)
   - After adding a match: focus on the new match row
   - After deleting: focus on the adjacent item (previous item, or first item if deleted first)
   - After reordering: focus stays on the moved item at its new position

4. **Focus trap in dialogs:**
   - Tab should cycle within dialog content only
   - Shift+Tab should cycle backwards
   - shadcn/ui Dialog already handles this via Radix, but verify it works

Implementation:
- Use `useRef` to store trigger element reference
- Use `autoFocus` prop on initial focus target
- Use `onCloseAutoFocus` callback from Radix Dialog to restore focus

**Expected Output:**
- Dialogs auto-focus on appropriate element when opened
- Focus returns to trigger element when dialog closes
- Focus moves to logical next element after create/delete operations
- Focus trap works correctly in all dialogs

**Task Status:** Planned

---

### Task 04.03.04 — Add Screen Reader Announcements

**Task ID:** 04.03.04
**Task Description:**
Add live region announcements for dynamic content changes that screen readers need to know about.

Use `aria-live="polite"` regions for:

1. **Operation results:**
   - "Round {name} added" (after add round)
   - "Round {name} deleted" (after delete)
   - "Match added" (after add match)
   - "Match result saved: {team1} {score1} - {score2} {team2}" (after set result)
   - "Team {name} assigned to slot {N}" (after assignment)
   - "Bracket generated with {N} matches" (after generation)

2. **Status changes:**
   - "Bracket status changed to {status}" (when status updates)
   - "Round {N} generated with {M} matches" (after advancement)

3. **Validation messages:**
   - "Error: {field} — {message}" (when validation error appears)
   - "Validation errors cleared" (when errors are resolved)

Implementation:
- Create a shared `LiveRegion` component with `aria-live="polite"` and `role="status"`
- Pass announcement text via state or context
- Clear announcement after 3 seconds (screen readers read it immediately)
- Place `<LiveRegion>` at top level of bracket view

**Expected Output:**
- `LiveRegion` component for screen reader announcements
- All dynamic changes announced to screen readers
- Announcements are descriptive and concise
- No duplicate announcements

**Task Status:** Planned
