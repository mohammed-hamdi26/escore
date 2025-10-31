"use client";
import { useFormik } from "formik";
import * as Yup from "yup";
import AgeIcon from "../icons/AgeIcon";
import CountryIcon from "../icons/CountryIcon";
import GamesManagement from "../icons/GamesManagement";
import Player from "../icons/Player";
import TeamsManagement from "../icons/TeamsManagement";
import UserCardIcon from "../icons/UserCardIcon";
import FormRow from "../ui app/FormRow";
import FormSection from "../ui app/FormSection";
import InputApp from "../ui app/InputApp";
import SelectInput from "../ui app/SelectInput";
import { Button } from "../ui/button";
import DatePicker from "../ui app/DatePicker";
import FileInput from "../ui app/FileInput";

import toast from "react-hot-toast";

const validateSchema = Yup.object({
  firstName: Yup.string().required("Required"),
  lastName: Yup.string().required("Required"),
  birthDate: Yup.string().required("Required"),
  nationality: Yup.string().required("Required"),

  photo: Yup.string().required("Required"),
  photoDark: Yup.string().required("Required"),
  // images: Yup.array().required("Required"),
  // imagesDark: Yup.array().required("Required"),
  socialLinks: Yup.string().required("Required"),
  totalEarnings: Yup.number().min(0).required("Required"),
  mainGame: Yup.string().required("Required"),
  teams: Yup.array().required("Required"),
  games: Yup.array().required("Required"),
});

function PlayerFrom({
  countries,
  player,
  submit,
  formType = "add",
  successMessage,
}) {
  const formik = useFormik({
    initialValues: {
      firstName: player?.firstName || "",
      lastName: player?.lastName || "",
      birthDate: player?.birthDate || "",
      nationality: player?.nationality || "",

      photo: player?.photo || "mo",
      photoDark: player?.photoDark || "mo",
      images: player?.images || "mo",
      imagesDark: player?.imagesDark || "mo",
      socialLinks: player?.socialLinks || "",
      totalEarnings: player?.totalEarnings || 0,
      mainGame: player?.mainGame || "",
      teams: player?.teams || [],
      games: player?.games || [],
    },
    validationSchema: validateSchema,
    onSubmit: async (values) => {
      let dataValues = player ? { id: player.id, ...values } : values;
      // dataValues = {
      //   ...dataValues,
      //   players: dataValues.players.map((player) => {
      //     return { id: JSON.parse(player).value };
      //   }),
      //   news: dataValues.news.map((news) => {
      //     return { id: JSON.parse(news).value };
      //   }),
      //   teams: dataValues.teams.map((team) => {
      //     return { id: JSON.parse(team).value };
      //   }),
      //   tournaments: dataValues.tournaments.map((tournament) => {
      //     return { id: JSON.parse(tournament).value };
      //   }),
      // };
      try {
        await submit(dataValues);
        formType === "add" && formik.resetForm();
        toast.success(successMessage);
      } catch (error) {
        console.log(error);
        toast.error(error.message);
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
            label={"First Name"}
            name={"firstName"}
            type={"text"}
            placeholder={"Enter Player First Name"}
            className="border-0 focus:outline-none "
            backGroundColor={"bg-dashboard-box  dark:bg-[#0F1017]"}
            textColor="text-[#677185]"
            icon={<UserCardIcon color={"text-[#677185]"} />}
            error={
              formik?.errors?.firstName && formik?.touched?.firstName
                ? formik.errors.firstName
                : ""
            }
            onBlur={formik.handleBlur}
          />
          <InputApp
            value={formik.values.lastName}
            onChange={formik.handleChange}
            label={"Last Name"}
            name={"lastName"}
            type={"text"}
            placeholder={"Enter Player Last Name"}
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
          />
        </FormRow>
        <FormRow>
          <DatePicker
            name={"birthDate"}
            value={formik.values.birthDate}
            formik={formik}
            label={"Birth Date"}
            icon={
              <AgeIcon className="fill-[#677185]" color={"text-[#677185]"} />
            }
            placeholder={"Select Birth Date"}
          />
          <SelectInput
            options={countries?.countries || []}
            name={"nationality"}
            label={"Nationality"}
            placeholder={"Select Nationality Player Belong To"}
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

      {/* <FormSection>
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
        <FormRow>
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
            type={"text"}
            name={"socialLinks"}
            value={formik.values.socialLinks}
            label={"Social Links"}
            placeholder={"Enter Social Links"}
            className="border-0 focus:outline-none "
            backGroundColor={"bg-dashboard-box  dark:bg-[#0F1017]"}
            textColor="text-[#677185]"
            icon={<UserCardIcon color={"text-[#677185]"} />}
            error={
              formik?.errors?.socialLinks && formik?.touched?.socialLinks
                ? formik.errors.socialLinks
                : ""
            }
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
          />
          <InputApp
            name={"totalEarnings"}
            type={"number"}
            value={formik.values.totalEarnings}
            label={"Total Earnings"}
            placeholder={"Enter Total Earnings"}
            className="border-0 focus:outline-none "
            backGroundColor={"bg-dashboard-box  dark:bg-[#0F1017]"}
            textColor="text-[#677185]"
            icon={<UserCardIcon color={"text-[#677185]"} />}
            error={
              formik?.errors?.totalEarnings && formik?.touched?.totalEarnings
                ? formik.errors.totalEarnings
                : ""
            }
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
          />
        </FormRow>
        <FormRow>
          <InputApp
            name={"mainGame"}
            type={"text"}
            value={formik.values.mainGame}
            label={"Main Game"}
            placeholder={"Enter Main Game"}
            className="border-0 focus:outline-none "
            backGroundColor={"bg-dashboard-box  dark:bg-[#0F1017]"}
            textColor="text-[#677185]"
            icon={<UserCardIcon color={"text-[#677185]"} />}
            error={
              formik?.errors?.mainGame && formik?.touched?.mainGame
                ? formik.errors.mainGame
                : ""
            }
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
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
          {formType === "add" ? "Submit" : "Edit"}
        </Button>
      </div>
    </form>
  );
}

export default PlayerFrom;
