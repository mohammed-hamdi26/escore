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


const validationSchema = yup.object({
  title: yup
    .string()
    .required("titleRequired")
    .max(300, "titleTooLong"),
  content: yup.string().required("contentRequired"),
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
    onSubmit: async (values) => {
      try {
        const dataValues = {
          ...(newData ? { id: newData.id } : {}),
          title: values.title,
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
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-white">
                {formType === "add" ? t("addNews") : t("editNews")}
              </h1>
              {/* Featured Switch in Header */}
              <div className="flex items-center gap-2 px-3 py-1 bg-[#1a1f2e] rounded-lg">
                <Switch
                  id="isFeaturedHeader"
                  checked={formik.values.isFeatured}
                  onCheckedChange={(checked) => formik.setFieldValue("isFeatured", checked)}
                />
                <Label htmlFor="isFeaturedHeader" className="flex items-center gap-1 cursor-pointer text-sm">
                  <Star className={`size-4 ${formik.values.isFeatured ? "fill-yellow-500 text-yellow-500" : "text-[#677185]"}`} />
                  <span className={formik.values.isFeatured ? "text-yellow-500" : "text-[#677185]"}>
                    {t("featured")}
                  </span>
                </Label>
              </div>
            </div>
            {newData && (
              <p className="text-sm text-[#677185] mt-1">
                {t("editing")}: {newData.title?.substring(0, 50)}...
              </p>
            )}
          </div>
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

        {/* Section 3: Author */}
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

        {/* Section 4: Related Entities */}
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

        {/* Section 5: Publishing */}
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
