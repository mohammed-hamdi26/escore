"use client";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { Loader2 } from "lucide-react";
import {
  addAppSocialLink,
  updateAppSocialLink,
} from "@/app/[locale]/_Lib/actions";
import toast from "react-hot-toast";
import FileInput from "../ui app/FileInput";

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  url: Yup.string().url("Invalid URL").required("URL is required"),
  darkImage: Yup.string(),
  lightImage: Yup.string().required("Light image URL is required"),
});

function LinkForm({ t, setOpen, link, onSuccess }) {
  const formik = useFormik({
    initialValues: {
      name: link?.name || "",
      url: link?.url || "",
      darkImage: link?.image?.dark || "",
      lightImage: link?.image?.light || "",
    },
    validationSchema,
    onSubmit: async (values) => {
      const linkData = {
        name: values.name,
        url: values.url,
        image: {
          light: values.lightImage,
          dark: values.darkImage || values.lightImage,
        },
      };

      try {
        if (link) {
          // Update existing link
          await updateAppSocialLink({ id: link.id, ...linkData });
          if (onSuccess) {
            onSuccess({ ...linkData, id: link.id });
          }
          toast.success(t("Link updated successfully"));
        } else {
          // Add new link
          const response = await addAppSocialLink(linkData);
          if (onSuccess && response?.data) {
            onSuccess(response.data);
          }
          toast.success(t("Link added successfully"));
        }
        setOpen(false);
      } catch (error) {
        toast.error(error.message || t("An error occurred"));
      }
    },
  });

  return (
    <form className="space-y-6" onSubmit={formik.handleSubmit}>
      {/* Name Input */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {t("Name")} *
        </label>
        <input
          type="text"
          name="name"
          placeholder={t("Link Name")}
          className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-primary transition-colors"
          {...formik.getFieldProps("name")}
        />
        {formik.touched.name && formik.errors.name && (
          <p className="text-red-400 text-sm mt-1">{t(formik.errors.name)}</p>
        )}
      </div>

      {/* URL Input */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {t("URL")} *
        </label>
        <input
          type="text"
          name="url"
          placeholder="https://example.com"
          className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-primary transition-colors"
          {...formik.getFieldProps("url")}
        />
        {formik.touched.url && formik.errors.url && (
          <p className="text-red-400 text-sm mt-1">{t(formik.errors.url)}</p>
        )}
      </div>

      {/* Light Image */}
      <FileInput
        label={t("Light Image URL")}
        name="lightImage"
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

      {/* Dark Image */}
      <FileInput
        label={t("Dark Image URL")}
        name="darkImage"
        formik={formik}
        disabled={formik.isSubmitting}
        placeholder={t("Dark Image URL")}
        error={formik.touched.darkImage && formik.errors.darkImage}
        {...formik.getFieldProps("darkImage")}
      />

      {/* Submit Button */}
      <div className="flex justify-end pt-2">
        <Button
          disabled={formik.isSubmitting || !formik.isValid}
          type="submit"
          className="bg-green-primary hover:bg-green-primary/80 text-white px-8 py-3 rounded-xl font-medium flex items-center gap-2"
        >
          {formik.isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {link ? t("Updating") : t("Adding")}
            </>
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
