"use client";
import { addLanguage, updateLanguage } from "@/app/[locale]/_Lib/languageAPI";
import InputApp from "@/components/ui app/InputApp";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/navigation";
import { useFormik } from "formik";
import { useEffect } from "react";
import toast from "react-hot-toast";
import * as yup from "yup";

const validationSchema = yup.object({
  code: yup.string().required("Code is required"),
  name: yup.string().required("Name is required"),
  name_local: yup.string().required("Local name is required"),
  word: yup.string().required("Word is required"),
  value: yup.string().required("Value is required"),
});

export default function LanguageForm({
  successMessage = "Language saved successfully",
  formType = "add",
  language = undefined,
  code = undefined,
  onSuccess,
}) {
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      code: language?.code || "",
      name: language?.name || "",
      name_local: language?.name_local || "",
      word: language?.dictionary
        ? Object.keys(language.dictionary)[0] || ""
        : "",
      value: language?.dictionary
        ? Object.values(language.dictionary)[0] || ""
        : "",
    },
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: async values => {
      // Log raw form values
      console.log("Form Values (Raw):", values);

      const dataValues = {
        code: values.code,
        name: values.name,
        name_local: values.name_local,
        dictionary: {
          [values.word]: values.value,
        },
      };

      console.log("Processed Data (for API):", dataValues);

      try {
        if (formType === "add") {
          await addLanguage(dataValues);
          formik.resetForm();
          toast.success(successMessage);
          if (onSuccess) {
            onSuccess();
          } else {
            router.push("/dashboard/settings/language");
          }
        } else if (formType === "update") {
          await updateLanguage(code, dataValues);
          toast.success(successMessage);
          if (onSuccess) {
            onSuccess();
          } else {
            router.push("/dashboard/settings/language");
          }
        }
      } catch (error) {
        toast.error(error.message || "An error occurred");
      }
    },
  });

  // Update form values when language prop changes
  useEffect(() => {
    if (language && formType === "update") {
      formik.setValues({
        code: language?.code || "",
        name: language?.name || "",
        name_local: language?.name_local || "",
        word: language?.dictionary
          ? Object.keys(language.dictionary)[0] || ""
          : "",
        value: language?.dictionary
          ? Object.values(language.dictionary)[0] || ""
          : "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, formType]);

  return (
    <form className="space-y-4" onSubmit={formik.handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputApp
          value={formik.values.code}
          onChange={formik.handleChange}
          label="Code"
          name="code"
          type="text"
          placeholder="Enter language code"
          className="border-0 focus:outline-none"
          backGroundColor="bg-dashboard-box dark:bg-[#0F1017]"
          textColor="text-[#677185]"
          error={
            formik.errors.code && formik.touched.code && formik.errors.code
          }
          onBlur={formik.handleBlur}
          disabled={formik.isSubmitting}
        />

        <InputApp
          value={formik.values.name}
          onChange={formik.handleChange}
          label="Name"
          name="name"
          type="text"
          placeholder="Enter language name"
          className="border-0 focus:outline-none"
          backGroundColor="bg-dashboard-box dark:bg-[#0F1017]"
          textColor="text-[#677185]"
          error={
            formik.errors.name && formik.touched.name && formik.errors.name
          }
          onBlur={formik.handleBlur}
          disabled={formik.isSubmitting}
        />
      </div>

      <InputApp
        value={formik.values.name_local}
        onChange={formik.handleChange}
        label="Local Name"
        name="name_local"
        type="text"
        placeholder="Enter local name"
        className="border-0 focus:outline-none"
        backGroundColor="bg-dashboard-box dark:bg-[#0F1017]"
        textColor="text-[#677185]"
        error={
          formik.errors.name_local &&
          formik.touched.name_local &&
          formik.errors.name_local
        }
        onBlur={formik.handleBlur}
        disabled={formik.isSubmitting}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputApp
          value={formik.values.word}
          onChange={formik.handleChange}
          label="Word"
          name="word"
          type="text"
          placeholder="Enter word"
          className="border-0 focus:outline-none"
          backGroundColor="bg-dashboard-box dark:bg-[#0F1017]"
          textColor="text-[#677185]"
          error={
            formik.errors.word && formik.touched.word && formik.errors.word
          }
          onBlur={formik.handleBlur}
          disabled={formik.isSubmitting}
        />

        <InputApp
          value={formik.values.value}
          onChange={formik.handleChange}
          label="Value"
          name="value"
          type="text"
          placeholder="Enter value"
          className="border-0 focus:outline-none"
          backGroundColor="bg-dashboard-box dark:bg-[#0F1017]"
          textColor="text-[#677185]"
          error={
            formik.errors.value && formik.touched.value && formik.errors.value
          }
          onBlur={formik.handleBlur}
          disabled={formik.isSubmitting}
        />
      </div>

      <div className="flex justify-end pt-4">
        <Button
          disabled={formik.isSubmitting}
          type="submit"
          className="text-white text-center min-w-[100px] px-5 py-2 rounded-lg bg-green-primary cursor-pointer hover:bg-green-primary/80"
        >
          {formik.isSubmitting
            ? "Submitting..."
            : formType === "add"
            ? "Submit"
            : "Update"}
        </Button>
      </div>
    </form>
  );
}
