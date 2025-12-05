"use client";
import { mappedArrayToSelectOptions } from "@/app/[locale]/_Lib/helps";
import { useFormik } from "formik";
import { Link, Newspaper } from "lucide-react";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import * as yup from "yup";
import Date from "../icons/Date";
import Description from "../icons/Description";
import ImageIcon from "../icons/ImageIcon";
import Title from "../icons/Title";
import User from "../icons/User";
import Writer from "../icons/Writer";
import ComboboxInput from "../ui app/ComboBoxInput";
import DatePicker from "../ui app/DatePicker";
import FileInput from "../ui app/FileInput";
import FormRow from "../ui app/FormRow";
import FormSection from "../ui app/FormSection";
import InputApp from "../ui app/InputApp";
import MarkDown from "../ui app/MarkDown";
import SelectInput from "../ui app/SelectInput";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";

const validationSchema = yup.object({
  title: yup.string().required("titleRequired"),
  content: yup.string().required("contentRequired"),
  summary: yup.string(),
  image: yup.string().required("imageRequired"),
  imageDark: yup.string(),
  // videoUrl: yup.string(),
  publishAt: yup.string().when("status", {
    is: "SCHEDULED",
    then: yup.string().required("publishAtRequired"),
  }),
  authorName: yup.string().required("authorNameRequired"),
  authorPicture: yup.string(),
  authorProfile: yup.string(),
  urlExternal: yup.string(),
  status: yup.string().oneOf(["SCHEDULED", "PUBLISHED"], "statusInvalid"),
  newsType: yup
    .string()
    .oneOf(["GENERAL", "MATCH_RECAP", "TRENDING"], "newsTypeInvalid"),
  // player: yup.string(),
  // transfers: yup.string(),
});

