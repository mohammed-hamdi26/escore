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

const validateSchema = Yup.object({
  firstName: Yup.string().required("Required"),
  lastName: Yup.string().required("Required"),

  birthDate: Yup.string().required("Required"),
  nationality: Yup.string().required("Required"),
  photo: Yup.string().required("Required"),
  photoDark: Yup.string().required("Required"),

  // images: Yup.array().required("Required"),
  // imagesDark: Yup.array().required("Required"),
  // socialLinks: Yup.string().required("Required"),

  totalEarnings: Yup.number().min(0).required("Required"),
  mainGame: Yup.string().required("Required"),
  numberOfAchievements: Yup.number().min(0).required("Required"),

  teams: Yup.array().required("Required"),
  games: Yup.array().required("Required"),
  tournaments: Yup.array().required("Required"),
  news: Yup.array().required("Required"),
  worldRanking: Yup.number().min(1).required("Required"),
  marketValue: Yup.number().min(0).required("Required"),
  numberOfFollowers: Yup.number().min(0).required("Required"),
  subscribed: Yup.boolean().required("Required"),
  lineups: Yup.array().required("Required"),
  favoriteCharacters: Yup.array().required("Required"),
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
      mainGame: player?.mainGame || " ",

      numberOfAchievements: 0,
      marketValue: 0,
      worldRanking: 1,
      numberOfFollowers: 0,
      subscribed: false,
      country: null,
      teams: player?.teams || [],
      games: player?.games || [],
      tournaments: player?.tournaments || [],
      news: player?.news || [],
      lineups: player?.lineups || [],
      favoriteCharacters: player?.favoriteCharacters || [],
      socialLinks: player?.socialLinks || [],
    },
    validationSchema: validateSchema,
    onSubmit: async values => {
      let dataValues = player ? { id: player.id, ...values } : values;
      dataValues = {
        ...dataValues,
        games: dataValues.games.map(game => {
          return { id: +JSON.parse(game).value };
        }),
        news: dataValues.news.map(news => {
          return { id: +JSON.parse(news).value };
        }),
        teams: dataValues.teams.map(team => {
          return { id: +JSON.parse(team).value };
        }),
        tournaments: dataValues.tournaments.map(tournament => {
          return { id: +JSON.parse(tournament).value };
        }),
      };
      // console.log(dataValues);
      try {
        await submit(dataValues);
        router.refresh();
        toast.success(successMessage);
      } catch (error) {
        // console.log(error);
        toast.error(error.message);
      }
    },
  });

  // console.log(formik.errors);
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
                ? formik.errors.firstName
                : ""
            }
            // onBlur={(e) => {
            //   formik.handleBlur(e);
            //   formik.setFieldValue("firstName", e.target.value.trim());
            // }}
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
                ? formik.errors.lastName
                : ""
            }
            onBlur={formik.handleBlur}
            // onBlur={(e) => {
            //   formik.handleBlur(e);
            //   formik.setFieldValue("lastName", e.target.value.trim());
            // }}
          />
        </FormRow>
        <FormRow>
          <DatePicker
            name={"birthDate"}
            value={formik.values.birthDate}
            formik={formik}
            label={t("Birth Date")}
            icon={
              <AgeIcon className="fill-[#677185]" color={"text-[#677185]"} />
            }
            placeholder={t("Select Birth Date")}
          />
          <SelectInput
            options={countries?.countries || []}
            name={"nationality"}
            label={t("Nationality")}
            placeholder={t("Select Nationality Player Belong To")}
            icon={
              <CountryIcon
                color={"text-[#677185]"}
                className={"fill-[#677185]"}
              />
            }
            onChange={value => formik.setFieldValue("nationality", value)}
            value={formik.values.nationality}
          />
        </FormRow>
      </FormSection>

      <FormSection>
        <FormRow>
          <InputApp
            type={"text"}
            name={"photo"}
            label={"Player Photo"}
            placeholder={"Enter Player Photo"}
            className="border-0 focus:outline-none "
            backGroundColor={"bg-dashboard-box  dark:bg-[#0F1017]"}
            textColor="text-[#677185]"
            icon={
              <Player
                width="40"
                height="40"
                color={"text-[#677185]"}
                className={"fill-[#677185]"}
              />
            }
            error={
              formik?.errors?.photo && formik?.touched?.photo
                ? formik.errors.photo
                : ""
            }
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
          />
          <InputApp
            type={"text"}
            name={"photoDark"}
            label={"Player Photo Dark"}
            placeholder={"Enter Player Photo Dark"}
            className="border-0 focus:outline-none "
            backGroundColor={"bg-dashboard-box  dark:bg-[#0F1017]"}
            textColor="text-[#677185]"
            icon={
              <Player
                width="40"
                height="40"
                color={"text-[#677185]"}
                className={"fill-[#677185]"}
              />
            }
            error={
              formik?.errors?.photoDark && formik?.touched?.photoDark
                ? formik.errors.photoDark
                : ""
            }
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
          />
        </FormRow>
      </FormSection>
      {/* <FormRow>

          <FileInput
            label={"Player Images"}
            formik={formik}
            name={"images"}
            limitFiles={4}
          />
          <FileInput
            label={"Player Dark Images "}
            formik={formik}
            name={"imagesDark"}
            limitFiles={4}
          />
        </FormRow>
      </FormSection> */}

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
                ? formik.errors.totalEarnings
                : ""
            }
            // onBlur={(e) => {
            //   formik.handleBlur(e);
            //   formik.setFieldValue("totalEarnings", e.target.value.trim());
            // }}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
          />

          <SelectInput
            name={"mainGame"}
            type={"text"}
            value={formik.values.mainGame}
            label={t("Main Game")}
            t={t}
            options={[
              { value: "game1", label: "Game 1" },
              { value: "game2", label: "Game 2" },
            ]}
            onChange={value => formik.setFieldValue("mainGame", value)}
            placeholder={t("Enter Main Game")}
            className="border-0 focus:outline-none "
            backGroundColor={"bg-dashboard-box  dark:bg-[#0F1017]"}
            textColor="text-[#677185]"
            icon={<UserCardIcon color={"text-[#677185]"} />}
            error={
              formik?.errors?.mainGame && formik?.touched?.mainGame
                ? formik.errors.mainGame
                : ""
            }
            // onBlur={formik.handleBlur}
            // onChange={formik.handleChange}
          />
        </FormRow>
      </FormSection>

      <FormSection>
        <FormRow>
          <InputApp
            name={"numberOfAchievements"}
            type={"text"}
            value={formik.values.numberOfAchievements}
            label={t("Number Of Achievements")}
            placeholder={t("Enter Number Of Achievements")}
            className="border-0 focus:outline-none "
            backGroundColor={"bg-dashboard-box  dark:bg-[#0F1017]"}
            textColor="text-[#677185]"
            error={
              formik?.errors?.numberOfAchievements &&
              formik?.touched?.numberOfAchievements
                ? formik.errors.numberOfAchievements
                : ""
            }
            // onBlur={(e) => {
            //   formik.handleBlur(e);
            //   formik.setFieldValue(
            //     "numberOfAchievements",
            //     e.target.value.trim()
            //   );
            // }}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
          />
          <InputApp
            name={"worldRanking"}
            type={"text"}
            value={formik.values.worldRanking}
            label={t("World Ranking")}
            placeholder={t("Enter World Ranking")}
            className="border-0 focus:outline-none "
            backGroundColor={"bg-dashboard-box  dark:bg-[#0F1017]"}
            textColor="text-[#677185]"
            error={
              formik?.errors?.worldRanking && formik?.touched?.worldRanking
                ? formik.errors.worldRanking
                : ""
            }
            onBlur={formik.handleBlur}
            // onBlur={(e) => {
            //   formik.handleBlur(e);
            //   formik.setFieldValue("worldRanking", e.target.value.trim());
            // }}
            onChange={formik.handleChange}
          />
        </FormRow>
        <FormRow>
          <InputApp
            name={"marketValue"}
            type={"text"}
            value={formik.values.marketValue}
            label={t("Market Value")}
            placeholder={t("Enter Market Value")}
            className="border-0 focus:outline-none "
            backGroundColor={"bg-dashboard-box  dark:bg-[#0F1017]"}
            textColor="text-[#677185]"
            error={
              formik?.errors?.marketValue && formik?.touched?.marketValue
                ? formik.errors.marketValue
                : ""
            }
            onBlur={formik.handleBlur}
            // onBlur={(e) => {
            //   formik.handleBlur(e);
            //   formik.setFieldValue("marketValue", e.target.value.trim());
            // }}
            onChange={formik.handleChange}
          />
          <InputApp
            name={"numberOfFollowers"}
            type={"text"}
            value={formik.values.numberOfFollowers}
            label={t("Number Of Followers")}
            placeholder={t("Enter Number Of Followers")}
            className="border-0 focus:outline-none "
            backGroundColor={"bg-dashboard-box  dark:bg-[#0F1017]"}
            textColor="text-[#677185]"
            error={
              formik?.errors?.numberOfFollowers &&
              formik?.touched?.numberOfFollowers
                ? formik.errors.numberOfFollowers
                : ""
            }
            // onBlur={(e) => {
            //   formik.handleBlur(e);
            //   formik.setFieldValue("numberOfFollowers", e.target.value.trim());
            // }}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
          />
        </FormRow>
      </FormSection>

      <FormSection>
        <FormRow>
          <ListInput
            name={"teams"}
            formik={formik}
            error={
              formik?.errors?.teams && formik?.touched?.teams
                ? formik.errors.teams
                : ""
            }
            placeholder={t("Enter Teams")}
            options={mappedArrayToSelectOptions(
              teamsOptions || [],
              "name",
              "id"
            )}
            initialData={mappedArrayToSelectOptions(
              formik?.values?.teams,
              "name",
              "id"
            )}
            label={t("Teams")}
          />
          <ListInput
            name={"games"}
            formik={formik}
            error={
              formik?.errors?.games && formik?.touched?.games
                ? formik.errors.games
                : ""
            }
            placeholder={t("Enter Games")}
            options={mappedArrayToSelectOptions(
              gamesOptions || [],
              "name",
              "id"
            )}
            initialData={mappedArrayToSelectOptions(
              formik?.values?.games,
              "name",
              "id"
            )}
            label={t("Games")}
          />
        </FormRow>
        <FormRow>
          <ListInput
            name={"tournaments"}
            formik={formik}
            error={
              formik?.errors?.tournaments && formik?.touched?.tournaments
                ? formik.errors.tournaments
                : ""
            }
            placeholder={t("Enter Tournaments")}
            options={[
              { value: "1", name: "Tournament 1" },
              { value: "2", name: "Tournament 2" },
            ]}
            initialData={formik?.values?.tournaments}
            label={t("Tournaments")}
          />
          <ListInput
            name={"news"}
            formik={formik}
            error={
              formik?.errors?.news && formik?.touched?.news
                ? formik.errors.news
                : ""
            }
            placeholder={t("Enter News")}
            options={mappedArrayToSelectOptions(
              newsOptions || [],
              "title",
              "id"
            )}
            initialData={mappedArrayToSelectOptions(
              formik?.values?.news,
              "title",
              "id"
            )}
            label={t("News")}
          />
        </FormRow>
        <SelectInput
          name={"selected"}
          value={formik.values.selected}
          type={"text"}
          label={t("Selected")}
          t={t}
          options={[
            { value: "yes", label: "Yes" },
            { value: "no", label: "No" },
          ]}
          onChange={value => formik.setFieldValue("selected", value)}
          placeholder={t("Select Selected")}
          className="border-0 focus:outline-none "
          error={
            formik?.errors?.selected && formik?.touched?.selected
              ? formik.errors.selected
              : ""
          }
        />
      </FormSection>

      <div className="flex justify-end">
        <Button
          disabled={formik.isSubmitting}
          type="submit"
          className={
            "text-white text-center min-w-[100px] px-5 py-2 rounded-lg bg-green-primary cursor-pointer hover:bg-green-primary/80"
          }
        >
          {formType === "add" ? t("Submit") : "Edit"}
        </Button>
      </div>
    </form>
  );
}

export default PlayerFrom;
