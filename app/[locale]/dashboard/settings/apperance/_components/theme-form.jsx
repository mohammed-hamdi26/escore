"use client";
import { addTheme } from "@/app/[locale]/_Lib/themesApi";
import { useFormik } from "formik";
import { useState } from "react";
import toast from "react-hot-toast";

import SelectInput from "@/components/ui app/SelectInput";
import { Button } from "@/components/ui/button";
import {
  ColorPicker,
  ColorPickerAlpha,
  ColorPickerFormat,
  ColorPickerHue,
  ColorPickerOutput,
  ColorPickerSelection,
} from "./color-picker";

function ThemeForm({ sucessMessage, formType, onSucess }) {
  const [selectedColor, setSelectedColor] = useState("#000000");
  const formik = useFormik({
    initialValues: {
      type_theme: "dark",
      color: "#000000",
    },
    enableReinitialize: true,
    onSubmit: async values => {
      try {
        if (formType === "add") {
          await addTheme({
            type_theme: values.type_theme,
            color: selectedColor,
          });
          console.log("no error fonud on form submitting", {
            type_theme: values.type_theme,
            color: selectedColor,
          });
        } else {
          console.log("waiting update endpoint");
        }
        toast.success(sucessMessage);
        formType === "add" && formik.resetForm();
        onSucess();
      } catch (error) {
        toast.error(error.message || "An error occurred");
      }
    },
  });
  return (
    <form className="space-y-4" onSubmit={formik.handleSubmit}>
      <ColorPicker
        setSelectedColor={setSelectedColor}
        className="max-w-sm rounded-md border bg-background p-4 shadow-sm h-70"
      >
        <ColorPickerSelection className="h-40" />
        <div className="flex items-center gap-4">
          <div className="grid w-full gap-1">
            <ColorPickerHue />
            <ColorPickerAlpha />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ColorPickerOutput />
          <ColorPickerFormat />
        </div>
      </ColorPicker>
      <SelectInput
        placeholder="Theme type"
        options={[
          { value: "dark", label: "Dark" },
          { value: "light", label: "Light" },
        ]}
        label="Theme type"
        value={formik.values.type_theme}
        onChange={value => formik.setFieldValue("type_theme", value)}
        onBlur={() => formik.setFieldTouched("type_theme", true)}
        name="type_theme"
        error={formik.touched.type_theme && formik.errors.type_theme}
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

export default ThemeForm;
