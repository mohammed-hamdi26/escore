# Matches Management Frontend Fixes Plan

## Overview

This document outlines the issues found in the frontend matches management pages and the plan to fix them.

---

## Backend Match Features Summary

### Match Model Fields:
- `game` (required) - ObjectId
- `tournament` (optional) - ObjectId
- `team1`, `team2` (required) - ObjectIds
- `scheduledDate` (required) - Date
- `startedAt`, `endedAt` (optional) - Date
- `status` - enum: `scheduled`, `live`, `completed`, `postponed`, `cancelled`
- `result` - { team1Score, team2Score, winner?, maps? }
- `round` (optional) - string
- `matchNumber` (optional) - number
- `bestOf` (optional, default: 1) - number
- `streamUrl`, `highlightsUrl` (optional) - string URLs
- `venue` (optional) - string
- `isOnline` (optional, default: true) - **boolean**
- `isActive`, `isFeatured` (optional) - boolean
- `lineups` - array of { team: ObjectId, players: ObjectId[] }
- `viewsCount` - number

### Backend Endpoints:
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/matches` | List all matches with filters |
| GET | `/matches/:id` | Get match by ID |
| POST | `/matches` | Create match |
| PUT | `/matches/:id` | Update match |
| DELETE | `/matches/:id` | Soft delete match |
| POST | `/matches/:id/lineup` | Set lineup for a team |
| DELETE | `/matches/:id/lineup/:teamId` | Remove lineup |
| PATCH | `/matches/:id/start` | Start match (scheduled -> live) |
| PATCH | `/matches/:id/end` | End match with result |
| PATCH | `/matches/:id/result` | Update result only |
| PATCH | `/matches/:id/status` | Update status |
| PATCH | `/matches/:id/toggle-featured` | Toggle featured |

---

## Issues Found

### 1. MatchesFrom.jsx - CRITICAL

#### Issue A: Form Submit is COMMENTED OUT (Lines 189-200)
```javascript
// const matchResult = await submit(dataValues);
// formType === "add" && formik.resetForm();
// toast.success(...)
// ... all submit logic commented
```
**Impact**: Form does NOTHING when submitted!

#### Issue B: Validation Schema Mismatches Backend
| Field | Frontend | Backend | Fix |
|-------|----------|---------|-----|
| `tournament` | required | optional | Make optional |
| `round` | required | optional | Make optional |
| `startedAt` | required | optional | Make optional |
| `endedAt` | required | optional | Make optional |
| `status` | missing `postponed` | has 5 values | Add `postponed` |

#### Issue C: isOnline Type Mismatch
- **Frontend**: Uses strings `"ONLINE"` / `"OFFLINE"`
- **Backend**: Expects boolean `true` / `false`
- **Fix**: Convert before sending to API (currently done but verify)

#### Issue D: Lineup Structure Wrong
```javascript
// Current (WRONG):
players: team1Lineup.map((id) => ({ id }))  // [{id: "abc"}, {id: "def"}]

// Backend expects (CORRECT):
players: team1Lineup  // ["abc", "def"]
```

#### Issue E: Date/Time Fields Not Initialized in Edit Mode
```javascript
// Lines 93-94 - Always empty even when editing:
date: "",
time: "",
```
**Fix**: Parse `match.scheduledDate` to extract date and time

#### Issue F: Winner Calculation Doesn't Handle Draws
```javascript
// Current:
winner: dataValues.player1Score > dataValues.player2Score
  ? dataValues.team1
  : dataValues.team2,

// Fix: Handle equal scores (draw)
winner: dataValues.player1Score > dataValues.player2Score
  ? dataValues.team1
  : dataValues.player1Score < dataValues.player2Score
    ? dataValues.team2
    : undefined,  // Draw - no winner
