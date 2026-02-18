"use client";
import { mappedArrayToSelectOptions } from "@/app/[locale]/_Lib/helps";
import { useFormik } from "formik";
import { TreePalm } from "lucide-react";
import toast from "react-hot-toast";
import { useTranslations } from "use-intl";
import { useRouter } from "@/i18n/navigation";
import * as yup from "yup";
import Date from "../icons/Date";
import Description from "../icons/Description";
import ImageIcon from "../icons/ImageIcon";
import UserCardIcon from "../icons/UserCardIcon";
import DatePicker from "../ui app/DatePicker";
import FileInput from "../ui app/FileInput";
import FormRow from "../ui app/FormRow";
import FormSection from "../ui app/FormSection";
import InputApp from "../ui app/InputApp";
import ListInput from "../ui app/ListInput";
import SelectInput from "../ui app/SelectInput";
import TextAreaInput from "../ui app/TextAreaInput";
import { Button } from "../ui/button";
import ComboboxInput from "../ui app/ComboBoxInput";
import MarkDown from "../ui app/MarkDown";
import Loading from "../ui app/Loading";
import LoadingScreen from "../ui app/loading-screen";
import { Spinner } from "../ui/spinner";
import CountryIcon from "../icons/CountryIcon";

const validationSchema = yup.object({
  name: yup.string().required("Required"),
  // country: yup.string().required("Required"),
  // region: yup.string().required("Required"),
  logoLight: yup.string().required("Required"),
  logoDark: yup.string().required("Required"),
  description: yup.string().required("Required"),
  founded: yup.string().required("Required"),
  // numberOfFollowers: yup.number().required("Required"),
  worldRanking: yup.number().required("Required"),
  numberOfAchievements: yup.number().required("Required"),
  // captain: yup.object().required("Required"),
});

