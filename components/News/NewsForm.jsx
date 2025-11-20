"use client";
import { useFormik } from "formik";
import { Link, Newspaper, Play } from "lucide-react";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import * as yup from "yup";
import Date from "../icons/Date";
import Description from "../icons/Description";
import ImageIcon from "../icons/ImageIcon";
import Title from "../icons/Title";
import User from "../icons/User";
import Writer from "../icons/Writer";
import DatePicker from "../ui app/DatePicker";
import FileInput from "../ui app/FileInput";
import FormRow from "../ui app/FormRow";
import FormSection from "../ui app/FormSection";
import InputApp from "../ui app/InputApp";
import SelectInput from "../ui app/SelectInput";
import TextAreaInput from "../ui app/TextAreaInput";
import { Button } from "../ui/button";
import { tr } from "date-fns/locale";
import { format } from "date-fns";
import ComboboxInput from "../ui app/ComboBoxInput";
import { mappedArrayToSelectOptions } from "@/app/[locale]/_Lib/helps";

const validationSchema = yup.object({
  title: yup.string().required("Required"),
  content: yup.string().required("Required"),
  summary: yup.string(),
  image: yup.string(),
  imageDark: yup.string(),
  videoUrl: yup.string(),
  // publishDate: yup.string().required("Required"),
  authorName: yup.string().required("Required"),
  authorPicture: yup.string(),
  authorProfile: yup.string(),
  externalUrl: yup.string(),
  status: yup.string(),
  newsType: yup.string(),
  // players: yup.string(),
  // transfers: yup.string(),
});

function NewsForm({
  formType = "add",
  submit,
  newData,
  options: { playersOptions, teamsOptions, tournamentsOptions, gamesOptions },
}) {
  const t = useTranslations("NewsForm");

  const formik = useFormik({
    initialValues: {
      title: newData?.title || "",
      content: newData?.content || "",
      summary: newData?.summary || "",
      image: newData?.image || "",
      imageDark: newData?.imageDark || "",
      videoUrl: newData?.videoUrl || "",
      publishDate: newData?.publishDate,
      authorName: newData?.authorName || "",
      authorPicture: newData?.authorPicture || "",
      authorProfile: newData?.authorProfile || "",
      externalUrl: newData?.externalUrl || "",
      status: newData?.status || "",
      newsType: newData?.newsType || "",
      players: newData?.players || [],
      transfers: newData?.transfers || [],
      matches: newData?.matches || [],
      tournaments: newData?.tournaments || [],
      teams: newData?.teams || [],
      games: newData?.games || [],
      notify: true,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        let dataValues = newData ? { id: newData?.id, ...values } : values;

        await submit(dataValues);
        formType === "add" && formik.resetForm();
        toast.success(
          formType === "add"
            ? "News added successfully"
            : "News updated successfully"
        );
      } catch (error) {
        toast.error(error.message || "An error occurred");
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
    { value: "TRANSFER", label: "Transfer News" },
    { value: "MATCH_RECAP", label: "Match Recap" },
    { value: "TRENDING", label: "Trending" },
  ];
  console.log(formik.errors);
  console.log(formik.values);
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
            error={formik.touched.title && formik.errors.title}
            onBlur={formik.handleBlur}
          />
        </FormRow>

        <FormRow>
          <TextAreaInput
            name="content"
            onChange={formik.handleChange}
            value={formik.values.content}
            label={t("Content")}
            placeholder={t("Enter Content")}
            className="border-0 focus:outline-none"
            icon={
              <Description
                className={"fill-[#677185]"}
                color={"text-[#677185]"}
              />
            }
            error={formik.touched.content && formik.errors.content}
            onBlur={formik.handleBlur}
          />
          <TextAreaInput
            name="summary"
            onChange={formik.handleChange}
            value={formik.values.summary}
            label={t("Summary")}
            placeholder={t("Enter Summary")}
            className="border-0 focus:outline-none"
            icon={
              <Description
                className={"fill-[#677185]"}
                color={"text-[#677185]"}
              />
            }
            error={formik.touched.summary && formik.errors.summary}
            onBlur={formik.handleBlur}
          />
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
          />
          <FileInput
            formik={formik}
            name={"imageDark"}
            label={t("Image Dark")}
            placeholder={t("Enter Dark Mode Image URL")}
            icon={<ImageIcon />}
          />
        </FormRow>
        <FormRow>
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
        </FormRow>
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
            error={formik.touched.authorName && formik.errors.authorName}
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
            error={formik.touched.authorProfile && formik.errors.authorProfile}
            onBlur={formik.handleBlur}
          />
        </FormRow>
      </FormSection>

      {/* External Link */}
      <FormSection>
        <FormRow>
          <InputApp
            name={"externalUrl"}
            onChange={formik.handleChange}
            label={t("External URL")}
            type={"text"}
            placeholder={t("Enter External URL")}
            value={formik.values.externalUrl}
            className="border-0 focus:outline-none"
            backGroundColor={"bg-dashboard-box  dark:bg-[#0F1017]"}
            textColor="text-[#677185]"
            icon={<Link width={31} height={31} className={"text-[#677185]"} />}
            error={formik.touched.externalUrl && formik.errors.externalUrl}
            onBlur={formik.handleBlur}
          />
        </FormRow>
      </FormSection>

      {/* Classification */}
      <FormSection>
        <FormRow>
          <SelectInput
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
        </FormRow>
      </FormSection>
      {formik.values.status === "SCHEDULED" && (
        <FormSection>
          <FormRow>
            <DatePicker
              formik={formik}
              name={"publishDate"}
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
          <ComboboxInput
            name={"players"}
            formik={formik}
            label={t("Players")}
            options={mappedArrayToSelectOptions(
              playersOptions,
              "firstName",
              "id"
            )}
            placeholder={t("Select Players")}
            initialData={mappedArrayToSelectOptions(
              formik.values.players,
              "firstName",
              "id"
            )}
          />
          <ComboboxInput
            name={"teams"}
            formik={formik}
            label={t("Teams")}
            options={mappedArrayToSelectOptions(teamsOptions, "name", "id")}
            placeholder={t("Select Teams")}
            initialData={mappedArrayToSelectOptions(
              formik.values.teams,
              "name",
              "id"
            )}
          />
        </FormRow>
        <FormRow>
          <ComboboxInput
            name={"games"}
            formik={formik}
            label={t("Games")}
            options={mappedArrayToSelectOptions(gamesOptions, "name", "id")}
            placeholder={t("Select Games")}
            initialData={mappedArrayToSelectOptions(
              formik.values.games,
              "name",
              "id"
            )}
          />
          <ComboboxInput
            name={"tournaments"}
            formik={formik}
            label={t("Tournaments")}
            options={mappedArrayToSelectOptions(
              tournamentsOptions,
              "name",
              "id"
            )}
            placeholder={t("Select Tournaments")}
            initialData={mappedArrayToSelectOptions(
              formik.values.tournaments,
              "name",
              "id"
            )}
          />
        </FormRow>
      </FormSection>

      <div className="flex justify-end">
        <Button
          disabled={formik.isSubmitting || !formik.isValid}
          type="submit"
          className={
            "text-white text-center min-w-[100px] px-5 py-2 rounded-lg bg-green-primary cursor-pointer hover:bg-green-primary/80"
          }
        >
          {formik.isSubmitting
            ? t("Submitting__")
            : formType === "add"
            ? t("Submit")
            : t("Edit")}
        </Button>
      </div>
    </form>
  );
}

export default NewsForm;
