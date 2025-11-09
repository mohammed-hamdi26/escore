"use client";
import { useFormik } from "formik";
import * as yup from "yup";
import Date from "../icons/Date";
import Description from "../icons/Description";
import Title from "../icons/Title";
import Writer from "../icons/Writer";
import ImageIcon from "../icons/ImageIcon";
import DatePicker from "../ui app/DatePicker";
import FormRow from "../ui app/FormRow";
import FormSection from "../ui app/FormSection";
import InputApp from "../ui app/InputApp";
import TextAreaInput from "../ui app/TextAreaInput";
import SelectInput from "../ui app/SelectInput";
import { Link, Newspaper, Play } from "lucide-react";
import User from "../icons/User";
import TeamsManagement from "../icons/TeamsManagement";
import { Button } from "../ui/button";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";

const validationSchema = yup.object({
  title: yup.string().required("Required"),
  content: yup.string().required("Required"),
  summary: yup.string(),
  image: yup.string(),
  imageDark: yup.string(),
  videoUrl: yup.string(),
  publishDate: yup.string().required("Required"),
  authorName: yup.string().required("Required"),
  authorPicture: yup.string(),
  authorProfile: yup.string(),
  externalUrl: yup.string(),
  status: yup.string(),
  newsType: yup.string(),
  // players: yup.string(),
  // transfers: yup.string(),
});

const initialValues = {
  title: "",
  content: "",
  summary: "",
  image: "",
  imageDark: "",
  videoUrl: "",
  publishDate: "",
  authorName: "",
  authorPicture: "",
  authorProfile: "",
  externalUrl: "",
  status: "",
  newsType: "",
  players: [],
  transfers: [],
  notify: true,
};

function NewsForm({ formType = "add", submit, newData }) {
  const t = useTranslations("NewsForm");

  const formik = useFormik({
    initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const dataValues = newData ? { id: newData.id, ...values } : values;

      try {
        await submit(dataValues);
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
    { value: "DRAFT", label: "Draft" },
    { value: "PUBLISHED", label: "Published" },
    { value: "ARCHIVED", label: "Archived" },
  ];

  const newsTypeOptions = [
    { value: "GENERAL", label: "General News" },
    { value: "REGULAR", label: "Regular News" },
    { value: "FEATURE", label: "Feature" },
    { value: "ANALYSIS", label: "Analysis" },
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
          <InputApp
            name={"image"}
            onChange={formik.handleChange}
            label={t("Image")}
            type={"text"}
            placeholder={t("Enter Image URL")}
            value={formik.values.image}
            className="border-0 focus:outline-none"
            backGroundColor={"bg-dashboard-box  dark:bg-[#0F1017]"}
            textColor="text-[#677185]"
            icon={<ImageIcon />}
            error={formik.touched.image && formik.errors.image}
            onBlur={formik.handleBlur}
          />
          <InputApp
            name={"imageDark"}
            onChange={formik.handleChange}
            label={t("Image Dark")}
            type={"text"}
            placeholder={t("Enter Dark Mode Image URL")}
            value={formik.values.imageDark}
            className="border-0 focus:outline-none"
            backGroundColor={"bg-dashboard-box  dark:bg-[#0F1017]"}
            textColor="text-[#677185]"
            icon={<ImageIcon />}
            error={formik.touched.imageDark && formik.errors.imageDark}
            onBlur={formik.handleBlur}
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

      {/* Publishing */}
      <FormSection>
        <FormRow>
          <DatePicker
            formik={formik}
            name={t("publishDate")}
            label={t("Publish Date")}
            placeholder={t("Select Publish Date")}
            icon={
              <Date className={"fill-[#677185]"} color={"text-[#677185]"} />
            }
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
          <InputApp
            name={"authorPicture"}
            onChange={formik.handleChange}
            label={t("Author Picture")}
            type={"text"}
            placeholder={t("Enter Author Picture URL")}
            value={formik.values.authorPicture}
            className="border-0 focus:outline-none"
            backGroundColor={"bg-dashboard-box  dark:bg-[#0F1017]"}
            textColor="text-[#677185]"
            icon={<ImageIcon />}
            error={formik.touched.authorPicture && formik.errors.authorPicture}
            onBlur={formik.handleBlur}
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

      {/* Related Content */}
      {/* <FormSection>
        <FormRow>
          <TextAreaInput
            name="players"
            onChange={formik.handleChange}
            value={formik.values.players}
            label={"Players"}
            placeholder={"Enter Players (comma separated)"}
            className="border-0 focus:outline-none"
            icon={
              <TeamsManagement
                width={31}
                height={31}
                className={"fill-[#677185]"}
                color={"text-[#677185]"}
              />
            }
            error={formik.touched.players && formik.errors.players}
            onBlur={formik.handleBlur}
          />
          <TextAreaInput
            name="transfers"
            onChange={formik.handleChange}
            value={formik.values.transfers}
            label={"Transfers"}
            placeholder={"Enter Transfers (comma separated)"}
            className="border-0 focus:outline-none"
            icon={
              <Description
                className={"fill-[#677185]"}
                color={"text-[#677185]"}
              />
            }
            error={formik.touched.transfers && formik.errors.transfers}
            onBlur={formik.handleBlur}
          />
        </FormRow>
      </FormSection> */}

      <div className="flex justify-end">
        <Button
          disabled={formik.isSubmitting}
          type="submit"
          className={
            "text-white text-center min-w-[100px] px-5 py-2 rounded-lg bg-green-primary cursor-pointer hover:bg-green-primary/80"
          }
        >
          {formik.isSubmitting
            ? t("Submitting...")
            : formType === "add"
            ? t("Submit")
            : t("Edit")}
        </Button>
      </div>
    </form>
  );
}

export default NewsForm;
