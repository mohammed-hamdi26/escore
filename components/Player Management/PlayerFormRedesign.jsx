"use client";
import { useState } from "react";
import { mappedArrayToSelectOptions } from "@/app/[locale]/_Lib/helps";
import { useFormik } from "formik";
import {
  User,
  Calendar,
  Image as ImageIcon,
  Users,
  ArrowLeft,
  Save,
  Plus,
  AlertCircle,
  Gamepad2,
  Globe,
  Loader2,
  Search,
  ChevronDown,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Sparkles,
  Trophy,
  DollarSign,
  Award,
  Briefcase,
  FileText,
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

// Validation schema - fullName and game are required
const validationSchema = yup.object({
  fullName: yup.string().required("fullNameRequired").max(100, "fullNameTooLong"),
  nickname: yup.string().max(50, "nicknameTooLong"),
  mainGame: yup.string().required("gameRequired"),
  dateOfBirth: yup.string(),
  country: yup.string(),
  photoLight: yup.string(),
  photoDark: yup.string(),
  team: yup.string().nullable(),
  tournaments: yup.array().of(yup.string()),
  role: yup.string().max(50, "roleTooLong"),
  bio: yup.string().max(2000, "bioTooLong"),
  ranking: yup.number().min(0, "rankingMin").integer("rankingInteger").nullable(),
  marketValue: yup.number().min(0, "marketValueMin").nullable(),
});

function PlayerFormRedesign({
  formType = "add",
  submit,
  player,
  countries = [],
  OptionsData: { teamsOptions = [], gamesOptions = [], tournamentsOptions = [] } = {},
}) {
  const t = useTranslations("playerForm");
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
      fullName: player?.fullName || "",
      nickname: player?.nickname || "",
      dateOfBirth: player?.dateOfBirth
        ? formatDateToLocal(player.dateOfBirth)
        : "2000-01-01",
      country: player?.country?.name || "",
      photoLight: player?.photo?.light || "",
      photoDark: player?.photo?.dark || "",
      team: player?.team?.id || "",
      tournaments: player?.tournaments?.map(t => t.id || t._id) || [],
      mainGame: player?.game?.id || "",
      role: player?.role || "",
      bio: player?.bio || "",
      ranking: player?.ranking ?? "",
      marketValue: player?.marketValue ?? "",
    },
    validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      try {
        const selectedCountry = countries.find(
          (c) => c.label === values.country
        );

        // Build data object - fullName and game are required
        const dataValues = {
          ...(player ? { id: player.id } : {}),
          fullName: values.fullName,
          slug: `${values.fullName}`.replace(/\s+/g, "-").toLowerCase(),
          game: values.mainGame,
        };

        // Only add optional fields if they have values
        if (values.nickname) dataValues.nickname = values.nickname;
        if (values.dateOfBirth) dataValues.dateOfBirth = new Date(values.dateOfBirth).toISOString();
        if (values.photoLight) {
          dataValues.photo = {
            light: values.photoLight,
            dark: values.photoDark || values.photoLight,
          };
        }
        if (values.team) dataValues.team = values.team;
        if (values.tournaments && values.tournaments.length > 0) dataValues.tournaments = values.tournaments;
        if (selectedCountry) {
          dataValues.country = {
            name: selectedCountry.label,
            code: selectedCountry.value,
            flag: `https://flagcdn.com/w80/${selectedCountry.value.toLowerCase()}.png`,
          };
        }
        if (values.role) dataValues.role = values.role;
        if (values.bio) dataValues.bio = values.bio;
        if (values.ranking !== "" && values.ranking !== null) dataValues.ranking = Number(values.ranking);
        if (values.marketValue !== "" && values.marketValue !== null) dataValues.marketValue = Number(values.marketValue);

        await submit(dataValues);

        if (formType === "add") {
          formik.resetForm();
        }

        toast.success(formType === "add" ? t("addSuccess") : t("editSuccess"));
      } catch (error) {
        if (!error.toString().includes("NEXT_REDIRECT")) {
          toast.error(error.message || t("error"));
        } else {
          toast.success(
            formType === "add" ? t("addSuccess") : t("editSuccess")
          );
        }
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <FormSection
        title={t("basicInfo")}
        icon={<User className="size-5" />}
        badge={
          <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded">
            {t("required")}
          </span>
        }
      >
        {/* Full Name - Required */}
        <InputField
          label={t("fullName")}
          name="fullName"
          placeholder={t("fullNamePlaceholder")}
          formik={formik}
          icon={<User className="size-5 text-green-primary" />}
          required
          hint={t("fullNameHint")}
        />

        <FormRow cols={2}>
          {/* Nickname - Optional */}
          <InputField
            label={t("nickname")}
            name="nickname"
            placeholder={t("nicknamePlaceholder")}
            formik={formik}
            icon={<Sparkles className="size-5 text-muted-foreground" />}
            hint={t("nicknameHint")}
          />
          {/* Role */}
          <RoleSelectField
            label={t("role")}
            name="role"
            placeholder={t("rolePlaceholder")}
            formik={formik}
            hint={t("roleHint")}
          />
        </FormRow>
      </FormSection>

      {/* Game & Team */}
      <FormSection
        title={t("teamAndGame")}
        icon={<Gamepad2 className="size-5" />}
        badge={
          <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded">
            {t("required")}
          </span>
        }
      >
        <FormRow cols={2}>
          <TeamSelectField
            label={t("team")}
            name="team"
            teams={teamsOptions}
            formik={formik}
            placeholder={t("teamPlaceholder")}
            searchPlaceholder={t("searchTeams") || "Search teams..."}
            onTeamChange={() => formik.setFieldValue("mainGame", "")}
          />
          <GameSelectField
            label={t("mainGame")}
            name="mainGame"
            games={
              teamsOptions.find((team) => team.id === formik.values.team)
                ?.games || gamesOptions
            }
            formik={formik}
            placeholder={t("mainGamePlaceholder")}
            searchPlaceholder={t("searchGames") || "Search games..."}
            required
          />
        </FormRow>
      </FormSection>

      {/* Tournaments */}
      <FormSection
        title={t("tournamentsSection") || t("Tournaments") || "Tournament Participation"}
        icon={<Trophy className="size-5" />}
        badge={
          <span className="text-xs bg-gray-500/20 text-gray-400 px-2 py-0.5 rounded">
            {t("optional")}
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

      {/* Personal Details */}
      <FormSection
        title={t("personalDetails")}
        icon={<Calendar className="size-5" />}
        badge={
          <span className="text-xs bg-gray-500/20 text-gray-400 px-2 py-0.5 rounded">
            {t("optional")}
          </span>
        }
      >
        <FormRow cols={2}>
          <DatePickerField
            label={t("birthDate")}
            name="dateOfBirth"
            formik={formik}
            placeholder={t("birthDatePlaceholder")}
            maxDate={new Date()}
          />
          <CountrySelectField
            label={t("country")}
            name="country"
            countries={countries}
            formik={formik}
            placeholder={t("countryPlaceholder")}
            searchPlaceholder={t("searchCountries") || "Search countries..."}
          />
        </FormRow>
      </FormSection>

      {/* Player Stats */}
      <FormSection
        title={t("playerStats")}
        icon={<Trophy className="size-5" />}
        badge={
          <span className="text-xs bg-gray-500/20 text-gray-400 px-2 py-0.5 rounded">
            {t("optional")}
          </span>
        }
      >
        <FormRow cols={2}>
          <InputField
            label={t("worldRanking")}
            name="ranking"
            type="number"
            placeholder={t("worldRankingPlaceholder")}
            formik={formik}
            icon={<Trophy className="size-5 text-amber-500" />}
            hint={t("worldRankingHint")}
          />
          <InputField
            label={t("marketValue")}
            name="marketValue"
            type="number"
            placeholder={t("marketValuePlaceholder")}
            formik={formik}
            icon={<DollarSign className="size-5 text-green-500" />}
            hint={t("marketValueHint")}
          />
        </FormRow>
      </FormSection>

      {/* Bio */}
      <FormSection
        title={t("bioSection")}
        icon={<FileText className="size-5" />}
        badge={
          <span className="text-xs bg-gray-500/20 text-gray-400 px-2 py-0.5 rounded">
            {t("optional")}
          </span>
        }
      >
        <TextAreaField
          label={t("bio")}
          name="bio"
          placeholder={t("bioPlaceholder")}
          formik={formik}
          rows={4}
          hint={t("bioHint")}
        />
      </FormSection>

      {/* Profile Photos */}
      <FormSection
        title={t("profilePhotos")}
        icon={<ImageIcon className="size-5" />}
        badge={
          <span className="text-xs bg-gray-500/20 text-gray-400 px-2 py-0.5 rounded">
            {t("optional")}
          </span>
        }
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <ImageUpload
            label={t("photoLight")}
            name="photoLight"
            formik={formik}
            aspectRatio="square"
            hint={t("photoLightHint")}
            compact
          />
          <ImageUpload
            label={t("photoDark")}
            name="photoDark"
            formik={formik}
            aspectRatio="square"
            hint={t("photoDarkHint")}
            compact
          />
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
          {t("cancel")}
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
              {formType === "add" ? t("submit") : t("save")}
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
  const t = useTranslations("playerForm");

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
      {error && <p className="text-xs text-red-500">{t(error)}</p>}
    </div>
  );
}

// Predefined esports roles
const ESPORTS_ROLES = [
  // MOBA Roles
  { value: "Mid Laner", category: "MOBA" },
  { value: "Jungler", category: "MOBA" },
  { value: "Top Laner", category: "MOBA" },
  { value: "ADC", category: "MOBA" },
  { value: "Support", category: "MOBA" },
  { value: "Gold Laner", category: "MOBA" },
  { value: "EXP Laner", category: "MOBA" },
  { value: "Roamer", category: "MOBA" },
  // FPS Roles
  { value: "Entry Fragger", category: "FPS" },
  { value: "AWPer", category: "FPS" },
  { value: "IGL", category: "FPS" },
  { value: "Lurker", category: "FPS" },
  { value: "Rifler", category: "FPS" },
  { value: "Controller", category: "FPS" },
  { value: "Duelist", category: "FPS" },
  { value: "Initiator", category: "FPS" },
  { value: "Sentinel", category: "FPS" },
  // General Roles
  { value: "Captain", category: "General" },
  { value: "Coach", category: "General" },
  { value: "Analyst", category: "General" },
  { value: "Substitute", category: "General" },
  { value: "Flex", category: "General" },
];

// Role Select Field Component
function RoleSelectField({
  label,
  name,
  formik,
  placeholder,
  hint,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const error = formik.touched[name] && formik.errors[name];
  const value = formik.values[name];
  const t = useTranslations("playerForm");

  const filteredRoles = ESPORTS_ROLES.filter(
    (role) => role.value.toLowerCase().includes(search.toLowerCase())
  );

  // Group roles by category
  const groupedRoles = filteredRoles.reduce((acc, role) => {
    if (!acc[role.category]) acc[role.category] = [];
    acc[role.category].push(role);
    return acc;
  }, {});

  const handleSelect = async (role) => {
    await formik.setFieldValue(name, role);
    await formik.setFieldTouched(name, true, true);
    formik.validateField(name);
    setIsOpen(false);
    setSearch("");
  };

  const handleCustomInput = async () => {
    if (search.trim()) {
      await formik.setFieldValue(name, search.trim());
      await formik.setFieldTouched(name, true, true);
      formik.validateField(name);
      setIsOpen(false);
      setSearch("");
    }
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
          <div
            role="button"
            tabIndex={0}
            className={`w-full h-12 px-4 rounded-xl bg-muted/50 dark:bg-[#1a1d2e] border border-transparent text-sm text-left rtl:text-right focus:outline-none focus:ring-2 focus:ring-green-primary/50 cursor-pointer transition-all hover:bg-muted dark:hover:bg-[#252a3d] flex items-center justify-between gap-2 ${
              error ? "ring-2 ring-red-500 border-red-500" : ""
            }`}
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="size-8 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                <Briefcase className="size-4 text-purple-500" />
              </div>
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
              placeholder="Search or type custom role..."
              className="w-full h-10 pl-9 pr-3 rounded-lg bg-muted/50 dark:bg-[#1a1d2e] text-sm focus:outline-none focus:ring-2 focus:ring-green-primary/50"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleCustomInput();
                }
              }}
            />
          </div>
          <div className="max-h-64 overflow-y-auto space-y-2">
            {/* Custom input option */}
            {search.trim() && !ESPORTS_ROLES.some(r => r.value.toLowerCase() === search.toLowerCase()) && (
              <button
                type="button"
                onClick={handleCustomInput}
                className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-muted dark:hover:bg-[#252a3d] transition-colors text-left"
              >
                <div className="size-8 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                  <Plus className="size-4 text-green-500" />
                </div>
                <span className="text-foreground">Use "{search}"</span>
              </button>
            )}
            {/* Grouped roles */}
            {Object.entries(groupedRoles).map(([category, roles]) => (
              <div key={category}>
                <div className="text-xs font-semibold text-muted-foreground px-2 py-1 uppercase tracking-wider">
                  {category}
                </div>
                {roles.map((role) => (
                  <button
                    key={role.value}
                    type="button"
                    onClick={() => handleSelect(role.value)}
                    className={`w-full flex items-center gap-3 p-2 rounded-lg hover:bg-muted dark:hover:bg-[#252a3d] transition-colors text-left ${
                      value === role.value ? "bg-green-primary/10" : ""
                    }`}
                  >
                    <div className={`size-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      category === "MOBA" ? "bg-blue-500/10" :
                      category === "FPS" ? "bg-red-500/10" : "bg-gray-500/10"
                    }`}>
                      <Briefcase className={`size-4 ${
                        category === "MOBA" ? "text-blue-500" :
                        category === "FPS" ? "text-red-500" : "text-gray-500"
                      }`} />
                    </div>
                    <span className="text-foreground">{role.value}</span>
                    {value === role.value && (
                      <Check className="size-4 text-green-primary ml-auto" />
                    )}
                  </button>
                ))}
              </div>
            ))}
            {filteredRoles.length === 0 && !search.trim() && (
              <p className="text-center text-muted-foreground py-4">No roles found</p>
            )}
          </div>
        </PopoverContent>
      </Popover>
      {hint && !error && (
        <p className="text-xs text-muted-foreground">{hint}</p>
      )}
      {error && <p className="text-xs text-red-500">{t(error)}</p>}
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
  const t = useTranslations("playerForm");

  return (
    <div className="flex-1 space-y-2">
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
      {error && <p className="text-xs text-red-500">{t(error)}</p>}
    </div>
  );
}

// Game Select Field
function GameSelectField({
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
  const value = formik.values[name];
  const t = useTranslations("playerForm");

  // Helper to get game ID (handles both id and _id from different sources)
  const getGameId = (game) => game?.id || game?._id;

  const selectedGame = games?.find((g) => getGameId(g) === value);

  const filteredGames = games?.filter(
    (game) =>
      game.name?.toLowerCase().includes(search.toLowerCase()) ||
      game.slug?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = async (game) => {
    await formik.setFieldValue(name, getGameId(game));
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
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <div
            role="button"
            tabIndex={0}
            className={`w-full h-12 px-4 rounded-xl bg-muted/50 dark:bg-[#1a1d2e] border border-transparent text-sm text-left rtl:text-right focus:outline-none focus:ring-2 focus:ring-green-primary/50 cursor-pointer transition-all hover:bg-muted dark:hover:bg-[#252a3d] flex items-center justify-between gap-2 ${
              error ? "ring-2 ring-red-500 border-red-500" : ""
            }`}
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {selectedGame ? (
                <>
                  <div className="size-8 rounded-lg overflow-hidden flex-shrink-0 bg-green-primary/10 flex items-center justify-center">
                    {selectedGame.logo?.light ? (
                      <img
                        src={selectedGame.logo.light}
                        alt={selectedGame.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Gamepad2 className="size-4 text-green-primary" />
                    )}
                  </div>
                  <span className="text-foreground font-medium truncate">
                    {selectedGame.name}
                  </span>
                </>
              ) : (
                <>
                  <div className="size-8 rounded-lg bg-muted dark:bg-[#252a3d] flex items-center justify-center flex-shrink-0">
                    <Gamepad2 className="size-4 text-muted-foreground" />
                  </div>
                  <span className="text-muted-foreground">{placeholder}</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-1">
              {selectedGame && (
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
                className={`size-4 text-muted-foreground transition-transform ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </div>
          </div>
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
                placeholder={searchPlaceholder}
                className="w-full h-10 pl-10 pr-4 rtl:pl-4 rtl:pr-10 rounded-lg bg-muted/50 dark:bg-[#1a1d2e] border-0 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-green-primary/50"
                autoFocus
              />
            </div>
          </div>

          {/* Games List */}
          <div className="max-h-64 overflow-y-auto p-2">
            {filteredGames?.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                No games found
              </div>
            ) : (
              filteredGames?.map((game) => {
                const gameId = getGameId(game);
                const isSelected = value === gameId;
                return (
                  <button
                    key={gameId}
                    type="button"
                    onClick={() => handleSelect(game)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left rtl:text-right transition-colors ${
                      isSelected
                        ? "bg-green-primary/10 text-green-primary"
                        : "hover:bg-muted dark:hover:bg-[#1a1d2e]"
                    }`}
                  >
                    <div className="size-8 rounded-lg overflow-hidden flex-shrink-0 bg-muted dark:bg-[#252a3d]">
                      {game.logo?.light ? (
                        <img
                          src={game.logo.light}
                          alt={game.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Gamepad2 className="size-4 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <span
                      className={`flex-1 text-sm font-medium ${
                        isSelected ? "text-green-primary" : "text-foreground"
                      }`}
                    >
                      {game.name}
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
      {error && <p className="text-xs text-red-500">{t(error)}</p>}
    </div>
  );
}

// Team Select Field
function TeamSelectField({
  label,
  name,
  teams,
  formik,
  placeholder,
  searchPlaceholder,
  onTeamChange,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const error = formik.touched[name] && formik.errors[name];
  const value = formik.values[name];

  // Helper to get team ID (handles both id and _id)
  const getTeamId = (team) => team?.id || team?._id;

  const selectedTeam = teams?.find((t) => getTeamId(t) === value);

  const filteredTeams = teams?.filter(
    (team) =>
      team.name?.toLowerCase().includes(search.toLowerCase()) ||
      team.slug?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = async (team) => {
    await formik.setFieldValue(name, getTeamId(team));
    await formik.setFieldTouched(name, true, true);
    formik.validateField(name);
    if (onTeamChange) onTeamChange();
    setIsOpen(false);
    setSearch("");
  };

  const handleClear = async (e) => {
    e.stopPropagation();
    await formik.setFieldValue(name, "");
    await formik.setFieldTouched(name, true, true);
    formik.validateField(name);
    if (onTeamChange) onTeamChange();
  };

  return (
    <div className="flex-1 space-y-2">
      <label className="text-sm font-medium text-muted-foreground">
        {label}
      </label>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <div
            role="button"
            tabIndex={0}
            className={`w-full h-12 px-4 rounded-xl bg-muted/50 dark:bg-[#1a1d2e] border border-transparent text-sm text-left rtl:text-right focus:outline-none focus:ring-2 focus:ring-green-primary/50 cursor-pointer transition-all hover:bg-muted dark:hover:bg-[#252a3d] flex items-center justify-between gap-2 ${
              error ? "ring-2 ring-red-500 border-red-500" : ""
            }`}
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {selectedTeam ? (
                <>
                  <div className="size-8 rounded-lg overflow-hidden flex-shrink-0 bg-blue-500/10 flex items-center justify-center">
                    {selectedTeam.logo?.light ? (
                      <img
                        src={selectedTeam.logo.light}
                        alt={selectedTeam.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Users className="size-4 text-blue-500" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-foreground font-medium truncate">
                      {selectedTeam.name}
                    </span>
                    {selectedTeam.games?.length > 0 && (
                      <span className="text-xs text-muted-foreground bg-muted dark:bg-[#252a3d] px-2 py-0.5 rounded">
                        {selectedTeam.games.length} games
                      </span>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="size-8 rounded-lg bg-muted dark:bg-[#252a3d] flex items-center justify-center flex-shrink-0">
                    <Users className="size-4 text-muted-foreground" />
                  </div>
                  <span className="text-muted-foreground">{placeholder}</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-1">
              {selectedTeam && (
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
                className={`size-4 text-muted-foreground transition-transform ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </div>
          </div>
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
                placeholder={searchPlaceholder}
                className="w-full h-10 pl-10 pr-4 rtl:pl-4 rtl:pr-10 rounded-lg bg-muted/50 dark:bg-[#1a1d2e] border-0 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-green-primary/50"
                autoFocus
              />
            </div>
          </div>

          {/* Teams List */}
          <div className="max-h-64 overflow-y-auto p-2">
            {filteredTeams?.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                No teams found
              </div>
            ) : (
              filteredTeams?.map((team) => {
                const teamId = getTeamId(team);
                const isSelected = value === teamId;
                return (
                  <button
                    key={teamId}
                    type="button"
                    onClick={() => handleSelect(team)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left rtl:text-right transition-colors ${
                      isSelected
                        ? "bg-blue-500/10 text-blue-500"
                        : "hover:bg-muted dark:hover:bg-[#1a1d2e]"
                    }`}
                  >
                    <div className="size-8 rounded-lg overflow-hidden flex-shrink-0 bg-muted dark:bg-[#252a3d]">
                      {team.logo?.light ? (
                        <img
                          src={team.logo.light}
                          alt={team.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Users className="size-4 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span
                        className={`text-sm font-medium ${
                          isSelected ? "text-blue-500" : "text-foreground"
                        }`}
                      >
                        {team.name}
                      </span>
                    </div>
                    {team.games?.length > 0 && (
                      <span className="text-xs text-muted-foreground bg-muted dark:bg-[#252a3d] px-2 py-0.5 rounded">
                        {team.games.length}
                      </span>
                    )}
                    {isSelected && (
                      <Check className="size-4 text-blue-500 flex-shrink-0" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

// Tournament Multi-Select Field
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
  const value = formik.values[name] || [];

  // Helper to get tournament ID
  const getTournamentId = (tournament) => tournament?.id || tournament?._id;

  const selectedTournaments = tournaments?.filter((t) =>
    value.includes(getTournamentId(t))
  );

  const filteredTournaments = tournaments?.filter(
    (tournament) =>
      tournament.name?.toLowerCase().includes(search.toLowerCase()) ||
      tournament.slug?.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggle = async (tournament) => {
    const tournamentId = getTournamentId(tournament);
    const currentValue = [...value];
    const index = currentValue.indexOf(tournamentId);

    if (index === -1) {
      currentValue.push(tournamentId);
    } else {
      currentValue.splice(index, 1);
    }

    await formik.setFieldValue(name, currentValue);
    await formik.setFieldTouched(name, true, true);
    formik.validateField(name);
  };

  const handleRemove = async (tournamentId, e) => {
    e?.stopPropagation();
    const currentValue = (value || []).filter((id) => id !== tournamentId);
    await formik.setFieldValue(name, currentValue);
    await formik.setFieldTouched(name, true, true);
    formik.validateField(name);
  };

  const handleClearAll = async (e) => {
    e.stopPropagation();
    await formik.setFieldValue(name, []);
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
          <div
            role="button"
            tabIndex={0}
            className={`w-full min-h-12 px-4 py-2 rounded-xl bg-muted/50 dark:bg-[#1a1d2e] border border-transparent text-sm text-left rtl:text-right focus:outline-none focus:ring-2 focus:ring-green-primary/50 cursor-pointer transition-all hover:bg-muted dark:hover:bg-[#252a3d] flex items-center justify-between gap-2 ${
              error ? "ring-2 ring-red-500 border-red-500" : ""
            }`}
          >
            <div className="flex items-center gap-2 flex-1 min-w-0 flex-wrap">
              {selectedTournaments?.length > 0 ? (
                selectedTournaments.map((tournament) => (
                  <span
                    key={getTournamentId(tournament)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-500 text-xs font-medium"
                  >
                    {tournament.logo?.light && (
                      <img
                        src={tournament.logo.light}
                        alt={tournament.name}
                        className="size-4 rounded object-cover"
                      />
                    )}
                    <span className="truncate max-w-[120px]">{tournament.name}</span>
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={(e) => handleRemove(getTournamentId(tournament), e)}
                      onKeyDown={(e) => e.key === "Enter" && handleRemove(getTournamentId(tournament), e)}
                      className="hover:bg-amber-500/30 rounded p-0.5 cursor-pointer"
                    >
                      <X className="size-3" />
                    </span>
                  </span>
                ))
              ) : (
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-lg bg-muted dark:bg-[#252a3d] flex items-center justify-center flex-shrink-0">
                    <Trophy className="size-4 text-muted-foreground" />
                  </div>
                  <span className="text-muted-foreground">{placeholder}</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              {selectedTournaments?.length > 0 && (
                <span
                  role="button"
                  tabIndex={0}
                  onClick={handleClearAll}
                  onKeyDown={(e) => e.key === "Enter" && handleClearAll(e)}
                  className="size-7 rounded-lg hover:bg-red-500/20 flex items-center justify-center transition-colors group cursor-pointer"
                >
                  <X className="size-4 text-muted-foreground group-hover:text-red-500" />
                </span>
              )}
              <ChevronDown
                className={`size-4 text-muted-foreground transition-transform ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </div>
          </div>
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
                placeholder={searchPlaceholder}
                className="w-full h-10 pl-10 pr-4 rtl:pl-4 rtl:pr-10 rounded-lg bg-muted/50 dark:bg-[#1a1d2e] border-0 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-green-primary/50"
                autoFocus
              />
            </div>
            {selectedTournaments?.length > 0 && (
              <div className="mt-2 text-xs text-muted-foreground">
                {selectedTournaments.length} selected
              </div>
            )}
          </div>

          {/* Tournaments List */}
          <div className="max-h-64 overflow-y-auto p-2">
            {filteredTournaments?.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                No tournaments found
              </div>
            ) : (
              filteredTournaments?.map((tournament) => {
                const tournamentId = getTournamentId(tournament);
                const isSelected = value.includes(tournamentId);
                return (
                  <button
                    key={tournamentId}
                    type="button"
                    onClick={() => handleToggle(tournament)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left rtl:text-right transition-colors ${
                      isSelected
                        ? "bg-amber-500/10 text-amber-500"
                        : "hover:bg-muted dark:hover:bg-[#1a1d2e]"
                    }`}
                  >
                    <div
                      className={`size-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                        isSelected
                          ? "border-amber-500 bg-amber-500"
                          : "border-muted-foreground/30"
                      }`}
                    >
                      {isSelected && <Check className="size-3 text-white" />}
                    </div>
                    <div className="size-8 rounded-lg overflow-hidden flex-shrink-0 bg-muted dark:bg-[#252a3d]">
                      {tournament.logo?.light ? (
                        <img
                          src={tournament.logo.light}
                          alt={tournament.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Trophy className="size-4 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span
                        className={`text-sm font-medium ${
                          isSelected ? "text-amber-500" : "text-foreground"
                        }`}
                      >
                        {tournament.name}
                      </span>
                      {tournament.status && (
                        <span className={`ml-2 text-xs px-1.5 py-0.5 rounded ${
                          tournament.status === 'ongoing' ? 'bg-green-500/20 text-green-500' :
                          tournament.status === 'upcoming' ? 'bg-blue-500/20 text-blue-500' :
                          'bg-gray-500/20 text-gray-500'
                        }`}>
                          {tournament.status}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

// Country Select Field
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

  const selectedCountry = countries?.find((c) => c.label === value);

  const filteredCountries = (countries || []).filter(
    (country) =>
      country.label.toLowerCase().includes(search.toLowerCase()) ||
      country.value.toLowerCase().includes(search.toLowerCase())
  );

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

  const getFlagUrl = (code) =>
    `https://flagcdn.com/w40/${code.toLowerCase()}.png`;

  return (
    <div className="flex-1 space-y-2">
      <label className="text-sm font-medium text-muted-foreground">
        {label}
      </label>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <div
            role="button"
            tabIndex={0}
            className={`w-full h-12 px-4 rounded-xl bg-muted/50 dark:bg-[#1a1d2e] border border-transparent text-sm text-left rtl:text-right focus:outline-none focus:ring-2 focus:ring-green-primary/50 cursor-pointer transition-all hover:bg-muted dark:hover:bg-[#252a3d] flex items-center justify-between gap-2 ${
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
                className={`size-4 text-muted-foreground transition-transform ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </div>
          </div>
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
                placeholder={searchPlaceholder}
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
              filteredCountries?.map((country) => {
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
    </div>
  );
}

// Date Picker Field
function DatePickerField({ label, name, formik, placeholder, maxDate }) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(new Date());
  const error = formik.touched[name] && formik.errors[name];
  const value = formik.values[name];
  const t = useTranslations("playerForm");

  const selectedDate = value ? new Date(value) : undefined;
  const maxDateObj = maxDate ? new Date(maxDate) : undefined;

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1950 + 1 }, (_, i) => 1950 + i).reverse();

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
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const calculateAge = (dateStr) => {
    if (!dateStr) return null;
    const today = new Date();
    const birthDate = new Date(dateStr);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  // Format date to YYYY-MM-DD using local timezone
  const formatLocalDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
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

  const age = calculateAge(value);

  return (
    <div className="flex-1 space-y-2">
      <label className="text-sm font-medium text-muted-foreground">
        {label}
      </label>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <div
            role="button"
            tabIndex={0}
            className={`w-full h-12 px-4 rounded-xl bg-muted/50 dark:bg-[#1a1d2e] border border-transparent text-sm text-left rtl:text-right focus:outline-none focus:ring-2 focus:ring-green-primary/50 cursor-pointer transition-all hover:bg-muted dark:hover:bg-[#252a3d] flex items-center justify-between gap-2 ${
              error ? "ring-2 ring-red-500 border-red-500" : ""
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-lg bg-green-primary/10 flex items-center justify-center">
                <CalendarDays className="size-5 text-green-primary" />
              </div>
              {value ? (
                <div className="flex items-center gap-2">
                  <span className="text-foreground font-medium">
                    {formatDisplayDate(value)}
                  </span>
                  {age !== null && (
                    <span className="text-xs text-muted-foreground bg-muted dark:bg-[#252a3d] px-2 py-0.5 rounded">
                      {age} {t("years") || "years"}
                    </span>
                  )}
                </div>
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
                className="size-8 rounded-lg bg-muted/50 dark:bg-[#1a1d2e] hover:bg-muted dark:hover:bg-[#252a3d] flex items-center justify-center transition-colors"
              >
                <ChevronLeft className="size-4 text-foreground rtl:rotate-180" />
              </button>

              <div className="flex items-center gap-2">
                <select
                  value={viewDate.getMonth()}
                  onChange={(e) => handleMonthChange(parseInt(e.target.value))}
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
                  onChange={(e) => handleYearChange(parseInt(e.target.value))}
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
                onClick={goToNextMonth}
                className="size-8 rounded-lg bg-muted/50 dark:bg-[#1a1d2e] hover:bg-muted dark:hover:bg-[#252a3d] flex items-center justify-center transition-colors"
              >
                <ChevronRight className="size-4 text-foreground rtl:rotate-180" />
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
            disabled={(date) => maxDateObj && date > maxDateObj}
            initialFocus
            className="rounded-xl"
            classNames={{
              nav: "hidden",
              caption: "hidden",
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default PlayerFormRedesign;
