# Phase 01 — Component Architecture & Decomposition

## Milestone 03 — Extract Shared UI Primitives

### Milestone Objective

Extract commonly repeated UI patterns across bracket components into reusable primitives. This reduces duplication, ensures visual consistency, and makes future changes easier.

### Milestone Status: Planned

---

### Task 01.03.01 — Create ConfirmationDialog Component

**Task ID:** 01.03.01
**Task Description:**
Create a reusable `ConfirmationDialog.jsx` using shadcn/ui `AlertDialog` component, replacing all inline delete/destructive confirmation modals.

The component should:
- Props: `open`, `onOpenChange`, `title`, `description`, `confirmLabel` (default: "Confirm"), `cancelLabel` (default: "Cancel"), `onConfirm` (async callback), `variant` ("default" | "destructive"), `loading` (boolean)
- Use `AlertDialog` from shadcn/ui (`AlertDialogTrigger`, `AlertDialogContent`, `AlertDialogHeader`, etc.)
- Show loading spinner on confirm button when `loading` is true
- Destructive variant: red confirm button with warning icon
- Support translation via props (caller passes translated strings)

Replace all inline confirmation modals in:
- `BracketView.jsx` (delete bracket confirmation)
- `CustomRoundCard.jsx` (delete round confirmation)
- `CustomMatchRow.jsx` (delete match confirmation)
- `CustomBracketEditor.jsx` (complete bracket confirmation)

**Expected Output:**
- New file: `components/ui/ConfirmationDialog.jsx` (or `components/shared/ConfirmationDialog.jsx`)
- All 4 components use `<ConfirmationDialog>` instead of inline modals
- Consistent look and behavior across all confirmation dialogs

**Task Status:** Planned

---

### Task 01.03.02 — Create StatusBadge Component

**Task ID:** 01.03.02
**Task Description:**
Create a reusable `StatusBadge.jsx` for bracket/match/stage status indicators.

The component should:
- Props: `status` (string), `statusMap` (optional object mapping status → { label, color, icon })
- Default status maps:
  - **Bracket status:** not_generated (gray), generated (blue), in_progress (orange), completed (green)
  - **Match status:** scheduled (gray), live (red pulse), completed (green)
  - **Stage status:** pending (gray), active (blue), completed (green)
- Render a pill/badge with icon + translated label
- Support custom colors via `statusMap` prop override

Replace inline status badges in:
- `BracketHeader.jsx` (bracket status)
- `BracketMatchCard.jsx` (match status)
- `MultiStageDisplay.jsx` (stage status)
- `CustomBracketEditor.jsx` (bracket status in header)

**Expected Output:**
- New file: `components/shared/StatusBadge.jsx`
- Consistent status badge styling across all bracket components
- Color scheme unified

**Task Status:** Planned

---

### Task 01.03.03 — Create BestOfSelector Component

**Task ID:** 01.03.03
**Task Description:**
Create a reusable `BestOfSelector.jsx` for the "Best Of" dropdown used in multiple config components.

The component should:
- Props: `value` (number), `onChange` (callback), `label` (optional), `disabled`
- Render a shadcn/ui `Select` with options: Bo1, Bo3, Bo5, Bo7, Bo9, Bo11, Bo13, Bo15 (odd numbers 1-15)
- Display format: "Bo{N}" (e.g., "Bo3") or "Best of {N}"
- Optional label above the select

Replace inline best-of selects in:
- `SingleElimConfig.jsx`
- `DoubleElimConfig.jsx`
- `RoundRobinConfig.jsx`
- `SwissConfig.jsx`
- `CustomBracketConfig.jsx`
- `CustomRoundCard.jsx` (edit form)
- `MultiStageConfig.jsx` (per-stage config)

**Expected Output:**
- New file: `components/shared/BestOfSelector.jsx`
- All best-of dropdowns use this component
- Consistent options and styling

**Task Status:** Planned

---

### Task 01.03.04 — Create BestOfPerRoundEditor Component

**Task ID:** 01.03.04
**Task Description:**
Create a reusable `BestOfPerRoundEditor.jsx` for the per-round bestOf customization (used in multiple bracket type configs).

The component should:
- Props: `bestOfPerRound` (array of `{ stage, round, bestOf }`), `onChange`, `availableStages` (array of stage names like `["winners", "losers", "grand_finals"]`), `maxRounds` (per stage)
- Render:
  - **Expandable section** (collapsible) with "Customize Best Of per Round" header
  - **Stage filter** — dropdown to select which stage to edit (if multiple stages)
  - **Round rows** — for each round in selected stage, show round number + BestOfSelector
  - **Add/Remove** — add new round override, remove existing
- Default to collapsed (don't show full editor by default)

Replace inline bestOfPerRound editors in all config components where they appear.

**Expected Output:**
- New file: `components/shared/BestOfPerRoundEditor.jsx`
- All bracket config components that support `bestOfPerRound` use this editor
- Collapsible by default to reduce visual noise

**Task Status:** Planned
