# خطة تنفيذ نظام المستخدمين والصلاحيات

## ملخص الحالة الحالية

### ما هو موجود في الباك اند:

#### 1. نظام Auth (المصادقة)
- `POST /auth/register` - تسجيل حساب جديد
- `POST /auth/login` - تسجيل الدخول (يرجع permissions مع الـ tokens)
- `POST /auth/verify-email` - تأكيد البريد بـ OTP
- `POST /auth/forgot-password` - نسيت كلمة المرور
- `POST /auth/reset-password` - إعادة تعيين كلمة المرور
- `POST /auth/resend-otp` - إعادة إرسال OTP
- `POST /auth/logout` - تسجيل الخروج
- `POST /auth/create-admin` - إنشاء حساب أدمن (يتطلب secret key)

#### 2. نظام Users (المستخدمين)
- `GET /users/profile` - الملف الشخصي (يرجع permissions)
- `PUT /users/profile` - تحديث الملف الشخصي
- `PUT /users/change-password` - تغيير كلمة المرور
- `POST /users/request-content-role` - طلب صانع محتوى
- `GET /users/content-status` - حالة طلب المحتوى
- `DELETE /users/account` - حذف الحساب

#### 3. نظام Admin (الإدارة)
- `GET /admin/stats` - إحصائيات الداشبورد
- `POST /admin/users` - إنشاء مستخدم جديد (بصلاحيات)
- `GET /admin/users` - قائمة المستخدمين (مع الفلاتر)
- `GET /admin/users/:id` - تفاصيل مستخدم
- `PATCH /admin/users/:id` - تحديث مستخدم (role, isVerified, isDeleted)
- `DELETE /admin/users/:id` - حذف مستخدم (soft delete)
- `GET /admin/content-requests` - طلبات صانعي المحتوى
- `POST /admin/content-requests/:id/approve` - الموافقة على طلب
- `POST /admin/content-requests/:id/reject` - رفض طلب

#### 4. نظام Permissions (الصلاحيات)
- `GET /admin/users/:id/permissions` - صلاحيات مستخدم
- `PUT /admin/users/:id/permissions` - تعيين كل الصلاحيات
- `PATCH /admin/users/:id/permissions` - إضافة صلاحية
- `DELETE /admin/users/:id/permissions/:entity` - حذف صلاحية

**Entities المتاحة:**
- Game, Team, Player, Tournament, Match, News, Transfer, Standing, Settings, Support, User, Avatar

**Actions المتاحة:**
- create, read, update, delete

### ما هو موجود في الفرونت اند:

1. **صفحة الداشبورد `/dashboard/users`** - إحصائيات المستخدمين ✅
2. **صفحة قائمة المستخدمين `/dashboard/users/list`** - عرض وفلترة ✅
3. **صفحة إضافة مستخدم `/dashboard/users/add`** - إضافة مع صلاحيات ✅
4. **صفحة تعديل مستخدم `/dashboard/users/[userId]/edit`** - تعديل مع صلاحيات ✅
5. **صفحة طلبات المحتوى `/dashboard/users/content-requests`** - قبول/رفض ✅

---

## المطلوب تنفيذه

### 1. التحكم في عرض العناصر حسب الصلاحيات (Role-Based UI)

#### المشكلة:
حاليًا، كل المستخدمين الـ authenticated يرون نفس العناصر في الـ sidebar والداشبورد.

#### الحل:
1. **تخزين الصلاحيات في الـ Session/Context**
2. **إنشاء مكون `PermissionGate`** - يظهر/يخفي عناصر بناءً على الصلاحيات
3. **تحديث الـ SideNavBar** - إظهار الروابط حسب الصلاحيات
4. **تحديث الـ TopNav** - إظهار أزرار الإضافة حسب الصلاحيات

#### الخطوات:

**الخطوة 1: إنشاء PermissionsContext**
```jsx
// contexts/PermissionsContext.jsx
"use client";
import { createContext, useContext } from "react";

const PermissionsContext = createContext({
  permissions: [],
  role: "user",
  hasPermission: () => false,
  canCreate: () => false,
  canRead: () => false,
  canUpdate: () => false,
  canDelete: () => false,
  isAdmin: false,
});

export function PermissionsProvider({ children, user }) {
  const permissions = user?.permissions || [];
  const role = user?.role || "user";
  const isAdmin = role === "admin";

  const hasPermission = (entity, action) => {
    if (isAdmin) return true;
    const perm = permissions.find(p => p.entity === entity);
    return perm?.actions?.includes(action) || false;
  };

  const canCreate = (entity) => hasPermission(entity, "create");
  const canRead = (entity) => hasPermission(entity, "read");
  const canUpdate = (entity) => hasPermission(entity, "update");
  const canDelete = (entity) => hasPermission(entity, "delete");

  return (
    <PermissionsContext.Provider value={{
      permissions, role, hasPermission, canCreate, canRead, canUpdate, canDelete, isAdmin
    }}>
      {children}
    </PermissionsContext.Provider>
  );
}

export const usePermissions = () => useContext(PermissionsContext);
```

**الخطوة 2: إنشاء مكون PermissionGate**
```jsx
// components/ui app/PermissionGate.jsx
"use client";
import { usePermissions } from "@/contexts/PermissionsContext";

export function PermissionGate({ entity, action, fallback = null, children }) {
  const { hasPermission } = usePermissions();

  if (!hasPermission(entity, action)) {
    return fallback;
  }

  return children;
}

// للأدمن فقط
export function AdminGate({ fallback = null, children }) {
  const { isAdmin } = usePermissions();
  return isAdmin ? children : fallback;
}
```

