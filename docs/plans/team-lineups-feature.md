# خطة تنفيذ صفحة Lineups للفرق

## نظرة عامة

إضافة صفحة لعرض تشكيلات الفريق (Lineups) داخل قسم إدارة الفرق، تعرض اللاعبين المنتمين للفريق مع إمكانية إدارتهم.

## المتطلبات

### الوظيفية
1. عرض جميع اللاعبين المنتمين للفريق
2. عرض معلومات اللاعب (الصورة، الاسم، الدور، الدولة، العمر)
3. إمكانية التنقل لصفحة تعديل اللاعب
4. دعم الـ RTL والترجمة

### API المستخدم
- **GET `/api/v1/players?team.id.equals={teamId}`** - جلب لاعبي الفريق
- **GET `/api/v1/teams/{id}`** - جلب معلومات الفريق

## هيكل الملفات

```
app/[locale]/dashboard/teams-management/
├── lineups/
│   └── [id]/
│       └── page.jsx              # صفحة عرض تشكيلة الفريق
│
components/
├── teams management/
│   ├── TeamLineupTable.jsx       # جدول عرض اللاعبين
│   └── TeamLineupHeader.jsx      # رأس الصفحة (شعار الفريق ومعلوماته)
│
__tests__/
├── unit/
│   └── TeamLineupTable.test.jsx  # اختبارات وحدة للجدول
└── integration/
    └── teamLineups.test.jsx      # اختبارات تكامل
```

## خطوات التنفيذ

### المرحلة 1: API Layer

#### 1.1 إضافة دالة جلب لاعبي الفريق
**الملف:** `app/[locale]/_Lib/palyerApi.js`

```javascript
export async function getPlayersByTeam(teamId) {
  try {
    const res = await apiClient.get(`/players`, {
      params: { "team.id.equals": teamId }
    });
    return res.data.data;
  } catch (e) {
    throw new Error("Failed to get team players");
  }
}
```

### المرحلة 2: المكونات

#### 2.1 TeamLineupHeader Component
**الملف:** `components/teams management/TeamLineupHeader.jsx`

- عرض شعار الفريق
- اسم الفريق
- الدولة
- عدد اللاعبين

#### 2.2 TeamLineupTable Component
**الملف:** `components/teams management/TeamLineupTable.jsx`

**الأعمدة:**
| العمود | الوصف |
|--------|-------|
| الصورة | صورة اللاعب |
| الاسم | nickname + fullName |
| الدور | role (Mid, AWPer, etc.) |
| الدولة | country.name + flag |
| العمر | محسوب من dateOfBirth |
| الإجراءات | زر تعديل |

### المرحلة 3: الصفحة

#### 3.1 إنشاء صفحة Lineups
**الملف:** `app/[locale]/dashboard/teams-management/lineups/[id]/page.jsx`

```jsx
// Server Component
export default async function TeamLineupsPage({ params }) {
  const { id } = await params;
  const team = await getTeam(id);
  const players = await getPlayersByTeam(id);

  return (
    <div>
      <BackPage title="Team Lineup" />
      <TeamLineupHeader team={team} playersCount={players.length} />
      <TeamLineupTable players={players} teamId={id} />
    </div>
  );
}
```

### المرحلة 4: تحديث LinksButtons

#### 4.1 إضافة استثناء لصفحة lineups
**الملف:** `components/ui app/LinksButtons.jsx`

```javascript
if (
  pathname.includes("links") ||
  pathname.includes("favorites-characters") ||
  pathname.includes("awards") ||
  pathname.includes("lineups")  // إضافة
)
  return null;
```

### المرحلة 5: الترجمة

#### 5.1 إضافة مفاتيح الترجمة
**الملفات:** `messages/en.json`, `messages/ar.json`

```json
{
  "TeamLineups": {
    "title": "Team Lineup",
    "players": "Players",
    "noPlayers": "No players in this team",
    "columns": {
      "photo": "Photo",
      "name": "Name",
      "role": "Role",
      "country": "Country",
      "age": "Age",
      "actions": "Actions"
    }
  }
}
```

## الاختبارات

### Unit Tests

#### TeamLineupTable.test.jsx
```javascript
describe('TeamLineupTable', () => {
  it('renders players correctly', () => {});
  it('shows empty state when no players', () => {});
  it('calculates age correctly', () => {});
  it('displays player info correctly', () => {});
});
```

#### TeamLineupHeader.test.jsx
```javascript
describe('TeamLineupHeader', () => {
  it('renders team info correctly', () => {});
  it('displays team logo', () => {});
  it('shows players count', () => {});
});
```

### Integration Tests

#### teamLineups.test.jsx
```javascript
describe('Team Lineups Page', () => {
  it('fetches and displays team players', () => {});
  it('navigates to player edit page', () => {});
  it('handles API errors gracefully', () => {});
});
```

## Data Flow

```
TeamLineupsPage (Server Component)
    │
    ├── getTeam(id) ─────────────────► Backend API
    │                                      │
    ├── getPlayersByTeam(id) ────────► Backend API
    │                                      │
    ▼                                      ▼
┌─────────────────────────────────────────────────┐
│  TeamLineupHeader                               │
│  ├── team.logo                                  │
│  ├── team.name                                  │
│  └── players.length                             │
├─────────────────────────────────────────────────┤
│  TeamLineupTable                                │
│  └── players.map(player => <PlayerRow />)       │
└─────────────────────────────────────────────────┘
```

## نقاط الوصول للصفحة

1. **من جدول الفرق:** زر "Lineups" في عمود الإجراءات
2. **URL مباشر:** `/[locale]/dashboard/teams-management/lineups/[teamId]`

## Dependencies

- لا توجد مكتبات جديدة مطلوبة
- يستخدم المكونات الموجودة: `Table`, `BackPage`, `Button`

## التقدير الزمني

| المرحلة | المهام |
|---------|--------|
| API Layer | 1 دالة جديدة |
| Components | 2 مكونات |
| Page | 1 صفحة |
| Tests | 4 ملفات اختبار |
| Translations | 2 ملفات |

## ملاحظات

1. الصفحة ستكون Server Component للأداء الأفضل
2. لا حاجة لـ state management - البيانات تُجلب مرة واحدة
3. يمكن إضافة pagination لاحقاً إذا كان الفريق يحتوي على عدد كبير من اللاعبين
