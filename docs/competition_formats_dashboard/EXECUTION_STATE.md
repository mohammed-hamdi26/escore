# EXECUTION STATE — Competition Formats Dashboard

> **SINGLE SOURCE OF TRUTH** for task execution.
> Restart-safe. Integrated with Git commits for automatic tracking.
> This file must always reflect the real execution state.

---

## Current Execution State

| Field | Value |
|-------|-------|
| **Current Phase** | 01 — Tournament Form & Core Fields — `In Progress` |
| **Current Milestone** | 03 — Tournament Table & Filter Updates — `In Progress` |
| **Current Task** | 1.3.1 — Add competitionType column to TournamentsTable — `In Progress` |
| **Last Completed Checkpoint** | Phase 01, Milestone 02, Task 1.2.6 |

---

## Execution Rules

1. Execution must start strictly from the **Current Task**.
2. Do **NOT** skip Tasks.
3. Do **NOT** start a Task if the previous Task is not `Completed`.
4. Do **NOT** jump to a new Milestone or Phase with unfinished items.
5. A Task can only be marked `Completed` after its output is fully delivered.
6. Failure to update or commit this file invalidates the execution.

---

## Checkpoint Confirmation Process

After completing a Task:

1. Update **Current Task** Status → `Completed`
2. Update **Last Completed Checkpoint** → `(Phase ID, Milestone ID, Task ID)`
3. Move **Current Task** to next Task in sequence (Status → `In Progress`)
4. Commit the file to Git:
   ```
   git add EXECUTION_STATE.md
   git commit -m "Checkpoint: Phase [ID], Milestone [ID], Task [ID] completed"
   ```
5. Explicitly confirm: **"Checkpoint updated. Ready to proceed with Task [Next Task ID]."**

---

## Milestone & Phase Completion

- When **all Tasks** in a Milestone are `Completed` → Milestone Status → `Completed` → move to next Milestone
- When **all Milestones** in a Phase are `Completed` → Phase Status → `Completed` → move to next Phase
- Update the Phase/Milestone tables below and the Current Execution State table above

---

## Resume Behavior

- On resuming after interruption, **read this file first**
- Resume strictly from **Current Task**
- Do **NOT** re-execute completed Tasks
- All checkpoint updates **must** be committed to Git

---

## Phase Tracker

| Phase | Name | Status |
|-------|------|--------|
| 01 | Tournament Form & Core Fields | `Planned` |
| 02 | Placement Scoring & Standing Config | `Planned` |
| 03 | Battle Royale Bracket & Multi-Participant | `Planned` |
| 04 | Racing / Time-Based UI | `Planned` |
| 05 | Translations & Final Polish | `Planned` |

---

## Milestone Tracker

### Phase 01 — Tournament Form & Core Fields

| Milestone | Name | Status |
|-----------|------|--------|
| 01 | Competition Type Field | `Completed` |
| 02 | Participation Type & Player Selection | `Completed` |
| 03 | Tournament Table & Filter Updates | `In Progress` |
| 04 | Tournament Detail View Updates | `Planned` |

### Phase 02 — Placement Scoring & Standing Config

| Milestone | Name | Status |
|-----------|------|--------|
| 01 | Scoring Type Toggle in Tournament Form | `Planned` |
| 02 | Placement Config Editor | `Planned` |
| 03 | Cumulative Standings Table | `Planned` |
| 04 | Round History Display | `Planned` |

### Phase 03 — Battle Royale Bracket & Multi-Participant

| Milestone | Name | Status |
|-----------|------|--------|
| 01 | BR Bracket Type in BracketView | `Planned` |
| 02 | BR Round Advancement UI | `Planned` |
| 03 | Multi-Participant Match Display | `Planned` |
| 04 | Participant Results Editor | `Planned` |

### Phase 04 — Racing / Time-Based UI

| Milestone | Name | Status |
|-----------|------|--------|
| 01 | Time Fields in Participant Editor | `Planned` |
| 02 | Racing Standings Display | `Planned` |
| 03 | Time Formatting Utility | `Planned` |

### Phase 05 — Translations & Final Polish

| Milestone | Name | Status |
|-----------|------|--------|
| 01 | Translation Keys (en + ar) | `Planned` |
| 02 | Server Actions & API Functions | `Planned` |
| 03 | Final Integration & Verification | `Planned` |

