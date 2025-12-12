"use client";
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
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import * as yup from "yup";
import FileInput from "../ui app/FileInput";
import FormRow from "../ui app/FormRow";
import FormSection from "../ui app/FormSection";
import InputApp from "../ui app/InputApp";
import SelectInput from "../ui app/SelectInput";
import DatePicker from "../ui app/DatePicker";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";

// Validation schema
const validationSchema = yup.object({
  // Required fields
  firstName: yup
    .string()
    .required("firstNameRequired")
    .max(50, "firstNameTooLong"),
  lastName: yup
    .string()
    .required("lastNameRequired")
    .max(50, "lastNameTooLong"),
  nickname: yup
    .string()
    .required("nicknameRequired")
    .max(50, "nicknameTooLong"),
  dateOfBirth: yup.string().required("birthDateRequired"),
  country: yup.string().required("countryRequired"),
  photoLight: yup.string().required("photoRequired"),

  // Optional fields
  photoDark: yup.string(),
  team: yup.string().nullable(),
  mainGame: yup.string().nullable(),
});

function PlayerFormRedesign({
  formType = "add",
  submit,
  player,
  countries = [],
  OptionsData: { teamsOptions = [], gamesOptions = [] } = {},
}) {
  const t = useTranslations("playerForm");
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      firstName: player?.firstName || "",
      lastName: player?.lastName || "",
      nickname: player?.nickname || "",
      dateOfBirth: player?.dateOfBirth || "",
      country: player?.country?.code || "",
      photoLight: player?.photo?.light || "",
      photoDark: player?.photo?.dark || "",
      team: player?.team?.id || "",
      mainGame: player?.game?.id || "",
    },
    validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      try {
        const selectedCountry = countries.find(
          (c) => c.label === values.country
        );

        const dataValues = {
          ...(player ? { id: player.id } : {}),
          firstName: values.firstName,
          lastName: values.lastName,
          nickname: values.nickname,
          dateOfBirth: values.dateOfBirth,
          photo: {
            light: values.photoLight,
            dark: values.photoDark || values.photoLight,
          },
          slug: `${values.firstName}-${values.lastName}`
            .replace(/\s+/g, "-")
            .toLowerCase(),
          game: values.mainGame || undefined,
          team: values.team || undefined,
          country: selectedCountry
            ? {
                name: selectedCountry.label,
                code: selectedCountry.value,
                flag: selectedCountry.value,
              }
            : undefined,
        };

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

  // Count validation errors
  const touchedErrorCount = Object.keys(formik.errors).filter(
    (key) => formik.touched[key]
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between bg-dashboard-box dark:bg-[#0F1017] rounded-xl p-4">
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="text-[#677185] dark:hover:text-white"
          >
            <ArrowLeft className="rtl:rotate-180 size-5" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-[#677185] dark:text-white">
                {formType === "add" ? t("addPlayer") : t("editPlayer")}
              </h1>
            </div>
            {player && (
              <p className="text-sm text-[#677185] mt-1">
                {t("editing")}: {player.nickname}
              </p>
            )}
          </div>
        </div>

        {/* Validation Status */}
        {touchedErrorCount > 0 && (
          <div className="flex items-center gap-2 px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-lg">
            <AlertCircle className="size-4 text-red-500" />
            <span className="text-sm text-red-400">
              {touchedErrorCount} {t("validationErrors")}
            </span>
          </div>
        )}
      </div>

      {/* Required Fields Notice */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 flex items-center gap-2">
        <AlertCircle className="size-4 text-blue-400" />
        <span className="text-sm text-blue-400">
          {t("requiredFieldsNotice")}
        </span>
      </div>

      <form className="space-y-6" onSubmit={formik.handleSubmit}>
        {/* Section 1: Basic Information (Required) */}
        <FormSection
          title={t("basicInfo")}
          icon={<User className="size-5" />}
          badge={
            <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded">
              {t("required")}
            </span>
          }
        >
          <FormRow>
            <InputApp
              name="firstName"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.firstName}
              label={t("firstName")}
              placeholder={t("firstNamePlaceholder")}
              className="border-0 focus:outline-none"
              backGroundColor="bg-dashboard-box dark:bg-[#0F1017]"
              textColor="text-[#677185]"
              icon={<User className="size-5 text-[#677185]" />}
              error={
                formik.touched.firstName &&
                formik.errors.firstName &&
                t(formik.errors.firstName)
              }
              required
            />
            <InputApp
              name="lastName"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.lastName}
              label={t("lastName")}
              placeholder={t("lastNamePlaceholder")}
              className="border-0 focus:outline-none"
              backGroundColor="bg-dashboard-box dark:bg-[#0F1017]"
              textColor="text-[#677185]"
              icon={<User className="size-5 text-[#677185]" />}
              error={
                formik.touched.lastName &&
                formik.errors.lastName &&
                t(formik.errors.lastName)
              }
              required
            />
          </FormRow>

          <FormRow>
            <InputApp
              name="nickname"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.nickname}
              label={t("nickname")}
              placeholder={t("nicknamePlaceholder")}
              className="border-0 focus:outline-none"
              backGroundColor="bg-dashboard-box dark:bg-[#0F1017]"
              textColor="text-[#677185]"
              icon={<User className="size-5 text-[#677185]" />}
              error={
                formik.touched.nickname &&
                formik.errors.nickname &&
                t(formik.errors.nickname)
              }
              required
            />
          </FormRow>
        </FormSection>

        {/* Section 2: Personal Details (Required) */}
        <FormSection
          title={t("personalDetails")}
          icon={<Calendar className="size-5" />}
          badge={
            <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded">
              {t("required")}
            </span>
          }
        >
          <FormRow>
            <DatePicker
              formik={formik}
              name="dateOfBirth"
              label={t("birthDate")}
              placeholder={t("birthDatePlaceholder")}
              icon={<Calendar className="size-5 text-[#677185]" />}
              disabledDate={{ after: new Date() }}
              error={
                formik.touched.dateOfBirth &&
                formik.errors.dateOfBirth &&
                t(formik.errors.dateOfBirth)
              }
            />
            <SelectInput
              name="country"
              formik={formik}
              label={t("country")}
              options={mappedArrayToSelectOptions(countries, "label", "value")}
              placeholder={t("countryPlaceholder")}
              onChange={(value) => formik.setFieldValue("country", value)}
              icon={<Globe className="size-5 text-[#677185]" />}
              error={
                formik.touched.country &&
                formik.errors.country &&
                t(formik.errors.country)
              }
            />
          </FormRow>
        </FormSection>

        {/* Section 3: Profile Photos (Required) */}
        <FormSection
          title={t("profilePhotos")}
          icon={<ImageIcon className="size-5" />}
          badge={
            <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded">
              {t("required")}
            </span>
          }
        >
          <FormRow>
            <FileInput
              formik={formik}
              name="photoLight"
              label={t("photoLight")}
              placeholder={t("photoLightPlaceholder")}
              required
              error={
                formik.touched.photoLight &&
                formik.errors.photoLight &&
                t(formik.errors.photoLight)
              }
            />
            <FileInput
              formik={formik}
              name="photoDark"
              label={t("photoDark")}
              placeholder={t("photoDarkPlaceholder")}
            />
          </FormRow>
        </FormSection>

        {/* Section 4: Team & Game (Optional) */}
        <FormSection
          title={t("teamAndGame")}
          icon={<Users className="size-5" />}
          badge={
            <span className="text-xs bg-gray-500/20 text-gray-400 px-2 py-0.5 rounded">
              {t("optional")}
            </span>
          }
        >
          <FormRow>
            <SelectInput
              name="team"
              formik={formik}
              label={t("team")}
              options={mappedArrayToSelectOptions(teamsOptions, "name", "id")}
              placeholder={t("teamPlaceholder")}
              onChange={(value) => {
                formik.setFieldValue("team", value);
                // Reset main game when team changes
                formik.setFieldValue("mainGame", "");
              }}
              icon={<Users className="size-5 text-[#677185]" />}
            />
            <SelectInput
              name="mainGame"
              formik={formik}
              label={t("mainGame")}
              options={mappedArrayToSelectOptions(
                teamsOptions.find((team) => team.id === formik.values.team)
                  ?.games ||
                  gamesOptions ||
                  [],
                "name",
                "id"
              )}
              placeholder={t("mainGamePlaceholder")}
              onChange={(value) => formik.setFieldValue("mainGame", value)}
              icon={<Gamepad2 className="size-5 text-[#677185]" />}
            />
          </FormRow>
        </FormSection>

        {/* Submit Button */}
        <div className="flex justify-between items-center gap-4 pt-4 sticky bottom-0 bg-linear-to-t from-white to-transparent dark:from-[#0a0c10] dark:via-[#0a0c10] dark:to-transparent py-6">
          <div className="text-sm text-[#677185]">
            <span className="text-red-500">*</span> {t("requiredFields")}
          </div>
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="border-[#677185] text-[#677185] hover:text-white hover:border-white"
            >
              <ArrowLeft className="rtl:rotate-180 size-4 mr-2" />
              {t("cancel")}
            </Button>
            <Button
              type="submit"
              disabled={formik.isSubmitting || !formik.isValid}
              className="bg-green-primary hover:bg-green-primary/80 text-white min-w-[140px] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {formik.isSubmitting ? (
                <Spinner />
              ) : formType === "add" ? (
                <>
                  <Plus className="size-4 mr-2" />
                  {t("submit")}
                </>
              ) : (
                <>
                  <Save className="size-4 mr-2" />
                  {t("save")}
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default PlayerFormRedesign;
