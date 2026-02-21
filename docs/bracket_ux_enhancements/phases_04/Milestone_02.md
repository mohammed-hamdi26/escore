# Phase 04 — Mobile Responsiveness & Accessibility

## Milestone 02 — Touch-Friendly Interactions

### Milestone Objective

Ensure all interactive elements in the bracket management UI meet mobile touch target requirements (minimum 44px × 44px) and provide appropriate haptic/visual feedback for touch interactions.

### Milestone Status: Planned

---

### Task 04.02.01 — Increase Touch Target Sizes

**Task ID:** 04.02.01
**Task Description:**
Audit all interactive elements in bracket components and ensure minimum 44px × 44px touch targets on mobile.

Elements to audit and fix:

1. **Reorder arrow buttons** (CustomRoundCard, CustomMatchRow, SeedOrderManager):
   - Current: ~24-28px
   - Target: 44px × 44px with adequate spacing between up/down
2. **Delete buttons** (CustomRoundCard, CustomMatchRow):
   - Current: small icon button, hover-only
   - Target: 44px × 44px, always visible on mobile
3. **Add buttons** (Add Round, Add Match):
   - Current: varies
   - Target: 44px height minimum
4. **Score stepper buttons (+/-)** (MatchResultDialog):
   - Current: ~28px
   - Target: 44px × 44px
5. **Tab buttons** (group tabs, stage tabs):
   - Current: text-sized buttons
   - Target: 44px height minimum, adequate horizontal padding
6. **Dropdown menu items** (CustomRoundCard more-menu):
   - Current: standard dropdown size
   - Target: 44px height per menu item
7. **Team list items** (TeamAssignmentDialog):
   - Current: ~36px rows
   - Target: 48px minimum for comfortable tapping

For each element:
- Add `min-h-[44px] min-w-[44px]` where needed (mobile only via responsive classes)
- Add adequate spacing between adjacent touch targets (≥8px gap)
- Ensure icons inside buttons are centered

**Expected Output:**
- All interactive elements meet 44px minimum touch target on mobile
- Adequate spacing between adjacent interactive elements
- No accidental tap issues

**Task Status:** Planned

---

### Task 04.02.02 — Add Visual Tap Feedback

**Task ID:** 04.02.02
**Task Description:**
Add visual feedback for touch/click interactions on bracket elements that currently lack feedback.

Elements to enhance:

1. **Bracket type cards** (BracketTypeSelector):
   - Add `active:scale-[0.98]` and `active:bg-muted` for tap feedback
2. **Seed list items** (SeedOrderManager):
   - Add hover/active state: `hover:bg-muted/50 active:bg-muted`
3. **Custom match rows** (CustomMatchRow):
   - Entire row: subtle hover state `hover:bg-muted/30`
   - Team slots: `hover:bg-primary/5 active:bg-primary/10` with cursor pointer
   - Score area: `hover:bg-muted active:bg-muted/80` with cursor pointer
4. **Round cards** (CustomRoundCard):
   - Header area: hover state for clickability indication
5. **Team list items** (TeamAssignmentDialog):
   - Add `active:bg-primary/10` tap feedback
   - Add brief highlight animation on selection

Use Tailwind `transition-colors duration-150` for smooth state changes.

**Expected Output:**
- All tappable/clickable elements have visible hover/active states
- Smooth transitions between states
- Consistent feedback pattern across all bracket components

**Task Status:** Planned

---

### Task 04.02.03 — Replace Hover-Only Actions with Always-Visible

**Task ID:** 04.02.03
**Task Description:**
Replace hover-dependent UI elements with always-visible alternatives for mobile users who can't hover.

Elements to fix:

1. **Match delete button** (CustomMatchRow):
   - Current: only appears on row hover
   - Fix: always visible on mobile, hover-reveal on desktop
   - Implementation: `opacity-0 group-hover:opacity-100 sm:opacity-0 opacity-100` pattern — always visible on mobile, hover on desktop
   - Or: move to a more-menu (⋮) dropdown that's always visible

2. **Match reorder buttons** (CustomMatchRow):
   - Current: only visible on hover
   - Fix: always visible on mobile (compact arrows), hover-reveal on desktop
   - Same responsive opacity pattern

3. **Round menu button** (CustomRoundCard):
   - Current: dropdown trigger may be small
   - Fix: always visible ⋮ icon, 44px touch target

4. **Seed reorder arrows** (SeedOrderManager):
   - Current: small arrows
   - Fix: always visible, 44px targets

Implementation pattern:
```jsx
<div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
  {/* action buttons */}
</div>
```

**Expected Output:**
- All hover-dependent actions visible on mobile
- Hover-reveal preserved on desktop for clean aesthetics
- No hidden functionality on touch devices

**Task Status:** Planned
