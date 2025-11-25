"use client";
import { addLanguage, updateLanguage } from "@/app/[locale]/_Lib/actions";
import InputApp from "@/components/ui app/InputApp";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import * as yup from "yup";

const validationSchema = yup.object({
  code: yup.string().required("Code is required"),
  name: yup.string().required("Name is required"),
  nameLocal: yup.string().required("Local name is required"),
});

export default function LanguageForm({
  successMessage,
  formType,
  setLanguagesTable,
  setOpen,
  languageOptions,
  t,
}) {
  const formik = useFormik({
    initialValues: {
      code: languageOptions?.code || "",
      name: languageOptions?.name || "",
      nameLocal: languageOptions?.nameLocal || "",
    },
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const dataValues = {
        code: values.code,
        name: values.name,
        nameLocal: values.nameLocal,
      };

      try {
        if (formType === "add") {
          await addLanguage(dataValues);
          formik.resetForm();
          toast.success(successMessage);
          setLanguagesTable((prev) => [dataValues, ...prev]);
          setOpen(false);
        } else if (formType === "update") {
          await updateLanguage(languageOptions.code, dataValues);
          toast.success(successMessage);
          setLanguagesTable((prev) =>
            prev.map((lang) =>
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
      <div
        className={cn("grid grid-cols-1 gap-4", {
          "md:grid-cols-2": formType === "add",
        })}
      >
        {formType === "add" && (
          <InputApp
            value={formik.values.code}
            onChange={formik.handleChange}
            label={t("Code")}
            name="code"
            type="text"
            placeholder={t("Enter language code")}
            className="border-0 focus:outline-none"
            backGroundColor="bg-dashboard-box dark:bg-[#0F1017]"
            textColor="text-[#677185]"
            error={
              formik.errors.code && formik.touched.code && t(formik.errors.code)
            }
            onBlur={formik.handleBlur}
            disabled={formik.isSubmitting}
          />
        )}

        <InputApp
          value={formik.values.name}
          onChange={formik.handleChange}
          label={t("Name")}
          name="name"
          type="text"
          placeholder={t("Enter language name")}
          className="border-0 focus:outline-none"
          backGroundColor="bg-dashboard-box dark:bg-[#0F1017]"
          textColor="text-[#677185]"
          error={
            formik.errors.name && formik.touched.name && t(formik.errors.name)
          }
          onBlur={formik.handleBlur}
          disabled={formik.isSubmitting}
        />
      </div>

      <InputApp
        value={formik.values.nameLocal}
        onChange={formik.handleChange}
        label={t("Local Name")}
        name="nameLocal"
        type="text"
        placeholder={t("Enter local name")}
        className="border-0 focus:outline-none"
        backGroundColor="bg-dashboard-box dark:bg-[#0F1017]"
        textColor="text-[#677185]"
        error={
          formik.errors.nameLocal &&
          formik.touched.nameLocal &&
          t(formik.errors.nameLocal)
        }
        onBlur={formik.handleBlur}
        disabled={formik.isSubmitting}
      />
      <div className="flex justify-end pt-4">
        <Button
          disabled={formik.isSubmitting}
          type="submit"
          className="text-white text-center min-w-[100px] px-5 py-2 rounded-lg bg-green-primary cursor-pointer hover:bg-[#2ca54d]"
        >
          {formik.isSubmitting ? (
            <Spinner />
          ) : formType === "add" ? (
            t("Submit")
          ) : (
            t("Update")
          )}
        </Button>
      </div>
    </form>
  );
}
