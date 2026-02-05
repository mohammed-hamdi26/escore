"use client";
import { useFormik } from "formik";
import {
  Link,
  FileText,
  Image as ImageIcon,
  User,
  Calendar,
  CalendarDays,
  Gamepad2,
  Trophy,
  Users,
  Swords,
  Star,
  ArrowLeft,
  Save,
  Plus,
  AlertCircle,
  CheckCircle2,
  Settings,
  ChevronLeft,
  ChevronRight,
  X,
  Languages,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import * as yup from "yup";
import FileInput from "../ui app/FileInput";
import FormRow from "../ui app/FormRow";
import FormSection from "../ui app/FormSection";
import ImageUpload from "../ui app/ImageUpload";
import InputApp from "../ui app/InputApp";
import RichTextEditor from "../ui app/RichTextEditor";
import SearchableSelect from "../ui app/SearchableSelect";
import { Calendar as CalendarComponent } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { Switch } from "../ui/switch";

// Validation schema - Required: title, content, coverImageLight, authorName, authorPicture
const validationSchema = yup.object({
  // Required fields
  title: yup.string().required("titleRequired").max(300, "titleTooLong"),
  content: yup.string().required("contentRequired").min(10, "contentTooShort"),
  coverImageLight: yup.string().required("coverImageRequired"),
  authorName: yup
    .string()
    .required("authorNameRequired")
    .max(100, "authorNameTooLong"),
  authorPicture: yup.string().required("authorImageRequired"),

  // Optional fields
  coverImageDark: yup.string(),
  urlExternal: yup.string().url("invalidUrl").nullable(),
  game: yup.string().nullable(),
  tournament: yup.string().nullable(),
  team: yup.string().nullable(),
  player: yup.string().nullable(),
  match: yup.string().nullable(),
  publishedAt: yup.date().nullable(),
  isFeatured: yup.boolean(),
});

// Progress calculation helper
const calculateProgress = (values, errors) => {
  const requiredFields = ['title', 'content', 'coverImageLight', 'authorName', 'authorPicture'];
  const filledRequired = requiredFields.filter(field => values[field] && !errors[field]).length;
  return Math.round((filledRequired / requiredFields.length) * 100);
};

// Future Date Picker Component for Publish Date
function FutureDatePickerField({ label, name, formik, placeholder }) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(new Date());
  const error = formik.touched[name] && formik.errors[name];
  const value = formik.values[name];
  const t = useTranslations("newsForm");

  const selectedDate = value ? new Date(value) : undefined;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Years from current year to +10 years in the future
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 11 }, (_, i) => currentYear + i);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const formatDisplayDate = (dateValue) => {
    if (!dateValue) return "";
    const date = new Date(dateValue);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const calculateDaysUntil = (dateValue) => {
    if (!dateValue) return null;
    const targetDate = new Date(dateValue);
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);
    targetDate.setHours(0, 0, 0, 0);
    const diffTime = targetDate - todayDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleSelect = async (date) => {
    if (date) {
      await formik.setFieldValue(name, date);
      await formik.setFieldTouched(name, true, true);
      formik.validateField(name);
    }
    setIsOpen(false);
  };

  const handleClear = async (e) => {
    e.stopPropagation();
    await formik.setFieldValue(name, null);
    await formik.setFieldTouched(name, true, true);
    formik.validateField(name);
  };

  const handleMonthChange = (monthIndex) => {
    const newDate = new Date(viewDate);
    newDate.setMonth(monthIndex);
    setViewDate(newDate);
  };

  const handleYearChange = (year) => {
    const newDate = new Date(viewDate);
    newDate.setFullYear(year);
    setViewDate(newDate);
  };

  const goToPreviousMonth = () => {
    const newDate = new Date(viewDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setViewDate(newDate);
  };

  const goToNextMonth = () => {
    const newDate = new Date(viewDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setViewDate(newDate);
  };

  const daysUntil = calculateDaysUntil(value);

  const getTimeLabel = () => {
    if (daysUntil === null) return null;
    if (daysUntil === 0) return t("today") || "Today";
    if (daysUntil === 1) return t("tomorrow") || "Tomorrow";
    if (daysUntil < 0) return t("published") || "Published";
    return `${t("in") || "in"} ${daysUntil} ${t("days") || "days"}`;
  };

  return (
    <div className="flex-1 space-y-2">
      <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
        <Calendar className="size-4" />
        {label}
      </label>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <div
            role="button"
            tabIndex={0}
            className={`w-full h-12 px-4 rounded-xl bg-gray-50 dark:bg-[#1a1d2e] border border-transparent text-sm text-left rtl:text-right focus:outline-none focus:ring-2 focus:ring-green-primary/50 cursor-pointer transition-all hover:bg-gray-100 dark:hover:bg-[#252a3d] flex items-center justify-between gap-2 ${
              error ? "ring-2 ring-red-500 border-red-500" : ""
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-lg bg-green-primary/10 flex items-center justify-center">
                <CalendarDays className="size-5 text-green-primary" />
              </div>
              {value ? (
                <div className="flex items-center gap-2">
                  <span className="text-foreground font-medium">
                    {formatDisplayDate(value)}
                  </span>
                  {getTimeLabel() && (
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      daysUntil === 0
                        ? "bg-green-500/20 text-green-500"
                        : daysUntil < 0
                          ? "bg-blue-500/20 text-blue-500"
                          : "bg-muted dark:bg-[#252a3d] text-muted-foreground"
                    }`}>
                      {getTimeLabel()}
                    </span>
                  )}
                </div>
              ) : (
                <span className="text-muted-foreground">{placeholder}</span>
              )}
            </div>
            {value && (
              <span
                role="button"
                tabIndex={0}
                onClick={handleClear}
                onKeyDown={(e) => e.key === "Enter" && handleClear(e)}
                className="size-7 rounded-lg bg-muted hover:bg-red-500/20 flex items-center justify-center transition-colors group cursor-pointer"
              >
                <X className="size-4 text-muted-foreground group-hover:text-red-500" />
              </span>
            )}
          </div>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0 bg-background dark:bg-[#12141c] border-border"
          align="start"
        >
          {/* Year/Month Navigation */}
          <div className="p-3 border-b border-border">
            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={goToPreviousMonth}
                className="size-8 rounded-lg bg-muted/50 dark:bg-[#1a1d2e] hover:bg-muted dark:hover:bg-[#252a3d] flex items-center justify-center transition-colors"
              >
                <ChevronLeft className="size-4 text-foreground rtl:rotate-180" />
              </button>

              <div className="flex items-center gap-2">
                <select
                  value={viewDate.getMonth()}
                  onChange={(e) => handleMonthChange(parseInt(e.target.value))}
                  className="h-8 px-2 rounded-lg bg-muted/50 dark:bg-[#1a1d2e] border-0 text-sm text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-green-primary/50 cursor-pointer"
                >
                  {months.map((month, index) => (
                    <option key={month} value={index}>
                      {month}
                    </option>
                  ))}
                </select>

                <select
                  value={viewDate.getFullYear()}
                  onChange={(e) => handleYearChange(parseInt(e.target.value))}
                  className="h-8 px-2 rounded-lg bg-muted/50 dark:bg-[#1a1d2e] border-0 text-sm text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-green-primary/50 cursor-pointer"
                >
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={goToNextMonth}
                className="size-8 rounded-lg bg-muted/50 dark:bg-[#1a1d2e] hover:bg-muted dark:hover:bg-[#252a3d] flex items-center justify-center transition-colors"
              >
                <ChevronRight className="size-4 text-foreground rtl:rotate-180" />
              </button>
            </div>
          </div>

          {/* Calendar */}
          <CalendarComponent
            mode="single"
            selected={selectedDate}
            onSelect={handleSelect}
            month={viewDate}
            onMonthChange={setViewDate}
            disabled={(date) => {
              const dateToCheck = new Date(date);
              dateToCheck.setHours(0, 0, 0, 0);
              return dateToCheck < today;
            }}
            initialFocus
            className="rounded-xl"
            classNames={{
              nav: "hidden",
              caption: "hidden",
            }}
          />
        </PopoverContent>
      </Popover>
      {error && (
        <p className="text-xs text-red-500">{t(error) || error}</p>
      )}
    </div>
  );
}

