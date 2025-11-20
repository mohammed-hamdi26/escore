"use client";

import { addToDictionary, updateWord } from "@/app/[locale]/_Lib/actions";
import InputApp from "@/components/ui app/InputApp";
import { Button } from "@/components/ui/button";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import * as yup from "yup";
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
}) {
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
    <form className="space-y-4" onSubmit={formik.handleSubmit}>
      {formType === "add" && (
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
          error={
            formik.errors.word && formik.touched.word && formik.errors.word
          }
          onBlur={formik.handleBlur}
          disabled={formik.isSubmitting || formType === "edit"}
        />
      )}

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

export default DictionaryForm;
