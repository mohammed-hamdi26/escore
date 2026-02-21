# Phase 04 — Mobile Responsiveness & Accessibility

## Milestone 01 — Responsive Layout Fixes

### Milestone Objective

Fix all responsive layout issues in bracket management components. The bracket UI should work well on mobile (< 640px), tablet (640-1024px), and desktop (> 1024px) viewports without horizontal overflow or cramped elements.

### Milestone Status: Planned

---

### Task 04.01.01 — Fix Bracket Type Selector Responsive Grid

**Task ID:** 04.01.01
**Task Description:**
Fix the bracket type selector grid in `BracketTypeSelector.jsx` to be responsive across all screen sizes.

Current issues:
- 2x3 grid (3 columns) wraps awkwardly on mobile
- Cards may be too narrow on small screens
- Description text truncates

Improvements:
- **Desktop (≥1024px):** 3 columns grid (`grid-cols-3`)
- **Tablet (≥640px):** 2 columns grid (`grid-cols-2`)
- **Mobile (<640px):** 1 column grid (`grid-cols-1`)
- Each card: min-height to prevent squishing, full-width on mobile
- Description text: 2-line clamp on mobile, full text on desktop
- Icon size: scale down slightly on mobile (20px → 16px)

Use Tailwind responsive classes: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3`

**Expected Output:**
- Bracket type grid adapts to 1/2/3 columns based on viewport
- Cards are readable at all sizes
- No horizontal overflow

**Task Status:** Planned

---

### Task 04.01.02 — Fix Custom Bracket Editor Mobile Layout

**Task ID:** 04.01.02
**Task Description:**
Fix the custom bracket editor layout in `CustomBracketEditor.jsx` and `CustomRoundCard.jsx` for mobile.

Current issues:
- Rounds are in horizontal scroll only (unusable on mobile — user must scroll right)
- Round cards have fixed width that exceeds mobile viewport
- Add round form doesn't adapt to narrow screens

Improvements:
- **Mobile (<640px):** Switch to **vertical stack** layout:
  - Rounds stack vertically (each round is full-width)
  - Round cards show as collapsible accordions (header with expand/collapse)
  - Matches stack vertically within expanded round
  - Add Round button at bottom (full-width)
- **Tablet (≥640px):** Horizontal scroll with wider cards (current behavior but improved)
- **Desktop (≥1024px):** Horizontal scroll (current behavior)
- **Round card width:**
  - Mobile: `w-full`
  - Tablet/Desktop: `min-w-[280px] max-w-[320px]`
- **Accordion on mobile:**
  - Round header shows: name, bestOf badge, match count, expand/collapse chevron
  - Tapping header expands/collapses match list
  - Only one round expanded at a time (optional — user preference)

Use Tailwind breakpoints and conditional rendering:
```jsx
const isMobile = useMediaQuery("(max-width: 639px)");
// Or use CSS-only approach with hidden/shown divs
```

**Expected Output:**
- Vertical accordion layout on mobile
- Horizontal scroll preserved on tablet/desktop
- Round cards full-width on mobile
- No horizontal overflow on any screen size

**Task Status:** Planned

---

### Task 04.01.03 — Fix Seed Order Manager Mobile Layout

**Task ID:** 04.01.03
**Task Description:**
Fix the seed order list in `SeedOrderManager.jsx` for mobile viewports.

Current issues:
- Flex row with seed number, team logo, name, and arrow buttons
- On narrow screens, team names truncate too aggressively or wrap
- Arrow buttons may overlap with team name

Improvements:
- **Mobile (<640px):**
  - Compact layout: seed number + team logo + truncated name (max 15 chars) on one line
  - Arrow buttons on right side, stacked vertically (up above down)
  - Touch-friendly arrow sizes (44px × 44px)
  - Alternative: swipe to reorder (stretch goal)
- **Tablet/Desktop:**
  - Current layout but with more spacing
  - Larger touch targets for arrows
- **Seed list container:**
  - Max height with scroll: `max-h-[400px] overflow-y-auto` on mobile (prevents page scroll lock)
  - Scroll shadow indicators at top/bottom when scrollable

**Expected Output:**
- Seed list readable and usable on mobile
- Touch-friendly arrow buttons (44px min)
- Max height with scroll on long lists
- No layout overflow

**Task Status:** Planned

---

### Task 04.01.04 — Fix Dialog/Modal Responsiveness

**Task ID:** 04.01.04
**Task Description:**
Fix all bracket-related dialogs/modals for mobile viewports.

Current issues:
- `MatchResultDialog` and `TeamAssignmentDialog` may exceed viewport width on mobile
- Dialog content doesn't scroll when taller than viewport
- Close/action buttons at bottom may be cut off

Improvements for all dialogs (`MatchResultDialog.jsx`, `TeamAssignmentDialog.jsx`, `ConfirmationDialog.jsx`):
- **Max width:** `max-w-lg` on desktop, `max-w-[calc(100vw-2rem)]` on mobile (16px padding each side)
- **Max height:** `max-h-[calc(100vh-2rem)]` with `overflow-y-auto` on content body (keep header/footer fixed)
- **Mobile bottom sheet pattern (optional):**
  - On mobile, dialogs slide up from bottom instead of centering
  - Rounded top corners, drag-to-close handle
  - Uses more of the screen height
- **Action buttons:**
  - Full-width on mobile (`w-full`)
  - Stack vertically on mobile if 2+ buttons
  - Sticky footer (action buttons always visible, content scrolls above)
- **Score inputs in MatchResultDialog:**
  - Larger on mobile (48px height instead of 36px)
  - Score number larger font (28px)
  - Stepper buttons larger (44px)

**Expected Output:**
- All dialogs fit within mobile viewport
- Content scrolls within dialog when exceeding viewport height
- Action buttons always visible (sticky footer)
- Larger touch targets on mobile

**Task Status:** Planned

---

### Task 04.01.05 — Fix Round Robin Group Tabs Responsiveness

**Task ID:** 04.01.05
**Task Description:**
Fix the round robin group tab navigation for mobile in `RoundRobinConfig.jsx` and `RoundRobinDisplay.jsx`.

Current issues:
- Group tabs are horizontal buttons that overflow on mobile
- Too many groups = tabs not visible without scrolling
- Active tab indicator may not be visible

Improvements:
- **Mobile (<640px):**
  - Replace tab bar with dropdown select: "Group A ▾" — tap to switch
  - Or: scrollable tab bar with scroll indicators (arrows at edges)
  - Show current group info: "Group A (4 teams)"
- **Tablet/Desktop:**
  - Horizontal tabs with scroll (current behavior improved)
  - Active tab: solid background with rounded corners
  - Tab badges: show team count per group
- **Both:**
  - Group count badge on the section header: "Groups (3)"
  - Currently active group name always visible

**Expected Output:**
- Mobile: dropdown selector or scrollable tabs for groups
- Tablet/Desktop: improved horizontal tabs
- Group count visible at all sizes
- No tab overflow issues

**Task Status:** Planned

---

### Task 04.01.06 — Fix Multi-Stage Tab Responsiveness

**Task ID:** 04.01.06
**Task Description:**
Fix the multi-stage tab navigation for mobile in `MultiStageConfig.jsx` and `MultiStageDisplay.jsx`.

Current issues:
- Stage tabs are horizontal buttons similar to group tabs
- With 3+ stages, tabs overflow on mobile
- No visual connection between stages (flow)

Improvements:
- **Mobile (<640px):**
  - Replace tabs with vertical stepper/timeline:
    - Each stage as a vertical step with: stage number, name, type badge, status indicator
    - Active stage expanded to show content
    - Completed stages collapsed with checkmark
    - Connected by vertical line (stepper pattern)
  - Or: dropdown select like group tabs
- **Tablet/Desktop:**
  - Horizontal tabs with improved styling
  - Stage flow indicator: arrows (→) between tabs
  - Status colors on tabs (gray=pending, blue=active, green=completed)
- **Both:**
  - Stage count in section header: "Stages (3)"
  - Progress: "Stage 1 of 3: Group Stage"

**Expected Output:**
- Mobile: vertical stepper or dropdown for stages
- Tablet/Desktop: horizontal tabs with flow arrows
- Status indicators on stage tabs
- No overflow issues

**Task Status:** Planned
