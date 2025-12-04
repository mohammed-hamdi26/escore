# الترجمة والتدويل - Internationalization (i18n)

## نظرة عامة

يستخدم التطبيق `next-intl` للترجمة مع دعم كامل للعربية (RTL) والإنجليزية (LTR).

```
┌─────────────────────────────────────────┐
│              next-intl                   │
├─────────────────────────────────────────┤
│  Routing:  /en/dashboard, /ar/dashboard │
│  Messages: messages/en.json, ar.json    │
│  RTL:      Automatic based on locale    │
└─────────────────────────────────────────┘
```

---

## الملفات والإعدادات

### 1. إعداد التوجيه (`i18n/routing.js`)

```javascript
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "ar"],       // اللغات المدعومة
  defaultLocale: "en",          // اللغة الافتراضية
  localePrefix: "always",       // دائماً إظهار اللغة في URL
});
```

### 2. إعداد الطلبات (`i18n/request.js`)

```javascript
import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
```

### 3. التنقل (`i18n/navigation.js`)

```javascript
import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

export const {
  Link,           // بديل لـ next/link
  redirect,       // بديل لـ next/navigation redirect
  usePathname,    // hook للمسار الحالي
  useRouter,      // hook للـ router
  getPathname,    // الحصول على المسار
} = createNavigation(routing);
```

---

## ملفات الترجمة

### موقع الملفات
```
messages/
├── en.json    # الترجمة الإنجليزية
└── ar.json    # الترجمة العربية
```

### هيكل ملف الترجمة
```json
{
  "Login": {
    "title": "تسجيل الدخول",
    "email": "البريد الإلكتروني",
    "password": "كلمة المرور",
    "submit": "دخول"
  },
  "Dashboard": {
    "services": {
      "players": {
        "title": "إدارة اللاعبين",
        "description": "إضافة وتعديل وحذف اللاعبين"
      }
    }
  },
  "nav": {
    "home": "الرئيسية",
    "players": "اللاعبين",
    "teams": "الفرق"
  },
  "button": {
    "save": "حفظ",
    "cancel": "إلغاء",
    "delete": "حذف"
  }
}
```

---

## استخدام الترجمة

### في Server Components

```jsx
import { getTranslations } from "next-intl/server";

export default async function Page() {
  const t = await getTranslations("Dashboard");

  return (
    <div>
      <h1>{t("services.players.title")}</h1>
      <p>{t("services.players.description")}</p>
    </div>
  );
}
```

### في Client Components

```jsx
"use client";
import { useTranslations } from "next-intl";

export default function LoginForm() {
  const t = useTranslations("Login");

  return (
    <form>
      <label>{t("email")}</label>
      <input type="email" />
      <label>{t("password")}</label>
      <input type="password" />
      <button>{t("submit")}</button>
    </form>
  );
}
```

### ترجمة مع متغيرات

```json
{
  "welcome": "مرحباً {name}!",
  "items": "لديك {count, plural, =0 {لا عناصر} one {عنصر واحد} other {# عنصر}}"
}
```

```jsx
const t = useTranslations();
t("welcome", { name: "أحمد" });  // "مرحباً أحمد!"
t("items", { count: 5 });        // "لديك 5 عنصر"
```

---

## التنقل مع اللغات

### استخدام Link

```jsx
import { Link } from "@/i18n/navigation";

// ينتقل تلقائياً مع اللغة الحالية
<Link href="/dashboard">لوحة التحكم</Link>
// إذا اللغة ar → /ar/dashboard
// إذا اللغة en → /en/dashboard
```

### استخدام redirect

```jsx
import { redirect } from "@/i18n/navigation";

// في Server Action
export async function someAction() {
  // ...
  redirect("/dashboard");  // يحافظ على اللغة الحالية
}
```

### استخدام useRouter

```jsx
"use client";
import { useRouter } from "@/i18n/navigation";

function MyComponent() {
  const router = useRouter();

  function handleClick() {
    router.push("/dashboard");
  }
}
```

---

## تبديل اللغة

### مكون تبديل اللغة

```jsx
// components/ui app/LocaleChange.jsx
"use client";
import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";

export default function LocaleChange() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function switchLocale(newLocale) {
    router.replace(pathname, { locale: newLocale });
  }

  return (
    <button onClick={() => switchLocale(locale === "ar" ? "en" : "ar")}>
      {locale === "ar" ? "EN" : "عربي"}
    </button>
  );
}
```

---

## دعم RTL

### في Root Layout

```jsx
// app/[locale]/layout.jsx
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

### تنسيق RTL في CSS

```css
/* Tailwind يدعم RTL تلقائياً */
/* استخدم start/end بدل left/right */

.element {
  margin-inline-start: 1rem;  /* بدل margin-left */
  padding-inline-end: 1rem;   /* بدل padding-right */
  text-align: start;          /* بدل text-align: left */
}

/* أو في Tailwind */
<div className="ms-4 pe-4 text-start">
  {/* ms = margin-start, pe = padding-end */}
</div>
```

---

## الحصول على اللغة الحالية

### في Server Components/Actions

```javascript
import { getLocale } from "next-intl/server";

export async function someAction() {
  const locale = await getLocale();
  // locale = "ar" أو "en"
}
```

### في Client Components

```jsx
"use client";
import { useLocale } from "next-intl";

function MyComponent() {
  const locale = useLocale();
  // locale = "ar" أو "en"
}
```

---

## Middleware والترجمة

```javascript
// middleware.js
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export default async function middleware(req) {
  // ... auth checks ...
  return intlMiddleware(req);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)""],
};
```

---

## إضافة لغة جديدة

### 1. تحديث routing.js
```javascript
export const routing = defineRouting({
  locales: ["en", "ar", "fr"],  // إضافة الفرنسية
  defaultLocale: "en",
  localePrefix: "always",
});
```

### 2. إنشاء ملف الترجمة
```
messages/
├── en.json
├── ar.json
└── fr.json  // جديد
```

### 3. تحديث Layout للـ RTL (إذا لزم)
```jsx
const rtlLocales = ["ar"];  // اللغات RTL

<html dir={rtlLocales.includes(locale) ? "rtl" : "ltr"}>
```

---

## أفضل الممارسات

### 1. تنظيم المفاتيح
```json
{
  "FeatureName": {
    "title": "...",
    "description": "...",
    "actions": {
      "save": "...",
      "delete": "..."
    }
  }
}
```

### 2. إعادة استخدام المفاتيح المشتركة
```json
{
  "common": {
    "save": "حفظ",
    "cancel": "إلغاء",
    "delete": "حذف",
    "edit": "تعديل"
  }
}
```

```jsx
const t = useTranslations("common");
<button>{t("save")}</button>
```

### 3. تجنب الترجمة في الكود
```jsx
// ❌ خطأ
<button>حفظ</button>

// ✅ صحيح
<button>{t("save")}</button>
```

### 4. استخدام Namespaces
```jsx
// بدل استيراد كل الترجمات
const t = useTranslations();

// استخدم namespace محدد
const t = useTranslations("Dashboard.players");
```

---

## تصحيح الأخطاء

### مفتاح غير موجود
```
⚠ Missing translation: Dashboard.unknownKey for locale ar
```

### حل المشكلة
1. تأكد من وجود المفتاح في ملفات الترجمة
2. تأكد من كتابة المفتاح بشكل صحيح
3. تأكد من تحديث جميع ملفات اللغات

### التحقق من الترجمات
```javascript
// في development
if (process.env.NODE_ENV === "development") {
  console.log("Current locale:", locale);
  console.log("Available messages:", messages);
}
```
