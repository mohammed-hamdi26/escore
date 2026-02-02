"use client";
import { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Button } from "../ui/button";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";
import { mappedArrayToSelectOptions } from "@/app/[locale]/_Lib/helps";
import FormSection from "../ui app/FormSection";
import FormRow from "../ui app/FormRow";
import ImageUpload from "../ui app/ImageUpload";
import { Calendar as CalendarComponent } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Trophy,
  Calendar,
  MapPin,
  Coins,
  Gamepad2,
  Image as ImageIcon,
  Save,
  Loader2,
  Star,
  CalendarDays,
  X,
} from "lucide-react";

const validateSchema = yup.object({
  name: yup.string().required("Tournament name is required"),
  organizer: yup.string().required("Organizer is required"),
  startDate: yup
    .date()
    .typeError("Invalid start date")
    .required("Start date is required"),
  endDate: yup
    .date()
    .typeError("Invalid end date")
    .required("End date is required"),
  location: yup.string().required("Location is required"),
  prizePool: yup
    .number()
    .min(0, "Prize pool must be positive")
    .required("Prize pool is required"),
  status: yup
    .string()
    .oneOf(["upcoming", "ongoing", "completed", "cancelled"], "Invalid status")
    .required("Status is required"),
  logoLight: yup.string().required("Logo is required"),
  gamesData: yup
    .array()
    .test("games", "At least one game is required", (value) => value && value.length > 0),
  knockoutImageLight: yup.string().required("Bracket image is required"),
});