**الخطوة 3: تحديث dashboard/layout.jsx**
```jsx
import { PermissionsProvider } from "@/contexts/PermissionsContext";

export default async function DashboardLayout({ children }) {
  const user = await getLoginUser();

  return (
    <PermissionsProvider user={user}>
      {/* ... الـ layout الحالي */}
    </PermissionsProvider>
  );
}
```

**الخطوة 4: تحديث SideNavBar/TopNav**
إظهار الروابط حسب الصلاحيات:
- Games Management: يظهر لمن لديه read على Game
- Players Management: يظهر لمن لديه read على Player
- Users Management: يظهر للأدمن فقط
- وهكذا...

---

### 2. تحسينات صفحة تعديل المستخدم

#### المطلوب:
1. إضافة إمكانية تغيير الـ Role
2. إضافة إمكانية التحقق/إلغاء التحقق
3. إضافة إمكانية الحذف/الاستعادة
4. تحسين عرض الصلاحيات

#### الخطوات:

**الخطوة 1: تحديث UserForm.jsx**
- إضافة حقل Role (dropdown: user, admin, content, support)
- إضافة switch لـ isVerified
- إضافة زر الحذف/الاستعادة

**الخطوة 2: تحديث editUser action**
```javascript
export async function editUser(userId, data) {
  // تحديث البيانات الأساسية
  await apiClient.patch(`/admin/users/${userId}`, {
    role: data.role,
    isVerified: data.isVerified,
  });

  // تحديث الصلاحيات
  await apiClient.put(`/admin/users/${userId}/permissions`, {
    permissions: data.permissions
  });
}
```

---

### 3. تحسين صفحة طلبات المحتوى

#### المطلوب:
1. عرض تفاصيل أكثر عن المستخدم المتقدم
2. إضافة فلاتر (حسب التاريخ)
3. تحسين الـ UI

#### الخطوات:
- إضافة كروت بتصميم أفضل
- إضافة معلومات التسجيل
- إضافة عدد الطلبات السابقة

---

### 4. إضافة صفحة Permissions Management منفصلة

#### المطلوب:
صفحة خاصة لإدارة الصلاحيات بشكل مرئي (matrix view)

#### الخطوات:
1. إنشاء `/dashboard/users/[userId]/permissions`
2. عرض matrix للـ entities x actions
3. إمكانية toggle سريع

---

## ملفات التنفيذ

### ملفات جديدة:
1. `contexts/PermissionsContext.jsx`
2. `components/ui app/PermissionGate.jsx`
3. `components/dashboard/PermissionsAwareSideNav.jsx`

### ملفات للتعديل:
1. `app/[locale]/dashboard/layout.jsx` - إضافة PermissionsProvider
2. `components/dashboard/NavItems.jsx` - التحكم بالعناصر
3. `components/dashboard/TopNav.jsx` - التحكم بالأزرار
4. `components/user-management/UserForm.jsx` - إضافة حقول
5. `components/Users/UsersListTable.jsx` - تحسين الأزرار
6. `app/[locale]/_Lib/actions.js` - تحسين actions

### ترجمات مطلوبة:
- إضافة مفاتيح جديدة في `messages/en.json` و `messages/ar.json`

---

## خطوات التنفيذ بالترتيب

1. [ ] إنشاء PermissionsContext
2. [ ] إنشاء PermissionGate component
3. [ ] تحديث dashboard/layout.jsx
4. [ ] تحديث SideNavBar لإظهار العناصر حسب الصلاحيات
5. [ ] تحديث TopNav لإظهار الأزرار حسب الصلاحيات
6. [ ] تحسين صفحة تعديل المستخدم
7. [ ] تحسين صفحة طلبات المحتوى
8. [ ] إضافة الترجمات
9. [ ] اختبار كل السيناريوهات
10. [ ] Deploy

---

## سيناريوهات الاختبار

### سيناريو 1: مستخدم عادي (User)
- لا يرى Users Management في الـ sidebar
- يرى فقط صفحات الإعدادات وتغيير كلمة المرور
- لا يرى أي أزرار إضافة

### سيناريو 2: صانع محتوى (Content) مع صلاحيات News
- يرى News Management في الـ sidebar
- يستطيع إضافة/تعديل/حذف الأخبار
- لا يرى باقي الـ modules

### سيناريو 3: أدمن (Admin)
- يرى كل شيء
- يستطيع إدارة المستخدمين والصلاحيات
- يستطيع قبول/رفض طلبات المحتوى

---

## ملاحظات مهمة

1. **الباك اند جاهز بالكامل** - كل الـ APIs موجودة ومختبرة
2. **الفرونت يحتاج تعديلات** - معظمها في الـ UI visibility
3. **الـ Permissions تُرجع مع كل request للـ profile** - لا حاجة لطلب منفصل
4. **الأدمن يتجاوز كل الفحوصات** - role === 'admin' دائمًا true

---

## طريقة استخدام النظام بعد التنفيذ

### إضافة مستخدم جديد بصلاحيات:
1. اذهب لـ Users Management > Add User
2. أدخل الاسم الأول والأخير
3. فعّل الـ modules المطلوبة (Game, News, etc.)
4. اختر الـ actions لكل module (create, read, update, delete)
5. اضغط Submit
6. احفظ الـ email والـ password اللي هيظهروا

### تعديل صلاحيات مستخدم:
1. اذهب لـ Users Management > All Users
2. ابحث عن المستخدم
3. اضغط Edit
4. عدّل الصلاحيات
5. اضغط Save

### الموافقة على طلب صانع محتوى:
1. اذهب لـ Users Management > Content Requests
2. راجع الطلبات المعلقة
3. اضغط Approve أو Reject (مع السبب)
