# المصادقة وإدارة الجلسات - Authentication & Session Management

## نظرة عامة

يستخدم التطبيق نظام مصادقة يعتمد على JWT (JSON Web Token) مخزن في cookies آمنة.

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   Login     │ ---> │   Backend   │ ---> │   JWT       │
│   Form      │      │   API       │      │   Token     │
└─────────────┘      └─────────────┘      └─────────────┘
                                                 │
                                                 v
                     ┌──────────────────────────────────┐
                     │   httpOnly Cookie (7 days)        │
                     └──────────────────────────────────┘
                                                 │
                                                 v
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   API       │ <--- │   Axios     │ <--- │   Cookie    │
│   Request   │      │ Interceptor │      │   Read      │
└─────────────┘      └─────────────┘      └─────────────┘
```

---

## ملفات المصادقة

### 1. إدارة الجلسة (`app/[locale]/_Lib/session.js`)

```javascript
import "server-only";
import { cookies } from "next/headers";

// حفظ الجلسة
export async function saveSession(token) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 أيام
  const cookieStore = await cookies();
  cookieStore.set("session", token, {
    httpOnly: true,    // غير قابل للقراءة من JavaScript
    secure: true,      // HTTPS فقط
    expires: expiresAt,
    sameSite: "lax",   // حماية CSRF
    path: "/",
  });
}

// حذف الجلسة
export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}
```

### 2. Middleware (`middleware.js`)

```javascript
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const intlMiddleware = createMiddleware(routing);
const protectedRoutePath = "dashboard";
const publicRoutesPath = ["/login", "/register"];

export default async function middleware(req) {
  const pathname = req.nextUrl.pathname;
  const isProtectedRoute = pathname.includes(protectedRoutePath);
  const session = (await cookies()).get("session")?.value;

  // إعادة توجيه غير المسجلين
  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL(`/login`, req.nextUrl));
  }

  // إعادة توجيه المسجلين من صفحات Login
  if (isPublicRoute && session) {
    return NextResponse.redirect(new URL(`/dashboard`, req.nextUrl));
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)""],
};
```

### 3. API Client Interceptor (`app/[locale]/_Lib/apiClient.js`)

```javascript
import axios from "axios";
import { cookies } from "next/headers";

const apiClient = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1`,
  headers: {
    "Content-Type": "application/json",
  },
});

// إضافة التوكن تلقائياً لكل طلب
apiClient.interceptors.request.use(async (config) => {
  const token = (await cookies()).get("session")?.value;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
```

---

## عمليات المصادقة

### تسجيل الدخول

```javascript
// app/[locale]/_Lib/actions.js
export async function login(userData) {
  try {
    const res = await apiClient.post("/auth/login", userData);
    // حفظ التوكن في Cookie
    await saveSession(res?.data?.data?.tokens?.accessToken);
  } catch (e) {
    throw new Error("Error in login");
  }
  redirect("/dashboard");
}
```

**الاستخدام في Component:**
```jsx
import { login } from "@/app/[locale]/_Lib/actions";
import { Formik, Form } from "formik";

function LoginForm() {
  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      onSubmit={async (values) => {
        try {
          await login(values);
          // سيتم redirect تلقائياً
        } catch (error) {
          toast.error("فشل تسجيل الدخول");
        }
      }}
    >
      {/* ... */}
    </Formik>
  );
}
```

### تسجيل الخروج

```javascript
export async function logout() {
  await deleteSession();
  redirect("/login");
}
```

**الاستخدام:**
```jsx
import { logout } from "@/app/[locale]/_Lib/actions";

function LogoutButton() {
  return (
    <button onClick={() => logout()}>
      تسجيل الخروج
    </button>
  );
}
```

### التسجيل

```javascript
export async function register(userData) {
  try {
    await apiClient.post("/register", userData);
  } catch (e) {
    throw new Error("Maybe Email already exists");
  }
  redirect("/register/code-verification");
}
```

### التحقق من الحساب (OTP)

