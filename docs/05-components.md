# دليل المكونات - Components Guide

## هيكل المكونات

```
components/
├── ui/                    # مكونات Shadcn/ui الأساسية
├── ui app/                # مكونات مخصصة للتطبيق
├── dashboard/             # مكونات لوحة التحكم
├── icons/                 # أيقونات SVG
├── Theme/                 # مزود الثيمات
└── [feature]/             # مكونات خاصة بكل ميزة
```

---

## مكونات Shadcn/ui (`components/ui/`)

هذه المكونات مستوردة من Shadcn/ui وتُستخدم كأساس لبناء الواجهة.

| المكون | الملف | الوصف |
|--------|-------|-------|
| Button | `button.jsx` | أزرار بأنماط متعددة |
| Input | `input.jsx` | حقول إدخال نصية |
| Textarea | `textarea.jsx` | حقل نص متعدد الأسطر |
| Select | `select.jsx` | قائمة منسدلة |
| Dialog | `dialog.jsx` | نافذة حوار منبثقة |
| Alert Dialog | `alert-dialog.jsx` | تأكيد العمليات |
| Dropdown Menu | `dropdown-menu.jsx` | قائمة منسدلة |
| Checkbox | `checkbox.jsx` | خانة اختيار |
| Label | `label.jsx` | تسمية الحقول |
| Table | `table.jsx` | جدول بيانات |
| Calendar | `calendar.jsx` | تقويم |
| Popover | `popover.jsx` | نافذة منبثقة صغيرة |
| Sidebar | `sidebar.jsx` | شريط جانبي |
| Sheet | `sheet.jsx` | درج جانبي |
| Skeleton | `skeleton.jsx` | عنصر تحميل |
| Spinner | `spinner.jsx` | مؤشر تحميل |
| Badge | `badge.jsx` | شارة |
| Tooltip | `tooltip.jsx` | تلميح |
| Command | `command.jsx` | بحث وأوامر |
| Toggle | `toggle.jsx` | زر تبديل |
| Toggle Group | `toggle-group.jsx` | مجموعة تبديل |
| Input OTP | `input-otp.jsx` | إدخال رمز التحقق |
| Separator | `separator.jsx` | فاصل |

### استخدام مكونات Shadcn
```jsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

function Example() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>فتح</Button>
      </DialogTrigger>
      <DialogContent>
        <Input placeholder="أدخل النص" />
      </DialogContent>
    </Dialog>
  );
}
```

---

## مكونات التطبيق المخصصة (`components/ui app/`)

### مكونات الإدخال

#### InputApp
```jsx
import InputApp from "@/components/ui app/InputApp";

<InputApp
  label="الاسم"
  name="name"
  placeholder="أدخل الاسم"
  icon={<UserIcon />}
/>
```

#### TextAreaInput
```jsx
import TextAreaInput from "@/components/ui app/TextAreaInput";

<TextAreaInput
  label="الوصف"
  name="description"
  placeholder="أدخل الوصف"
/>
```

#### FileInput
```jsx
import FileInput from "@/components/ui app/FileInput";

<FileInput
  label="الصورة"
  name="image"
  accept="image/*"
/>
```

#### ComboBoxInput
```jsx
import ComboBoxInput from "@/components/ui app/ComboBoxInput";

<ComboBoxInput
  label="الفريق"
  name="team"
  options={teams}
  placeholder="اختر الفريق"
/>
```

#### SelectInput
```jsx
import SelectInput from "@/components/ui app/SelectInput";

<SelectInput
  label="الحالة"
  name="status"
  options={[
    { value: "ACTIVE", label: "نشط" },
    { value: "INACTIVE", label: "غير نشط" }
  ]}
/>
```

#### DatePicker
```jsx
import DatePicker from "@/components/ui app/DatePicker";

<DatePicker
  label="تاريخ الميلاد"
  name="birthDate"
/>
```

#### SelectDateAndTimeInput
```jsx
import SelectDateAndTimeInput from "@/components/ui app/SelectDateAndTimeInput";

<SelectDateAndTimeInput
  label="موعد المباراة"
  dateFieldName="matchDate"
  timeFieldName="matchTime"
/>
```

