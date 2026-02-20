# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Important

- Don't commit or push without asking first
- Do NOT add "Co-Authored-By" lines to commit messages

## Commands

```bash
# Development
npm run dev        # Start dev server with Turbopack (http://localhost:3000)

# Build & Production
npm run build      # Build for production with Turbopack
npm start          # Run production server (port 3000)

# Linting
npm run lint       # Run ESLint

# Testing (Jest + React Testing Library)
npm test                        # Run all tests
npm run test:watch              # Run tests in watch mode
npm run test:coverage           # Run tests with coverage report
npx jest path/to/test.test.jsx  # Run a single test file

# E2E Testing (Playwright)
npx playwright test             # Run all e2e tests (in e2e/ directory)
npx playwright test e2e/auth.spec.ts  # Run a single e2e spec
```

## Architecture

Next.js 16 (App Router) + React 19 admin dashboard for managing esports content. JavaScript only (no TypeScript). Tailwind CSS v4, shadcn/ui (new-york style, jsx not tsx), Formik + Yup forms, next-intl i18n, Axios HTTP client, react-hot-toast notifications.

### Path Alias

```js
"@/*" → "./*"   // maps to project root (NOT src/)

// Usage:
import apiClient from "@/app/[locale]/_Lib/apiCLient";
import { cn } from "@/lib/utils";
import { PermissionGate } from "@/contexts/PermissionsContext";
```

### Directory Structure

- `app/[locale]/` — Locale-prefixed routes (en, ar)
  - `_Lib/` — API clients and server actions (server-only)
    - `apiCLient.js` — Axios instance with auth interceptors + token refresh
    - `actions.js` — ALL server actions (`"use server"`) for every entity CRUD
    - `session.js` — AES-256-GCM session encryption (httpOnly cookies, `server-only`)
    - `helps.js` — Utility functions (pagination, date/time, select option mapping)
    - `imageSpecs.js` — Image type → aspect ratio / size specs (mirrors backend)
    - `*Api.js` — Per-entity read-only data fetching (e.g., `palyerApi.js`, `teamsApi.js`)
  - `dashboard/` — Protected admin routes (requires session cookie)
    - Entity management folders: `games-management/`, `player-management/`, `teams-management/`, `tournaments-management/`, `matches-management/`, `news/`, `clubs-management/`, `events-management/`, `transfers-management/`
    - `users/` — User management + content requests
    - `notifications/` — Send, templates, devices, history
    - `support-center/` — Support tickets
    - `settings/` — Themes, language/dictionary, about, privacy, links, avatars
  - Auth routes: `login/`, `register/`, `forget-password/`
  - `api/auth/` — Route Handlers for `refresh-session` and `force-logout`

- `components/`
  - `ui/` — shadcn/ui primitives (button, dialog, table, input, etc.)
  - `ui app/` — Custom app components (ImageUpload, InputApp, SelectInput, etc.)
  - Entity-specific folders (e.g., `games-management/`, `Tournaments Management/`, `Matches Management/`)
  - `dashboard/` — Navigation: SideNavBar, TopNav, NavItems

- `contexts/PermissionsContext.jsx` — Role-based permission context + gate components
- `i18n/` — next-intl config (routing, navigation, request)
- `messages/` — Translation files (en.json, ar.json)
- `lib/utils.js` — `cn()` utility (twMerge + clsx)
- `lib/timeUtils.js` — Racing/time formatting utilities

### Route Registration

All routes under `app/[locale]/`. Locale is always present (`localePrefix: "always"`).

**Redirects** (in `next.config.mjs`):
- `/en/`, `/ar/` → `/:locale/dashboard`
- Entity root routes (e.g., `/dashboard/matches-management`) → `/dashboard/matches-management/add`

**Route protection** (`middleware.js`):
- `/dashboard/*` requires `session` cookie → redirects to `/:locale/login` if missing
- Auth routes redirect to dashboard if session cookie present
- Proactive token refresh: checks `token_exp` cookie, redirects to `/api/auth/refresh-session?redirect=...` if expired

### Request Flow

```
Page (Server Component) → _Lib/*Api.js → apiClient.get() → Backend API
Form (Client Component) → Server Action (_Lib/actions.js) → apiClient.post/patch/delete() → Backend API
```

### Authentication & Token Refresh

**Storage:** Three httpOnly cookies — `session` (encrypted JWT, 7d), `refresh_token` (encrypted, 30d), `token_exp` (expiry timestamp).

**API Client** (`_Lib/apiCLient.js`):
- Request interceptor: decrypts `session` cookie → attaches `Authorization: Bearer <token>`
- Response interceptor: on 401, attempts `refreshSession()` with deduplication (singleton `refreshPromise`), retries original request. On failure, clears cookies and sets `error.isAuthError = true`

