"use client";

import { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { getImgUrl } from "@/lib/utils";
import Image from "next/image";
import {
  Building2,
  Calendar as CalendarIcon,
  ArrowLeft,
  Save,
  Globe,
  Loader2,
  MapPin,
  FileText,
  Image as ImageIcon,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
  Flag,
  Search,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Button } from "../ui/button";
import FormSection from "../ui app/FormSection";
import FormRow from "../ui app/FormRow";
import ImageUpload from "../ui app/ImageUpload";
import RichTextEditor from "../ui app/RichTextEditor";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar as CalendarComponent } from "../ui/calendar";

// ─── Validation ──────────────────────────────────────────────

const validationSchema = yup.object({
  name: yup.string().required("nameRequired").max(100, "nameTooLong"),
  shortName: yup.string().max(50, "shortNameTooLong"),
  description: yup.string().max(50000, "descriptionTooLong"),
  country: yup.string(),
  region: yup.string(),
  founded: yup.string(),
  websiteUrl: yup.string().url("invalidUrl"),
  logoLight: yup.mixed(),
  logoDark: yup.mixed(),
  coverImageLight: yup.mixed(),
  coverImageDark: yup.mixed(),
});

// ─── Region Options ──────────────────────────────────────────

const REGION_OPTIONS = [
  { value: "Middle East", label: "middleEast", icon: MapPin, color: "text-amber-500", bg: "bg-amber-500/10" },
  { value: "Europe", label: "europe", icon: Building2, color: "text-blue-500", bg: "bg-blue-500/10" },
  { value: "North America", label: "northAmerica", icon: Flag, color: "text-red-500", bg: "bg-red-500/10" },
  { value: "South America", label: "southAmerica", icon: Flag, color: "text-green-500", bg: "bg-green-500/10" },
  { value: "Asia", label: "asia", icon: Globe, color: "text-purple-500", bg: "bg-purple-500/10" },
  { value: "CIS", label: "cis", icon: Globe, color: "text-orange-500", bg: "bg-orange-500/10" },
  { value: "Oceania", label: "oceania", icon: Globe, color: "text-teal-500", bg: "bg-teal-500/10" },
];

// ─── Sub-Components ──────────────────────────────────────────

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
          value={formik.values[name] ?? ""}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder={placeholder}
          className={`w-full h-11 px-4 ${icon ? "pl-10 rtl:pl-4 rtl:pr-10" : ""} rounded-xl bg-muted/50 dark:bg-[#1a1d2e] border-0 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-green-primary/50 transition-all ${
            error ? "ring-2 ring-red-500" : ""
          }`}
          {...props}
        />
      </div>
      {error && (
        <p className="text-xs text-red-500">
          {typeof error === "string" ? error : ""}
        </p>
      )}
    </div>
  );
}

function TextAreaField({ label, name, placeholder, formik, rows = 4 }) {
  const error = formik.touched[name] && formik.errors[name];

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-muted-foreground">{label}</label>
      <textarea
        name={name}
        value={formik.values[name] ?? ""}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        placeholder={placeholder}
        rows={rows}
        className={`w-full px-4 py-3 rounded-xl bg-muted/50 dark:bg-[#1a1d2e] border-0 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-green-primary/50 transition-all resize-none ${
          error ? "ring-2 ring-red-500" : ""
        }`}
      />
      {error && (
        <p className="text-xs text-red-500">
          {typeof error === "string" ? error : ""}
        </p>
      )}
    </div>
  );
}

