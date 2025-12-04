# مرجع API - API Reference

## API Client

### الإعداد الأساسي
**الملف:** `app/[locale]/_Lib/apiClient.js`

```javascript
const apiClient = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor - يضيف التوكن تلقائياً
apiClient.interceptors.request.use(async (config) => {
  const token = (await cookies()).get("session")?.value;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

---

## نقاط النهاية (Endpoints)

### 1. المصادقة (Authentication)

| العملية | الدالة | Endpoint | Method |
|---------|--------|----------|--------|
| تسجيل الدخول | `login(userData)` | `/auth/login` | POST |
| التسجيل | `register(userData)` | `/register` | POST |
| تفعيل الحساب | `verifyAccount(code)` | `/activate?key={code}` | GET |
| تسجيل الخروج | `logout()` | - | Cookie Delete |
| تغيير كلمة المرور | `changePassword(data)` | `/users/change-password` | PUT |

**أمثلة:**
```javascript
// تسجيل الدخول
await login({ email: "admin@example.com", password: "123456" });

// تغيير كلمة المرور
await changePassword({
  currentPassword: "oldpass",
  newPassword: "newpass"
});
```

---

### 2. اللاعبين (Players)

| العملية | الدالة | Endpoint | Method |
|---------|--------|----------|--------|
| جلب الكل | `getPlayers(params)` | `/players` | GET |
| جلب واحد | `getPlayer(id)` | `/players/{id}` | GET |
| العدد | `getPlayersCount()` | `/players/count` | GET |
| إضافة | `addPlayer(data)` | `/players` | POST |
| تعديل | `editPlayer(data)` | `/players/{id}` | PUT |
| حذف | `deletePlayer(id)` | `/players/{id}` | DELETE |

**البارامترات:**
```javascript
// params للفلترة
{
  "name.contains": "ahmed",
  "team.id.equals": 1,
  "game.id.equals": 2,
  "country.code.equals": "EG",
  "page": 0,
  "size": 10
}
```

**مثال الاستخدام:**
```javascript
// جلب اللاعبين مع فلتر
const players = await getPlayers({
  "name.contains": "ahmed",
  "page": 0,
  "size": 10
});