---

## Task Tracker

### Phase 01, Milestone 01 — Competition Type Field

| Task | Description | Status |
|------|-------------|--------|
| 1.1.1 | Add competitionType select to TournamentsForm | `Completed` |
| 1.1.2 | Populate competitionType on edit | `Completed` |
| 1.1.3 | Add competitionType labels to translations | `Completed` |
| 1.1.4 | Include competitionType in server action payload | `Completed` |

### Phase 01, Milestone 02 — Participation Type & Player Selection

| Task | Description | Status |
|------|-------------|--------|
| 1.2.1 | Add participationType radio/select to TournamentsForm | `Completed` |
| 1.2.2 | Conditional teams/players multi-select | `Completed` |
| 1.2.3 | Add searchPlayers API function | `Completed` |
| 1.2.4 | Populate participationType and players on edit | `Completed` |
| 1.2.5 | Include participationType and players in server action payload | `Completed` |
| 1.2.6 | Add translation keys for participationType | `Completed` |

### Phase 01, Milestone 03 — Tournament Table & Filter Updates

| Task | Description | Status |
|------|-------------|--------|
| 1.3.1 | Add competitionType column to TournamentsTable | `In Progress` |
| 1.3.2 | Add participationType indicator to TournamentsTable | `Planned` |
| 1.3.3 | Add competitionType filter to TournamentsFilter | `Planned` |
| 1.3.4 | Pass competitionType filter to API | `Planned` |

### Phase 01, Milestone 04 — Tournament Detail View Updates

| Task | Description | Status |
|------|-------------|--------|
| 1.4.1 | Display competitionType in TournamentDetails | `Planned` |
| 1.4.2 | Display participationType in TournamentDetails | `Planned` |
| 1.4.3 | Show players list for player tournaments | `Planned` |
| 1.4.4 | Update bracket seeds display for player tournaments | `Planned` |

### Phase 02, Milestone 01 — Scoring Type Toggle in Tournament Form

| Task | Description | Status |
|------|-------------|--------|
| 2.1.1 | Add scoringType toggle to TournamentsForm | `Planned` |
| 2.1.2 | Conditional rendering of win/loss fields | `Planned` |
| 2.1.3 | Auto-set scoringType based on competitionType | `Planned` |
| 2.1.4 | Populate scoringType on edit | `Planned` |

### Phase 02, Milestone 02 — Placement Config Editor

| Task | Description | Status |
|------|-------------|--------|
| 2.2.1 | Create PlacementConfigEditor component | `Planned` |
| 2.2.2 | Integrate PlacementConfigEditor in TournamentsForm | `Planned` |
| 2.2.3 | Include placementConfig in submission payload | `Planned` |
| 2.2.4 | Populate placementConfig on edit | `Planned` |
| 2.2.5 | Add preset placement tables | `Planned` |

### Phase 02, Milestone 03 — Cumulative Standings Table

| Task | Description | Status |
|------|-------------|--------|
| 2.3.1 | Detect scoringType and switch standings layout | `Planned` |
| 2.3.2 | Create cumulative standings columns | `Planned` |
| 2.3.3 | Style cumulative standings with medals and elimination | `Planned` |
| 2.3.4 | Add "Recalculate" button for placement standings | `Planned` |

### Phase 02, Milestone 04 — Round History Display

| Task | Description | Status |
|------|-------------|--------|
| 2.4.1 | Add expandable round history to standing rows | `Planned` |
| 2.4.2 | Style round history sub-table | `Planned` |
| 2.4.3 | Handle empty round history | `Planned` |

### Phase 03, Milestone 01 — BR Bracket Type in BracketView

| Task | Description | Status |
|------|-------------|--------|
| 3.1.1 | Add battle_royale option to bracket type selector | `Planned` |
| 3.1.2 | Add BR config fields to generation form | `Planned` |
| 3.1.3 | Send battleRoyaleConfig in bracket generation | `Planned` |
| 3.1.4 | Render BR bracket rounds view | `Planned` |

### Phase 03, Milestone 02 — BR Round Advancement UI

