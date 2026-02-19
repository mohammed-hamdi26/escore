"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Button } from "../ui/button";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { mappedArrayToSelectOptions } from "@/app/[locale]/_Lib/helps";
import { getImgUrl } from "@/lib/utils";
import FormSection from "../ui app/FormSection";
import FormRow from "../ui app/FormRow";
import ImageUpload from "../ui app/ImageUpload";
import RichTextEditor from "../ui app/RichTextEditor";
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
  Users,
  User,
  Swords,
} from "lucide-react";

import PlacementConfigEditor from "./PlacementConfigEditor";

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
    .string()
    .required("Start date is required")
    .test("valid-date", "Invalid start date", (value) => {
      if (!value) return true; // required() handles empty
      const date = new Date(value);
      return !isNaN(date.getTime());
    }),
  endDate: yup
    .string()
    .required("End date is required")
    .test("valid-date", "Invalid end date", (value) => {
      if (!value) return true;
      const date = new Date(value);
      return !isNaN(date.getTime());
    }),
  location: yup.string().nullable(),
  prizePool: yup
    .number()
    .min(0, "Prize pool must be positive")
    .nullable(),
  currency: yup.string(),
  gamesData: yup
    .array()
    .test("games", "At least one game is required", (value) => value && value.length > 0),
  teamsData: yup.array().optional(),
  streamUrl: yup.string().url("Must be a valid URL").nullable(),
  websiteUrl: yup.string().url("Must be a valid URL").nullable(),
  logoLight: yup.mixed(),
  logoDark: yup.mixed(),
  coverImageLight: yup.mixed(),
  coverImageDark: yup.mixed(),
  knockoutImageLight: yup.mixed(),
  knockoutImageDark: yup.mixed(),
  scoringType: yup.string().oneOf(["win_loss", "placement"]).required(),
  pointsPerWin: yup.number().min(0).max(100).nullable(),
  pointsPerDraw: yup.number().min(0).max(100).nullable(),
  pointsPerLoss: yup.number().min(0).max(100).nullable(),
  placementConfig: yup.object({
    placementPoints: yup.array().of(
      yup.object({
        place: yup.number().integer().positive().required(),
        points: yup.number().min(0).required(),
      })
    ).min(1, "At least one placement entry is required"),
    killPoints: yup.number().min(0).optional(),
  }).nullable().optional(),
  competitionType: yup
    .string()
    .oneOf(["standard", "battle_royale", "fighting", "racing", "ffa", "sports_sim"])
    .required("Competition type is required"),
  participationType: yup
    .string()
    .oneOf(["team", "player"])
    .required("Participation type is required"),
  playersData: yup.array().optional(),
  maxPlayers: yup.number().integer().positive().nullable().optional(),
});

