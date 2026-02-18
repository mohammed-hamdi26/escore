"use client";

import { useState, useEffect } from "react";
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
  Plus,
  Trash2,
  Star,
  X,
  Search,
  Check,
  Play,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Wifi,
  WifiOff,
  Tv,
  Power,
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
      {error && <p className="text-xs text-red-500">{typeof error === "string" ? error : ""}</p>}
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
      {error && <p className="text-xs text-red-500">{typeof error === "string" ? error : ""}</p>}
    </div>
  );
}

function StatusSelectField({ label, name, options, formik, placeholder }) {
  const [isOpen, setIsOpen] = useState(false);
  const error = formik.touched[name] && formik.errors[name];
  const value = formik.values[name];

  const selectedOption = options.find((opt) => opt.value === value);

  const handleSelect = async (option) => {
    await formik.setFieldValue(name, option.value);
    await formik.setFieldTouched(name, true, true);
    formik.validateField(name);
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
      {error && <p className="text-xs text-red-500">{typeof error === "string" ? error : ""}</p>}
    </div>
  );
}

function CountrySelectField({ label, name, countries, formik, placeholder, searchPlaceholder, noCountryFound }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const error = formik.touched[name] && formik.errors[name];
  const value = formik.values[name];

  const selectedCountry = countries?.find((c) => c.label === value);

  const filteredCountries = (countries || []).filter((country) =>
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
                {noCountryFound || "No countries found"}
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
      {error && <p className="text-xs text-red-500">{typeof error === "string" ? error : ""}</p>}
    </div>
  );
}

function DatePickerField({ label, name, formik, placeholder, minDate, required }) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(new Date());
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
  const minDateObj = parseLocalDate(minDate);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1990 + 11 }, (_, i) => 1990 + i);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
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
      <label className="text-sm font-medium text-muted-foreground">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
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
                    <option key={month} value={index}>{month}</option>
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
                    <option key={year} value={year}>{year}</option>
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
            disabled={(date) => {
              if (!minDateObj) return false;
              const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
              const minDateOnly = new Date(minDateObj.getFullYear(), minDateObj.getMonth(), minDateObj.getDate());
              return dateOnly < minDateOnly;
            }}
            initialFocus
            className="rounded-xl"
            classNames={{ nav: "hidden", caption: "hidden" }}
          />
        </PopoverContent>
      </Popover>
      {error && <p className="text-xs text-red-500">{typeof error === "string" ? error : ""}</p>}
    </div>
  );
}

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

  const handleChange = async (e) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, "");
    await formik.setFieldValue(name, rawValue ? parseInt(rawValue, 10) : "");
    formik.validateField(name);
  };

  const handleCurrencySelect = async (curr) => {
    await formik.setFieldValue(currencyName, curr.value);
    formik.validateField(currencyName);
    setIsOpen(false);
  };

  return (
    <div className="flex-1 space-y-2">
      <label className="text-sm font-medium text-muted-foreground">{label}</label>
      <div className="flex gap-2">
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
      {error && <p className="text-xs text-red-500">{typeof error === "string" ? error : ""}</p>}
    </div>
  );
}

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
              isChecked ? "ltr:left-[22px] rtl:right-[22px]" : "ltr:left-[2px] rtl:right-[2px]"
            }`}
          />
        </div>
      </button>
    </div>
  );
}

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
              isChecked ? colors.toggle : "bg-muted dark:bg-[#252a3d]"
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
              isChecked ? "ltr:left-[22px] rtl:right-[22px]" : "ltr:left-[2px] rtl:right-[2px]"
            }`}
          />
        </div>
      </button>
    </div>
  );
}

// ─── Main Form ──────────────────────────────────────────────