```javascript
export async function verifyAccount(code) {
  try {
    await apiClient.get(`/activate?key=${code}`);
  } catch (e) {
    throw new Error("Error in verify account");
  }
  redirect("/login");
}
```

### تغيير كلمة المرور

```javascript
export async function changePassword(data) {
  try {
    const res = await apiClient.put("/users/change-password", data);
    return res.data;
  } catch (error) {
    throw error;
  }
}
```

---

## الحصول على المستخدم الحالي

```javascript
// app/[locale]/_Lib/usersApi.js
export async function getLoginUser() {
  try {
    const res = await apiClient.get("/users/profile");
    return res.data.data;
  } catch (e) {
    throw new Error("Failed to get user");
  }
}
```

**الاستخدام في Layout:**
```jsx
// app/[locale]/dashboard/layout.jsx
import { getLoginUser } from "../_Lib/usersApi";

export default async function DashboardLayout({ children }) {
  const user = await getLoginUser();

  return (
    <div>
      <SideNavBar user={user} />
      {children}
    </div>
  );
}
```

---

## المسارات المحمية والعامة

### المسارات المحمية (تتطلب تسجيل دخول)
```
/[locale]/dashboard/*
```

### المسارات العامة
```
/[locale]/login
/[locale]/register/*
/[locale]/rules
```

---

## تدفق المصادقة

### 1. تسجيل الدخول
```
1. المستخدم يدخل البريد وكلمة المرور
2. استدعاء login() Server Action
3. إرسال الطلب إلى /auth/login
4. استلام JWT Token
5. حفظ Token في httpOnly Cookie
6. إعادة التوجيه إلى /dashboard
```

### 2. الوصول لصفحة محمية
```
1. المستخدم يطلب /dashboard
2. Middleware يتحقق من Cookie
3. إذا لا يوجد session → redirect to /login
4. إذا يوجد session → السماح بالوصول
```

### 3. طلب API
```
1. Component يستدعي API function
2. Axios Interceptor يقرأ Cookie
3. يضيف Authorization header
4. يرسل الطلب للـ Backend
```

### 4. تسجيل الخروج
```
1. المستخدم يضغط زر الخروج
2. استدعاء logout() Server Action
3. حذف Cookie
4. إعادة التوجيه إلى /login
```

---

## الأمان

### Cookie Security Settings
```javascript
{
  httpOnly: true,    // لا يمكن الوصول من JavaScript
  secure: true,      // HTTPS فقط
  sameSite: "lax",   // حماية من CSRF
  path: "/",         // متاح في كل المسارات
  expires: Date,     // 7 أيام
}
```

### Best Practices المطبقة

1. **httpOnly Cookies**
   - Token غير قابل للسرقة عبر XSS

2. **Secure Flag**
   - يعمل فقط عبر HTTPS

3. **SameSite**
   - حماية من هجمات CSRF

4. **Server-Side Only**
   - session.js يستخدم "server-only"
   - لا يمكن import في Client Components

5. **Automatic Token Injection**
   - لا حاجة لإرسال Token يدوياً

---

## معالجة الأخطاء

### خطأ في تسجيل الدخول
```jsx
async function handleLogin(values) {
  try {
    await login(values);
  } catch (error) {
    toast.error("البريد أو كلمة المرور غير صحيحة");
  }
}
```

### انتهاء الجلسة
- Middleware سيعيد التوجيه لـ /login
- API سيرجع 401 Unauthorized
- يمكن إضافة Response Interceptor للتعامل

```javascript
// مثال لـ Response Interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // الجلسة انتهت
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
```

---

## أدوار المستخدمين

### الأدوار المتاحة
```javascript
const roles = {
  ADMIN: "مدير",
  SUPPORT: "دعم فني",
  WRITER: "كاتب",
};
```

### التحقق من الدور (مثال)
```jsx
function AdminOnlyComponent({ user, children }) {
  if (user.role !== "ADMIN") {
    return <p>غير مصرح</p>;
  }
  return children;
}
```