function TeamForm({
  team,
  submit,
  successMessage = "Team added successfully",
  countries,
  formType = "add",
  OptionsData: {
    newsOptions = [],
    teamsOptions,
    gamesOptions = [],
    tournamentsOptions,
    playersOptions = [],
  },
}) {
  const t = useTranslations("TeamForm");
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      name: team?.name || "",
      country: team?.country || null,
      region: team?.region || "",
      logoLight: team?.logo.light || "",
      logoDark: team?.logo.dark || "",
      description: team?.description || "",
      founded: team?.founded || "",

      worldRanking: team?.worldRanking || "",
      numberOfAchievements: team?.numberOfAchievements || "",
      country: team?.country.code || "",
      // numberOfFollowers: team?.numberOfFollowers || "",
      // captain: team?.captain || null,

      // game: team?.game || "",

      // tournaments: team?.tournaments || [],
      game: team?.game || null,
      // matches: team?.matches || [],
      // players: team?.players || [],
      // news: team?.news || [],
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      let dataValues = team ? { id: team.id, ...values } : values;

      const selectedCountry = countries.find(
        (c) => c.value === dataValues.country
      );

      console.log("game", dataValues.game);

      dataValues = {
        ...dataValues,
        logo: {
          light: dataValues.logoLight,
          dark: dataValues.logoDark,
        },
        country: {
          name: selectedCountry.label,
          code: selectedCountry.value,
          flag: selectedCountry.value,
        },
        game: dataValues.game?.id || dataValues.game?.value || dataValues.game,
      };

      // console.log("dataValues", dataValues);

      try {
        const res = await submit(dataValues);
        toast.success(successMessage);
        router.push("/dashboard/teams-management");
      } catch (error) {
        // NEXT_REDIRECT means the action succeeded and called redirect()
        if (error?.digest?.includes("NEXT_REDIRECT") || error.toString().includes("NEXT_REDIRECT")) {
          toast.success(successMessage);
          throw error; // Re-throw to let Next.js handle the redirect
        } else {
          toast.error(error.message);
        }
      }
    },
  });

  // console.log("errors", formik.errors);
  console.log("code", formik.initialValues);

  return (
    <form className="space-y-8 " onSubmit={formik.handleSubmit}>
      <FormSection>
        <FormRow>
          <InputApp
            value={formik?.values?.name}
            onChange={formik.handleChange}
            label={t("Name")}
            name={"name"}
            type={"text"}
            placeholder={t("Enter Team Name")}
            className="border-0 focus:outline-none "
            backGroundColor={"bg-dashboard-box  dark:bg-[#0F1017]"}
            textColor="text-[#677185]"
            icon={<UserCardIcon color={"text-[#677185]"} />}
            error={
              formik.errors.name && formik.touched.name && formik.errors.name
            }
            disabled={formik.isSubmitting}
            onBlur={formik.handleBlur}
            // onBlur={(e) => {
            //   formik.handleBlur(e);
            //   formik.setFieldValue("name", e.target.value.trim());
            // }}
          />

          <SelectInput
            formik={formik}
            value={formik?.values?.country}
            icon={
              <CountryIcon
                className="fill-[#677185]"
                color={"text-[#677185]"}
                height="44"
                width="44"
              />
            }
            options={
              mappedArrayToSelectOptions(countries, "label", "value") || []
            }
            name={"country"}
            label={t("Country")}
            placeholder={t("Select Country")}
            error={formik.touched.country && formik.errors.country}
            // onBlur={formik.handleBlur}
            onChange={(value) => formik.setFieldValue("country", value)}
          />
          {/* <InputApp
            value={formik?.values?.region}
            onChange={formik.handleChange}
            label={t("Region")}
            name={"region"}
            type={"text"}
            placeholder={t("Enter Region Name")}
            className="border-0 focus:outline-none "
            backGroundColor={"bg-dashboard-box  dark:bg-[#0F1017]"}
            textColor="text-[#677185]"
            icon={
              <TreePalm height="35" width="35" className="text-[#677185]" />
            }
            error={
              formik.touched.region &&
              formik.errors.region &&
              formik.errors.region
            }
            onBlur={formik.handleBlur}
            // onBlur={(e) => {
            //   formik.handleBlur(e);
            //   formik.setFieldValue("region", e.target.value.trim());
            //   formik.setFieldTouched("region", true);
            // }}
          /> */}
        </FormRow>
        <MarkDown
          name={"description"}
          label={t("Description")}
          placeholder={t("Enter Team Description")}
          formik={formik}
        />
      </FormSection>
      <FormSection>
        <FormRow>
          <FileInput
            formik={formik}
            label={t("logo")}
            name={"logoLight"}
            placeholder={t("Upload Team Logo")}
            icon={
              <ImageIcon
                className={"fill-[#677185]"}
                color={"text-[#677185]"}
              />
            }
            error={formik.touched.logoLight && formik.errors.logoLight}
          />
          <FileInput
            name={"logoDark"}
            formik={formik}
            placeholder={t("Upload Team Logo")}
            icon={
              <ImageIcon
                className={"fill-[#677185]"}
                color={"text-[#677185]"}
              />
            }
            onChange={formik.handleChange}
            label={t("logo (Dark)")}
            error={formik.touched.logoDark && formik.errors.logoDark}
          />
        </FormRow>
      </FormSection>
      <FormSection>
        <DatePicker
          formik={formik}
          name={"founded"}
          label={t("Founded Date")}
          type={"text"}
          placeholder={t("Select Founded Date")}
          className="border-0 focus:outline-none "
          icon={
            <Date
              height="35"
              width="35"
              className="text-[#677185] fill-[#677185]"
            />
          }
          disabled={formik.isSubmitting}
          disabledDate={{}}
        />
      </FormSection>
      <FormSection>
        {/* <FormRow> */}
        {/* <InputApp
            value={formik?.values?.numberOfFollowers}
            onChange={formik.handleChange}
            label={t("Number of Followers")}
            name={"numberOfFollowers"}
            type={"number"}
            placeholder={t("Enter Number of Followers")}
            className="p-0 border-0 focus:outline-none  "
            backGroundColor={"bg-dashboard-box  dark:bg-[#0F1017]"}
            textColor="text-[#677185]"
            icon={
              <ImageIcon
                className={"fill-[#677185]"}
                color={"text-[#677185]"}
              />
            }
            error={
              formik.touched.numberOfFollowers &&
              formik.errors.numberOfFollowers
            }
            onBlur={formik.handleBlur}
            // onBlur={(e) => {
            //   formik.handleBlur(e);
            //   formik.setFieldValue(
            //     "numberOfFollowers",
            //     Number(e.target.value.trim())
            //   );
            //   formik.setFieldTouched("numberOfFollowers", true);
            // }}
          /> */}
        {/* </FormRow> */}
        <FormRow>
          <InputApp
            value={formik?.values?.worldRanking}
            onChange={formik.handleChange}
            label={t("World Ranking")}
            name={"worldRanking"}
            type={"number"}
            placeholder={t("Enter World Ranking")}
            className="p-0 border-0 focus:outline-none  "
            backGroundColor={"bg-dashboard-box  dark:bg-[#0F1017]"}
            textColor="text-[#677185]"
            icon={
              <ImageIcon
                className={"fill-[#677185]"}
                color={"text-[#677185]"}
              />
            }
            error={formik.touched.worldRanking && formik.errors.worldRanking}
            onBlur={formik.handleBlur}
            // onBlur={(e) => {
            //   formik.handleBlur(e);
            //   formik.setFieldValue(
            //     "worldRanking",
            //     Number(e.target.value.trim())
            //   );
            //   formik.setFieldTouched("worldRanking", true);
            // }}
          />

          <InputApp
            value={formik?.values?.numberOfAchievements}
            onChange={formik.handleChange}
            label={t("Number of Achievements")}
            name={"numberOfAchievements"}
            type={"number"}
            placeholder={t("Enter Number of Achievements")}
            className="p-0 border-0 focus:outline-none  "
            backGroundColor={"bg-dashboard-box  dark:bg-[#0F1017]"}
            textColor="text-[#677185]"
            icon={
              <ImageIcon
                className={"fill-[#677185]"}
                color={"text-[#677185]"}
              />
            }
            error={
              formik.touched.numberOfAchievements &&
              formik.errors.numberOfAchievements
            }
            onBlur={formik.handleBlur}
            // onBlur={(e) => {
            //   formik.handleBlur(e);
            //   formik.setFieldValue(
            //     "numberOfAchievements",
            //     Number(e.target.value.trim())
            //   );
            //   formik.setFieldTouched("numberOfAchievements", true);
            // }}
          />
        </FormRow>
      </FormSection>
      {/*<FormSection>
         <FormRow>
          <SelectInput
            value={formik?.values?.captain?.id}
            onChange={(value) => {
              formik.setFieldValue("captain", { id: Number(value) });
            }}
            label={t("Captain")}
            name={"captain"}
            options={mappedArrayToSelectOptions(
              playersOptions || [],
              "firstName",
              "id"
            )}
            placeholder={t("Enter Captain Name")}
            icon={
              <ImageIcon
                className={"fill-[#677185]"}
                color={"text-[#677185]"}
              />
            }
            error={formik.touched.captain?.name && formik.errors.captain?.name}
          />
        </FormRow>
      </FormSection> */}

      <FormSection>
        <FormRow>
          <SelectInput
            formik={formik}
            value={formik?.values?.game?.id || formik?.values?.game}
            options={mappedArrayToSelectOptions(
              gamesOptions || [],
              "name",
              "id"
            )}
            name={"game"}
            label={t("Game")}
            placeholder={t("Select Game")}
            onChange={(value) => {
              const selectedGame = gamesOptions.find((g) => g.id === value);
              formik.setFieldValue("game", selectedGame || value);
            }}
          />
          {/* <ComboboxInput
            name={"players"}
            formik={formik}
            placeholder={t("Select Players for Team")}
            options={mappedArrayToSelectOptions(
              playersOptions || [],
              "firstName",
              "id"
            )}
            initialData={mappedArrayToSelectOptions(
              formik?.values?.players,
              "firstName",
              "id"
            )}
            label={t("Players")}
          />

        </FormRow>
        <FormRow>
          <ComboboxInput
            typeForm={formType}
            name={"news"}
            formik={formik}
            error={
              formik?.errors?.news && formik?.touched?.news
                ? formik.errors.news
                : ""
            }
            placeholder={t("Enter news")}
            options={mappedArrayToSelectOptions(
              newsOptions || [],
              "title",
              "id"
            )}
            initialData={
              formik.values.news
                ? mappedArrayToSelectOptions(
                    formik?.values?.news,
                    "title",
                    "id"
                  )
                : []
            }
            label={t("News")}
          />*/}
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
            <Spinner className=" text-white" />
          ) : formType === "add" ? (
            t("Submit")
          ) : (
            t("Edit")
          )}
        </Button>
      </div>
    </form>
  );
}

export default TeamForm;
