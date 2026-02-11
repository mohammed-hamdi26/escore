"use client";

import { useState } from "react";
import { useFormik } from "formik";
import {
  CalendarDays,
  ArrowLeft,
  Save,
  Globe,
  Loader2,
  MapPin,
  FileText,
  Image as ImageIcon,
  DollarSign,
  Trophy,
  Clock,
  Link as LinkIcon,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import * as yup from "yup";
import FormSection from "../ui app/FormSection";
import FormRow from "../ui app/FormRow";
import ImageUpload from "../ui app/ImageUpload";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar as CalendarComponent } from "../ui/calendar";
import { Button } from "../ui/button";

const validationSchema = yup.object({
  name: yup.string().required("nameRequired").max(200, "nameTooLong"),
  description: yup.string().max(5000, "descriptionTooLong"),
  country: yup.string(),
  location: yup.string().max(200),
  startDate: yup.string().required("startDateRequired"),
  endDate: yup.string().required("endDateRequired"),
  prizePool: yup.number().min(0).nullable(),
  websiteUrl: yup.string().url("invalidUrl"),
  streamUrl: yup.string().url("invalidUrl"),
});

const STATUS_OPTIONS = ["upcoming", "ongoing", "completed", "cancelled"];

function formatDateToLocal(date) {
  if (!date) return "";
  const d = new Date(date);
  return d.toISOString().split("T")[0];
}

