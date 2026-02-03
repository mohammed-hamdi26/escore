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
  Search,
  ChevronDown,
  Globe,
  Check,
  Clock,
  Play,
  CheckCircle2,
  XCircle,
  Award,
  ChevronLeft,
  ChevronRight,
  Link as LinkIcon,
  Tv,
  FileText,
  Wifi,
  WifiOff,
  Power,
} from "lucide-react";
import Image from "next/image";

// Currency options
const CURRENCY_OPTIONS = [
  { value: "USD", label: "USD - US Dollar", symbol: "$" },
  { value: "EUR", label: "EUR - Euro", symbol: "€" },
  { value: "GBP", label: "GBP - British Pound", symbol: "£" },
  { value: "SAR", label: "SAR - Saudi Riyal", symbol: "﷼" },
  { value: "AED", label: "AED - UAE Dirham", symbol: "د.إ" },
  { value: "EGP", label: "EGP - Egyptian Pound", symbol: "ج.م" },
  { value: "KWD", label: "KWD - Kuwaiti Dinar", symbol: "د.ك" },
  { value: "QAR", label: "QAR - Qatari Riyal", symbol: "﷼" },
  { value: "BHD", label: "BHD - Bahraini Dinar", symbol: "د.ب" },
  { value: "OMR", label: "OMR - Omani Rial", symbol: "ر.ع" },
  { value: "JPY", label: "JPY - Japanese Yen", symbol: "¥" },
  { value: "CNY", label: "CNY - Chinese Yuan", symbol: "¥" },
  { value: "KRW", label: "KRW - Korean Won", symbol: "₩" },
  { value: "TRY", label: "TRY - Turkish Lira", symbol: "₺" },
];

