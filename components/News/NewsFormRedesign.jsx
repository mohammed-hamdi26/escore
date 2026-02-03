"use client";
import { mappedArrayToSelectOptions } from "@/app/[locale]/_Lib/helps";
import { useFormik } from "formik";
import {
  Link,
  FileText,
  Image as ImageIcon,
  User,
  Calendar,
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
  ChevronDown,
  ChevronUp,
  Eye,
  Sparkles,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import * as yup from "yup";
import FileInput from "../ui app/FileInput";
import FormRow from "../ui app/FormRow";
import FormSection from "../ui app/FormSection";
import InputApp from "../ui app/InputApp";
import RichTextEditor from "../ui app/RichTextEditor";
import SelectInput from "../ui app/SelectInput";
import DatePicker from "../ui app/DatePicker";
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
  const [showOptionalSections, setShowOptionalSections] = useState({
    externalLink: false,
    relatedEntities: false,
    publishing: false,
  });

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

  const toggleSection = (section) => {
    setShowOptionalSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Collapsible Section Component
  const CollapsibleSection = ({ id, title, icon, children, hasContent = false }) => {
    const isOpen = showOptionalSections[id];
    return (
      <div className="bg-white dark:bg-[#0f1118] rounded-2xl border border-gray-200 dark:border-white/5 shadow-sm dark:shadow-none overflow-hidden transition-all duration-300">
        <button
          type="button"
          onClick={() => toggleSection(id)}
          className="w-full flex items-center justify-between p-6 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-gray-100 dark:bg-white/5 flex items-center justify-center">
              <span className="text-gray-500 dark:text-gray-400">{icon}</span>
            </div>
            <div className="text-left rtl:text-right">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {title}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {t("optional")} {hasContent && <span className="text-green-500">• {t("hasContent") || "Has content"}</span>}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-gray-100 dark:bg-white/5 text-gray-500 px-2 py-1 rounded-full">
              {t("optional")}
            </span>
            {isOpen ? (
              <ChevronUp className="size-5 text-gray-400" />
            ) : (
              <ChevronDown className="size-5 text-gray-400" />
            )}
          </div>
        </button>
        <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
          <div className="px-6 pb-6 space-y-6 border-t border-gray-100 dark:border-white/5 pt-6">
            {children}
          </div>
        </div>
      </div>
    );
  };

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
          {/* Cover Image Preview */}
          {formik.values.coverImageLight && (
            <div className="mb-6 relative group">
              <div className="aspect-video rounded-xl overflow-hidden bg-gray-100 dark:bg-white/5">
                <img
                  src={formik.values.coverImageLight}
                  alt="Cover preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                <span className="text-white text-sm font-medium flex items-center gap-2">
                  <Eye className="size-4" />
                  {t("preview") || "Preview"}
                </span>
              </div>
            </div>
          )}

          <FormRow>
            <FileInput
              formik={formik}
              name="coverImageLight"
              label={t("coverImageLight")}
              placeholder={t("coverImagePlaceholder")}
              required
              error={
                formik.touched.coverImageLight &&
                formik.errors.coverImageLight &&
                t(formik.errors.coverImageLight)
              }
            />
            <FileInput
              formik={formik}
              name="coverImageDark"
              label={t("coverImageDark")}
              placeholder={t("coverImageDarkPlaceholder")}
            />
          </FormRow>
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
          {/* Author Preview Card */}
          {(formik.values.authorName || formik.values.authorPicture) && (
            <div className="mb-6 p-4 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center gap-4">
              {formik.values.authorPicture ? (
                <img
                  src={formik.values.authorPicture}
                  alt={formik.values.authorName}
                  className="size-14 rounded-full object-cover ring-2 ring-white dark:ring-gray-800"
                />
              ) : (
                <div className="size-14 rounded-full bg-gray-200 dark:bg-white/10 flex items-center justify-center">
                  <User className="size-6 text-gray-400" />
                </div>
              )}
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">{t("author") || "Author"}</p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {formik.values.authorName || t("authorNamePlaceholder")}
                </p>
              </div>
            </div>
          )}

          <FormRow>
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
            <FileInput
              formik={formik}
              name="authorPicture"
              label={t("authorPicture")}
              placeholder={t("authorPicturePlaceholder")}
              required
              error={
                formik.touched.authorPicture &&
                formik.errors.authorPicture &&
                t(formik.errors.authorPicture)
              }
            />
          </FormRow>
        </FormSection>

        {/* Featured Toggle Card */}
        <div className="bg-gradient-to-r from-amber-500/10 via-yellow-500/10 to-orange-500/10 dark:from-amber-500/5 dark:via-yellow-500/5 dark:to-orange-500/5 rounded-2xl border border-amber-500/20 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <Sparkles className="size-6 text-amber-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  {t("featuredNews") || "Featured News"}
                  <Star className="size-4 text-amber-500" />
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t("featuredDescription") || "Featured news appears prominently on the homepage"}
                </p>
              </div>
            </div>
            <Switch
              checked={formik.values.isFeatured}
              onCheckedChange={(checked) => formik.setFieldValue("isFeatured", checked)}
              className="data-[state=checked]:bg-amber-500"
            />
          </div>
        </div>

        {/* Optional Sections - Collapsible */}
        <div className="space-y-4">
          <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider px-1">
            {t("optionalSections") || "Optional Sections"}
          </h2>

          {/* External Link */}
          <CollapsibleSection
            id="externalLink"
            title={t("externalLink")}
            icon={<Link className="size-5" />}
            hasContent={!!formik.values.urlExternal}
          >
            <FormRow>
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
            </FormRow>
          </CollapsibleSection>

          {/* Related Entities */}
          <CollapsibleSection
            id="relatedEntities"
            title={t("relatedEntities")}
            icon={<Gamepad2 className="size-5" />}
            hasContent={!!(formik.values.game || formik.values.tournament || formik.values.team || formik.values.player || formik.values.match)}
          >
            <FormRow>
              <SelectInput
                name="game"
                formik={formik}
                label={t("game")}
                options={mappedArrayToSelectOptions(gamesOptions, "name", "id")}
                placeholder={t("selectGame")}
                onChange={(value) => formik.setFieldValue("game", value)}
                icon={<Gamepad2 className="size-5 text-gray-400" />}
              />
              <SelectInput
                name="tournament"
                formik={formik}
                label={t("tournament")}
                options={mappedArrayToSelectOptions(
                  tournamentsOptions,
                  "name",
                  "id"
                )}
                placeholder={t("selectTournament")}
                onChange={(value) => formik.setFieldValue("tournament", value)}
                icon={<Trophy className="size-5 text-gray-400" />}
              />
            </FormRow>

            <FormRow>
              <SelectInput
                name="team"
                formik={formik}
                label={t("team")}
                options={mappedArrayToSelectOptions(teamsOptions, "name", "id")}
                placeholder={t("selectTeam")}
                onChange={(value) => formik.setFieldValue("team", value)}
                icon={<Users className="size-5 text-gray-400" />}
              />
              <SelectInput
                name="player"
                formik={formik}
                label={t("player")}
                options={mappedArrayToSelectOptions(
                  playersOptions,
                  "nickname",
                  "id"
                )}
                placeholder={t("selectPlayer")}
                onChange={(value) => formik.setFieldValue("player", value)}
                icon={<User className="size-5 text-gray-400" />}
              />
            </FormRow>

            <FormRow cols={1}>
              <SelectInput
                name="match"
                formik={formik}
                label={t("match")}
                options={mappedArrayToSelectOptions(
                  matchesOptions.map((m) => ({
                    name: `${m.team1?.name || "TBD"} vs ${
                      m.team2?.name || "TBD"
                    }`,
                    id: m.id,
                  })),
                  "name",
                  "id"
                )}
                placeholder={t("selectMatch")}
                onChange={(value) => formik.setFieldValue("match", value)}
                icon={<Swords className="size-5 text-gray-400" />}
              />
            </FormRow>
          </CollapsibleSection>

          {/* Publishing */}
          <CollapsibleSection
            id="publishing"
            title={t("publishing")}
            icon={<Calendar className="size-5" />}
            hasContent={!!formik.values.publishedAt}
          >
            <FormRow>
              <DatePicker
                formik={formik}
                name="publishedAt"
                label={t("publishDate")}
                placeholder={t("publishDatePlaceholder")}
                icon={<Calendar className="size-5 text-gray-400" />}
              />
            </FormRow>
            <p className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-white/5 p-3 rounded-lg">
              💡 {t("publishDateHint")}
            </p>
          </CollapsibleSection>
        </div>

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
