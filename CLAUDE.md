# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
npm run dev        # Start dev server with Turbopack (http://localhost:3000)

# Build & Production
npm run build      # Build for production with Turbopack
npm start          # Run production server

# Linting
npm run lint       # Run ESLint

# Testing
npm test                        # Run all tests
npm run test:watch              # Run tests in watch mode
npm run test:coverage           # Run tests with coverage report
npx jest path/to/test.test.jsx  # Run a single test file

# E2E Testing (Playwright)
npx playwright test             # Run all e2e tests (in e2e/ directory)
npx playwright test e2e/auth.spec.ts  # Run a single e2e spec
```

## Architecture

### Overview
Escore is a Next.js 16 admin dashboard (React 19) for managing esports content (players, teams, matches, tournaments, news, transfers). It uses the App Router with locale-based routing for internationalization (English/Arabic).

### Directory Structure

- `app/[locale]/` - Locale-prefixed routes (en, ar)
  - `_Lib/` - API clients and server actions
    - `apiCLient.js` - Axios instance with auth interceptor (reads session from cookies)
    - `actions.js` - Server actions for all CRUD operations (players, teams, matches, etc.)
    - `session.js` - Session management with AES-256-GCM encryption (save/delete cookies)
    - `helps.js` - Helper utilities (pagination, date/time, select option mapping)
    - `imageSpecs.js` - Image aspect ratios and size specs per entity (mirrors backend config)
    - `*Api.js` - Data fetching functions per entity (e.g., `palyerApi.js`, `teamsApi.js`)
  - `dashboard/` - Protected admin routes (requires session cookie)
    - Entity management folders follow pattern: `add/`, `edit/`, `edit/[id]/`
    - `settings/` - App settings (appearance/themes, language/dictionary, about, privacy-policy, links)
  - Auth routes at locale root: `login/`, `register/`, `forget-password/`

- `components/` - Reusable React components
  - `ui/` - shadcn/ui primitives (button, dialog, table, etc.)
  - `ui app/` - Custom app-specific UI components (InputApp, FileInput, ComboBoxInput, etc.)
  - Entity-specific folders (e.g., `Player Management/`, `teams management/`, `Matches Management/`)

- `contexts/` - React contexts (e.g., `PermissionsContext.jsx`)

- `i18n/` - next-intl configuration
  - `routing.js` - Locale routing config (en, ar, always prefix)
  - `navigation.js` - Localized navigation helpers (Link, redirect, usePathname, useRouter)

- `messages/` - Translation files (en.json, ar.json)

- `__tests__/` - Test files (unit/ and integration/)

### Key Patterns

**Server Actions**: All mutations go through `app/[locale]/_Lib/actions.js` (marked `"use server"`). Pattern: `getLocale()` → build data object → `cleanNullValues()` → `apiClient.[method]()` → `revalidatePath()` → `redirect()`. Special action types include toggle actions (`toggleGameActive`, `toggleMatchFeatured`, etc.) and match state transitions (`startMatch`, `endMatch`, `updateMatchResult`).

**NEXT_REDIRECT handling**: When `redirect()` is called in server actions, it throws a special `NEXT_REDIRECT` error. Form submit handlers must catch this and re-throw it so Next.js can handle the redirect:
```js
try {
  await submitAction(data);
  toast.success("...");
} catch (error) {
  if (error?.digest?.startsWith("NEXT_REDIRECT")) throw error;
  toast.error(error.message);
}
```

**Authentication**: JWT token encrypted with AES-256-GCM and stored in httpOnly cookie named "session" (7-day expiry). `apiClient` automatically attaches Bearer token via request interceptor. The response interceptor sets `isAuthError` flag on 401/403 responses. `middleware.js` guards `/dashboard/*` routes (checks cookie presence) and redirects unauthenticated users to login. Already-logged-in users are redirected away from auth pages.

**Dashboard Layout Auth**: `app/[locale]/dashboard/layout.jsx` fetches the current user via `getLoginUser()`. On auth failure, it deletes the session cookie and redirects to login. Wraps children in `<PermissionsProvider user={user}>`.

**Data Fetching**: API functions in `_Lib/*Api.js` build `URLSearchParams` for filtering/pagination. List endpoints return `{ data: res.data.data, pagination: res.data.meta }`. Single entity endpoints return `res.data.data`. Page components use `Promise.all()` for parallel data fetching. Search params in pages use `await searchParams` (Next.js 16 async pattern).

**Forms**: Formik + Yup validation. Custom inputs in `components/ui app/` accept `formik` prop and call `formik.setFieldValue(name, value)` internally. Standard controlled inputs use `formik.handleChange`/`formik.handleBlur`. Errors display when both `formik.touched[name]` and `formik.errors[name]` are truthy. Translation function `t` is passed to inputs for localizing error messages. Yup validation messages use translation keys (e.g., `"fullNameRequired"`).

**Image Upload System**: `FileInput` component handles the full flow: file selection → 5MB size validation → cropper dialog → upload to backend via `uploadPhoto(formData, imageType)` → set Formik field with returned URL. The `imageType` param (e.g., `gameLogo`, `teamCover`, `playerPhoto`) controls aspect ratio locking in the cropper and backend resizing. Image specs are defined in `_Lib/imageSpecs.js` with aspect ratios (1:1, 16:9, 3:2, 2:1) and size tiers (thumbnail, medium, large).

**Data Tables**: @tanstack/react-table with `DataTable` component wrapping `useReactTable` + `getCoreRowModel`. Column definitions use `accessorKey` for data columns and `id` for custom cells (actions).

**Styling**: Tailwind CSS v4 with `cn()` utility from `lib/utils.js` (`twMerge(clsx(inputs))`). Theme uses CSS custom properties in `globals.css` with light/dark mode variants (default: dark). RTL support via `rtl:` prefix classes. Root layout sets `dir="rtl"` for Arabic locale.

**Notifications**: `react-hot-toast` for success/error toasts in form submissions.

### Entity Page Pattern

Each entity (players, teams, etc.) follows the same structure:
1. **List page** (server component): Fetches data with pagination/filters → renders `DataTable`
2. **Add page** (server component): Fetches dropdown options (games, countries, etc.) via `Promise.all()` → renders client form component
3. **Edit page** (`edit/[id]/`, server component): Fetches entity data + dropdown options → renders same form component with initial values
4. **Form component** (client component, in `components/`): Formik form with Yup schema, custom inputs, submit handler calling server action

### Helper Utilities (`_Lib/helps.js`)

- `mappedArrayToSelectOptions(array, labelKey, valueKey)` - Maps API data to `{label, value, image?}` format for select/combobox inputs
- `combineDateAndTime(date, time)` - Combines date string and "HH:MM AM/PM" time to Date object
- `getNumPages(totalItems, pageSize)` - Pagination page count
- `getFlagEmoji(countryCode)` - Converts 2-letter code to flag emoji

### Environment Variables
- `NEXT_PUBLIC_BASE_URL` - Backend API base URL (API path: `/api/v1`)
- `SESSION_SECRET` or `NEXTAUTH_SECRET` - Used for AES-256-GCM encryption of session tokens

### Internationalization
Locales: `en` (default), `ar`. All routes are always prefixed with locale (`localePrefix: "always"`). Server components use `await getLocale()`. Client components use `useTranslations()` hook from `next-intl`. Use `Link` and `redirect` from `@/i18n/navigation` for locale-aware navigation.

### Role-Based Permissions
User roles: `user`, `admin`, `content`, `support`. Permission system in `contexts/PermissionsContext.jsx` with entities (Game, Team, Player, Tournament, Match, News, Transfer, Standing, Settings, Support, User, Avatar) and actions (create, read, update, delete). Admins have all permissions automatically.

Usage in client components:
- `usePermissions()` hook → `hasPermission(entity, action)`, `canCreate(entity)`, `canRead(entity)`, `canUpdate(entity)`, `canDelete(entity)`, `isAdmin`
- `<PermissionGate entity="..." action="..." fallback={...}>` for conditional rendering
- Shorthand gates: `<CreateGate>`, `<ReadGate>`, `<UpdateGate>`, `<DeleteGate>`, `<AdminGate>`, `<EntityGate>`

### Configuration Notes
- Server actions have a 5MB body size limit (`next.config.mjs`)
- Entity management root routes (e.g., `/dashboard/players`) redirect to `/add` via next.config redirects
- Locale root (`/en/`, `/ar/`) redirects to `/dashboard`
- Playwright runs in non-headless mode with a single worker and auto-starts the dev server

### Important
- بعد كدا متعملش كوميت ولا بوش الا لما تستأذن (Don't commit or push without asking first)
- Do NOT add "Co-Authored-By" lines to commit messages
