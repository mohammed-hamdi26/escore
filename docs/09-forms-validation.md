# النماذج والتحقق - Forms & Validation

## المكتبات المستخدمة

- **Formik** - إدارة حالة النموذج
- **Yup** - تعريف وتنفيذ قواعد التحقق

---

## نمط النموذج الأساسي

```jsx
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { addPlayer } from "@/app/[locale]/_Lib/actions";
import toast from "react-hot-toast";

// تعريف schema التحقق
const validationSchema = Yup.object({
  name: Yup.string()
    .required("الاسم مطلوب")
    .min(2, "الاسم قصير جداً"),
  age: Yup.number()
    .required("العمر مطلوب")
    .min(16, "العمر يجب أن يكون 16 على الأقل")
    .max(50, "العمر يجب أن يكون أقل من 50"),
  email: Yup.string()
    .email("بريد إلكتروني غير صالح")
    .required("البريد مطلوب"),
});

function PlayerForm({ initialValues, teams, games }) {
  const defaultValues = {
    name: "",
    age: "",
    email: "",
    team: null,
    game: null,
    ...initialValues,
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await addPlayer(values);
      toast.success("تمت الإضافة بنجاح");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={defaultValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, errors, touched }) => (
        <Form>
          {/* حقول النموذج */}
        </Form>
      )}
    </Formik>
  );
}
```

---

## قواعد التحقق الشائعة

### النصوص
```javascript
Yup.string()
  .required("مطلوب")
  .min(2, "قصير جداً")
  .max(100, "طويل جداً")
  .matches(/^[a-zA-Z\u0600-\u06FF\s]+$/, "أحرف فقط")
```

### الأرقام
```javascript
Yup.number()
  .required("مطلوب")
  .min(0, "يجب أن يكون موجباً")
  .max(1000, "كبير جداً")
  .integer("يجب أن يكون عدداً صحيحاً")
```

### البريد الإلكتروني
```javascript
Yup.string()
  .email("بريد غير صالح")
  .required("مطلوب")
```

### كلمة المرور
```javascript
Yup.string()
  .required("مطلوب")
  .min(8, "8 أحرف على الأقل")
  .matches(/[A-Z]/, "يجب أن يحتوي على حرف كبير")
  .matches(/[0-9]/, "يجب أن يحتوي على رقم")
```

### تأكيد كلمة المرور
```javascript
Yup.string()
  .required("مطلوب")
  .oneOf([Yup.ref("password")], "كلمتا المرور غير متطابقتين")
```

### التاريخ
```javascript
Yup.date()
  .required("مطلوب")
  .min(new Date(), "يجب أن يكون في المستقبل")
```

### الرابط
```javascript
Yup.string()
  .url("رابط غير صالح")
  .required("مطلوب")
```

### Select/Dropdown
```javascript
Yup.object()
  .shape({
    id: Yup.number().required(),
  })
  .required("الاختيار مطلوب")
  .nullable()
```

### المصفوفات
```javascript
Yup.array()
  .of(Yup.string())
  .min(1, "أضف عنصراً واحداً على الأقل")
```

---

## استخدام المكونات المخصصة

### InputApp مع Formik

```jsx
import { useField } from "formik";

function InputApp({ label, icon, ...props }) {
  const [field, meta] = useField(props.name);

  return (
    <div>
      <label>{label}</label>
      <div className="relative">
        {icon && <span className="absolute">{icon}</span>}
        <input
          {...field}
          {...props}
          className={meta.touched && meta.error ? "border-red-500" : ""}
        />
      </div>
      {meta.touched && meta.error && (
        <p className="text-red-500 text-sm">{meta.error}</p>
      )}
    </div>
  );
}
```

### SelectInput مع Formik

```jsx
import { useField, useFormikContext } from "formik";

function SelectInput({ label, options, ...props }) {
  const [field, meta] = useField(props.name);
  const { setFieldValue } = useFormikContext();

  return (
    <div>
      <label>{label}</label>
      <select
        {...field}
        onChange={(e) => {
          const selected = options.find(o => o.id === Number(e.target.value));
          setFieldValue(props.name, selected);
        }}
      >
        <option value="">اختر...</option>
        {options.map(option => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
      {meta.touched && meta.error && (
        <p className="text-red-500">{meta.error}</p>
      )}
    </div>
  );
}
```

### FileInput مع رفع الصور

```jsx
import { useFormikContext } from "formik";
import { uploadPhoto } from "@/app/[locale]/_Lib/actions";

function FileInput({ name, label }) {
  const { setFieldValue } = useFormikContext();
  const [uploading, setUploading] = useState(false);

  const handleChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const url = await uploadPhoto(formData);
      setFieldValue(name, url);
      toast.success("تم رفع الصورة");
    } catch (error) {
      toast.error("فشل رفع الصورة");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label>{label}</label>
      <input
        type="file"
        accept="image/*"
        onChange={handleChange}
        disabled={uploading}
      />
      {uploading && <p>جاري الرفع...</p>}
    </div>
  );
}
```

---

## أمثلة كاملة

### نموذج إضافة لاعب

