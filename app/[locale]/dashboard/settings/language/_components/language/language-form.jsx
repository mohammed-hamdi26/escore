"use client";
import { addLanguage, updateLanguage } from "@/app/[locale]/_Lib/languageAPI";
import InputApp from "@/components/ui app/InputApp";
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';
import { useFormik } from "formik";
import toast from "react-hot-toast";
import * as yup from "yup";

const validationSchema = yup.object({
  code: yup.string().required("Code is required"),
  name: yup.string().required("Name is required"),
  nameLocal: yup.string().required("Local name is required"),
  word: yup.string().required("Word is required"),
  value: yup.string().required("Value is required"),
});

export default function LanguageForm({
  successMessage,
  formType,
  setLanguagesTable,
  setOpen,
  languageOptions,
}) {
  const formik = useFormik({
    initialValues: {
      code: languageOptions?.code || "",
      name: languageOptions?.name || "",
      nameLocal: languageOptions?.nameLocal || "",
      word: languageOptions?.dictionary
        ? Object.keys(languageOptions.dictionary)[0] || ""
        : "",
      value: languageOptions?.dictionary
        ? Object.values(languageOptions.dictionary)[0] || ""
        : "",
    },
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: async values => {
      const dataValues = {
        code: values.code,
        name: values.name,
        nameLocal: values.nameLocal,
        dictionary: {
          [values.word]: values.value,
        },
      };

      try {
        if (formType === "add") {
          await addLanguage(dataValues);
          formik.resetForm();
          toast.success(successMessage);
          setLanguagesTable(prev => [dataValues,...prev]);
          setOpen(false);
        } else if (formType === "update") {
          await updateLanguage(languageOptions.code, dataValues);
          toast.success(successMessage);
          setLanguagesTable(prev =>
            prev.map(lang =>
              lang.code === languageOptions.code ? dataValues : lang
            )
          );
          setOpen(false);
        }
      } catch (error) {
        toast.error(error.message || "An error occurred");
        setOpen(false);
      }
    },
  });

  return (
    <form className="space-y-4" onSubmit={formik.handleSubmit}>
      <div className={cn("grid grid-cols-1 gap-4",{"md:grid-cols-2" : formType === "add"})}>
        {formType === "add" && (
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
        )}

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
        value={formik.values.nameLocal}
        onChange={formik.handleChange}
        label="Local Name"
        name="nameLocal"
        type="text"
        placeholder="Enter local name"
        className="border-0 focus:outline-none"
        backGroundColor="bg-dashboard-box dark:bg-[#0F1017]"
        textColor="text-[#677185]"
        error={
          formik.errors.nameLocal &&
          formik.touched.nameLocal &&
          formik.errors.nameLocal
        }
        onBlur={formik.handleBlur}
        disabled={formik.isSubmitting}
      />
      {formType === "add" && (
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
            disabled={formik.isSubmitting || formType === "update"}
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
            disabled={formik.isSubmitting || formType === "update"}
          />
        </div>
      )}

      <div className="flex justify-end pt-4">
        <Button
          disabled={formik.isSubmitting}
          type="submit"
          className="text-white text-center min-w-[100px] px-5 py-2 rounded-lg bg-green-primary cursor-pointer hover:bg-[#2ca54d]"
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
