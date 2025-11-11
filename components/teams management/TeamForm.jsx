"use client";
import { useFormik } from "formik";
import { TreePalm } from "lucide-react";
import toast from "react-hot-toast";
import * as yup from "yup";
import Date from "../icons/Date";
import Description from "../icons/Description";
import ImageIcon from "../icons/ImageIcon";
import TeamsManagement from "../icons/TeamsManagement";
import UserCardIcon from "../icons/UserCardIcon";
import DatePicker from "../ui app/DatePicker";
import FormRow from "../ui app/FormRow";
import FormSection from "../ui app/FormSection";
import InputApp from "../ui app/InputApp";
import SelectInput from "../ui app/SelectInput";
import TextAreaInput from "../ui app/TextAreaInput";
import { Button } from "../ui/button";
import CountryIcon from "../icons/CountryIcon";
import { useTranslations } from "use-intl";
import ListInput from "../ui app/ListInput";
import { mappedArrayToSelectOptions } from "@/app/[locale]/_Lib/helps";
import FileInput from "../ui app/FileInput";

const validationSchema = yup.object({
  name: yup.string().required("Required"),
  // country: yup.string().required("Required"),
  region: yup.string().required("Required"),
  logo: yup.string().required("Required"),
  logoDark: yup.string().required("Required"),
  description: yup.string().required("Required"),
  foundedDate: yup.string().required("Required"),
  numberOfFollowers: yup.number().required("Required"),
  worldRanking: yup.number().required("Required"),
  numberOfAchievements: yup.number().required("Required"),
  // captain: yup.object().required("Required"),
  subscribe: yup.boolean(),
});

function TeamForm({
  team,
  submit,
  successMessage = "Team added successfully",
  countries,
  formType = "add",
  OptionsData: {
    newsOptions,
    teamsOptions,
    gamesOptions,
    tournamentsOptions,
    playersOptions,
  },
}) {
  const t = useTranslations("TeamForm");
  const formik = useFormik({
    initialValues: {
      name: team?.name || "",
      country: team?.country || null,
      region: team?.region || "",
      logo: team?.logo || "",
      logoDark: team?.logoDark || "",
      description: team?.description || "",
      foundedDate: team?.foundedDate || "",
      numberOfFollowers: team?.numberOfFollowers || 0,
      worldRanking: team?.worldRanking || 0,
      numberOfAchievements: team?.numberOfAchievements || 0,
      captain: team?.captain || null,
      subscribe: team?.subscribe || "false",
      tournaments: team?.tournaments || [],
      games: team?.games || [],
      matches: team?.matches || [],
      players: team?.players || [],
      news: team?.news || [],
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      let dataValues = team ? { id: team.id, ...values } : values;
      dataValues = {
        ...dataValues,
        games: dataValues.games.map((game) => {
          return { id: +JSON.parse(game).value };
        }),
        news: dataValues.news.map((news) => {
          return { id: +JSON.parse(news).value };
        }),
        players: dataValues.news.map((news) => {
          return { id: +JSON.parse(news).value };
        }),
      };

      console.log("data", dataValues);
      try {
        const res = await submit(dataValues);

        formType === "add" && formik.resetForm();
        toast.success(successMessage);
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    },
  });
  console.log("formik ", formik.values);
  console.log("formik errors", formik.errors);
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
            // onBlur={(e) => {
            //   formik.handleBlur(e);
            //   formik.setFieldValue("name", e.target.value.trim());
            // }}
          />

          {/* <SelectInput
            value={formik?.values?.country}
            icon={
              <CountryIcon
                className="fill-[#677185]"
                color={"text-[#677185]"}
                height="44"
                width="44"
              />
            }
            options={countries?.countries || []}
            name={"country"}
            label={t("Country")}
            placeholder={t("Select Country")}
            error={formik.touched.country && formik.errors.country}
            // onBlur={formik.handleBlur}
            onChange={(value) => formik.setFieldValue("country", value)}
          /> */}
          <InputApp
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
          />
        </FormRow>
      </FormSection>
      <FormSection>
        <FormRow>
          <FileInput
            formik={formik}
            label={t("logo")}
            name={"logo"}
            placeholder={t("Upload Team Logo")}
            icon={
              <ImageIcon
                className={"fill-[#677185]"}
                color={"text-[#677185]"}
              />
            }
            error={formik.touched.logo && formik.errors.logo}
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
          name={"foundedDate"}
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
        />
        <TextAreaInput
          value={formik?.values?.description}
          name={"description"}
          label={t("Description")}
          placeholder={t("Enter Team Description")}
          className="border-0 focus:outline-none "
          icon={
            <Description
              className={"fill-[#677185]"}
              color={"text-[#677185]"}
            />
          }
          error={
            formik.touched.description && formik.errors.description
              ? formik.errors.description
              : ""
          }
          // onBlur={formik.handleBlur}
          onBlur={(e) => {
            formik.handleBlur(e);
            formik.setFieldValue("description", e.target.value.trim());
          }}
          onChange={(e) => {
            formik.setFieldValue("description", e.target.value);
          }}
        />
      </FormSection>
      <FormSection>
        <FormRow>
          <InputApp
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
          />
        </FormRow>
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
      <FormSection>
        <FormRow>
          <SelectInput
            value={formik.values.subscribe}
            onChange={(value) => {
              formik.setFieldValue("subscribe", value);
            }}
            // onChange={formik.handleChange}
            label={t("Subscribe")}
            name={"subscribe"}
            error={formik.touched.subscribe && formik.errors.subscribe}
            placeholder={t("Select Subscription Status")}
            options={[
              { value: "true", label: t("Subscribed") },
              { value: "false", label: t("Not Subscribed") },
            ]}
          />
          <SelectInput
            // value={formik?.values?.captain}
            onChange={(value) => {
              formik.setFieldValue("captain", value);
            }}
            label={t("Captain")}
            name={"captain"}
            options={[
              { value: "Captain A", label: "Captain A" },
              { value: "Captain B", label: "Captain B" },
              { value: "Captain C", label: "Captain C" },
            ]}
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
      </FormSection>

      <FormSection>
        <FormRow>
          <ListInput
            typeForm={formType}
            name={"players"}
            formik={formik}
            error={
              formik?.errors?.players && formik?.touched?.players
                ? formik.errors.players
                : ""
            }
            placeholder={t("Select Players for Team")}
            options={mappedArrayToSelectOptions(
              playersOptions || [],
              "firstName",
              "id"
            )}
            initialData={mappedArrayToSelectOptions(
              formik?.values?.games,
              "firstName",
              "id"
            )}
            label={t("Players")}
          />
          <ListInput
            typeForm={formType}
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
          />
        </FormRow>
      </FormSection>

      <div className="flex justify-end">
        <Button
          disabled={formik.isSubmitting}
          type="submit"
          className={
            "text-white text-center min-w-[100px] px-5 py-2 rounded-lg bg-green-primary cursor-pointer hover:bg-green-primary/80"
          }
        >
          {formik.isSubmitting
            ? "Submitting..."
            : formType === "add"
            ? t("Submit")
            : t("Edit")}
        </Button>
      </div>
    </form>
  );
}

export default TeamForm;
