"use client";
import { useState } from "react";
import { mappedArrayToSelectOptions } from "@/app/[locale]/_Lib/helps";
import { useFormik } from "formik";
import {
  Users,
  Calendar,
  Image as ImageIcon,
  ArrowLeft,
  Save,
  Plus,
  Gamepad2,
  Globe,
  Loader2,
  Search,
  ChevronDown,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  MapPin,
  FileText,
  Hash,
  Building2,
  Trophy,
  User,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import * as yup from "yup";
import { Button } from "../ui/button";
import FormSection from "../ui app/FormSection";
import FormRow from "../ui app/FormRow";
import ImageUpload from "../ui app/ImageUpload";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar as CalendarComponent } from "../ui/calendar";
import Image from "next/image";

// Validation schema
const validationSchema = yup.object({
  name: yup.string().required("nameRequired").max(100, "nameTooLong"),
  shortName: yup.string().max(20, "shortNameTooLong"),
  games: yup.array().min(1, "gamesRequired"),
  tournaments: yup.array(),
  players: yup.array(),
  description: yup.string().max(2000, "descriptionTooLong"),
  country: yup.string(),
  region: yup.string(),
  foundedDate: yup.string(),
  logoLight: yup.string(),
  logoDark: yup.string(),
  worldRanking: yup.number().min(0, "rankingMin").integer("rankingInteger").nullable(),
});

// Region options
const REGION_OPTIONS = [
  { value: "MENA", label: "MENA" },
  { value: "Europe", label: "Europe" },
  { value: "North America", label: "North America" },
  { value: "South America", label: "South America" },
  { value: "Asia Pacific", label: "Asia Pacific" },
  { value: "CIS", label: "CIS" },
  { value: "Oceania", label: "Oceania" },
];

