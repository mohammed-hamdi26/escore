# Phase 02 — Reassign UI in RoundRobinDisplay

## Milestone 01: Add Reassign Mode State & Toggle Button

### Milestone Objective
Add the reassign mode toggle button and state management to `RoundRobinDisplay.jsx`. When active, the UI switches to a selection-based interaction instead of opening the match result dialog.

### Milestone Status: Planned

---

### Tasks

#### Task 2.1.1
- **Task ID:** P02-M01-T01
- **Task Description:**
  Add reassign mode state variables to `RoundRobinDisplay` component (line ~435 area, after existing useState hooks).

  **New state variables:**
  ```javascript
  const [reassignMode, setReassignMode] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  // selectedParticipant = { slotId, field: 'participant1'|'participant2', team }
  const [reassignLoading, setReassignLoading] = useState(false);
  ```

  **Add import** for `reassignParticipantsAction` from `actions.js`:
  ```javascript
  import { updateBracketMatchResultAction, reassignParticipantsAction } from "@/app/[locale]/_Lib/actions";
  ```

  **Add import** for toast (to show success/error):
  ```javascript
  import { toast } from "sonner";
  ```

  **Add import** for new icons:
  ```javascript
  // Add ArrowLeftRight to the existing lucide-react import
  import { Trophy, Users, CheckCircle, Clock, Circle, ChevronDown, ArrowLeftRight } from "lucide-react";
  ```

- **Expected Output:**
  State variables and imports added. No visual change yet.

- **Task Status:** Planned

---

#### Task 2.1.2
- **Task ID:** P02-M01-T02
- **Task Description:**
  Add the "Reassign Teams" toggle button in the header area of `RoundRobinDisplay`, next to the `ViewToggle` component (around line 505).

  Place it between the group tabs and the ViewToggle:
  ```jsx
  <div className="flex items-center gap-2">
    {/* Reassign toggle */}
    <button
      onClick={() => {
        setReassignMode(!reassignMode);
        setSelectedParticipant(null);
      }}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
        reassignMode
          ? "bg-amber-500/20 border-amber-500/40 text-amber-500"
          : "bg-muted/20 border-white/5 text-muted-foreground hover:text-foreground hover:bg-muted/40"
      }`}
    >
      <ArrowLeftRight className="size-3.5" />
      {reassignMode ? t("exitReassignMode") : t("reassignTeams")}
    </button>
    <ViewToggle view={viewMode} onChange={setViewMode} t={t} />
  </div>
  ```

  **Also add** a reassign mode banner below the header when active:
  ```jsx
  {reassignMode && (
    <div className="mb-3 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center gap-2">
      <ArrowLeftRight className="size-4 text-amber-500 shrink-0" />
      <span className="text-xs text-amber-500">
        {selectedParticipant ? t("reassignSelectSecond") : t("reassignSelectFirst")}
      </span>
      {selectedParticipant && (
        <button
          onClick={() => setSelectedParticipant(null)}
          className="ms-auto text-xs text-amber-500/70 hover:text-amber-500 underline"
        >
          {t("reassignCancel")}
        </button>
      )}
    </div>
  )}
  ```

- **Expected Output:**
  Toggle button visible in header. When clicked, shows amber banner with instructions. Clicking again exits reassign mode.

- **Task Status:** Planned
