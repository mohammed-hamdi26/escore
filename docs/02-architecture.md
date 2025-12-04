# البنية المعمارية - Architecture

## نظرة عامة على البنية

```
┌─────────────────────────────────────────────────────────────┐
│                      Next.js App Router                      │
├─────────────────────────────────────────────────────────────┤
│  Middleware (Auth + i18n)                                    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │   Layout     │    │    Pages     │    │  Components  │  │
│  │  (locale)    │ -> │  (dashboard) │ -> │   (feature)  │  │
│  └──────────────┘    └──────────────┘    └──────────────┘  │
│                              │                               │
│                              v                               │
│                     ┌──────────────┐                        │
│                     │  Server      │                        │
│                     │  Actions     │                        │
│                     └──────────────┘                        │
│                              │                               │
│                              v                               │
│                     ┌──────────────┐                        │
│                     │  API Client  │                        │
│                     │   (Axios)    │                        │
│                     └──────────────┘                        │
│                              │                               │
└──────────────────────────────│───────────────────────────────┘
                               │
                               v
                    ┌──────────────────┐
                    │   Backend API    │
                    │  (External)      │
                    └──────────────────┘
```

## طبقات التطبيق

### 1. طبقة التوجيه (Routing Layer)

#### Middleware (`middleware.js`)
```javascript
// الوظائف:
// 1. حماية مسارات dashboard
// 2. إعادة توجيه غير المسجلين إلى /login
// 3. معالجة اللغات عبر next-intl
```

#### App Router Structure
```
app/
└── [locale]/                    # Dynamic locale segment
    ├── layout.jsx               # Root layout (RTL/LTR)
    ├── page.jsx                 # Home redirect
    ├── login/page.jsx           # Public
    ├── register/                # Public
    │   ├── form/page.jsx
    │   └── code-verification/page.jsx
    └── dashboard/               # Protected
        ├── layout.jsx           # Dashboard layout
        └── [feature]/           # Feature routes
```

### 2. طبقة البيانات (Data Layer)

#### API Client (`app/[locale]/_Lib/apiClient.js`)
```javascript
// - Axios instance
// - Base URL from env
// - Auto-attach Bearer token
// - Request interceptor
```

#### API Modules (`app/[locale]/_Lib/*Api.js`)
```
_Lib/
├── apiClient.js          # Axios client
├── session.js            # Cookie management
├── actions.js            # Server actions
├── helps.js              # Utilities
├── palyerApi.js          # Players API
├── teamsApi.js           # Teams API
├── matchesApi.js         # Matches API
├── gamesApi.js           # Games API
├── newsApi.js            # News API
├── tournamentsApi.js     # Tournaments API
├── transferApi.js        # Transfers API
├── usersApi.js           # Users API
├── linksApi.js           # Social Links API
├── lineupsApi.js         # Lineups API
├── themesApi.js          # Themes API
├── languageAPI.js        # Languages API
├── dictionary.js         # Dictionary API
├── aboutAPI.js           # About content API
├── PrivacyApi.js         # Privacy API
├── appLinksApi.js        # App Links API
├── countriesApi.js       # Countries (external)
└── supportCenterApi.js   # Support API
```

### 3. طبقة العرض (Presentation Layer)

#### Component Hierarchy
```
components/
├── ui/                   # Shadcn primitives
│   ├── button.jsx
│   ├── input.jsx
│   ├── dialog.jsx
│   └── ...
│
├── ui app/               # Custom app components
│   ├── InputApp.jsx
│   ├── FileInput.jsx
│   ├── Table.jsx
│   └── ...
│
├── dashboard/            # Dashboard layout
│   ├── SideNavBar.jsx
│   ├── TopNav.jsx
│   └── ...
│
└── [feature]/            # Feature components
    ├── Form.jsx
    ├── Table.jsx
    └── Filter.jsx
```

## Data Flow

### قراءة البيانات (Read)
```
Page (Server Component)
    │
    ▼
API Function (e.g., getPlayers)
    │
    ▼
API Client (axios)
    │
    ▼
Backend API
    │
    ▼
Response Data
    │
    ▼
Render Components
```

### كتابة البيانات (Write)
```
Form Submit (Client)
    │
    ▼
Server Action (e.g., addPlayer)
    │
    ▼
API Client (axios)
    │
    ▼
Backend API
    │
    ▼
revalidatePath / redirect
```

## أنماط التصميم المستخدمة

### 1. Server Components Pattern
```jsx
// الصفحات تجلب البيانات على الخادم
export default async function PlayersPage() {
  const players = await getPlayers();
  return <PlayersTable data={players} />;
}
```

### 2. Server Actions Pattern
```javascript
// actions.js
"use server";
export async function addPlayer(data) {
  await apiClient.post("/players", data);
  redirect("/dashboard/player-management/edit");
}
```

### 3. Colocated API Pattern
```
app/[locale]/dashboard/settings/language/
├── page.jsx
└── _components/
    ├── language/
    │   ├── languages-container.jsx
    │   └── languages-table.jsx
    └── dictionary/
        └── ...
```

### 4. Form Pattern
```jsx
// Using Formik + Yup
<Formik
  initialValues={...}
  validationSchema={yupSchema}
  onSubmit={handleSubmit}
>
  {/* Form fields */}
</Formik>
```

## Cache & Revalidation

### Path Revalidation
```javascript
// After mutation
revalidatePath(`/${locale}/dashboard/players/edit`);
```

### Redirect After Action
```javascript
// After creation
redirect("/dashboard/players/edit");
```

## أمان التطبيق

### 1. Route Protection
- Middleware يتحقق من session cookie
- Protected routes: `/dashboard/*`
- Public routes: `/login`, `/register`

### 2. API Authentication
- JWT token in httpOnly cookie
- Auto-attached via axios interceptor
- 7-day expiration

### 3. Cookie Settings
```javascript
{
  httpOnly: true,
  secure: true,
  sameSite: "lax",
  path: "/"
}
```