function CountrySelectField({ label, name, countries, formik, placeholder, searchPlaceholder }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const error = formik.touched[name] && formik.errors[name];
  const value = formik.values[name];

  const selectedCountry = countries?.find((c) => c.label === value);

  const filteredCountries = (countries || []).filter(
    (country) =>
      country.label.toLowerCase().includes(search.toLowerCase()) ||
      country.value.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = async (country) => {
    await formik.setFieldValue(name, country.label);
    await formik.setFieldValue("countryCode", country.value);
    await formik.setFieldTouched(name, true, true);
    formik.validateField(name);
    setIsOpen(false);
    setSearch("");
  };

  const handleClear = async (e) => {
    e.stopPropagation();
    await formik.setFieldValue(name, "");
    await formik.setFieldValue("countryCode", "");
    await formik.setFieldTouched(name, true, true);
    formik.validateField(name);
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
                    <span className="text-foreground font-medium truncate">
                      {selectedCountry.label}
                    </span>
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
              <ChevronDown
                className={`size-4 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`}
              />
            </div>
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] p-0 bg-background dark:bg-[#12141c] border-border"
          align="start"
        >
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
                      <span
                        className={`text-sm font-medium ${
                          isSelected ? "text-green-primary" : "text-foreground"
                        }`}
                      >
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
      {error && (
        <p className="text-xs text-red-500">
          {typeof error === "string" ? error : ""}
        </p>
      )}
    </div>
  );
}

function RegionSelectField({ label, name, options, formik, placeholder }) {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("clubForm");
  const error = formik.touched[name] && formik.errors[name];
  const value = formik.values[name];

  const selectedOption = options.find((opt) => opt.value === value);

  const handleSelect = async (option) => {
    await formik.setFieldValue(name, option.value);
    await formik.setFieldTouched(name, true, true);
    formik.validateField(name);
    setIsOpen(false);
  };

  const handleClear = async (e) => {
    e.stopPropagation();
    await formik.setFieldValue(name, "");
    await formik.setFieldTouched(name, true, true);
    formik.validateField(name);
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
                  <div
                    className={`size-8 rounded-lg ${selectedOption.bg} flex items-center justify-center`}
                  >
                    <selectedOption.icon
                      className={`size-4 ${selectedOption.color}`}
                    />
                  </div>
                  <span className={`font-medium ${selectedOption.color}`}>
                    {t(selectedOption.label) || selectedOption.value}
                  </span>
                </>
              ) : (
                <>
                  <div className="size-8 rounded-lg bg-muted dark:bg-[#252a3d] flex items-center justify-center">
                    <MapPin className="size-4 text-muted-foreground" />
                  </div>
                  <span className="text-muted-foreground">{placeholder}</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-1">
              {selectedOption && (
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
              <ChevronDown
                className={`size-4 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`}
              />
            </div>
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
                <div
                  className={`size-8 rounded-lg ${option.bg} flex items-center justify-center`}
                >
                  <IconComponent className={`size-4 ${option.color}`} />
                </div>
                <span
                  className={`flex-1 text-sm font-medium ${
                    isSelected ? option.color : "text-foreground"
                  }`}
                >
                  {t(option.label) || option.value}
                </span>
                {isSelected && <Check className={`size-4 ${option.color}`} />}
              </button>
            );
          })}
        </PopoverContent>
      </Popover>
      {error && (
        <p className="text-xs text-red-500">
          {typeof error === "string" ? error : ""}
        </p>
      )}
    </div>
  );
}

