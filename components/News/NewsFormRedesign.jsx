"use client";
import { mappedArrayToSelectOptions } from "@/app/[locale]/_Lib/helps";
import { useFormik } from "formik";
import {
  Link,
  FileText,
  Image as ImageIcon,
  User,
  Calendar,
  Tag,
  Gamepad2,
  Trophy,
  Users,
  Swords,
  Star,
  Pin,
  ArrowLeft,
  Save,
  Plus,
  Eye,
  EyeOff,
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
import MarkDown from "../ui app/MarkDown";
import SelectInput from "../ui app/SelectInput";
import DatePicker from "../ui app/DatePicker";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";


const validationSchema = yup.object({
  title: yup
    .string()
    .required("titleRequired")
    .max(300, "titleTooLong"),
  content: yup.string().required("contentRequired"),
  excerpt: yup.string().max(500, "excerptTooLong"),
  coverImageLight: yup.string(),
  coverImageDark: yup.string(),
  authorName: yup.string().max(100, "authorNameTooLong"),
  authorPicture: yup.string(),
  urlExternal: yup.string().url("invalidUrl"),
  game: yup.string().nullable(),
  tournament: yup.string().nullable(),
  team: yup.string().nullable(),
  player: yup.string().nullable(),
  match: yup.string().nullable(),
  publishedAt: yup.date().nullable(),
  isFeatured: yup.boolean(),
  isPinned: yup.boolean(),
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
  const [previewMode, setPreviewMode] = useState(false);

  const formik = useFormik({
    initialValues: {
      title: newData?.title || "",
      excerpt: newData?.excerpt || "",
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
      isPinned: newData?.isPinned || false,
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const dataValues = {
          ...(newData ? { id: newData.id } : {}),
          title: values.title,
          excerpt: values.excerpt || undefined,
          content: values.content,
          coverImage: {
            light: values.coverImageLight || undefined,
            dark: values.coverImageDark || undefined,
          },
          authorName: values.authorName || undefined,
          authorImage: values.authorPicture
            ? { light: values.authorPicture, dark: values.authorPicture }
            : undefined,
          urlExternal: values.urlExternal || undefined,
          game: values.game || null,
          tournament: values.tournament || null,
          team: values.team || null,
          player: values.player || null,
          match: values.match || null,
          publishedAt: values.publishedAt || new Date().toISOString(),
          isFeatured: values.isFeatured,
          isPinned: values.isPinned,
        };

        await submit(dataValues);

        if (formType === "add") {
          formik.resetForm();
        }

        toast.success(
          formType === "add" ? t("addSuccess") : t("editSuccess")
        );
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between bg-dashboard-box dark:bg-[#0F1017] rounded-xl p-4">
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="text-[#677185] hover:text-white"
          >
            <ArrowLeft className="size-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-white">
              {formType === "add" ? t("addNews") : t("editNews")}
            </h1>
            {newData && (
              <p className="text-sm text-[#677185]">
                {t("editing")}: {newData.title?.substring(0, 50)}...
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Status indicators */}
          {formik.values.isFeatured && (
            <Badge className="bg-yellow-600 text-white">
              <Star className="size-3 mr-1 fill-white" />
              {t("featured")}
            </Badge>
          )}
          {formik.values.isPinned && (
            <Badge className="bg-purple-600 text-white">
              <Pin className="size-3 mr-1 fill-white" />
              {t("pinned")}
            </Badge>
          )}
        </div>
      </div>

      <form className="space-y-6" onSubmit={formik.handleSubmit}>
        {/* Section 1: Basic Information */}
        <FormSection title={t("basicInfo")} icon={<FileText className="size-5" />}>
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
            error={formik.touched.title && formik.errors.title && t(formik.errors.title)}
          />
        </FormRow>

        <FormRow>
          <div className="flex-1 space-y-2">
            <Label className="text-[#677185] dark:text-white">{t("excerpt")}</Label>
            <Textarea
              name="excerpt"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.excerpt}
              placeholder={t("excerptPlaceholder")}
              className="bg-dashboard-box dark:bg-[#0F1017] border-0 text-white placeholder:text-[#677185] min-h-[80px] resize-none"
              maxLength={500}
            />
            <div className="flex justify-between text-xs text-[#677185]">
              {formik.touched.excerpt && formik.errors.excerpt && (
                <span className="text-red-500">{t(formik.errors.excerpt)}</span>
              )}
              <span className="ml-auto">{formik.values.excerpt.length}/500</span>
            </div>
          </div>
        </FormRow>

        <FormRow>
          <MarkDown
            name="content"
            formik={formik}
            label={t("content")}
            placeholder={t("contentPlaceholder")}
            error={formik.touched.content && formik.errors.content && t(formik.errors.content)}
          />
        </FormRow>
      </FormSection>

      {/* Section 2: Media */}
      <FormSection title={t("media")} icon={<ImageIcon className="size-5" />}>
        <FormRow>
          <FileInput
            formik={formik}
            name="coverImageLight"
            label={t("coverImageLight")}
            placeholder={t("coverImagePlaceholder")}
          />
          <FileInput
            formik={formik}
            name="coverImageDark"
            label={t("coverImageDark")}
            placeholder={t("coverImageDarkPlaceholder")}
          />
        </FormRow>

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
            error={formik.touched.urlExternal && formik.errors.urlExternal && t(formik.errors.urlExternal)}
          />
        </FormRow>
      </FormSection>

        {/* Section 3: Classification */}
        <FormSection title={t("classification")} icon={<Tag className="size-5" />}>
          <FormRow>
            <div className="flex items-center gap-8 p-4 bg-dashboard-box dark:bg-[#1a1f2e] rounded-lg">
              <div className="flex items-center gap-3">
                <Switch
                  id="isFeatured"
                  checked={formik.values.isFeatured}
                  onCheckedChange={(checked) => formik.setFieldValue("isFeatured", checked)}
                />
                <Label htmlFor="isFeatured" className="flex items-center gap-2 cursor-pointer text-white">
                  <Star className={`size-4 ${formik.values.isFeatured ? "fill-yellow-500 text-yellow-500" : "text-[#677185]"}`} />
                  {t("featured")}
                </Label>
              </div>

              <div className="flex items-center gap-3">
                <Switch
                  id="isPinned"
                  checked={formik.values.isPinned}
                  onCheckedChange={(checked) => formik.setFieldValue("isPinned", checked)}
                />
                <Label htmlFor="isPinned" className="flex items-center gap-2 cursor-pointer text-white">
                  <Pin className={`size-4 ${formik.values.isPinned ? "fill-purple-500 text-purple-500" : "text-[#677185]"}`} />
                  {t("pinned")}
                </Label>
              </div>
            </div>
          </FormRow>
        </FormSection>

        {/* Section 4: Author */}
        <FormSection title={t("authorInfo")} icon={<User className="size-5" />}>
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
              error={formik.touched.authorName && formik.errors.authorName && t(formik.errors.authorName)}
            />
            <FileInput
              formik={formik}
              name="authorPicture"
              label={t("authorPicture")}
              placeholder={t("authorPicturePlaceholder")}
            />
          </FormRow>
        </FormSection>

        {/* Section 5: Related Entities */}
        <FormSection title={t("relatedEntities")} icon={<Gamepad2 className="size-5" />}>
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
              options={mappedArrayToSelectOptions(tournamentsOptions, "name", "id")}
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
              options={mappedArrayToSelectOptions(playersOptions, "nickname", "id")}
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
                  name: `${m.team1?.name || "TBD"} vs ${m.team2?.name || "TBD"}`,
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

        {/* Section 6: Publishing */}
        <FormSection title={t("publishing")} icon={<Calendar className="size-5" />}>
          <FormRow>
            <DatePicker
              formik={formik}
              name="publishedAt"
              label={t("publishDate")}
              placeholder={t("publishDatePlaceholder")}
              icon={<Calendar className="size-5 text-[#677185]" />}
            />
          </FormRow>
          <p className="text-xs text-[#677185] mt-2">
            {t("publishDateHint")}
          </p>
        </FormSection>

        {/* Submit Button */}
        <div className="flex justify-end gap-4 pt-4 sticky bottom-0 bg-gradient-to-t from-[#0a0c10] via-[#0a0c10] to-transparent py-6">
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
            className="bg-green-primary hover:bg-green-primary/80 text-white min-w-[140px]"
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
      </form>
    </div>
  );
}

export default NewsFormRedesign;
