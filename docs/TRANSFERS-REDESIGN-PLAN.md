# Transfers Management Redesign Plan

## Overview
إعادة تصميم صفحة إدارة الانتقالات لتدعم جميع مميزات الـ API وتحسين تجربة المستخدم مع دعم الوضع الليلي والترجمة.

## Backend API Features (Available)

### Transfer Types
- `transfer` - انتقال عادي
- `loan` - إعارة
- `free_agent` - لاعب حر
- `retirement` - اعتزال
- `return_from_loan` - عودة من إعارة

### Transfer Status
- `rumor` - شائعة
- `pending` - قيد الانتظار
- `confirmed` - مؤكد
- `cancelled` - ملغي

### Endpoints
1. `GET /transfers` - قائمة الانتقالات مع فلاتر
2. `GET /transfers/recent` - الانتقالات الأخيرة المؤكدة
3. `GET /transfers/rumors` - الشائعات
4. `GET /transfers/player/:playerId` - انتقالات لاعب
5. `GET /transfers/team/:teamId` - انتقالات فريق
6. `GET /transfers/:id` - تفاصيل انتقال
7. `POST /transfers` - إنشاء انتقال
8. `PUT /transfers/:id` - تعديل انتقال
9. `DELETE /transfers/:id` - حذف انتقال
10. `PATCH /transfers/:id/status` - تغيير الحالة
11. `PATCH /transfers/:id/confirm` - تأكيد الانتقال وتحديث فريق اللاعب

### Filter Parameters
- `player` - معرف اللاعب
- `fromTeam` - الفريق المنتقل منه
- `toTeam` - الفريق المنتقل إليه
- `team` - أي فريق (منه أو إليه)
- `game` - اللعبة
- `type` - نوع الانتقال
- `status` - حالة الانتقال
- `isActive` - نشط أم لا
- `dateFrom` - من تاريخ
- `dateTo` - إلى تاريخ

## Implementation Tasks

### 1. Update API Layer
- [ ] Update `transferApi.js` with all filter parameters
- [ ] Add `getRecentTransfers()` function
- [ ] Add `getTransferRumors()` function
- [ ] Add stats function for dashboard

### 2. Update Server Actions
- [ ] Add `updateTransferStatus()` action
- [ ] Add `confirmTransfer()` action
- [ ] Update `addTransfer()` with all fields
- [ ] Update `editTransfer()` with all fields

### 3. Create New Components

#### TransfersStatsCards.jsx
- Total Transfers
- Confirmed
- Pending
- Rumors
- Cancelled

#### TransfersFilter.jsx (Enhanced)
- Search input
- Status filter dropdown
- Type filter dropdown
- Game filter dropdown
- Date range filter
- Clear filters button

#### TransfersBadges.jsx
- StatusBadge (color-coded)
- TypeBadge (with icons)

#### TransfersTable.jsx (Redesigned)
- Player (with photo)
- From Team (with logo)
- To Team (with logo)
- Type badge
- Status badge
- Fee
- Date
- Actions (View, Edit, Delete, Quick Status Change)

#### TransferDetailsModal.jsx
- Full transfer details
- Status change dropdown
- Confirm button (for pending/rumor)
- Reply history (if any notes)

#### TransfersForm.jsx (Enhanced)
- Player selection
- Game selection
- Transfer Type selection
- Status selection
- From Team selection
- To Team selection
- Fee input
- Currency selection
- Contract Length input
- Transfer Date picker
- End Date picker (for loans)
- Source input
- Notes textarea
- isFeatured toggle

### 4. Update Page Structure

```
/dashboard/transfers-management/
├── page.jsx (list with stats)
├── layout.jsx
├── add/
│   └── page.jsx
└── edit/
    ├── page.jsx (redirect to list)
    └── [id]/
        └── page.jsx
```

### 5. Add Translations
- English translations in `en.json`
- Arabic translations in `ar.json`

### 6. Styling
- Support light/dark mode
- Responsive design
- Consistent with other management pages

## Files to Create/Update

### New Files
1. `components/transfers-management/TransfersStatsCards.jsx`
2. `components/transfers-management/TransfersBadges.jsx`
3. `components/transfers-management/TransferDetailsModal.jsx`

### Files to Update
1. `app/[locale]/_Lib/transferApi.js`
2. `app/[locale]/_Lib/actions.js`
3. `app/[locale]/dashboard/transfers-management/edit/page.jsx`
4. `components/transfers-management/TransfersForm.jsx`
5. `components/transfers-management/TransfersTable.jsx`
6. `components/transfers-management/TransfersFilter.jsx`
7. `messages/en.json`
8. `messages/ar.json`

## Design Reference
Following the same design patterns as Support Center:
- Stats cards at top
- Filters below stats
- Table with badges
- Modal for details
- Dark mode support
