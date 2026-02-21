# Phase 05 — Visual Enhancements & Polish

## Milestone 02 — I18n Completeness & Hard-Coded Strings

### Milestone Objective

Eliminate all hard-coded English strings in bracket components and ensure complete translation coverage in both `messages/en.json` and `messages/ar.json`. Every user-visible string should use the `t()` translation function.

### Milestone Status: Planned

---

### Task 05.02.01 — Audit Hard-Coded Strings in Bracket Components

**Task ID:** 05.02.01
**Task Description:**
Perform a comprehensive audit of all bracket-related component files to identify every hard-coded string that should be translated.

Files to audit:
1. `BracketView.jsx` (or refactored orchestrator)
2. `BracketGenerationForm.jsx` (and all sub-config components)
3. `BracketMatchCard.jsx`
4. `CustomBracketEditor.jsx`
5. `CustomRoundCard.jsx`
6. `CustomMatchRow.jsx`
7. `MatchResultDialog.jsx`
8. `TeamAssignmentDialog.jsx`
9. All new components from Phase 01-04
10. `bracketApi.js` (error messages)

For each file, list:
- Line number
- Current hard-coded string
- Suggested translation key
- Whether it's user-facing (UI text) or developer-facing (console/debug)

Create a tracking document: `docs/bracket_ux_enhancements/i18n_audit.md` listing all findings.

Known hard-coded strings to start with:
- "BYE" (BracketMatchCard.jsx)
- "TBD" (BracketMatchCard.jsx)
- "Click to assign" (CustomMatchRow.jsx)
- "No matches" (various)
- "vs" (match display)
- Button labels (Save, Cancel, Delete, Add, etc.)
- Status labels (scheduled, live, completed)
- "Bo{N}" format strings
- Error fallback messages

**Expected Output:**
- Complete audit document listing all hard-coded strings
- Suggested translation keys for each string
- File and line reference for each finding
- Categorization: critical (user-facing) vs. low-priority (dev-facing)

**Task Status:** Planned

---

### Task 05.02.02 — Add Missing Translation Keys

**Task ID:** 05.02.02
**Task Description:**
Based on the audit from Task 05.02.01, add all missing translation keys to `messages/en.json` and `messages/ar.json`.

Organization in translation files:
- Keep bracket-related keys under the existing `TournamentDetails` section
- Group by sub-category:
  ```json
  {
    "TournamentDetails": {
      // Existing keys...

      // Match display
      "bye": "BYE",
      "tbd": "TBD",
      "vs": "vs",
      "clickToAssign": "Click to assign",
      "noMatches": "No matches",

      // Status labels
      "statusScheduled": "Scheduled",
      "statusLive": "Live",
      "statusCompleted": "Completed",
      "statusNotGenerated": "Not Generated",
      "statusGenerated": "Generated",
      "statusInProgress": "In Progress",

      // Match display
      "matchNumber": "Match #{number}",
      "bestOfN": "Bo{n}",
      "roundN": "Round {n}",

      // Actions
      "save": "Save",
      "cancel": "Cancel",
      "delete": "Delete",
      "add": "Add",
      "edit": "Edit",
      "close": "Close",
      "confirm": "Confirm",

      // ... all other missing keys
    }
  }
  ```

For Arabic translations:
- Translate all new keys to Arabic
- Maintain same key structure
- Handle RTL-specific text where needed

**Expected Output:**
- All missing keys added to `messages/en.json`
- All missing keys added to `messages/ar.json` with Arabic translations
- No orphan keys (every key has both EN and AR)

**Task Status:** Planned

---

### Task 05.02.03 — Replace Hard-Coded Strings with Translation Calls

**Task ID:** 05.02.03
**Task Description:**
Replace all identified hard-coded strings in bracket components with `t()` calls using the new translation keys.

For each component:
1. Import `useTranslations` from `next-intl`
2. Get `t` function: `const t = useTranslations("TournamentDetails");`
3. Replace each hard-coded string:
   ```jsx
   // Before
   <span>BYE</span>

   // After
   <span>{t("bye")}</span>
   ```
4. For strings with variables, use ICU message format:
   ```jsx
   // Before
   <span>{`Match #${index + 1}`}</span>

   // After
   <span>{t("matchNumber", { number: index + 1 })}</span>
   ```

Special cases:
- Conditional text (plurals): use ICU `{count, plural, one {# match} other {# matches}}`
- Format strings: ensure variables are passed correctly
- Dynamic content (team names, scores): wrap only static text in `t()`, keep dynamic data as-is

**Expected Output:**
- All hard-coded strings replaced with `t()` calls
- All bracket components fully internationalized
- Both English and Arabic rendering verified
- No visual regressions (same appearance, just using translation function)

**Task Status:** Planned
