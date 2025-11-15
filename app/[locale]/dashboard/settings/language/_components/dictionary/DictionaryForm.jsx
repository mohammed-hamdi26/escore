"use client";

import { addToDictionary, updateWord } from "@/app/[locale]/_Lib/dictionary";
import InputApp from "@/components/ui app/InputApp";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/navigation";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import * as yup from "yup";
const validationSchema = yup.object({
  word: yup.string().required("Word is required"),
  translation: yup.string().required("translation is required"),
});
function DictionaryForm({
  successMessage,
  formType = "add",
  code,
  initialWord = "",
  initialTranslation = "",
  onSuccess,
}) {
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      word: initialWord,
      translation: initialTranslation,
    },
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: async values => {
      try {
        if (formType === "add") {
          await addToDictionary(code, {
            word: values.word,
            translation: values.translation,
          });
        } else {
          await updateWord(code, values.word, values.translation);
        }
        toast.success(successMessage);
        formType === "add" && formik.resetForm();
        onSuccess
          ? onSuccess()
          : router.push(`/dashboard/settings/language/${code}`);
      } catch (error) {
        toast.error(error.message || "An error occurred");
      }
    },
  });

  return (
    <form className="space-y-4" onSubmit={formik.handleSubmit}>
      <InputApp
        value={formik.values.word}
        onChange={formik.handleChange}
        label="Word"
        name="word"
        type="text"
        placeholder="Enter the word"
        className="border-0 focus:outline-none"
        backGroundColor="bg-dashboard-box dark:bg-[#0F1017]"
        textColor="text-[#677185]"
        error={formik.errors.word && formik.touched.word && formik.errors.word}
        onBlur={formik.handleBlur}
        disabled={formik.isSubmitting || formType === "edit"}
      />

      <InputApp
        value={formik.values.translation}
        onChange={formik.handleChange}
        label="Translation"
        name="translation"
        type="text"
        placeholder="Enter the translation"
        className="border-0 focus:outline-none"
        backGroundColor="bg-dashboard-box dark:bg-[#0F1017]"
        textColor="text-[#677185]"
        error={
          formik.errors.translation &&
          formik.touched.translation &&
          formik.errors.translation
        }
        onBlur={formik.handleBlur}
        disabled={formik.isSubmitting}
      />
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

export default DictionaryForm;