export default function TournamentsForm({
  tournament,
  submit,
  formType = "add",
  countries = [],
  gameOptions = [],
}) {
  const t = useTranslations("TournamentForm");

  const formik = useFormik({
    initialValues: {
      name: tournament?.name || "",
      organizer: tournament?.organizer || "",
      startDate: tournament?.startDate ? new Date(tournament.startDate).toISOString().split("T")[0] : "",
      endDate: tournament?.endDate ? new Date(tournament.endDate).toISOString().split("T")[0] : "",
      location: tournament?.location || "",
      prizePool: tournament?.prizePool || "",
      status: tournament?.status || "upcoming",
      logoLight: tournament?.logo?.light || "",
      logoDark: tournament?.logo?.dark || "",
      country: tournament?.country?.name || "",
      gamesData: tournament?.games || [],
      knockoutImageLight: tournament?.bracketImage?.light || "",
      knockoutImageDark: tournament?.bracketImage?.dark || "",
      tier: tournament?.tier || "B",
      isFeatured: tournament?.isFeatured || false,
    },
    validationSchema: validateSchema,
    onSubmit: async (values) => {
      try {
        let dataValues = tournament ? { id: tournament.id, ...values } : values;

        const selectedCountry = countries.find((c) => c.label === dataValues.country);
        dataValues.country = selectedCountry
          ? {
              name: selectedCountry.label,
              code: selectedCountry.value,
              flag: `https://flagcdn.com/w80/${selectedCountry.value.toLowerCase()}.png`,
            }
          : null;

        dataValues.logo = {
          light: dataValues.logoLight,
          dark: dataValues.logoDark || dataValues.logoLight,
        };
        dataValues.bracketImage = {
          light: dataValues.knockoutImageLight,
          dark: dataValues.knockoutImageDark || dataValues.knockoutImageLight,
        };

        dataValues.slug = dataValues?.name.replace(/\s+/g, "-").toLowerCase();
        dataValues.games = dataValues?.gamesData.map((g) => g.id || g.value || g);

        await submit(dataValues);
        formType === "add" && formik.resetForm();
        toast.success(
          formType === "add"
            ? t("The Tournament Added")
            : t("The Tournament Edited")
        );
      } catch (error) {
        toast.error(error.message);
      }
    },
  });

  const statusOptions = [
    { value: "upcoming", label: t("Upcoming") },
    { value: "ongoing", label: t("Ongoing") },
    { value: "completed", label: t("Completed") },
    { value: "cancelled", label: t("Cancelled") },
  ];

  const tierOptions = [
    { value: "S", label: "S-Tier" },
    { value: "A", label: "A-Tier" },
    { value: "B", label: "B-Tier" },
  ];

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <FormSection title={t("Basic Information")} icon={<Trophy className="size-5" />}>
        <FormRow cols={2}>
          <InputField
            label={t("Name")}
            name="name"
            placeholder={t("Enter Name of Tournament")}
            formik={formik}
          />
          <InputField
            label={t("Organizer")}
            name="organizer"
            placeholder={t("Enter Name of Organizer")}
            formik={formik}
          />
        </FormRow>

        <FormRow cols={3}>
          <InputField
            label={t("location")}
            name="location"
            placeholder={t("Enter Location")}
            formik={formik}
          />
          <SelectField
            label={t("Status")}
            name="status"
            options={statusOptions}
            formik={formik}
          />
          <SelectField
            label={t("Country")}
            name="country"
            options={countries}
            formik={formik}
            placeholder={t("Select Country")}
          />
        </FormRow>

        <FormRow cols={3}>
          <SelectField
            label={t("Tier")}
            name="tier"
            options={tierOptions}
            formik={formik}
          />
          <PrizePoolField
            label={t("Prize Pool")}
            name="prizePool"
            formik={formik}
          />
          <FeaturedToggle
            label={t("Featured")}
            name="isFeatured"
            formik={formik}
          />
        </FormRow>
      </FormSection>

      {/* Date & Time */}
      <FormSection title={t("Schedule")} icon={<Calendar className="size-5" />}>
        <FormRow cols={2}>
          <DatePickerField
            label={t("Start Date")}
            name="startDate"
            formik={formik}
            placeholder={t("Select start date")}
          />
          <DatePickerField
            label={t("End Date")}
            name="endDate"
            formik={formik}
            placeholder={t("Select end date")}
            minDate={formik.values.startDate}
          />
        </FormRow>
      </FormSection>

      {/* Games */}
      <FormSection title={t("Games")} icon={<Gamepad2 className="size-5" />}>
        <MultiSelectField
          label={t("Select Games")}
          name="gamesData"
          options={gameOptions}
          formik={formik}
        />
      </FormSection>

      {/* Images */}
      <FormSection title={t("Images")} icon={<ImageIcon className="size-5" />}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-foreground">{t("Tournament Logo")}</h4>
            <div className="grid grid-cols-2 gap-4">
              <ImageUpload
                label={t("Light Mode")}
                name="logoLight"
                formik={formik}
                aspectRatio="square"
              />
              <ImageUpload
                label={t("Dark Mode")}
                name="logoDark"
                formik={formik}
                aspectRatio="square"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-medium text-foreground">{t("Bracket Image")}</h4>
            <div className="grid grid-cols-2 gap-4">
              <ImageUpload
                label={t("Light Mode")}
                name="knockoutImageLight"
                formik={formik}
                aspectRatio="landscape"
              />
              <ImageUpload
                label={t("Dark Mode")}
                name="knockoutImageDark"
                formik={formik}
                aspectRatio="landscape"
              />
            </div>
          </div>
        </div>
      </FormSection>

      {/* Submit Button */}
      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="ghost"
          onClick={() => formik.resetForm()}
          className="h-11 px-6 rounded-xl"
        >
          {t("Reset")}
        </Button>
        <Button
          disabled={!formik.isValid || formik.isSubmitting}
          type="submit"
          className="h-11 px-8 rounded-xl bg-green-primary hover:bg-green-primary/90 text-white font-medium disabled:opacity-50"
        >
          {formik.isSubmitting ? (
            <>
              <Loader2 className="size-4 mr-2 animate-spin" />
              {formType === "add" ? t("Adding...") : t("Saving...")}
            </>
          ) : (
            <>
              <Save className="size-4 mr-2 rtl:mr-0 rtl:ml-2" />
              {formType === "add" ? t("Add Tournament") : t("Save Changes")}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

// Reusable Input Field Component
function InputField({ label, name, type = "text", placeholder, formik, icon, ...props }) {
  const error = formik.touched[name] && formik.errors[name];

  return (
    <div className="flex-1 space-y-2">
      <label className="text-sm font-medium text-muted-foreground">{label}</label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2">
            {icon}
          </div>
        )}
        <input
          type={type}
          name={name}
          value={formik.values[name]}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder={placeholder}
          className={`w-full h-11 px-4 ${icon ? "pl-10 rtl:pl-4 rtl:pr-10" : ""} rounded-xl bg-muted/50 dark:bg-[#1a1d2e] border-0 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-green-primary/50 transition-all ${
            error ? "ring-2 ring-red-500" : ""
          }`}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

// Reusable Select Field Component
function SelectField({ label, name, options, formik, placeholder }) {
  const error = formik.touched[name] && formik.errors[name];

  return (
    <div className="flex-1 space-y-2">
      <label className="text-sm font-medium text-muted-foreground">{label}</label>
      <select
        name={name}
        value={formik.values[name]}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        className={`w-full h-11 px-4 rounded-xl bg-muted/50 dark:bg-[#1a1d2e] border-0 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-green-primary/50 cursor-pointer transition-all ${
          error ? "ring-2 ring-red-500" : ""
        }`}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value || opt.label} value={opt.value || opt.label}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

// Multi-Select Field for Games
function MultiSelectField({ label, name, options, formik }) {
  const selectedIds = formik.values[name]?.map((g) => g.id || g.value || g) || [];
  const error = formik.touched[name] && formik.errors[name];

  const toggleGame = (game) => {
    const gameId = game.id || game.value;
    const isSelected = selectedIds.includes(gameId);

    if (isSelected) {
      formik.setFieldValue(
        name,
        formik.values[name].filter((g) => (g.id || g.value || g) !== gameId)
      );
    } else {
      formik.setFieldValue(name, [...formik.values[name], { id: gameId, name: game.name || game.label }]);
    }
    formik.setFieldTouched(name, true);
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-muted-foreground">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map((game) => {
          const gameId = game.id || game.value;
          const isSelected = selectedIds.includes(gameId);

          return (
            <button
              key={gameId}
              type="button"
              onClick={() => toggleGame(game)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                isSelected
                  ? "bg-green-primary text-white"
                  : "bg-muted/50 dark:bg-[#1a1d2e] text-foreground hover:bg-muted dark:hover:bg-[#252a3d]"
              }`}
            >
              {game.name || game.label}
            </button>
          );
        })}
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

// Enhanced Date Picker Field with Calendar Popup
function DatePickerField({ label, name, formik, placeholder, minDate }) {
  const [isOpen, setIsOpen] = useState(false);
  const error = formik.touched[name] && formik.errors[name];
  const value = formik.values[name];

  const selectedDate = value ? new Date(value) : undefined;
  const minDateObj = minDate ? new Date(minDate) : undefined;

  const formatDisplayDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
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

  return (
    <div className="flex-1 space-y-2">
      <label className="text-sm font-medium text-muted-foreground">{label}</label>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={`w-full h-12 px-4 rounded-xl bg-muted/50 dark:bg-[#1a1d2e] border border-transparent text-sm text-left rtl:text-right focus:outline-none focus:ring-2 focus:ring-green-primary/50 focus:border-green-primary/30 cursor-pointer transition-all hover:bg-muted dark:hover:bg-[#252a3d] flex items-center justify-between gap-2 ${
              error ? "ring-2 ring-red-500 border-red-500" : ""
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-lg bg-green-primary/10 flex items-center justify-center">
                <CalendarDays className="size-5 text-green-primary" />
              </div>
              {value ? (
                <span className="text-foreground font-medium">{formatDisplayDate(value)}</span>
              ) : (
                <span className="text-muted-foreground">{placeholder}</span>
              )}
            </div>
            {value && (
              <button
                type="button"
                onClick={handleClear}
                className="size-7 rounded-lg bg-muted hover:bg-red-500/20 flex items-center justify-center transition-colors group"
              >
                <X className="size-4 text-muted-foreground group-hover:text-red-500" />
              </button>
            )}
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-background dark:bg-[#12141c] border-border" align="start">
          <CalendarComponent
            mode="single"
            selected={selectedDate}
            onSelect={handleSelect}
            disabled={(date) => minDateObj && date < minDateObj}
            initialFocus
            className="rounded-xl"
          />
        </PopoverContent>
      </Popover>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

// Prize Pool Input Field with formatting (no currency type)
function PrizePoolField({ label, name, formik }) {
  const error = formik.touched[name] && formik.errors[name];
  const value = formik.values[name];

  const formatNumber = (num) => {
    if (!num && num !== 0) return "";
    return new Intl.NumberFormat("en-US").format(num);
  };

  const handleChange = (e) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, "");
    formik.setFieldValue(name, rawValue ? parseInt(rawValue, 10) : "");
  };

  return (
    <div className="flex-1 space-y-2">
      <label className="text-sm font-medium text-muted-foreground">{label}</label>
      <div className="relative">
        <div className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2">
          <Coins className="size-5 text-green-primary" />
        </div>
        <input
          type="text"
          name={name}
          value={formatNumber(value)}
          onChange={handleChange}
          onBlur={formik.handleBlur}
          placeholder="0"
          className={`w-full h-12 pl-11 pr-4 rtl:pl-4 rtl:pr-11 rounded-xl bg-muted/50 dark:bg-[#1a1d2e] border border-transparent text-sm text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-green-primary/50 focus:border-green-primary/30 transition-all ${
            error ? "ring-2 ring-red-500 border-red-500" : ""
          }`}
        />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

// Featured Toggle Component
function FeaturedToggle({ label, name, formik }) {
  const isChecked = formik.values[name];

  return (
    <div className="flex-1 space-y-2">
      <label className="text-sm font-medium text-muted-foreground">{label}</label>
      <button
        type="button"
        onClick={() => formik.setFieldValue(name, !isChecked)}
        className={`w-full h-12 px-4 rounded-xl border transition-all flex items-center justify-between ${
          isChecked
            ? "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/50"
            : "bg-muted/50 dark:bg-[#1a1d2e] border-transparent hover:bg-muted dark:hover:bg-[#252a3d]"
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`size-8 rounded-lg flex items-center justify-center transition-all ${
              isChecked
                ? "bg-gradient-to-br from-yellow-400 to-orange-500"
                : "bg-muted dark:bg-[#252a3d]"
            }`}
          >
            <Star
              className={`size-4 transition-all ${
                isChecked ? "text-white fill-white" : "text-muted-foreground"
              }`}
            />
          </div>
          <span
            className={`text-sm font-medium ${
              isChecked ? "text-yellow-500" : "text-foreground"
            }`}
          >
            {isChecked ? "Featured" : "Not Featured"}
          </span>
        </div>
        <div
          className={`w-11 h-6 rounded-full relative transition-colors ${
            isChecked ? "bg-gradient-to-r from-yellow-400 to-orange-500" : "bg-muted dark:bg-[#252a3d]"
          }`}
        >
          <div
            className={`absolute top-[2px] size-5 rounded-full bg-white shadow-md transition-all ${
              isChecked ? "left-[22px] rtl:left-[2px]" : "left-[2px] rtl:left-[22px]"
            }`}
          />
        </div>
      </button>
    </div>
  );
}
