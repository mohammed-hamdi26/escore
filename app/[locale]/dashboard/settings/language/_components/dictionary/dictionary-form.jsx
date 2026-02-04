"use client";

import { addToDictionary, updateWord } from "@/app/[locale]/_Lib/actions";
import { Button } from "@/components/ui/button";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import * as yup from "yup";
import {
  Loader2,
  Sparkles,
  Type,
  Languages,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { useLocale } from "next-intl";

const validationSchema = yup.object({
  word: yup.string().required("Word is required"),
  translation: yup.string().required("translation is required"),
});

function DictionaryForm({
  successMessage,
  formType,
  code,
  initialWord,
  initialTranslation,
  setOpen,
  setDictionary,
  t,
}) {
  const locale = useLocale();
  const isRTL = locale === "ar";
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  const formik = useFormik({
    initialValues: {
      word: initialWord || "",
      translation: initialTranslation || "",
    },
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const dataValues = {
        word: values.word,
        translation: values.translation,
      };
      try {
        if (formType === "add") {
          await addToDictionary(code, dataValues);
          setDictionary((prev) => ({
            [values.word]: values.translation,
            ...prev,
          }));
          formik.resetForm();
          toast.success(successMessage);
          setOpen(false);
        } else {
          await updateWord(code, values.word, values.translation);
          toast.success(successMessage);
          setDictionary((prev) => ({
            ...prev,
            [values.word]: values.translation,
          }));
          setOpen(false);
        }
      } catch (error) {
        toast.error(error.message || "An error occurred");
        setOpen(false);
      }
    },
  });

  return (
    <form className="space-y-5" onSubmit={formik.handleSubmit}>
      {/* Live Preview */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-gray-900/50 dark:to-gray-800/30 rounded-xl p-4 border border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-green-primary" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t("Preview")}
          </span>
        </div>
        <div className="flex items-center gap-3">
          {/* Word Box */}
          <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg px-4 py-3 border border-gray-200 dark:border-gray-700 shadow-sm">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 font-medium">
              {t("Word")}
            </p>
            <p className="text-base font-semibold text-gray-900 dark:text-white truncate">
              {formik.values.word || "key"}
            </p>
          </div>

          {/* Arrow */}
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-primary/10 flex items-center justify-center">
            <ArrowIcon className="w-4 h-4 text-green-primary" />
          </div>

          {/* Translation Box */}
          <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg px-4 py-3 border border-gray-200 dark:border-gray-700 shadow-sm">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 font-medium">
              {t("Translation")}
            </p>
            <p className="text-base font-semibold text-gray-900 dark:text-white truncate">
              {formik.values.translation || t("Translation value")}
            </p>
          </div>
        </div>
      </div>

      {/* Word Input - Only show in add mode */}
      {formType === "add" && (
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Type className="w-4 h-4 text-gray-500" />
            {t("Word")} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="word"
            value={formik.values.word}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            disabled={formik.isSubmitting}
            placeholder={t("Enter the word")}
            className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-primary/50 focus:border-green-primary transition-all font-mono"
          />
          {formik.errors.word && formik.touched.word && (
            <p className="text-red-500 text-sm mt-1">{t(formik.errors.word)}</p>
          )}
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
            {t("WordHint") || "The key used in the code (e.g. Submit, Cancel)"}
          </p>
        </div>
      )}

      {/* Translation Input */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          <Languages className="w-4 h-4 text-gray-500" />
          {t("Translation")} <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="translation"
          value={formik.values.translation}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          disabled={formik.isSubmitting}
          placeholder={t("Enter the translation")}
          className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-primary/50 focus:border-green-primary transition-all"
        />
        {formik.errors.translation && formik.touched.translation && (
          <p className="text-red-500 text-sm mt-1">
            {t(formik.errors.translation)}
          </p>
        )}
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
          {t("TranslationHint") || "The translated text shown to users"}
        </p>
      </div>

      {/* Submit Button */}
      <div className={`flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-800 ${isRTL ? "flex-row-reverse" : "justify-end"}`}>
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

export default DictionaryForm;
