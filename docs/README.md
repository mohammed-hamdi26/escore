# توثيق مشروع E-Score Dashboard

مرحباً بك في توثيق مشروع E-Score - لوحة تحكم إدارة الرياضات الإلكترونية.

## فهرس التوثيق

| # | الملف | الوصف |
|---|-------|-------|
| 01 | [overview.md](./01-overview.md) | نظرة عامة على المشروع والتقنيات المستخدمة |
| 02 | [architecture.md](./02-architecture.md) | البنية المعمارية وطبقات التطبيق |
| 03 | [api-reference.md](./03-api-reference.md) | مرجع API الكامل مع جميع Endpoints |
| 04 | [server-actions.md](./04-server-actions.md) | Server Actions وكيفية استخدامها |
| 05 | [components.md](./05-components.md) | دليل المكونات UI وأنماط الاستخدام |
| 06 | [dashboard-pages.md](./06-dashboard-pages.md) | صفحات لوحة التحكم وهيكلها |
| 07 | [authentication.md](./07-authentication.md) | المصادقة وإدارة الجلسات |
| 08 | [internationalization.md](./08-internationalization.md) | الترجمة ودعم اللغات (i18n) |
| 09 | [forms-validation.md](./09-forms-validation.md) | النماذج والتحقق مع Formik و Yup |
| 10 | [styling-theming.md](./10-styling-theming.md) | التنسيق والثيمات مع Tailwind |

---

## البدء السريع

### تثبيت المشروع
```bash
npm install
```

### تشغيل بيئة التطوير
```bash
npm run dev
```

### بناء المشروع
```bash
npm run build
```

### المتغيرات البيئية
```env
NEXT_PUBLIC_BASE_URL=<رابط API الخلفي>
```

---

## الهيكل الأساسي

```
escore-1/
├── app/
│   └── [locale]/
│       ├── _Lib/           # API & Server Actions
│       ├── dashboard/      # صفحات لوحة التحكم
│       ├── login/          # تسجيل الدخول
│       └── register/       # التسجيل
├── components/
│   ├── ui/                 # مكونات Shadcn
│   ├── ui app/             # مكونات مخصصة
│   └── [feature]/          # مكونات الميزات
├── lib/                    # أدوات مساعدة
├── i18n/                   # إعدادات الترجمة
├── messages/               # ملفات الترجمة
└── docs/                   # هذا التوثيق
```

---

## الميزات الرئيسية

- **إدارة اللاعبين** - إضافة/تعديل/حذف اللاعبين مع الجوائز والروابط
- **إدارة الفرق** - إدارة الفرق وأعضائها
- **إدارة المباريات** - جدولة المباريات وتشكيلات الفرق
- **إدارة البطولات** - إنشاء وإدارة البطولات
- **إدارة الأخبار** - نشر وتحرير الأخبار
- **إدارة الانتقالات** - تسجيل انتقالات اللاعبين
- **إدارة المستخدمين** - إدارة حسابات المستخدمين
- **الدعم الفني** - الرد على تذاكر الدعم
- **الإعدادات** - اللغات، الثيمات، المحتوى

---

## التقنيات المستخدمة

| التقنية | الإصدار | الاستخدام |
|---------|---------|-----------|
| Next.js | 15.5.4 | Framework |
| React | 19.1.0 | UI Library |
| Tailwind CSS | 4 | Styling |
| next-intl | 4.4.0 | i18n |
| Formik | 2.4.6 | Forms |
| Yup | 1.7.1 | Validation |
| Axios | 1.12.2 | HTTP Client |
| Shadcn/ui | - | UI Components |

---

## للمساهمة

1. اقرأ [البنية المعمارية](./02-architecture.md) لفهم كيف يعمل المشروع
2. راجع [دليل المكونات](./05-components.md) قبل إنشاء مكونات جديدة
3. اتبع أنماط [Server Actions](./04-server-actions.md) للعمليات على الخادم
4. استخدم [مرجع API](./03-api-reference.md) لمعرفة الـ Endpoints المتاحة

---

## ملاحظات مهمة

- المشروع يدعم اللغتين العربية والإنجليزية
- جميع مسارات Dashboard محمية وتتطلب تسجيل دخول
- يتم تخزين الجلسة في Cookie آمن (httpOnly)
- التطبيق يستخدم Server Components بشكل أساسي
- رفع الصور يتم عبر Server Action مخصص

---

آخر تحديث: ديسمبر 2024
