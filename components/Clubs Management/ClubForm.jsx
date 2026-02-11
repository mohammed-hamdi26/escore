"use client";
import { useState } from "react";
import { useFormik } from "formik";
import {
  Building2,
  Calendar,
  ArrowLeft,
  Save,
  Globe,
  Loader2,
  MapPin,
  FileText,
  Image as ImageIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import * as yup from "yup";
import { Button } from "../ui/button";
import FormSection from "../ui app/FormSection";
import FormRow from "../ui app/FormRow";
import ImageUpload from "../ui app/ImageUpload";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover";
import { Calendar as CalendarComponent } from "../ui/calendar";

const validationSchema = yup.object({
  name: yup.string().required("nameRequired").max(100, "nameTooLong"),
  shortName: yup.string().max(50, "shortNameTooLong"),
  description: yup.string().max(5000, "descriptionTooLong"),
  country: yup.string(),
  region: yup.string(),
  founded: yup.string(),
  websiteUrl: yup.string().url("invalidUrl"),
  logoLight: yup.string(),
  logoDark: yup.string(),
  coverImageLight: yup.string(),
  coverImageDark: yup.string(),
});

const REGION_OPTIONS = [
  { value: "Middle East", label: "Middle East" },
  { value: "Europe", label: "Europe" },
  { value: "North America", label: "North America" },
  { value: "South America", label: "South America" },
  { value: "Asia", label: "Asia" },
  { value: "CIS", label: "CIS" },
  { value: "Oceania", label: "Oceania" },
];

function ClubForm({ formType = "add", submit, club }) {
  const t = useTranslations("clubForm");
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatDateToLocal = (dateInput) => {
    if (!dateInput) return "";
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return "";
    return date.toISOString().split("T")[0];
  };

  const formik = useFormik({
    initialValues: {
      name: club?.name || "",
      shortName: club?.shortName || "",
      slug: club?.slug || "",
      description: club?.description || "",
      country: club?.country?.name || "",
      countryCode: club?.country?.code || "",
      region: club?.region || "",
      founded: formatDateToLocal(club?.founded),
      websiteUrl: club?.websiteUrl || "",
      logoLight: club?.logo?.light || "",
      logoDark: club?.logo?.dark || "",
      coverImageLight: club?.coverImage?.light || "",
      coverImageDark: club?.coverImage?.dark || "",
    },
    validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        let dataValues = club ? { id: club.id, ...values } : values;

        dataValues = {
          ...dataValues,
          slug: dataValues.slug || dataValues.name.replace(/\s+/g, "-").toLowerCase(),
          logo: {
            light: dataValues.logoLight,
            dark: dataValues.logoDark,
          },
          coverImage: {
            light: dataValues.coverImageLight,
            dark: dataValues.coverImageDark,
          },
          country: dataValues.country
            ? {
                name: dataValues.country,
                code: dataValues.countryCode || "",
              }
            : undefined,
          founded: dataValues.founded
            ? new Date(dataValues.founded).toISOString()
            : undefined,
        };

        // Remove flat image fields
        delete dataValues.logoLight;
        delete dataValues.logoDark;
        delete dataValues.coverImageLight;
        delete dataValues.coverImageDark;
        delete dataValues.countryCode;

        await submit(dataValues);
        toast.success(
          formType === "add"
            ? t("createSuccess") || "Club created successfully"
            : t("updateSuccess") || "Club updated successfully"
        );
      } catch (error) {
        toast.error(error.message || t("error") || "Something went wrong");
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="size-10 rounded-xl"
          >
            <ArrowLeft className="size-5 rtl:rotate-180" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {formType === "add"
                ? t("addTitle") || "Add Club"
                : t("editTitle") || "Edit Club"}
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {formType === "add"
                ? t("addSubtitle") || "Create a new club organization"
                : t("editSubtitle") || "Update club information"}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={formik.handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <FormSection
          icon={<Building2 className="size-5" />}
          title={t("basicInfo") || "Basic Information"}
        >
          <FormRow>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                {t("name") || "Club Name"}{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder={t("namePlaceholder") || "Enter club name"}
                className="w-full h-10 px-3 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-[#1a1d2e] text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-green-primary/50"
              />
              {formik.touched.name && formik.errors.name && (
                <p className="text-xs text-red-500">
                  {t(formik.errors.name) || formik.errors.name}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                {t("shortName") || "Short Name"}
              </label>
              <input
                type="text"
                name="shortName"
                value={formik.values.shortName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder={t("shortNamePlaceholder") || "e.g. TL, C9"}
                className="w-full h-10 px-3 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-[#1a1d2e] text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-green-primary/50"
              />
            </div>
          </FormRow>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              {t("description") || "Description"}
            </label>
            <textarea
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder={
                t("descriptionPlaceholder") || "Enter club description"
              }
              rows={4}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-[#1a1d2e] text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-green-primary/50 resize-none"
            />
          </div>
        </FormSection>

        {/* Images */}
        <FormSection
          icon={<ImageIcon className="size-5" />}
          title={t("images") || "Images"}
        >
          <FormRow>
            <ImageUpload
              label={t("logoLight") || "Logo (Light)"}
              value={formik.values.logoLight}
              onChange={(url) => formik.setFieldValue("logoLight", url)}
            />
            <ImageUpload
              label={t("logoDark") || "Logo (Dark)"}
              value={formik.values.logoDark}
              onChange={(url) => formik.setFieldValue("logoDark", url)}
            />
          </FormRow>
          <FormRow>
            <ImageUpload
              label={t("coverLight") || "Cover (Light)"}
              value={formik.values.coverImageLight}
              onChange={(url) => formik.setFieldValue("coverImageLight", url)}
            />
            <ImageUpload
              label={t("coverDark") || "Cover (Dark)"}
              value={formik.values.coverImageDark}
              onChange={(url) => formik.setFieldValue("coverImageDark", url)}
            />
          </FormRow>
        </FormSection>

        {/* Details */}
        <FormSection
          icon={<Globe className="size-5" />}
          title={t("details") || "Details"}
        >
          <FormRow>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                {t("country") || "Country"}
              </label>
              <input
                type="text"
                name="country"
                value={formik.values.country}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder={t("countryPlaceholder") || "e.g. Saudi Arabia"}
                className="w-full h-10 px-3 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-[#1a1d2e] text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-green-primary/50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                {t("countryCode") || "Country Code"}
              </label>
              <input
                type="text"
                name="countryCode"
                value={formik.values.countryCode}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder={t("countryCodePlaceholder") || "e.g. SA, US"}
                maxLength={3}
                className="w-full h-10 px-3 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-[#1a1d2e] text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-green-primary/50"
              />
            </div>
          </FormRow>
          <FormRow>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                {t("region") || "Region"}
              </label>
              <select
                name="region"
                value={formik.values.region}
                onChange={formik.handleChange}
                className="w-full h-10 px-3 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-[#1a1d2e] text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-green-primary/50"
              >
                <option value="">
                  {t("selectRegion") || "Select Region"}
                </option>
                {REGION_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                {t("founded") || "Founded"}
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="w-full h-10 px-3 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-[#1a1d2e] text-foreground text-sm text-left rtl:text-right flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-green-primary/50"
                  >
                    <span
                      className={
                        formik.values.founded ? "" : "text-muted-foreground"
                      }
                    >
                      {formik.values.founded ||
                        t("selectDate") ||
                        "Select date"}
                    </span>
                    <Calendar className="size-4 text-muted-foreground" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={
                      formik.values.founded
                        ? new Date(formik.values.founded)
                        : undefined
                    }
                    onSelect={(date) => {
                      if (date) {
                        formik.setFieldValue(
                          "founded",
                          date.toISOString().split("T")[0]
                        );
                      }
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </FormRow>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              {t("websiteUrl") || "Website URL"}
            </label>
            <input
              type="url"
              name="websiteUrl"
              value={formik.values.websiteUrl}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder={
                t("websiteUrlPlaceholder") || "https://example.com"
              }
              className="w-full h-10 px-3 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-[#1a1d2e] text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-green-primary/50"
            />
            {formik.touched.websiteUrl && formik.errors.websiteUrl && (
              <p className="text-xs text-red-500">
                {t(formik.errors.websiteUrl) || formik.errors.websiteUrl}
              </p>
            )}
          </div>
        </FormSection>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            {t("cancel") || "Cancel"}
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || !formik.isValid}
            className="bg-green-primary hover:bg-green-primary/80 gap-2 min-w-[120px]"
          >
            {isSubmitting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Save className="size-4" />
            )}
            {formType === "add"
              ? t("create") || "Create Club"
              : t("save") || "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default ClubForm;