```

#### Issue G: bestOf Validation Field Name Mismatch
- Validation uses `seriesFormat` but form uses `bestOf`

---

### 2. MatchesTable.jsx

#### Issue A: Pagination Commented Out (Line 142)
```javascript
{/* <Pagination /> */}
```

#### Issue B: FilterMatches Commented Out (Line 40)
```javascript
{/* <FilterMatches /> */}
```

#### Issue C: Lineup Dropdown Menu Commented Out (Lines 96-137)
The entire dropdown for adding lineups is commented.

#### Issue D: Typo on Line 121
```javascript
match?.teams2?.name  // WRONG
match?.team2?.name   // CORRECT
```

---

### 3. Missing Features - NOW IMPLEMENTED ✅

The following backend features have been implemented:
- [x] Toggle featured status
- [x] Start match action
- [x] End match action (via update status)
- [x] Update status action
- [x] Filter matches by status
- [x] Pagination
- [x] `isFeatured` display/toggle
- [ ] Maps/rounds results (multiple map scores) - Future enhancement
- [ ] `matchNumber` field - Future enhancement
- [ ] `isActive` field - Future enhancement

---

## Fix Plan

### Phase 1: Critical Fixes (MatchesFrom.jsx)

1. **Uncomment and fix form submit logic**
2. **Fix validation schema**:
   - Make `tournament`, `round`, `startedAt`, `endedAt` optional
   - Add `postponed` to status enum
3. **Fix lineup structure** - send array of IDs not objects
4. **Initialize date/time in edit mode**
5. **Handle draw case in winner calculation**

### Phase 2: Table Fixes (MatchesTable.jsx)

1. **Fix typo** `teams2` -> `team2`
2. **Enable pagination**
3. **Enable filtering** (optional - if FilterMatches component works)

### Phase 3: Enhancement (Optional)

1. Add status badges in table
2. Add quick actions (start/end match, toggle featured)
3. Add filtering by status

---

## Implementation Details

### Fix 1: Form Submit Logic
Location: `MatchesFrom.jsx` lines 130-204

```javascript
onSubmit: async (values) => {
  try {
    const { team1Lineup, team2Lineup, ...matchValues } = values;

    let dataValues = match ? { id: match.id, ...matchValues } : matchValues;

    // Build result object
    const team1Score = Number(dataValues.player1Score);
    const team2Score = Number(dataValues.player2Score);

    dataValues = {
      ...dataValues,
      result: {
        team1Score,
        team2Score,
        winner: team1Score > team2Score
          ? dataValues.team1
          : team1Score < team2Score
            ? dataValues.team2
            : undefined,
      },
      isOnline: dataValues.isOnline === "ONLINE",
      scheduledDate: format(
        combineDateAndTime(dataValues.date, dataValues.time),
        "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"
      ),
    };

    // Only include startedAt/endedAt if provided
    if (dataValues.startedAt) {
      dataValues.startedAt = format(
        combineDateAndTime(dataValues.date, dataValues.startedAt),
        "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"
      );
    }
    if (dataValues.endedAt) {
      dataValues.endedAt = format(
        combineDateAndTime(dataValues.date, dataValues.endedAt),
        "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"
      );
    }

    // Clean up temp fields
    delete dataValues.date;
    delete dataValues.time;
    delete dataValues.player1Score;
    delete dataValues.player2Score;

    // ACTUALLY SUBMIT!
    const matchResult = await submit(dataValues);
    const matchId = matchResult?.data?.id || matchResult?.id || match?.id;

    formType === "add" && formik.resetForm();
    toast.success(
      formType === "add" ? "The match Added" : "The Match Edited"
    );

    if (formType === "add" && matchId) {
      router.push(`/dashboard/matches-management/edit`);
    }
  } catch (error) {
    toast.error(error.message);
  }
}
```

### Fix 2: Validation Schema

```javascript
const validateSchema = Yup.object({
  date: Yup.date().required("Match date is required"),
  time: Yup.string().required("Match time is required"),

  status: Yup.string()
    .oneOf(["scheduled", "live", "completed", "postponed", "cancelled"], "Invalid status")
    .required("Status is required"),

  bestOf: Yup.number().nullable(),

  isOnline: Yup.string()
    .oneOf(["ONLINE", "OFFLINE"], "Invalid venue type")
    .required("Venue type is required"),

  player1Score: Yup.number().min(0).default(0),
  player2Score: Yup.number().min(0).default(0),

  summary: Yup.string().nullable(),

  venue: Yup.string().when("isOnline", {
    is: "OFFLINE",
    then: (schema) => schema.required("Venue is required"),
    otherwise: (schema) => schema.notRequired(),
  }),

  streamUrl: Yup.string().url("Invalid URL").nullable(),
  highlightsUrl: Yup.string().url("Invalid URL").nullable(),

  // OPTIONAL fields:
  round: Yup.string().nullable(),
  startedAt: Yup.string().nullable(),
  endedAt: Yup.string().nullable(),
  tournament: Yup.string().nullable(),

  // REQUIRED:
  game: Yup.string().required("Game is required"),
  team1: Yup.string().required("Team 1 is required"),
  team2: Yup.string().required("Team 2 is required"),
});
```

### Fix 3: Initial Values for Edit Mode

```javascript
initialValues: {
  date: match?.scheduledDate
    ? format(new Date(match.scheduledDate), "yyyy-MM-dd")
    : "",
  time: match?.scheduledDate
    ? format(new Date(match.scheduledDate), "HH:mm")
    : "",
  status: match?.status || "scheduled",
  // ... rest of values
  startedAt: match?.startedAt
    ? format(new Date(match.startedAt), "HH:mm")
    : "",
  endedAt: match?.endedAt
    ? format(new Date(match.endedAt), "HH:mm")
    : "",
  player1Score: match?.result?.team1Score || 0,
  player2Score: match?.result?.team2Score || 0,
}
```

---

## Testing After Fixes

1. [x] Create new match - verify it saves to database
2. [x] Edit existing match - verify changes persist
3. [x] Delete match - verify soft delete works
4. [ ] Set lineups - verify players are saved correctly
5. [x] Different statuses work correctly
6. [x] Date/time displays correctly in edit mode
7. [x] Draw scenario (equal scores) handled correctly

---

## Implementation Summary (Completed)

### Files Modified:
1. `components/Matches Management/MatchesFrom.jsx` - Fixed form submission, validation, and date handling
2. `components/Matches Management/MatchesTable.jsx` - Added status badges, quick actions, pagination
3. `components/Matches Management/FilterMatches.jsx` - Added status filter buttons
4. `app/[locale]/dashboard/matches-management/edit/page.jsx` - Updated to pass pagination data
5. `app/[locale]/dashboard/matches-management/add/page.jsx` - Cleaned up imports
6. `app/[locale]/_Lib/matchesApi.js` - Updated to return pagination data
7. `app/[locale]/_Lib/actions.js` - Added startMatch, endMatch, updateMatchStatus, toggleMatchFeatured
8. `messages/en.json` - Added new translation keys
9. `messages/ar.json` - Added new translation keys (Arabic)

### New Features Added:
- Status badges with colors (scheduled=blue, live=red+pulse, completed=green, etc.)
- Quick actions dropdown menu (start, end, postpone, cancel, reschedule, toggle featured, delete)
- Status filter buttons (All, Scheduled, Live, Completed, Postponed, Cancelled)
- Pagination support
- Featured indicator (star icon)
- Scores display in table
- Confirmation dialog for delete
