# Phase 01: High-Impact Quick Wins

## Milestone 01: SeedOrderManager Drag-and-Drop

### Objective
Replace the button-only seed reordering with proper drag-and-drop using @dnd-kit, keeping arrow buttons as fallback.

### Status: Pending

---

### Task 01.01.01: Install @dnd-kit packages

- **Description:** Install `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities` in the dashboard project.
- **Expected Output:** Packages added to package.json dependencies.
- **Status:** Pending

---

### Task 01.01.02: Create DraggableSeedItem component

- **Description:** Create `shared/DraggableSeedItem.jsx` — a sortable row with `useSortable()` hook, drag handle (GripVertical), seed number badge, team logo/name, and up/down fallback buttons.
- **Expected Output:** Reusable sortable seed item component.
- **Status:** Pending

---

### Task 01.01.03: Refactor SeedOrderManager with DndContext

- **Description:** Replace the seeds.map in SeedOrderManager with `<DndContext>` + `<SortableContext>` wrapper. `onDragEnd` calls `arrayMove()` and passes result to `onSeedsChange(newSeeds)`.
- **Expected Output:** SeedOrderManager supports both drag-and-drop and button reordering.
- **Status:** Pending

---

### Task 01.01.04: Add DragOverlay and drop indicator

- **Description:** Use `<DragOverlay>` from @dnd-kit to show a styled clone during drag. Add visual drop indicator at target position.
- **Expected Output:** Smooth visual feedback during drag operations.
- **Status:** Pending

---

### Task 01.01.05: Verify keyboard drag support

- **Description:** Verify @dnd-kit keyboard sensor works (ArrowUp/Down + Space/Enter). Add ARIA live region for position announcements.
- **Expected Output:** Full keyboard accessibility for seed reordering.
- **Status:** Pending

---

### Task 01.01.06: Apply to BracketHeader advancement seeds

- **Description:** Apply the same drag-and-drop pattern to the advancement seed reorder in BracketHeader.jsx.
- **Expected Output:** Consistent drag-and-drop in all seed ordering contexts.
- **Status:** Pending

---

### Task 01.01.07: Add i18n keys

- **Description:** Add `dragToReorder`, `movedToPosition` and update `seedOrderDesc` in en.json and ar.json.
- **Expected Output:** All new UI text is translatable.
- **Status:** Pending