| Task | Description | Status |
|------|-------------|--------|
| 3.2.1 | Add "Advance Round" button to BR bracket view | `Planned` |
| 3.2.2 | Show elimination info after advancement | `Planned` |
| 3.2.3 | Show bracket completion state | `Planned` |
| 3.2.4 | Handle round advancement errors | `Planned` |

### Phase 03, Milestone 03 — Multi-Participant Match Display

| Task | Description | Status |
|------|-------------|--------|
| 3.3.1 | Detect multi-participant matches in MatchDetails | `Planned` |
| 3.3.2 | Create MultiParticipantMatchView component | `Planned` |
| 3.3.3 | Update MatchesTable for multi-participant matches | `Planned` |
| 3.3.4 | Update BracketMatchCard for multi-participant | `Planned` |

### Phase 03, Milestone 04 — Participant Results Editor

| Task | Description | Status |
|------|-------------|--------|
| 3.4.1 | Create ParticipantResultsEditor component | `Planned` |
| 3.4.2 | Add auto-sort by placement | `Planned` |
| 3.4.3 | Add auto-calculate points | `Planned` |
| 3.4.4 | Integrate editor into match detail view | `Planned` |
| 3.4.5 | Add updateParticipantResults server action | `Planned` |

### Phase 04, Milestone 01 — Time Fields in Participant Editor

| Task | Description | Status |
|------|-------------|--------|
| 4.1.1 | Add time columns to ParticipantResultsEditor | `Planned` |
| 4.1.2 | Create TimeInput component | `Planned` |
| 4.1.3 | Include time fields in submission payload | `Planned` |
| 4.1.4 | DNF/DSQ interaction logic | `Planned` |

### Phase 04, Milestone 02 — Racing Standings Display

| Task | Description | Status |
|------|-------------|--------|
| 4.2.1 | Add racing columns to StandingsManagement table | `Planned` |
| 4.2.2 | Add racing columns to TournamentStandings (public view) | `Planned` |
| 4.2.3 | Add racing fields to round history detail | `Planned` |
| 4.2.4 | Sort standings by racing criteria | `Planned` |

### Phase 04, Milestone 03 — Time Formatting Utility

| Task | Description | Status |
|------|-------------|--------|
| 4.3.1 | Create time formatting utility functions | `Planned` |
| 4.3.2 | Add time display helpers for table cells | `Planned` |
| 4.3.3 | Validate time input format | `Planned` |

### Phase 05, Milestone 01 — Translation Keys (en + ar)

| Task | Description | Status |
|------|-------------|--------|
| 5.1.1 | Add tournament form translation keys | `Planned` |
| 5.1.2 | Add bracket & match translation keys | `Planned` |
| 5.1.3 | Add racing & time-based translation keys | `Planned` |
| 5.1.4 | Add filter & status translation keys | `Planned` |

### Phase 05, Milestone 02 — Server Actions & API Functions

| Task | Description | Status |
|------|-------------|--------|
| 5.2.1 | Add BR bracket server actions | `Planned` |
| 5.2.2 | Add participant results server actions | `Planned` |
| 5.2.3 | Add standings recalculation action | `Planned` |
| 5.2.4 | Verify all existing actions forward new fields | `Planned` |

### Phase 05, Milestone 03 — Final Integration & Verification

| Task | Description | Status |
|------|-------------|--------|
| 5.3.1 | End-to-end flow: Standard tournament with placement scoring | `Planned` |
| 5.3.2 | End-to-end flow: Battle Royale tournament | `Planned` |
| 5.3.3 | End-to-end flow: Racing tournament | `Planned` |
| 5.3.4 | Verify translations in both languages | `Planned` |
| 5.3.5 | Fix regressions and edge cases | `Planned` |

---

## Checkpoint Log

| # | Phase | Milestone | Task | Committed | Date |
|---|-------|-----------|------|-----------|------|
| 1 | 01 | 01 | 1.1.1 | 5dcfb6a | 2026-02-17 |
| 2 | 01 | 01 | 1.1.2 | e66e9a2 | 2026-02-17 |
| 3 | 01 | 01 | 1.1.3 | a65e7a1 | 2026-02-17 |
| 4 | 01 | 01 | 1.1.4 | 01564b2 | 2026-02-17 |
| 5 | 01 | 02 | 1.2.1–1.2.6 | — | 2026-02-17 |
