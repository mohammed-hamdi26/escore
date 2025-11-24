"use client";
import { useFormik } from "formik";
import * as Yup from "yup";
import AgeIcon from "../icons/AgeIcon";
import CountryIcon from "../icons/CountryIcon";
import Player from "../icons/Player";
import UserCardIcon from "../icons/UserCardIcon";
import DatePicker from "../ui app/DatePicker";
import FormRow from "../ui app/FormRow";
import FormSection from "../ui app/FormSection";
import InputApp from "../ui app/InputApp";
import SelectInput from "../ui app/SelectInput";
import { Button } from "../ui/button";

import { mappedArrayToSelectOptions } from "@/app/[locale]/_Lib/helps";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import ListInput from "../ui app/ListInput";
import FileInput from "../ui app/FileInput";
import ComboboxInput from "../ui app/ComboBoxInput";
import { Spinner } from "../ui/spinner";

const validateSchema = Yup.object({
  firstName: Yup.string().required("firstNameRequired"),
  lastName: Yup.string().required("lastNameRequired"),

  birthDate: Yup.string().required("birthDateRequired"),
  nationality: Yup.string().required("nationalityRequired"),
  photo: Yup.string().required("photoRequired"),
  photoDark: Yup.string().required("photoDarkRequired"),

  // images: Yup.array().required("Required"),
  // imagesDark: Yup.array().required("Required"),
  // socialLinks: Yup.string().required("Required"),

  totalEarnings: Yup.number().min(0, "earningsNegative"),
  mainGame: Yup.string(),
  numberOfAchievements: Yup.number().min(0, "achievementsNegative"),
  // teams: Yup.array().required("Required"),
  // games: Yup.array().required("Required"),
  // tournaments: Yup.array().required("Required"),
  // news: Yup.array().required("Required"),
  worldRanking: Yup.number().min(1, "rankingNegative"),
  marketValue: Yup.number().min(0, "marketValueNegative"),

  // lineups: Yup.array().required("Required"),
  // favoriteCharacters: Yup.array().required("Required"),
});

