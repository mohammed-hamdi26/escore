"use client";
import { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Button } from "../ui/button";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";
import FormSection from "../ui app/FormSection";
import FormRow from "../ui app/FormRow";
import ImageUpload from "../ui app/ImageUpload";
import { Calendar as CalendarComponent } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Switch } from "../ui/switch";
import {
  Gamepad2,
  Image as ImageIcon,
  Save,
  Loader2,
  CalendarDays,
  FileText,
  Power,
  Hash,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

const validationSchema = yup.object({
  name: yup.string().required("Game name is required").max(100, "Name must be at most 100 characters"),
  slug: yup.string().max(100, "Slug must be at most 100 characters"),
  description: yup.string().max(2000, "Description must be at most 2000 characters"),
  releaseDate: yup.date().nullable().typeError("Invalid date"),
  isActive: yup.boolean(),
});

export default function GamesForm({
  data,
  submitFunction,
  typeForm = "add",
}) {
  const t = useTranslations("GameForm");

  const formik = useFormik({
    initialValues: {
      name: data?.name || "",
      slug: data?.slug || "",
      description: data?.description || "",
      logoLight: data?.logo?.light || "",
      logoDark: data?.logo?.dark || "",
      coverImageLight: data?.coverImage?.light || "",
      coverImageDark: data?.coverImage?.dark || "",
      releaseDate: data?.releaseDate ? new Date(data.releaseDate).toISOString().split("T")[0] : "",
      isActive: data?.isActive !== undefined ? data.isActive : true,
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        let dataValues = data ? { id: data.id || data._id } : {};

        // Required field
        dataValues.name = values.name;

        // Auto-generate slug if not provided, otherwise use provided slug
        dataValues.slug = values.slug || values.name.replace(/\s+/g, "-").toLowerCase();

        // Optional description - only include if has value
        if (values.description && values.description.trim()) {
          dataValues.description = values.description.trim();
        }

        // Build logo object - only include if has at least light image
        if (values.logoLight) {
          dataValues.logo = {
            light: values.logoLight,
            dark: values.logoDark || values.logoLight,
          };
        }

        // Build coverImage object - only include if has at least light image
        if (values.coverImageLight) {
          dataValues.coverImage = {
            light: values.coverImageLight,
            dark: values.coverImageDark || values.coverImageLight,
          };
        }

        // Convert date to ISO format for backend - only include if has value
        if (values.releaseDate) {
          dataValues.releaseDate = new Date(values.releaseDate).toISOString();
        }

        // isActive is always included
        dataValues.isActive = values.isActive;

        await submitFunction(dataValues);
        typeForm === "add" && formik.resetForm();
        toast.success(
          typeForm === "add"
            ? t("gameAdded") || "Game added successfully"
            : t("gameEdited") || "Game updated successfully"
        );
      } catch (error) {
        // Ignore NEXT_REDIRECT - it's expected behavior for successful form submission
        if (!error.toString().includes("NEXT_REDIRECT")) {
          toast.error(error.message || "An error occurred");
        }
      }
    },
  });

  return (
    <form className="space-y-8" onSubmit={formik.handleSubmit}>
      {/* Basic Information */}
      <FormSection
        title={t("basicInfo") || "Basic Information"}
        icon={<Gamepad2 className="size-5" />}
      >
        <FormRow>
          {/* Name */}
          <div className="space-y-2 flex-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Gamepad2 className="size-4" />
              {t("gameName") || "Game Name"} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder={t("enterGameName") || "Enter game name"}
              className={`w-full h-11 px-4 rounded-xl bg-gray-100 dark:bg-[#1a1d2e] border-0 text-sm text-gray-900 dark:text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-primary/50 transition-all ${
                formik.touched.name && formik.errors.name ? "ring-2 ring-red-500" : ""
              }`}
            />
            {formik.touched.name && formik.errors.name && (
              <p className="text-sm text-red-500">{formik.errors.name}</p>
            )}
          </div>

          {/* Slug */}
          <div className="space-y-2 flex-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Hash className="size-4" />
              {t("slug") || "Slug"}
            </label>
            <input
              type="text"
              name="slug"
              value={formik.values.slug}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder={t("slugPlaceholder") || "Auto-generated from name if empty"}
              className="w-full h-11 px-4 rounded-xl bg-gray-100 dark:bg-[#1a1d2e] border-0 text-sm text-gray-900 dark:text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-primary/50 transition-all"
            />
            {formik.touched.slug && formik.errors.slug && (
              <p className="text-sm text-red-500">{formik.errors.slug}</p>
            )}
          </div>
        </FormRow>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <FileText className="size-4" />
            {t("description") || "Description"}
          </label>
          <textarea
            name="description"
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder={t("enterDescription") || "Enter game description"}
            rows={4}
            className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-[#1a1d2e] border-0 text-sm text-gray-900 dark:text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-primary/50 transition-all resize-none"
          />
          {formik.touched.description && formik.errors.description && (
            <p className="text-sm text-red-500">{formik.errors.description}</p>
          )}
        </div>

        <FormRow>
          {/* Release Date - Enhanced */}
          <DatePickerField
            label={t("releaseDate") || "Release Date"}
            name="releaseDate"
            formik={formik}
            placeholder={t("selectDate") || "Select release date"}
          />

          {/* Active Status */}
          <div className="space-y-2 flex-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Power className="size-4" />
              {t("activeStatus") || "Active Status"}
            </label>
            <div className="h-12 px-4 rounded-xl bg-gray-100 dark:bg-[#1a1d2e] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`size-9 rounded-lg flex items-center justify-center ${
                  formik.values.isActive ? "bg-green-primary/10" : "bg-red-500/10"
                }`}>
                  <Power className={`size-5 ${formik.values.isActive ? "text-green-primary" : "text-red-500"}`} />
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {formik.values.isActive
                    ? t("active") || "Active"
                    : t("inactive") || "Inactive"}
                </span>
              </div>
              <Switch
                checked={formik.values.isActive}
                onCheckedChange={(checked) => formik.setFieldValue("isActive", checked)}
              />
            </div>
          </div>
        </FormRow>
      </FormSection>

      {/* Logo Images - Compact */}
      <FormSection
        title={t("logoImages") || "Logo Images"}
        icon={<ImageIcon className="size-5" />}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Logo Light */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t("logoLight") || "Logo (Light)"}
            </label>
            <ImageUpload
              formik={formik}
              name="logoLight"
              placeholder={t("uploadLogoLight") || "Upload"}
              compact={true}
              aspectRatio="square"
            />
          </div>

          {/* Logo Dark */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t("logoDark") || "Logo (Dark)"}
            </label>
            <ImageUpload
              formik={formik}
              name="logoDark"
              placeholder={t("uploadLogoDark") || "Upload"}
              compact={true}
              aspectRatio="square"
            />
          </div>

          {/* Cover Image Light */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t("coverLight") || "Cover (Light)"}
            </label>
            <ImageUpload
              formik={formik}
              name="coverImageLight"
              placeholder={t("uploadCoverLight") || "Upload"}
              compact={true}
              aspectRatio="square"
            />
          </div>

          {/* Cover Image Dark */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t("coverDark") || "Cover (Dark)"}
            </label>
            <ImageUpload
              formik={formik}
              name="coverImageDark"
              placeholder={t("uploadCoverDark") || "Upload"}
              compact={true}
              aspectRatio="square"
            />
          </div>
        </div>
      </FormSection>

      {/* Submit Button */}
      <div className="flex justify-end pt-4">
        <Button
          type="submit"
          disabled={formik.isSubmitting}
          className="h-11 px-6 rounded-xl bg-green-primary hover:bg-green-primary/90 text-white font-medium gap-2"
        >
          {formik.isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              {typeForm === "add" ? t("adding") || "Adding..." : t("saving") || "Saving..."}
            </>
          ) : (
            <>
              <Save className="size-4" />
              {typeForm === "add" ? t("addGame") || "Add Game" : t("saveChanges") || "Save Changes"}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

// Enhanced Date Picker Field with Month/Year dropdowns
function DatePickerField({ label, name, formik, placeholder }) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(new Date());
  const t = useTranslations("GameForm");

  const error = formik.touched[name] && formik.errors[name];
  const value = formik.values[name];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1970 + 10 }, (_, i) => 1970 + i).reverse();

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const formatDisplayDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleSelect = (date) => {
    if (date) {
      const formattedDate = date.toISOString().split("T")[0];
      formik.setFieldValue(name, formattedDate);
      formik.setFieldTouched(name, true);
    }
    setIsOpen(false);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    formik.setFieldValue(name, "");
    formik.setFieldTouched(name, true);
  };

  const handleMonthChange = (monthIndex) => {
    const newDate = new Date(viewDate);
    newDate.setMonth(monthIndex);
    setViewDate(newDate);
  };

  const handleYearChange = (year) => {
    const newDate = new Date(viewDate);
    newDate.setFullYear(year);
    setViewDate(newDate);
  };

  const goToPreviousMonth = () => {
    const newDate = new Date(viewDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setViewDate(newDate);
  };

  const goToNextMonth = () => {
    const newDate = new Date(viewDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setViewDate(newDate);
  };

  const selectedDate = value ? new Date(value) : undefined;

  return (
    <div className="flex-1 space-y-2">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
        <CalendarDays className="size-4" />
        {label}
      </label>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <div
            role="button"
            tabIndex={0}
            className={`w-full h-12 px-4 rounded-xl bg-gray-100 dark:bg-[#1a1d2e] border border-transparent text-sm text-left rtl:text-right focus:outline-none focus:ring-2 focus:ring-green-primary/50 cursor-pointer transition-all hover:bg-gray-200 dark:hover:bg-[#252a3d] flex items-center justify-between gap-2 ${
              error ? "ring-2 ring-red-500 border-red-500" : ""
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-lg bg-green-primary/10 flex items-center justify-center">
                <CalendarDays className="size-5 text-green-primary" />
              </div>
              {value ? (
                <span className="text-foreground font-medium">
                  {formatDisplayDate(value)}
                </span>
              ) : (
                <span className="text-muted-foreground">{placeholder}</span>
              )}
            </div>
            {value && (
              <span
                role="button"
                tabIndex={0}
                onClick={handleClear}
                onKeyDown={(e) => e.key === "Enter" && handleClear(e)}
                className="size-7 rounded-lg bg-gray-200 dark:bg-[#252a3d] hover:bg-red-500/20 flex items-center justify-center transition-colors group cursor-pointer"
              >
                <X className="size-4 text-muted-foreground group-hover:text-red-500" />
              </span>
            )}
          </div>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0 bg-background dark:bg-[#12141c] border-border"
          align="start"
        >
          {/* Year/Month Navigation */}
          <div className="p-3 border-b border-border">
            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={goToPreviousMonth}
                className="size-8 rounded-lg bg-gray-100 dark:bg-[#1a1d2e] hover:bg-gray-200 dark:hover:bg-[#252a3d] flex items-center justify-center transition-colors"
              >
                <ChevronLeft className="size-4 text-foreground" />
              </button>

              <div className="flex items-center gap-2">
                <select
                  value={viewDate.getMonth()}
                  onChange={(e) => handleMonthChange(parseInt(e.target.value))}
                  className="h-8 px-2 rounded-lg bg-gray-100 dark:bg-[#1a1d2e] border-0 text-sm text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-green-primary/50 cursor-pointer"
                >
                  {months.map((month, index) => (
                    <option key={month} value={index}>
                      {month}
                    </option>
                  ))}
                </select>

                <select
                  value={viewDate.getFullYear()}
                  onChange={(e) => handleYearChange(parseInt(e.target.value))}
                  className="h-8 px-2 rounded-lg bg-gray-100 dark:bg-[#1a1d2e] border-0 text-sm text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-green-primary/50 cursor-pointer"
                >
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={goToNextMonth}
                className="size-8 rounded-lg bg-gray-100 dark:bg-[#1a1d2e] hover:bg-gray-200 dark:hover:bg-[#252a3d] flex items-center justify-center transition-colors"
              >
                <ChevronRight className="size-4 text-foreground" />
              </button>
            </div>
          </div>

          {/* Calendar */}
          <CalendarComponent
            mode="single"
            selected={selectedDate}
            onSelect={handleSelect}
            month={viewDate}
            onMonthChange={setViewDate}
            initialFocus
            className="rounded-xl"
            classNames={{
              nav: "hidden",
              caption: "hidden",
            }}
          />
        </PopoverContent>
      </Popover>
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}
