"use client";
import { useFormik } from "formik";
import * as Yup from "yup";
import InputApp from "../ui app/InputApp";
import FileInput from "../ui app/FileInput";
import FormRow from "../ui app/FormRow";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import {
  addAppSocialLink,
  updateAppSocialLink,
} from "@/app/[locale]/_Lib/actions";
import toast from "react-hot-toast";
const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  url: Yup.string().url("Invalid URL").required("URL is required"),
  darkImage: Yup.string(),
  lightImage: Yup.string().required("Light image URL is required"),
});

function LinkForm({ t, setOpen, link }) {
  const formik = useFormik({
    initialValues: {
      name: link?.name || "",
      url: link?.url || "",
      darkImage: link?.image.dark || "",
      lightImage: link?.image.light || "",
    },
    validationSchema,
    onSubmit: async (values) => {
      const linkData = link ? { id: link.id, ...values } : values;

      linkData.image = {
        light: linkData.lightImage,
        dark: linkData.darkImage,
      };
      try {
        link
          ? await updateAppSocialLink(linkData)
          : await addAppSocialLink(linkData);
        toast.success(
          link ? t("Link updated successfully") : t("Link added successfully")
        );
        setOpen(false);
      } catch (error) {
        toast.error(error.message);
      }
    },
  });

  return (
    <form className="space-y-6" onSubmit={formik.handleSubmit}>
      <InputApp
        label={t("Name")}
        name="name"
        type="text"
        error={
          formik.touched.name && formik.errors.name && t(formik.errors.name)
        }
        className={`p-0 border-0 focus:outline-none `}
        backGroundColor={"bg-dashboard-box  dark:bg-[#0F1017]"}
        textColor={"text-[#677185]"}
        placeholder={t("Link Name")}
        {...formik.getFieldProps("name")}
      />
      <InputApp
        label={t("URL")}
        placeholder={"https://example.com"}
        name="url"
        type="text"
        className={`p-0 border-0 focus:outline-none `}
        backGroundColor={"bg-dashboard-box  dark:bg-[#0F1017]"}
        textColor={"text-[#677185]"}
        error={formik.touched.url && formik.errors.url && t(formik.errors.url)}
        {...formik.getFieldProps("url")}
      />
      <FileInput
        label={t("Light Image URL")}
        name="LightImage"
        formik={formik}
        disabled={formik.isSubmitting}
        placeholder={t("Light Image URL")}
        error={
          formik.touched.lightImage &&
          formik.errors.lightImage &&
          t(formik.errors.lightImage)
        }
        {...formik.getFieldProps("lightImage")}
      />
      <FileInput
        label={t("Dark Image URL")}
        name="darkImage"
        formik={formik}
        disabled={formik.isSubmitting}
        placeholder={t("Dark Image URL")}
        error={formik.touched.darkImage && formik.errors.darkImage}
        {...formik.getFieldProps("darkImage")}
      />
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
          ) : link ? (
            t("Update Link")
          ) : (
            t("Add Link")
          )}
        </Button>
      </div>
    </form>
  );
}

export default LinkForm;
