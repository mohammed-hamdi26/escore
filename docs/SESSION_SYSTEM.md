# نظام الجلسات والمصادقة (Authentication & Session System)

## نظرة عامة

نظام المصادقة في المنصة يتكون من جزئين رئيسيين:
1. **Backend (escore-backend)** - يولد JWT tokens ويتحقق منها
2. **Frontend (Dashboard/App)** - يخزن الـ token في cookies مشفرة

---

## 🔐 الـ Backend - كيف يعمل

### 1. تسجيل الدخول (Login)

```
المستخدم يرسل → email + password → Backend يتحقق → يرجع JWT Token
```

**الملف:** `escore-backend/src/modules/auth/auth.service.ts`

```typescript
// الـ Backend يولد token بدون تاريخ انتهاء
private generateTokens(user: IUser): AuthTokens {
  const payload = {
    userId: user._id.toString(),
    email: user.email,
  };

  // Token بدون expiry - لا ينتهي أبداً!
  const accessToken = jwt.sign(payload, env.JWT_SECRET);

  return {
    accessToken,
    refreshToken: accessToken, // نفس الـ token
    expiresIn: 'never',
  };
}
```

### 2. التحقق من الـ Token (Authentication Middleware)

**الملف:** `escore-backend/src/middlewares/auth.middleware.ts`

```typescript
// كل request محمي يمر من هنا
export const authenticate = async (req, res, next) => {
  // 1. يقرأ الـ token من Header
  const token = req.headers.authorization?.split(' ')[1];

  // 2. يفك تشفير الـ JWT
  const decoded = jwt.verify(token, env.JWT_SECRET);

  // 3. يجيب بيانات المستخدم من Database
  const user = await User.findById(decoded.userId);

  // 4. يحط بيانات المستخدم في req.user
  req.user = {
    _id: user._id,
    email: user.email,
    role: user.role,
    isVerified: user.isVerified,
  };
};
```

---

## 🍪 الـ Frontend (Dashboard) - كيف يخزن الـ Session

### 1. حفظ الـ Session بعد Login

**الملف:** `escore/app/[locale]/_Lib/session.js`

```javascript
// بعد Login ناجح، يتم تشفير الـ token وحفظه في cookie
export async function saveSession(token) {
  // 1. تشفير الـ token باستخدام AES-256-GCM
  const encryptedToken = encryptToken(token);

  // 2. حفظه في cookie لمدة 7 أيام
  cookieStore.set("session", encryptedToken, {
    httpOnly: true,      // لا يمكن الوصول له من JavaScript (حماية XSS)
    secure: true,        // HTTPS فقط في Production
    expires: 7 days,     // ينتهي بعد 7 أيام
    sameSite: "lax",     // حماية CSRF
  });
}
```

### 2. قراءة الـ Session

```javascript
export async function getSession() {
  // 1. يقرأ الـ cookie المشفر
  const encryptedToken = cookieStore.get("session")?.value;

  // 2. يفك التشفير ويرجع الـ token الأصلي
  return decryptToken(encryptedToken);
}
```

### 3. إرسال الـ Token مع كل Request

**الملف:** `escore/app/[locale]/_Lib/apiClient.js`