**Dashboard Layout** (`dashboard/layout.jsx`): Server-side auth guard — fetches user via `getLoginUser()`, redirects to `/api/auth/force-logout` on failure. Wraps children in `<PermissionsProvider user={user}>`.

**API Route Handlers:**
- `GET /api/auth/refresh-session?redirect=...` — Refreshes JWT, redirects back
- `GET /api/auth/force-logout?locale=...` — Clears all cookies, redirects to login

## Key Patterns

### Server Actions

All mutations go through `app/[locale]/_Lib/actions.js` (`"use server"`).

**Standard pattern (with redirect):**
```js
export async function addSomething(data) {
  const locale = await getLocale();
  try {
    const cleanData = cleanNullValues(data);  // strips null/undefined/"" values
    await apiClient.post("/something", cleanData);
  } catch (e) {
    throw new Error(e.response?.data?.message || "Error");
  }
  redirect(`/${locale}/dashboard/something-management`);
}
```

**Return-value pattern (no redirect):**
```js
export async function doSomething(id, data) {
  try {
    const res = await apiClient.patch(`/something/${id}`, data);
    revalidatePath(`/${locale}/dashboard/...`);
    return { success: true, data: res.data?.data };
  } catch (e) {
    return { success: false, error: e.response?.data?.message || "Failed" };
  }
}
```

**NEXT_REDIRECT handling** — form submit handlers MUST re-throw redirect errors:
```js
try {
  await submitAction(data);
  toast.success("...");
} catch (error) {
  if (error?.digest?.startsWith("NEXT_REDIRECT")) throw error;
  toast.error(error.message);
}
```

### Data Fetching

API functions in `_Lib/*Api.js` are called from server components (page.jsx files).

```js
// List: returns { data: [...], pagination: { totalPages, total, page, limit } }
const { data, pagination } = await getTournaments({ page: 1, size: 20, search: "..." });

// Parallel fetching in page components:
const [games, players, countries] = await Promise.all([
  getGames({}), getPlayers({}), getCountries(),
]);

// Next.js 16 async searchParams:
export default async function Page({ searchParams }) {
  const params = await searchParams;  // MUST await in Next.js 16
  const page = params.page || 1;
}
```

### Forms (Formik + Yup)

All forms are client components. Custom inputs accept `formik` + `name` props and call `formik.setFieldValue(name, value)` internally.

```jsx
"use client";
const formik = useFormik({
  initialValues: { name: data?.name || "" },
  validationSchema: Yup.object({ name: Yup.string().required(t("nameRequired")) }),
  onSubmit: async (values) => {
    try {
      await submitFunction(values);
      toast.success(t("success"));
    } catch (error) {
      if (error?.digest?.startsWith("NEXT_REDIRECT")) throw error;
      toast.error(error.message);
    }
  },
});
```

### Custom UI Components (`components/ui app/`)

**Image upload** — two components, different behaviors:
- `ImageUpload` — drag-and-drop zone, auto-uploads after crop. Props: `name`, `formik`, `imageType`, `enableCrop`, `compact`, `showUrlInput`, `hint`
- `FileInput` — file picker with manual upload button. Props: `name`, `formik`, `imageType`, `enableCrop`, `label`

Both use `formik.setFieldValue(name, url)` internally. `imageType` (e.g., `gameLogo`, `teamCover`, `playerPhoto`) locks crop aspect ratio.

**Form inputs** — all take `name` + `formik` props:
- `InputApp` — text input (also accepts `icon`, `error`, `type`, `label`)
- `SelectInput` — dropdown select (accepts `options: [{ value, name }]`)
- `ComboBoxInput` — multi-select combobox with badges
- `TextAreaInput` — textarea
- `DatePicker` — date picker
- `SelectDateAndTimeInput` — combined date + time picker
- `RichTextEditor` — React Quill WYSIWYG editor
- `MarkDown` — MDEditor markdown editor
- `ListInput` — list of text entries

**Exception:** `SearchableSelect` does NOT use formik — it takes `value` + `onChange` props directly.

**Layout components:**
- `FormSection` — card wrapper with title + icon (props: `title`, `icon`, `badge`)
- `FormRow` — responsive grid row (props: `cols: 1|2|3|4`, default 2)

**Permission gates** (`PermissionGate.jsx`):
```jsx
<PermissionGate entity="Game" action="create">...</PermissionGate>
<AdminGate>...</AdminGate>
<CreateGate entity="Game">...</CreateGate>
<ReadGate>, <UpdateGate>, <DeleteGate>, <EntityGate>
```

**Modals** — two patterns:
- shadcn `Dialog` (preferred for complex modals)
- Custom `Model` compound component (older pattern, uses `createPortal`):
```jsx
<Model>
  <Model.Open name="edit"><button>Open</button></Model.Open>
  <Model.Window openName="edit"><MyForm /></Model.Window>
</Model>
```

