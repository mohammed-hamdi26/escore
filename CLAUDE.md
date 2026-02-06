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

**Server Actions**: All mutations go through `app/[locale]/_Lib/actions.js` (marked `"use server"`). Pattern: build FormData/object → call apiClient → `revalidatePath` or `redirect`. The `cleanNullValues()` helper strips null/undefined/empty values before API calls.

**Authentication**: JWT token encrypted with AES-256-GCM and stored in httpOnly cookie named "session". `apiClient` automatically attaches Bearer token via request interceptor. The response interceptor sets `isAuthError` flag on 401/403 responses. `middleware.js` guards `/dashboard/*` routes and redirects unauthenticated users to login.

**Data Fetching**: API functions in `_Lib/*Api.js` build `URLSearchParams` for filtering/pagination and return `res.data.data`. Page components use `Promise.all()` for parallel data fetching. Search params in pages use `await searchParams` (Next.js 16 async pattern).

**Forms**: Formik + Yup validation. Custom inputs in `components/ui app/` accept `formik` prop and call `formik.setFieldValue(name, value)` internally. Standard controlled inputs use `formik.handleChange`/`formik.handleBlur`. Errors display when both `formik.touched[name]` and `formik.errors[name]` are truthy. Translation function `t` is passed to inputs for localizing error messages.

**Data Tables**: @tanstack/react-table with `DataTable` component wrapping `useReactTable` + `getCoreRowModel`. Column definitions use `accessorKey` for data columns and `id` for custom cells (actions).

**Styling**: Tailwind CSS v4 with `cn()` utility from `lib/utils.js` (`twMerge(clsx(inputs))`). Theme uses CSS custom properties in `globals.css` with light/dark mode variants. RTL support via `rtl:` prefix classes.

**Notifications**: `react-hot-toast` for success/error toasts in form submissions.

### Environment Variables
- `NEXT_PUBLIC_BASE_URL` - Backend API base URL (API path: `/api/v1`)
- `SESSION_SECRET` or `NEXTAUTH_SECRET` - Used for AES-256-GCM encryption of session tokens

### Internationalization
Locales: `en` (default), `ar`. All routes are always prefixed with locale. Server components use `await getLocale()`. Client components use `useTranslations()` hook from `next-intl`. Use `Link` and `redirect` from `@/i18n/navigation` for locale-aware navigation.

### Role-Based Permissions
User roles: `user`, `admin`, `content`, `support`. Permission system in `contexts/PermissionsContext.jsx` with entities (Game, Team, Player, Tournament, Match, News, Transfer, Standing, Settings, Support, User, Avatar) and actions (create, read, update, delete). Admins have all permissions automatically.

Usage in client components:
- `usePermissions()` hook → `hasPermission(entity, action)`, `canCreate(entity)`, `canRead(entity)`, `canUpdate(entity)`, `canDelete(entity)`, `isAdmin`
- `<PermissionGate entity="..." action="..." fallback={...}>` for conditional rendering
- Shorthand gates: `<CreateGate>`, `<ReadGate>`, `<UpdateGate>`, `<DeleteGate>`, `<AdminGate>`, `<EntityGate>`

### Important
- بعد كدا متعملش كوميت ولا بوش الا لما تستأذن (Don't commit or push without asking first)