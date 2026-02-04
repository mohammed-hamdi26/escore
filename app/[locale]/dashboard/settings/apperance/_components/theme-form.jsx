"use client";
import { addTheme, updateTheme } from "@/app/[locale]/_Lib/actions";
import { useFormik } from "formik";
import { useState } from "react";
import { useLocale } from "next-intl";
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
import { Loader2, Sun, Moon, Pipette, Type, Check, Sparkles } from "lucide-react";

const validationSchema = Yup.object({
  typeTheme: Yup.string().oneOf(["dark", "light"]).required("Theme type is required"),
  color: Yup.string()
    .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid hex color")
    .required("Color is required"),
});

// Preset colors for quick selection
const presetColors = [
  { name: "Green", color: "#22C55E" },
  { name: "Blue", color: "#3B82F6" },
  { name: "Purple", color: "#8B5CF6" },
  { name: "Pink", color: "#EC4899" },
  { name: "Red", color: "#EF4444" },
  { name: "Orange", color: "#F97316" },
  { name: "Yellow", color: "#EAB308" },
  { name: "Cyan", color: "#06B6D4" },
  { name: "Indigo", color: "#6366F1" },
  { name: "Teal", color: "#14B8A6" },
];

function ThemeForm({
  sucessMessage,
  formType,
  onSuccess,
  setOpen,
  currentTheme,
  t,
}) {
  const locale = useLocale();
  const isRTL = locale === "ar";
  const [inputMode, setInputMode] = useState("preset"); // "preset", "picker" or "manual"
  const [selectedColor, setSelectedColor] = useState(currentTheme?.color || "#22C55E");

  const formik = useFormik({
    initialValues: {
      typeTheme: currentTheme?.typeTheme || "dark",
      color: currentTheme?.color || "#22C55E",
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      const finalColor = inputMode === "manual" ? values.color : selectedColor;
      const dataValues = {
        typeTheme: values.typeTheme,
        color: finalColor,
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

  // Handle preset color selection
  const handlePresetSelect = (color) => {
    setSelectedColor(color);
    formik.setFieldValue("color", color);
  };

  const currentColor = inputMode === "manual"
    ? (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(formik.values.color) ? formik.values.color : "#000000")
    : selectedColor;

  return (
    <form className="space-y-6" onSubmit={formik.handleSubmit}>
      {/* Live Preview */}
      <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 border border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-green-primary" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t("Preview")}</span>
        </div>
        <div className="flex items-center gap-4">
          <div
            className="w-20 h-20 rounded-xl shadow-lg ring-2 ring-white/20 dark:ring-white/10 transition-colors"
            style={{ backgroundColor: currentColor }}
          />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <code className="text-lg font-mono font-bold text-gray-900 dark:text-white">
                {currentColor}
              </code>
            </div>
            <div className="flex items-center gap-2">
              {formik.values.typeTheme === "dark" ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
                  <Moon className="w-3 h-3" />
                  {t("Dark")}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400">
                  <Sun className="w-3 h-3" />
                  {t("Light")}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Theme Type Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          {t("ThemeType")} <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => formik.setFieldValue("typeTheme", "dark")}
            className={`p-4 rounded-xl border-2 transition-all text-left ${
              formik.values.typeTheme === "dark"
                ? "border-green-primary bg-green-primary/10"
                : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 hover:border-gray-300 dark:hover:border-gray-600"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <Moon className={`w-6 h-6 ${
                formik.values.typeTheme === "dark" ? "text-green-primary" : "text-gray-400"
              }`} />
              {formik.values.typeTheme === "dark" && (
                <div className="w-5 h-5 rounded-full bg-green-primary flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
            <p className={`font-medium ${
              formik.values.typeTheme === "dark" ? "text-gray-900 dark:text-white" : "text-gray-600 dark:text-gray-300"
            }`}>{t("Dark")}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t("Dark mode theme")}</p>
          </button>

          <button
            type="button"
            onClick={() => formik.setFieldValue("typeTheme", "light")}
            className={`p-4 rounded-xl border-2 transition-all text-left ${
              formik.values.typeTheme === "light"
                ? "border-green-primary bg-green-primary/10"
                : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 hover:border-gray-300 dark:hover:border-gray-600"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <Sun className={`w-6 h-6 ${
                formik.values.typeTheme === "light" ? "text-green-primary" : "text-gray-400"
              }`} />
              {formik.values.typeTheme === "light" && (
                <div className="w-5 h-5 rounded-full bg-green-primary flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
            <p className={`font-medium ${
              formik.values.typeTheme === "light" ? "text-gray-900 dark:text-white" : "text-gray-600 dark:text-gray-300"
            }`}>{t("Light")}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t("Light mode theme")}</p>
          </button>
        </div>
        {formik.touched.typeTheme && formik.errors.typeTheme && (
          <p className="text-red-500 text-sm mt-2">{t(formik.errors.typeTheme)}</p>
        )}
      </div>

      {/* Color Input Mode Toggle */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          {t("Color")} <span className="text-red-500">*</span>
        </label>
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            type="button"
            onClick={() => setInputMode("preset")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              inputMode === "preset"
                ? "bg-green-primary text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            {t("Presets")}
          </button>
          <button
            type="button"
            onClick={() => setInputMode("picker")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              inputMode === "picker"
                ? "bg-green-primary text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
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
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            <Type className="w-4 h-4" />
            {t("Manual Input")}
          </button>
        </div>

        {inputMode === "preset" && (
          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 border border-gray-200 dark:border-gray-800">
            <div className="grid grid-cols-5 gap-3">
              {presetColors.map((preset) => (
                <button
                  key={preset.color}
                  type="button"
                  onClick={() => handlePresetSelect(preset.color)}
                  className={`relative group flex flex-col items-center gap-2 p-3 rounded-xl transition-all ${
                    selectedColor === preset.color
                      ? "bg-white dark:bg-gray-800 shadow-md ring-2 ring-green-primary"
                      : "hover:bg-white dark:hover:bg-gray-800 hover:shadow-sm"
                  }`}
                >
                  <div
                    className="w-10 h-10 rounded-lg shadow-sm ring-1 ring-black/10 dark:ring-white/10"
                    style={{ backgroundColor: preset.color }}
                  />
                  {selectedColor === preset.color && (
                    <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-green-primary flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-white" />
                    </div>
                  )}
                  <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                    {preset.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {inputMode === "picker" && (
          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 border border-gray-200 dark:border-gray-800">
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
                  className="w-12 h-12 rounded-lg border-2 border-gray-300 dark:border-gray-600 flex-shrink-0 shadow-sm"
                  style={{ backgroundColor: selectedColor }}
                />
                <ColorPickerFormat />
              </div>
            </ColorPicker>
          </div>
        )}

        {inputMode === "manual" && (
          <div className="space-y-4">
            <div className="flex gap-4 items-start">
              <div className="flex-1">
                <input
                  type="text"
                  name="color"
                  placeholder="#22C55E"
                  value={formik.values.color}
                  onChange={handleManualColorChange}
                  onBlur={formik.handleBlur}
                  className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white font-mono placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-primary/50 focus:border-green-primary transition-all"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  {t("Enter a valid hex color code (eg #3B82F6)")}
                </p>
              </div>
              <div
                className="w-14 h-14 rounded-xl border-2 border-gray-300 dark:border-gray-600 flex-shrink-0 shadow-sm"
                style={{ backgroundColor: currentColor }}
              />
            </div>
            {formik.touched.color && formik.errors.color && (
              <p className="text-red-500 text-sm">{t(formik.errors.color)}</p>
            )}
          </div>
        )}
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

export default ThemeForm;
