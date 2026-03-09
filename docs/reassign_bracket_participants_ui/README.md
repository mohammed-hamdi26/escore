# Reassign Bracket Participants — Dashboard UI Plan

## Overview

إضافة واجهة مستخدم في الـ Dashboard تسمح لمنظم البطولة بتبديل الفرق بين matches مختلفة في الـ bracket (خصوصًا Round Robin). الـ Backend endpoint جاهز: `POST /tournaments/:id/bracket/slots/reassign-participants`.

### Problem
- العميل مش قادر يعدل مين يلعب ضد مين بعد توليد القرعة
- الـ `swapSlotParticipantsAction` موجود في الـ server actions بس مش مستخدم في أي component
- مفيش `reassignParticipantsAction` أصلاً في الـ Dashboard

### Solution
- إنشاء server action جديد `reassignParticipantsAction`
- إضافة "Reassign" mode في `RoundRobinDisplay` — العميل يضغط على فريق في match، ثم يضغط على فريق تاني في match مختلف، والنظام يبدّلهم
- دعم نفس الـ feature في `MultiStageDisplay` (اللي فيها round robin stages)

---

## Phases

| Phase | Name | Description | Status |
|-------|------|-------------|--------|
| Phase 01 | Server Action & Translations | Add `reassignParticipantsAction` + i18n strings | Planned |
| Phase 02 | Reassign UI in RoundRobinDisplay | Interactive participant selection & swap UI | Planned |
| Phase 03 | Integration & Polish | MultiStage support, error handling, UX polish | Planned |

---

## Affected Files

| File | Change Type |
|------|-------------|
| `app/[locale]/_Lib/actions.js` | Add `reassignParticipantsAction` |
| `messages/en.json` | Add reassign-related translation keys |
| `messages/ar.json` | Add reassign-related translation keys |
| `components/Tournaments Management/bracket-display/RoundRobinDisplay.jsx` | Add reassign mode + UI |
| `components/Tournaments Management/bracket-display/MultiStageDisplay.jsx` | Pass reassign props to RoundRobinDisplay |

---

## UX Flow

1. منظم البطولة يضغط زرار "Reassign Teams" (toggle button بجانب View Toggle)
2. الـ match cards بتتحول لـ selectable mode — كل فريق فيه hover effect
3. يضغط على أول فريق → يتحدد (highlighted)
4. يضغط على تاني فريق → confirmation dialog يظهر
5. بعد التأكيد → API call → refresh bracket
6. ممكن يلغي الاختيار بالضغط على نفس الفريق أو زرار Cancel

---

## Tracking

See [EXECUTION_STATE.md](./EXECUTION_STATE.md) for real-time execution tracking.
