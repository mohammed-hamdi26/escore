# Server Actions - الإجراءات على الخادم

## ما هي Server Actions؟

Server Actions هي دوال تُنفذ على الخادم مباشرة ويمكن استدعاؤها من المكونات. تُستخدم للعمليات التي تتطلب أمان أو صلاحيات.

**الملف الرئيسي:** `app/[locale]/_Lib/actions.js`

```javascript
"use server";
// هذا التوجيه يجعل كل الدوال تعمل على الخادم
```

---

## نمط Server Action العام

```javascript
"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";
import apiClient from "./apiCLient";

export async function addSomething(data) {
  const locale = await getLocale();

  try {
    const res = await apiClient.post("/endpoint", data);
    // return res.data; // إذا أردت إرجاع البيانات
  } catch (e) {
    console.log(e.response?.data?.errors);
    throw new Error("Error message");
  }

  // إعادة التوجيه بعد النجاح
  redirect(`/${locale}/dashboard/path`);

  // أو إعادة التحقق من الصفحة
  // revalidatePath(`/${locale}/dashboard/path`);
}
```

---

## إجراءات المصادقة

### تسجيل الدخول
```javascript
export async function login(userData) {
  try {
    const res = await apiClient.post("/auth/login", userData);
    await saveSession(res?.data?.data?.tokens?.accessToken);
  } catch (e) {
    throw new Error("Error in login");
  }
  redirect("/dashboard");
}
```

### تسجيل الخروج
```javascript
export async function logout() {
  await deleteSession();
  redirect("/login");
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

### التحقق من الحساب
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

---

## إجراءات اللاعبين

```javascript
// إضافة لاعب
export async function addPlayer(playerData) {
  try {
    await apiClient.post("/players", playerData);
  } catch (e) {
    throw new Error("Error in adding player");
  }
  redirect("/dashboard/player-management/edit");
}

// تعديل لاعب
export async function editPlayer(playerData) {
  const locale = await getLocale();
  try {
    const res = await apiClient.put(`/players/${playerData.id}`, playerData);
    revalidatePath(`${locale}/dashboard/player-management/edit/${playerData.id}`);
    return res.data;
  } catch (e) {
    throw new Error("Error in updating player");
  }
}

// حذف لاعب
export async function deletePlayer(id) {
  const locale = await getLocale();
  try {
    const res = await apiClient.delete(`/players/${id}`);
    revalidatePath(`${locale}/dashboard/player-management/edit`);
    return res.data;
  } catch (e) {
    throw new Error("error in Delete");
  }
}
```

---

## إجراءات الفرق

```javascript
export async function addTeam(teamData) {
  try {
    await apiClient.post("/teams", teamData);
  } catch (e) {
    throw new Error("Error in adding team");
  }
  redirect("/dashboard/teams-management/edit");
}

export async function updateTeam(teamData) {
  const locale = await getLocale();
  try {
    const res = await apiClient.put(`/teams/${teamData.id}`, teamData);
    revalidatePath(`/${locale}/dashboard/teams-management/edit/${teamData.id}`);
    return res.data;
  } catch (e) {
    throw new Error("Error in updating team");
  }
}

export async function deleteTeam(id) {
  const locale = await getLocale();
  try {
    const res = await apiClient.delete(`/teams/${id}`);
    revalidatePath(`/${locale}/dashboard/teams-management/edit`);
    return res.data;
  } catch (e) {
    throw new Error("error in Delete");
  }
}
```

---

## إجراءات المباريات

```javascript
export async function addMatch(matchData) {
  try {
    await apiClient.post("/matches", matchData);
  } catch (e) {
    throw new Error("Error in adding game");
  }
  redirect("/dashboard/matches-management/edit");
}

export async function updateMatch(matchData) {
  const locale = await getLocale();
  try {
    const res = await apiClient.put(`/matches/${matchData.id}`, matchData);
    revalidatePath(`/${locale}/dashboard/matches-management/edit/${matchData.id}`);
    return res.data;
  } catch (e) {
    throw new Error("Error in updating game");
  }
}

export async function deleteMatch(id) {
  const locale = await getLocale();
  try {
    const res = await apiClient.delete(`/matches/${id}`);
    revalidatePath(`/${locale}/dashboard/matches-management/edit`);
    return res.data;
  } catch (e) {
    throw new Error("error in Delete");
  }
}
```

---

## إجراءات الأخبار

```javascript
export async function addNews(newsData) {
  const locale = await getLocale();
  try {
    const newsDataWithDate = {
      ...newsData,
      publishDate: newsData.status === "PUBLISHED"
        ? new Date().toISOString()
        : newsData.publishDate,
    };
    await apiClient.post("/news", newsDataWithDate);
  } catch (e) {
    throw new Error("Error in adding news");
  }
  redirect(`/${locale}/dashboard/news/edit`);
}

