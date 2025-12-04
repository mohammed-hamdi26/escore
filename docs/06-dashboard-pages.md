# صفحات لوحة التحكم - Dashboard Pages

## هيكل المسارات

```
app/[locale]/dashboard/
├── page.jsx                           # الصفحة الرئيسية
├── layout.jsx                         # تخطيط Dashboard
├── loading.jsx                        # شاشة التحميل
├── change-password/                   # تغيير كلمة المرور
├── player-management/                 # إدارة اللاعبين
├── teams-management/                  # إدارة الفرق
├── games-management/                  # إدارة الألعاب
├── matches-management/                # إدارة المباريات
├── tournaments-management/            # إدارة البطولات
├── news/                              # إدارة الأخبار
├── transfers-management/              # إدارة الانتقالات
├── users/                             # إدارة المستخدمين
├── support-center/                    # الدعم الفني
└── settings/                          # الإعدادات
```

---

## الصفحة الرئيسية

**المسار:** `/[locale]/dashboard`
**الملف:** `app/[locale]/dashboard/page.jsx`

تعرض بطاقات الخدمات المتاحة:
- إدارة اللاعبين
- إدارة الفرق
- إدارة الألعاب
- إدارة المباريات
- إدارة البطولات
- إدارة الأخبار
- إدارة الانتقالات
- إدارة المستخدمين
- الدعم الفني
- الإعدادات

---

## إدارة اللاعبين

### بنية المجلد
```
player-management/
├── layout.jsx
├── add/page.jsx
├── edit/
│   ├── page.jsx
│   └── [id]/page.jsx
├── awards/[id]/page.jsx
├── favorites-characters/[id]/page.jsx
└── links/[id]/page.jsx
```

### الصفحات

| المسار | الوصف | البيانات المطلوبة |
|--------|-------|-------------------|
| `/add` | إضافة لاعب جديد | teams, games, countries |
| `/edit` | عرض جميع اللاعبين | players (paginated) |
| `/edit/[id]` | تعديل لاعب | player, teams, games, countries |
| `/awards/[id]` | جوائز اللاعب | player, awards |
| `/favorites-characters/[id]` | شخصيات مفضلة | player, characters |
| `/links/[id]` | روابط اللاعب | player, links |

### نموذج اللاعب
```javascript
{
  name: string,
  age: number,
  country: { code: string },
  team: { id: number },
  game: { id: number },
  images: string[],
  // ...
}
```

---

## إدارة الفرق

### بنية المجلد
```
teams-management/
├── layout.jsx
├── add/page.jsx
├── edit/
│   ├── page.jsx
│   └── [id]/page.jsx
├── awards/[id]/page.jsx
└── links/[id]/page.jsx
```

### الصفحات

| المسار | الوصف | البيانات المطلوبة |
|--------|-------|-------------------|
| `/add` | إضافة فريق جديد | games, countries |
| `/edit` | عرض جميع الفرق | teams (paginated) |
| `/edit/[id]` | تعديل فريق | team, games, countries |
| `/awards/[id]` | جوائز الفريق | team, awards |
| `/links/[id]` | روابط الفريق | team, links |

### نموذج الفريق
```javascript
{
  name: string,
  country: { code: string },
  game: { id: number },
  logo: string,
  images: string[],
  // ...
}
```

---

## إدارة الألعاب

### بنية المجلد
```
games-management/
├── layout.jsx
├── add/page.jsx
└── edit/
    ├── page.jsx
    └── [id]/page.jsx
```

### الصفحات

| المسار | الوصف |
|--------|-------|
| `/add` | إضافة لعبة جديدة |
| `/edit` | عرض جميع الألعاب |
| `/edit/[id]` | تعديل لعبة |

### نموذج اللعبة
```javascript
{
  name: string,
  description: string,
  icon: string,
  // ...
}
```

---

## إدارة المباريات