function PlayerFrom({
  countries,
  player,
  submit,
  formType = "add",
  successMessage,
  OptionsData: {
    newsOptions,
    teamsOptions,
    gamesOptions,
    tournamentsOptions,
  } = {},
}) {
  const t = useTranslations("playerForm");
  const router = useRouter();
  const pathname = usePathname();

  const formik = useFormik({
    initialValues: {
      firstName: player?.firstName || "",
      lastName: player?.lastName || "",
      birthDate: player?.birthDate || "",
      nationality: player?.nationality || "",

      photo: player?.photo || "",
      photoDark: player?.photoDark || "",
      images: player?.images || "",
      imagesDark: player?.imagesDark || "",
      socialLink: player?.socialLink || "",
      totalEarnings: player?.totalEarnings || 0,
      mainGame: player?.mainGame || "",

      numberOfAchievements: 0,
      marketValue: 0,
      worldRanking: 1,
      numberOfFollowers: 0,

      country: null,
      teams: player?.teams || [],
      games: player?.games || [],
      tournaments: player?.tournaments || [],
      news: player?.news || [],
      lineups: player?.lineups || [],
      // favoriteCharacters: player?.favoriteCharacters || [],
      // socialLinks: player?.socialLinks || [],
    },
    validationSchema: validateSchema,
    onSubmit: async (values) => {
      try {
        let dataValues = player ? { id: player.id, ...values } : values;

        delete dataValues.country;
        delete dataValues.teams;
        console.log(dataValues);
        await submit(dataValues);
        formType === "add" && formik.resetForm();
        toast.success(successMessage);
      } catch (error) {
        // console.log(error);
        if (!error.toString().includes("Error: NEXT_REDIRECT")) {
          toast.error(error.message);
        } else {
          toast.success(successMessage);
        }
      }
    },
  });

  console.log(formik.errors);
  return (
    <form onSubmit={formik.handleSubmit} className="space-y-8 ">
      <FormSection>
        <FormRow>
          <InputApp
            value={formik.values.firstName}
            onChange={formik.handleChange}
            label={t("First Name")}
            name={"firstName"}
            type={"text"}
            placeholder={t("Enter Player First Name")}
            className="border-0 focus:outline-none "
            backGroundColor={"bg-dashboard-box  dark:bg-[#0F1017]"}
            textColor="text-[#677185]"
            icon={<UserCardIcon color={"text-[#677185]"} />}
            error={
              formik?.errors?.firstName && formik?.touched?.firstName
                ? t(formik.errors.firstName)
                : ""
            }
            onBlur={formik.handleBlur}
          />
          <InputApp
            value={formik.values.lastName}
            onChange={formik.handleChange}
            label={t("Last Name")}
            name={"lastName"}
            type={"text"}
            placeholder={t("Enter Player Last Name")}
            className="border-0 focus:outline-none "
            backGroundColor={"bg-dashboard-box  dark:bg-[#0F1017]"}
            textColor="text-[#677185]"
            icon={
              <UserCardIcon
                className="fill-[#677185]"
                color={"text-[#677185]"}
              />
            }
            error={
              formik?.errors?.lastName && formik?.touched?.lastName
                ? t(formik.errors.lastName)
                : ""
            }
            onBlur={formik.handleBlur}
          />
        </FormRow>
        <FormRow>
          <DatePicker
            name={"birthDate"}
            value={formik.values.birthDate}
            formik={formik}
            label={t("Birth Date")}
            disabledDate={{ after: new Date() }}
            icon={
              <AgeIcon className="fill-[#677185]" color={"text-[#677185]"} />
            }
            placeholder={t("Select Birth Date")}
          />
          <SelectInput
            options={
              mappedArrayToSelectOptions(
                countries?.countries,
                "label",
                "label"
              ) || []
            }
            name={"nationality"}
            label={t("Nationality")}
            placeholder={t("Select Nationality Player Belong To")}
            icon={
              <CountryIcon
                color={"text-[#677185]"}
                className={"fill-[#677185]"}
              />
            }
            onChange={(value) => formik.setFieldValue("nationality", value)}
            value={formik.values.nationality}
          />
        </FormRow>
      </FormSection>

      <FormSection>
        <FormRow>
          <FileInput
            error={
              formik?.errors?.photo && formik?.touched?.photo
                ? t(formik.errors.photo)
                : ""
            }
            t={t}
            formik={formik}
            type={"text"}
            name={"photo"}
            label={t("Player Photo")}
            placeholder={t("Enter Player Photo")}
            icon={
              <Player
                width="40"
                height="40"
                color={"text-[#677185]"}
                className={"fill-[#677185]"}
              />
            }
          />
          <FileInput
            error={
              formik?.errors?.photoDark && formik?.touched?.photoDark
                ? t(formik.errors.photoDark)
                : ""
            }
            t={t}
            formik={formik}
            type={"text"}
            name={"photoDark"}
            label={t("Player Photo Dark")}
            placeholder={t("Enter Player Photo Dark")}
            icon={
              <Player
                width="40"
                height="40"
                color={"text-[#677185]"}
                className={"fill-[#677185]"}
              />
            }
          />
        </FormRow>
      </FormSection>

      <FormSection>
        <FormRow>
          <InputApp
            name={"totalEarnings"}
            type={"number"}
            value={formik.values.totalEarnings}
            label={t("Total Earnings")}
            placeholder={t("Enter Total Earnings")}
            className="border-0 focus:outline-none "
            backGroundColor={"bg-dashboard-box  dark:bg-[#0F1017]"}
            textColor="text-[#677185]"
            icon={<UserCardIcon color={"text-[#677185]"} />}
            error={
              formik?.errors?.totalEarnings && formik?.touched?.totalEarnings
                ? t(formik.errors.totalEarnings)
                : ""
            }
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
          />

          <SelectInput
            name={"mainGame"}
            type={"text"}
            value={formik.values.mainGame}
            label={t("Main Game")}
            options={mappedArrayToSelectOptions(gamesOptions, "name", "name")}
            onChange={(value) => formik.setFieldValue("mainGame", value)}
            placeholder={t("Enter Main Game")}
            className="border-0 focus:outline-none "
            backGroundColor={"bg-dashboard-box  dark:bg-[#0F1017]"}
            textColor="text-[#677185]"
            icon={<UserCardIcon color={"text-[#677185]"} />}
            error={
              formik?.errors?.mainGame && formik?.touched?.mainGame
                ? t(formik.errors.mainGame)
                : ""
            }
          />
        </FormRow>
      </FormSection>

      <FormSection>
        <FormRow>
          <InputApp
            name={"numberOfAchievements"}
            type={"number"}
            value={formik.values.numberOfAchievements}
            label={t("Number Of Achievements")}
            placeholder={t("Enter Number Of Achievements")}
            className="border-0 focus:outline-none "
            backGroundColor={"bg-dashboard-box  dark:bg-[#0F1017]"}
            textColor="text-[#677185]"
            error={
              formik?.errors?.numberOfAchievements &&
              formik?.touched?.numberOfAchievements
                ? t(formik.errors.numberOfAchievements)
                : ""
            }
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
          />
          <InputApp
            name={"worldRanking"}
            type={"number"}
            value={formik.values.worldRanking}
            label={t("World Ranking")}
            placeholder={t("Enter World Ranking")}
            className="border-0 focus:outline-none "
            backGroundColor={"bg-dashboard-box  dark:bg-[#0F1017]"}
            textColor="text-[#677185]"
            error={
              formik?.errors?.worldRanking && formik?.touched?.worldRanking
                ? t(formik.errors.worldRanking)
                : ""
            }
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
          />
        </FormRow>
        <FormRow>
          <InputApp
            name={"marketValue"}
            type={"number"}
            value={formik.values.marketValue}
            label={t("Market Value")}
            placeholder={t("Enter Market Value")}
            className="border-0 focus:outline-none "
            backGroundColor={"bg-dashboard-box  dark:bg-[#0F1017]"}
            textColor="text-[#677185]"
            error={
              formik?.errors?.marketValue && formik?.touched?.marketValue
                ? t(formik.errors.marketValue)
                : ""
            }
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
          />
        </FormRow>
      </FormSection>

      <FormSection>
        <FormRow>
          <ComboboxInput
            name={"teams"}
            formik={formik}
            placeholder={t("Enter Teams")}
            options={mappedArrayToSelectOptions(
              teamsOptions || [],
              "name",
              "id"
            )}
            initialData={mappedArrayToSelectOptions(
              formik?.values?.teams || [],
              "name",
              "id"
            )}
            label={t("Teams")}
          />
          <ComboboxInput
            name={"games"}
            formik={formik}
            placeholder={t("Enter Games")}
            options={mappedArrayToSelectOptions(
              gamesOptions || [],
              "name",
              "id"
            )}
            initialData={mappedArrayToSelectOptions(
              formik?.values?.games || [],
              "name",
              "id"
            )}
            label={t("Games")}
          />
        </FormRow>
        <FormRow>
          <ComboboxInput
            name={"tournaments"}
            formik={formik}
            placeholder={t("Enter Tournaments")}
            options={mappedArrayToSelectOptions(
              tournamentsOptions || [],
              "name",
              "id"
            )}
            initialData={mappedArrayToSelectOptions(
              formik?.values?.tournaments || [],
              "name",
              "id"
            )}
            label={t("Tournaments")}
          />
          <ComboboxInput
            formik={formik}
            placeholder={t("Enter News")}
            label={t("News")}
            name={"news"}
            options={mappedArrayToSelectOptions(newsOptions, "title", "id")}
            initialData={mappedArrayToSelectOptions(
              formik?.values?.news || [],
              "title",
              "id"
            )}
          />
        </FormRow>
      </FormSection>

      <div className="flex justify-end">
        <Button
          disabled={formik.isSubmitting || !formik.isValid}
          type="submit"
          className={
            "text-white text-center min-w-[100px] px-5 py-2 rounded-lg bg-green-primary cursor-pointer hover:bg-green-primary/80"
          }
        >
          {formik.isSubmitting ? (
            <Spinner />
          ) : formType === "add" ? (
            t("Submit")
          ) : (
            "Edit"
          )}
        </Button>
      </div>
    </form>
  );
}

export default PlayerFrom;