#### ListInput
```jsx
import ListInput from "@/components/ui app/ListInput";

<ListInput
  label="الروابط"
  name="links"
  placeholder="أضف رابط"
/>
```

### مكونات التخطيط

#### FormSection
```jsx
import FormSection from "@/components/ui app/FormSection";

<FormSection title="معلومات اللاعب">
  {/* حقول النموذج */}
</FormSection>
```

#### FormRow
```jsx
import FormRow from "@/components/ui app/FormRow";

<FormRow>
  <InputApp name="firstName" label="الاسم الأول" />
  <InputApp name="lastName" label="الاسم الأخير" />
</FormRow>
```

### مكونات الجداول

#### Table
```jsx
import Table from "@/components/ui app/Table";

<Table
  columns={columns}
  data={data}
  pageSize={10}
/>
```

#### Pagination
```jsx
import Pagination from "@/components/ui app/Pagination";

<Pagination
  currentPage={1}
  totalPages={10}
  onPageChange={handlePageChange}
/>
```

### مكونات أخرى

#### BackPage
```jsx
import BackPage from "@/components/ui app/BackPage";

<BackPage title="إضافة لاعب" />
```

#### Loading
```jsx
import Loading from "@/components/ui app/Loading";

<Loading />
```

#### Model (Modal)
```jsx
import Model from "@/components/ui app/Model";

<Model
  isOpen={isOpen}
  onClose={handleClose}
  title="عنوان النافذة"
>
  {/* المحتوى */}
</Model>
```

#### MarkDown
```jsx
import MarkDown from "@/components/ui app/MarkDown";

<MarkDown
  value={content}
  onChange={handleChange}
/>
```

#### LocaleChange
```jsx
import LocaleChange from "@/components/ui app/LocaleChange";

<LocaleChange />  // تبديل اللغة
```

#### ToggleThemeMode
```jsx
import ToggleThemeMode from "@/components/ui app/ToggleThemeMode";

<ToggleThemeMode />  // تبديل الثيم
```

---

## مكونات Dashboard (`components/dashboard/`)

### SideNavBar
الشريط الجانبي الرئيسي للتنقل.
```jsx
import SideNavBar from "@/components/dashboard/SideNavBar";

<SideNavBar user={currentUser} />
```

### TopNav
شريط التنقل العلوي.
```jsx
import TopNav from "@/components/dashboard/TopNav";

<TopNav />
```
يحتوي على:
- الشعار
- تبديل الثيم
- تبديل اللغة
- زر تسجيل الخروج

### NavItems
قائمة عناصر التنقل.
```jsx
import NavItems from "@/components/dashboard/NavItems";

<NavItems />
```

### ServiceItem
بطاقة خدمة في الصفحة الرئيسية.
```jsx
import ServiceItem from "@/components/dashboard/ServiceItem";

<ServiceItem
  title="إدارة اللاعبين"
  description="إضافة وتعديل اللاعبين"
  icon={<PlayerIcon />}
  href="/dashboard/player-management"
/>
```

### ServicesContainer
حاوية بطاقات الخدمات.
```jsx
import ServicesContainer from "@/components/dashboard/ServicesContainer";

<ServicesContainer />
```

---

## مكونات الميزات

### إدارة اللاعبين (`components/Player Management/`)

#### PlayerFrom
نموذج إضافة/تعديل لاعب.
```jsx
import PlayerFrom from "@/components/Player Management/PlayerFrom";

<PlayerFrom
  initialValues={player}  // للتعديل
  teams={teams}
  games={games}
  countries={countries}
/>
```

#### PlayersTable
جدول عرض اللاعبين.
```jsx
import PlayersTable from "@/components/Player Management/PlayersTable";

<PlayersTable
  players={players}
  onDelete={handleDelete}
/>
```

#### FilterPlayers
فلاتر البحث عن اللاعبين.
```jsx
import FilterPlayers from "@/components/Player Management/FilterPlayers";

<FilterPlayers
  teams={teams}
  games={games}
/>
```

### إدارة الفرق (`components/teams management/`)