### بنية المجلد
```
matches-management/
├── layout.jsx
├── add/page.jsx
├── edit/
│   ├── page.jsx
│   ├── columns.jsx      # تعريف أعمدة الجدول
│   ├── data-table.jsx   # جدول البيانات
│   └── [id]/page.jsx
└── players/page.jsx     # تشكيلة الفرق
```

### الصفحات

| المسار | الوصف | البيانات المطلوبة |
|--------|-------|-------------------|
| `/add` | إضافة مباراة جديدة | teams, tournaments, games |
| `/edit` | عرض جميع المباريات | matches (paginated) |
| `/edit/[id]` | تعديل مباراة | match, teams, tournaments |
| `/players` | تشكيلات الفرق | match, lineups |

### نموذج المباراة
```javascript
{
  team1: { id: number },
  team2: { id: number },
  tournament: { id: number },
  game: { id: number },
  date: string,
  time: string,
  stage: string,  // "QUARTER_FINAL", "SEMI_FINAL", "FINAL"
  // ...
}
```

### حالات المباراة (Stage)
- `GROUP_STAGE` - مرحلة المجموعات
- `ROUND_OF_16` - دور الـ 16
- `QUARTER_FINAL` - ربع النهائي
- `SEMI_FINAL` - نصف النهائي
- `FINAL` - النهائي

---

## إدارة البطولات

### بنية المجلد
```
tournaments-management/
├── layout.jsx
├── add/page.jsx
└── edit/
    ├── page.jsx
    └── [id]/page.jsx
```

### الصفحات

| المسار | الوصف | البيانات المطلوبة |
|--------|-------|-------------------|
| `/add` | إضافة بطولة | games, teams |
| `/edit` | عرض البطولات | tournaments |
| `/edit/[id]` | تعديل بطولة | tournament, games, teams |

### نموذج البطولة
```javascript
{
  name: string,
  startDate: string,
  endDate: string,
  game: { id: number },
  champion: { id: number },  // الفريق الفائز
  teams: [{ id: number }],
  // ...
}
```

---

## إدارة الأخبار

### بنية المجلد
```
news/
├── layout.jsx
├── add/page.jsx
└── edit/
    ├── page.jsx
    └── [id]/page.jsx
```

### الصفحات

| المسار | الوصف | البيانات المطلوبة |
|--------|-------|-------------------|
| `/add` | إضافة خبر | players, teams, tournaments |
| `/edit` | عرض الأخبار | news (paginated) |
| `/edit/[id]` | تعديل خبر | newsItem, players, teams |

### نموذج الخبر
```javascript
{
  title: string,
  description: string,
  image: string,
  video: string,
  status: "DRAFT" | "PUBLISHED",
  publishDate: string,
  author: string,
  relatedPlayers: [{ id: number }],
  relatedTeams: [{ id: number }],
  // ...
}
```

---

## إدارة الانتقالات

### بنية المجلد
```
transfers-management/
├── layout.jsx
├── add/page.jsx
└── edit/
    ├── page.jsx
    └── [id]/page.jsx
```

### الصفحات

| المسار | الوصف | البيانات المطلوبة |
|--------|-------|-------------------|
| `/add` | إضافة انتقال | players, teams |
| `/edit` | عرض الانتقالات | transfers |
| `/edit/[id]` | تعديل انتقال | transfer, players, teams |

### نموذج الانتقال
```javascript
{
  player: { id: number },
  fromTeam: { id: number },
  toTeam: { id: number },
  date: string,
  fee: number,
  // ...
}
```

---

## إدارة المستخدمين

### بنية المجلد
```
users/
├── page.jsx
├── add/page.jsx
└── [userId]/
    ├── layout.jsx
    ├── edit/page.jsx
    ├── following-players/page.jsx
    └── following-teams/page.jsx
```

### الصفحات

| المسار | الوصف |
|--------|-------|
| `/` | عرض جميع المستخدمين |
| `/add` | إضافة مستخدم جديد |
| `/[userId]/edit` | تعديل مستخدم |
| `/[userId]/following-players` | اللاعبين المتابَعين |
| `/[userId]/following-teams` | الفرق المتابَعة |