function TeamFormRedesign({
  formType = "add",
  submit,
  team,
  countries = [],
  OptionsData: { gamesOptions = [], tournamentsOptions = [], playersOptions = [] } = {},
}) {
  const t = useTranslations("teamForm");
  const router = useRouter();

  // Helper function to format date to YYYY-MM-DD using local timezone
  const formatDateToLocal = (dateInput) => {
    if (!dateInput) return "";
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formik = useFormik({
    initialValues: {
      name: team?.name || "",
      shortName: team?.shortName || "",
      slug: team?.slug || "",
      description: team?.description || "",
      country: team?.country?.name || "",
      region: team?.region || "",
      foundedDate: formatDateToLocal(team?.foundedDate),
      logoLight: team?.logo?.light || "",
      logoDark: team?.logo?.dark || "",
      games: team?.games?.map(g => g.id || g._id) || [],
      tournaments: team?.tournaments?.map(t => t.id || t._id) || [],
      players: team?.players?.map(p => p.id || p._id) || [],
      worldRanking: team?.worldRanking ?? "",
    },
    validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      try {
        const selectedCountry = countries.find(
          (c) => c.label === values.country
        );

        // Build data object
        const dataValues = {
          ...(team ? { id: team.id || team._id } : {}),
          name: values.name,
          slug: values.slug || values.name.replace(/\s+/g, "-").toLowerCase(),
          games: values.games,
        };

        // Only add optional fields if they have values
        if (values.shortName) dataValues.shortName = values.shortName;
        if (values.description) dataValues.description = values.description;
        if (values.region) dataValues.region = values.region;
        if (values.foundedDate) dataValues.foundedDate = new Date(values.foundedDate).toISOString();
        if (values.worldRanking !== "" && values.worldRanking !== null) {
          dataValues.worldRanking = Number(values.worldRanking);
        }

        // Add tournaments and players
        if (values.tournaments?.length > 0) {
          dataValues.tournaments = values.tournaments;
        }
        if (values.players?.length > 0) {
          dataValues.players = values.players;
        }

        if (values.logoLight) {
          dataValues.logo = {
            light: values.logoLight,
            dark: values.logoDark || values.logoLight,
          };
        }

        if (selectedCountry) {
          dataValues.country = {
            name: selectedCountry.label,
            code: selectedCountry.value,
            flag: `https://flagcdn.com/w80/${selectedCountry.value.toLowerCase()}.png`,
          };
        }

        await submit(dataValues);

        toast.success(formType === "add" ? t("addSuccess") || "Team added successfully" : t("editSuccess") || "Team updated successfully");
        router.push("/dashboard/teams-management");
      } catch (error) {
        // NEXT_REDIRECT means the action succeeded and called redirect()
        if (error?.digest?.includes("NEXT_REDIRECT") || error.toString().includes("NEXT_REDIRECT")) {
          toast.success(formType === "add" ? t("addSuccess") || "Team added successfully" : t("editSuccess") || "Team updated successfully");
          throw error; // Re-throw to let Next.js handle the redirect
        } else {
          toast.error(error.message || t("error") || "An error occurred");
        }
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <FormSection
        title={t("basicInfo") || "Basic Information"}
        icon={<Building2 className="size-5" />}
        badge={
          <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded">
            {t("required") || "Required"}
          </span>
        }
      >
        {/* Team Name - Required */}
        <InputField
          label={t("name") || "Team Name"}
          name="name"
          placeholder={t("namePlaceholder") || "Enter team name"}
          formik={formik}
          icon={<Users className="size-5 text-green-primary" />}
          required
          hint={t("nameHint") || "The official name of the team"}
        />

        <FormRow cols={2}>
          {/* Short Name */}
          <InputField
            label={t("shortName") || "Short Name"}
            name="shortName"
            placeholder={t("shortNamePlaceholder") || "e.g., T1, G2"}
            formik={formik}
            icon={<Hash className="size-5 text-muted-foreground" />}
            hint={t("shortNameHint") || "Abbreviated team name (2-5 characters)"}
          />
          {/* Slug */}
          <InputField
            label={t("slug") || "Slug"}
            name="slug"
            placeholder={t("slugPlaceholder") || "auto-generated-slug"}
            formik={formik}
            hint={t("slugHint") || "URL-friendly identifier (auto-generated if empty)"}
          />
        </FormRow>
      </FormSection>

      {/* Games */}
      <FormSection
        title={t("gamesSection") || "Games"}
        icon={<Gamepad2 className="size-5" />}
        badge={
          <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded">
            {t("required") || "Required"}
          </span>
        }
      >
        <GameMultiSelectField
          label={t("selectGames") || "Select Games"}
          name="games"
          games={gamesOptions}
          formik={formik}
          placeholder={t("gamesPlaceholder") || "Select games..."}
          searchPlaceholder={t("searchGames") || "Search games..."}
          required
        />
      </FormSection>

      {/* Tournaments */}
      {tournamentsOptions.length > 0 && (
        <FormSection
          title={t("tournamentsSection") || "Tournaments"}
          icon={<Trophy className="size-5" />}
          badge={
            <span className="text-xs bg-gray-500/20 text-gray-400 px-2 py-0.5 rounded">
              {t("optional") || "Optional"}
            </span>
          }
        >
          <TournamentMultiSelectField
            label={t("selectTournaments") || "Select Tournaments"}
            name="tournaments"
            tournaments={tournamentsOptions}
            formik={formik}
            placeholder={t("tournamentsPlaceholder") || "Select tournaments..."}
            searchPlaceholder={t("searchTournaments") || "Search tournaments..."}
          />
        </FormSection>
      )}

      {/* Players / Lineup */}
      {playersOptions.length > 0 && (
        <FormSection
          title={t("playersSection") || "Players (Lineup)"}
          icon={<User className="size-5" />}
          badge={
            <span className="text-xs bg-gray-500/20 text-gray-400 px-2 py-0.5 rounded">
              {t("optional") || "Optional"}
            </span>
          }
        >
          <PlayerMultiSelectField
            label={t("selectPlayers") || "Select Players"}
            name="players"
            players={playersOptions}
            formik={formik}
            placeholder={t("playersPlaceholder") || "Select players..."}
            searchPlaceholder={t("searchPlayers") || "Search players..."}
          />
        </FormSection>
      )}

      {/* Location */}
      <FormSection
        title={t("locationSection") || "Location"}
        icon={<MapPin className="size-5" />}
        badge={
          <span className="text-xs bg-gray-500/20 text-gray-400 px-2 py-0.5 rounded">
            {t("optional") || "Optional"}
          </span>
        }
      >
        <FormRow cols={2}>
          <CountrySelectField
            label={t("country") || "Country"}
            name="country"
            countries={countries}
            formik={formik}
            placeholder={t("countryPlaceholder") || "Select country"}
            searchPlaceholder={t("searchCountries") || "Search countries..."}
          />
          <RegionSelectField
            label={t("region") || "Region"}
            name="region"
            formik={formik}
            placeholder={t("regionPlaceholder") || "Select region"}
          />
        </FormRow>
      </FormSection>

      {/* Details */}
      <FormSection
        title={t("detailsSection") || "Details"}
        icon={<Calendar className="size-5" />}
        badge={
          <span className="text-xs bg-gray-500/20 text-gray-400 px-2 py-0.5 rounded">
            {t("optional") || "Optional"}
          </span>
        }
      >
        <FormRow cols={2}>
          <DatePickerField
            label={t("foundedDate") || "Founded Date"}
            name="foundedDate"
            formik={formik}
            placeholder={t("foundedDatePlaceholder") || "Select date"}
            maxDate={new Date()}
          />
          <InputField
            label={t("worldRanking") || "World Ranking"}
            name="worldRanking"
            type="number"
            placeholder={t("worldRankingPlaceholder") || "e.g., 1"}
            formik={formik}
            icon={<Hash className="size-5 text-amber-500" />}
            hint={t("worldRankingHint") || "Global ranking position"}
          />
        </FormRow>
      </FormSection>

      {/* Description */}
      <FormSection
        title={t("descriptionSection") || "Description"}
        icon={<FileText className="size-5" />}
        badge={
          <span className="text-xs bg-gray-500/20 text-gray-400 px-2 py-0.5 rounded">
            {t("optional") || "Optional"}
          </span>
        }
      >
        <TextAreaField
          label={t("description") || "Description"}
          name="description"
          placeholder={t("descriptionPlaceholder") || "Enter team description..."}
          formik={formik}
          rows={4}
          hint={t("descriptionHint") || "Brief description of the team's history and achievements"}
        />
      </FormSection>

      {/* Images */}
      <FormSection
        title={t("imagesSection") || "Images"}
        icon={<ImageIcon className="size-5" />}
        badge={
          <span className="text-xs bg-gray-500/20 text-gray-400 px-2 py-0.5 rounded">
            {t("optional") || "Optional"}
          </span>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">{t("logoImages") || "Logo Images"}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <ImageUpload
              label={t("logoLight") || "Logo (Light)"}
              name="logoLight"
              formik={formik}
              imageType="teamLogo"
              hint={t("logoLightHint") || "Light mode logo"}
              compact
            />
            <ImageUpload
              label={t("logoDark") || "Logo (Dark)"}
              name="logoDark"
              formik={formik}
              imageType="teamLogo"
              hint={t("logoDarkHint") || "Dark mode logo"}
              compact
            />
          </div>
        </div>
      </FormSection>

      {/* Submit Button */}
      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          className="h-11 px-6 rounded-xl border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          {t("cancel") || "Cancel"}
        </Button>
        <Button
          disabled={!formik.isValid || formik.isSubmitting}
          type="submit"
          className="h-11 px-8 rounded-xl bg-green-primary hover:bg-green-primary/90 text-white font-medium disabled:opacity-50"
        >
          {formik.isSubmitting ? (
            <>
              <Loader2 className="size-4 mr-2 rtl:mr-0 rtl:ml-2 animate-spin" />
              {formType === "add" ? t("addingProgress") || "Adding..." : t("savingProgress") || "Saving..."}
            </>
          ) : (
            <>
              {formType === "add" ? (
                <Plus className="size-4 mr-2 rtl:mr-0 rtl:ml-2" />
              ) : (
                <Save className="size-4 mr-2 rtl:mr-0 rtl:ml-2" />
              )}
              {formType === "add" ? t("submit") || "Add Team" : t("save") || "Save Changes"}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

// Input Field Component
function InputField({
  label,
  name,
  type = "text",
  placeholder,
  formik,
  icon,
  required,
  hint,
}) {
  const error = formik.touched[name] && formik.errors[name];
  const t = useTranslations("teamForm");

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
          className={`w-full h-12 px-4 ${
            icon ? "pl-11 rtl:pl-4 rtl:pr-11" : ""
          } rounded-xl bg-muted/50 dark:bg-[#1a1d2e] border-0 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-green-primary/50 transition-all ${
            error ? "ring-2 ring-red-500" : ""
          }`}
        />
      </div>
      {hint && !error && (
        <p className="text-xs text-muted-foreground">{hint}</p>
      )}
      {error && <p className="text-xs text-red-500">{t(error) || error}</p>}
    </div>
  );
}

// TextArea Field Component
function TextAreaField({
  label,
  name,
  placeholder,
  formik,
  rows = 4,
  hint,
}) {
  const error = formik.touched[name] && formik.errors[name];
  const t = useTranslations("teamForm");

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-muted-foreground">
        {label}
      </label>
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
      {hint && !error && (
        <p className="text-xs text-muted-foreground">{hint}</p>
      )}
      {error && <p className="text-xs text-red-500">{t(error) || error}</p>}
    </div>
  );
}

// Country Select Field Component
function CountrySelectField({
  label,
  name,
  countries,
  formik,
  placeholder,
  searchPlaceholder,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const error = formik.touched[name] && formik.errors[name];
  const value = formik.values[name];
  const t = useTranslations("teamForm");

  const filteredCountries = (countries || []).filter(
    (country) =>
      country.label.toLowerCase().includes(search.toLowerCase()) ||
      country.value.toLowerCase().includes(search.toLowerCase())
  );

  const selectedCountry = countries?.find((c) => c.label === value);

  const handleSelect = async (country) => {
    await formik.setFieldValue(name, country.label);
    await formik.setFieldTouched(name, true, true);
    formik.validateField(name);
    setIsOpen(false);
    setSearch("");
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
      </label>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={`w-full h-12 px-4 rounded-xl bg-muted/50 dark:bg-[#1a1d2e] border border-transparent text-sm text-left rtl:text-right focus:outline-none focus:ring-2 focus:ring-green-primary/50 cursor-pointer transition-all hover:bg-muted dark:hover:bg-[#252a3d] flex items-center justify-between gap-2 ${
              error ? "ring-2 ring-red-500 border-red-500" : ""
            }`}
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {selectedCountry ? (
                <>
                  <Image
                    src={`https://flagcdn.com/w40/${selectedCountry.value.toLowerCase()}.png`}
                    alt=""
                    width={24}
                    height={18}
                    className="rounded-sm"
                    unoptimized
                  />
                  <span className="text-foreground font-medium truncate">
                    {selectedCountry.label}
                  </span>
                </>
              ) : (
                <>
                  <Globe className="size-5 text-muted-foreground" />
                  <span className="text-muted-foreground">{placeholder}</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-1">
              {value && (
                <span
                  role="button"
                  tabIndex={0}
                  onClick={handleClear}
                  onKeyDown={(e) => e.key === 'Enter' && handleClear(e)}
                  className="p-1 hover:bg-muted dark:hover:bg-[#252a3d] rounded-lg transition-colors cursor-pointer"
                >
                  <X className="size-4 text-muted-foreground" />
                </span>
              )}
              <ChevronDown className="size-4 text-muted-foreground" />
            </div>
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] p-2 bg-background border border-border rounded-xl shadow-lg"
          align="start"
        >
          <div className="relative mb-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full h-10 pl-9 pr-3 rounded-lg bg-muted/50 dark:bg-[#1a1d2e] text-sm focus:outline-none focus:ring-2 focus:ring-green-primary/50"
            />
          </div>
          <div className="max-h-64 overflow-y-auto">
            {filteredCountries?.slice(0, 50).map((country) => (
              <button
                key={country.value}
                type="button"
                onClick={() => handleSelect(country)}
                className={`w-full flex items-center gap-3 p-2 rounded-lg hover:bg-muted dark:hover:bg-[#252a3d] transition-colors text-left ${
                  value === country.label ? "bg-green-primary/10" : ""
                }`}
              >
                <Image
                  src={`https://flagcdn.com/w40/${country.value.toLowerCase()}.png`}
                  alt=""
                  width={24}
                  height={18}
                  className="rounded-sm"
                  unoptimized
                />
                <span className="text-foreground truncate">{country.label}</span>
                {value === country.label && (
                  <Check className="size-4 text-green-primary ml-auto rtl:ml-0 rtl:mr-auto" />
                )}
              </button>
            ))}
            {filteredCountries.length === 0 && (
              <p className="text-center text-muted-foreground py-4">
                {t("noCountriesFound") || "No countries found"}
              </p>
            )}
          </div>
        </PopoverContent>
      </Popover>
      {error && <p className="text-xs text-red-500">{t(error) || error}</p>}
    </div>
  );
}

// Region Select Field Component
function RegionSelectField({
  label,
  name,
  formik,
  placeholder,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const error = formik.touched[name] && formik.errors[name];
  const value = formik.values[name];
  const t = useTranslations("teamForm");

  const handleSelect = async (region) => {
    await formik.setFieldValue(name, region);
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
      <label className="text-sm font-medium text-muted-foreground">
        {label}
      </label>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={`w-full h-12 px-4 rounded-xl bg-muted/50 dark:bg-[#1a1d2e] border border-transparent text-sm text-left rtl:text-right focus:outline-none focus:ring-2 focus:ring-green-primary/50 cursor-pointer transition-all hover:bg-muted dark:hover:bg-[#252a3d] flex items-center justify-between gap-2 ${
              error ? "ring-2 ring-red-500 border-red-500" : ""
            }`}
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <MapPin className="size-5 text-muted-foreground" />
              {value ? (
                <span className="text-foreground font-medium truncate">{value}</span>
              ) : (
                <span className="text-muted-foreground">{placeholder}</span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {value && (
                <span
                  role="button"
                  tabIndex={0}
                  onClick={handleClear}
                  onKeyDown={(e) => e.key === 'Enter' && handleClear(e)}
                  className="p-1 hover:bg-muted dark:hover:bg-[#252a3d] rounded-lg transition-colors cursor-pointer"
                >
                  <X className="size-4 text-muted-foreground" />
                </span>
              )}
              <ChevronDown className="size-4 text-muted-foreground" />
            </div>
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] p-2 bg-background border border-border rounded-xl shadow-lg"
          align="start"
        >
          <div className="max-h-64 overflow-y-auto">
            {REGION_OPTIONS.map((region) => (
              <button
                key={region.value}
                type="button"
                onClick={() => handleSelect(region.value)}
                className={`w-full flex items-center gap-3 p-2 rounded-lg hover:bg-muted dark:hover:bg-[#252a3d] transition-colors text-left ${
                  value === region.value ? "bg-green-primary/10" : ""
                }`}
              >
                <MapPin className="size-4 text-muted-foreground" />
                <span className="text-foreground">{region.label}</span>
                {value === region.value && (
                  <Check className="size-4 text-green-primary ml-auto rtl:ml-0 rtl:mr-auto" />
                )}
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
      {error && <p className="text-xs text-red-500">{t(error) || error}</p>}
    </div>
  );
}

// Game Multi-Select Field Component
function GameMultiSelectField({
  label,
  name,
  games,
  formik,
  placeholder,
  searchPlaceholder,
  required,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const error = formik.touched[name] && formik.errors[name];
  const selectedIds = formik.values[name] || [];
  const t = useTranslations("teamForm");

  const filteredGames = (games || []).filter((game) =>
    game.name.toLowerCase().includes(search.toLowerCase())
  );

  const selectedGames = (games || []).filter((game) =>
    selectedIds.includes(game.id || game._id)
  );

  const handleSelect = async (gameId) => {
    const currentIds = [...selectedIds];
    const index = currentIds.indexOf(gameId);

    if (index > -1) {
      currentIds.splice(index, 1);
    } else {
      currentIds.push(gameId);
    }

    await formik.setFieldValue(name, currentIds);
    await formik.setFieldTouched(name, true, true);
    formik.validateField(name);
  };

  const handleRemove = async (e, gameId) => {
    e.stopPropagation();
    const currentIds = selectedIds.filter((id) => id !== gameId);
    await formik.setFieldValue(name, currentIds);
    await formik.setFieldTouched(name, true, true);
    formik.validateField(name);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-muted-foreground">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={`w-full min-h-12 px-4 py-2 rounded-xl bg-muted/50 dark:bg-[#1a1d2e] border border-transparent text-sm text-left rtl:text-right focus:outline-none focus:ring-2 focus:ring-green-primary/50 cursor-pointer transition-all hover:bg-muted dark:hover:bg-[#252a3d] flex items-center justify-between gap-2 ${
              error ? "ring-2 ring-red-500 border-red-500" : ""
            }`}
          >
            <div className="flex items-center gap-2 flex-wrap flex-1">
              {selectedGames.length > 0 ? (
                selectedGames.map((game) => (
                  <span
                    key={game.id || game._id}
                    className="inline-flex items-center gap-2 px-2 py-1 rounded-lg bg-green-primary/10 text-green-primary text-sm"
                  >
                    {game.logo?.light && (
                      <img
                        src={game.logo.light}
                        alt=""
                        className="size-4 rounded"
                      />
                    )}
                    {game.name}
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={(e) => handleRemove(e, game.id || game._id)}
                      onKeyDown={(e) => e.key === 'Enter' && handleRemove(e, game.id || game._id)}
                      className="hover:bg-green-primary/20 rounded-full p-0.5 cursor-pointer"
                    >
                      <X className="size-3" />
                    </span>
                  </span>
                ))
              ) : (
                <span className="text-muted-foreground flex items-center gap-2">
                  <Gamepad2 className="size-5" />
                  {placeholder}
                </span>
              )}
            </div>
            <ChevronDown className="size-4 text-muted-foreground flex-shrink-0" />
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] p-2 bg-background border border-border rounded-xl shadow-lg"
          align="start"
        >
          <div className="relative mb-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full h-10 pl-9 pr-3 rounded-lg bg-muted/50 dark:bg-[#1a1d2e] text-sm focus:outline-none focus:ring-2 focus:ring-green-primary/50"
            />
          </div>
          <div className="max-h-64 overflow-y-auto">
            {filteredGames?.map((game) => {
              const isSelected = selectedIds.includes(game.id || game._id);
              return (
                <button
                  key={game.id || game._id}
                  type="button"
                  onClick={() => handleSelect(game.id || game._id)}
                  className={`w-full flex items-center gap-3 p-2 rounded-lg hover:bg-muted dark:hover:bg-[#252a3d] transition-colors text-left ${
                    isSelected ? "bg-green-primary/10" : ""
                  }`}
                >
                  {game.logo?.light ? (
                    <img
                      src={game.logo.light}
                      alt=""
                      className="size-8 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="size-8 rounded-lg bg-muted flex items-center justify-center">
                      <Gamepad2 className="size-4 text-muted-foreground" />
                    </div>
                  )}
                  <span className="text-foreground flex-1">{game.name}</span>
                  {isSelected && (
                    <Check className="size-4 text-green-primary" />
                  )}
                </button>
              );
            })}
            {filteredGames.length === 0 && (
              <p className="text-center text-muted-foreground py-4">
                {t("noGamesFound") || "No games found"}
              </p>
            )}
          </div>
        </PopoverContent>
      </Popover>
      {error && <p className="text-xs text-red-500">{t(error) || error}</p>}
    </div>
  );
}

// Date Picker Field Component
function DatePickerField({
  label,
  name,
  formik,
  placeholder,
  maxDate,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(
    formik.values[name] ? new Date(formik.values[name]) : new Date()
  );
  const error = formik.touched[name] && formik.errors[name];
  const value = formik.values[name];
  const t = useTranslations("teamForm");

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const years = Array.from(
    { length: 100 },
    (_, i) => new Date().getFullYear() - i
  );

  // Format date to YYYY-MM-DD using local timezone
  const formatLocalDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleDateSelect = async (date) => {
    if (date) {
      await formik.setFieldValue(name, formatLocalDate(date));
      await formik.setFieldTouched(name, true, true);
      formik.validateField(name);
      setIsOpen(false);
    }
  };

  const handleClear = async (e) => {
    e.stopPropagation();
    await formik.setFieldValue(name, "");
    await formik.setFieldTouched(name, true, true);
    formik.validateField(name);
  };

  const formatDisplayDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="flex-1 space-y-2">
      <label className="text-sm font-medium text-muted-foreground">
        {label}
      </label>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={`w-full h-12 px-4 rounded-xl bg-muted/50 dark:bg-[#1a1d2e] border border-transparent text-sm text-left rtl:text-right focus:outline-none focus:ring-2 focus:ring-green-primary/50 cursor-pointer transition-all hover:bg-muted dark:hover:bg-[#252a3d] flex items-center justify-between gap-2 ${
              error ? "ring-2 ring-red-500 border-red-500" : ""
            }`}
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Calendar className="size-5 text-muted-foreground" />
              {value ? (
                <span className="text-foreground font-medium">
                  {formatDisplayDate(value)}
                </span>
              ) : (
                <span className="text-muted-foreground">{placeholder}</span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {value && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="p-1 hover:bg-muted dark:hover:bg-[#252a3d] rounded-lg transition-colors"
                >
                  <X className="size-4 text-muted-foreground" />
                </button>
              )}
            </div>
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-4 bg-background border border-border rounded-xl shadow-lg"
          align="start"
        >
          {/* Month/Year Navigation */}
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={() =>
                setViewDate(
                  new Date(viewDate.getFullYear(), viewDate.getMonth() - 1)
                )
              }
              className="p-1 hover:bg-muted rounded-lg"
            >
              <ChevronLeft className="size-4 rtl:rotate-180" />
            </button>
            <div className="flex items-center gap-2">
              <select
                value={viewDate.getMonth()}
                onChange={(e) =>
                  setViewDate(
                    new Date(viewDate.getFullYear(), parseInt(e.target.value))
                  )
                }
                className="bg-muted/50 dark:bg-[#1a1d2e] rounded-lg px-2 py-1 text-sm"
              >
                {months.map((month, index) => (
                  <option key={month} value={index}>
                    {month}
                  </option>
                ))}
              </select>
              <select
                value={viewDate.getFullYear()}
                onChange={(e) =>
                  setViewDate(
                    new Date(parseInt(e.target.value), viewDate.getMonth())
                  )
                }
                className="bg-muted/50 dark:bg-[#1a1d2e] rounded-lg px-2 py-1 text-sm"
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
              onClick={() =>
                setViewDate(
                  new Date(viewDate.getFullYear(), viewDate.getMonth() + 1)
                )
              }
              className="p-1 hover:bg-muted rounded-lg"
            >
              <ChevronRight className="size-4 rtl:rotate-180" />
            </button>
          </div>
          <CalendarComponent
            mode="single"
            selected={value ? new Date(value) : undefined}
            onSelect={handleDateSelect}
            month={viewDate}
            onMonthChange={setViewDate}
            disabled={maxDate ? { after: maxDate } : undefined}
            className="rounded-md"
          />
        </PopoverContent>
      </Popover>
      {error && <p className="text-xs text-red-500">{t(error) || error}</p>}
    </div>
  );
}

// Tournament Multi-Select Field Component
function TournamentMultiSelectField({
  label,
  name,
  tournaments,
  formik,
  placeholder,
  searchPlaceholder,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const error = formik.touched[name] && formik.errors[name];
  const selectedIds = formik.values[name] || [];
  const t = useTranslations("teamForm");

  const filteredTournaments = (tournaments || []).filter((tournament) =>
    tournament.name.toLowerCase().includes(search.toLowerCase())
  );

  const selectedTournaments = (tournaments || []).filter((tournament) =>
    selectedIds.includes(tournament.id || tournament._id)
  );

  const handleSelect = async (tournamentId) => {
    const currentIds = [...selectedIds];
    const index = currentIds.indexOf(tournamentId);

    if (index > -1) {
      currentIds.splice(index, 1);
    } else {
      currentIds.push(tournamentId);
    }

    await formik.setFieldValue(name, currentIds);
    await formik.setFieldTouched(name, true, true);
    formik.validateField(name);
  };

  const handleRemove = async (e, tournamentId) => {
    e.stopPropagation();
    e.preventDefault();
    const currentIds = selectedIds.filter((id) => id !== tournamentId);
    await formik.setFieldValue(name, currentIds);
    await formik.setFieldTouched(name, true, true);
    formik.validateField(name);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-muted-foreground">
        {label}
      </label>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <div
            role="button"
            tabIndex={0}
            className={`w-full min-h-12 px-4 py-2 rounded-xl bg-muted/50 dark:bg-[#1a1d2e] border border-transparent text-sm text-left rtl:text-right focus:outline-none focus:ring-2 focus:ring-green-primary/50 cursor-pointer transition-all hover:bg-muted dark:hover:bg-[#252a3d] flex items-center justify-between gap-2 ${
              error ? "ring-2 ring-red-500 border-red-500" : ""
            }`}
          >
            <div className="flex items-center gap-2 flex-wrap flex-1">
              {selectedTournaments.length > 0 ? (
                selectedTournaments.map((tournament) => (
                  <span
                    key={tournament.id || tournament._id}
                    className="inline-flex items-center gap-2 px-2 py-1 rounded-lg bg-yellow-500/10 text-yellow-500 text-sm"
                  >
                    {tournament.logo?.light && (
                      <img
                        src={tournament.logo.light}
                        alt=""
                        className="size-4 rounded"
                      />
                    )}
                    {tournament.name}
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={(e) => handleRemove(e, tournament.id || tournament._id)}
                      onKeyDown={(e) => e.key === 'Enter' && handleRemove(e, tournament.id || tournament._id)}
                      className="hover:bg-yellow-500/20 rounded-full p-0.5 cursor-pointer"
                    >
                      <X className="size-3" />
                    </span>
                  </span>
                ))
              ) : (
                <span className="text-muted-foreground flex items-center gap-2">
                  <Trophy className="size-5" />
                  {placeholder}
                </span>
              )}
            </div>
            <ChevronDown className="size-4 text-muted-foreground flex-shrink-0" />
          </div>
        </PopoverTrigger>
        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] p-2 bg-background border border-border rounded-xl shadow-lg"
          align="start"
        >
          <div className="relative mb-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full h-10 pl-9 pr-3 rounded-lg bg-muted/50 dark:bg-[#1a1d2e] text-sm focus:outline-none focus:ring-2 focus:ring-green-primary/50"
            />
          </div>
          <div className="max-h-64 overflow-y-auto">
            {filteredTournaments?.map((tournament) => {
              const isSelected = selectedIds.includes(tournament.id || tournament._id);
              return (
                <button
                  key={tournament.id || tournament._id}
                  type="button"
                  onClick={() => handleSelect(tournament.id || tournament._id)}
                  className={`w-full flex items-center gap-3 p-2 rounded-lg hover:bg-muted dark:hover:bg-[#252a3d] transition-colors text-left ${
                    isSelected ? "bg-yellow-500/10" : ""
                  }`}
                >
                  {tournament.logo?.light ? (
                    <img
                      src={tournament.logo.light}
                      alt=""
                      className="size-8 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="size-8 rounded-lg bg-muted flex items-center justify-center">
                      <Trophy className="size-4 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <span className="text-foreground block truncate">{tournament.name}</span>
                    {tournament.status && (
                      <span className={`text-xs px-1.5 py-0.5 rounded ${
                        tournament.status === 'completed' ? 'bg-green-500/10 text-green-500' :
                        tournament.status === 'ongoing' ? 'bg-blue-500/10 text-blue-500' :
                        'bg-yellow-500/10 text-yellow-500'
                      }`}>
                        {tournament.status}
                      </span>
                    )}
                  </div>
                  {isSelected && (
                    <Check className="size-4 text-yellow-500" />
                  )}
                </button>
              );
            })}
            {filteredTournaments.length === 0 && (
              <p className="text-center text-muted-foreground py-4">
                {t("noTournamentsFound") || "No tournaments found"}
              </p>
            )}
          </div>
        </PopoverContent>
      </Popover>
      {error && <p className="text-xs text-red-500">{t(error) || error}</p>}
    </div>
  );
}

// Player Multi-Select Field Component
function PlayerMultiSelectField({
  label,
  name,
  players,
  formik,
  placeholder,
  searchPlaceholder,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const error = formik.touched[name] && formik.errors[name];
  const selectedIds = formik.values[name] || [];
  const t = useTranslations("teamForm");

  const filteredPlayers = (players || []).filter((player) => {
    const searchLower = search.toLowerCase();
    const nickname = player.nickname || '';
    const fullName = player.fullName || '';
    const firstName = player.firstName || '';
    const lastName = player.lastName || '';
    return nickname.toLowerCase().includes(searchLower) ||
      fullName.toLowerCase().includes(searchLower) ||
      firstName.toLowerCase().includes(searchLower) ||
      lastName.toLowerCase().includes(searchLower);
  });

  const selectedPlayers = (players || []).filter((player) =>
    selectedIds.includes(player.id || player._id)
  );

  const handleSelect = async (playerId) => {
    const currentIds = [...selectedIds];
    const index = currentIds.indexOf(playerId);

    if (index > -1) {
      currentIds.splice(index, 1);
    } else {
      currentIds.push(playerId);
    }

    await formik.setFieldValue(name, currentIds);
    await formik.setFieldTouched(name, true, true);
    formik.validateField(name);
  };

  const handleRemove = async (e, playerId) => {
    e.stopPropagation();
    e.preventDefault();
    const currentIds = selectedIds.filter((id) => id !== playerId);
    await formik.setFieldValue(name, currentIds);
    await formik.setFieldTouched(name, true, true);
    formik.validateField(name);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-muted-foreground">
        {label}
      </label>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <div
            role="button"
            tabIndex={0}
            className={`w-full min-h-12 px-4 py-2 rounded-xl bg-muted/50 dark:bg-[#1a1d2e] border border-transparent text-sm text-left rtl:text-right focus:outline-none focus:ring-2 focus:ring-green-primary/50 cursor-pointer transition-all hover:bg-muted dark:hover:bg-[#252a3d] flex items-center justify-between gap-2 ${
              error ? "ring-2 ring-red-500 border-red-500" : ""
            }`}
          >
            <div className="flex items-center gap-2 flex-wrap flex-1">
              {selectedPlayers.length > 0 ? (
                selectedPlayers.map((player) => (
                  <span
                    key={player.id || player._id}
                    className="inline-flex items-center gap-2 px-2 py-1 rounded-lg bg-blue-500/10 text-blue-500 text-sm"
                  >
                    {player.photo?.light && (
                      <img
                        src={player.photo.light}
                        alt=""
                        className="size-4 rounded-full"
                      />
                    )}
                    {player.nickname || player.fullName || `${player.firstName || ''} ${player.lastName || ''}`.trim() || 'Unknown'}
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={(e) => handleRemove(e, player.id || player._id)}
                      onKeyDown={(e) => e.key === 'Enter' && handleRemove(e, player.id || player._id)}
                      className="hover:bg-blue-500/20 rounded-full p-0.5 cursor-pointer"
                    >
                      <X className="size-3" />
                    </span>
                  </span>
                ))
              ) : (
                <span className="text-muted-foreground flex items-center gap-2">
                  <User className="size-5" />
                  {placeholder}
                </span>
              )}
            </div>
            <ChevronDown className="size-4 text-muted-foreground flex-shrink-0" />
          </div>
        </PopoverTrigger>
        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] p-2 bg-background border border-border rounded-xl shadow-lg"
          align="start"
        >
          <div className="relative mb-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full h-10 pl-9 pr-3 rounded-lg bg-muted/50 dark:bg-[#1a1d2e] text-sm focus:outline-none focus:ring-2 focus:ring-green-primary/50"
            />
          </div>
          <div className="max-h-64 overflow-y-auto">
            {filteredPlayers?.map((player) => {
              const isSelected = selectedIds.includes(player.id || player._id);
              return (
                <button
                  key={player.id || player._id}
                  type="button"
                  onClick={() => handleSelect(player.id || player._id)}
                  className={`w-full flex items-center gap-3 p-2 rounded-lg hover:bg-muted dark:hover:bg-[#252a3d] transition-colors text-left ${
                    isSelected ? "bg-blue-500/10" : ""
                  }`}
                >
                  {player.photo?.light ? (
                    <img
                      src={player.photo.light}
                      alt=""
                      className="size-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="size-8 rounded-full bg-muted flex items-center justify-center">
                      <User className="size-4 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <span className="text-foreground block truncate">{player.nickname || player.fullName || `${player.firstName || ''} ${player.lastName || ''}`.trim() || 'Unknown'}</span>
                    {player.nickname && (player.firstName || player.lastName) && (
                      <span className="text-xs text-muted-foreground">
                        {[player.firstName, player.lastName].filter(Boolean).join(' ')}
                      </span>
                    )}
                  </div>
                  {player.country?.flag && (
                    <img src={player.country.flag} alt="" className="size-5 rounded" />
                  )}
                  {isSelected && (
                    <Check className="size-4 text-blue-500" />
                  )}
                </button>
              );
            })}
            {filteredPlayers.length === 0 && (
              <p className="text-center text-muted-foreground py-4">
                {t("noPlayersFound") || "No players found"}
              </p>
            )}
          </div>
        </PopoverContent>
      </Popover>
      {error && <p className="text-xs text-red-500">{t(error) || error}</p>}
    </div>
  );
}

export default TeamFormRedesign;
