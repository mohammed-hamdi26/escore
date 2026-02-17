# Phase 05 — Translations & Final Polish

## Milestone 01 — Translation Keys (en + ar)

### Objective

Add all new translation keys required by Phases 01-04 to both `messages/en.json` and `messages/ar.json`. This covers competition types, participation types, scoring types, BR/FFA terminology, racing fields, form labels, validation messages, and status indicators.

### Status: `Planned`

---

### Task 5.1.1 — Add tournament form translation keys

- **Task ID:** 5.1.1
- **Description:** Add translation keys to `messages/en.json` and `messages/ar.json` for tournament form fields introduced in Phases 01-02:

  **Competition Type labels:**
  - `tournaments.competitionType` → "Competition Type" / "نوع المسابقة"
  - `tournaments.competitionTypes.standard` → "Standard" / "قياسي"
  - `tournaments.competitionTypes.battle_royale` → "Battle Royale" / "باتل رويال"
  - `tournaments.competitionTypes.fighting` → "Fighting" / "قتال"
  - `tournaments.competitionTypes.racing` → "Racing" / "سباق"
  - `tournaments.competitionTypes.ffa` → "Free For All" / "الكل ضد الكل"
  - `tournaments.competitionTypes.sports_sim` → "Sports Simulation" / "محاكاة رياضية"

  **Participation Type labels:**
  - `tournaments.participationType` → "Participation Type" / "نوع المشاركة"
  - `tournaments.participationTypes.team` → "Team-based" / "فرق"
  - `tournaments.participationTypes.player` → "Player-based (Solo)" / "لاعبين (فردي)"

  **Scoring Type labels:**
  - `tournaments.scoringType` → "Scoring Type" / "نوع التسجيل"
  - `tournaments.scoringTypes.match_based` → "Match Based" / "حسب المباراة"
  - `tournaments.scoringTypes.placement` → "Placement Based" / "حسب الترتيب"

  **Placement Config labels:**
  - `tournaments.placementConfig` → "Placement Scoring" / "نقاط الترتيب"
  - `tournaments.placementConfig.position` → "Position" / "المركز"
  - `tournaments.placementConfig.points` → "Points" / "النقاط"
  - `tournaments.placementConfig.killPoints` → "Kill Points" / "نقاط القتل"
  - `tournaments.placementConfig.addRow` → "Add Position" / "إضافة مركز"
- **Expected Output:** All tournament form labels have en/ar translations.
- **Status:** `Planned`

---

### Task 5.1.2 — Add bracket & match translation keys

- **Task ID:** 5.1.2
- **Description:** Add translation keys for bracket management and match views introduced in Phase 03:

  **Battle Royale bracket:**
  - `brackets.types.battle_royale` → "Battle Royale" / "باتل رويال"
  - `brackets.brConfig.totalRounds` → "Total Rounds" / "عدد الجولات"
  - `brackets.brConfig.teamsPerLobby` → "Teams per Lobby" / "فرق لكل لوبي"
  - `brackets.brConfig.totalLobbies` → "Total Lobbies" / "عدد اللوبيات"
  - `brackets.brConfig.eliminationRules` → "Elimination Rules" / "قواعد الإقصاء"
  - `brackets.brConfig.afterRound` → "After Round" / "بعد الجولة"
  - `brackets.brConfig.eliminateBottom` → "Eliminate Bottom" / "إقصاء الأخيرين"
  - `brackets.advanceRound` → "Advance to Next Round" / "التقدم للجولة التالية"
  - `brackets.bracketCompleted` → "Bracket Completed" / "تم اكتمال القوس"

  **Multi-participant match:**
  - `matches.multiParticipant` → "Multi-Participant Match" / "مباراة متعددة المشاركين"
  - `matches.participants` → "Participants" / "المشاركون"
  - `matches.placement` → "Placement" / "الترتيب"
  - `matches.eliminated` → "Eliminated" / "تم إقصاؤه"
  - `matches.editResults` → "Edit Results" / "تعديل النتائج"
  - `matches.saveResults` → "Save Results" / "حفظ النتائج"
  - `matches.autoCalculatePoints` → "Auto-calculate Points" / "حساب النقاط تلقائياً"
  - `matches.sortByPlacement` → "Sort by Placement" / "ترتيب حسب المركز"
- **Expected Output:** All bracket and match-related labels have en/ar translations.
- **Status:** `Planned`

---

### Task 5.1.3 — Add racing & time-based translation keys

- **Task ID:** 5.1.3
- **Description:** Add translation keys for racing/time-based fields introduced in Phase 04:

  **Racing fields:**
  - `matches.finishTime` → "Finish Time" / "وقت الوصول"
  - `matches.bestLap` → "Best Lap" / "أفضل لفة"
  - `matches.totalLaps` → "Laps" / "اللفات"
  - `matches.penalty` → "Penalty" / "عقوبة"
  - `matches.dnf` → "DNF" / "لم يكمل"
  - `matches.dsq` → "DSQ" / "مستبعد"
  - `matches.dnfFull` → "Did Not Finish" / "لم يكمل السباق"
  - `matches.dsqFull` → "Disqualified" / "مستبعد"

  **Racing standings:**
  - `standings.bestFinishTime` → "Best Time" / "أفضل وقت"
  - `standings.bestLap` → "Best Lap" / "أفضل لفة"
  - `standings.totalPenalty` → "Penalties" / "العقوبات"
  - `standings.totalLaps` → "Total Laps" / "مجموع اللفات"
  - `standings.dnfCount` → "DNFs" / "عدم إكمال"
  - `standings.dsqCount` → "DSQs" / "استبعادات"

  **Time input validation:**
  - `validation.invalidTimeFormat` → "Invalid time format. Use mm:ss.SSS" / "صيغة الوقت غير صحيحة. استخدم mm:ss.SSS"
- **Expected Output:** All racing and time-related labels have en/ar translations.
- **Status:** `Planned`

---

### Task 5.1.4 — Add filter & status translation keys

- **Task ID:** 5.1.4
- **Description:** Add translation keys for filters and status indicators:

  **Filter labels:**
  - `filters.competitionType` → "Competition Type" / "نوع المسابقة"
  - `filters.participationType` → "Participation Type" / "نوع المشاركة"
  - `filters.allCompetitionTypes` → "All Types" / "جميع الأنواع"
  - `filters.allParticipationTypes` → "All Participation" / "جميع المشاركات"

  **Status labels:**
  - `tournaments.statusLabels.team_based` → "Team" / "فرق"
  - `tournaments.statusLabels.player_based` → "Solo" / "فردي"
  - `tournaments.statusLabels.placement_scoring` → "Placement Scoring" / "نقاط الترتيب"

  Organize keys under the appropriate namespace to match existing translation structure in the project.
- **Expected Output:** All filter and status labels have en/ar translations.
- **Status:** `Planned`