### نموذج المستخدم
```javascript
{
  email: string,
  password: string,
  role: "ADMIN" | "SUPPORT" | "WRITER",
  // ...
}
```

---

## الدعم الفني

**المسار:** `/[locale]/dashboard/support-center`
**الملف:** `app/[locale]/dashboard/support-center/page.jsx`

### الوظائف
- عرض تذاكر الدعم
- الرد على التذاكر
- تغيير حالة التذكرة

### نموذج التذكرة
```javascript
{
  id: number,
  userMessage: string,
  adminReply: string,
  status: "OPEN" | "CLOSED",
  createdAt: string,
  // ...
}
```

---

## الإعدادات

### بنية المجلد
```
settings/
├── page.jsx                    # الصفحة الرئيسية
├── language/
│   ├── page.jsx               # إدارة اللغات
│   ├── [dictionary]/page.jsx  # قاموس اللغة
│   └── _components/
├── apperance/
│   ├── page.jsx               # إدارة الثيمات
│   └── _components/
├── about/
│   ├── page.jsx               # صفحة من نحن
│   ├── loading.jsx
│   └── _components/
├── privacy-policy/
│   ├── page.jsx               # سياسة الخصوصية
│   ├── loading.jsx
│   └── _components/
└── links/page.jsx             # روابط التطبيق
```

### صفحات الإعدادات

#### اللغات (`/settings/language`)
- إضافة/تعديل/حذف اللغات
- إدارة القاموس لكل لغة

#### الثيمات (`/settings/apperance`)
- إنشاء ثيمات جديدة
- تخصيص الألوان
- تعديل/حذف الثيمات

#### من نحن (`/settings/about`)
- تحرير محتوى "من نحن" لكل لغة
- محرر Markdown

#### سياسة الخصوصية (`/settings/privacy-policy`)
- تحرير سياسة الخصوصية لكل لغة
- محرر Markdown

#### روابط التطبيق (`/settings/links`)
- روابط التواصل الاجتماعي
- إضافة/تعديل/حذف الروابط

---

## تغيير كلمة المرور

**المسار:** `/[locale]/dashboard/change-password`
**الملف:** `app/[locale]/dashboard/change-password/page.jsx`

### النموذج
```javascript
{
  currentPassword: string,
  newPassword: string,
  confirmPassword: string,
}
```

---

## أنماط الصفحات

### صفحة عرض قائمة (List Page)
```jsx
// page.jsx
export default async function PlayersPage({ searchParams }) {
  const players = await getPlayers(searchParams);
  const teams = await getTeams();
  const games = await getGames();

  return (
    <div>
      <BackPage title="إدارة اللاعبين" />
      <FilterPlayers teams={teams} games={games} />
      <PlayersTable players={players} />
    </div>
  );
}
```

### صفحة إضافة (Add Page)
```jsx
// add/page.jsx
export default async function AddPlayerPage() {
  const teams = await getTeams();
  const games = await getGames();
  const countries = await getCountries();

  return (
    <div>
      <BackPage title="إضافة لاعب" />
      <PlayerFrom
        teams={teams}
        games={games}
        countries={countries}
      />
    </div>
  );
}
```

### صفحة تعديل (Edit Page)
```jsx
// edit/[id]/page.jsx
export default async function EditPlayerPage({ params }) {
  const { id } = params;
  const player = await getPlayer(id);
  const teams = await getTeams();
  const games = await getGames();
  const countries = await getCountries();

  return (
    <div>
      <BackPage title="تعديل لاعب" />
      <PlayerFrom
        initialValues={player}
        teams={teams}
        games={games}
        countries={countries}
      />
    </div>
  );
}
```

### Layout مع Tabs
```jsx
// layout.jsx
export default function PlayerLayout({ children }) {
  return (
    <div>
      <TabsNavigation
        tabs={[
          { label: "إضافة", href: "/add" },
          { label: "تعديل", href: "/edit" },
        ]}
      />
      {children}
    </div>
  );
}
```
