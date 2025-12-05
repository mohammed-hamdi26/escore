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
```

## Architecture

### Overview
Escore is a Next.js 15 admin dashboard for managing esports content (players, teams, matches, tournaments, news, transfers). It uses the App Router with locale-based routing for internationalization (English/Arabic).

### Directory Structure

- `app/[locale]/` - Locale-prefixed routes (en, ar)
  - `_Lib/` - API clients and server actions
    - `apiClient.js` - Axios instance with auth interceptor (reads session from cookies)
    - `actions.js` - Server actions for all CRUD operations (players, teams, matches, etc.)
    - `session.js` - Session management (save/delete cookies)
    - `*Api.js` - Data fetching functions for specific entities
  - `dashboard/` - Protected admin routes (requires session cookie)
    - Entity management folders follow pattern: `add/`, `edit/`, `edit/[id]/`
    - `settings/` - App settings (appearance/themes, language/dictionary, about, privacy-policy, links)

- `components/` - Reusable React components
  - `ui/` - shadcn/ui primitives (button, dialog, table, etc.)
  - `ui app/` - Custom app-specific UI components (InputApp, FileInput, ComboBoxInput, etc.)
  - Entity-specific folders (e.g., `Player Management/`, `teams management/`, `Matches Management/`)

- `i18n/` - next-intl configuration
  - `routing.js` - Locale routing config (en, ar, always prefix)
  - `navigation.js` - Localized navigation helpers

- `messages/` - Translation files (en.json, ar.json)

### Key Patterns

**Server Actions**: All mutations use server actions in `app/[locale]/_Lib/actions.js`. Pattern: API call → revalidatePath or redirect.

**Authentication**: JWT token stored in httpOnly cookie named "session". `apiClient` automatically attaches Bearer token from cookies. Protected routes under `/dashboard` are guarded by middleware.

**Forms**: Use Formik with Yup validation. Custom form components in `components/ui app/`.

**Data Tables**: Use @tanstack/react-table with custom column definitions.

**Styling**: Tailwind CSS v4 with `cn()` utility from `lib/utils.js` for class merging.

### Environment Variables
- `NEXT_PUBLIC_BASE_URL` - Backend API base URL (API path: `/api/v1`)

### Internationalization
Locales: `en` (default), `ar`. All routes are prefixed with locale. Use `next-intl` for translations and `getLocale()` for server-side locale access.
- بعد كدا متعملش كوميت ولا بوش الا لما تستأذن