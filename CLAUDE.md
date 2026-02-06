# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Important

**بعد كدا متعملش كوميت ولا بوش الا لما تستأذن (Don't commit or push without asking first)**

## Commands

```bash
npm run dev           # Dev server with Turbopack (port 3000)
npm run build         # Production build with Turbopack
npm run start         # Start production server
npm run lint          # Run ESLint
npm run test          # Run Jest tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Run tests with coverage
```

**Single test:**
```bash
npx jest __tests__/unit/FileInput.test.jsx
npx jest --testNamePattern="should render"
```

## Architecture

Next.js 16 admin dashboard for the Escore esports platform. Connects to `escore-backend` API.

**Tech Stack:** Next.js 16, React 19, Tailwind CSS 4, Radix UI + shadcn/ui, next-intl, Formik + Yup, Axios

### Project Structure

```
app/
  [locale]/                    # Localized routes (en, ar)
    _Lib/                      # API layer
      apiCLient.js             # Axios instance with auth interceptor
      session.js               # AES-256-GCM encrypted cookie session
      actions.js               # Server Actions (all mutations)
      *Api.js                  # API service modules
    dashboard/                 # Protected dashboard pages
      [entity]-management/     # Entity pages (add/, edit/, edit/[id]/)
      settings/                # App settings (themes, language, about, privacy, links)
    login/, register/, etc.
components/
  ui/                          # shadcn/ui components
  ui app/                      # Custom app components (InputApp, FileInput, ComboBoxInput)
  dashboard/                   # Layout (SideNavBar, TopNav)
  [feature]/                   # Feature components (Player Management, teams management, etc.)
contexts/
  PermissionsContext.jsx       # RBAC context
i18n/
  routing.js                   # Locales: en (default), ar
messages/
  en.json, ar.json             # Translations
```

## Key Patterns

### API Client

```javascript
import apiClient from "@/app/[locale]/_Lib/apiCLient";
const res = await apiClient.get("/games");
// Token automatically added from encrypted session cookie
```

### Server Actions

All mutations in `actions.js` with `"use server"`:
```javascript
export async function addGame(gameData) {
  const cleanData = cleanNullValues(gameData);  // Remove null/undefined
  await apiClient.post("/games", cleanData);
  redirect("/dashboard/games-management");
}
```

After mutations, revalidate paths:
```javascript
import { getLocale } from "next-intl/server";
import { revalidatePath } from "next/cache";

const locale = await getLocale();
revalidatePath(`/${locale}/dashboard/games-management`);
```

### Session Management

JWT in AES-256-GCM encrypted httpOnly cookie (7 days):
```javascript
import { saveSession, getSession, deleteSession } from "@/app/[locale]/_Lib/session";
```

### Permissions Context

```javascript
import { usePermissions, ENTITIES, ACTIONS } from "@/contexts/PermissionsContext";

const { isAdmin, canCreate, canUpdate, canDelete, hasPermission } = usePermissions();
if (canCreate(ENTITIES.GAME)) { /* show button */ }
```

**Entities:** Game, Team, Player, Tournament, Match, News, Transfer, Standing, Settings, Support, User, Avatar

### Dashboard Layout Protection

```javascript
// app/[locale]/dashboard/layout.jsx
const user = await getLoginUser();
if (!user) {
  cookieStore.delete("session");
  redirect(`/${locale}/login`);
}
return <PermissionsProvider user={user}>{children}</PermissionsProvider>;
```

### Forms (Formik + Yup)

```javascript
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

const schema = Yup.object({ name: Yup.string().required() });
<Formik initialValues={...} validationSchema={schema} onSubmit={...}>
```

### Data Tables

Uses @tanstack/react-table with custom column definitions.

### Styling

Tailwind CSS v4 with `cn()` utility from `lib/utils.js`:
```javascript
import { cn } from "@/lib/utils";
<div className={cn("base-class", condition && "conditional-class")} />
```

### i18n

Routes: `/en/dashboard`, `/ar/dashboard`

```javascript
// Client
import { useTranslations } from "next-intl";
const t = useTranslations("dashboard");

// Server
import { getLocale } from "next-intl/server";
const locale = await getLocale();
```

### Image Upload

```javascript
import { uploadPhoto } from "@/app/[locale]/_Lib/actions";

const formData = new FormData();
formData.append("image", file);
const imageUrl = await uploadPhoto(formData);
```

## API Services

Each `*Api.js` exports fetch functions:
```javascript
// gamesApi.js
export async function getGames(searchParams = {}) {
  const res = await apiClient.get(`/games?${params}`);
  return { data: res.data.data, pagination: res.data.meta };
}
```

**Modules:** gamesApi, teamsApi, palyerApi, tournamentsApi, matchesApi, newsApi, transferApi, usersApi, themesApi, supportCenterApi, notificationsApi, lineupsApi, standingsApi, languageAPI, aboutAPI, PrivacyApi, countriesApi, linksApi, appLinksApi

## Environment Variables

```bash
NEXT_PUBLIC_BASE_URL=http://localhost:5000  # Backend API URL
SESSION_SECRET=your-secure-key-min-32-chars  # Session encryption (required for prod)
```

## Deployment

```bash
ssh user@server "cd ~/escore-frontend && git pull origin master && npm install && npm run build && pm2 restart escore-frontend"
```

## Quick Reference

```javascript
// API & Actions
import apiClient from "@/app/[locale]/_Lib/apiCLient";
import { getGames } from "@/app/[locale]/_Lib/gamesApi";
import { addGame, updateGame, deleteGame, uploadPhoto } from "@/app/[locale]/_Lib/actions";

// Session
import { saveSession, getSession, deleteSession } from "@/app/[locale]/_Lib/session";

// Permissions
import { usePermissions, ENTITIES, ACTIONS } from "@/contexts/PermissionsContext";

// i18n
import { useTranslations } from "next-intl";
import { getLocale } from "next-intl/server";

// Next.js
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

// UI
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
```

**Path Alias:** `@/` → project root

## Related Projects

- **Backend:** `escore-backend` (Express.js + TypeScript + MongoDB)
- **Mobile:** React Native app (same backend)
