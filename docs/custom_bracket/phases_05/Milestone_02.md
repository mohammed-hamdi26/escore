# Phase 05 — Translations, Polish & Testing

## Milestone 02: Polish, Edge Cases & Manual Testing

### Milestone Objective

Address edge cases, add loading/error states throughout, polish the UI for consistency, and perform a full manual test of the end-to-end custom bracket workflow.

### Status: Pending

---

### Tasks

| Task ID | Description | Expected Output | Status |
|---------|-------------|-----------------|--------|
| 5.2.1 | Add loading skeletons/spinners for all async operations. Ensure every API call (add round, delete round, add match, assign team, set result, reorder, complete) shows a loading indicator in the relevant UI area. Use existing spinner/skeleton patterns from the dashboard. | No "dead" UI states — every action has visible loading feedback. | Pending |
| 5.2.2 | Add error handling for all server action calls in custom bracket components. On error, display toast notification or inline error message. Ensure errors from the API (validation errors, conflict errors, not-found errors) are displayed in a user-friendly format. Follow existing error handling patterns. | All API errors surface as visible, actionable error messages. | Pending |
| 5.2.3 | Handle disabled/locked states. When bracket status is `completed`: disable all editing controls (add/delete/reorder rounds, add/delete matches, assign teams, set results). Show a "Bracket is completed" banner. Only "Delete Bracket" remains available for resetting. | Completed brackets are read-only with clear visual indication. | Pending |
| 5.2.4 | Polish responsive behavior. Ensure the horizontal scrolling bracket view works on smaller screens. Test that dialogs are properly sized on mobile viewports. Verify the round columns don't collapse or overflow awkwardly. | Bracket editor is usable on tablet-width screens and above. | Pending |
| 5.2.5 | Verify RTL (Arabic) layout. Switch to Arabic locale and verify: (a) Round columns still scroll left-to-right (bracket convention). (b) Dialog text is right-aligned. (c) Arrow buttons for reordering still make directional sense. (d) All translated strings display correctly. | Custom bracket UI works correctly in both LTR and RTL modes. | Pending |
| 5.2.6 | Full end-to-end manual test workflow: (1) Generate custom bracket with 3 rounds. (2) Rename rounds. (3) Add matches to each round. (4) Assign teams to all matches. (5) Set results for all matches. (6) Reorder rounds and matches. (7) Clear a result. (8) Delete a match. (9) Delete a round. (10) Complete the bracket. (11) Delete the bracket and regenerate. Verify each step works correctly. | Complete workflow tested and documented with results. | Pending |

---

### Implementation Notes

- For loading states, use the existing pattern: `const [isLoading, setIsLoading] = useState(false)` with conditional `disabled` prop on buttons and spinner overlay.
- Error toasts: if the dashboard uses a toast library (e.g., sonner or shadcn toast), use that. Otherwise, use inline error messages below action buttons.
- The "completed" state lock should be implemented at the `CustomBracketEditor` level and propagated to child components via an `isLocked` prop.
- RTL testing: next-intl handles direction automatically based on locale. The bracket horizontal scroll should remain LTR even in Arabic (brackets are always left-to-right by convention).
- The manual test in Task 5.2.6 serves as the acceptance test for the entire feature. Document any issues found and fix them before marking complete.
