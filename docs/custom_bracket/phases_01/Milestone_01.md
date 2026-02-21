# Phase 01 — Server Actions & API Layer

## Milestone 01: Custom Bracket CRUD Server Actions

### Milestone Objective

Create all server actions in `app/[locale]/_Lib/actions.js` for custom bracket round and match management (CRUD operations). These actions call the backend API via `apiClient` and follow the existing server action patterns (error handling, `revalidatePath`, `"use server"`).

### Status: Pending

---

### Tasks

| Task ID | Description | Expected Output | Status |
|---------|-------------|-----------------|--------|
| 1.1.1 | Add `addCustomRoundAction(tournamentId, data)` server action — POST to `/tournaments/${id}/bracket/custom/rounds` with `{ name, bestOf, position? }`. Follow existing pattern: `"use server"`, try/catch, `apiClient.post()`, `revalidatePath`, return `{ success, data?, error? }`. | New function in `actions.js` that creates a round and revalidates the tournament page. | Pending |
| 1.1.2 | Add `updateCustomRoundAction(tournamentId, round, data)` server action — PUT to `/tournaments/${id}/bracket/custom/rounds/${round}` with `{ name?, bestOf? }`. | New function in `actions.js` that updates a round's name or bestOf. | Pending |
| 1.1.3 | Add `deleteCustomRoundAction(tournamentId, round)` server action — DELETE to `/tournaments/${id}/bracket/custom/rounds/${round}`. | New function in `actions.js` that deletes a round and all its matches. | Pending |
| 1.1.4 | Add `addCustomMatchAction(tournamentId, data)` server action — POST to `/tournaments/${id}/bracket/custom/matches` with `{ round, team1Id?, team2Id?, bestOf?, position? }`. | New function in `actions.js` that adds a match to a specific round. | Pending |
| 1.1.5 | Add `deleteCustomMatchAction(tournamentId, matchId)` server action — DELETE to `/tournaments/${id}/bracket/custom/matches/${matchId}`. | New function in `actions.js` that deletes a specific match. | Pending |
| 1.1.6 | Add `reorderCustomBracketAction(tournamentId, data)` server action — PUT to `/tournaments/${id}/bracket/custom/reorder` with `{ rounds: [{ round, newPosition, matches? }] }`. | New function in `actions.js` that reorders rounds and their matches. | Pending |

---

### Implementation Notes

- All actions must include `"use server"` directive at the top of their function body or inherit from file-level directive.
- Import `apiClient` from `"./apiCLient"` (note the existing typo in filename — must match exactly).
- Error handling pattern from existing bracket actions:
  ```javascript
  try {
    const response = await apiClient.post(`/tournaments/${id}/bracket/custom/rounds`, data);
    revalidatePath(`/${locale}/tournaments/${id}`);
    return { success: true, data: response.data.data };
  } catch (e) {
    const fieldErrors = e.response?.data?.errors?.map(err => `${err.field}: ${err.message}`).join(', ');
    return { success: false, error: e.response?.data?.message + (fieldErrors ? ` (${fieldErrors})` : '') || 'An error occurred' };
  }
  ```
- `revalidatePath` should target the tournament detail page path.
