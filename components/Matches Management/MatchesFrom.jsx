"use client";
import Champion from "@/components/icons/Champion";
import TeamsManagement from "@/components/icons/TeamsManagement";
import { Gamepad2, Loader, MapPin, Trophy } from "lucide-react";

import { mappedArrayToSelectOptions } from "@/app/[locale]/_Lib/helps";
import FormRow from "@/components/ui app/FormRow";
import FormSection from "@/components/ui app/FormSection";
import InputApp from "@/components/ui app/InputApp";
import SelectInput from "@/components/ui app/SelectInput";
import { Button } from "@/components/ui/button";
import { useFormik } from "formik";
import * as Yup from "yup";
import Date from "../icons/Date";
import DatePicker from "../ui app/DatePicker";
import TextAreaInput from "../ui app/TextAreaInput";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";
import MarkDown from "../ui app/MarkDown";
const validateSchema = Yup.object({
  matchDate: Yup.date()
    .typeError("Invalid date format")
    .required("Match date is required"),

  matchTime: Yup.string().required("Match time is required"),

  matchType: Yup.string()
    .oneOf(["SOLO", "TEAM"], "Invalid match type")
    .required("Match type is required"),

  status: Yup.string()
    .oneOf(["UPCOMING", "LIVE", "FINISHED", "CANCELLED"], "Invalid status")
    .required("Status is required"),

  seriesFormat: Yup.string().nullable(),

  venueType: Yup.string()
    .oneOf(["ONLINE", "OFFLINE"], "Invalid venue type")
    .required("Venue type is required"),

  player1Score: Yup.number()
    .min(0, "Score cannot be negative")
    .required("Player 1 score is required"),

  player2Score: Yup.number()
    .min(0, "Score cannot be negative")
    .required("Player 2 score is required"),

  summary: Yup.string().nullable(),

  venue: Yup.string().nullable(),

  streamUrl: Yup.string().url("Invalid URL").nullable(),

  vodUrl: Yup.string().url("Invalid URL").nullable(),

  stage: Yup.string().nullable(),
});
function MatchesFrom({
  teamsOptions,
  gamesOptions,
  tournamentsOptions,
  submit,
  match,
  formType = "add",
}) {
  const t = useTranslations("MatchForm");
  const formik = useFormik({
    initialValues: {
      matchDate: match?.matchDate || "",
      matchTime: match?.matchTime || "",
      matchType: match?.matchType || "SOLO",
      status: match?.status || "UPCOMING",
      seriesFormat: match?.seriesFormat || "",
      venueType: match?.venueType || "ONLINE",
      player1Score: match?.player1Score || 0,
      player2Score: match?.player2Score || 0,
      summary: match?.summary || "",
      venue: match?.venue || "",
      streamUrl: match?.streamUrl || "",
      // vodUrl: "",
      stage: match?.stage || "",
      tournament: match?.tournament?.id || {},
      winningTeam: match?.winningTeam || null,
      games: match?.games?.id || {},
      teams: {
        team1: match?.teams[0]?.id || null,
        team2: match?.teams[1]?.id || null,
      },
      vodUrl: match?.vodUrl || "",
    },
    validationSchema: validateSchema,
    onSubmit: async (values) => {
      let dataValues = match ? { id: match.id, ...values } : values;

      dataValues = {
        ...dataValues,

        games: { id: dataValues.games },
        teams: [{ id: dataValues.teams.team1 }, { id: dataValues.teams.team2 }],
        tournament: { id: dataValues.tournament },
        vodUrl: "",
        winningTeam: null,
      };

      console.log(dataValues);
      try {
        await submit(dataValues);
        formType === "add" && formik.resetForm();
        toast.success(
          formType === "add" ? "The match Added" : "The Match Edited"
        );
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    },
  });

  const matchTypeOptions = [
    { value: "SOLO", label: t("Solo") },
    { value: "TEAM", label: t("Team") },
  ];
  const matchStateOptions = [
    { value: "UPCOMING", label: t("UPCOMING") },
    { value: "FINISHED", label: t("FINISHED") },
    { value: "LIVE", label: t("LIVE") },
    { value: "CANCELLED", label: t("CANCELLED") },
  ];
  const seriesFormatOptions = [
    { value: "BO1", label: t("BO1") },
    { value: "BO3", label: t("BO3") },
    { value: "BO5", label: t("BO5") },
  ];
  const venueTypeOptions = [
    { value: "ONLINE", label: t("ONLINE") },
    { value: "OFFLINE", label: t("OFFLINE") },
  ];

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-8 ">
      <FormSection>
        <FormRow>
          <SelectInput
            options={mappedArrayToSelectOptions(
              tournamentsOptions,
              "name",
              "id"
            )}
            onChange={(value) =>
              formik.setFieldValue("tournament", Number(value))
            }
            value={formik.values.tournament}
            label={t("Tournaments")}
            name={"tournament"}
            placeholder={t("Write Champion Name")}
            icon={<Champion color={"text-[#677185]"} />}
            error={
              formik?.errors?.tournament && formik?.touched?.tournament
                ? formik.errors.tournament
                : ""
            }
          />
          <SelectInput
            options={mappedArrayToSelectOptions(gamesOptions, "name", "id")}
            onChange={(value) => formik.setFieldValue("games", Number(value))}
            value={formik.values.games}
            label={t("Game")}
            name={"games"}
            placeholder={t("Write Game Name")}
            icon={
              <Gamepad2 height={35} width={35} className={"text-[#677185]"} />
            }
            error={
              formik?.errors?.games && formik?.touched?.games
                ? formik.errors.games
                : ""
            }
          />
        </FormRow>
        <FormRow>
          <SelectInput
            label={t("Team 1")}
            name={"team"}
            options={mappedArrayToSelectOptions(
              teamsOptions.filter(
                (team) => team.id !== formik.values?.teams?.team2
              ),
              "name",
              "id"
            )}
            onChange={(value) =>
              formik.setFieldValue("teams.team1", Number(value))
            }
            value={formik.values.teams.team1}
            placeholder={t("Write Team Name")}
            icon={
              <TeamsManagement
                height="35"
                width="35"
                className={"fill-[#677185] "}
                color={"text-[#677185]"}
              />
            }
            error={
              formik?.errors?.teams?.team1 && formik?.touched?.teams?.team1
                ? formik?.errors?.teams?.team1
                : ""
            }
            // onBlur={formik.handleBlur}
            // onChange={formik.handleChange}
          />
          <SelectInput
            label={t("Team 2")}
            name={"teams.team2"}
            options={mappedArrayToSelectOptions(
              teamsOptions.filter(
                (team) => team.id !== formik.values?.teams?.team1
              ),
              "name",
              "id"
            )}
            onChange={(value) =>
              formik.setFieldValue("teams.team2", Number(value))
            }
            value={formik.values?.teams?.team2}
            placeholder={t("Select Team Name")}
            icon={
              <TeamsManagement
                height="35"
                width="35"
                className={"fill-[#677185] "}
                color={"text-[#677185]"}
              />
            }
            error={
              formik?.errors?.teams?.team2 && formik?.touched?.teams?.team2
                ? formik?.errors?.teams?.team2
                : ""
            }
            // onBlur={formik.handleBlur}
          />
          <SelectInput
            label={t("Winning Team")}
            name={"winningTeam"}
            options={mappedArrayToSelectOptions(
              teamsOptions.filter(
                (team) =>
                  (team.id === formik.values?.teams?.team1) |
                  (team.id === formik.values?.teams?.team2)
              ),
              "name",
              "id"
            )}
            disabled={!formik.values.teams.team1 || !formik.values.teams.team2}
            onChange={(value) =>
              formik.setFieldValue("winningTeam", Number(value))
            }
            value={formik.values.winningTeam}
            placeholder={"Select Winning Team"}
            icon={<Trophy className="text-[#677185]" height={35} width={35} />}
          />
        </FormRow>
        <FormRow>
          <SelectInput
            options={matchTypeOptions}
            onChange={(value) => formik.setFieldValue("matchType", value)}
            value={formik.values.matchType}
            label={t("Match Type")}
            name={"matchType"}
            placeholder={"Select Match Type"}
            icon={<Champion color={"text-[#677185]"} />}
            error={
              formik?.errors?.matchType && formik?.touched?.matchType
                ? formik.errors.matchType
                : ""
            }
            disabled={formik.isSubmitting}
            // onBlur={formik.handleBlur}
          />

          <SelectInput
            options={matchStateOptions}
            onChange={(value) => formik.setFieldValue("status", value)}
            value={formik.values.status}
            label={t("Match State")}
            name={"status"}
            placeholder={"Select Match State"}
            icon={<Loader className="text-[#677185]" height={35} width={35} />}
            error={
              formik?.errors?.status && formik?.touched?.status
                ? formik.errors.status
                : ""
            }
            disabled={formik.isSubmitting}
            // onBlur={formik.handleBlur}
          />
          <SelectInput
            options={seriesFormatOptions}
            onChange={(value) => formik.setFieldValue("seriesFormat", value)}
            value={formik.values.seriesFormat}
            label={t("Series Format")}
            name={"seriesFormat"}
            placeholder={"Select Series Format"}
            error={
              formik?.errors?.status && formik?.touched?.status
                ? formik.errors.status
                : ""
            }
            // onBlur={formik.handleBlur}
            disabled={formik.isSubmitting}
          />
        </FormRow>
      </FormSection>

      <FormSection>
        <FormRow>
          <InputApp
            label={t("Player 1 Score")}
            name={"player1Score"}
            type={"number"}
            placeholder={"Enter Player 1 Score"}
            className=" border-0 focus:outline-none "
            backGroundColor={"bg-dashboard-box  dark:bg-[#0F1017]"}
            textColor="text-[#677185]"
            error={
              formik?.errors?.player1Score && formik?.touched?.player1Score
                ? formik?.errors?.player1Score
                : ""
            }
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.player1Score}
            disabled={formik.isSubmitting}
          />

          <InputApp
            label={t("Player 2 Score")}
            name={"player2Score"}
            type={"number"}
            placeholder={"Enter Player 2 Score"}
            className=" border-0 focus:outline-none "
            backGroundColor={"bg-dashboard-box  dark:bg-[#0F1017]"}
            textColor="text-[#677185]"
            error={
              formik?.errors?.player2Score && formik?.touched?.player2Score
                ? formik?.errors?.player2Score
                : ""
            }
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.player2Score}
            disabled={formik.isSubmitting}
          />
        </FormRow>
        <InputApp
          label={t("Stage")}
          value={formik.values.stage}
          onChange={formik.handleChange}
          name={"stage"}
          type={"text"}
          placeholder={"Enter Stage"}
          className=" border-0 focus:outline-none "
          backGroundColor={"bg-dashboard-box  dark:bg-[#0F1017]"}
          textColor="text-[#677185]"
          error={
            formik?.errors?.stage && formik?.touched?.stage
              ? formik?.errors?.stage
              : ""
          }
          onBlur={formik.handleBlur}
          disabled={formik.isSubmitting}
        />
      </FormSection>

      <FormSection>
        <FormRow>
          <SelectInput
            label={t("Venue Type")}
            options={venueTypeOptions}
            onChange={(value) => formik.setFieldValue("venueType", value)}
            value={formik.values.venueType}
            error={
              formik?.errors?.venueType && formik?.touched?.venueType
                ? formik?.errors?.venueType
                : ""
            }
            icon={<MapPin className="text-[#677185]" height={35} width={35} />}
            name={"venueType"}
            onBlur={(open) => {
              if (!open) formik.setFieldTouched("venueType", true);
            }}
            disabled={formik.isSubmitting}
          />
          <InputApp
            label={t("Venue")}
            name={"venue"}
            type={"text"}
            placeholder={"Enter Venue"}
            className=" border-0 focus:outline-none "
            backGroundColor={"bg-dashboard-box  dark:bg-[#0F1017]"}
            textColor="text-[#677185]"
            onChange={formik.handleChange}
            value={formik.values.venue}
            error={
              formik?.errors?.venue && formik?.touched?.venue
                ? formik?.errors?.venue
                : ""
            }
            icon={<MapPin className="text-[#677185]" height={35} width={35} />}
            onBlur={formik.handleBlur}
            disabled={
              formik.values.venueType === "ONLINE" || formik.isSubmitting
            }
          />
        </FormRow>
      </FormSection>

      <FormSection>
        <FormRow>
          <DatePicker
            placeholder={"Enter Match Date"}
            formik={formik}
            label={t("Match Date")}
            name={"matchDate"}
            icon={
              <Date
                height="35"
                width="35"
                className={"fill-[#677185] "}
                color={"text-[#677185]"}
              />
            }
          />
          <InputApp
            label={t("time")}
            name={"matchTime"}
            type={"time"}
            placeholder={"Enter Match Time"}
            className=" border-0 focus:outline-none "
            backGroundColor={"bg-dashboard-box  dark:bg-[#0F1017]"}
            textColor="text-[#677185]"
            icon={
              <TeamsManagement
                height="35"
                width="35"
                className={"fill-[#677185] "}
                color={"text-[#677185]"}
              />
            }
            error={
              formik?.errors?.time && formik?.touched?.time
                ? formik?.errors?.time
                : ""
            }
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
          />
        </FormRow>
      </FormSection>

      <FormSection>
        <FormRow>
          <InputApp
            t={t}
            disabled={formik.isSubmitting}
            label={t("Stream URL")}
            name={"streamUrl"}
            type={"text"}
            placeholder={t("Enter Stream URL")}
            className=" border-0 focus:outline-none "
            backGroundColor={"bg-dashboard-box  dark:bg-[#0F1017]"}
            textColor="text-[#677185]"
            error={
              formik?.errors?.streamUrl && formik?.touched?.streamUrl
                ? formik?.errors?.streamUrl
                : ""
            }
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.streamUrl}
          />
          {/* <InputApp
            label={"VOD URL"}
            name={"vodUrl"}
            type={"text"}
            placeholder={"Enter VOD URL"}
            className=" border-0 focus:outline-none "
            backGroundColor={"bg-dashboard-box  dark:bg-[#0F1017]"}
            textColor="text-[#677185]"
            error={
              formik?.errors?.vodUrl && formik?.touched?.vodUrl
                ? formik?.errors?.vodUrl
                : ""
            }
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.vodUrl}
          /> */}
        </FormRow>
        <MarkDown
          disabled={formik.isSubmitting}
          label={t("Summary")}
          name={"summary"}
          placeholder={t("Enter Summary")}
        />
      </FormSection>
      <div className="flex justify-end">
        <Button
          type="submit"
          className={
            "text-white text-center min-w-[100px] px-5 py-2 rounded-lg bg-green-primary cursor-pointer hover:bg-green-primary/80"
          }
        >
          {formik.isSubmitting
            ? formType === "add"
              ? t("Adding")
              : t("Editing")
            : formType === "add"
            ? t("Add Match")
            : t("Edit Match")}
        </Button>
      </div>
    </form>
  );
}

export default MatchesFrom;
