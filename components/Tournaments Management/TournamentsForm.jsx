"use client";
import { useFormik } from "formik";
import * as yup from "yup";
import { Button } from "../ui/button";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";
import { mappedArrayToSelectOptions } from "@/app/[locale]/_Lib/helps";
import FormSection from "../ui app/FormSection";
import FormRow from "../ui app/FormRow";
import ImageUpload from "../ui app/ImageUpload";
import {
  Trophy,
  Calendar,
  MapPin,
  DollarSign,
  Gamepad2,
  Image as ImageIcon,
  Save,
  Loader2,
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
          <InputField
            label={t("Prize Pool")}
            name="prizePool"
            type="number"
            placeholder="0"
            formik={formik}
            icon={<DollarSign className="size-4 text-muted-foreground" />}
          />
          <div className="flex items-center gap-3 pt-6">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formik.values.isFeatured}
                onChange={(e) => formik.setFieldValue("isFeatured", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-muted rounded-full peer peer-checked:bg-green-primary transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full"></div>
            </label>
            <span className="text-sm text-foreground">{t("Featured Tournament")}</span>
          </div>
        </FormRow>
      </FormSection>

      {/* Date & Time */}
      <FormSection title={t("Schedule")} icon={<Calendar className="size-5" />}>
        <FormRow cols={2}>
          <InputField
            label={t("Start Date")}
            name="startDate"
            type="date"
            formik={formik}
          />
          <InputField
            label={t("End Date")}
            name="endDate"
            type="date"
            formik={formik}
            min={formik.values.startDate}
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