#### TeamForm
```jsx
import TeamForm from "@/components/teams management/TeamForm";

<TeamForm
  initialValues={team}
  games={games}
  countries={countries}
/>
```

#### TeamsTable
```jsx
import TeamsTable from "@/components/teams management/TeamsTable";

<TeamsTable teams={teams} />
```

### إدارة المباريات (`components/Matches Management/`)

#### MatchesFrom
```jsx
import MatchesFrom from "@/components/Matches Management/MatchesFrom";

<MatchesFrom
  teams={teams}
  tournaments={tournaments}
  games={games}
/>
```

#### TeamLineup
```jsx
import TeamLineup from "@/components/Matches Management/TeamLineup";

<TeamLineup
  team={team}
  players={players}
  onSave={handleSaveLineup}
/>
```

### إدارة الأخبار (`components/News/`)

#### NewsForm
```jsx
import NewsForm from "@/components/News/NewsForm";

<NewsForm
  initialValues={news}
  players={players}
  teams={teams}
/>
```

### الجوائز (`components/Awards/`)

#### AwardsForm
```jsx
import AwardsForm from "@/components/Awards/AwardsForm";

<AwardsForm
  playerId={playerId}  // أو teamId
/>
```

### الروابط (`components/Links/`)

#### LinksForm
```jsx
import LinksForm from "@/components/Links/LinksForm";

<LinksForm
  playerId={playerId}  // أو teamId
  links={existingLinks}
/>
```

---

## الأيقونات (`components/icons/`)

```jsx
import Player from "@/components/icons/Player";
import TeamsManagement from "@/components/icons/TeamsManagement";
import GamesManagement from "@/components/icons/GamesManagement";
import MatchesManagement from "@/components/icons/MatchesManagement";
import News from "@/components/icons/News";
import Champion from "@/components/icons/Champion";
import SuppotCenter from "@/components/icons/SuppotCenter";
import User from "@/components/icons/User";
import Admin from "@/components/icons/Admin";
import CountryIcon from "@/components/icons/CountryIcon";
import AgeIcon from "@/components/icons/AgeIcon";
import Title from "@/components/icons/Title";
import Description from "@/components/icons/Description";
import Date from "@/components/icons/Date";
import ImageIcon from "@/components/icons/ImageIcon";
import EmailIcon from "@/components/icons/EmailIcon";
import PasswordIcon from "@/components/icons/PasswordIcon";
```

---

## ThemeProvider (`components/Theme/`)

```jsx
import ThemeProvider from "@/components/Theme/ThemeProvider";

// في layout.jsx
<ThemeProvider
  attribute="class"
  defaultTheme="system"
  enableSystem
>
  {children}
</ThemeProvider>
```

---

## أنماط استخدام المكونات

### نموذج كامل
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

const validationSchema = Yup.object({
  name: Yup.string().required("الاسم مطلوب"),
  age: Yup.number().required("العمر مطلوب"),
});

function PlayerForm({ teams, games }) {
  return (
    <Formik
      initialValues={{ name: "", age: "", team: null, game: null }}
      validationSchema={validationSchema}
      onSubmit={async (values) => {
        await addPlayer(values);
      }}
    >
      <Form>
        <FormSection title="المعلومات الأساسية">
          <FormRow>
            <InputApp name="name" label="الاسم" />
            <InputApp name="age" label="العمر" type="number" />
          </FormRow>
          <FormRow>
            <SelectInput name="team" label="الفريق" options={teams} />
            <SelectInput name="game" label="اللعبة" options={games} />
          </FormRow>
        </FormSection>

        <FormSection title="الصور">
          <FileInput name="avatar" label="الصورة الشخصية" />
        </FormSection>

        <Button type="submit">حفظ</Button>
      </Form>
    </Formik>
  );
}
```

### جدول مع فلاتر
```jsx
function PlayersPage({ players, teams, games }) {
  return (
    <div>
      <FilterPlayers teams={teams} games={games} />
      <PlayersTable players={players} />
    </div>
  );
}
```

### صفحة مع تحميل
```jsx
import Loading from "@/components/ui app/Loading";
import { Suspense } from "react";

function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <PlayersContent />
    </Suspense>
  );
}
```