function EventForm({ event, submit, formType = "add" }) {
  const t = useTranslations("eventForm");
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showChampionship, setShowChampionship] = useState(
    event?.clubChampionship?.enabled || false
  );

  const defaultPoints = [
    { place: 1, points: 1000 },
    { place: 2, points: 750 },
    { place: 3, points: 500 },
    { place: 4, points: 300 },
    { place: 5, points: 200 },
    { place: 6, points: 150 },
    { place: 7, points: 100 },
    { place: 8, points: 50 },
  ];

  const formik = useFormik({
    initialValues: {
      name: event?.name || "",
      slug: event?.slug || "",
      description: event?.description || "",
      country: event?.country?.name || "",
      countryCode: event?.country?.code || "",
      location: event?.location || "",
      isOnline: event?.isOnline || false,
      startDate: formatDateToLocal(event?.startDate),
      endDate: formatDateToLocal(event?.endDate),
      status: event?.status || "upcoming",
      prizePool: event?.prizePool || "",
      currency: event?.currency || "USD",
      rosterLockDate: formatDateToLocal(event?.rosterLockDate),
      websiteUrl: event?.websiteUrl || "",
      streamUrl: event?.streamUrl || "",
      logoLight: event?.logo?.light || "",
      logoDark: event?.logo?.dark || "",
      coverImageLight: event?.coverImage?.light || "",
      coverImageDark: event?.coverImage?.dark || "",
      championshipEnabled: event?.clubChampionship?.enabled || false,
      championshipPrizePool: event?.clubChampionship?.prizePool || "",
      pointsDistribution:
        event?.clubChampionship?.pointsDistribution || defaultPoints,
      minTop8: event?.clubChampionship?.eligibility?.minTop8 || 2,
      mustWinOne: event?.clubChampionship?.eligibility?.mustWinOne ?? true,
      isFeatured: event?.isFeatured || false,
    },
    validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        let dataValues = event ? { id: event.id, ...values } : values;

        dataValues = {
          ...dataValues,
          slug:
            dataValues.slug ||
            dataValues.name.replace(/\s+/g, "-").toLowerCase(),
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
          startDate: dataValues.startDate
            ? new Date(dataValues.startDate).toISOString()
            : undefined,
          endDate: dataValues.endDate
            ? new Date(dataValues.endDate).toISOString()
            : undefined,
          rosterLockDate: dataValues.rosterLockDate
            ? new Date(dataValues.rosterLockDate).toISOString()
            : undefined,
          prizePool: dataValues.prizePool
            ? Number(dataValues.prizePool)
            : undefined,
          clubChampionship: {
            enabled: dataValues.championshipEnabled,
            prizePool: dataValues.championshipPrizePool
              ? Number(dataValues.championshipPrizePool)
              : undefined,
            pointsDistribution: dataValues.championshipEnabled
              ? dataValues.pointsDistribution
              : undefined,
            eligibility: dataValues.championshipEnabled
              ? {
                  minTop8: Number(dataValues.minTop8),
                  mustWinOne: dataValues.mustWinOne,
                }
              : undefined,
          },
        };

        // Remove flat fields
        delete dataValues.logoLight;
        delete dataValues.logoDark;
        delete dataValues.coverImageLight;
        delete dataValues.coverImageDark;
        delete dataValues.countryCode;
        delete dataValues.championshipEnabled;
        delete dataValues.championshipPrizePool;
        delete dataValues.pointsDistribution;
        delete dataValues.minTop8;
        delete dataValues.mustWinOne;

        await submit(dataValues);
        toast.success(
          formType === "add"
            ? t("createSuccess") || "Event created successfully"
            : t("updateSuccess") || "Event updated successfully"
        );
      } catch (error) {
        toast.error(error.message || t("error") || "Something went wrong");
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const handlePointsChange = (index, field, value) => {
    const updated = [...formik.values.pointsDistribution];
    updated[index] = { ...updated[index], [field]: Number(value) };
    formik.setFieldValue("pointsDistribution", updated);
  };

  const addPointsRow = () => {
    const current = formik.values.pointsDistribution;
    const nextPlace = current.length > 0 ? current[current.length - 1].place + 1 : 1;
    formik.setFieldValue("pointsDistribution", [
      ...current,
      { place: nextPlace, points: 0 },
    ]);
  };

  const removePointsRow = (index) => {
    const current = [...formik.values.pointsDistribution];
    current.splice(index, 1);
    formik.setFieldValue("pointsDistribution", current);
  };

  const inputClass =
    "w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-[#1a1d2e] text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-green-primary/50";

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors cursor-pointer"
        >
          <ArrowLeft className="size-5 text-muted-foreground rtl:rotate-180" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {formType === "add"
              ? t("addTitle") || "Add Event"
              : t("editTitle") || "Edit Event"}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {formType === "add"
              ? t("addSubtitle") || "Create a new event"
              : t("editSubtitle") || "Update event information"}
          </p>
        </div>
      </div>

      <form onSubmit={formik.handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <FormSection
          title={t("basicInfo") || "Basic Information"}
          icon={<CalendarDays className="size-5" />}
        >
          <FormRow>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                {t("name") || "Event Name"}{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder={t("namePlaceholder") || "Enter event name"}
                className={inputClass}
              />
              {formik.touched.name && formik.errors.name && (
                <p className="text-xs text-red-500">
                  {t(formik.errors.name) || formik.errors.name}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                {t("status") || "Status"}
              </label>
              <select
                name="status"
                value={formik.values.status}
                onChange={formik.handleChange}
                className={inputClass}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {t(s) || s}
                  </option>
                ))}
              </select>
            </div>
          </FormRow>
          <FormRow>
            <div className="col-span-2 space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                {t("description") || "Description"}
              </label>
              <textarea
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder={t("descriptionPlaceholder") || "Enter description"}
                rows={3}
                className={inputClass}
              />
            </div>
          </FormRow>
          <FormRow>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                {t("country") || "Country"}
              </label>
              <input
                type="text"
                name="country"
                value={formik.values.country}
                onChange={formik.handleChange}
                placeholder={t("countryPlaceholder") || "e.g. Saudi Arabia"}
                className={inputClass}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                {t("countryCode") || "Country Code"}
              </label>
              <input
                type="text"
                name="countryCode"
                value={formik.values.countryCode}
                onChange={formik.handleChange}
                placeholder={t("countryCodePlaceholder") || "e.g. SA, US"}
                className={inputClass}
              />
            </div>
          </FormRow>
          <FormRow>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                {t("location") || "Location"}
              </label>
              <input
                type="text"
                name="location"
                value={formik.values.location}
                onChange={formik.handleChange}
                placeholder={t("locationPlaceholder") || "e.g. Riyadh, Saudi Arabia"}
                className={inputClass}
              />
            </div>
            <div className="space-y-1.5 flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isOnline"
                  checked={formik.values.isOnline}
                  onChange={formik.handleChange}
                  className="rounded border-gray-300 text-green-primary focus:ring-green-primary"
                />
                <span className="text-sm font-medium text-foreground">
                  {t("isOnline") || "Online Event"}
                </span>
              </label>
            </div>
          </FormRow>
          <FormRow>
            <div className="space-y-1.5 flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={formik.values.isFeatured}
                  onChange={formik.handleChange}
                  className="rounded border-gray-300 text-green-primary focus:ring-green-primary"
                />
                <span className="text-sm font-medium text-foreground">
                  {t("isFeatured") || "Featured Event"}
                </span>
              </label>
            </div>
          </FormRow>
        </FormSection>

        {/* Images */}
        <FormSection
          title={t("images") || "Images"}
          icon={<ImageIcon className="size-5" />}
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
              onChange={(url) =>
                formik.setFieldValue("coverImageLight", url)
              }
            />
            <ImageUpload
              label={t("coverDark") || "Cover (Dark)"}
              value={formik.values.coverImageDark}
              onChange={(url) =>
                formik.setFieldValue("coverImageDark", url)
              }
            />
          </FormRow>
        </FormSection>

        {/* Dates */}
        <FormSection
          title={t("dates") || "Dates"}
          icon={<Clock className="size-5" />}
        >
          <FormRow>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                {t("startDate") || "Start Date"}{" "}
                <span className="text-red-500">*</span>
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className={`${inputClass} text-left flex items-center justify-between cursor-pointer`}
                  >
                    <span
                      className={
                        formik.values.startDate
                          ? "text-foreground"
                          : "text-muted-foreground"
                      }
                    >
                      {formik.values.startDate ||
                        (t("selectDate") || "Select date")}
                    </span>
                    <CalendarDays className="size-4 text-muted-foreground" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={
                      formik.values.startDate
                        ? new Date(formik.values.startDate)
                        : undefined
                    }
                    onSelect={(date) => {
                      if (date) {
                        formik.setFieldValue(
                          "startDate",
                          formatDateToLocal(date)
                        );
                      }
                    }}
                  />
                </PopoverContent>
              </Popover>
              {formik.touched.startDate && formik.errors.startDate && (
                <p className="text-xs text-red-500">
                  {t(formik.errors.startDate) || formik.errors.startDate}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                {t("endDate") || "End Date"}{" "}
                <span className="text-red-500">*</span>
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className={`${inputClass} text-left flex items-center justify-between cursor-pointer`}
                  >
                    <span
                      className={
                        formik.values.endDate
                          ? "text-foreground"
                          : "text-muted-foreground"
                      }
                    >
                      {formik.values.endDate ||
                        (t("selectDate") || "Select date")}
                    </span>
                    <CalendarDays className="size-4 text-muted-foreground" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={
                      formik.values.endDate
                        ? new Date(formik.values.endDate)
                        : undefined
                    }
                    onSelect={(date) => {
                      if (date) {
                        formik.setFieldValue(
                          "endDate",
                          formatDateToLocal(date)
                        );
                      }
                    }}
                  />
                </PopoverContent>
              </Popover>
              {formik.touched.endDate && formik.errors.endDate && (
                <p className="text-xs text-red-500">
                  {t(formik.errors.endDate) || formik.errors.endDate}
                </p>
              )}
            </div>
          </FormRow>
          <FormRow>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                {t("rosterLockDate") || "Roster Lock Date"}
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className={`${inputClass} text-left flex items-center justify-between cursor-pointer`}
                  >
                    <span
                      className={
                        formik.values.rosterLockDate
                          ? "text-foreground"
                          : "text-muted-foreground"
                      }
                    >
                      {formik.values.rosterLockDate ||
                        (t("selectDate") || "Select date")}
                    </span>
                    <CalendarDays className="size-4 text-muted-foreground" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={
                      formik.values.rosterLockDate
                        ? new Date(formik.values.rosterLockDate)
                        : undefined
                    }
                    onSelect={(date) => {
                      if (date) {
                        formik.setFieldValue(
                          "rosterLockDate",
                          formatDateToLocal(date)
                        );
                      }
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </FormRow>
        </FormSection>

        {/* Prize Pool */}
        <FormSection
          title={t("prizePoolSection") || "Prize Pool"}
          icon={<DollarSign className="size-5" />}
        >
          <FormRow>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                {t("prizePool") || "Total Prize Pool"}
              </label>
              <input
                type="number"
                name="prizePool"
                value={formik.values.prizePool}
                onChange={formik.handleChange}
                placeholder="0"
                min="0"
                className={inputClass}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                {t("currency") || "Currency"}
              </label>
              <input
                type="text"
                name="currency"
                value={formik.values.currency}
                onChange={formik.handleChange}
                placeholder="USD"
                className={inputClass}
              />
            </div>
          </FormRow>
        </FormSection>

        {/* Club Championship */}
        <FormSection
          title={t("clubChampionship") || "Club Championship"}
          icon={<Trophy className="size-5" />}
        >
          <div className="space-y-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="championshipEnabled"
                checked={formik.values.championshipEnabled}
                onChange={(e) => {
                  formik.handleChange(e);
                  setShowChampionship(e.target.checked);
                }}
                className="rounded border-gray-300 text-green-primary focus:ring-green-primary"
              />
              <span className="text-sm font-medium text-foreground">
                {t("enabled") || "Enable Club Championship"}
              </span>
            </label>

            {showChampionship && (
              <div className="space-y-4 pl-6 border-l-2 border-green-primary/20">
                {/* Championship Prize Pool */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">
                    {t("championshipPrizePool") || "Championship Prize Pool"}
                  </label>
                  <input
                    type="number"
                    name="championshipPrizePool"
                    value={formik.values.championshipPrizePool}
                    onChange={formik.handleChange}
                    placeholder="0"
                    min="0"
                    className={inputClass}
                  />
                </div>

                {/* Points Distribution */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    {t("pointsDistribution") || "Points Distribution"}
                  </label>
                  <div className="space-y-2">
                    {formik.values.pointsDistribution.map((row, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className="flex items-center gap-2 flex-1">
                          <span className="text-xs text-muted-foreground w-8 text-center">
                            #{row.place}
                          </span>
                          <input
                            type="number"
                            value={row.points}
                            onChange={(e) =>
                              handlePointsChange(idx, "points", e.target.value)
                            }
                            min="0"
                            placeholder={t("points") || "Points"}
                            className={`${inputClass} flex-1`}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removePointsRow(idx)}
                          className="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addPointsRow}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-green-primary hover:bg-green-primary/10 transition-colors cursor-pointer"
                    >
                      <Plus className="size-3.5" />
                      {t("addPlace") || "Add Place"}
                    </button>
                  </div>
                </div>

                {/* Eligibility */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-foreground">
                    {t("eligibility") || "Eligibility Rules"}
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs text-muted-foreground">
                        {t("minTop8") || "Min Top 8 Placements"}
                      </label>
                      <input
                        type="number"
                        name="minTop8"
                        value={formik.values.minTop8}
                        onChange={formik.handleChange}
                        min="1"
                        className={inputClass}
                      />
                    </div>
                    <div className="space-y-1.5 flex items-end">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          name="mustWinOne"
                          checked={formik.values.mustWinOne}
                          onChange={formik.handleChange}
                          className="rounded border-gray-300 text-green-primary focus:ring-green-primary"
                        />
                        <span className="text-sm text-foreground">
                          {t("mustWinOne") || "Must Win at Least One"}
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </FormSection>

        {/* Links */}
        <FormSection
          title={t("links") || "Links"}
          icon={<LinkIcon className="size-5" />}
        >
          <FormRow>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                {t("websiteUrl") || "Website URL"}
              </label>
              <input
                type="url"
                name="websiteUrl"
                value={formik.values.websiteUrl}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="https://example.com"
                className={inputClass}
              />
              {formik.touched.websiteUrl && formik.errors.websiteUrl && (
                <p className="text-xs text-red-500">
                  {t(formik.errors.websiteUrl) || formik.errors.websiteUrl}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                {t("streamUrl") || "Stream URL"}
              </label>
              <input
                type="url"
                name="streamUrl"
                value={formik.values.streamUrl}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="https://twitch.tv/..."
                className={inputClass}
              />
              {formik.touched.streamUrl && formik.errors.streamUrl && (
                <p className="text-xs text-red-500">
                  {t(formik.errors.streamUrl) || formik.errors.streamUrl}
                </p>
              )}
            </div>
          </FormRow>
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
            disabled={isSubmitting}
            className="bg-green-primary hover:bg-green-600 text-white"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin mr-2" />
                {t("saving") || "Saving..."}
              </>
            ) : (
              <>
                <Save className="size-4 mr-2" />
                {formType === "add"
                  ? t("create") || "Create Event"
                  : t("save") || "Save Changes"}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default EventForm;