**Other:** `Pagination` (URL-based, reads `?page=`), `Table` (CSS grid-based), `Loading`, `BackPage`, `SelectSizeRows`

### Entity Page Pattern

Each entity follows:
1. **List page** (server component): fetches data with pagination/filters → renders table/cards
2. **Add page** (server component): fetches dropdown options via `Promise.all()` → renders client form
3. **Edit page** (`edit/[id]/`, server component): fetches entity + dropdown options → renders same form with `initialValues`
4. **Form component** (client, in `components/`): Formik + Yup, calls server action on submit

### URL-Based Filtering

List pages sync filters to URL search params:
```js
const updateParams = (key, value) => {
  const params = new URLSearchParams(searchParams);
  value ? params.set(key, value) : params.delete(key);
  params.set("page", "1");
  router.push(`${pathname}?${params.toString()}`);
};
```

### Internationalization

Locales: `en` (default), `ar`. RTL: root layout sets `dir="rtl"` for Arabic; use `rtl:` Tailwind prefix.

```js
// Server components:
import { getLocale, getTranslations } from "next-intl/server";
const t = await getTranslations("namespace");

// Client components:
import { useTranslations } from "next-intl";
const t = useTranslations("namespace");
```

**Always use locale-aware navigation** from `@/i18n/navigation` (NOT `next/navigation`):
```js
import { Link, redirect, usePathname, useRouter } from "@/i18n/navigation";
```

### Styling

- Tailwind CSS v4 with `cn()` utility (`twMerge(clsx(...))`)
- Dark mode default via `next-themes` (`attribute="class"`)
- Green primary: `bg-green-primary` / `text-green-primary` (`--green-primary: #289546`)
- Input convention: `bg-gray-100 dark:bg-[#1a1d2e] border-0 rounded-xl focus:ring-2 focus:ring-green-primary/50`
- Glass effect: `.glass` class (backdrop-blur + semi-transparent bg)

### Permissions

```js
const { hasPermission, canCreate, canRead, canUpdate, canDelete, isAdmin } = usePermissions();
```

Entities: `Game`, `Team`, `Club`, `Event`, `Player`, `Tournament`, `Match`, `News`, `Transfer`, `Standing`, `Settings`, `Support`, `User`, `Avatar`. Actions: `create`, `read`, `update`, `delete`. Admins bypass all checks.

## Helper Utilities

**`_Lib/helps.js`:**
- `mappedArrayToSelectOptions(array, labelKey, valueKey)` → `[{ name, value, image? }]` for select inputs
- `cleanNullValues(data)` — strips null/undefined/"" before sending to API
- `combineDateAndTime(date, time)` — merges date + "HH:MM AM/PM" into Date
- `getNumPages(totalItems, pageSize)` — pagination page count
- `getFlagEmoji(countryCode)` — 2-letter ISO code → flag emoji

**`lib/timeUtils.js`** (racing/time competitions):
- `formatTimeMs(ms)` → `"1:33.450"`, `parseTimeString(str)` → ms, `formatGap(gapMs)` → `"+1.650"`

## Environment Variables

```bash
NEXT_PUBLIC_BASE_URL=https://api.escore.app   # Backend API (path: /api/v1)
SESSION_SECRET=...                             # AES-256-GCM encryption key
# Fallback: NEXTAUTH_SECRET if SESSION_SECRET not set
```

## Deployment

**Production:** `/var/www/escore-frontend` (NOT escore-dashboard) on `207.154.255.80`

```bash
ssh root@207.154.255.80 "cd /var/www/escore-frontend && git pull origin master && npm install && npm run build && pm2 restart escore-frontend"
```

- Dashboard repo pushes to `master` branch (not `main`)
- PM2 process name: `escore-frontend`
- Domain: `dashboard.escore.app`

## Testing

**Jest + React Testing Library:** Config in `jest.config.js` (uses `next/jest`, jsdom). Setup: `jest.setup.js` imports `@testing-library/jest-dom`. Tests in `__tests__/unit/` and `__tests__/integration/`.

**Playwright E2E:** Config in `playwright.config.ts`. Tests in `e2e/`. Runs non-headless, single worker, auto-starts dev server.

## Gotchas

- `palyerApi.js` has a typo in the filename — do NOT rename it (would break imports everywhere)
- `apiCLient.js` also has inconsistent casing — do NOT rename
- `session.js` is marked `server-only` — cannot be imported in client components
- `components.json` (shadcn config): `jsx: true` (not tsx), `style: "new-york"`, aliases use `@/`
- Server actions body size limit: 5MB (in `next.config.mjs`)