const validateSchema = yup.object({
  name: yup.string().required("Tournament name is required"),
  organizer: yup.string(),
  description: yup.string(),
  startDate: yup
    .date()
    .typeError("Invalid start date")
    .required("Start date is required"),
  endDate: yup
    .date()
    .typeError("Invalid end date")
    .required("End date is required"),
  location: yup.string(),
  prizePool: yup
    .number()
    .min(0, "Prize pool must be positive")
    .nullable(),
  currency: yup.string(),
  gamesData: yup
    .array()
    .test("games", "At least one game is required", (value) => value && value.length > 0),
  streamUrl: yup.string().url("Must be a valid URL").nullable(),
  websiteUrl: yup.string().url("Must be a valid URL").nullable(),
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
      description: tournament?.description || "",
      startDate: tournament?.startDate ? new Date(tournament.startDate).toISOString().split("T")[0] : "",
      endDate: tournament?.endDate ? new Date(tournament.endDate).toISOString().split("T")[0] : "",
      location: tournament?.location || "",
      prizePool: tournament?.prizePool || "",
      currency: tournament?.currency || "USD",
      status: tournament?.status || "upcoming",
      logoLight: tournament?.logo?.light || "",
      logoDark: tournament?.logo?.dark || "",
      country: tournament?.country?.name || "",
      gamesData: tournament?.games || [],
      knockoutImageLight: tournament?.bracketImage?.light || "",
      knockoutImageDark: tournament?.bracketImage?.dark || "",
      tier: tournament?.tier || "",
      format: tournament?.format || "",
      rules: tournament?.rules || "",
      streamUrl: tournament?.streamUrl || "",
      websiteUrl: tournament?.websiteUrl || "",
      isOnline: tournament?.isOnline || false,
      isActive: tournament?.isActive !== undefined ? tournament.isActive : true,
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

        // Build logo object
        dataValues.logo = dataValues.logoLight
          ? {
              light: dataValues.logoLight,
              dark: dataValues.logoDark || dataValues.logoLight,
            }
          : null;

        // Build bracketImage object
        dataValues.bracketImage = dataValues.knockoutImageLight
          ? {
              light: dataValues.knockoutImageLight,
              dark: dataValues.knockoutImageDark || dataValues.knockoutImageLight,
            }
          : null;

        // Convert dates to ISO datetime format for backend
        if (dataValues.startDate) {
          dataValues.startDate = new Date(dataValues.startDate).toISOString();
        }
        if (dataValues.endDate) {
          dataValues.endDate = new Date(dataValues.endDate).toISOString();
        }

        dataValues.slug = dataValues?.name.replace(/\s+/g, "-").toLowerCase();
        dataValues.games = dataValues?.gamesData.map((g) => g.id || g.value || g._id || g);

        // Convert empty strings to null for optional number fields
        if (dataValues.prizePool === "" || dataValues.prizePool === null) {
          dataValues.prizePool = null;
        }

        // Convert empty strings to null for optional fields
        if (!dataValues.streamUrl) dataValues.streamUrl = null;
        if (!dataValues.websiteUrl) dataValues.websiteUrl = null;
        if (!dataValues.format) dataValues.format = null;
        if (!dataValues.rules) dataValues.rules = null;
        if (!dataValues.description) dataValues.description = null;
        if (!dataValues.location) dataValues.location = null;
        if (!dataValues.organizer) dataValues.organizer = null;
        if (!dataValues.tier) dataValues.tier = null;

        // Clean up temporary fields
        delete dataValues.logoLight;
        delete dataValues.logoDark;
        delete dataValues.knockoutImageLight;
        delete dataValues.knockoutImageDark;
        delete dataValues.gamesData;

        await submit(dataValues);
        formType === "add" && formik.resetForm();
        toast.success(
          formType === "add"
            ? t("The Tournament Added")
            : t("The Tournament Edited")
        );
      } catch (error) {
        // Ignore NEXT_REDIRECT - it's expected behavior for successful form submission
        if (!error.toString().includes("NEXT_REDIRECT")) {
          toast.error(error.message || "An error occurred");
        }
      }
    },
  });

  const statusOptions = [
    { value: "upcoming", label: t("Upcoming"), icon: Clock, color: "text-blue-500", bg: "bg-blue-500/10" },
    { value: "ongoing", label: t("Ongoing"), icon: Play, color: "text-green-500", bg: "bg-green-500/10" },
    { value: "completed", label: t("Completed"), icon: CheckCircle2, color: "text-purple-500", bg: "bg-purple-500/10" },
    { value: "cancelled", label: t("Cancelled"), icon: XCircle, color: "text-red-500", bg: "bg-red-500/10" },
  ];

  const tierOptions = [
    { value: "S", label: "S-Tier", color: "text-yellow-500", bg: "bg-gradient-to-r from-yellow-500/20 to-orange-500/20", badge: "bg-gradient-to-r from-yellow-400 to-orange-500" },
    { value: "A", label: "A-Tier", color: "text-purple-500", bg: "bg-purple-500/10", badge: "bg-purple-500" },
    { value: "B", label: "B-Tier", color: "text-blue-500", bg: "bg-blue-500/10", badge: "bg-blue-500" },
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
            required
          />
          <InputField
            label={t("Organizer")}
            name="organizer"
            placeholder={t("Enter Name of Organizer")}
            formik={formik}
          />
        </FormRow>

        {/* Description */}
        <TextAreaField
          label={t("Description")}
          name="description"
          placeholder={t("Enter tournament description")}
          formik={formik}
          rows={3}
        />

        <FormRow cols={2}>
          <StatusSelectField
            label={t("Status")}
            name="status"
            options={statusOptions}
            formik={formik}
            placeholder={t("Select Status")}
          />
          <CountrySelectField
            label={t("Country")}
            name="country"
            countries={countries}
            formik={formik}
            placeholder={t("Select Country")}
            searchPlaceholder={t("Search countries")}
          />
        </FormRow>

        <FormRow cols={3}>
          <TierSelectField
            label={t("Tier")}
            name="tier"
            options={tierOptions}
            formik={formik}
            placeholder={t("Select Tier")}
          />
          <PrizePoolWithCurrencyField
            label={t("Prize Pool")}
            name="prizePool"
            currencyName="currency"
            formik={formik}
            currencyOptions={CURRENCY_OPTIONS}
          />
          <InputField
            label={t("Format")}
            name="format"
            placeholder="e.g. Double Elimination"
            formik={formik}
          />
        </FormRow>

        <FormRow cols={3}>
          <BooleanToggle
            label={t("Online Tournament")}
            name="isOnline"
            formik={formik}
            iconOn={<Wifi className="size-4" />}
            iconOff={<WifiOff className="size-4" />}
            labelOn={t("Online")}
            labelOff={t("Offline")}
          />
          <BooleanToggle
            label={t("Active")}
            name="isActive"
            formik={formik}
            iconOn={<Power className="size-4" />}
            iconOff={<Power className="size-4" />}
            labelOn={t("Active")}
            labelOff={t("Inactive")}
            colorOn="green"
          />
          <FeaturedToggle
            label={t("Featured")}
            name="isFeatured"
            formik={formik}
          />
        </FormRow>

        {/* Location - only show when offline */}
        {!formik.values.isOnline && (
          <InputField
            label={t("location")}
            name="location"
            placeholder={t("Enter Location")}
            formik={formik}
            icon={<MapPin className="size-5 text-muted-foreground" />}
          />
        )}
      </FormSection>

      {/* Schedule */}
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

      {/* Links */}
      <FormSection title={t("Links")} icon={<LinkIcon className="size-5" />}>
        <FormRow cols={2}>
          <InputField
            label={t("Stream URL")}
            name="streamUrl"
            placeholder="https://twitch.tv/..."
            formik={formik}
            icon={<Tv className="size-5 text-purple-500" />}
          />
          <InputField
            label={t("Website URL")}
            name="websiteUrl"
            placeholder="https://..."
            formik={formik}
            icon={<Globe className="size-5 text-blue-500" />}
          />
        </FormRow>
      </FormSection>

      {/* Rules */}
      <FormSection title={t("Rules")} icon={<FileText className="size-5" />}>
        <TextAreaField
          label={t("Tournament Rules")}
          name="rules"
          placeholder={t("Enter tournament rules and regulations")}
          formik={formik}
          rows={6}
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
              {formType === "add" ? t("AddingProgress") : t("SavingProgress")}
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
function InputField({ label, name, type = "text", placeholder, formik, icon, required, ...props }) {
  const error = formik.touched[name] && formik.errors[name];

  return (
    <div className="flex-1 space-y-2">
      <label className="text-sm font-medium text-muted-foreground">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
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

// Status Select Field with Icons and Colors
function StatusSelectField({ label, name, options, formik, placeholder }) {
  const [isOpen, setIsOpen] = useState(false);
  const error = formik.touched[name] && formik.errors[name];
  const value = formik.values[name];

  const selectedOption = options.find((opt) => opt.value === value);

  const handleSelect = (option) => {
    formik.setFieldValue(name, option.value);
    formik.setFieldTouched(name, true);
    setIsOpen(false);
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
              {selectedOption ? (
                <>
                  <div className={`size-8 rounded-lg ${selectedOption.bg} flex items-center justify-center`}>
                    <selectedOption.icon className={`size-4 ${selectedOption.color}`} />
                  </div>
                  <span className={`font-medium ${selectedOption.color}`}>{selectedOption.label}</span>
                </>
              ) : (
                <>
                  <div className="size-8 rounded-lg bg-muted dark:bg-[#252a3d] flex items-center justify-center">
                    <Clock className="size-4 text-muted-foreground" />
                  </div>
                  <span className="text-muted-foreground">{placeholder}</span>
                </>
              )}
            </div>
            <ChevronDown className={`size-4 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`} />
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] p-2 bg-background dark:bg-[#12141c] border-border"
          align="start"
        >
          {options.map((option) => {
            const isSelected = value === option.value;
            const IconComponent = option.icon;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left rtl:text-right transition-colors ${
                  isSelected
                    ? `${option.bg} ${option.color}`
                    : "hover:bg-muted dark:hover:bg-[#1a1d2e]"
                }`}
              >
                <div className={`size-8 rounded-lg ${option.bg} flex items-center justify-center`}>
                  <IconComponent className={`size-4 ${option.color}`} />
                </div>
                <span className={`flex-1 text-sm font-medium ${isSelected ? option.color : "text-foreground"}`}>
                  {option.label}
                </span>
                {isSelected && <Check className={`size-4 ${option.color}`} />}
              </button>
            );
          })}
        </PopoverContent>
      </Popover>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

// Tier Select Field with Premium Styling
function TierSelectField({ label, name, options, formik, placeholder }) {
  const [isOpen, setIsOpen] = useState(false);
  const error = formik.touched[name] && formik.errors[name];
  const value = formik.values[name];

  const selectedOption = options.find((opt) => opt.value === value);

  const handleSelect = (option) => {
    formik.setFieldValue(name, option.value);
    formik.setFieldTouched(name, true);
    setIsOpen(false);
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
              {selectedOption ? (
                <>
                  <div className={`size-8 rounded-lg ${selectedOption.badge} flex items-center justify-center`}>
                    <Award className="size-4 text-white" />
                  </div>
                  <span className={`font-bold ${selectedOption.color}`}>{selectedOption.label}</span>
                </>
              ) : (
                <>
                  <div className="size-8 rounded-lg bg-muted dark:bg-[#252a3d] flex items-center justify-center">
                    <Award className="size-4 text-muted-foreground" />
                  </div>
                  <span className="text-muted-foreground">{placeholder}</span>
                </>
              )}
            </div>
            <ChevronDown className={`size-4 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`} />
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] p-2 bg-background dark:bg-[#12141c] border-border"
          align="start"
        >
          {options.map((option) => {
            const isSelected = value === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left rtl:text-right transition-colors ${
                  isSelected
                    ? `${option.bg} border border-current/20`
                    : "hover:bg-muted dark:hover:bg-[#1a1d2e]"
                }`}
              >
                <div className={`size-8 rounded-lg ${option.badge} flex items-center justify-center`}>
                  <Award className="size-4 text-white" />
                </div>
                <span className={`flex-1 text-sm font-bold ${isSelected ? option.color : "text-foreground"}`}>
                  {option.label}
                </span>
                {isSelected && <Check className={`size-4 ${option.color}`} />}
              </button>
            );
          })}
        </PopoverContent>
      </Popover>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

// Multi-Select Field for Games
function MultiSelectField({ label, name, options = [], formik }) {
  const safeOptions = Array.isArray(options) ? options : [];
  const selectedIds = formik.values[name]?.map((g) => g.id || g.value || g) || [];
  const error = formik.touched[name] && formik.errors[name];

  const toggleGame = (game) => {
    const gameId = game.id || game.value;
    const isSelected = selectedIds.includes(gameId);

    if (isSelected) {
      formik.setFieldValue(
        name,
        (formik.values[name] || []).filter((g) => (g.id || g.value || g) !== gameId)
      );
    } else {
      formik.setFieldValue(name, [...(formik.values[name] || []), { id: gameId, name: game.name || game.label }]);
    }
    formik.setFieldTouched(name, true);
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-muted-foreground">{label}</label>
      <div className="flex flex-wrap gap-2">
        {safeOptions.map((game) => {
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

// Enhanced Date Picker Field with Year/Month Navigation
function DatePickerField({ label, name, formik, placeholder, minDate }) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(new Date());
  const error = formik.touched[name] && formik.errors[name];
  const value = formik.values[name];

  const selectedDate = value ? new Date(value) : undefined;
  const minDateObj = minDate ? new Date(minDate) : undefined;

  // Generate years from 1990 to current year + 10
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1990 + 11 }, (_, i) => 1990 + i);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

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
              <span
                role="button"
                tabIndex={0}
                onClick={handleClear}
                onKeyDown={(e) => e.key === "Enter" && handleClear(e)}
                className="size-7 rounded-lg bg-muted hover:bg-red-500/20 flex items-center justify-center transition-colors group cursor-pointer"
              >
                <X className="size-4 text-muted-foreground group-hover:text-red-500" />
              </span>
            )}
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-background dark:bg-[#12141c] border-border" align="start">
          {/* Year/Month Navigation */}
          <div className="p-3 border-b border-border">
            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={goToPreviousMonth}
                className="size-8 rounded-lg bg-muted/50 dark:bg-[#1a1d2e] hover:bg-muted dark:hover:bg-[#252a3d] flex items-center justify-center transition-colors"
              >
                <ChevronLeft className="size-4 text-foreground" />
              </button>

              <div className="flex items-center gap-2">
                {/* Month Select */}
                <select
                  value={viewDate.getMonth()}
                  onChange={(e) => handleMonthChange(parseInt(e.target.value))}
                  className="h-8 px-2 rounded-lg bg-muted/50 dark:bg-[#1a1d2e] border-0 text-sm text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-green-primary/50 cursor-pointer"
                >
                  {months.map((month, index) => (
                    <option key={month} value={index}>{month}</option>
                  ))}
                </select>

                {/* Year Select */}
                <select
                  value={viewDate.getFullYear()}
                  onChange={(e) => handleYearChange(parseInt(e.target.value))}
                  className="h-8 px-2 rounded-lg bg-muted/50 dark:bg-[#1a1d2e] border-0 text-sm text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-green-primary/50 cursor-pointer"
                >
                  {years.map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={goToNextMonth}
                className="size-8 rounded-lg bg-muted/50 dark:bg-[#1a1d2e] hover:bg-muted dark:hover:bg-[#252a3d] flex items-center justify-center transition-colors"
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
            disabled={(date) => minDateObj && date < minDateObj}
            initialFocus
            className="rounded-xl"
            classNames={{
              nav: "hidden",
              caption: "hidden",
            }}
          />
        </PopoverContent>
      </Popover>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

// Prize Pool Input Field with Currency Selector
function PrizePoolWithCurrencyField({ label, name, currencyName, formik, currencyOptions }) {
  const [isOpen, setIsOpen] = useState(false);
  const error = formik.touched[name] && formik.errors[name];
  const value = formik.values[name];
  const currency = formik.values[currencyName] || "USD";

  const selectedCurrency = currencyOptions.find((c) => c.value === currency) || currencyOptions[0];

  const formatNumber = (num) => {
    if (!num && num !== 0) return "";
    return new Intl.NumberFormat("en-US").format(num);
  };

  const handleChange = (e) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, "");
    formik.setFieldValue(name, rawValue ? parseInt(rawValue, 10) : "");
  };

  const handleCurrencySelect = (curr) => {
    formik.setFieldValue(currencyName, curr.value);
    setIsOpen(false);
  };

  return (
    <div className="flex-1 space-y-2">
      <label className="text-sm font-medium text-muted-foreground">{label}</label>
      <div className="flex gap-2">
        {/* Currency Selector */}
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="h-12 px-3 rounded-xl bg-muted/50 dark:bg-[#1a1d2e] border border-transparent text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-primary/50 cursor-pointer transition-all hover:bg-muted dark:hover:bg-[#252a3d] flex items-center gap-2"
            >
              <span className="text-green-primary font-bold">{selectedCurrency.symbol}</span>
              <span className="text-foreground">{selectedCurrency.value}</span>
              <ChevronDown className={`size-3 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-2 bg-background dark:bg-[#12141c] border-border" align="start">
            <div className="max-h-64 overflow-y-auto space-y-0.5">
              {currencyOptions.map((curr) => (
                <button
                  key={curr.value}
                  type="button"
                  onClick={() => handleCurrencySelect(curr)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left rtl:text-right transition-colors ${
                    currency === curr.value
                      ? "bg-green-primary/10 text-green-primary"
                      : "hover:bg-muted dark:hover:bg-[#1a1d2e]"
                  }`}
                >
                  <span className="font-bold text-lg w-6">{curr.symbol}</span>
                  <span className="text-sm font-medium flex-1">{curr.label}</span>
                  {currency === curr.value && <Check className="size-4" />}
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Amount Input */}
        <div className="relative flex-1">
          <input
            type="text"
            name={name}
            value={formatNumber(value)}
            onChange={handleChange}
            onBlur={formik.handleBlur}
            placeholder="0"
            className={`w-full h-12 px-4 rounded-xl bg-muted/50 dark:bg-[#1a1d2e] border border-transparent text-sm text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-green-primary/50 focus:border-green-primary/30 transition-all ${
              error ? "ring-2 ring-red-500 border-red-500" : ""
            }`}
          />
        </div>
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

// Country Select Field with Search and Flags
function CountrySelectField({ label, name, countries, formik, placeholder, searchPlaceholder }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const error = formik.touched[name] && formik.errors[name];
  const value = formik.values[name];

  // Find selected country
  const selectedCountry = countries?.find((c) => c.label === value);

  // Filter countries based on search
  const filteredCountries = (countries || []).filter((country) =>
    country.label.toLowerCase().includes(search.toLowerCase()) ||
    country.value.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (country) => {
    formik.setFieldValue(name, country.label);
    formik.setFieldTouched(name, true);
    setIsOpen(false);
    setSearch("");
  };

  const handleClear = (e) => {
    e.stopPropagation();
    formik.setFieldValue(name, "");
    formik.setFieldTouched(name, true);
  };

  const getFlagUrl = (code) => `https://flagcdn.com/w40/${code.toLowerCase()}.png`;

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
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {selectedCountry ? (
                <>
                  <div className="size-8 rounded-lg overflow-hidden flex-shrink-0 ring-1 ring-white/10">
                    <Image
                      src={getFlagUrl(selectedCountry.value)}
                      alt={selectedCountry.label}
                      width={32}
                      height={24}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-foreground font-medium truncate">{selectedCountry.label}</span>
                    <span className="text-xs text-muted-foreground bg-muted dark:bg-[#252a3d] px-2 py-0.5 rounded">
                      {selectedCountry.value}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className="size-8 rounded-lg bg-muted dark:bg-[#252a3d] flex items-center justify-center flex-shrink-0">
                    <Globe className="size-4 text-muted-foreground" />
                  </div>
                  <span className="text-muted-foreground">{placeholder}</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-1">
              {selectedCountry && (
                <span
                  role="button"
                  tabIndex={0}
                  onClick={handleClear}
                  onKeyDown={(e) => e.key === "Enter" && handleClear(e)}
                  className="size-7 rounded-lg hover:bg-red-500/20 flex items-center justify-center transition-colors group cursor-pointer"
                >
                  <X className="size-4 text-muted-foreground group-hover:text-red-500" />
                </span>
              )}
              <ChevronDown className={`size-4 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </div>
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] p-0 bg-background dark:bg-[#12141c] border-border"
          align="start"
        >
          {/* Search Input */}
          <div className="p-3 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={searchPlaceholder || "Search..."}
                className="w-full h-10 pl-10 pr-4 rtl:pl-4 rtl:pr-10 rounded-lg bg-muted/50 dark:bg-[#1a1d2e] border-0 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-green-primary/50"
                autoFocus
              />
            </div>
          </div>

          {/* Countries List */}
          <div className="max-h-64 overflow-y-auto p-2">
            {filteredCountries.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                No countries found
              </div>
            ) : (
              filteredCountries.map((country) => {
                const isSelected = value === country.label;
                return (
                  <button
                    key={country.value}
                    type="button"
                    onClick={() => handleSelect(country)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left rtl:text-right transition-colors ${
                      isSelected
                        ? "bg-green-primary/10 text-green-primary"
                        : "hover:bg-muted dark:hover:bg-[#1a1d2e]"
                    }`}
                  >
                    <div className="size-8 rounded-lg overflow-hidden flex-shrink-0 ring-1 ring-white/10">
                      <Image
                        src={getFlagUrl(country.value)}
                        alt={country.label}
                        width={32}
                        height={24}
                        className="w-full h-full object-cover"
                        unoptimized
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className={`text-sm font-medium ${isSelected ? "text-green-primary" : "text-foreground"}`}>
                        {country.label}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground bg-muted dark:bg-[#252a3d] px-2 py-0.5 rounded">
                      {country.value}
                    </span>
                    {isSelected && (
                      <Check className="size-4 text-green-primary flex-shrink-0" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </PopoverContent>
      </Popover>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

// TextArea Field Component
function TextAreaField({ label, name, placeholder, formik, rows = 4 }) {
  const error = formik.touched[name] && formik.errors[name];

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-muted-foreground">{label}</label>
      <textarea
        name={name}
        value={formik.values[name]}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        placeholder={placeholder}
        rows={rows}
        className={`w-full px-4 py-3 rounded-xl bg-muted/50 dark:bg-[#1a1d2e] border-0 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-green-primary/50 transition-all resize-none ${
          error ? "ring-2 ring-red-500" : ""
        }`}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

// Number Field Component
function NumberField({ label, name, placeholder, formik, icon }) {
  const error = formik.touched[name] && formik.errors[name];
  const value = formik.values[name];

  const handleChange = (e) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, "");
    formik.setFieldValue(name, rawValue ? parseInt(rawValue, 10) : "");
  };

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
          type="text"
          name={name}
          value={value || ""}
          onChange={handleChange}
          onBlur={formik.handleBlur}
          placeholder={placeholder}
          className={`w-full h-12 ${icon ? "pl-11 pr-4 rtl:pl-4 rtl:pr-11" : "px-4"} rounded-xl bg-muted/50 dark:bg-[#1a1d2e] border border-transparent text-sm text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-green-primary/50 focus:border-green-primary/30 transition-all ${
            error ? "ring-2 ring-red-500 border-red-500" : ""
          }`}
        />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

// Boolean Toggle Component
function BooleanToggle({ label, name, formik, iconOn, iconOff, labelOn, labelOff, colorOn = "blue" }) {
  const isChecked = formik.values[name];

  const colorClasses = {
    green: {
      bg: "bg-green-500/20 border-green-500/50",
      text: "text-green-500",
      toggle: "bg-green-500",
    },
    blue: {
      bg: "bg-blue-500/20 border-blue-500/50",
      text: "text-blue-500",
      toggle: "bg-blue-500",
    },
  };

  const colors = colorClasses[colorOn] || colorClasses.blue;

  return (
    <div className="flex-1 space-y-2">
      <label className="text-sm font-medium text-muted-foreground">{label}</label>
      <button
        type="button"
        onClick={() => formik.setFieldValue(name, !isChecked)}
        className={`w-full h-12 px-4 rounded-xl border transition-all flex items-center justify-between ${
          isChecked
            ? `${colors.bg}`
            : "bg-muted/50 dark:bg-[#1a1d2e] border-transparent hover:bg-muted dark:hover:bg-[#252a3d]"
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`size-8 rounded-lg flex items-center justify-center transition-all ${
              isChecked
                ? colors.toggle
                : "bg-muted dark:bg-[#252a3d]"
            }`}
          >
            <span className={isChecked ? "text-white" : "text-muted-foreground"}>
              {isChecked ? iconOn : iconOff}
            </span>
          </div>
          <span
            className={`text-sm font-medium ${
              isChecked ? colors.text : "text-foreground"
            }`}
          >
            {isChecked ? labelOn : labelOff}
          </span>
        </div>
        <div
          className={`w-11 h-6 rounded-full relative transition-colors ${
            isChecked ? colors.toggle : "bg-muted dark:bg-[#252a3d]"
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
