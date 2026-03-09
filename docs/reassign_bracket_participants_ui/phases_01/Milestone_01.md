# Phase 01 — Server Action & Translations

## Milestone 01: Add Server Action

### Milestone Objective
Create the `reassignParticipantsAction` server action in `actions.js` that calls the backend endpoint.

### Milestone Status: Planned

---

### Tasks

#### Task 1.1.1
- **Task ID:** P01-M01-T01
- **Task Description:**
  Add `reassignParticipantsAction` to `app/[locale]/_Lib/actions.js`.

  Place it after the existing `swapSlotParticipantsAction` (around line 1982).

  **Function signature and implementation:**
  ```javascript
  export async function reassignParticipantsAction(tournamentId, data) {
    // data = { slot1Id, slot1Field, slot2Id, slot2Field }
    const locale = await getLocale();
    try {
      const res = await apiClient.post(
        `/tournaments/${tournamentId}/bracket/slots/reassign-participants`,
        data
      );
      revalidatePath(
        `/${locale}/dashboard/tournaments-management/view/${tournamentId}`
      );
      return { success: true, data: res.data?.data };
    } catch (e) {
      console.log("Reassign participants error:", e.response?.data || e.message);
      const msg = e.response?.data?.message || "Error reassigning participants";
      const errors = e.response?.data?.errors;
      const detail = errors?.length
        ? `${msg}: ${errors.map((err) => `${err.field} - ${err.message}`).join(", ")}`
        : msg;
      return { success: false, error: detail };
    }
  }
  ```

  **Important:** Follow the same pattern as `swapSlotParticipantsAction` and `seedAssignmentsAction` — include `revalidatePath` and proper error detail extraction.

- **Expected Output:**
  `reassignParticipantsAction` exported from `actions.js`. Can be imported and called from components.

- **Task Status:** Planned
