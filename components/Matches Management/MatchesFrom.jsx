"use client";
import Champion from "@/components/icons/Champion";
import TeamsManagement from "@/components/icons/TeamsManagement";
import { Gamepad2, Loader, MapPin } from "lucide-react";

import {
  combineDateAndTime,
  mappedArrayToSelectOptions,
} from "@/app/[locale]/_Lib/helps";
import FormRow from "@/components/ui app/FormRow";
import FormSection from "@/components/ui app/FormSection";
import InputApp from "@/components/ui app/InputApp";
import SelectInput from "@/components/ui app/SelectInput";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/navigation";
import { format } from "date-fns";
import { useFormik } from "formik";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import * as Yup from "yup";
import SelectDateTimeInput from "../ui app/SelectDateAndTimeInput";
import TextAreaInput from "../ui app/TextAreaInput";
import MatchLineupSelector from "./MatchLineupSelector";
const validateSchema = Yup.object({
  date: Yup.date().required("Match date is required"),
  time: Yup.string().required("Match time is required"),

  status: Yup.string()
    .oneOf(["scheduled", "live", "completed", "postponed", "cancelled"], "Invalid status")
    .required("Status is required"),

  bestOf: Yup.number().nullable(),

  isOnline: Yup.string()
    .oneOf(["ONLINE", "OFFLINE"], "Invalid venue type")
    .required("Venue type is required"),

  player1Score: Yup.number()
    .min(0, "Score cannot be negative")
    .default(0),

  player2Score: Yup.number()
    .min(0, "Score cannot be negative")
    .default(0),

  summary: Yup.string().nullable(),

  venue: Yup.string().when("isOnline", {
    is: "OFFLINE",
    then: (schema) => schema.required("Venue is required"),
    otherwise: (schema) => schema.notRequired(),
  }),

  streamUrl: Yup.string().url("Invalid URL").nullable(),
  highlightsUrl: Yup.string().url("Invalid URL").nullable(),

  // Optional fields
  round: Yup.string().nullable(),
  startedAt: Yup.string().nullable(),
  endedAt: Yup.string().nullable(),
  tournament: Yup.string().nullable(),

  // Required fields
  game: Yup.string().required("Game is required"),
  team1: Yup.string().required("Team 1 is required"),
  team2: Yup.string().required("Team 2 is required"),
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
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      // Parse date and time from scheduledDate for edit mode
      date: match?.scheduledDate
        ? format(new Date(match.scheduledDate), "yyyy-MM-dd")
        : "",
      time: match?.scheduledDate
        ? format(new Date(match.scheduledDate), "HH:mm")
        : "",
      status: match?.status || "scheduled",
      bestOf: match?.bestOf || 1,
      isOnline: match?.isOnline === false ? "OFFLINE" : "ONLINE",
      player1Score: match?.result?.team1Score || 0,
      player2Score: match?.result?.team2Score || 0,
      summary: match?.summary || "",
      venue: match?.venue || "",

      streamUrl: match?.streamUrl || "",

      round: match?.round || "",
      tournament: match?.tournament?.id || "",
      game: match?.game?.id || "",

      team1: match?.team1?.id || "",
      team2: match?.team2?.id || "",

      highlightsUrl: match?.highlightsUrl || "",
      startedAt: match?.startedAt
        ? format(new Date(match.startedAt), "HH:mm")
        : "",
      endedAt: match?.endedAt
        ? format(new Date(match.endedAt), "HH:mm")
        : "",

      // Lineup fields
      team1Lineup:
        match?.lineups
          ?.find((lineup) => lineup.team?.id === match?.team1?.id)
          ?.players?.map((player) => player.id) || [],

      team2Lineup:
        match?.lineups
          ?.find((lineup) => lineup.team?.id === match?.team2?.id)
          ?.players?.map((player) => player.id) || [],
    },
    validationSchema: validateSchema,
    onSubmit: async (values) => {
      try {
        // Extract lineup data before processing match data
        const { team1Lineup, team2Lineup, ...matchValues } = values;

        let dataValues = match ? { id: match.id, ...matchValues } : matchValues;

        // Build result object with proper winner handling (including draw)
        const team1Score = Number(dataValues.player1Score) || 0;
        const team2Score = Number(dataValues.player2Score) || 0;

        dataValues = {
          ...dataValues,
          result: {
            team1Score,
            team2Score,
            // Handle draw case - no winner when scores are equal
            winner:
              team1Score > team2Score
                ? dataValues.team1
                : team1Score < team2Score
                  ? dataValues.team2
                  : undefined,
          },
          isOnline: dataValues.isOnline === "ONLINE",
          scheduledDate: format(
            combineDateAndTime(dataValues.date, dataValues.time),
            "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"
          ),
        };

        // Only include startedAt if provided
        if (dataValues.startedAt) {
          dataValues.startedAt = format(
            combineDateAndTime(dataValues.date, dataValues.startedAt),
            "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"
          );
        } else {
          delete dataValues.startedAt;
        }

        // Only include endedAt if provided
        if (dataValues.endedAt) {
          dataValues.endedAt = format(
            combineDateAndTime(dataValues.date, dataValues.endedAt),
            "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"
          );
        } else {
          delete dataValues.endedAt;
        }

        // Clean up temp fields
        delete dataValues.date;
        delete dataValues.time;
        delete dataValues.player1Score;
        delete dataValues.player2Score;
        delete dataValues.summary; // Not in backend schema

        // Remove empty optional fields
        if (!dataValues.tournament) delete dataValues.tournament;
        if (!dataValues.round) delete dataValues.round;
        if (!dataValues.venue) delete dataValues.venue;
        if (!dataValues.streamUrl) delete dataValues.streamUrl;
        if (!dataValues.highlightsUrl) delete dataValues.highlightsUrl;

        // Convert bestOf to number
        if (dataValues.bestOf) {
          dataValues.bestOf = Number(dataValues.bestOf);
        }

        // Remove lineup fields from main data (handle separately via API)
        delete dataValues.team1Lineup;
        delete dataValues.team2Lineup;

        console.log("Submitting match data:", dataValues);

        // SUBMIT THE FORM
        const matchResult = await submit(dataValues);
        const matchId = matchResult?.data?.id || matchResult?.id || match?.id;

        if (formType === "add") {
          formik.resetForm();
        }

        toast.success(
          formType === "add" ? t("The match Added") : t("The Match Edited")
        );

        // Redirect to edit page after successful add
        if (formType === "add" && matchId) {
          router.push(`/dashboard/matches-management/edit`);
        }
      } catch (error) {
        console.error("Match submit error:", error);
        toast.error(error.message || t("Error saving match"));
      }
    },
  });

  const matchTypeOptions = [
    { value: "SOLO", label: t("Solo") },
    { value: "TEAM", label: t("Team") },
  ];
  const matchStateOptions = [
    { value: "scheduled", label: t("UPCOMING") },
    { value: "live", label: t("LIVE") },
    { value: "completed", label: t("FINISHED") },
    { value: "postponed", label: t("POSTPONED") },
    { value: "cancelled", label: t("CANCELLED") },
  ];
  const seriesFormatOptions = [
    { value: 1, label: t("Best of 1") },
    { value: 3, label: t("Best of 3") },
    { value: 5, label: t("Best of 5") },
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
            onChange={(value) => formik.setFieldValue("tournament", value)}
            value={formik.values.tournament}
            label={t("Tournaments")}
            name={"tournament"}
            placeholder={t("Select Tournament")}
            icon={<Champion color={"text-[#677185]"} />}
            error={
              formik?.errors?.tournament && formik?.touched?.tournament
                ? t(formik.errors.tournament)
                : ""
            }
            formik={formik}
          />
          <SelectInput
            formik={formik}
            options={mappedArrayToSelectOptions(
              tournamentsOptions.find((t) => t.id === formik.values?.tournament)
                ?.games || [],

              "name",
              "id"
            )}
            onChange={(value) => {
              formik.setFieldValue("game", value);
              formik.setFieldValue("team1", "");
              formik.setFieldValue("team2", "");
            }}
            value={formik.values.game}
            label={t("Game")}
            name={"game"}
            placeholder={t("Select Game")}
            icon={
              <Gamepad2 height={35} width={35} className={"text-[#677185]"} />
            }
            error={
              formik?.errors?.game && formik?.touched?.game
                ? t(formik.errors.game)
                : ""
            }
          />
        </FormRow>
        <FormRow>
          <SelectInput
            formik={formik}
            label={t("Team 1")}
            name={"team1"}
            options={mappedArrayToSelectOptions(
              teamsOptions
                .filter((team) =>
                  team.games.find((g) => g.id === formik.values?.game)
                )
                .filter((team) => team.id !== formik.values?.team2),
              "name",
              "id"
            )}
            onChange={(value) => formik.setFieldValue("team1", value)}
            value={formik.values.team1}
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
              formik?.errors?.team1 && formik?.touched?.team1
                ? t(formik?.errors?.team1)
                : ""
            }
            disabled={formik.values?.game === ""}
            // onBlur={formik.handleBlur}
            // onChange={formik.handleChange}
          />
          <SelectInput
            formik={formik}
            label={t("Team 2")}
            name={"team2"}
            options={mappedArrayToSelectOptions(
              teamsOptions
                .filter((team) =>
                  team.games.find((g) => g.id === formik.values?.game)
                )
                .filter((team) => team.id !== formik.values?.team1),
              "name",
              "id"
            )}
            onChange={(value) => formik.setFieldValue("team2", value)}
            value={formik.values?.team2}
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
              formik?.errors?.team2 && formik?.touched?.team2
                ? t(formik?.errors?.team2)
                : ""
            }
            disabled={formik.values?.game === ""}
            // onBlur={formik.handleBlur}
          />
          {/* {formik.values.status === "FINISHED" && (
            <SelectInput
              formik={formik}
              label={t("Winning Team")}
              name={"winningTeam"}
              options={mappedArrayToSelectOptions(
                teamsOptions.filter(
                  (team) =>
                    (team.id === formik.values?.team1) |
                    (team.id === formik.values?.team2)
                ),
                "name",
                "id"
              )}
              disabled={
                !formik.values.team1 || !formik.values.team2
              }
              onChange={(value) =>
                formik.setFieldValue("winningTeam", Number(value))
              }
              value={formik.values.winningTeam}
              placeholder={"Select Winning Team"}
              icon={
                <Trophy className="text-[#677185]" height={35} width={35} />
              }
            />
          )} */}
        </FormRow>

        {/* Team Lineups Section */}
        {(formik.values.team1 || formik.values.team2) && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#BABDC4]">
              {t("Team Lineups")}
            </h3>
            <FormRow>
              {formik.values.team1 && (
                <MatchLineupSelector
                  teamId={formik.values.team1}
                  teamName={
                    teamsOptions.find((t) => t.id === formik.values.team1)?.name
                  }
                  teamLogo={
                    teamsOptions.find((t) => t.id === formik.values.team1)?.logo
                      ?.light ||
                    teamsOptions.find((t) => t.id === formik.values.team1)?.logo
                      ?.dark
                  }
                  selectedPlayers={formik.values.team1Lineup}
                  onSelectionChange={(players) =>
                    formik.setFieldValue("team1Lineup", players)
                  }
                />
              )}
              {formik.values.team2 && (
                <MatchLineupSelector
                  teamId={formik.values.team2}
                  teamName={
                    teamsOptions.find((t) => t.id === formik.values.team2)?.name
                  }
                  teamLogo={
                    teamsOptions.find((t) => t.id === formik.values.team2)?.logo
                      ?.light ||
                    teamsOptions.find((t) => t.id === formik.values.team2)?.logo
                      ?.dark
                  }
                  selectedPlayers={formik.values.team2Lineup}
                  onSelectionChange={(players) =>
                    formik.setFieldValue("team2Lineup", players)
                  }
                />
              )}
            </FormRow>
          </div>
        )}

        <FormRow>
          {/* <SelectInput
            formik={formik}
            options={matchTypeOptions}
            onChange={(value) => formik.setFieldValue("matchType", value)}
            value={formik.values.matchType}
            label={t("Match Type")}
            name={"matchType"}
            placeholder={t("Select Match Type")}
            icon={<Champion color={"text-[#677185]"} />}
            error={
              formik?.errors?.matchType && formik?.touched?.matchType
                ? formik.errors.matchType
                : ""
            }
            disabled={formik.isSubmitting}
            // onBlur={formik.handleBlur}
          /> */}

          <SelectInput
            formik={formik}
            options={mappedArrayToSelectOptions(
              matchStateOptions,
              "label",
              "value"
            )}
            onChange={(value) => formik.setFieldValue("status", value)}
            value={formik.values.status}
            label={t("Match State")}
            name={"status"}
            placeholder={t("Select Match State")}
            icon={<Loader className="text-[#677185]" height={35} width={35} />}
            error={
              formik?.errors?.status && formik?.touched?.status
                ? t(formik.errors.status)
                : ""
            }
            disabled={formik.isSubmitting}
            // onBlur={formik.handleBlur}
          />
          <SelectInput
            options={mappedArrayToSelectOptions(
              seriesFormatOptions,
              "label",
              "value"
            )}
            onChange={(value) => formik.setFieldValue("bestOf", value)}
            value={formik.values.bestOf}
            label={t("Series Format")}
            name={"bestOf"}
            placeholder={t("Select Series Format")}
            error={
              formik?.errors?.bestOf && formik?.touched?.bestOf
                ? t(formik.errors.bestOf)
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
            label={
              formik.values.matchType === "SOLO"
                ? t("Player 1 Score")
                : t("Team 1 Score")
            }
            name={"player1Score"}
            type={"number"}
            placeholder={"Enter Player 1 Score"}
            className=" border-0 focus:outline-none "
            backGroundColor={"bg-dashboard-box  dark:bg-[#0F1017]"}
            textColor="text-[#677185]"
            error={
              formik?.errors?.player1Score && formik?.touched?.player1Score
                ? t(formik?.errors?.player1Score)
                : ""
            }
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.player1Score}
            disabled={formik.isSubmitting}
          />

          <InputApp
            label={
              formik.values.matchType === "SOLO"
                ? t("Player 2 Score")
                : t("Team 2 Score")
            }
            name={"player2Score"}
            type={"number"}
            placeholder={"Enter Player 2 Score"}
            className=" border-0 focus:outline-none "
            backGroundColor={"bg-dashboard-box  dark:bg-[#0F1017]"}
            textColor="text-[#677185]"
            error={
              formik?.errors?.player2Score && formik?.touched?.player2Score
                ? t(formik?.errors?.player2Score)
                : ""
            }
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.player2Score}
            disabled={formik.isSubmitting}
          />
        </FormRow>
        <InputApp
          label={t("round")}
          value={formik.values.round}
          onChange={formik.handleChange}
          name={"round"}
          type={"text"}
          placeholder={t("Enter round")}
          className=" border-0 focus:outline-none "
          backGroundColor={"bg-dashboard-box  dark:bg-[#0F1017]"}
          textColor="text-[#677185]"
          error={
            formik?.errors?.round && formik?.touched?.round
              ? t(formik?.errors?.round)
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
            options={mappedArrayToSelectOptions(
              venueTypeOptions,
              "label",
              "value"
            )}
            onChange={(value) => formik.setFieldValue("isOnline", value)}
            value={formik.values.isOnline}
            error={
              formik?.errors?.isOnline && formik?.touched?.isOnline
                ? formik?.errors?.isOnline
                : ""
            }
            icon={<MapPin className="text-[#677185]" height={35} width={35} />}
            name={"venueType"}
            onBlur={(open) => {
              if (!open) formik.setFieldTouched("isOnline", true);
            }}
            disabled={formik.isSubmitting}
          />
          <InputApp
            label={t("Venue")}
            name={"venue"}
            type={"text"}
            placeholder={t("Enter Venue")}
            className=" border-0 focus:outline-none "
            backGroundColor={"bg-dashboard-box  dark:bg-[#0F1017]"}
            textColor="text-[#677185]"
            onChange={formik.handleChange}
            value={formik.values.venue}
            error={
              formik?.errors?.venue && formik?.touched?.venue
                ? t(formik?.errors?.venue)
                : ""
            }
            icon={<MapPin className="text-[#677185]" height={35} width={35} />}
            onBlur={formik.handleBlur}
            disabled={
              formik.values.isOnline === "ONLINE" || formik.isSubmitting
            }
          />
        </FormRow>
      </FormSection>

      <FormSection>
        <SelectDateTimeInput
          label={{ date: t("Date"), time: t("Match Time") }}
          names={{ date: "date", time: "time" }}
          errors={{
            date:
              formik?.errors?.matchDate &&
              formik?.touched?.matchDate &&
              t(formik?.errors?.matchDate),
            time:
              formik?.errors?.matchTime &&
              formik?.touched?.matchTime &&
              t(formik?.errors?.matchTime),
          }}
          formik={formik}
          placeholder={t("Pick a date")}
        />
        <FormRow>
          {/* <DatePicker
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
          /> */}
          <InputApp
            label={t("Start Time")}
            name={"startedAt"}
            type={"time"}
            placeholder={"Enter Start Time"}
            className=" border-0 focus:outline-none "
            backGroundColor={"bg-dashboard-box  dark:bg-[#0F1017]"}
            textColor="text-[#677185]"
            error={
              formik?.errors?.startedAt && formik?.touched?.startedAt
                ? t(formik?.errors?.startedAt)
                : ""
            }
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
          />
          <InputApp
            label={t("End Time")}
            name={"endedAt"}
            type={"time"}
            placeholder={"Enter End Time"}
            className=" border-0 focus:outline-none "
            backGroundColor={"bg-dashboard-box  dark:bg-[#0F1017]"}
            textColor="text-[#677185]"
            error={
              formik?.errors?.endedAt && formik?.touched?.endedAt
                ? t(formik?.errors?.endedAt)
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
          <InputApp
            label={t("Highlight URL")}
            name={"highlightsUrl"}
            type={"text"}
            placeholder={t("Enter Highlight URL")}
            className=" border-0 focus:outline-none "
            backGroundColor={"bg-dashboard-box  dark:bg-[#0F1017]"}
            textColor="text-[#677185]"
            error={
              formik?.errors?.highlightsUrl && formik?.touched?.highlightsUrl
                ? formik?.errors?.highlightsUrl
                : ""
            }
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.highlightsUrl}
          />
        </FormRow>
        <TextAreaInput
          disabled={formik.isSubmitting}
          className={"bg-dashboard-box  dark:bg-[#0F1017]"}
          error={
            (formik.errors.summary &&
              formik.touched.summary &&
              formik.errors.summary) ||
            ""
          }
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.summary}
          label={t("Summary")}
          name={"summary"}
          placeholder={t("Enter Summary")}
          formik={formik}
        />
      </FormSection>
      <div className="flex justify-end">
        <Button
          disabled={formik.isSubmitting || !formik.isValid}
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