// إضافة لاعب
await addPlayer({
  name: "Ahmed Ali",
  age: 22,
  country: { code: "EG" },
  team: { id: 1 },
  game: { id: 1 }
});
```

---

### 3. الفرق (Teams)

| العملية | الدالة | Endpoint | Method |
|---------|--------|----------|--------|
| جلب الكل | `getTeams(params)` | `/teams` | GET |
| جلب واحد | `getTeam(id)` | `/teams/{id}` | GET |
| العدد | `getTeamsCount()` | `/teams/count` | GET |
| إضافة | `addTeam(data)` | `/teams` | POST |
| تعديل | `updateTeam(data)` | `/teams/{id}` | PUT |
| حذف | `deleteTeam(id)` | `/teams/{id}` | DELETE |

**مثال:**
```javascript
await addTeam({
  name: "Team Falcon",
  country: { code: "SA" },
  game: { id: 1 },
  logo: "https://..."
});
```

---

### 4. المباريات (Matches)

| العملية | الدالة | Endpoint | Method |
|---------|--------|----------|--------|
| جلب الكل | `getMatches(params)` | `/matches` | GET |
| جلب واحد | `getMatch(id)` | `/matches/{id}` | GET |
| العدد | `getMatchesCount()` | `/matches/count` | GET |
| إضافة | `addMatch(data)` | `/matches` | POST |
| تعديل | `updateMatch(data)` | `/matches/{id}` | PUT |
| حذف | `deleteMatch(id)` | `/matches/{id}` | DELETE |

**مثال:**
```javascript
await addMatch({
  team1: { id: 1 },
  team2: { id: 2 },
  tournament: { id: 1 },
  game: { id: 1 },
  date: "2024-01-15",
  time: "18:00",
  stage: "SEMI_FINAL"
});
```

---

### 5. الألعاب (Games)

| العملية | الدالة | Endpoint | Method |
|---------|--------|----------|--------|
| جلب الكل | `getGames(params)` | `/games` | GET |
| جلب واحد | `getGame(id)` | `/games/{id}` | GET |
| العدد | `getGamesCount()` | `/games/count` | GET |
| إضافة | `addGame(data)` | `/games` | POST |
| تعديل | `updateGame(data)` | `/games/{id}` | PUT |
| حذف | `deleteGame(id)` | `/games/{id}` | DELETE |

---

### 6. الأخبار (News)

| العملية | الدالة | Endpoint | Method |
|---------|--------|----------|--------|
| جلب الكل | `getNews(params)` | `/news` | GET |
| جلب واحد | `getNew(id)` | `/news/{id}` | GET |
| العدد | `getNewsCount()` | `/news/count` | GET |
| إضافة | `addNews(data)` | `/news` | POST |
| تعديل | `editNews(data)` | `/news/{id}` | PUT |
| حذف | `deleteNew(id)` | `/news/{id}` | DELETE |

**حالات الأخبار:**
- `DRAFT` - مسودة
- `PUBLISHED` - منشور

---

### 7. البطولات (Tournaments)

| العملية | الدالة | Endpoint | Method |
|---------|--------|----------|--------|
| جلب الكل | `getTournaments(params)` | `/tournaments` | GET |
| جلب واحد | `getTournament(id)` | `/tournaments/{id}` | GET |
| العدد | `getNumOfTournaments()` | `/tournaments/count` | GET |
| إضافة | `addTournament(data)` | `/tournaments` | POST |
| تعديل | `editTournament(data)` | `/tournaments/{id}` | PUT |
| حذف | `deleteTournament(id)` | `/tournaments/{id}` | DELETE |

---

### 8. الانتقالات (Transfers)

| العملية | الدالة | Endpoint | Method |
|---------|--------|----------|--------|
| جلب الكل | `getTransfers(params)` | `/transfers` | GET |
| جلب واحد | `getTransfer(id)` | `/transfers/{id}` | GET |
| إضافة | `addTransfer(data)` | `/transfers` | POST |
| تعديل | `editTransfer(data)` | `/transfers/{id}` | PUT |
| حذف | `deleteTransfer(id)` | `/transfers/{id}` | DELETE |

---

### 9. المستخدمين (Users)

| العملية | الدالة | Endpoint | Method |
|---------|--------|----------|--------|
| الملف الشخصي | `getLoginUser()` | `/users/profile` | GET |
| جلب الكل | `getUsers()` | `/admin/users` | GET |
| إضافة | `addUser(data)` | `/admin/users` | POST |
| تعديل | `editUser(data)` | `/admin/users/{id}` | PUT |
| حذف | `deleteUser(id)` | `/admin/users/{id}` | DELETE |

---

### 10. الروابط الاجتماعية (Social Links)

| العملية | الدالة | Endpoint | Method |
|---------|--------|----------|--------|
| جلب الكل | `getLinks(params)` | `/social-links` | GET |
| إضافة | `addLink(data)` | `/social-links` | POST |
| تعديل | `updateLink(data)` | `/social-links/{id}` | PUT |
| حذف | `deleteLink(id)` | `/social-links/{id}` | DELETE |

---

### 11. التشكيلات (Lineups)

| العملية | الدالة | Endpoint | Method |
|---------|--------|----------|--------|
| جلب للمباراة | `getLineups({matchId})` | `/lineups?matchId.equals={id}` | GET |
| إضافة | `addLineUp(data)` | `/lineups` | POST |

---

### 12. الجوائز والإنجازات (Achievements)

| العملية | الدالة | Endpoint | Method |
|---------|--------|----------|--------|
| إضافة جائزة | `addAward(data)` | `/achievements` | POST |
| إضافة شخصية مفضلة | `addFavoriteCharacter(data)` | `/favorite-characters` | POST |

---

### 13. الدعم الفني (Support)

| العملية | الدالة | Endpoint | Method |
|---------|--------|----------|--------|
| جلب التذاكر | `getTickets()` | `/support/admin/tickets` | GET |
| الرد على تذكرة | `replayTicket(id, data)` | `/support/tickets/{id}/replay` | PATCH |

---

### 14. الإعدادات (Settings)

#### اللغات
| العملية | الدالة | Endpoint | Method |
|---------|--------|----------|--------|
| جلب الكل | `getLanguages()` | `/settings/languages` | GET |
| جلب واحدة | `getSpecificLanguage(code)` | `/settings/languages/{code}` | GET |
| إضافة | `addLanguage(data)` | `/settings/languages` | POST |
| تعديل | `updateLanguage(code, data)` | `/settings/languages/{code}` | PATCH |
| حذف | `deleteLanguage(code)` | `/settings/languages/{code}` | DELETE |

#### القاموس
| العملية | الدالة | Endpoint | Method |
|---------|--------|----------|--------|
| جلب الكلمات | `getDictionaryWords(code)` | `/settings/languages/{code}` | GET |
| إضافة كلمة | `addToDictionary(code, data)` | `/settings/languages/{code}/dictionary` | POST |
| تعديل كلمة | `updateWord(code, word, translation)` | `/settings/languages/{code}/dictionary/{word}` | PUT |
| حذف كلمة | `deleteWord(code, word)` | `/settings/languages/{code}/dictionary/{word}` | DELETE |

#### الثيمات
| العملية | الدالة | Endpoint | Method |
|---------|--------|----------|--------|
| جلب الكل | `getAllThemes()` | `/settings/themes` | GET |
| إضافة | `addTheme(data)` | `/settings/themes` | POST |
| تعديل | `updateTheme(data, id)` | `/settings/themes/{id}` | PUT |
| حذف | `deleteTheme(id)` | `/settings/themes/{id}` | DELETE |

#### صفحة من نحن
| العملية | الدالة | Endpoint | Method |
|---------|--------|----------|--------|
| جلب | `getAboutContent(code)` | `/settings/about-app/{code}` | GET |
| إضافة | `addAboutContent(code, content)` | `/settings/about-app` | POST |
| تعديل | `updateAboutContent(code, content)` | `/settings/about-app/{code}` | PATCH |
| حذف | `deleteAboutContent(code)` | `/settings/about-app/{code}` | DELETE |

#### سياسة الخصوصية
| العملية | الدالة | Endpoint | Method |
|---------|--------|----------|--------|
| جلب | `getPrivacyContent(code)` | `/settings/privacy/{code}` | GET |
| إضافة | `addPrivacyContent(code, content)` | `/settings/privacy` | POST |
| تعديل | `updatePrivacyContent(code, content)` | `/settings/privacy/{code}` | PUT |
| حذف | `deletePrivacyContent(code)` | `/settings/privacy/{code}` | DELETE |

#### روابط التطبيق
| العملية | الدالة | Endpoint | Method |
|---------|--------|----------|--------|
| جلب | `getAppLinks()` | `/settings/social-links` | GET |
| إضافة | `addAppSocialLink(data)` | `/settings/social-links` | POST |
| تعديل | `updateAppSocialLink(data)` | `/settings/social-links/{id}` | PUT |
| حذف | `deleteAppSocialLink(id)` | `/settings/social-links/{id}` | DELETE |

---

### 15. رفع الملفات (Upload)

| العملية | الدالة | Endpoint | Method |
|---------|--------|----------|--------|
| رفع صورة | `uploadPhoto(formData)` | `/upload/image` | POST |

**ملاحظة:** يجب إرسال `Content-Type: multipart/form-data`

```javascript
const formData = new FormData();
formData.append("image", file);
const imageUrl = await uploadPhoto(formData);
```

---

## الدوال المساعدة

**الملف:** `app/[locale]/_Lib/helps.js`

```javascript
// تحويل مصفوفة لخيارات select
mappedArrayToSelectOptions(array, labelKey, valueKey)

// حساب عدد الصفحات
getNumPages(totalItems, pageSize)

// أول 10 كلمات
getFirst10Words(str)

// دمج التاريخ والوقت
combineDateAndTime(date, time)
```
