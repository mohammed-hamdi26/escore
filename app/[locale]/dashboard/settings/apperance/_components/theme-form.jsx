"use client";
import { addTheme, updateTheme } from "@/app/[locale]/_Lib/actions";
import { useFormik } from "formik";
import { useState } from "react";
import toast from "react-hot-toast";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import {
  ColorPicker,
  ColorPickerFormat,
  ColorPickerHue,
  ColorPickerSelection,
} from "./color-picker";
import { Spinner } from "@/components/ui/spinner";
import { Loader2, Sun, Moon, Pipette, Type } from "lucide-react";

const validationSchema = Yup.object({
  typeTheme: Yup.string().oneOf(["dark", "light"]).required("Theme type is required"),
  color: Yup.string()
    .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid hex color")
    .required("Color is required"),
});

function ThemeForm({
  sucessMessage,
  formType,
  onSuccess,
  setOpen,
  currentTheme,
  t,
}) {
  const [inputMode, setInputMode] = useState("picker"); // "picker" or "manual"
  const [selectedColor, setSelectedColor] = useState(currentTheme?.color || "#3B82F6");

  const formik = useFormik({
    initialValues: {
      typeTheme: currentTheme?.typeTheme || "dark",
      color: currentTheme?.color || "#3B82F6",
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      const dataValues = {
        typeTheme: values.typeTheme,
        color: inputMode === "picker" ? selectedColor : values.color,
      };

      try {
        if (formType === "add") {
          const response = await addTheme(dataValues);
          if (onSuccess) {
            onSuccess(response?.data || dataValues);
          }
          toast.success(sucessMessage);
          formik.resetForm();
          setOpen(false);
        } else if (formType === "edit") {
          await updateTheme(dataValues, currentTheme.id);
          if (onSuccess) {
            onSuccess({ ...dataValues, id: currentTheme.id });
          }
          toast.success(sucessMessage);
          setOpen(false);
        }
      } catch (error) {
        toast.error(error.message || t("An error occurred"));
      }
    },
  });

  // Sync manual input with color picker
  const handleManualColorChange = (e) => {
    const value = e.target.value;
    formik.setFieldValue("color", value);
    if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value)) {
      setSelectedColor(value);
    }
  };

  // Sync color picker with formik
  const handleColorPickerChange = (color) => {
    setSelectedColor(color);
    formik.setFieldValue("color", color);
  };

  return (
    <form className="space-y-6" onSubmit={formik.handleSubmit}>
      {/* Theme Type Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3">
          {t("ThemeType")} *
        </label>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => formik.setFieldValue("typeTheme", "dark")}
            className={`p-4 rounded-xl border-2 transition-all text-left ${
              formik.values.typeTheme === "dark"
                ? "border-green-primary bg-green-primary/10"
                : "border-gray-700 bg-gray-800/50 hover:border-gray-600"
            }`}
          >
            <Moon className={`w-6 h-6 mb-2 ${
              formik.values.typeTheme === "dark" ? "text-green-primary" : "text-gray-400"
            }`} />
            <p className={`font-medium ${
              formik.values.typeTheme === "dark" ? "text-white" : "text-gray-300"
            }`}>{t("Dark")}</p>
            <p className="text-xs text-gray-500 mt-1">{t("Dark mode theme")}</p>
          </button>

          <button
            type="button"
            onClick={() => formik.setFieldValue("typeTheme", "light")}
            className={`p-4 rounded-xl border-2 transition-all text-left ${
              formik.values.typeTheme === "light"
                ? "border-green-primary bg-green-primary/10"
                : "border-gray-700 bg-gray-800/50 hover:border-gray-600"
            }`}
          >
            <Sun className={`w-6 h-6 mb-2 ${
              formik.values.typeTheme === "light" ? "text-green-primary" : "text-gray-400"
            }`} />
            <p className={`font-medium ${
              formik.values.typeTheme === "light" ? "text-white" : "text-gray-300"
            }`}>{t("Light")}</p>
            <p className="text-xs text-gray-500 mt-1">{t("Light mode theme")}</p>
          </button>
        </div>
        {formik.touched.typeTheme && formik.errors.typeTheme && (
          <p className="text-red-400 text-sm mt-2">{t(formik.errors.typeTheme)}</p>
        )}
      </div>

      {/* Color Input Mode Toggle */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3">
          {t("Color")} *
        </label>
        <div className="flex gap-2 mb-4">
          <button
            type="button"
            onClick={() => setInputMode("picker")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              inputMode === "picker"
                ? "bg-green-primary text-white"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
          >
            <Pipette className="w-4 h-4" />
            {t("Color Picker")}
          </button>
          <button
            type="button"
            onClick={() => setInputMode("manual")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              inputMode === "manual"
                ? "bg-green-primary text-white"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
          >
            <Type className="w-4 h-4" />
            {t("Manual Input")}
          </button>
        </div>

        {inputMode === "picker" ? (
          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
            <ColorPicker
              setSelectedColor={handleColorPickerChange}
              className="rounded-md"
            >
              <ColorPickerSelection className="h-40 rounded-lg" />
              <div className="flex items-center gap-4 mt-4">
                <div className="grid w-full gap-1">
                  <ColorPickerHue />
                </div>
              </div>
              <div className="flex items-center gap-3 mt-4">
                <div
                  className="w-12 h-12 rounded-lg border-2 border-gray-600 flex-shrink-0"
                  style={{ backgroundColor: selectedColor }}
                />
                <ColorPickerFormat />
              </div>
            </ColorPicker>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex gap-4 items-start">
              <div className="flex-1">
                <input
                  type="text"
                  name="color"
                  placeholder="#3B82F6"
                  value={formik.values.color}
                  onChange={handleManualColorChange}
                  onBlur={formik.handleBlur}
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white font-mono placeholder-gray-500 focus:outline-none focus:border-green-primary transition-colors"
                />
                <p className="text-xs text-gray-500 mt-2">{t("Enter a valid hex color code (eg #3B82F6)")}</p>
              </div>
              <div
                className="w-14 h-14 rounded-xl border-2 border-gray-600 flex-shrink-0"
                style={{ backgroundColor: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(formik.values.color) ? formik.values.color : "#000000" }}
              />
            </div>
            {formik.touched.color && formik.errors.color && (
              <p className="text-red-400 text-sm">{t(formik.errors.color)}</p>
            )}
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex justify-end pt-2">
        <Button
          disabled={formik.isSubmitting}
          type="submit"
          className="bg-green-primary hover:bg-green-primary/80 text-white px-8 py-3 rounded-xl font-medium flex items-center gap-2"
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

export default ThemeForm;
