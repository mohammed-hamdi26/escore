# Phase 02 — Loading States, Error Handling & User Feedback

## Milestone 02 — Error Handling & User-Friendly Messages

### Milestone Objective

Transform raw server error messages into user-friendly, translated, contextual error messages. Add field-level error highlighting and helpful guidance for common error scenarios.

### Milestone Status: Planned

---

### Task 02.02.01 — Create Error Message Mapping Utility

**Task ID:** 02.02.01
**Task Description:**
Create a utility function `mapBracketError(serverError, t)` that maps raw server error responses to user-friendly translated messages.

Create file `lib/bracket-error-mapper.js`:

```
Input:  { message: "Validation failed", errors: [{ field: "body.customConfig.rounds", message: "Expected array, received number" }] }
Output: { message: "Please fix the following errors:", fieldErrors: { "customConfig.rounds": "Rounds must be a list of round configurations" }, suggestions: ["Check that you've configured at least one round"] }
```

The mapper should:
- Strip `body.` prefix from field paths
- Map known field paths to user-friendly field names (e.g., `customConfig.rounds` → "Rounds configuration")
- Map known error patterns to helpful messages:
  - "Expected array, received number" → "This field must be a list, not a single value"
  - "Required" → "This field is required"
  - "must be >= 2" → "At least 2 teams/players are required"
  - "must be >= 1" → "Value must be at least 1"
- Include contextual suggestions based on bracket type (e.g., "For Round Robin, make sure each group has at least 2 teams")
- Accept the `t` translation function to use i18n keys where available
- Fallback: return the original server message if no mapping exists

**Expected Output:**
- New file: `lib/bracket-error-mapper.js`
- Exported function `mapBracketError(serverError, t)` → `{ message, fieldErrors, suggestions }`
- Covers all common bracket validation errors

**Task Status:** Planned

---

### Task 02.02.02 — Create InlineError Component

**Task ID:** 02.02.02
**Task Description:**
Create a reusable `InlineError.jsx` component for displaying field-level validation errors next to form inputs.

The component should:
- Props: `error` (string or null), `className` (optional)
- Render below the associated input field
- Show red text with warning/alert icon
- Animate in/out with Tailwind `transition-all` (slide down + fade in)
- Return `null` when no error

Also create an `ErrorBanner.jsx` component for top-level error summaries:
- Props: `error` (object from `mapBracketError` output), `onDismiss` (callback)
- Show red/destructive banner at top of form with:
  - Error message (translated)
  - List of field errors (if any)
  - Suggestions list (if any)
  - Dismiss (X) button
- Use shadcn/ui `Alert` component with `variant="destructive"`

**Expected Output:**
- New file: `components/shared/InlineError.jsx`
- New file: `components/shared/ErrorBanner.jsx`
- InlineError shows below form fields
- ErrorBanner shows at top of forms/sections

**Task Status:** Planned

---

### Task 02.02.03 — Integrate Error Display in Generation Form

**Task ID:** 02.02.03
**Task Description:**
Integrate the error mapping and display components into `BracketGenerationForm.jsx`.

Changes:
1. When `generateBracketAction` returns an error:
   - Pass error through `mapBracketError()` to get user-friendly message
   - Show `<ErrorBanner>` at top of form with mapped error
   - If field-specific errors exist, show `<InlineError>` next to the relevant config field
   - Scroll to first error field
2. Clear errors when:
   - User changes bracket type
   - User modifies the field that had an error
   - User clicks dismiss on ErrorBanner
3. Error field highlighting:
   - Add red border (`border-red-500`) to input fields that have errors
   - Remove red border when user edits the field

**Expected Output:**
- Generation form shows user-friendly errors after failed generation attempt
- Field-level errors highlighted with red border + inline error message
- Error banner at top with summary and suggestions
- Errors clear on user interaction

**Task Status:** Planned

---

### Task 02.02.04 — Integrate Error Display in Custom Bracket Operations

**Task ID:** 02.02.04
**Task Description:**
Add error handling to all custom bracket operations (add/edit/delete round, add/delete match, assign team, set result).

Changes to `CustomRoundCard.jsx`, `CustomMatchRow.jsx`, `MatchResultDialog.jsx`, `TeamAssignmentDialog.jsx`:

1. **Add Round** — show inline error below the add form if server returns error
2. **Edit Round** — show inline error below the edit form fields
3. **Delete Round** — show error in confirmation dialog (keep dialog open)
4. **Add Match** — show brief error toast if fails
5. **Delete Match** — show error in confirmation dialog
6. **Assign Team** — show error banner in TeamAssignmentDialog
7. **Set Result** — show error banner in MatchResultDialog with field-level errors for score fields
8. **Reorder** — show brief error toast if reorder fails

For each operation, use `mapBracketError()` to transform server errors before display.

**Expected Output:**
- All custom bracket operations show user-friendly errors on failure
- Errors appear contextually (in dialogs, below forms, as toasts)
- No raw server error messages shown to users

**Task Status:** Planned

---

### Task 02.02.05 — Add Error Recovery Guidance

**Task ID:** 02.02.05
**Task Description:**
Add contextual help/guidance messages for common error scenarios.

Create a `BracketErrorGuide.jsx` component that shows helpful tips when specific errors occur:

| Error Pattern | Guidance Message |
|---|---|
| "at least 2 teams" | "Add more teams to the tournament before generating a bracket" |
| "at least 2 stages" | "Multi-stage brackets need at least 2 stages. Add another stage or switch bracket type" |
| "groups required" | "Round Robin needs at least one group. Configure groups and assign teams" |
| "swissConfig required" | "Swiss system needs configuration. Set total rounds, wins to qualify, and losses to eliminate" |
| "all matches must be completed" | "Complete all matches in the current round before advancing" |
| "duplicate team" | "A team appears multiple times. Check group assignments for duplicates" |

Integrate into `ErrorBanner.jsx` — when a suggestion matches a known pattern, show an action button (e.g., "Go to Teams" link, "Add Stage" button).

**Expected Output:**
- `BracketErrorGuide.jsx` or integrated into ErrorBanner
- Contextual guidance for 6+ common error patterns
- Action buttons where applicable (linking to relevant section)

**Task Status:** Planned