export default function TournamentsForm({
  tournament,
  submit,
  formType = "add",
  countries = [],
  gameOptions = [],
  teamOptions = [],
  searchGames,
  searchTeams,
  searchPlayers,
}) {
  const t = useTranslations("TournamentForm");
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
      name: tournament?.name || "",
      organizer: tournament?.organizer || "",
      description: tournament?.description || "",
      startDate: formatDateToLocal(tournament?.startDate),
      endDate: formatDateToLocal(tournament?.endDate),
      location: tournament?.location || "",
      prizePool: tournament?.prizePool || "",
      currency: tournament?.currency || "USD",
      status: tournament?.status || "upcoming",
      logoLight: getImgUrl(tournament?.logo?.light) || "",
      logoDark: getImgUrl(tournament?.logo?.dark) || "",
      coverImageLight: getImgUrl(tournament?.coverImage?.light) || "",
      coverImageDark: getImgUrl(tournament?.coverImage?.dark) || "",
      country: tournament?.country?.name || "",
      gamesData: tournament?.games || [],
      teamsData: tournament?.teams || [],
      knockoutImageLight: getImgUrl(tournament?.bracketImage?.light) || "",
      knockoutImageDark: getImgUrl(tournament?.bracketImage?.dark) || "",
      tier: tournament?.tier || "",
      format: tournament?.format || "",
      rules: tournament?.rules || "",
      streamUrl: tournament?.streamUrl || "",
      websiteUrl: tournament?.websiteUrl || "",
      isOnline: tournament?.isOnline || false,
      isActive: tournament?.isActive !== undefined ? tournament.isActive : true,
      isFeatured: tournament?.isFeatured || false,
      scoringType: tournament?.standingConfig?.scoringType || "win_loss",
      pointsPerWin: tournament?.standingConfig?.pointsPerWin ?? 3,
      pointsPerDraw: tournament?.standingConfig?.pointsPerDraw ?? 1,
      pointsPerLoss: tournament?.standingConfig?.pointsPerLoss ?? 0,
      placementConfig: tournament?.standingConfig?.placementConfig || {
        placementPoints: [
          { place: 1, points: 12 },
          { place: 2, points: 9 },
          { place: 3, points: 7 },
          { place: 4, points: 5 },
          { place: 5, points: 4 },
        ],
        killPoints: 0,
      },
      competitionType: tournament?.competitionType || "standard",
      participationType: tournament?.participationType || "team",
      playersData: tournament?.players || [],
      maxPlayers: tournament?.maxPlayers || "",
      prizeDistribution: tournament?.prizeDistribution?.map((p) => ({
        place: p.place,
        amount: p.amount,
      })) || [],
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

        // Build coverImage object
        dataValues.coverImage = dataValues.coverImageLight
          ? {
              light: dataValues.coverImageLight,
              dark: dataValues.coverImageDark || dataValues.coverImageLight,
            }
          : null;

        // Convert dates to ISO datetime format for backend (preserving local date)
        if (dataValues.startDate) {
          const [year, month, day] = dataValues.startDate.split('-').map(Number);
          // Create date at noon local time to avoid timezone edge cases
          const date = new Date(year, month - 1, day, 12, 0, 0);
          dataValues.startDate = date.toISOString();
        }
        if (dataValues.endDate) {
          const [year, month, day] = dataValues.endDate.split('-').map(Number);
          // Create date at noon local time to avoid timezone edge cases
          const date = new Date(year, month - 1, day, 12, 0, 0);
          dataValues.endDate = date.toISOString();
        }

        dataValues.games = dataValues?.gamesData.map((g) => g.id || g.value || g._id || g);
        dataValues.teams = dataValues?.teamsData?.map((t) => t.id || t.value || t._id || t) || [];

        // Handle player tournaments
        if (dataValues.participationType === "player") {
          dataValues.players = dataValues?.playersData?.map((p) => p.id || p.value || p._id || p) || [];
          if (dataValues.maxPlayers) dataValues.maxPlayers = parseInt(dataValues.maxPlayers);
          else delete dataValues.maxPlayers;
          delete dataValues.teams;
        } else {
          delete dataValues.players;
          delete dataValues.maxPlayers;
        }

        // Convert empty strings to null for optional number fields
        if (dataValues.prizePool === "" || dataValues.prizePool === null) {
          dataValues.prizePool = null;
        }

        // Convert empty strings to null for optional fields
        if (!dataValues.streamUrl) delete dataValues.streamUrl;
        if (!dataValues.websiteUrl) delete dataValues.websiteUrl;
        if (!dataValues.format) delete dataValues.format;
        if (!dataValues.rules) delete dataValues.rules;
        if (!dataValues.description) delete dataValues.description;
        if (!dataValues.location) delete dataValues.location;
        if (!dataValues.organizer) delete dataValues.organizer;
        if (!dataValues.tier) delete dataValues.tier;

        // Build standingConfig object
        if (dataValues.scoringType === "placement") {
          dataValues.standingConfig = {
            scoringType: "placement",
            placementConfig: dataValues.placementConfig,
          };
        } else {
          dataValues.standingConfig = {
            scoringType: "win_loss",
            pointsPerWin: parseInt(dataValues.pointsPerWin) || 3,
            pointsPerDraw: parseInt(dataValues.pointsPerDraw) || 1,
            pointsPerLoss: parseInt(dataValues.pointsPerLoss) || 0,
          };
        }

        // Build prizeDistribution array (filter out empty entries)
        if (dataValues.prizeDistribution?.length > 0) {
          dataValues.prizeDistribution = dataValues.prizeDistribution
            .filter((p) => p.place && p.amount !== "" && p.amount !== null && p.amount !== undefined)
            .map((p) => ({ place: parseInt(p.place), amount: parseFloat(p.amount) }));
        } else {
          delete dataValues.prizeDistribution;
        }

        // Clean up temporary fields
        delete dataValues.logoLight;
        delete dataValues.logoDark;
        delete dataValues.coverImageLight;
        delete dataValues.coverImageDark;
        delete dataValues.knockoutImageLight;
        delete dataValues.knockoutImageDark;
        delete dataValues.gamesData;
        delete dataValues.teamsData;
        delete dataValues.playersData;
        delete dataValues.scoringType;
        delete dataValues.pointsPerWin;
        delete dataValues.pointsPerDraw;
        delete dataValues.pointsPerLoss;
        delete dataValues.placementConfig;

        await submit(dataValues);
        toast.success(
          formType === "add"
            ? t("The Tournament Added")
            : t("The Tournament Edited")
        );
        // Navigate back to tournaments list after successful submission
        router.push("/dashboard/tournaments-management");
      } catch (error) {
        // NEXT_REDIRECT means the action succeeded and called redirect()
        if (error?.digest?.includes("NEXT_REDIRECT") || error.toString().includes("NEXT_REDIRECT")) {
          toast.success(
            formType === "add"
              ? t("The Tournament Added")
              : t("The Tournament Edited")
          );
          throw error; // Re-throw to let Next.js handle the redirect
        } else {
          toast.error(error.message || "An error occurred");
        }
      }
    },
  });

  // Smart Status Auto-Selection based on dates
  const tournamentStartDate = formik.values.startDate || "";
  const tournamentEndDate = formik.values.endDate || "";
  const tournamentStatus = formik.values.status;

  useEffect(() => {
    // Skip auto-update if status is cancelled (manual only)
    if (tournamentStatus === "cancelled") return;

    // Skip if start date is not set
    if (!tournamentStartDate) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of day

    const start = new Date(tournamentStartDate);
    start.setHours(0, 0, 0, 0);

    let newStatus = tournamentStatus;

    if (today < start) {
      // Tournament hasn't started yet
      newStatus = "upcoming";
    } else if (tournamentEndDate) {
      // Both dates are set - check end date
      const end = new Date(tournamentEndDate);
      end.setHours(0, 0, 0, 0);

      if (today >= start && today <= end) {
        newStatus = "ongoing";
      } else if (today > end) {
        newStatus = "completed";
      }
    } else {
      // Only start date is set and today >= start date
      // Assume ongoing if no end date specified
      newStatus = "ongoing";
    }

    // Only update if status actually changed
    if (newStatus !== tournamentStatus) {
      formik.setFieldValue("status", newStatus);
    }
  }, [tournamentStartDate, tournamentEndDate]);

  // Auto-set participationType based on competitionType
  const competitionTypeValue = formik.values.competitionType;
  useEffect(() => {
    if (competitionTypeValue === "fighting") {
      formik.setFieldValue("participationType", "player");
    }
  }, [competitionTypeValue]);

  // Auto-set scoringType to "placement" for battle royale
  useEffect(() => {
    if (competitionTypeValue === "battle_royale") {
      formik.setFieldValue("scoringType", "placement");
    }
  }, [competitionTypeValue]);

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

  const competitionTypeOptions = [
    { value: "standard", label: t("Standard"), icon: Trophy, color: "text-blue-500", bg: "bg-blue-500/10" },
    { value: "battle_royale", label: t("Battle Royale"), icon: Users, color: "text-orange-500", bg: "bg-orange-500/10" },
    { value: "fighting", label: t("Fighting"), icon: Swords, color: "text-red-500", bg: "bg-red-500/10" },
    { value: "racing", label: t("Racing"), icon: Clock, color: "text-green-500", bg: "bg-green-500/10" },
    { value: "ffa", label: t("Free For All"), icon: Users, color: "text-purple-500", bg: "bg-purple-500/10" },
    { value: "sports_sim", label: t("Sports Simulation"), icon: Gamepad2, color: "text-cyan-500", bg: "bg-cyan-500/10" },
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

        <FormRow cols={3}>
          <CompetitionTypeSelectField
            label={t("Competition Type")}
            name="competitionType"
            options={competitionTypeOptions}
            formik={formik}
            placeholder={t("Select Competition Type")}
          />
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
            required
          />
          <DatePickerField
            label={t("End Date")}
            name="endDate"
            formik={formik}
            placeholder={t("Select end date")}
            minDate={formik.values.startDate}
            required
          />
        </FormRow>
      </FormSection>

      {/* Games */}
      <FormSection title={t("Games")} icon={<Gamepad2 className="size-5" />}>
        <MultiSelectField
          label={t("Select Games")}
          name="gamesData"
          formik={formik}
          searchAction={searchGames}
          required
        />
      </FormSection>

      {/* Participants — Teams or Players */}
      <FormSection
        title={formik.values.participationType === "player" ? t("Players") : t("Teams")}
        icon={formik.values.participationType === "player" ? <User className="size-5" /> : <Users className="size-5" />}
      >
        {/* Participation Type Toggle */}
        <div className="flex items-center gap-2 mb-4">
          <label className="text-sm font-medium text-muted-foreground mr-2">{t("Participation Type")}</label>
          <div className="inline-flex rounded-lg bg-muted/50 dark:bg-[#1a1d2e] p-1">
            <button
              type="button"
              onClick={() => formik.setFieldValue("participationType", "team")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                formik.values.participationType === "team"
                  ? "bg-green-primary text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Users className="size-4" />
              {t("Team Based")}
            </button>
            <button
              type="button"
              onClick={() => formik.setFieldValue("participationType", "player")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                formik.values.participationType === "player"
                  ? "bg-green-primary text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <User className="size-4" />
              {t("Player Based")}
            </button>
          </div>
        </div>

        {formik.values.participationType === "team" ? (
          <TeamSelectField
            label={t("Select Teams")}
            name="teamsData"
            formik={formik}
            searchAction={searchTeams}
          />
        ) : (
          <PlayerSelectField
            label={t("Select Players")}
            name="playersData"
            formik={formik}
            searchAction={searchPlayers}
          />
        )}
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
        <RichTextEditor
          formik={formik}
          name="rules"
          placeholder={t("Enter tournament rules and regulations")}
          minHeight="250px"
        />
      </FormSection>

      {/* Standing Settings */}
      <FormSection title={t("Standing Settings")} icon={<Trophy className="size-5" />}>
        {/* Scoring Type Toggle */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-foreground mb-2">
            {t("Scoring Type")}
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => formik.setFieldValue("scoringType", "win_loss")}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                formik.values.scoringType === "win_loss"
                  ? "border-green-primary bg-green-primary/10 text-green-primary"
                  : "border-gray-300 dark:border-gray-600 text-muted-foreground hover:border-green-primary/50"
              }`}
            >
              <Trophy className="size-4" />
              {t("Win / Loss")}
            </button>
            <button
              type="button"
              onClick={() => formik.setFieldValue("scoringType", "placement")}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                formik.values.scoringType === "placement"
                  ? "border-green-primary bg-green-primary/10 text-green-primary"
                  : "border-gray-300 dark:border-gray-600 text-muted-foreground hover:border-green-primary/50"
              }`}
            >
              <Award className="size-4" />
              {t("Placement")}
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-1.5">
            {formik.values.scoringType === "win_loss"
              ? t("Win/Loss scoring uses points for wins, draws, and losses")
              : t("Placement scoring awards points based on finishing position")}
          </p>
        </div>

        {/* Win/Loss Point Fields - only show for win_loss scoring */}
        {formik.values.scoringType === "win_loss" && (
          <FormRow cols={3}>
            <InputField
              label={t("Points Per Win")}
              name="pointsPerWin"
              type="number"
              placeholder="3"
              formik={formik}
            />
            <InputField
              label={t("Points Per Draw")}
              name="pointsPerDraw"
              type="number"
              placeholder="1"
              formik={formik}
            />
            <InputField
              label={t("Points Per Loss")}
              name="pointsPerLoss"
              type="number"
              placeholder="0"
              formik={formik}
            />
          </FormRow>
        )}

        {/* Placement Config Editor - show when placement scoring */}
        {formik.values.scoringType === "placement" && (
          <PlacementConfigEditor formik={formik} />
        )}
      </FormSection>

      {/* Prize Distribution */}
      <FormSection title={t("Prize Distribution")} icon={<Award className="size-5" />}>
        <PrizeDistributionField
          formik={formik}
          currency={CURRENCY_OPTIONS.find((c) => c.value === formik.values.currency)?.symbol || "$"}
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
                imageType="tournamentLogo"
              />
              <ImageUpload
                label={t("Dark Mode")}
                name="logoDark"
                formik={formik}
                imageType="tournamentLogo"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-medium text-foreground">{t("Cover Image")}</h4>
            <div className="grid grid-cols-2 gap-4">
              <ImageUpload
                label={t("Light Mode")}
                name="coverImageLight"
                formik={formik}
                imageType="tournamentCover"
                aspectRatio="3:2"
              />
              <ImageUpload
                label={t("Dark Mode")}
                name="coverImageDark"
                formik={formik}
                imageType="tournamentCover"
                aspectRatio="3:2"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-foreground">{t("Bracket Image")}</h4>
            <div className="grid grid-cols-2 gap-4">
              <ImageUpload
                label={t("Light Mode")}
                name="knockoutImageLight"
                formik={formik}
                imageType="tournamentBracket"
              />
              <ImageUpload
                label={t("Dark Mode")}
                name="knockoutImageDark"
                formik={formik}
                imageType="tournamentBracket"
              />
            </div>
          </div>
        </div>
      </FormSection>

      {/* Submit Button */}
      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => formik.resetForm()}
          className="h-11 px-6 rounded-xl border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
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
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

