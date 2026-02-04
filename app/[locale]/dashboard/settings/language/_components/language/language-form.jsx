"use client";
import { addLanguage, updateLanguage } from "@/app/[locale]/_Lib/actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useFormik } from "formik";
import { useLocale } from "next-intl";
import toast from "react-hot-toast";
import * as yup from "yup";
import { Loader2, Globe, Sparkles, Code, Type, FileText } from "lucide-react";

const validationSchema = yup.object({
  code: yup.string().required("Code is required"),
  name: yup.string().required("Name is required"),
  nameLocal: yup.string().required("Local name is required"),
});

export default function LanguageForm({
  successMessage,
  formType,
  setLanguagesTable,
  onSuccess,
  setOpen,
  languageOptions,
  t,
}) {
  const locale = useLocale();
  const isRTL = locale === "ar";
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
          const result = await addLanguage(dataValues);
          formik.resetForm();
          toast.success(successMessage);
          if (setLanguagesTable) {
            setLanguagesTable((prev) => [result?.data || dataValues, ...prev]);
          }
          if (onSuccess) {
            onSuccess(result?.data || dataValues);
          }
          setOpen(false);
        } else if (formType === "update") {
          const result = await updateLanguage(languageOptions.code, dataValues);
          toast.success(successMessage);
          if (setLanguagesTable) {
            setLanguagesTable((prev) =>
              prev.map((lang) =>
                lang.code === languageOptions.code ? (result?.data || dataValues) : lang
              )
            );
          }
          if (onSuccess) {
            onSuccess(result?.data || dataValues);
          }
          setOpen(false);
        }
      } catch (error) {
        toast.error(error.message || "An error occurred");
        setOpen(false);
      }
    },
  });

  return (
    <form className="space-y-6" onSubmit={formik.handleSubmit}>
      {/* Live Preview */}
      <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 border border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-green-primary" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t("Preview")}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-primary/20 to-green-primary/5 flex items-center justify-center flex-shrink-0">
            <Globe className="w-7 h-7 text-green-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {formik.values.name || t("Language Name")}
              </h3>
              {formik.values.code && (
                <span className="px-2 py-0.5 rounded-md bg-gray-200 dark:bg-gray-800 text-xs font-mono font-medium text-gray-600 dark:text-gray-400 uppercase">
                  {formik.values.code}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {formik.values.nameLocal || t("Local Name")}
            </p>
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <div className={cn("grid grid-cols-1 gap-4", {
        "md:grid-cols-2": formType === "add",
      })}>
        {formType === "add" && (
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Code className="w-4 h-4 text-gray-500" />
              {t("Code")} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="code"
              value={formik.values.code}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={formik.isSubmitting}
              placeholder={t("Enter language code")}
              className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-primary/50 focus:border-green-primary transition-all font-mono uppercase"
            />
            {formik.errors.code && formik.touched.code && (
              <p className="text-red-500 text-sm mt-1">{t(formik.errors.code)}</p>
            )}
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {t("CodeHint") || "e.g. en, ar, fr, es"}
            </p>
          </div>
        )}

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Type className="w-4 h-4 text-gray-500" />
            {t("Name")} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            disabled={formik.isSubmitting}
            placeholder={t("Enter language name")}
            className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-primary/50 focus:border-green-primary transition-all"
          />
          {formik.errors.name && formik.touched.name && (
            <p className="text-red-500 text-sm mt-1">{t(formik.errors.name)}</p>
          )}
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {t("NameHint") || "e.g. English, Arabic, French"}
          </p>
        </div>
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          <FileText className="w-4 h-4 text-gray-500" />
          {t("Local Name")} <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="nameLocal"
          value={formik.values.nameLocal}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          disabled={formik.isSubmitting}
          placeholder={t("Enter local name")}
          className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-primary/50 focus:border-green-primary transition-all"
        />
        {formik.errors.nameLocal && formik.touched.nameLocal && (
          <p className="text-red-500 text-sm mt-1">{t(formik.errors.nameLocal)}</p>
        )}
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {t("LocalNameHint") || "e.g. English, العربية, Français"}
        </p>
      </div>

      {/* Submit Button */}
      <div className={`flex gap-3 pt-2 border-t border-gray-200 dark:border-gray-800 ${isRTL ? "flex-row-reverse" : "justify-end"}`}>
        <Button
          type="button"
          variant="outline"
          onClick={() => setOpen(false)}
          className="px-6 py-2.5 rounded-xl border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          {t("Cancel")}
        </Button>
        <Button
          disabled={formik.isSubmitting}
          type="submit"
          className="bg-green-primary hover:bg-green-primary/90 text-white px-8 py-2.5 rounded-xl font-medium flex items-center gap-2"
        >
          {formik.isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {formType === "add" ? t("Adding") : t("Updating")}
            </>
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
