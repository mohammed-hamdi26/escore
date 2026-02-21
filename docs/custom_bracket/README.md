# Custom Bracket — Dashboard UI Implementation Plan

## Overview

Implement the dashboard UI for managing **Custom Brackets** in tournaments. This feature allows admins to manually create bracket structures, assign teams via drag-and-drop, modify round/match structure freely, and manually set results — with no auto-advance or auto-calculation.

The **backend API** is already complete with 12 new endpoints under `/tournaments/:id/bracket/custom/`.

---

## Backend API Reference

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/bracket/generate` | Generate custom bracket (bracketType: `custom`) |
| POST | `/bracket/custom/rounds` | Add a round |
| PUT | `/bracket/custom/rounds/:round` | Update round name/bestOf |
| DELETE | `/bracket/custom/rounds/:round` | Delete a round |
| POST | `/bracket/custom/matches` | Add a match to a round |
| DELETE | `/bracket/custom/matches/:matchId` | Delete a match |
| PUT | `/bracket/custom/reorder` | Bulk reorder rounds & matches |
| PUT | `/bracket/custom/matches/:matchId/assign` | Assign team/player to slot |
| PUT | `/bracket/custom/bulk-assign` | Bulk assign teams |
| PUT | `/bracket/custom/matches/:matchId/result` | Set/clear match result |
| PUT | `/bracket/custom/matches/:matchId/link` | Link match progression |
| PUT | `/bracket/custom/complete` | Manually complete bracket |

---

## Dashboard Tech Stack

- **Framework:** Next.js 16 (App Router), JavaScript (no TypeScript)
- **UI:** shadcn/ui (new-york style), Tailwind CSS v4
- **Forms:** Formik + Yup
- **HTTP:** Axios via `apiClient` (server actions pattern)
- **i18n:** next-intl (en, ar)
- **Icons:** lucide-react

---

## Key Files to Modify

| File | Purpose |
|------|---------|
| `app/[locale]/_Lib/actions.js` | Server actions for custom bracket API calls |
| `components/Tournaments Management/BracketView.jsx` | Main bracket UI — generation form + visualization |
| `components/Tournaments Management/BracketMatchCard.jsx` | Match card display (may extend for custom) |
| `messages/en.json` | English translations |
| `messages/ar.json` | Arabic translations |

### New Files to Create

| File | Purpose |
|------|---------|
| `components/Tournaments Management/CustomBracketEditor.jsx` | Main custom bracket editing UI |
| `components/Tournaments Management/CustomRoundCard.jsx` | Round card with management controls |
| `components/Tournaments Management/CustomMatchRow.jsx` | Match row with team assignment + result entry |
| `components/Tournaments Management/TeamAssignmentDialog.jsx` | Modal for selecting team to assign |
| `components/Tournaments Management/MatchResultDialog.jsx` | Modal for entering match results |

---

## Phase Summary

| Phase | Name | Milestones | Tasks |
|-------|------|-----------|-------|
| 01 | Server Actions & API Layer | 2 | 11 |
| 02 | Bracket Generation Form | 2 | 12 |
| 03 | Custom Bracket Visualization & Editing | 3 | 17 |
| 04 | Team Assignment & Result Entry | 2 | 13 |
| 05 | Translations, Polish & Testing | 2 | 10 |
| **Total** | | **11** | **63** |

---

## Design Principles

1. **Follow existing patterns** — Use the same button styles, glass cards, status badges, and form layouts already in BracketView.jsx
2. **Inline editing** — Custom bracket should be editable directly in the bracket view (no separate pages)
3. **Optimistic UI** — Show loading states on actions, refresh bracket data after API calls
4. **Error resilience** — Show toast/error messages using the existing error display pattern
5. **Responsive** — Horizontal scrolling for bracket visualization (same pattern as existing brackets)
6. **No drag-drop library** — Use arrow buttons for reordering (matches the existing seed reordering pattern) unless user explicitly requests drag-drop