function DatePickerField({ label, name, formik, placeholder }) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(() => {
    if (formik.values[name]) {
      const parts = formik.values[name].split("-").map(Number);
      if (parts[0] && parts[1] && parts[2]) {
        return new Date(parts[0], parts[1] - 1, parts[2]);
      }
    }
    return new Date();
  });
  const error = formik.touched[name] && formik.errors[name];
  const value = formik.values[name];

  const parseLocalDate = (dateStr) => {
    if (!dateStr) return undefined;
    if (dateStr instanceof Date) return dateStr;
    const [year, month, day] = dateStr.split("-").map(Number);
    if (year && month && day) {
      return new Date(year, month - 1, day);
    }
    return new Date(dateStr);
  };

  const formatLocalDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const selectedDate = parseLocalDate(value);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1900 + 2 }, (_, i) => 1900 + i);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const formatDisplayDate = (dateStr) => {
    if (!dateStr) return "";
    const date = parseLocalDate(dateStr);
    if (!date || isNaN(date.getTime())) return "";
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleSelect = async (date) => {
    if (date) {
      const formattedDate = formatLocalDate(date);
      await formik.setFieldValue(name, formattedDate);
      await formik.setFieldTouched(name, true, true);
      formik.validateField(name);
    }
    setIsOpen(false);
  };

  const handleClear = async (e) => {
    e.stopPropagation();
    await formik.setFieldValue(name, "");
    await formik.setFieldTouched(name, true, true);
    formik.validateField(name);
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
                <CalendarIcon className="size-5 text-green-primary" />
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
                className="size-7 rounded-lg bg-muted hover:bg-red-500/20 flex items-center justify-center transition-colors group cursor-pointer"
              >
                <X className="size-4 text-muted-foreground group-hover:text-red-500" />
              </span>
            )}
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0 bg-background dark:bg-[#12141c] border-border"
          align="start"
        >
          <div className="p-3 border-b border-border">
            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => {
                  const newDate = new Date(viewDate);
                  newDate.setMonth(newDate.getMonth() - 1);
                  setViewDate(newDate);
                }}
                className="size-8 rounded-lg bg-muted/50 dark:bg-[#1a1d2e] hover:bg-muted dark:hover:bg-[#252a3d] flex items-center justify-center transition-colors"
              >
                <ChevronLeft className="size-4 text-foreground rtl:rotate-180" />
              </button>
              <div className="flex items-center gap-2">
                <select
                  value={viewDate.getMonth()}
                  onChange={(e) => {
                    const newDate = new Date(viewDate);
                    newDate.setMonth(parseInt(e.target.value));
                    setViewDate(newDate);
                  }}
                  className="h-8 px-2 rounded-lg bg-muted/50 dark:bg-[#1a1d2e] border-0 text-sm text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-green-primary/50 cursor-pointer"
                >
                  {months.map((month, index) => (
                    <option key={month} value={index}>
                      {month}
                    </option>
                  ))}
                </select>
                <select
                  value={viewDate.getFullYear()}
                  onChange={(e) => {
                    const newDate = new Date(viewDate);
                    newDate.setFullYear(parseInt(e.target.value));
                    setViewDate(newDate);
                  }}
                  className="h-8 px-2 rounded-lg bg-muted/50 dark:bg-[#1a1d2e] border-0 text-sm text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-green-primary/50 cursor-pointer"
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
                onClick={() => {
                  const newDate = new Date(viewDate);
                  newDate.setMonth(newDate.getMonth() + 1);
                  setViewDate(newDate);
                }}
                className="size-8 rounded-lg bg-muted/50 dark:bg-[#1a1d2e] hover:bg-muted dark:hover:bg-[#252a3d] flex items-center justify-center transition-colors"
              >
                <ChevronRight className="size-4 text-foreground rtl:rotate-180" />
              </button>
            </div>
          </div>
          <CalendarComponent
            mode="single"
            selected={selectedDate}
            onSelect={handleSelect}
            month={viewDate}
            onMonthChange={setViewDate}
            initialFocus
            className="rounded-xl"
            classNames={{ nav: "hidden", caption: "hidden" }}
          />
        </PopoverContent>
      </Popover>
      {error && (
        <p className="text-xs text-red-500">
          {typeof error === "string" ? error : ""}
        </p>
      )}
    </div>
  );
}

// ─── Helper ──────────────────────────────────────────────────

