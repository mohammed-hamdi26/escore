"use client";
import { addTheme, updateTheme } from "@/app/[locale]/_Lib/actions";
import { useFormik } from "formik";
import { useState } from "react";
import toast from "react-hot-toast";

import SelectInput from "@/components/ui app/SelectInput";
import { Button } from "@/components/ui/button";
import {
  ColorPicker,
  ColorPickerFormat,
  ColorPickerHue,
  ColorPickerSelection,
} from "./color-picker";

function ThemeForm({
  sucessMessage,
  formType,
  setThemes,
  setOpen,
  currentTheme,
}) {
  const [selectedColor, setSelectedColor] = useState(currentTheme?.color || "");
  const formik = useFormik({
    initialValues: {
      typeTheme: currentTheme?.typeTheme || "dark",
      color: selectedColor,
    },
    enableReinitialize: true,
    onSubmit: async (values) => {
      const dataValues = {
        typeTheme: values.typeTheme,
        color: selectedColor,
      };
      try {
        if (formType === "add") {
          await addTheme(dataValues);
          formik.resetForm();
          setThemes((prev) => [dataValues, ...prev]);
          toast.success(sucessMessage);
          setOpen(false);
        } else if (formType === "edit") {
          await updateTheme(dataValues, currentTheme.id);
          toast.success(sucessMessage);
          setThemes((prev) =>
            prev.map((theme) =>
              theme.id === currentTheme.id ? dataValues : theme
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
      <ColorPicker
        setSelectedColor={setSelectedColor}
        className="max-w-sm rounded-md border bg-background p-4 shadow-sm h-70"
      >
        <ColorPickerSelection className="h-40" />
        <div className="flex items-center gap-4">
          <div className="grid w-full gap-1">
            <ColorPickerHue />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ColorPickerFormat />
        </div>
      </ColorPicker>
      {formType === "add" && (
        <SelectInput
          placeholder="Theme type"
          options={[
            { value: "dark", label: "Dark" },
            { value: "light", label: "Light" },
          ]}
          label="Theme type"
          value={formik.values.typeTheme}
          onChange={(value) => formik.setFieldValue("typeTheme", value)}
          onBlur={() => formik.setFieldTouched("typeTheme", true)}
          name="typeTheme"
          error={formik.touched.typeTheme && formik.errors.typeTheme}
          disabled={formik.isSubmitting}
        />
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

export default ThemeForm;
