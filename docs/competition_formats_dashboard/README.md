# Competition Formats — Dashboard Updates

## Overview

Update the Escore Dashboard to fully support the backend Competition Formats feature (Phases 01-03). The backend now supports: competition types (standard, battle_royale, fighting, racing, ffa, sports_sim), participation types (team vs player), multi-participant matches, placement scoring, Battle Royale brackets, and racing/time-based results.

The dashboard must be updated across tournament forms, match views, bracket management, standings tables, and all related components.

## Reference

- Backend Flutter Guide: `escore-backend/docs/FLUTTER_COMPETITION_FORMATS.md`
- Backend Execution State: `escore-backend/docs/competition_formats/EXECUTION_STATE.md`

---

## Phase Overview

| Phase | Name | Scope | Status |
|-------|------|-------|--------|
| **01** | Tournament Form & Core Fields | Add `competitionType`, `participationType`, player selection, conditional form logic | Planned |
| **02** | Placement Scoring & Standing Config | `scoringType` toggle, placement config editor, cumulative standings columns, round history | Planned |
| **03** | Battle Royale Bracket & Multi-Participant | BR bracket type in BracketView, BR round advancement, multi-participant match display, participant results editor | Planned |
| **04** | Racing / Time-Based UI | Time fields in participant editor, racing standings display, time formatting utilities | Planned |
| **05** | Translations & Final Polish | en/ar translation keys, filter/table updates, end-to-end integration testing | Planned |

---

## Phase-Milestone Map

### Phase 01 — Tournament Form & Core Fields
| Milestone | Name |
|-----------|------|
| 01 | Competition Type Field |
| 02 | Participation Type & Player Selection |
| 03 | Tournament Table & Filter Updates |
| 04 | Tournament Detail View Updates |

### Phase 02 — Placement Scoring & Standing Config
| Milestone | Name |
|-----------|------|
| 01 | Scoring Type Toggle in Tournament Form |
| 02 | Placement Config Editor |
| 03 | Cumulative Standings Table |
| 04 | Round History Display |

### Phase 03 — Battle Royale Bracket & Multi-Participant
| Milestone | Name |
|-----------|------|
| 01 | BR Bracket Type in BracketView |
| 02 | BR Round Advancement UI |
| 03 | Multi-Participant Match Display |
| 04 | Participant Results Editor |

### Phase 04 — Racing / Time-Based UI
| Milestone | Name |
|-----------|------|
| 01 | Time Fields in Participant Editor |
| 02 | Racing Standings Display |
| 03 | Time Formatting Utility |

### Phase 05 — Translations & Final Polish
| Milestone | Name |
|-----------|------|
| 01 | Translation Keys (en + ar) |
| 02 | Server Actions & API Functions |
| 03 | Final Integration & Verification |

---

## Key Files Affected

| File | Phase(s) |
|------|----------|
| `components/Tournaments Management/TournamentsForm.jsx` | 01, 02 |
| `components/Tournaments Management/TournamentsTable.jsx` | 01 |
| `components/Tournaments Management/TournamentsFilter.jsx` | 01 |
| `components/Tournaments Management/TournamentDetails.jsx` | 01, 02 |
| `components/Tournaments Management/BracketView.jsx` | 03 |
| `components/Tournaments Management/BracketMatchCard.jsx` | 03 |
| `components/Tournaments Management/StandingsManagement.jsx` | 02, 04 |
| `components/Matches Management/MatchFormRedesign.jsx` | 03 |
| `components/Matches Management/MatchDetails.jsx` | 03, 04 |
| `components/Matches Management/MatchesTable.jsx` | 03 |
| `components/Standings/TournamentStandings.jsx` | 02, 04 |
| `app/[locale]/_Lib/actions.js` | 05 |
| `messages/en.json` | 05 |
| `messages/ar.json` | 05 |

---

## Dependencies

```
Phase 01 ──► Phase 02 (Scoring config depends on tournament form structure)
Phase 01 ──► Phase 03 (BR bracket depends on tournament competitionType)
Phase 02 ──► Phase 04 (Racing standings extend cumulative standings)
Phase 03 ──► Phase 04 (Racing participant editor extends participant editor)
Phase 05 runs after all other phases (translations + final integration)
```

---

## Dashboard Tech Stack Reference

- **Framework:** Next.js 16, React 19, JavaScript (no TypeScript)
- **Forms:** Formik + Yup validation
- **UI:** shadcn/ui + Tailwind CSS
- **i18n:** next-intl (`messages/en.json`, `messages/ar.json`)
- **API:** Axios via `apiClient.js`, server actions in `actions.js`
- **Images:** `ImageUpload` component with `name` + `formik` props
- **State:** React Context + local state (no Redux)