function NewsFormRedesign({
  formType = "add",
  submit,
  newData,
  options: {
    playersOptions = [],
    teamsOptions = [],
    tournamentsOptions = [],
    gamesOptions = [],
    matchesOptions = [],
  },
  locale = "en",
}) {
  const t = useTranslations("newsForm");
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      title: newData?.title || "",
      content: newData?.content || "",
      coverImageLight: newData?.coverImage?.light || "",
      coverImageDark: newData?.coverImage?.dark || "",
      authorName: newData?.authorName || "",
      authorPicture: newData?.authorImage?.light || "",
      urlExternal: newData?.urlExternal || "",
      game: newData?.game?.id || "",
      tournament: newData?.tournament?.id || "",
      team: newData?.team?.id || "",
      player: newData?.player?.id || "",
      match: newData?.match?.id || "",
      publishedAt: newData?.publishedAt ? new Date(newData.publishedAt) : null,
      isFeatured: newData?.isFeatured || false,
      originalLanguage: newData?.originalLanguage || locale || "en",
    },
    validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      try {
        const dataValues = {
          ...(newData ? { id: newData.id } : {}),
          title: values.title,
          content: values.content,
          coverImage: {
            light: values.coverImageLight,
            dark: values.coverImageDark || undefined,
          },
          authorName: values.authorName,
          authorImage: {
            light: values.authorPicture,
            dark: values.authorPicture,
          },
          urlExternal: values.urlExternal || undefined,
          game: values.game || undefined,
          tournament: values.tournament || undefined,
          team: values.team || undefined,
          player: values.player || undefined,
          match: values.match || undefined,
          publishedAt: values.publishedAt
            ? values.publishedAt.toISOString()
            : undefined,
          isFeatured: values.isFeatured,
          originalLanguage: values.originalLanguage || "en",
        };

        await submit(dataValues);

        if (formType === "add") {
          formik.resetForm();
        }

        toast.success(formType === "add" ? t("addSuccess") : t("editSuccess"));
      } catch (error) {
        if (!error.toString().includes("NEXT_REDIRECT")) {
          toast.error(error.message || t("error"));
        } else {
          toast.success(
            formType === "add" ? t("addSuccess") : t("editSuccess")
          );
        }
      }
    },
  });

  const progress = calculateProgress(formik.values, formik.errors);
  const isComplete = progress === 100;


  return (
    <div className="space-y-6 pb-24">
      {/* Header with Progress */}
      <div className="bg-white dark:bg-[#0f1118] rounded-2xl border border-gray-200 dark:border-white/5 shadow-sm dark:shadow-none p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="size-10 rounded-xl bg-gray-100 dark:bg-white/5 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
            >
              <ArrowLeft className="size-5 text-gray-600 dark:text-gray-400" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {formType === "add" ? t("addNews") || "Add News" : t("editNews") || "Edit News"}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                {t("fillRequiredFields") || "Fill in the required fields to publish your news"}
              </p>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-2">
                {isComplete ? (
                  <CheckCircle2 className="size-5 text-green-500" />
                ) : (
                  <AlertCircle className="size-5 text-amber-500" />
                )}
                <span className={`text-sm font-medium ${isComplete ? 'text-green-500' : 'text-amber-500'}`}>
                  {progress}% {t("complete") || "Complete"}
                </span>
              </div>
              <div className="w-32 h-2 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${isComplete ? 'bg-green-500' : 'bg-amber-500'}`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <form className="space-y-6" onSubmit={formik.handleSubmit}>
        {/* Section 1: Basic Information (Required) */}
        <FormSection
          title={t("basicInfo")}
          icon={<FileText className="size-5" />}
          badge={
            <span className="text-xs bg-red-500/10 text-red-500 px-2.5 py-1 rounded-full font-medium">
              {t("required")}
            </span>
          }
        >
          <FormRow>
            <InputApp
              name="title"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.title}
              label={t("title")}
              placeholder={t("titlePlaceholder")}
              className="border-0 focus:outline-none"
              backGroundColor="bg-gray-50 dark:bg-[#0F1017]"
              textColor="text-gray-600 dark:text-gray-400"
              error={
                formik.touched.title &&
                formik.errors.title &&
                t(formik.errors.title)
              }
              required
            />
          </FormRow>

          <FormRow cols={1}>
            <RichTextEditor
              name="content"
              formik={formik}
              label={t("content")}
              placeholder={t("contentPlaceholder")}
              error={
                formik.touched.content &&
                formik.errors.content &&
                t(formik.errors.content)
              }
              minHeight="500px"
            />
          </FormRow>
        </FormSection>

        {/* Section 2: Cover Image (Required) */}
        <FormSection
          title={t("coverImage")}
          icon={<ImageIcon className="size-5" />}
          badge={
            <span className="text-xs bg-red-500/10 text-red-500 px-2.5 py-1 rounded-full font-medium">
              {t("required")}
            </span>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ImageUpload
              label={t("coverImageLight")}
              name="coverImageLight"
              formik={formik}
              aspectRatio="news-cover"
              hint={t("coverImagePlaceholder") || "Recommended: 1200x630px"}
            />
            <ImageUpload
              label={t("coverImageDark")}
              name="coverImageDark"
              formik={formik}
              aspectRatio="news-cover"
              hint={t("coverImageDarkPlaceholder") || "Optional dark mode version"}
            />
          </div>
          {formik.touched.coverImageLight && formik.errors.coverImageLight && (
            <p className="text-xs text-red-500 mt-2">{t(formik.errors.coverImageLight)}</p>
          )}
        </FormSection>

        {/* Section 3: Author Info (Required) */}
        <FormSection
          title={t("authorInfo")}
          icon={<User className="size-5" />}
          badge={
            <span className="text-xs bg-red-500/10 text-red-500 px-2.5 py-1 rounded-full font-medium">
              {t("required")}
            </span>
          }
        >
          <div className="space-y-4">
            {/* Author Name */}
            <InputApp
              name="authorName"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.authorName}
              label={t("authorName")}
              placeholder={t("authorNamePlaceholder")}
              className="border-0 focus:outline-none"
              backGroundColor="bg-gray-50 dark:bg-[#0F1017]"
              textColor="text-gray-600 dark:text-gray-400"
              icon={<User className="size-5 text-gray-400" />}
              error={
                formik.touched.authorName &&
                formik.errors.authorName &&
                t(formik.errors.authorName)
              }
              required
            />

            {/* Author Photo */}
            <div className="max-w-xs">
              <ImageUpload
                label={t("authorPicture")}
                name="authorPicture"
                formik={formik}
                aspectRatio="square"
                hint={t("authorPicturePlaceholder") || "Author profile picture"}
                compact
              />
              {formik.touched.authorPicture && formik.errors.authorPicture && (
                <p className="text-xs text-red-500 mt-2">{t(formik.errors.authorPicture)}</p>
              )}
            </div>
          </div>
        </FormSection>

        {/* Related Entities Card */}
        <FormSection
          title={t("relatedEntities") || "Related Entities"}
          icon={<Gamepad2 className="size-5" />}
          badge={
            <span className="text-xs bg-gray-500/20 text-gray-400 px-2 py-0.5 rounded">
              {t("optional") || "Optional"}
            </span>
          }
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <SearchableSelect
              label={t("game")}
              icon={Gamepad2}
              placeholder={t("selectGame")}
              searchPlaceholder={t("searchGame") || "Search game..."}
              emptyMessage={t("noGameFound") || "No game found"}
              value={formik.values.game}
              onChange={async (value) => { await formik.setFieldValue("game", value); formik.validateField("game"); }}
              options={gamesOptions.map((g) => ({
                value: g.id || g._id,
                label: g.name,
                image: g.logo?.light || g.logo?.dark,
              }))}
            />
            <SearchableSelect
              label={t("tournament")}
              icon={Trophy}
              placeholder={t("selectTournament")}
              searchPlaceholder={t("searchTournament") || "Search tournament..."}
              emptyMessage={t("noTournamentFound") || "No tournament found"}
              value={formik.values.tournament}
              onChange={async (value) => { await formik.setFieldValue("tournament", value); formik.validateField("tournament"); }}
              options={tournamentsOptions.map((t) => ({
                value: t.id || t._id,
                label: t.name,
                image: t.logo?.light || t.logo?.dark,
              }))}
            />
            <SearchableSelect
              label={t("team")}
              icon={Users}
              placeholder={t("selectTeam")}
              searchPlaceholder={t("searchTeam") || "Search team..."}
              emptyMessage={t("noTeamFound") || "No team found"}
              value={formik.values.team}
              onChange={async (value) => { await formik.setFieldValue("team", value); formik.validateField("team"); }}
              options={teamsOptions.map((t) => ({
                value: t.id || t._id,
                label: t.name,
                image: t.logo?.light || t.logo?.dark,
                subtitle: t.shortName,
              }))}
            />
            <SearchableSelect
              label={t("player")}
              icon={User}
              placeholder={t("selectPlayer")}
              searchPlaceholder={t("searchPlayer") || "Search player..."}
              emptyMessage={t("noPlayerFound") || "No player found"}
              value={formik.values.player}
              onChange={async (value) => { await formik.setFieldValue("player", value); formik.validateField("player"); }}
              options={playersOptions.map((p) => ({
                value: p.id || p._id,
                label: p.nickname || p.name,
                image: p.photo?.light || p.photo?.dark,
                subtitle: p.team?.name,
              }))}
            />
            <SearchableSelect
              label={t("match")}
              icon={Swords}
              placeholder={t("selectMatch")}
              searchPlaceholder={t("searchMatch") || "Search match..."}
              emptyMessage={t("noMatchFound") || "No match found"}
              value={formik.values.match}
              onChange={async (value) => { await formik.setFieldValue("match", value); formik.validateField("match"); }}
              options={matchesOptions.map((m) => ({
                value: m.id || m._id,
                label: `${m.team1?.name || "TBD"} vs ${m.team2?.name || "TBD"}`,
                subtitle: m.tournament?.name,
              }))}
            />
          </div>
        </FormSection>

        {/* Additional Settings */}
        <FormSection
          title={t("optionalSections") || "Additional Settings"}
          icon={<Settings className="size-5" />}
          badge={
            <span className="text-xs bg-gray-500/20 text-gray-400 px-2 py-0.5 rounded">
              {t("optional") || "Optional"}
            </span>
          }
        >
          {/* Content Language - Important for translation */}
          <div className="mb-4 p-4 rounded-xl bg-blue-500/10 dark:bg-blue-500/5 border border-blue-500/20">
            <div className="flex items-start gap-3">
              <Languages className="size-5 text-blue-500 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                  {t("originalLanguage") || "Content Language"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                  {t("originalLanguageHint") || "Select the language you're writing in. Auto-translation will be applied."}
                </p>
                <select
                  name="originalLanguage"
                  value={formik.values.originalLanguage}
                  onChange={formik.handleChange}
                  className="w-full md:w-auto h-10 px-3 rounded-lg bg-white dark:bg-[#1a1d2e] border border-gray-200 dark:border-white/10 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer"
                >
                  <option value="en">{t("languages.en") || "English"}</option>
                  <option value="ar">{t("languages.ar") || "Arabic"}</option>
                  <option value="fr">{t("languages.fr") || "French"}</option>
                  <option value="es">{t("languages.es") || "Spanish"}</option>
                  <option value="de">{t("languages.de") || "German"}</option>
                  <option value="tr">{t("languages.tr") || "Turkish"}</option>
                  <option value="pt">{t("languages.pt") || "Portuguese"}</option>
                  <option value="it">{t("languages.it") || "Italian"}</option>
                  <option value="ru">{t("languages.ru") || "Russian"}</option>
                  <option value="zh">{t("languages.zh") || "Chinese"}</option>
                  <option value="ja">{t("languages.ja") || "Japanese"}</option>
                  <option value="ko">{t("languages.ko") || "Korean"}</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Featured Toggle */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-amber-500/10 dark:bg-amber-500/5 border border-amber-500/20">
              <div className="flex items-center gap-3">
                <Star className="size-5 text-amber-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{t("featuredNews") || "Featured News"}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{t("featuredDescription") || "Show on homepage"}</p>
                </div>
              </div>
              <Switch
                checked={formik.values.isFeatured}
                onCheckedChange={(checked) => formik.setFieldValue("isFeatured", checked)}
                className="data-[state=checked]:bg-amber-500"
              />
            </div>

            {/* Publish Date */}
            <FutureDatePickerField
              formik={formik}
              name="publishedAt"
              label={t("publishDate")}
              placeholder={t("publishDatePlaceholder") || "Select publish date"}
            />
          </div>

          {/* External Link */}
          <div className="mt-4">
            <InputApp
              name="urlExternal"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.urlExternal}
              label={t("externalUrl")}
              placeholder={t("externalUrlPlaceholder")}
              className="border-0 focus:outline-none"
              backGroundColor="bg-gray-50 dark:bg-[#0F1017]"
              textColor="text-gray-600 dark:text-gray-400"
              icon={<Link className="size-5 text-gray-400" />}
              error={
                formik.touched.urlExternal &&
                formik.errors.urlExternal &&
                t(formik.errors.urlExternal)
              }
            />
          </div>
        </FormSection>

        {/* Sticky Submit Footer */}
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 dark:bg-[#0a0c10]/80 backdrop-blur-xl border-t border-gray-200 dark:border-white/5">
          <div className="max-w-6xl mx-auto px-4 md:px-6 py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className={`size-3 rounded-full ${isComplete ? 'bg-green-500' : 'bg-amber-500'} animate-pulse`} />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {isComplete ? (
                    <span className="text-green-500 font-medium">{t("readyToSubmit") || "Ready to submit"}</span>
                  ) : (
                    <span><span className="text-red-500">*</span> {t("requiredFields")}</span>
                  )}
                </span>
              </div>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="border-gray-300 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5"
                >
                  <ArrowLeft className="size-4 mr-2 rtl:mr-0 rtl:ml-2" />
                  {t("cancel")}
                </Button>
                <Button
                  type="submit"
                  disabled={formik.isSubmitting || !formik.isValid}
                  className="bg-green-primary hover:bg-green-600 text-white min-w-[160px] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-primary/25"
                >
                  {formik.isSubmitting ? (
                    <Spinner />
                  ) : formType === "add" ? (
                    <>
                      <Plus className="size-4 mr-2 rtl:mr-0 rtl:ml-2" />
                      {t("submit")}
                    </>
                  ) : (
                    <>
                      <Save className="size-4 mr-2 rtl:mr-0 rtl:ml-2" />
                      {t("save")}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default NewsFormRedesign;