// Competition Type Select Field with Icons and Colors
function CompetitionTypeSelectField({ label, name, options, formik, placeholder }) {
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
                    <Trophy className="size-4 text-muted-foreground" />
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

// Prize Distribution Field - dynamic list of place/amount pairs
function PrizeDistributionField({ formik, currency }) {
  const prizes = formik.values.prizeDistribution || [];

  const addPrize = () => {
    const nextPlace = prizes.length > 0 ? Math.max(...prizes.map((p) => p.place || 0)) + 1 : 1;
    formik.setFieldValue("prizeDistribution", [...prizes, { place: nextPlace, amount: "" }]);
  };

  const removePrize = (index) => {
    formik.setFieldValue(
      "prizeDistribution",
      prizes.filter((_, i) => i !== index)
    );
  };

  const updatePrize = (index, field, value) => {
    const updated = [...prizes];
    updated[index] = { ...updated[index], [field]: value };
    formik.setFieldValue("prizeDistribution", updated);
  };

  const getPlaceLabel = (place) => {
    if (place === 1) return "1st";
    if (place === 2) return "2nd";
    if (place === 3) return "3rd";
    return `${place}th`;
  };

  return (
    <div className="space-y-3">
      {prizes.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-4">
          No prize distribution configured. Add placements below.
        </p>
      ) : (
        <div className="space-y-2">
          {prizes.map((prize, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 dark:bg-[#141625] border border-border/50"
            >
              {/* Place badge */}
              <div className={`flex items-center justify-center size-10 rounded-lg font-bold text-sm shrink-0 ${
                prize.place === 1
                  ? "bg-yellow-500/15 text-yellow-500"
                  : prize.place === 2
                  ? "bg-gray-400/15 text-gray-400"
                  : prize.place === 3
                  ? "bg-orange-500/15 text-orange-500"
                  : "bg-muted text-muted-foreground"
              }`}>
                {getPlaceLabel(prize.place)}
              </div>

              {/* Place number input */}
              <div className="w-20">
                <input
                  type="number"
                  min="1"
                  value={prize.place}
                  onChange={(e) => updatePrize(index, "place", parseInt(e.target.value) || "")}
                  className="w-full h-10 px-3 rounded-lg bg-muted/50 dark:bg-[#1a1d2e] border border-border/50 text-sm text-center focus:outline-none focus:ring-2 focus:ring-green-primary/50 text-foreground"
                  placeholder="#"
                />
              </div>

              {/* Amount input */}
              <div className="flex-1 relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">
                  {currency}
                </span>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={prize.amount}
                  onChange={(e) => updatePrize(index, "amount", e.target.value)}
                  className="w-full h-10 pl-10 pr-4 rounded-lg bg-muted/50 dark:bg-[#1a1d2e] border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-green-primary/50 text-foreground placeholder:text-muted-foreground"
                  placeholder="Amount"
                />
              </div>

              {/* Remove button */}
              <button
                type="button"
                onClick={() => removePrize(index)}
                className="size-10 rounded-lg flex items-center justify-center text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors shrink-0"
              >
                <X className="size-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={addPrize}
        className="w-full h-10 rounded-xl border-2 border-dashed border-border/50 hover:border-green-primary/50 text-sm text-muted-foreground hover:text-green-primary flex items-center justify-center gap-2 transition-colors"
      >
        <Coins className="size-4" />
        Add Placement Prize
      </button>
    </div>
  );
}

// Multi-Select Field for Games with Search and Pagination
function MultiSelectField({ label, name, formik, searchAction, required }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [games, setGames] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const searchTimeoutRef = useRef(null);
  const selectedIds = formik.values[name]?.map((g) => g.id || g.value || g) || [];
  const error = formik.touched[name] && formik.errors[name];

  const fetchGames = useCallback(async (searchQuery, pageNum) => {
    if (!searchAction) return;
    setLoading(true);
    try {
      const result = await searchAction({ search: searchQuery, page: pageNum, limit: 20 });
      setGames(result.data || []);
      setTotalPages(result.pagination?.totalPages || 1);
    } catch {
      setGames([]);
    } finally {
      setLoading(false);
    }
  }, [searchAction]);

  useEffect(() => {
    if (isOpen) {
      fetchGames(search, page);
    }
  }, [isOpen, page]);

  useEffect(() => {
    if (!isOpen) return;
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      setPage(1);
      fetchGames(search, 1);
    }, 400);
    return () => clearTimeout(searchTimeoutRef.current);
  }, [search]);

  const toggleGame = async (game) => {
    const gameId = game.id || game.value;
    const isSelected = selectedIds.includes(gameId);
    let newValue;
    if (isSelected) {
      newValue = (formik.values[name] || []).filter((g) => (g.id || g.value || g) !== gameId);
    } else {
      newValue = [...(formik.values[name] || []), { id: gameId, name: game.name || game.label }];
    }
    await formik.setFieldValue(name, newValue);
    await formik.setFieldTouched(name, true, true);
    formik.validateField(name);
  };

  const removeGame = async (gameId) => {
    const newValue = (formik.values[name] || []).filter((g) => (g.id || g.value || g) !== gameId);
    await formik.setFieldValue(name, newValue);
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-muted-foreground">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {/* Selected games as pills */}
      {selectedIds.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {(formik.values[name] || []).map((game) => {
            const gameId = game.id || game.value || game;
            const gameName = game.name || game.label || gameId;
            return (
              <span
                key={gameId}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-primary/10 text-green-primary text-sm font-medium"
              >
                <Gamepad2 className="size-3.5" />
                {gameName}
                <button
                  type="button"
                  onClick={() => removeGame(gameId)}
                  className="ml-0.5 hover:text-red-500 transition-colors"
                >
                  <X className="size-3.5" />
                </button>
              </span>
            );
          })}
        </div>
      )}

      {/* Popover trigger */}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="w-full flex items-center justify-between h-11 px-4 rounded-xl bg-muted/50 dark:bg-[#1a1d2e] border border-border/50 text-sm text-muted-foreground hover:bg-muted dark:hover:bg-[#252a3d] transition-colors"
          >
            <span className="flex items-center gap-2">
              <Search className="size-4" />
              {selectedIds.length > 0
                ? `${selectedIds.length} game${selectedIds.length > 1 ? "s" : ""} selected`
                : "Search and select games..."}
            </span>
            <ChevronDown className={`size-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] p-0 bg-background dark:bg-[#12141c] border-border"
          align="start"
        >
          {/* Search input */}
          <div className="p-3 border-b border-border/50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search games..."
                className="w-full h-10 pl-10 pr-4 rounded-lg bg-muted/50 dark:bg-[#1a1d2e] border-0 text-sm focus:ring-2 focus:ring-green-primary/50 focus:outline-none text-foreground placeholder:text-muted-foreground"
                autoFocus
              />
            </div>
          </div>

          {/* Games list */}
          <div className="max-h-[280px] overflow-y-auto p-2">
            {loading ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="size-5 animate-spin text-muted-foreground" />
              </div>
            ) : games.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground py-6">No games found</p>
            ) : (
              games.map((game) => {
                const gameId = game.id || game.value;
                const isSelected = selectedIds.includes(gameId);
                return (
                  <button
                    key={gameId}
                    type="button"
                    onClick={() => toggleGame(game)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                      isSelected
                        ? "bg-green-primary/10 text-green-primary"
                        : "text-foreground hover:bg-muted/50 dark:hover:bg-[#1a1d2e]"
                    }`}
                  >
                    {game.logo?.light ? (
                      <img
                        src={getImgUrl(game.logo.light, "thumbnail")}
                        alt={game.name}
                        className="size-6 rounded object-cover"
                      />
                    ) : (
                      <Gamepad2 className="size-5 text-muted-foreground" />
                    )}
                    <span className="flex-1 text-start">{game.name || game.label}</span>
                    {isSelected && <Check className="size-4 text-green-primary" />}
                  </button>
                );
              })
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between p-3 border-t border-border/50">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-muted/50 dark:bg-[#1a1d2e] disabled:opacity-40 hover:bg-muted dark:hover:bg-[#252a3d] transition-colors"
              >
                <ChevronLeft className="size-4" />
              </button>
              <span className="text-xs text-muted-foreground">
                {page} / {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-muted/50 dark:bg-[#1a1d2e] disabled:opacity-40 hover:bg-muted dark:hover:bg-[#252a3d] transition-colors"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          )}
        </PopoverContent>
      </Popover>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

// Enhanced Date Picker Field with Year/Month Navigation
function DatePickerField({ label, name, formik, placeholder, minDate, required }) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(new Date());
  const error = formik.touched[name] && formik.errors[name];
  const value = formik.values[name];

  // Parse date string to local date (avoiding timezone issues)
  const parseLocalDate = (dateStr) => {
    if (!dateStr) return undefined;
    // If it's already a Date object
    if (dateStr instanceof Date) return dateStr;
    // Parse YYYY-MM-DD format as local date
    const [year, month, day] = dateStr.split('-').map(Number);
    if (year && month && day) {
      return new Date(year, month - 1, day);
    }
    return new Date(dateStr);
  };

  // Format date to YYYY-MM-DD using local timezone
  const formatLocalDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const selectedDate = parseLocalDate(value);
  const minDateObj = parseLocalDate(minDate);

  // Generate years from 1990 to current year + 10
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1990 + 11 }, (_, i) => 1990 + i);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
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
      // Use local date formatting to avoid timezone shift
      const formattedDate = formatLocalDate(date);
      await formik.setFieldValue(name, formattedDate);
      await formik.setFieldTouched(name, true, true); // third param validates
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
            disabled={(date) => {
              if (!minDateObj) return false;
              // Compare dates without time
              const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
              const minDateOnly = new Date(minDateObj.getFullYear(), minDateObj.getMonth(), minDateObj.getDate());
              return dateOnly < minDateOnly;
            }}
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
              isChecked ? "ltr:left-[22px] rtl:right-[22px]" : "ltr:left-[2px] rtl:right-[2px]"
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
        value={formik.values[name] ?? ""}
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
              isChecked ? "ltr:left-[22px] rtl:right-[22px]" : "ltr:left-[2px] rtl:right-[2px]"
            }`}
          />
        </div>
      </button>
    </div>
  );
}

// Team Select Field with search, logos, and names
function TeamSelectField({ label, name, formik, searchAction }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [teams, setTeams] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const searchTimeoutRef = useRef(null);
  const selectedIds = formik.values[name]?.map((t) => t.id || t.value || t._id || t) || [];
  const error = formik.touched[name] && formik.errors[name];

  const fetchTeams = useCallback(async (searchQuery, pageNum) => {
    if (!searchAction) return;
    setLoading(true);
    try {
      const result = await searchAction({ search: searchQuery, page: pageNum, limit: 20 });
      setTeams(result.data || []);
      setTotalPages(result.pagination?.totalPages || 1);
    } catch {
      setTeams([]);
    } finally {
      setLoading(false);
    }
  }, [searchAction]);

  useEffect(() => {
    if (isOpen) {
      fetchTeams(search, page);
    }
  }, [isOpen, page]);

  useEffect(() => {
    if (!isOpen) return;
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      setPage(1);
      fetchTeams(search, 1);
    }, 400);
    return () => clearTimeout(searchTimeoutRef.current);
  }, [search]);

  const toggleTeam = async (team) => {
    const teamId = team.id || team.value;
    const isSelected = selectedIds.includes(teamId);
    let newValue;
    if (isSelected) {
      newValue = (formik.values[name] || []).filter((t) => (t.id || t.value || t._id || t) !== teamId);
    } else {
      newValue = [...(formik.values[name] || []), { id: teamId, name: team.name || team.label, logo: team.logo }];
    }
    await formik.setFieldValue(name, newValue);
    await formik.setFieldTouched(name, true, true);
    formik.validateField(name);
  };

  const removeTeam = async (teamId) => {
    const newValue = (formik.values[name] || []).filter((t) => (t.id || t.value || t._id || t) !== teamId);
    await formik.setFieldValue(name, newValue);
  };

  const getLogoUrl = (team) => getImgUrl(team.logo?.light, "thumbnail") || getImgUrl(team.logo?.dark, "thumbnail") || null;

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-muted-foreground">
        {label}
      </label>

      {/* Selected teams as pills */}
      {selectedIds.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {(formik.values[name] || []).map((team) => {
            const teamId = team.id || team.value || team._id || team;
            const teamName = team.name || team.label || teamId;
            const logoUrl = getLogoUrl(team);
            return (
              <span
                key={teamId}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-primary/10 text-green-primary text-sm font-medium"
              >
                {logoUrl ? (
                  <img src={logoUrl} alt={teamName} className="size-4 rounded-full object-cover" />
                ) : (
                  <Users className="size-3.5" />
                )}
                {teamName}
                <button
                  type="button"
                  onClick={() => removeTeam(teamId)}
                  className="ml-0.5 hover:text-red-500 transition-colors"
                >
                  <X className="size-3.5" />
                </button>
              </span>
            );
          })}
        </div>
      )}

      {/* Popover trigger */}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="w-full flex items-center justify-between h-11 px-4 rounded-xl bg-muted/50 dark:bg-[#1a1d2e] border border-border/50 text-sm text-muted-foreground hover:bg-muted dark:hover:bg-[#252a3d] transition-colors"
          >
            <span className="flex items-center gap-2">
              <Search className="size-4" />
              {selectedIds.length > 0
                ? `${selectedIds.length} team${selectedIds.length > 1 ? "s" : ""} selected`
                : "Search and select teams..."}
            </span>
            <ChevronDown className={`size-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] p-0 bg-background dark:bg-[#12141c] border-border"
          align="start"
        >
          {/* Search input */}
          <div className="p-3 border-b border-border/50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search teams..."
                className="w-full h-10 pl-10 pr-4 rounded-lg bg-muted/50 dark:bg-[#1a1d2e] border-0 text-sm focus:ring-2 focus:ring-green-primary/50 focus:outline-none text-foreground placeholder:text-muted-foreground"
                autoFocus
              />
            </div>
          </div>

          {/* Teams list */}
          <div className="max-h-[280px] overflow-y-auto p-2">
            {loading ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="size-5 animate-spin text-muted-foreground" />
              </div>
            ) : teams.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground py-6">No teams found</p>
            ) : (
              teams.map((team) => {
                const teamId = team.id || team.value;
                const isSelected = selectedIds.includes(teamId);
                const logoUrl = getLogoUrl(team);
                return (
                  <button
                    key={teamId}
                    type="button"
                    onClick={() => toggleTeam(team)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                      isSelected
                        ? "bg-green-primary/10 text-green-primary"
                        : "text-foreground hover:bg-muted/50 dark:hover:bg-[#1a1d2e]"
                    }`}
                  >
                    {logoUrl ? (
                      <img src={logoUrl} alt={team.name} className="size-6 rounded-full object-cover" />
                    ) : (
                      <div className="size-6 rounded-full bg-muted flex items-center justify-center">
                        <Users className="size-3.5 text-muted-foreground" />
                      </div>
                    )}
                    <span className="flex-1 text-start">{team.name || team.label}</span>
                    {isSelected && <Check className="size-4 text-green-primary" />}
                  </button>
                );
              })
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between p-3 border-t border-border/50">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-muted/50 dark:bg-[#1a1d2e] disabled:opacity-40 hover:bg-muted dark:hover:bg-[#252a3d] transition-colors"
              >
                <ChevronLeft className="size-4" />
              </button>
              <span className="text-xs text-muted-foreground">
                {page} / {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-muted/50 dark:bg-[#1a1d2e] disabled:opacity-40 hover:bg-muted dark:hover:bg-[#252a3d] transition-colors"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          )}
        </PopoverContent>
      </Popover>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

// Player Select Field with async search — same pattern as TeamSelectField
function PlayerSelectField({ label, name, formik, searchAction }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [players, setPlayers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const searchTimeoutRef = useRef(null);
  const selectedIds = formik.values[name]?.map((p) => p.id || p.value || p._id || p) || [];
  const error = formik.touched[name] && formik.errors[name];

  const fetchPlayers = useCallback(async (searchQuery, pageNum) => {
    if (!searchAction) return;
    setLoading(true);
    try {
      const result = await searchAction({ search: searchQuery, page: pageNum, limit: 20 });
      setPlayers(result.data || []);
      setTotalPages(result.pagination?.totalPages || 1);
    } catch {
      setPlayers([]);
    } finally {
      setLoading(false);
    }
  }, [searchAction]);

  useEffect(() => {
    if (isOpen) fetchPlayers(search, page);
  }, [isOpen, page]);

  useEffect(() => {
    if (!isOpen) return;
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      setPage(1);
      fetchPlayers(search, 1);
    }, 400);
    return () => clearTimeout(searchTimeoutRef.current);
  }, [search]);

  const togglePlayer = async (player) => {
    const playerId = player.id || player.value;
    const isSelected = selectedIds.includes(playerId);
    let newValue;
    if (isSelected) {
      newValue = (formik.values[name] || []).filter((p) => (p.id || p.value || p._id || p) !== playerId);
    } else {
      newValue = [...(formik.values[name] || []), { id: playerId, nickname: player.nickname || player.name || player.label, photo: player.photo }];
    }
    await formik.setFieldValue(name, newValue);
    await formik.setFieldTouched(name, true, true);
    formik.validateField(name);
  };

  const removePlayer = async (playerId) => {
    const newValue = (formik.values[name] || []).filter((p) => (p.id || p.value || p._id || p) !== playerId);
    await formik.setFieldValue(name, newValue);
  };

  const getPhotoUrl = (player) => getImgUrl(player.photo?.light, "thumbnail") || getImgUrl(player.photo?.dark, "thumbnail") || getImgUrl(player.photo, "thumbnail") || null;

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-muted-foreground">{label}</label>

      {/* Selected players as pills */}
      {selectedIds.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {(formik.values[name] || []).map((player) => {
            const playerId = player.id || player.value || player._id || player;
            const playerName = player.nickname || player.name || player.label || playerId;
            const photoUrl = getPhotoUrl(player);
            return (
              <span key={playerId} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-primary/10 text-green-primary text-sm font-medium">
                {photoUrl ? (
                  <img src={photoUrl} alt={playerName} className="size-4 rounded-full object-cover" />
                ) : (
                  <User className="size-3.5" />
                )}
                {playerName}
                <button type="button" onClick={() => removePlayer(playerId)} className="ml-0.5 hover:text-red-500 transition-colors">
                  <X className="size-3.5" />
                </button>
              </span>
            );
          })}
        </div>
      )}

      {/* Popover trigger */}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="w-full flex items-center justify-between h-11 px-4 rounded-xl bg-muted/50 dark:bg-[#1a1d2e] border border-border/50 text-sm text-muted-foreground hover:bg-muted dark:hover:bg-[#252a3d] transition-colors"
          >
            <span className="flex items-center gap-2">
              <Search className="size-4" />
              {selectedIds.length > 0
                ? `${selectedIds.length} player${selectedIds.length > 1 ? "s" : ""} selected`
                : "Search and select players..."}
            </span>
            <ChevronDown className={`size-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 bg-background dark:bg-[#12141c] border-border" align="start">
          <div className="p-3 border-b border-border/50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search players..."
                className="w-full h-10 pl-10 pr-4 rounded-lg bg-muted/50 dark:bg-[#1a1d2e] border-0 text-sm focus:ring-2 focus:ring-green-primary/50 focus:outline-none text-foreground placeholder:text-muted-foreground"
                autoFocus
              />
            </div>
          </div>

          <div className="max-h-[280px] overflow-y-auto p-2">
            {loading ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="size-5 animate-spin text-muted-foreground" />
              </div>
            ) : players.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground py-6">No players found</p>
            ) : (
              players.map((player) => {
                const playerId = player.id || player.value;
                const isSelected = selectedIds.includes(playerId);
                const photoUrl = getPhotoUrl(player);
                return (
                  <button
                    key={playerId}
                    type="button"
                    onClick={() => togglePlayer(player)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                      isSelected ? "bg-green-primary/10 text-green-primary" : "text-foreground hover:bg-muted/50 dark:hover:bg-[#1a1d2e]"
                    }`}
                  >
                    {photoUrl ? (
                      <img src={photoUrl} alt={player.nickname} className="size-6 rounded-full object-cover" />
                    ) : (
                      <div className="size-6 rounded-full bg-muted flex items-center justify-center">
                        <User className="size-3.5 text-muted-foreground" />
                      </div>
                    )}
                    <span className="flex-1 text-start">{player.nickname || player.name || player.label}</span>
                    {isSelected && <Check className="size-4 text-green-primary" />}
                  </button>
                );
              })
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between p-3 border-t border-border/50">
              <button type="button" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-muted/50 dark:bg-[#1a1d2e] disabled:opacity-40 hover:bg-muted dark:hover:bg-[#252a3d] transition-colors">
                <ChevronLeft className="size-4" />
              </button>
              <span className="text-xs text-muted-foreground">{page} / {totalPages}</span>
              <button type="button" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-muted/50 dark:bg-[#1a1d2e] disabled:opacity-40 hover:bg-muted dark:hover:bg-[#252a3d] transition-colors">
                <ChevronRight className="size-4" />
              </button>
            </div>
          )}
        </PopoverContent>
      </Popover>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