function formatDateToLocal(date) {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// ─── Main Form ───────────────────────────────────────────────

function ClubForm({ formType = "add", submit, club, countries = [] }) {
  const t = useTranslations("clubForm");
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: club?.name || "",
      shortName: club?.shortName || "",

      description: club?.description || "",
      country: club?.country?.name || "",
      countryCode: club?.country?.code || "",
      region: club?.region || "",
      founded: formatDateToLocal(club?.founded),
      websiteUrl: club?.websiteUrl || "",
      logoLight: getImgUrl(club?.logo?.light) || "",
      logoDark: getImgUrl(club?.logo?.dark) || "",
      coverImageLight: getImgUrl(club?.coverImage?.light) || "",
      coverImageDark: getImgUrl(club?.coverImage?.dark) || "",
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
        if (
          error?.digest?.startsWith("NEXT_REDIRECT") ||
          error?.digest?.includes("NEXT_REDIRECT") ||
          error?.toString().includes("NEXT_REDIRECT")
        ) {
          toast.success(
            formType === "add"
              ? t("createSuccess") || "Club created successfully"
              : t("updateSuccess") || "Club updated successfully"
          );
          throw error;
        } else {
          toast.error(error.message || t("error") || "Something went wrong");
        }
      } finally {
        setIsSubmitting(false);
      }
    },
  });

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

      <form onSubmit={formik.handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <FormSection
          icon={<Building2 className="size-5" />}
          title={t("basicInfo") || "Basic Information"}
        >
          <FormRow cols={2}>
            <InputField
              label={t("name") || "Club Name"}
              name="name"
              placeholder={t("namePlaceholder") || "Enter club name"}
              formik={formik}
              required
            />
            <InputField
              label={t("shortName") || "Short Name"}
              name="shortName"
              placeholder={t("shortNamePlaceholder") || "e.g. TL, C9"}
              formik={formik}
            />
          </FormRow>

          <RichTextEditor
            name="description"
            formik={formik}
            label={t("description") || "Description"}
            placeholder={t("descriptionPlaceholder") || "Enter club description"}
            minHeight="200px"
            required={false}
          />
        </FormSection>

        {/* Images */}
        <FormSection
          icon={<ImageIcon className="size-5" />}
          title={t("images") || "Images"}
        >
          <FormRow>
            <ImageUpload
              label={t("logoLight") || "Logo (Light)"}
              name="logoLight"
              formik={formik}
              imageType="clubLogo"
            />
            <ImageUpload
              label={t("logoDark") || "Logo (Dark)"}
              name="logoDark"
              formik={formik}
              imageType="clubLogo"
            />
          </FormRow>
          <FormRow>
            <ImageUpload
              label={t("coverLight") || "Cover (Light)"}
              name="coverImageLight"
              formik={formik}
              imageType="clubCover"
            />
            <ImageUpload
              label={t("coverDark") || "Cover (Dark)"}
              name="coverImageDark"
              formik={formik}
              imageType="clubCover"
            />
          </FormRow>
        </FormSection>

        {/* Details */}
        <FormSection
          icon={<Globe className="size-5" />}
          title={t("details") || "Details"}
        >
          <FormRow cols={2}>
            <CountrySelectField
              label={t("country") || "Country"}
              name="country"
              countries={countries}
              formik={formik}
              placeholder={t("selectCountry") || "Select Country"}
              searchPlaceholder={
                t("searchCountries") || "Search countries..."
              }
            />
            <RegionSelectField
              label={t("region") || "Region"}
              name="region"
              options={REGION_OPTIONS}
              formik={formik}
              placeholder={t("selectRegion") || "Select Region"}
            />
          </FormRow>

          <FormRow cols={2}>
            <DatePickerField
              label={t("founded") || "Founded"}
              name="founded"
              formik={formik}
              placeholder={t("selectDate") || "Select date"}
            />
            <InputField
              label={t("websiteUrl") || "Website URL"}
              name="websiteUrl"
              type="url"
              placeholder={
                t("websiteUrlPlaceholder") || "https://example.com"
              }
              formik={formik}
              icon={<Globe className="size-4 text-blue-500" />}
            />
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
                  ? t("create") || "Create Club"
                  : t("save") || "Save Changes"}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default ClubForm;
