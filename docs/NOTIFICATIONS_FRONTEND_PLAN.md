# Notifications Management - Frontend Implementation Plan

## Overview

هذه الخطة تشرح تنفيذ صفحة إدارة الإشعارات (Notifications Management) للأدمن في لوحة التحكم. ستتيح للأدمن:
1. إرسال إشعارات للمستخدمين
2. عرض الأجهزة المسجلة
3. عرض الإحصائيات
4. عرض سجل الإشعارات المرسلة

---

## Backend API Endpoints (Available)

### Admin Endpoints:
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/admin/notifications/send` | إرسال إشعار |
| GET | `/api/v1/admin/notifications/stats` | إحصائيات الإشعارات |
| GET | `/api/v1/admin/notifications/devices` | الأجهزة المسجلة |

### Send Notification Target Types:
- `topic` - إرسال لـ topic معين
- `all` - إرسال لكل المستخدمين
- `users` - إرسال لمستخدمين محددين
- `segment` - إرسال لشريحة معينة (followers، platform، lastActiveWithin)

---

## File Structure

```
escore-1/
├── app/[locale]/dashboard/
│   └── notifications/
│       ├── layout.jsx                    # Layout with header
│       ├── page.jsx                      # Main dashboard (stats overview)
│       ├── send/
│       │   └── page.jsx                  # Send notification form
│       └── devices/
│           └── page.jsx                  # Registered devices list
│
├── app/[locale]/_Lib/
│   └── notificationsApi.js               # API functions
│
├── components/notifications/
│   ├── NotificationsDashboard.jsx        # Stats cards & overview
│   ├── SendNotificationForm.jsx          # Send form component
│   ├── DevicesTable.jsx                  # Devices table
│   ├── TargetSelector.jsx                # Target type selector
│   ├── SegmentFilters.jsx                # Segment filters (games, teams, etc.)
│   └── StatsCards.jsx                    # Statistics cards
│
└── messages/
    ├── en.json                           # English translations
    └── ar.json                           # Arabic translations