export async function editNews(newsData) {
  const locale = await getLocale();
  try {
    const res = await apiClient.put(`/news/${newsData.id}`, newsData);
    revalidatePath(`/${locale}/dashboard/news/edit/${newsData.id}`);
    return res.data;
  } catch (e) {
    throw new Error("Error in updating news");
  }
}

export async function deleteNew(id) {
  const locale = await getLocale();
  try {
    const res = await apiClient.delete(`/news/${id}`);
    revalidatePath(`/${locale}/dashboard/news/edit`);
    return res.data;
  } catch (e) {
    throw new Error("error in Delete");
  }
}
```

---

## إجراءات رفع الصور

```javascript
export async function uploadPhoto(formData) {
  try {
    const res = await apiClient.post("/upload/image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data.data.url;
  } catch (e) {
    throw new Error("error in upload");
  }
}
```

**طريقة الاستخدام:**
```javascript
const formData = new FormData();
formData.append("image", file);
const url = await uploadPhoto(formData);
```

---

## إجراءات الإعدادات

### اللغات
```javascript
export async function addLanguage(language_data) {
  try {
    const response = await apiClient.post("/settings/languages", language_data);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function updateLanguage(code, language_data) {
  try {
    const response = await apiClient.patch(`/settings/languages/${code}`, language_data);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function deleteLanguage(code) {
  try {
    const response = await apiClient.delete(`/settings/languages/${code}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}
```

### القاموس
```javascript
export async function addToDictionary(code, { word, translation }) {
  try {
    const response = await apiClient.post(
      `/settings/languages/${code}/dictionary`,
      { word, translation }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function updateWord(code, word, translation) {
  try {
    const response = await apiClient.put(
      `/settings/languages/${code}/dictionary/${word}`,
      { translation }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function deleteWord(code, word) {
  try {
    const response = await apiClient.delete(
      `/settings/languages/${code}/dictionary/${word}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}
```

### الثيمات
```javascript
export async function addTheme(theme) {
  try {
    const res = await apiClient.post("/settings/themes", theme);
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function updateTheme(theme, theme_id) {
  try {
    const res = await apiClient.put(`/settings/themes/${theme_id}`, theme);
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function deleteTheme(theme_id) {
  try {
    const res = await apiClient.delete(`/settings/themes/${theme_id}`);
    return res.data;
  } catch (error) {
    throw error;
  }
}
```

---

## استخدام Server Actions في المكونات

### في نموذج (Form)
```jsx
import { addPlayer } from "@/app/[locale]/_Lib/actions";

function PlayerForm() {
  async function handleSubmit(values) {
    try {
      await addPlayer(values);
      // سيتم redirect تلقائياً
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <Formik onSubmit={handleSubmit}>
      {/* ... */}
    </Formik>
  );
}
```

### في زر حذف
```jsx
import { deletePlayer } from "@/app/[locale]/_Lib/actions";

function DeleteButton({ playerId }) {
  async function handleDelete() {
    try {
      await deletePlayer(playerId);
      toast.success("تم الحذف بنجاح");
    } catch (error) {
      toast.error("فشل الحذف");
    }
  }

  return <button onClick={handleDelete}>حذف</button>;
}
```

---

## معالجة الأخطاء

### النمط المستخدم
```javascript
export async function someAction(data) {
  try {
    const res = await apiClient.post("/endpoint", data);
    return res.data;
  } catch (e) {
    // طباعة تفاصيل الخطأ للتصحيح
    console.log(e.response?.data?.errors || e.response?.data || e);
    // رمي خطأ عام للمستخدم
    throw new Error("رسالة الخطأ");
  }
}
```

### في المكون
```jsx
async function handleSubmit(values) {
  try {
    await someAction(values);
    toast.success("تمت العملية بنجاح");
  } catch (error) {
    toast.error(error.message);
  }
}
```

---

## Cache Revalidation

### متى نستخدم revalidatePath
```javascript
// بعد التعديل - تحديث صفحة واحدة
revalidatePath(`/${locale}/dashboard/players/edit/${id}`);

// بعد الحذف - تحديث صفحة القائمة
revalidatePath(`/${locale}/dashboard/players/edit`);
```

### متى نستخدم redirect
```javascript
// بعد الإضافة - الانتقال لصفحة القائمة
redirect("/dashboard/players/edit");

// بعد تسجيل الدخول
redirect("/dashboard");

// بعد تسجيل الخروج
redirect("/login");
```
