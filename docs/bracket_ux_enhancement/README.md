# Bracket UX Enhancement

## Overview
Improve the bracket/tournament management UX in the dashboard to make daily administration faster and more intuitive.

## Pain Points Addressed
1. **SeedOrderManager**: GripVertical icon implies drag but only has up/down buttons
2. **Round Robin groups**: Team assignment requires individual clicks
3. **Custom bracket match entry**: 3-5 dialogs per match result
4. **No bracket preview**: Can't see structure before irreversible generation
5. **Swiss config**: Unintuitive parameters with no explanation
6. **Bracket display**: No zoom, no minimap, painful horizontal scrolling on mobile

## Phases

### Phase 01: High-Impact Quick Wins (Low Risk)
- **M01**: SeedOrderManager drag-and-drop (@dnd-kit)
- **M02**: Bracket generation confirmation dialog
- **M03**: Tooltips, presets & help text

### Phase 02: Medium Complexity Improvements
- **M01**: Round Robin auto-distribute & group drag
- **M02**: Inline match editing for custom brackets
- **M03**: Swiss config guided setup (wizard)

### Phase 03: Advanced UX
- **M01**: Bracket preview before generation
- **M02**: Bracket display zoom & navigation
- **M03**: Mobile-optimized bracket view

## Technical Notes
- Dashboard: Next.js 16, React 19, JavaScript, shadcn/ui, Tailwind CSS
- New dependency: `@dnd-kit/core` + `@dnd-kit/sortable` + `@dnd-kit/utilities` (~12KB gzip)
- ~50-60 new i18n keys in `messages/en.json` and `messages/ar.json`
- All changes are frontend-only (no backend changes needed)