function NewsForm({
  formType = "add",
  submit,
  newData,
  options: {
    playersOptions,
    teamsOptions,
    tournamentsOptions,
    gamesOptions,
    matchesOptions,
  },
}) {
  const t = useTranslations("NewsForm");

  const formik = useFormik({
    initialValues: {
      title: newData?.title || "",
      content: newData?.content || "",
      summary: newData?.summary || "",
      image: newData?.coverImage?.light || "",
      imageDark: newData?.coverImage?.dark || "",
      videoUrl: newData?.videoUrl || "",
      // publishAt: newData?.publishAt || "",
      authorName: newData?.authorName || "",
      authorPicture: newData?.authorImage?.light || "",
      authorProfile: newData?.authorProfile || "",
      urlExternal: newData?.urlExternal || "",
      // status: newData?.status || "PUBLISHED",
      category: newData?.category || "news",
      newsType: newData?.newsType || "",
      player: newData?.player?.id || "",
      match: newData?.match?.id || "",
      team: newData?.team?.id || "",
      game: newData?.game?.id || "",
      tournament: newData?.tournament?.id || "",
      isFeatured: newData?.isFeatured
        ? newData?.isFeatured
          ? "Trending"
          : "General"
        : "Trending",
      // transfers: newData?.transfers || "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        let dataValues = newData ? { id: newData?.id, ...values } : values;

        dataValues = {
          ...dataValues,
          slug: dataValues.title.replace(/\s+/g, "-").toLowerCase(),
          coverImage: {
            light: dataValues.image,
            dark: dataValues.imageDark,
          },
          authorImage: {
            light: dataValues.authorPicture,
            dark: dataValues.authorPicture,
          },
          isFeatured: dataValues.isFeatured === "Trending" ? true : false,
          player: dataValues.player ? dataValues.player : null,
          match: dataValues.match ? dataValues.match : null,
          team: dataValues.team ? dataValues.team : null,
          game: dataValues.game ? dataValues.game : null,
          tournament: dataValues.tournament ? dataValues.tournament : null,
          // transfers: dataValues.transfers ? dataValues.transfers : null,
        };
        console.log(dataValues);
        await submit(dataValues);
        formType === "add" && formik.resetForm();
        toast.success(
          formType === "add"
            ? "News added successfully"
            : "News updated successfully"
        );
      } catch (error) {
        if (!error.toString().includes("Error: NEXT_REDIRECT")) {
          toast.error(error.message || "An error occurred");
        } else {
          toast.success(
            formType === "add"
              ? "News added successfully"
              : "News updated successfully"
          );
        }
      }
    },
  });
  const statusOptions = [
    // { value: "DRAFT", label: "Draft" },
    { value: "PUBLISHED", label: "Published" },
    { value: "SCHEDULED", label: "Scheduled" },
  ];

  const newsTypeOptions = [
    { value: "GENERAL", label: "General News" },
    // { value: "TRANSFER", label: "Transfer News" },
    { value: "MATCH_RECAP", label: "Match Recap" },
    { value: "TRENDING", label: "Trending" },
  ];

  const featuredOptions = [
    { value: "Trending", label: "Trending" },
    { value: "General", label: "General" },
  ];

  return (
    <form className="space-y-8 " onSubmit={formik.handleSubmit}>
      <FormSection>
        <FormRow>
          <InputApp
            name={"title"}
            onChange={formik.handleChange}
            label={t("Title")}
            type={"text"}
            placeholder={t("Enter Title")}
            value={formik.values.title}
            className="border-0 focus:outline-none"
            backGroundColor={"bg-dashboard-box  dark:bg-[#0F1017]"}
            textColor="text-[#677185]"
            icon={<Title height="31" width="31" color={"text-[#677185]"} />}
            error={
              (formik.touched.title &&
                formik.errors.title &&
                t(formik.errors.title)) ||
              ""
            }
            onBlur={formik.handleBlur}
          />
        </FormRow>

        <FormRow>
          <MarkDown
            error={
              formik?.touched?.content &&
              formik?.errors?.content &&
              t(formik?.errors?.content)
            }
            name="content"
            formik={formik}
            label={t("Content")}
            placeholder={t("Enter Content")}
            className="border-0 focus:outline-none"
            icon={
              <Description
                className={"fill-[#677185]"}
                color={"text-[#677185]"}
              />
            }
          />
          {/* <MarkDown
            name="summary"
            formik={formik}
            label={t("Summary")}
            placeholder={t("Enter Summary")}
            icon={
              <Description
                className={"fill-[#677185]"}
                color={"text-[#677185]"}
              />
            }
            error={formik.touched.summary && formik.errors.summary}
            onBlur={formik.handleBlur}
          /> */}
        </FormRow>
      </FormSection>

      {/* Media */}
      <FormSection>
        <FormRow>
          <FileInput
            formik={formik}
            name={"image"}
            label={t("Image")}
            placeholder={t("Enter Image URL")}
            icon={<ImageIcon />}
            error={
              formik.touched.image &&
              formik.errors.image &&
              t(formik.errors.image)
            }
          />
          <FileInput
            formik={formik}
            name={"imageDark"}
            label={t("Image Dark")}
            placeholder={t("Enter Dark Mode Image URL")}
            icon={<ImageIcon />}
            error={formik.touched.imageDark && formik.errors.imageDark}
          />
        </FormRow>
        {/* <FormRow>
          <InputApp
            name={"videoUrl"}
            onChange={formik.handleChange}
            label={t("Video URL")}
            type={"text"}
            placeholder={t("Enter Video URL")}
            value={formik.values.videoUrl}
            className="border-0 focus:outline-none"
            backGroundColor={"bg-dashboard-box  dark:bg-[#0F1017]"}
            textColor="text-[#677185]"
            icon={<Play height={31} width={31} className={"text-[#677185]"} />}
            error={formik.touched.videoUrl && formik.errors.videoUrl}
            onBlur={formik.handleBlur}
          />
        </FormRow> */}
      </FormSection>

      {/* Author Information */}
      <FormSection>
        <FormRow>
          <InputApp
            name={"authorName"}
            onChange={formik.handleChange}
            label={t("Author Name")}
            type={"text"}
            placeholder={t("Enter Author Name")}
            value={formik.values.authorName}
            className="border-0 focus:outline-none"
            backGroundColor={"bg-dashboard-box  dark:bg-[#0F1017]"}
            textColor="text-[#677185]"
            icon={
              <User
                width="31"
                height="31"
                className="fill-[#677185]"
                color={"text-[#677185]"}
              />
            }
            error={
              formik.touched.authorName &&
              formik.errors.authorName &&
              t(formik.errors.authorName)
            }
            onBlur={formik.handleBlur}
          />
          <FileInput
            name={"authorPicture"}
            formik={formik}
            label={t("Author Picture")}
            placeholder={t("Enter Author Picture URL")}
            icon={<ImageIcon />}
          />
        </FormRow>
        <FormRow>
          <InputApp
            name={"authorProfile"}
            onChange={formik.handleChange}
            label={t("Author Profile")}
            type={"text"}
            placeholder={t("Enter Author Profile URL")}
            value={formik.values.authorProfile}
            className="border-0 focus:outline-none"
            backGroundColor={"bg-dashboard-box  dark:bg-[#0F1017]"}
            textColor="text-[#677185]"
            icon={<Writer color={"text-[#677185]"} />}
            error={
              formik.touched.authorProfile &&
              formik.errors.authorProfile &&
              t(formik.errors.authorProfile)
            }
            onBlur={formik.handleBlur}
          />
        </FormRow>
      </FormSection>

      {/* External Link */}
      <FormSection>
        <FormRow>
          <InputApp
            name={"urlExternal"}
            onChange={formik.handleChange}
            label={t("External URL")}
            type={"text"}
            placeholder={t("Enter External URL")}
            value={formik.values.urlExternal}
            className="border-0 focus:outline-none"
            backGroundColor={"bg-dashboard-box  dark:bg-[#0F1017]"}
            textColor="text-[#677185]"
            icon={<Link width={31} height={31} className={"text-[#677185]"} />}
            error={
              formik.touched.urlExternal &&
              formik.errors.urlExternal &&
              t(formik.errors.urlExternal)
            }
            onBlur={formik.handleBlur}
          />
        </FormRow>
      </FormSection>

      {/* Classification */}
      <FormSection>
        {/* <FormRow> */}
        {/* <SelectInput
            formik={formik}
            t={t}
            name={"status"}
            onChange={(value) => formik.setFieldValue("status", value)}
            value={formik.values.status}
            label={t("Status")}
            placeholder={t("Select Status")}
            options={statusOptions}
            error={formik.touched.status && formik.errors.status}
            onBlur={() => formik.setFieldTouched("status", true)}
          />
          <SelectInput
            formik={formik}
            t={t}
            name={"newsType"}
            onChange={(value) => formik.setFieldValue("newsType", value)}
            value={formik.values.newsType}
            label={t("News Type")}
            placeholder={t("Select News Type")}
            options={newsTypeOptions}
            error={formik.touched.newsType && formik.errors.newsType}
            onBlur={() => formik.setFieldTouched("newsType", true)}
            icon={
              <Newspaper width={31} height={31} className="text-[#677185]" />
            }
          />
        </FormRow> */}

        <SelectInput
          formik={formik}
          name={"isFeatured"}
          label={t("Featured")}
          options={mappedArrayToSelectOptions(
            featuredOptions,
            "label",
            "value"
          )}
          placeholder={t("is Featured")}
          onChange={(value) => formik.setFieldValue("tournaments", value)}
        />
      </FormSection>
      {formik.values.status === "SCHEDULED" && (
        <FormSection>
          <FormRow>
            <DatePicker
              disabled={formik.isSubmitting}
              disabledDate={{}}
              formik={formik}
              name={"publishAt"}
              label={t("Publish Date")}
              placeholder={t("Select Publish Date")}
              icon={
                <Date className={"fill-[#677185]"} color={"text-[#677185]"} />
              }
            />
          </FormRow>
        </FormSection>
      )}
      <FormSection>
        <FormRow>
          <SelectInput
            name={"player"}
            formik={formik}
            label={t("player")}
            options={mappedArrayToSelectOptions(
              playersOptions,
              "nickname",
              "id"
            )}
            placeholder={t("Select player")}
            onChange={(value) => formik.setFieldValue("player", value)}
          />
          <SelectInput
            name={"team"}
            formik={formik}
            label={t("Teams")}
            options={mappedArrayToSelectOptions(teamsOptions, "name", "id")}
            placeholder={t("Select Teams")}
            onChange={(value) => formik.setFieldValue("team", value)}
          />
        </FormRow>
        <FormRow>
          <SelectInput
            name={"game"}
            formik={formik}
            label={t("Games")}
            options={mappedArrayToSelectOptions(gamesOptions, "name", "id")}
            placeholder={t("Select Game")}
            onChange={(value) => formik.setFieldValue("game", value)}
          />
          <SelectInput
            name={"tournament"}
            formik={formik}
            label={t("Tournaments")}
            options={mappedArrayToSelectOptions(
              tournamentsOptions,
              "name",
              "id"
            )}
            placeholder={t("Select Tournaments")}
            onChange={(value) => formik.setFieldValue("tournament", value)}
          />
        </FormRow>
        <SelectInput
          name={"match"}
          formik={formik}
          label={t("Matches")}
          options={mappedArrayToSelectOptions(
            matchesOptions.map((m) => {
              return { name: `${m.team1.name} vs ${m.team2.name}`, id: m.id };
            }),
            "name",
            "id"
          )}
          placeholder={t("Select Match")}
          onChange={(value) => formik.setFieldValue("match", value)}
        />
      </FormSection>

      <div className="flex justify-end">
        <Button
          disabled={formik.isSubmitting || !formik.isValid}
          type="submit"
          className={
            "text-white text-center min-w-[100px] px-5 py-2 rounded-lg bg-green-primary cursor-pointer hover:bg-green-primary/80"
          }
        >
          {formik.isSubmitting ? (
            <Spinner />
          ) : formType === "add" ? (
            t("Submit")
          ) : (
            t("Edit")
          )}
        </Button>
      </div>
    </form>
  );
}

export default NewsForm;