```jsx
import { Formik, Form } from "formik";
import * as Yup from "yup";
import InputApp from "@/components/ui app/InputApp";
import SelectInput from "@/components/ui app/SelectInput";
import FileInput from "@/components/ui app/FileInput";
import FormSection from "@/components/ui app/FormSection";
import FormRow from "@/components/ui app/FormRow";
import { Button } from "@/components/ui/button";
import { addPlayer } from "@/app/[locale]/_Lib/actions";
import toast from "react-hot-toast";

const PlayerSchema = Yup.object({
  name: Yup.string().required("الاسم مطلوب"),
  age: Yup.number()
    .required("العمر مطلوب")
    .min(16, "16 سنة على الأقل"),
  country: Yup.object().required("الدولة مطلوبة").nullable(),
  team: Yup.object().required("الفريق مطلوب").nullable(),
  game: Yup.object().required("اللعبة مطلوبة").nullable(),
  avatar: Yup.string().url("رابط غير صالح"),
});

export default function PlayerFrom({ initialValues, teams, games, countries }) {
  const defaultValues = {
    name: "",
    age: "",
    country: null,
    team: null,
    game: null,
    avatar: "",
    ...initialValues,
  };

  const isEdit = Boolean(initialValues?.id);

  return (
    <Formik
      initialValues={defaultValues}
      validationSchema={PlayerSchema}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          if (isEdit) {
            await editPlayer(values);
            toast.success("تم التحديث");
          } else {
            await addPlayer(values);
            toast.success("تمت الإضافة");
          }
        } catch (error) {
          toast.error(error.message);
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ isSubmitting }) => (
        <Form className="space-y-6">
          <FormSection title="المعلومات الأساسية">
            <FormRow>
              <InputApp name="name" label="الاسم" placeholder="اسم اللاعب" />
              <InputApp name="age" label="العمر" type="number" />
            </FormRow>
            <FormRow>
              <SelectInput name="country" label="الدولة" options={countries} />
              <SelectInput name="team" label="الفريق" options={teams} />
            </FormRow>
            <SelectInput name="game" label="اللعبة" options={games} />
          </FormSection>

          <FormSection title="الصور">
            <FileInput name="avatar" label="الصورة الشخصية" />
          </FormSection>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "جاري الحفظ..." : isEdit ? "تحديث" : "إضافة"}
          </Button>
        </Form>
      )}
    </Formik>
  );
}
```

### نموذج تسجيل الدخول

```jsx
const LoginSchema = Yup.object({
  email: Yup.string()
    .email("بريد غير صالح")
    .required("البريد مطلوب"),
  password: Yup.string()
    .required("كلمة المرور مطلوبة")
    .min(6, "6 أحرف على الأقل"),
});

function LoginForm() {
  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      validationSchema={LoginSchema}
      onSubmit={async (values) => {
        try {
          await login(values);
        } catch (error) {
          toast.error("فشل تسجيل الدخول");
        }
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <InputApp name="email" label="البريد" type="email" />
          <InputApp name="password" label="كلمة المرور" type="password" />
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "جاري الدخول..." : "دخول"}
          </Button>
        </Form>
      )}
    </Formik>
  );
}
```

### نموذج تغيير كلمة المرور

```jsx
const PasswordSchema = Yup.object({
  currentPassword: Yup.string().required("مطلوب"),
  newPassword: Yup.string()
    .required("مطلوب")
    .min(8, "8 أحرف على الأقل")
    .notOneOf(
      [Yup.ref("currentPassword")],
      "يجب أن تختلف عن كلمة المرور الحالية"
    ),
  confirmPassword: Yup.string()
    .required("مطلوب")
    .oneOf([Yup.ref("newPassword")], "غير متطابقة"),
});

function ChangePasswordForm() {
  return (
    <Formik
      initialValues={{
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }}
      validationSchema={PasswordSchema}
      onSubmit={async (values, { resetForm }) => {
        try {
          await changePassword(values);
          toast.success("تم تغيير كلمة المرور");
          resetForm();
        } catch (error) {
          toast.error("فشل تغيير كلمة المرور");
        }
      }}
    >
      <Form>
        <InputApp
          name="currentPassword"
          label="كلمة المرور الحالية"
          type="password"
        />
        <InputApp
          name="newPassword"
          label="كلمة المرور الجديدة"
          type="password"
        />
        <InputApp
          name="confirmPassword"
          label="تأكيد كلمة المرور"
          type="password"
        />
        <Button type="submit">تغيير</Button>
      </Form>
    </Formik>
  );
}
```

---

## نصائح وأفضل الممارسات

### 1. إعادة استخدام Schemas
```javascript
// schemas/common.js
export const emailSchema = Yup.string()
  .email("بريد غير صالح")
  .required("مطلوب");

export const passwordSchema = Yup.string()
  .required("مطلوب")
  .min(8, "8 أحرف على الأقل");

// استخدام
import { emailSchema, passwordSchema } from "@/schemas/common";

const LoginSchema = Yup.object({
  email: emailSchema,
  password: passwordSchema,
});
```

### 2. التحقق الشرطي
```javascript
Yup.object({
  hasTeam: Yup.boolean(),
  team: Yup.object().when("hasTeam", {
    is: true,
    then: (schema) => schema.required("الفريق مطلوب"),
    otherwise: (schema) => schema.nullable(),
  }),
});
```

### 3. رسائل خطأ مخصصة
```javascript
Yup.string().required("هذا الحقل مطلوب");
// بدل الرسالة الافتراضية
```

### 4. التحقق غير المتزامن
```javascript
Yup.string().test(
  "unique-email",
  "البريد مستخدم مسبقاً",
  async (value) => {
    const exists = await checkEmailExists(value);
    return !exists;
  }
);
```