```

---

## Implementation Steps

### Step 1: API Functions (`notificationsApi.js`)

```javascript
// Functions to implement:
- getNotificationStats(startDate?, endDate?)
- getRegisteredDevices(page, limit, filters?)
- sendNotification(target, notification, options?)
- getGames()      // For segment filters
- getTeams()      // For segment filters
- getTournaments() // For segment filters
- getUsers()      // For specific users selection
```

### Step 2: Layout (`notifications/layout.jsx`)

- Header with "Notifications" title
- Navigation tabs: Dashboard | Send | Devices
- Breadcrumb navigation

### Step 3: Dashboard Page (`notifications/page.jsx`)

**Features:**
- Stats cards showing:
  - Total Sent
  - Total Delivered
  - Total Clicked
  - Delivery Rate %
  - Click Rate %
- Device stats:
  - Total devices
  - Active devices
  - By platform (iOS, Android, Web)
- Date range filter
- Quick action buttons

### Step 4: Send Notification Page (`notifications/send/page.jsx`)

**Features:**
- Target type selector (Radio/Tabs):
  - All Users
  - Specific Topic
  - Specific Users
  - Segment (with filters)

- Notification content form:
  - Title (required)
  - Body (required)
  - Image URL (optional)
  - Custom data (key-value pairs)

- Options:
  - Priority (high/normal)
  - TTL (time to live)
  - Dry run toggle (test mode)

- Preview section

### Step 5: Devices Page (`notifications/devices/page.jsx`)

**Features:**
- Table with columns:
  - User (email, username)
  - Device Type (iOS/Android/Web with icons)
  - Device Name
  - App Version
  - Last Active
  - Status (Active/Inactive)
- Filters:
  - Device type
  - Active status
- Pagination
- Search by user email

---

## UI Components Details

### TargetSelector Component
```jsx
// Options:
// 1. All Users - Simple, no extra fields
// 2. Topic - Text input for topic name
// 3. Specific Users - Multi-select with user search
// 4. Segment - Opens SegmentFilters component
```

### SegmentFilters Component
```jsx
// Filters:
// - followsGame: Multi-select games
// - followsTeam: Multi-select teams
// - followsTournament: Multi-select tournaments
// - platform: Checkboxes (ios, android, web)
// - lastActiveWithin: Number input (days)
```

### StatsCards Component
```jsx
// Cards with icons:
// - Sent: Mail icon
// - Delivered: Check icon
// - Clicked: Mouse pointer icon
// - Delivery Rate: Percent icon
// - Click Rate: Target icon
```

---

## Translations Keys

```json
{
  "Notifications": {
    "title": "Notifications Management",
    "dashboard": "Dashboard",
    "send": "Send Notification",
    "devices": "Registered Devices",
    "stats": {
      "totalSent": "Total Sent",
      "totalDelivered": "Total Delivered",
      "totalClicked": "Total Clicked",
      "deliveryRate": "Delivery Rate",
      "clickRate": "Click Rate",
      "totalDevices": "Total Devices",
      "activeDevices": "Active Devices"
    },
    "target": {
      "type": "Target Type",
      "all": "All Users",
      "topic": "Topic",
      "users": "Specific Users",
      "segment": "Segment"
    },
    "form": {
      "title": "Notification Title",
      "body": "Notification Body",
      "imageUrl": "Image URL",
      "priority": "Priority",
      "high": "High",
      "normal": "Normal",
      "send": "Send Notification",
      "sending": "Sending...",
      "success": "Notification sent successfully",
      "error": "Failed to send notification"
    },
    "segment": {
      "followsGame": "Follows Game",
      "followsTeam": "Follows Team",
      "followsTournament": "Follows Tournament",
      "platform": "Platform",
      "lastActiveWithin": "Active within (days)"
    },
    "devices": {
      "user": "User",
      "deviceType": "Device Type",
      "deviceName": "Device Name",
      "appVersion": "App Version",
      "lastActive": "Last Active",
      "status": "Status",
      "active": "Active",
      "inactive": "Inactive"
    }
  }
}
```

---

## Dashboard Card Link

Add to `dashboard/page.jsx`:
```jsx
{
  title: "Notifications",
  href: "/notifications",
  description: "Send push notifications and manage registered devices",
  icon: <Bell width="57" height="56" />,
  isShowed: user.role === "admin" ? true : false,
}
```

---

## Validation (Yup Schema)

```javascript
const sendNotificationSchema = Yup.object({
  targetType: Yup.string()
    .oneOf(['all', 'topic', 'users', 'segment'])
    .required(),
  topic: Yup.string().when('targetType', {
    is: 'topic',
    then: Yup.string().required('Topic is required'),
  }),
  userIds: Yup.array().when('targetType', {
    is: 'users',
    then: Yup.array().min(1, 'Select at least one user'),
  }),
  title: Yup.string().required('Title is required').max(100),
  body: Yup.string().required('Body is required').max(500),
  imageUrl: Yup.string().url('Must be a valid URL').nullable(),
});
```

---

## Workflow After Implementation

1. Admin يفتح `/dashboard/notifications`
2. يشوف الإحصائيات (كام إشعار اتبعت، كام واحد فتحه، إلخ)
3. يضغط "Send Notification"
4. يختار نوع الـ target:
   - كل المستخدمين
   - Topic معين
   - مستخدمين محددين
   - شريحة معينة (اللي بيتابعوا لعبة معينة مثلاً)
5. يكتب العنوان والمحتوى
6. يضغط Send
7. يشوف رسالة نجاح مع عدد اللي وصلهم الإشعار

---

## Priority Order

1. **Phase 1 (MVP)**:
   - API functions
   - Send notification page (all users + topic)
   - Basic stats display

2. **Phase 2**:
   - Devices table
   - Segment targeting
   - Advanced filters

3. **Phase 3**:
   - Charts for stats
   - Export functionality
   - Notification templates
