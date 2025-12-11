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
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import * as yup from "yup";
import FileInput from "../ui app/FileInput";
import FormRow from "../ui app/FormRow";
import FormSection from "../ui app/FormSection";
import InputApp from "../ui app/InputApp";
import MarkDown from "../ui app/MarkDown";
import SelectInput from "../ui app/SelectInput";
import DatePicker from "../ui app/DatePicker";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { Label } from "../ui/label";
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

  // Count validation errors
  const errorCount = Object.keys(formik.errors).length;
  const touchedErrorCount = Object.keys(formik.errors).filter(
    (key) => formik.touched[key]
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}

      {/* Required Fields Notice */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 flex items-center gap-2">
        <AlertCircle className="size-4 text-blue-400" />
        <span className="text-sm text-blue-400">
          {t("requiredFieldsNotice")}
        </span>
      </div>

      <form className="space-y-6" onSubmit={formik.handleSubmit}>
        {/* Section 1: Basic Information (Required) */}
        <FormSection
          title={t("basicInfo")}
          icon={<FileText className="size-5" />}
          badge={
            <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded">
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
              backGroundColor="bg-dashboard-box dark:bg-[#0F1017]"
              textColor="text-[#677185]"
              error={
                formik.touched.title &&
                formik.errors.title &&
                t(formik.errors.title)
              }
              required
            />
          </FormRow>

          <FormRow>
            <MarkDown
              name="content"
              formik={formik}
              label={t("content")}
              placeholder={t("contentPlaceholder")}
              error={
                formik.touched.content &&
                formik.errors.content &&
                t(formik.errors.content)
              }
            />
          </FormRow>
        </FormSection>

        {/* Section 2: Cover Image (Required) */}
        <FormSection
          title={t("coverImage")}
          icon={<ImageIcon className="size-5" />}
          badge={
            <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded">
              {t("required")}
            </span>
          }
        >
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
            <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded">
              {t("required")}
            </span>
          }
        >
          <FormRow>
            <InputApp
              name="authorName"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.authorName}
              label={t("authorName")}
              placeholder={t("authorNamePlaceholder")}
              className="border-0 focus:outline-none"
              backGroundColor="bg-dashboard-box dark:bg-[#0F1017]"
              textColor="text-[#677185]"
              icon={<User className="size-5 text-[#677185]" />}
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

        {/* Section 4: External URL (Optional) */}
        <FormSection
          title={t("externalLink")}
          icon={<Link className="size-5" />}
          badge={
            <span className="text-xs bg-gray-500/20 text-gray-400 px-2 py-0.5 rounded">
              {t("optional")}
            </span>
          }
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
              backGroundColor="bg-dashboard-box dark:bg-[#0F1017]"
              textColor="text-[#677185]"
              icon={<Link className="size-5 text-[#677185]" />}
              error={
                formik.touched.urlExternal &&
                formik.errors.urlExternal &&
                t(formik.errors.urlExternal)
              }
            />
          </FormRow>
        </FormSection>

        {/* Section 5: Related Entities (Optional) */}
        <FormSection
          title={t("relatedEntities")}
          icon={<Gamepad2 className="size-5" />}
          badge={
            <span className="text-xs bg-gray-500/20 text-gray-400 px-2 py-0.5 rounded">
              {t("optional")}
            </span>
          }
        >
          <FormRow>
            <SelectInput
              name="game"
              formik={formik}
              label={t("game")}
              options={mappedArrayToSelectOptions(gamesOptions, "name", "id")}
              placeholder={t("selectGame")}
              onChange={(value) => formik.setFieldValue("game", value)}
              icon={<Gamepad2 className="size-5 text-[#677185]" />}
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
              icon={<Trophy className="size-5 text-[#677185]" />}
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
              icon={<Users className="size-5 text-[#677185]" />}
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
              icon={<User className="size-5 text-[#677185]" />}
            />
          </FormRow>

          <FormRow>
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
              icon={<Swords className="size-5 text-[#677185]" />}
            />
          </FormRow>
        </FormSection>

        {/* Section 6: Publishing (Optional) */}
        <FormSection
          title={t("publishing")}
          icon={<Calendar className="size-5" />}
          badge={
            <span className="text-xs bg-gray-500/20 text-gray-400 px-2 py-0.5 rounded">
              {t("optional")}
            </span>
          }
        >
          <FormRow>
            <DatePicker
              formik={formik}
              name="publishedAt"
              label={t("publishDate")}
              placeholder={t("publishDatePlaceholder")}
              icon={<Calendar className="size-5 text-[#677185]" />}
            />
          </FormRow>
          <p className="text-xs text-[#677185] mt-2">{t("publishDateHint")}</p>
        </FormSection>

        {/* Submit Button */}
        <div className="flex justify-between items-center gap-4 pt-4 sticky bottom-0 bg-linear-to-t from-white to-transparent dark:from-[#0a0c10] dark:via-[#0a0c10] dark:to-transparent py-6">
          <div className="text-sm text-[#677185]">
            <span className="text-red-500">*</span> {t("requiredFields")}
          </div>
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="border-[#677185] text-[#677185] hover:text-white hover:border-white"
            >
              <ArrowLeft className="size-4 mr-2" />
              {t("cancel")}
            </Button>
            <Button
              type="submit"
              disabled={formik.isSubmitting || !formik.isValid}
              className="bg-green-primary hover:bg-green-primary/80 text-white min-w-[140px] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {formik.isSubmitting ? (
                <Spinner />
              ) : formType === "add" ? (
                <>
                  <Plus className="size-4 mr-2" />
                  {t("submit")}
                </>
              ) : (
                <>
                  <Save className="size-4 mr-2" />
                  {t("save")}
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default NewsFormRedesign;
