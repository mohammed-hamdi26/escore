# Phase 01 — Tournament Form & Core Fields

## Milestone 01 — Competition Type Field

### Objective

Add a `competitionType` select field to the tournament create/edit form. This field categorizes the tournament format (standard, battle_royale, fighting, racing, ffa, sports_sim) and is sent to the backend on create/update.

### Status: `Planned`

---

### Task 1.1.1 — Add competitionType select to TournamentsForm

- **Task ID:** 1.1.1
- **Description:** In `components/Tournaments Management/TournamentsForm.jsx`, add a new select field `competitionType` with options: `standard` (default), `battle_royale`, `fighting`, `racing`, `ffa`, `sports_sim`. Place it in the form's basic info section, after the `description` field. Use the same Select/FormField pattern used for `tier` and `status` fields. Add it to the Formik `initialValues` (default: `"standard"`) and Yup validation schema (required, oneOf the 6 values). Ensure the field value is included in the form submission payload.
- **Expected Output:** A working select dropdown appears in the tournament form. Selecting a value persists it in Formik state. On form submission, `competitionType` is included in the request body.
- **Status:** `Planned`

---

### Task 1.1.2 — Populate competitionType on edit

- **Task ID:** 1.1.2
- **Description:** When editing an existing tournament (`edit/[id]/page.jsx`), the `competitionType` field must be pre-populated from the tournament data fetched from the API. In `TournamentsForm.jsx`, ensure `initialValues.competitionType` is set from `tournamentData.competitionType` (fallback to `"standard"` if undefined for backward compatibility with old tournaments).
- **Expected Output:** Opening the edit form for an existing tournament shows the correct `competitionType` value pre-selected.
- **Status:** `Planned`

---

### Task 1.1.3 — Add competitionType labels to translations

- **Task ID:** 1.1.3
- **Description:** Add translation keys for the competitionType field label and all 6 option labels in both `messages/en.json` and `messages/ar.json`. Keys: `competitionType`, `competitionType.standard`, `competitionType.battle_royale`, `competitionType.fighting`, `competitionType.racing`, `competitionType.ffa`, `competitionType.sports_sim`. Use `useTranslations()` in the form component to display translated labels.
- **Expected Output:** The select field and its options display translated labels in both English and Arabic.
- **Status:** `Planned`

---

### Task 1.1.4 — Include competitionType in server action payload

- **Task ID:** 1.1.4
- **Description:** In `app/[locale]/_Lib/actions.js`, verify that the `addTournament` and `editTournament` server actions pass `competitionType` to the API. Since these actions forward the form data object, this should work automatically — but verify the field is not being filtered out. If there's a field whitelist, add `competitionType` to it.
- **Expected Output:** Creating/updating a tournament via the dashboard correctly saves the `competitionType` field in the backend.
- **Status:** `Planned`
