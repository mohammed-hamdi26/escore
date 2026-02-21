# Phase 02 — Loading States, Error Handling & User Feedback

## Milestone 03 — Success Feedback & Toast Notifications

### Milestone Objective

Add success feedback (toast notifications, brief animations) after successful operations so users have clear confirmation that their actions completed.

### Milestone Status: Planned

---

### Task 02.03.01 — Set Up Toast Notification System

**Task ID:** 02.03.01
**Task Description:**
Set up a toast notification system using shadcn/ui's `Sonner` (or `Toast`) component for the bracket management pages.

Check if the dashboard already has a toast system configured. If not:
1. Install `sonner` package (shadcn/ui recommendation) or use existing shadcn `Toast` component
2. Add `<Toaster>` provider in the app layout (if not already present)
3. Create a wrapper utility `lib/toast.js` that exports:
   - `showSuccess(message)` — green checkmark toast, auto-dismiss 3s
   - `showError(message)` — red alert toast, auto-dismiss 5s (longer for errors)
   - `showInfo(message)` — blue info toast, auto-dismiss 3s
   - `showWarning(message)` — yellow warning toast, auto-dismiss 4s

If a toast system already exists, document it and create the wrapper utility around it.

**Expected Output:**
- Toast system available for use across bracket components
- Wrapper utility `lib/toast.js` with `showSuccess`, `showError`, `showInfo`, `showWarning`
- Toast renders in top-right corner with consistent styling

**Task Status:** Planned

---

### Task 02.03.02 — Add Success Toasts to Bracket Operations

**Task ID:** 02.03.02
**Task Description:**
Add success toast notifications to all bracket operations that currently succeed silently.

Operations to add toasts to:

**Generation & Delete:**
| Operation | Toast Message |
|---|---|
| Generate bracket | "Bracket generated successfully" |
| Delete bracket | "Bracket deleted" |

**Custom Bracket:**
| Operation | Toast Message |
|---|---|
| Add round | "Round '{name}' added" |
| Edit round | "Round updated" |
| Delete round | "Round deleted" |
| Add match | "Match added to round" |
| Delete match | "Match deleted" |
| Reorder round | "Round order updated" |
| Reorder match | "Match order updated" |
| Assign team | "{Team Name} assigned to slot" |
| Unassign team | "Team removed from slot" |
| Set result | "Match result saved" |
| Clear result | "Match result cleared" |
| Complete bracket | "Bracket marked as completed" |

**Advancement:**
| Operation | Toast Message |
|---|---|
| Swiss advance round | "Round {N} generated with {X} matches" |
| BR advance round | "Round {N} generated. {X} teams eliminated" |
| Multi-stage advance | "Stage '{name}' generated" |
| Toggle stage visibility | "Stage visibility updated" |

Use `showSuccess()` from the toast utility. Messages should be translatable (use `t()` function).

**Expected Output:**
- Every successful operation shows a brief success toast
- Toast messages are descriptive (include names, counts where relevant)
- Messages use translation keys from `messages/en.json` and `messages/ar.json`

**Task Status:** Planned

---

### Task 02.03.03 — Add Translation Keys for Toast Messages

**Task ID:** 02.03.03
**Task Description:**
Add translation keys for all toast messages and error messages to `messages/en.json` and `messages/ar.json`.

Add keys under `TournamentDetails` section:

```json
{
  "TournamentDetails": {
    "bracketGeneratedSuccess": "Bracket generated successfully",
    "bracketDeletedSuccess": "Bracket deleted",
    "roundAdded": "Round \"{name}\" added",
    "roundUpdated": "Round updated",
    "roundDeleted": "Round deleted",
    "matchAdded": "Match added to round",
    "matchDeleted": "Match deleted",
    "roundReordered": "Round order updated",
    "matchReordered": "Match order updated",
    "teamAssigned": "{teamName} assigned to slot",
    "teamUnassigned": "Team removed from slot",
    "resultSaved": "Match result saved",
    "resultCleared": "Match result cleared",
    "bracketCompleted": "Bracket marked as completed",
    "swissRoundAdvanced": "Round {round} generated with {matchCount} matches",
    "brRoundAdvanced": "Round {round} generated. {eliminatedCount} teams eliminated",
    "stageAdvanced": "Stage \"{name}\" generated",
    "stageVisibilityUpdated": "Stage visibility updated",
    "errorGenerating": "Failed to generate bracket",
    "errorDeleting": "Failed to delete bracket",
    "errorAddingRound": "Failed to add round",
    "errorUpdatingRound": "Failed to update round",
    "errorDeletingRound": "Failed to delete round",
    "errorAdvancing": "Failed to advance round",
    "errorAssigning": "Failed to assign team",
    "errorSettingResult": "Failed to save result",
    "confirmDeleteBracket": "Delete this bracket? This will permanently remove all {matchCount} matches.",
    "confirmDeleteRound": "Delete round \"{name}\"? All matches in this round will be removed.",
    "confirmDeleteMatch": "Delete this match?",
    "confirmCompleteBracket": "Mark bracket as completed? This action is final."
  }
}
```

Add equivalent Arabic translations in `messages/ar.json`.

**Expected Output:**
- 30+ new translation keys in `messages/en.json`
- 30+ equivalent keys in `messages/ar.json`
- All toast/error messages use these keys via `t()` function

**Task Status:** Planned
