# Phase 03 — Battle Royale Bracket & Multi-Participant

## Milestone 03 — Multi-Participant Match Display

### Objective

Update match display components to handle multi-participant matches (`isMultiParticipant: true`). Instead of showing team1 vs team2, show a ranked list of participants with placements, kills, and points.

### Status: `Planned`

---

### Task 3.3.1 — Detect multi-participant matches in MatchDetails

- **Task ID:** 3.3.1
- **Description:** In `components/Matches Management/MatchDetails.jsx`, add a check for `match.isMultiParticipant`. When `true`, render a multi-participant view instead of the standard team1-vs-team2 layout. The standard view (team names, logos, scores, lineups) should be skipped for multi-participant matches. Add a conditional branch at the top of the render:
  ```
  if (match.isMultiParticipant) return <MultiParticipantView match={match} />;
  ```
  Create a placeholder `MultiParticipantView` component for now (filled in Task 3.3.2).
- **Expected Output:** Multi-participant matches route to a different display component. Standard matches are unaffected.
- **Status:** `Planned`

---

### Task 3.3.2 — Create MultiParticipantMatchView component

- **Task ID:** 3.3.2
- **Description:** Create `components/Matches Management/MultiParticipantMatchView.jsx`. This component receives a match object and renders:

  1. **Match Header** — Round label (e.g., "BR Round 1 Lobby A"), match status badge, scheduled date.
  2. **Participants Table** — Sorted by placement (ascending):

     | # | Team/Player | Kills | Deaths | Assists | Points | Status |
     |---|-------------|-------|--------|---------|--------|--------|
     | 1 | Team Alpha (with logo) | 8 | 2 | 5 | 20 | - |
     | 2 | Team Beta (with logo) | 5 | 3 | 3 | 14 | - |
     | 6 | Team Zeta (with logo) | 0 | 8 | 0 | 3 | Eliminated |

  3. **Participant entity** — Show team (name + logo) or player (nickname + photo) based on which field is present.
  4. **Medals** — 1st/2nd/3rd get gold/silver/bronze styling.
  5. **Eliminated badge** — Red badge when `isEliminated: true`.
- **Expected Output:** A clean, ranked table showing all participants in a multi-participant match.
- **Status:** `Planned`

---

### Task 3.3.3 — Update MatchesTable for multi-participant matches

- **Task ID:** 3.3.3
- **Description:** In `components/Matches Management/MatchesTable.jsx` (or the list redesign), update the row rendering for multi-participant matches:
  - Instead of "Team1 vs Team2" and a score, show: "BR Match — X participants" or the round label.
  - The score column could show the top participant (1st place team/player name).
  - Add a small badge/icon indicating "Multi" or "BR" for multi-participant matches.
  - Clicking the row navigates to the match detail view as usual.
- **Expected Output:** Multi-participant matches are clearly distinguishable in the matches table with appropriate labels.
- **Status:** `Planned`

---

### Task 3.3.4 — Update BracketMatchCard for multi-participant

- **Task ID:** 3.3.4
- **Description:** In `components/Tournaments Management/BracketMatchCard.jsx`, add support for rendering multi-participant matches within the BR bracket view. Instead of showing two teams with a score, show a compact participant list:
  - Show top 3 participants with placements and points
  - Show total participant count (e.g., "+3 more")
  - Match status badge
  - Click navigates to full match detail or opens participant editor

  This card is used inside the BR rounds view from Task 3.1.4.
- **Expected Output:** BR lobby cards in the bracket view show a compact summary of participant rankings.
- **Status:** `Planned`