```javascript
// Interceptor يضيف الـ token تلقائياً لكل request
apiClient.interceptors.request.use(async (config) => {
  const token = await getSession();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

---

## 📊 رسم توضيحي للـ Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         LOGIN FLOW                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  User                  Frontend                 Backend          │
│   │                       │                        │             │
│   │─── email/password ───►│                        │             │
│   │                       │── POST /auth/login ───►│             │
│   │                       │                        │             │
│   │                       │◄─── JWT Token ─────────│             │
│   │                       │                        │             │
│   │                       │ [تشفير + حفظ في Cookie]│             │
│   │                       │                        │             │
│   │◄── Redirect ──────────│                        │             │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                     AUTHENTICATED REQUEST                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  User                  Frontend                 Backend          │
│   │                       │                        │             │
│   │─── يطلب صفحة ────────►│                        │             │
│   │                       │                        │             │
│   │                       │ [يقرأ Cookie مشفر]     │             │
│   │                       │ [يفك التشفير]          │             │
│   │                       │                        │             │
│   │                       │── GET /api/... ───────►│             │
│   │                       │   + Bearer Token       │             │
│   │                       │                        │             │
│   │                       │                        │ [يتحقق JWT] │
│   │                       │                        │ [يجيب User] │
│   │                       │                        │             │
│   │                       │◄────── Data ───────────│             │
│   │                       │                        │             │
│   │◄── الصفحة ────────────│                        │             │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## ⚠️ مشاكل شائعة وحلولها

### 1. خطأ 401 Unauthorized

**السبب:** الـ Token غير صالح أو منتهي

**الحل:**
- تسجيل خروج وإعادة تسجيل الدخول
- التأكد من أن الـ `JWT_SECRET` نفسه في Backend و Environment

### 2. خطأ 404 عند جلب البيانات

**السبب:** الـ API URL غير صحيح

**الحل:**
- تأكد من `.env.local`:
```
NEXT_PUBLIC_BASE_URL=http://localhost:5000   # للتطوير المحلي
# أو
NEXT_PUBLIC_BASE_URL=https://api.escore.app  # للإنتاج
```

### 3. الجلسة تنتهي فجأة

**السبب:** الـ Cookie تنتهي بعد 7 أيام

**الحل:**
- يمكن زيادة المدة في `saveSession`:
```javascript
const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 يوم
```

### 4. مشكلة "Session not found"

**السبب:** المتصفح لم يخزن الـ Cookie

**الحل:**
- تأكد من أن `SESSION_SECRET` موجود في `.env.local`
- تأكد من أن الـ Browser يقبل Cookies

---

## 🔑 Environment Variables المطلوبة

### Backend (.env)
```env
JWT_SECRET=your-super-secret-key-here
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_BASE_URL=http://localhost:5000
SESSION_SECRET=your-session-encryption-key
```

---

## 📱 الفرق بين Dashboard والتطبيق

| الخاصية | Dashboard (Next.js) | Mobile App |
|---------|---------------------|------------|
| تخزين Token | Cookie مشفر (httpOnly) | AsyncStorage/SecureStore |
| مدة الجلسة | 7 أيام (قابل للتجديد) | لا تنتهي (حتى logout) |
| التشفير | AES-256-GCM | يعتمد على المنصة |
| حماية XSS | نعم (httpOnly) | غير مطلوب |

---

## 🔄 دورة حياة الجلسة

```
1. المستخدم يسجل دخول
   ↓
2. Backend يولد JWT Token (بدون انتهاء)
   ↓
3. Frontend يشفر الـ Token
   ↓
4. Frontend يخزنه في Cookie (7 أيام)
   ↓
5. كل request يقرأ Cookie → يفك التشفير → يرسل Token
   ↓
6. Backend يتحقق من Token → يرجع البيانات
   ↓
7. بعد 7 أيام Cookie تنتهي → المستخدم يحتاج login جديد
```

---

## 🛡️ ملاحظات أمنية

1. **الـ JWT Token نفسه لا ينتهي** - لكن الـ Cookie تنتهي بعد 7 أيام
2. **الـ Token مشفر** في الـ Cookie باستخدام AES-256-GCM
3. **httpOnly Cookie** يمنع JavaScript من الوصول للـ Token
4. **sameSite: lax** يحمي من CSRF attacks
5. **secure: true** في Production يضمن HTTPS فقط

---

## 📝 ملخص

- **Backend** يولد JWT بدون تاريخ انتهاء
- **Frontend** يخزن الـ Token مشفر في Cookie لمدة 7 أيام
- **كل Request** يقرأ الـ Cookie، يفك التشفير، ويرسل Token في Header
- **Backend** يتحقق من Token ويرجع البيانات
- **عند انتهاء Cookie** (7 أيام) المستخدم يحتاج تسجيل دخول جديد