function formatDateToLocal(date) {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function EventForm({ event, submit, formType = "add", countries = [] }) {
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
        if (error?.digest?.includes("NEXT_REDIRECT") || error.toString().includes("NEXT_REDIRECT")) {
          toast.success(
            formType === "add"
              ? t("createSuccess") || "Event created successfully"
              : t("updateSuccess") || "Event updated successfully"
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

  // Smart Status Auto-Selection based on dates
  const eventStartDate = formik.values.startDate || "";
  const eventEndDate = formik.values.endDate || "";
  const eventStatus = formik.values.status;

  useEffect(() => {
    if (eventStatus === "cancelled") return;
    if (!eventStartDate) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const start = new Date(eventStartDate);
    start.setHours(0, 0, 0, 0);

    let newStatus = eventStatus;

    if (today < start) {
      newStatus = "upcoming";
    } else if (eventEndDate) {
      const end = new Date(eventEndDate);
      end.setHours(0, 0, 0, 0);

      if (today >= start && today <= end) {
        newStatus = "ongoing";
      } else if (today > end) {
        newStatus = "completed";
      }
    } else {
      newStatus = "ongoing";
    }

    if (newStatus !== eventStatus) {
      formik.setFieldValue("status", newStatus);
    }
  }, [eventStartDate, eventEndDate]);

  const statusOptions = [
    { value: "upcoming", label: t("upcoming") || "Upcoming", icon: Clock, color: "text-blue-500", bg: "bg-blue-500/10" },
    { value: "ongoing", label: t("ongoing") || "Ongoing", icon: Play, color: "text-green-500", bg: "bg-green-500/10" },
    { value: "completed", label: t("completed") || "Completed", icon: CheckCircle2, color: "text-purple-500", bg: "bg-purple-500/10" },
    { value: "cancelled", label: t("cancelled") || "Cancelled", icon: XCircle, color: "text-red-500", bg: "bg-red-500/10" },
  ];

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
          <FormRow cols={2}>
            <InputField
              label={t("name") || "Event Name"}
              name="name"
              placeholder={t("namePlaceholder") || "Enter event name"}
              formik={formik}
              required
            />
            <StatusSelectField
              label={t("status") || "Status"}
              name="status"
              options={statusOptions}
              formik={formik}
              placeholder={t("selectStatus") || "Select Status"}
            />
          </FormRow>

          <TextAreaField
            label={t("description") || "Description"}
            name="description"
            placeholder={t("descriptionPlaceholder") || "Enter description"}
            formik={formik}
            rows={3}
          />

          <FormRow cols={2}>
            <CountrySelectField
              label={t("country") || "Country"}
              name="country"
              countries={countries}
              formik={formik}
              placeholder={t("selectCountry") || "Select Country"}
              searchPlaceholder={t("searchCountries") || "Search countries..."}
              noCountryFound={t("noCountryFound") || "No countries found"}
            />
            <InputField
              label={t("location") || "Location"}
              name="location"
              placeholder={t("locationPlaceholder") || "e.g. Riyadh, Saudi Arabia"}
              formik={formik}
              icon={<MapPin className="size-4 text-muted-foreground" />}
            />
          </FormRow>

          <FormRow cols={2}>
            <BooleanToggle
              label={t("isOnline") || "Event Type"}
              name="isOnline"
              formik={formik}
              iconOn={<Wifi className="size-4" />}
              iconOff={<WifiOff className="size-4" />}
              labelOn={t("online") || "Online"}
              labelOff={t("offline") || "Offline"}
              colorOn="blue"
            />
            <FeaturedToggle
              label={t("isFeatured") || "Featured"}
              name="isFeatured"
              formik={formik}
            />
          </FormRow>
        </FormSection>

        {/* Dates */}
        <FormSection
          title={t("dates") || "Dates"}
          icon={<Clock className="size-5" />}
        >
          <FormRow cols={2}>
            <DatePickerField
              label={t("startDate") || "Start Date"}
              name="startDate"
              formik={formik}
              placeholder={t("selectDate") || "Select date"}
              required
            />
            <DatePickerField
              label={t("endDate") || "End Date"}
              name="endDate"
              formik={formik}
              placeholder={t("selectDate") || "Select date"}
              minDate={formik.values.startDate}
              required
            />
          </FormRow>
          <FormRow cols={2}>
            <DatePickerField
              label={t("rosterLockDate") || "Roster Lock Date"}
              name="rosterLockDate"
              formik={formik}
              placeholder={t("selectDate") || "Select date"}
            />
            <div />
          </FormRow>
        </FormSection>

        {/* Prize Pool */}
        <FormSection
          title={t("prizePoolSection") || "Prize Pool"}
          icon={<DollarSign className="size-5" />}
        >
          <FormRow cols={1}>
            <PrizePoolWithCurrencyField
              label={t("prizePool") || "Total Prize Pool"}
              name="prizePool"
              currencyName="currency"
              formik={formik}
              currencyOptions={CURRENCY_OPTIONS}
            />
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
              name="logoLight"
              formik={formik}
              imageType="eventLogo"
            />
            <ImageUpload
              label={t("logoDark") || "Logo (Dark)"}
              name="logoDark"
              formik={formik}
              imageType="eventLogo"
            />
          </FormRow>
          <FormRow>
            <ImageUpload
              label={t("coverLight") || "Cover (Light)"}
              name="coverImageLight"
              formik={formik}
              imageType="eventCover"
            />
            <ImageUpload
              label={t("coverDark") || "Cover (Dark)"}
              name="coverImageDark"
              formik={formik}
              imageType="eventCover"
            />
          </FormRow>
        </FormSection>

        {/* Links */}
        <FormSection
          title={t("links") || "Links"}
          icon={<LinkIcon className="size-5" />}
        >
          <FormRow cols={2}>
            <InputField
              label={t("streamUrl") || "Stream URL"}
              name="streamUrl"
              placeholder="https://twitch.tv/..."
              formik={formik}
              icon={<Tv className="size-4 text-purple-500" />}
            />
            <InputField
              label={t("websiteUrl") || "Website URL"}
              name="websiteUrl"
              placeholder="https://example.com"
              formik={formik}
              icon={<Globe className="size-4 text-blue-500" />}
            />
          </FormRow>
        </FormSection>

        {/* Club Championship */}
        <FormSection
          title={t("clubChampionship") || "Club Championship"}
          icon={<Trophy className="size-5" />}
        >
          <div className="space-y-4">
            <BooleanToggle
              label={t("enabled") || "Club Championship"}
              name="championshipEnabled"
              formik={{
                values: formik.values,
                setFieldValue: (name, val) => {
                  formik.setFieldValue(name, val);
                  setShowChampionship(val);
                },
              }}
              iconOn={<Power className="size-4" />}
              iconOff={<Power className="size-4" />}
              labelOn={t("enabled") || "Enabled"}
              labelOff={t("disabled") || "Disabled"}
              colorOn="green"
            />

            {showChampionship && (
              <div className="space-y-4 pl-6 rtl:pl-0 rtl:pr-6 border-l-2 rtl:border-l-0 rtl:border-r-2 border-green-primary/20">
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
                    <BooleanToggle
                      label={t("mustWinOne") || "Must Win One"}
                      name="mustWinOne"
                      formik={formik}
                      iconOn={<Trophy className="size-4" />}
                      iconOff={<Trophy className="size-4" />}
                      labelOn={t("mustWinOne") || "Required"}
                      labelOff="Not Required"
                      colorOn="green"
                    />
                  </div>
                </div>
              </div>
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
