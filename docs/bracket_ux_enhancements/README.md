# Bracket Management UX Enhancements

## Overview

Comprehensive UX improvement plan for the bracket management system in the escore-dashboard. The current system supports 7 bracket types (Single Elimination, Double Elimination, Round Robin, Swiss, Battle Royale, Multi-Stage, Custom) but suffers from a monolithic 2,476-line `BracketView.jsx` component, missing loading/error states, poor mobile responsiveness, and lack of input validation feedback.

## Current State Analysis

### Files Involved

| File | Lines | Purpose |
|------|-------|---------|
| `BracketView.jsx` | 2,476 | Main bracket component (generation form + display — monolithic) |
| `CustomBracketEditor.jsx` | 244 | Custom bracket round/match CRUD |
| `CustomRoundCard.jsx` | 342 | Individual round card with menu/edit/delete |
| `CustomMatchRow.jsx` | 311 | Match row with team assignment & result entry |
| `MatchResultDialog.jsx` | 342 | Score entry modal |
| `TeamAssignmentDialog.jsx` | ~150 | Team/player selection modal |
| `BracketMatchCard.jsx` | 214 | Read-only match display card |
| `bracketApi.js` | 116 | HTTP API client methods |
| `actions.js` (lines 1382-1747) | ~365 | Server actions for bracket operations |

### Key Pain Points

1. **Monolithic BracketView.jsx** — 2,476 lines, 40+ useState hooks, mixed concerns
2. **No loading states** — Users can't tell if operations are processing
3. **Generic error messages** — Raw server errors shown to users (e.g., `body.bestOfPerRound[0].stage - must be integer`)
4. **Poor mobile UX** — Horizontal scroll unusable, buttons too small, modals overflow
5. **No input validation feedback** — Negative scores accepted, no min/max enforcement
6. **Missing empty states** — Blank areas with no guidance
7. **No visual bracket tree** — Text-based cards only, no SVG bracket visualization
8. **Hard-coded strings** — "BYE", "TBD", "Click to assign" not translated
9. **No confirmations with context** — Delete actions lack detail (e.g., "Delete 5 matches?")
10. **Reordering not intuitive** — Arrow buttons only on hover, no drag-and-drop

## Plan Structure

### Phase 01 — Component Architecture & Decomposition
Break the monolithic `BracketView.jsx` into focused, reusable sub-components.

- **Milestone 01:** Extract Bracket Generation Form Components
- **Milestone 02:** Extract Bracket Display Components
- **Milestone 03:** Extract Shared UI Primitives

### Phase 02 — Loading States, Error Handling & User Feedback
Add proper loading indicators, user-friendly error messages, and success feedback.

- **Milestone 01:** Loading States & Skeleton Screens
- **Milestone 02:** Error Handling & User-Friendly Messages
- **Milestone 03:** Success Feedback & Toast Notifications

### Phase 03 — Form Validation & Input UX
Add real-time validation, input constraints, and improved form interactions.

- **Milestone 01:** Generation Form Validation
- **Milestone 02:** Custom Bracket Input Improvements
- **Milestone 03:** Match Result Entry UX

### Phase 04 — Mobile Responsiveness & Accessibility
Fix mobile layout issues, improve touch targets, and add accessibility support.

- **Milestone 01:** Responsive Layout Fixes
- **Milestone 02:** Touch-Friendly Interactions
- **Milestone 03:** Accessibility (a11y) Improvements

### Phase 05 — Visual Enhancements & Polish
Add bracket visualization, improve styling consistency, and polish the UI.

- **Milestone 01:** Bracket Visualization & Progress Indicators
- **Milestone 02:** I18n Completeness & Hard-Coded Strings
- **Milestone 03:** Confirmation Dialogs & Destructive Action Safety

## Execution Order

```
Phase 01 (Foundation)
  └── Must complete first — all subsequent phases depend on the new component structure

Phase 02 (Feedback)        Phase 03 (Validation)
  └── Can run in parallel    └── Can run in parallel

Phase 04 (Mobile/a11y)
  └── After Phase 02 & 03 (needs final component structure)

Phase 05 (Polish)
  └── Last — final layer of enhancements
```

## Technology Stack

- **Framework:** Next.js 16 (App Router, JavaScript — no TypeScript)
- **UI Library:** shadcn/ui (Radix primitives)
- **Styling:** Tailwind CSS
- **I18n:** next-intl (messages/en.json, messages/ar.json)
- **State:** React 19 useState + server actions
- **Icons:** lucide-react
