"use client";
import { useState, useEffect } from "react";
import { getImgUrl } from "@/lib/utils";
import { useFormik } from "formik";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { format } from "date-fns";
import toast from "react-hot-toast";
import * as Yup from "yup";
import {
  Trophy,
  Gamepad2,
  Users,
  Calendar,
  Clock,
  MapPin,
  Link as LinkIcon,
  Play,
  Save,
  Plus,
  Minus,
  Loader2,
  Search,
  ChevronDown,
  ChevronUp,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  Wifi,
  WifiOff,
  Target,
  Video,
  ExternalLink,
  Hash,
  AlertCircle,
  Info,
  CalendarDays,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import FormSection from "@/components/ui app/FormSection";
import FormRow from "@/components/ui app/FormRow";
import { setMatchLineup, removeMatchLineup } from "@/app/[locale]/_Lib/actions";
import { combineDateAndTime } from "@/app/[locale]/_Lib/helps";
import MatchLineupSelector from "./MatchLineupSelector";

const STATUS_OPTIONS = [
  { value: "scheduled", label: "Scheduled", icon: Clock, color: "blue" },
  { value: "live", label: "LIVE", icon: Play, color: "red" },
  { value: "completed", label: "Completed", icon: Check, color: "green" },
  { value: "postponed", label: "Postponed", icon: Clock, color: "amber" },
  { value: "cancelled", label: "Cancelled", icon: X, color: "gray" },
];

const BEST_OF_OPTIONS = [
  { value: 1, label: "Best of 1" },
  { value: 3, label: "Best of 3" },
  { value: 5, label: "Best of 5" },
  { value: 7, label: "Best of 7" },
];

const validateSchema = Yup.object({
  date: Yup.date().required("dateRequired"),
  time: Yup.string().required("timeRequired"),
  status: Yup.string()
    .oneOf(["scheduled", "live", "completed", "postponed", "cancelled"], "invalidStatus")
    .required("statusRequired"),
  bestOf: Yup.number().nullable(),
  isOnline: Yup.boolean().default(true),
  team1Score: Yup.number().min(0, "scoreMin").default(0),
  team2Score: Yup.number().min(0, "scoreMin").default(0),
  venue: Yup.string().when("isOnline", {
    is: false,
    then: (schema) => schema.required("venueRequired"),
    otherwise: (schema) => schema.notRequired(),
  }),
  streamUrl: Yup.string().url("invalidUrl").nullable(),
  highlightsUrl: Yup.string().url("invalidUrl").nullable(),
  round: Yup.string().nullable(),
  tournament: Yup.string().nullable(),
  isFeatured: Yup.boolean(),
  game: Yup.string().required("gameRequired"),
  team1: Yup.string().required("team1Required"),
  team2: Yup.string().required("team2Required"),
  startedAt: Yup.string()
    .nullable()
    .test("startedAt-min", "Start time cannot be before match time", function (value) {
      const { time } = this.parent;
      if (!value || !time) return true;
      return value >= time;
    }),
  endedAt: Yup.string()
    .nullable()
    .test("endedAt-min", "End time cannot be before start time", function (value) {
      const { startedAt, time } = this.parent;
      if (!value) return true;
      const minTime = startedAt || time;
      if (!minTime) return true;
      return value >= minTime;
    }),
  team1Lineup: Yup.array().nullable(),
  team2Lineup: Yup.array().nullable(),
});

function MatchFormRedesign({
  teamsOptions = [],
  gamesOptions = [],
  tournamentsOptions = [],
  eventsOptions = [],
  submit,
  match,
  formType = "add",
}) {
  const t = useTranslations("MatchForm");
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      date: match?.scheduledDate
        ? format(new Date(match.scheduledDate), "yyyy-MM-dd")
        : "",
      time: match?.scheduledDate
        ? format(new Date(match.scheduledDate), "HH:mm")
        : "",
      status: match?.status || "scheduled",
      bestOf: match?.bestOf || 1,
      isOnline: match?.isOnline !== false,
      team1Score: match?.result?.team1Score || 0,
      team2Score: match?.result?.team2Score || 0,
      venue: match?.venue || "",
      streamUrl: match?.streamUrl || "",
      highlightsUrl: match?.highlightsUrl || "",
      round: match?.round || "",
      event: match?.event?.id || "",
      tournament: match?.tournament?.id || "",
      game: match?.game?.id || "",
      team1: match?.team1?.id || "",
      team2: match?.team2?.id || "",
      isFeatured: match?.isFeatured || false,
      startedAt: match?.startedAt ? format(new Date(match.startedAt), "HH:mm") : "",
      endedAt: match?.endedAt ? format(new Date(match.endedAt), "HH:mm") : "",
      team1Lineup:
        match?.lineups
          ?.find((lineup) => (lineup.team?.id || lineup.team?._id) === (match?.team1?.id || match?.team1?._id))
          ?.players?.map((player) => player.id || player._id) || [],
      team2Lineup:
        match?.lineups
          ?.find((lineup) => (lineup.team?.id || lineup.team?._id) === (match?.team2?.id || match?.team2?._id))
          ?.players?.map((player) => player.id || player._id) || [],
    },
    validationSchema: validateSchema,
    onSubmit: async (values) => {
      try {
        const { team1Lineup, team2Lineup, ...matchValues } = values;
        let dataValues = match ? { id: match.id, ...matchValues } : matchValues;

        const team1Score = Number(dataValues.team1Score) || 0;
        const team2Score = Number(dataValues.team2Score) || 0;

        dataValues = {
          ...dataValues,
          result: {
            team1Score,
            team2Score,
            winner:
              team1Score > team2Score
                ? dataValues.team1
                : team1Score < team2Score
                ? dataValues.team2
                : undefined,
          },
          scheduledDate: combineDateAndTime(dataValues.date, dataValues.time).toISOString(),
        };

        if (dataValues.startedAt) {
          dataValues.startedAt = combineDateAndTime(dataValues.date, dataValues.startedAt).toISOString();
        } else {
          delete dataValues.startedAt;
        }

        if (dataValues.endedAt) {
          dataValues.endedAt = combineDateAndTime(dataValues.date, dataValues.endedAt).toISOString();
        } else {
          delete dataValues.endedAt;
        }

        delete dataValues.date;
        delete dataValues.time;
        delete dataValues.team1Score;
        delete dataValues.team2Score;

        if (!dataValues.event) delete dataValues.event;
        if (!dataValues.tournament) delete dataValues.tournament;
        if (!dataValues.round) delete dataValues.round;
        if (!dataValues.venue) delete dataValues.venue;
        if (!dataValues.streamUrl) delete dataValues.streamUrl;
        if (!dataValues.highlightsUrl) delete dataValues.highlightsUrl;

        if (dataValues.bestOf) {
          dataValues.bestOf = Number(dataValues.bestOf);
        }

        const matchResult = await submit(dataValues);
        const matchId = matchResult?.data?.id || matchResult?.id || match?.id;

        if (matchId) {
          try {
            // Team 1 lineup
            if (team1Lineup && team1Lineup.length > 0 && values.team1) {
              await setMatchLineup(matchId, values.team1, team1Lineup);
            } else if (team1Lineup && team1Lineup.length === 0 && values.team1 && formType === "edit") {
              await removeMatchLineup(matchId, values.team1);
            }
            // Team 2 lineup
            if (team2Lineup && team2Lineup.length > 0 && values.team2) {
              await setMatchLineup(matchId, values.team2, team2Lineup);
            } else if (team2Lineup && team2Lineup.length === 0 && values.team2 && formType === "edit") {
              await removeMatchLineup(matchId, values.team2);
            }
          } catch (lineupError) {
            console.error("Error saving lineups:", lineupError);
            toast.error(t("lineupSaveError") || "Match saved but lineup could not be saved");
          }
        }

        if (formType === "add") {
          formik.resetForm();
        }

        toast.success(formType === "add" ? t("addSuccess") : t("editSuccess"));
        router.push(`/dashboard/matches-management`);
      } catch (error) {
        console.error("Match submit error:", error);
        toast.error(error.message || t("error"));
      }
    },
  });

  // Auto-fill Start Time when Match Time changes
  const matchTimeForStarted = formik.values.time || "";
  const currentStartedAt = formik.values.startedAt || "";
  useEffect(() => {
    if (matchTimeForStarted) {
      // If Start Time is empty or less than Match Time, auto-fill it
      if (!currentStartedAt || currentStartedAt < matchTimeForStarted) {
        formik.setFieldValue("startedAt", matchTimeForStarted);
      }
    }
  }, [matchTimeForStarted]);

  // Auto-adjust End Time if it becomes invalid (less than Start Time)
  const currentEndedAt = formik.values.endedAt || "";
  useEffect(() => {
    if (currentStartedAt && currentEndedAt && currentEndedAt < currentStartedAt) {
      formik.setFieldValue("endedAt", currentStartedAt);
    }
  }, [currentStartedAt]);

  // Smart Status Auto-Selection based on date and time
  const matchDateValue = formik.values.date || "";
  const matchTimeValue = formik.values.time || "";
  const matchEndedAtValue = formik.values.endedAt || "";
  const currentStatus = formik.values.status;

  useEffect(() => {
    // Skip auto-update if status is postponed or cancelled (manual only)
    if (currentStatus === "postponed" || currentStatus === "cancelled") return;

    // Skip if date is not set
    if (!matchDateValue) return;

    const now = new Date();
    const today = new Date(now);
    today.setHours(0, 0, 0, 0); // Normalize to start of day

    const matchDate = new Date(matchDateValue);
    matchDate.setHours(0, 0, 0, 0);

    let newStatus = currentStatus;

    if (today < matchDate) {
      // Match is in the future
      newStatus = "scheduled";
    } else if (today.getTime() === matchDate.getTime()) {
      // Match is today - check end time first, then start time

      // If end time is set and has passed, match is completed
      if (matchEndedAtValue) {
        const [endHours, endMinutes] = matchEndedAtValue.split(":").map(Number);
        const matchEndDateTime = new Date(matchDateValue);
        matchEndDateTime.setHours(endHours, endMinutes, 0, 0);

        if (now >= matchEndDateTime) {
          // End time has passed - match is completed
          newStatus = "completed";
        } else if (matchTimeValue) {
          // End time not reached yet, check if match started
          const [hours, minutes] = matchTimeValue.split(":").map(Number);
          const matchDateTime = new Date(matchDateValue);
          matchDateTime.setHours(hours, minutes, 0, 0);

          if (now >= matchDateTime) {
            newStatus = "live";
          } else {
            newStatus = "scheduled";
          }
        }
      } else if (matchTimeValue) {
        // No end time set, check start time
        const [hours, minutes] = matchTimeValue.split(":").map(Number);
        const matchDateTime = new Date(matchDateValue);
        matchDateTime.setHours(hours, minutes, 0, 0);

        if (now >= matchDateTime) {
          // Match time has passed or is now - should be live
          newStatus = "live";
        } else {
          // Match time hasn't come yet
          newStatus = "scheduled";
        }
      } else {
        // No time set, keep as scheduled on match day
        newStatus = "scheduled";
      }
    } else if (today > matchDate) {
      // Match date has passed
      newStatus = "completed";
    }

    // Only update if status actually changed
    if (newStatus !== currentStatus) {
      formik.setFieldValue("status", newStatus);
    }
  }, [matchDateValue, matchTimeValue, matchEndedAtValue]);

  // Get filtered teams based on selected game
  const getFilteredTeams = (excludeTeamId = null) => {
    let filtered = teamsOptions || [];
    if (formik.values.game) {
      filtered = filtered.filter((team) =>
        (team.game?.id || team.game) === formik.values.game
      );
    }
    if (excludeTeamId) {
      filtered = filtered.filter((team) => team.id !== excludeTeamId);
    }
    return filtered;
  };

  // Get tournaments filtered by selected event
  const getFilteredTournaments = () => {
    if (formik.values.event) {
      return tournamentsOptions.filter((t) =>
        t.parentEvents?.some((pe) => {
          const peId = pe?.id || pe?._id || pe;
          return peId === formik.values.event;
        })
      );
    }
    return tournamentsOptions;
  };

  // Get games from selected tournament or all games
  const getAvailableGames = () => {
    if (formik.values.tournament) {
      const tournament = tournamentsOptions.find((t) => t.id === formik.values.tournament);
      return tournament?.games || [];
    }
    return gamesOptions;
  };

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      {/* Event, Tournament & Game Section */}
      <FormSection
        title={t("eventTournamentAndGame") || "Event, Tournament & Game"}
        icon={<Trophy className="size-5" />}
        badge={
          <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded">
            {t("required") || "Required"}
          </span>
        }
      >
        <FormRow cols={3}>
          <EventSelectField
            label={t("event") || "Event"}
            name="event"
            events={eventsOptions}
            formik={formik}
            placeholder={t("selectEvent") || "Select event"}
            searchPlaceholder={t("searchEvents") || "Search events..."}
            onEventChange={() => {
              formik.setFieldValue("tournament", "");
              formik.setFieldValue("game", "");
              formik.setFieldValue("team1", "");
              formik.setFieldValue("team2", "");
            }}
          />
          <TournamentSelectField
            label={t("tournament") || "Tournament"}
            name="tournament"
            tournaments={getFilteredTournaments()}
            formik={formik}
            placeholder={t("selectTournament") || "Select tournament"}
            searchPlaceholder={t("searchTournaments") || "Search tournaments..."}
            onTournamentChange={(tournamentId) => {
              formik.setFieldValue("game", "");
              formik.setFieldValue("team1", "");
              formik.setFieldValue("team2", "");
              // Auto-fill event if tournament belongs to exactly one event
              if (tournamentId && !formik.values.event) {
                const selected = tournamentsOptions.find((t) => (t.id || t._id) === tournamentId);
                if (selected?.parentEvents?.length === 1) {
                  const peId = selected.parentEvents[0]?.id || selected.parentEvents[0]?._id || selected.parentEvents[0];
                  formik.setFieldValue("event", peId);
                }
              }
            }}
          />
          <GameSelectField
            label={t("game") || "Game"}
            name="game"
            games={getAvailableGames()}
            formik={formik}
            placeholder={t("selectGame") || "Select game"}
            searchPlaceholder={t("searchGames") || "Search games..."}
            required
            onGameChange={() => {
              formik.setFieldValue("team1", "");
              formik.setFieldValue("team2", "");
            }}
          />
        </FormRow>
      </FormSection>

      {/* Teams Section */}
      <FormSection
        title={t("teams") || "Teams"}
        icon={<Users className="size-5" />}
        badge={
          <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded">
            {t("required") || "Required"}
          </span>
        }
      >
        <FormRow cols={2}>
          <TeamSelectField
            label={t("team1") || "Team 1"}
            name="team1"
            teams={getFilteredTeams(formik.values.team2)}
            formik={formik}
            placeholder={t("selectTeam1") || "Select Team 1"}
            searchPlaceholder={t("searchTeams") || "Search teams..."}
            required
            disabled={!formik.values.game}
          />
          <TeamSelectField
            label={t("team2") || "Team 2"}
            name="team2"
            teams={getFilteredTeams(formik.values.team1)}
            formik={formik}
            placeholder={t("selectTeam2") || "Select Team 2"}
            searchPlaceholder={t("searchTeams") || "Search teams..."}
            required
            disabled={!formik.values.game}
          />
        </FormRow>

        {/* Team Lineups */}
        {(formik.values.team1 || formik.values.team2) && (
          <div className="mt-4 space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400">
              <Users className="size-4" />
              {t("teamLineups") || "Team Lineups"}
              <span className="text-xs bg-gray-200 dark:bg-gray-500/20 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded">
                {t("optional") || "Optional"}
              </span>
            </div>
            <FormRow cols={2}>
              {formik.values.team1 && (
                <MatchLineupSelector
                  teamId={formik.values.team1}
                  teamName={teamsOptions.find((t) => t.id === formik.values.team1)?.name}
                  teamLogo={
                    getImgUrl(teamsOptions.find((t) => t.id === formik.values.team1)?.logo?.light) ||
                    getImgUrl(teamsOptions.find((t) => t.id === formik.values.team1)?.logo?.dark)
                  }
                  selectedPlayers={formik.values.team1Lineup}
                  onSelectionChange={(players) => formik.setFieldValue("team1Lineup", players)}
                />
              )}
              {formik.values.team2 && (
                <MatchLineupSelector
                  teamId={formik.values.team2}
                  teamName={teamsOptions.find((t) => t.id === formik.values.team2)?.name}
                  teamLogo={
                    getImgUrl(teamsOptions.find((t) => t.id === formik.values.team2)?.logo?.light) ||
                    getImgUrl(teamsOptions.find((t) => t.id === formik.values.team2)?.logo?.dark)
                  }
                  selectedPlayers={formik.values.team2Lineup}
                  onSelectionChange={(players) => formik.setFieldValue("team2Lineup", players)}
                />
              )}
            </FormRow>
          </div>
        )}
      </FormSection>

      {/* Match Details Section */}
      <FormSection
        title={t("matchDetails") || "Match Details"}
        icon={<Target className="size-5" />}
        badge={
          <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded">
            {t("required") || "Required"}
          </span>
        }
      >
        <FormRow cols={3}>
          <StatusSelectField
            label={t("status") || "Status"}
            name="status"
            formik={formik}
            placeholder={t("selectStatus") || "Select status"}
            required
          />
          <BestOfSelectField
            label={t("bestOf") || "Best Of"}
            name="bestOf"
            formik={formik}
            placeholder={t("selectFormat") || "Select format"}
          />
          <InputField
            label={t("round") || "Round"}
            name="round"
            placeholder={t("roundPlaceholder") || "e.g., Quarter Finals"}
            formik={formik}
            icon={<Hash className="size-5 text-gray-600 dark:text-gray-400" />}
          />
        </FormRow>
      </FormSection>

      {/* Score Section - Only show for live or completed matches */}
      {(formik.values.status === "live" || formik.values.status === "completed") && (
        <FormSection
          title={t("matchResult") || "Match Result"}
          icon={<Target className="size-5" />}
          badge={
            <span className="text-xs bg-gray-200 dark:bg-gray-500/20 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded">
              {t("optional") || "Optional"}
            </span>
          }
        >
          <FormRow cols={2}>
            <ScoreInputField
              label={`${teamsOptions.find((t) => t.id === formik.values.team1)?.name || t("team1") || "Team 1"} ${t("score") || "Score"}`}
              name="team1Score"
              formik={formik}
              teamLogo={getImgUrl(teamsOptions.find((t) => t.id === formik.values.team1)?.logo?.light)}
            />
            <ScoreInputField
              label={`${teamsOptions.find((t) => t.id === formik.values.team2)?.name || t("team2") || "Team 2"} ${t("score") || "Score"}`}
              name="team2Score"
              formik={formik}
              teamLogo={getImgUrl(teamsOptions.find((t) => t.id === formik.values.team2)?.logo?.light)}
            />
          </FormRow>
        </FormSection>
      )}

      {/* Date & Time Section */}
      <FormSection
        title={t("dateAndTime") || "Date & Time"}
        icon={<Calendar className="size-5" />}
        badge={
          <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded">
            {t("required") || "Required"}
          </span>
        }
      >
        <FormRow cols={2}>
          <DatePickerField
            label={t("matchDate") || "Match Date"}
            name="date"
            formik={formik}
            placeholder={t("selectDate") || "Select date"}
            required
          />
          <TimeInputField
            label={t("matchTime") || "Match Time"}
            name="time"
            formik={formik}
            placeholder="HH:MM"
            required
          />
        </FormRow>
        <FormRow cols={2}>
          <TimeInputField
            label={t("startTime") || "Start Time"}
            name="startedAt"
            formik={formik}
            placeholder="HH:MM"
            hint={t("actualStartTime") || "Actual start time"}
          />
          <TimeInputField
            label={t("endTime") || "End Time"}
            name="endedAt"
            formik={formik}
            placeholder="HH:MM"
            hint={t("actualEndTime") || "Actual end time"}
          />
        </FormRow>

        {/* Auto-status hint */}
        <div className="flex items-start gap-3 p-3 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20">
          <Info className="size-4 text-blue-500 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-blue-600 dark:text-blue-400 leading-relaxed">
            {t("autoStatusHint") || "Setting Start Time and End Time enables automatic status transitions. The match will auto-switch to Live when the start time arrives, and to Completed when the end time passes."}
          </p>
        </div>
      </FormSection>

      {/* Venue Section */}
      <FormSection
        title={t("venue") || "Venue"}
        icon={<MapPin className="size-5" />}
        badge={
          <span className="text-xs bg-gray-200 dark:bg-gray-500/20 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded">
            {t("optional") || "Optional"}
          </span>
        }
      >
        <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-100 dark:bg-[#1a1d2e] border border-gray-200 dark:border-transparent mb-4">
          <div className="flex items-center gap-3">
            <Switch
              id="isOnline"
              checked={formik.values.isOnline}
              onCheckedChange={(checked) => formik.setFieldValue("isOnline", checked)}
              disabled={formik.isSubmitting}
            />
            <Label htmlFor="isOnline" className="flex items-center gap-2 cursor-pointer">
              {formik.values.isOnline ? (
                <Wifi className="size-4 text-green-500" />
              ) : (
                <WifiOff className="size-4 text-gray-500 dark:text-gray-400" />
              )}
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                {formik.values.isOnline ? t("online") || "Online" : t("offline") || "Offline"}
              </span>
            </Label>
          </div>
        </div>

        {!formik.values.isOnline && (
          <InputField
            label={t("venueName") || "Venue Name"}
            name="venue"
            placeholder={t("venuePlaceholder") || "Enter venue name"}
            formik={formik}
            icon={<MapPin className="size-5 text-gray-500 dark:text-gray-400" />}
            required={!formik.values.isOnline}
          />
        )}
      </FormSection>

      {/* Links Section — show Stream URL for scheduled/live, Highlights URL for completed */}
      {(formik.values.status === "scheduled" || formik.values.status === "live" || formik.values.status === "completed") && (
        <FormSection
          title={t("links") || "Links"}
          icon={<LinkIcon className="size-5" />}
          badge={
            <span className="text-xs bg-gray-200 dark:bg-gray-500/20 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded">
              {t("optional") || "Optional"}
            </span>
          }
        >
          <FormRow cols={1}>
            {formik.values.status !== "completed" && (
              <InputField
                label={t("streamUrl") || "Stream URL"}
                name="streamUrl"
                placeholder={t("streamUrlPlaceholder") || "https://twitch.tv/..."}
                formik={formik}
                icon={<Video className="size-5 text-purple-500" />}
                type="url"
              />
            )}
            {formik.values.status === "completed" && (
              <InputField
                label={t("highlightsUrl") || "Highlights URL"}
                name="highlightsUrl"
                placeholder={t("highlightsUrlPlaceholder") || "https://youtube.com/..."}
                formik={formik}
                icon={<ExternalLink className="size-5 text-red-500" />}
                type="url"
              />
            )}
          </FormRow>
        </FormSection>
      )}

      {/* Submit Buttons */}
      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          className="h-11 px-6 rounded-xl border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          {t("cancel") || "Cancel"}
        </Button>
        <Button
          disabled={!formik.isValid || formik.isSubmitting}
          type="submit"
          className="h-11 px-8 rounded-xl bg-green-primary hover:bg-green-primary/90 text-white font-medium disabled:opacity-50"
        >
          {formik.isSubmitting ? (
            <>
              <Loader2 className="size-4 mr-2 rtl:mr-0 rtl:ml-2 animate-spin" />
              {formType === "add" ? t("adding") || "Adding..." : t("saving") || "Saving..."}
            </>
          ) : (
            <>
              {formType === "add" ? (
                <Plus className="size-4 mr-2 rtl:mr-0 rtl:ml-2" />
              ) : (
                <Save className="size-4 mr-2 rtl:mr-0 rtl:ml-2" />
              )}
              {formType === "add" ? t("addMatch") || "Add Match" : t("saveMatch") || "Save Match"}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

// Input Field Component
function InputField({ label, name, type = "text", placeholder, formik, icon, required, hint }) {
  const error = formik.touched[name] && formik.errors[name];
  const t = useTranslations("MatchForm");

  return (
    <div className="flex-1 space-y-2">
      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
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
          disabled={formik.isSubmitting}
          className={`w-full h-12 px-4 ${
            icon ? "pl-11 rtl:pl-4 rtl:pr-11" : ""
          } rounded-xl bg-gray-100 dark:bg-[#1a1d2e] dark:bg-[#1a1d2e] border-0 text-sm text-gray-900 dark:text-white placeholder:text-gray-600 dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-primary/50 transition-all disabled:opacity-50 ${
            error ? "ring-2 ring-red-500" : ""
          }`}
        />
      </div>
      {hint && !error && <p className="text-xs text-gray-600 dark:text-gray-400">{hint}</p>}
      {error && <p className="text-xs text-red-500">{t(error) || error}</p>}
    </div>
  );
}

// Enhanced Time Picker Field Component
function TimeInputField({ label, name, formik, placeholder, required, hint }) {
  const [isOpen, setIsOpen] = useState(false);
  const error = formik.touched[name] && formik.errors[name];
  const t = useTranslations("MatchForm");
  const value = formik.values[name] || "";

  // Parse current time
  const [hours, minutes] = value ? value.split(":").map(Number) : [0, 0];

  const formatTime = (h, m) => {
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  };

  const handleHourChange = async (newHour) => {
    const h = Math.max(0, Math.min(23, newHour));
    await formik.setFieldValue(name, formatTime(h, minutes || 0));
    await formik.setFieldTouched(name, true, true);
    formik.validateField(name);
  };

  const handleMinuteChange = async (newMinute) => {
    const m = Math.max(0, Math.min(59, newMinute));
    await formik.setFieldValue(name, formatTime(hours || 0, m));
    await formik.setFieldTouched(name, true, true);
    formik.validateField(name);
  };

  const handleQuickTime = async (h, m) => {
    await formik.setFieldValue(name, formatTime(h, m));
    await formik.setFieldTouched(name, true, true);
    formik.validateField(name);
    setIsOpen(false);
  };

  const handleClear = async (e) => {
    e.stopPropagation();
    await formik.setFieldValue(name, "");
    await formik.setFieldTouched(name, true, true);
    formik.validateField(name);
  };

  const quickTimes = [
    { label: "12:00", h: 12, m: 0 },
    { label: "14:00", h: 14, m: 0 },
    { label: "16:00", h: 16, m: 0 },
    { label: "18:00", h: 18, m: 0 },
    { label: "20:00", h: 20, m: 0 },
    { label: "22:00", h: 22, m: 0 },
  ];

  return (
    <div className="flex-1 space-y-2">
      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <div
            role="button"
            tabIndex={0}
            className={`w-full h-12 px-4 rounded-xl bg-gray-100 dark:bg-[#1a1d2e] dark:bg-[#1a1d2e] border border-transparent text-sm text-left rtl:text-right focus:outline-none focus:ring-2 focus:ring-green-primary/50 cursor-pointer transition-all hover:bg-gray-200 dark:hover:bg-[#252a3d] flex items-center justify-between gap-2 ${
              error ? "ring-2 ring-red-500 border-red-500" : ""
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="size-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Clock className="size-5 text-blue-500" />
              </div>
              {value ? (
                <span className="text-gray-900 dark:text-white font-medium">{value}</span>
              ) : (
                <span className="text-gray-600 dark:text-gray-400">{placeholder || "HH:MM"}</span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {value && (
                <span
                  role="button"
                  tabIndex={0}
                  onClick={handleClear}
                  onKeyDown={(e) => e.key === "Enter" && handleClear(e)}
                  className="size-7 rounded-lg hover:bg-red-500/20 flex items-center justify-center transition-colors group cursor-pointer"
                >
                  <X className="size-4 text-gray-600 dark:text-gray-400 group-hover:text-red-500" />
                </span>
              )}
              <ChevronDown className={`size-4 text-gray-600 dark:text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent
          className="w-[280px] p-0 bg-white dark:bg-[#12141c] border-gray-200 dark:border-white/10"
          align="start"
        >
          {/* Time Display & Controls */}
          <div className="p-4 border-b border-gray-200 dark:border-white/10">
            <div className="flex items-center justify-center gap-4">
              {/* Hours */}
              <div className="flex flex-col items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleHourChange((hours || 0) + 1)}
                  className="size-10 rounded-lg bg-gray-100 dark:bg-[#1a1d2e] dark:bg-[#1a1d2e] hover:bg-gray-200 dark:hover:bg-[#252a3d] flex items-center justify-center transition-colors"
                >
                  <ChevronUp className="size-5 text-gray-900 dark:text-white" />
                </button>
                <input
                  type="text"
                  value={String(hours || 0).padStart(2, "0")}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0;
                    handleHourChange(val);
                  }}
                  className="w-16 h-14 text-center text-2xl font-bold rounded-xl bg-gray-100 dark:bg-[#1a1d2e] dark:bg-[#1a1d2e] border-0 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-primary/50"
                  maxLength={2}
                />
                <button
                  type="button"
                  onClick={() => handleHourChange((hours || 0) - 1)}
                  className="size-10 rounded-lg bg-gray-100 dark:bg-[#1a1d2e] dark:bg-[#1a1d2e] hover:bg-gray-200 dark:hover:bg-[#252a3d] flex items-center justify-center transition-colors"
                >
                  <ChevronDown className="size-5 text-gray-900 dark:text-white" />
                </button>
              </div>

              <span className="text-3xl font-bold text-gray-600 dark:text-gray-400">:</span>

              {/* Minutes */}
              <div className="flex flex-col items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleMinuteChange((minutes || 0) + 5)}
                  className="size-10 rounded-lg bg-gray-100 dark:bg-[#1a1d2e] dark:bg-[#1a1d2e] hover:bg-gray-200 dark:hover:bg-[#252a3d] flex items-center justify-center transition-colors"
                >
                  <ChevronUp className="size-5 text-gray-900 dark:text-white" />
                </button>
                <input
                  type="text"
                  value={String(minutes || 0).padStart(2, "0")}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0;
                    handleMinuteChange(val);
                  }}
                  className="w-16 h-14 text-center text-2xl font-bold rounded-xl bg-gray-100 dark:bg-[#1a1d2e] dark:bg-[#1a1d2e] border-0 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-primary/50"
                  maxLength={2}
                />
                <button
                  type="button"
                  onClick={() => handleMinuteChange((minutes || 0) - 5)}
                  className="size-10 rounded-lg bg-gray-100 dark:bg-[#1a1d2e] dark:bg-[#1a1d2e] hover:bg-gray-200 dark:hover:bg-[#252a3d] flex items-center justify-center transition-colors"
                >
                  <ChevronDown className="size-5 text-gray-900 dark:text-white" />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Time Selection */}
          <div className="p-3">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{t("quickSelect") || "Quick Select"}</p>
            <div className="grid grid-cols-3 gap-2">
              {quickTimes.map((time) => (
                <button
                  key={time.label}
                  type="button"
                  onClick={() => handleQuickTime(time.h, time.m)}
                  className={`h-9 rounded-lg text-sm font-medium transition-colors ${
                    value === time.label
                      ? "bg-green-primary/20 text-green-primary"
                      : "bg-gray-100 dark:bg-[#1a1d2e] dark:bg-[#1a1d2e] hover:bg-gray-200 dark:hover:bg-[#252a3d] text-gray-900 dark:text-white"
                  }`}
                >
                  {time.label}
                </button>
              ))}
            </div>
          </div>

          {/* Done Button */}
          <div className="p-3 border-t border-gray-200 dark:border-white/10">
            <Button
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-full bg-green-primary hover:bg-green-primary/90"
            >
              {t("done") || "Done"}
            </Button>
          </div>
        </PopoverContent>
      </Popover>
      {hint && !error && <p className="text-xs text-gray-600 dark:text-gray-400">{hint}</p>}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

// Score Input Field Component
function ScoreInputField({ label, name, formik, teamLogo }) {
  const error = formik.touched[name] && formik.errors[name];
  const t = useTranslations("MatchForm");
  const currentValue = Number(formik.values[name]) || 0;

  const handleIncrement = () => {
    formik.setFieldValue(name, currentValue + 1);
  };

  const handleDecrement = () => {
    if (currentValue > 0) {
      formik.setFieldValue(name, currentValue - 1);
    }
  };

  return (
    <div className="flex-1 space-y-2">
      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</label>
      <div className="flex items-center gap-2">
        {/* Team Logo */}
        <div className="size-12 rounded-xl bg-gray-100 dark:bg-[#1a1d2e] dark:bg-[#1a1d2e] flex items-center justify-center flex-shrink-0">
          {teamLogo ? (
            <img src={teamLogo} alt="" className="size-8 rounded object-contain" />
          ) : (
            <Target className="size-6 text-green-primary" />
          )}
        </div>

        {/* Decrement Button */}
        <button
          type="button"
          onClick={handleDecrement}
          disabled={formik.isSubmitting || currentValue <= 0}
          className="size-14 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0"
        >
          <Minus className="size-6" />
        </button>

        {/* Score Display */}
        <div
          className={`flex-1 h-14 rounded-xl bg-gray-100 dark:bg-[#1a1d2e] dark:bg-[#1a1d2e] flex items-center justify-center ${
            error ? "ring-2 ring-red-500" : ""
          }`}
        >
          <input
            type="number"
            name={name}
            value={formik.values[name] ?? ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            min="0"
            disabled={formik.isSubmitting}
            className="w-full h-full bg-transparent border-0 text-3xl font-bold text-center text-gray-900 dark:text-white focus:outline-none disabled:opacity-50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>

        {/* Increment Button */}
        <button
          type="button"
          onClick={handleIncrement}
          disabled={formik.isSubmitting}
          className="size-14 rounded-xl bg-green-500/10 hover:bg-green-500/20 text-green-500 flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0"
        >
          <Plus className="size-6" />
        </button>
      </div>
      {error && <p className="text-xs text-red-500">{t(error) || error}</p>}
    </div>
  );
}

// Tournament Select Field
function TournamentSelectField({
  label,
  name,
  tournaments,
  formik,
  placeholder,
  searchPlaceholder,
  onTournamentChange,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const error = formik.touched[name] && formik.errors[name];
  const value = formik.values[name];
  const t = useTranslations("MatchForm");

  const getTournamentId = (tournament) => tournament?.id || tournament?._id;
  const selectedTournament = tournaments?.find((t) => getTournamentId(t) === value);

  const filteredTournaments = tournaments?.filter(
    (tournament) =>
      tournament.name?.toLowerCase().includes(search.toLowerCase()) ||
      tournament.slug?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = async (tournament) => {
    const id = getTournamentId(tournament);
    await formik.setFieldValue(name, id);
    await formik.setFieldTouched(name, true, true);
    formik.validateField(name);
    if (onTournamentChange) onTournamentChange(id);
    setIsOpen(false);
    setSearch("");
  };

  const handleClear = async (e) => {
    e.stopPropagation();
    await formik.setFieldValue(name, "");
    await formik.setFieldTouched(name, true, true);
    formik.validateField(name);
    if (onTournamentChange) onTournamentChange(null);
  };

  return (
    <div className="flex-1 space-y-2">
      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</label>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <div
            role="button"
            tabIndex={0}
            className={`w-full h-12 px-4 rounded-xl bg-gray-100 dark:bg-[#1a1d2e] dark:bg-[#1a1d2e] border border-transparent text-sm text-left rtl:text-right focus:outline-none focus:ring-2 focus:ring-green-primary/50 cursor-pointer transition-all hover:bg-gray-200 dark:hover:bg-[#252a3d] flex items-center justify-between gap-2 ${
              error ? "ring-2 ring-red-500 border-red-500" : ""
            }`}
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {selectedTournament ? (
                <>
                  <div className="size-8 rounded-lg overflow-hidden flex-shrink-0 bg-amber-500/10 flex items-center justify-center">
                    {selectedTournament.logo?.light ? (
                      <img
                        src={getImgUrl(selectedTournament.logo.light, "thumbnail")}
                        alt={selectedTournament.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Trophy className="size-4 text-amber-500" />
                    )}
                  </div>
                  <span className="text-gray-900 dark:text-white font-medium truncate">
                    {selectedTournament.name}
                  </span>
                </>
              ) : (
                <>
                  <div className="size-8 rounded-lg bg-gray-100 dark:bg-[#252a3d] flex items-center justify-center flex-shrink-0">
                    <Trophy className="size-4 text-gray-600 dark:text-gray-400" />
                  </div>
                  <span className="text-gray-600 dark:text-gray-400">{placeholder}</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-1">
              {selectedTournament && (
                <span
                  role="button"
                  tabIndex={0}
                  onClick={handleClear}
                  onKeyDown={(e) => e.key === "Enter" && handleClear(e)}
                  className="size-7 rounded-lg hover:bg-red-500/20 flex items-center justify-center transition-colors group cursor-pointer"
                >
                  <X className="size-4 text-gray-600 dark:text-gray-400 group-hover:text-red-500" />
                </span>
              )}
              <ChevronDown className={`size-4 text-gray-600 dark:text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] p-0 bg-white dark:bg-[#12141c] border-gray-200 dark:border-white/10"
          align="start"
        >
          <div className="p-3 border-b border-gray-200 dark:border-white/10">
            <div className="relative">
              <Search className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 size-4 text-gray-600 dark:text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full h-10 pl-10 pr-4 rtl:pl-4 rtl:pr-10 rounded-lg bg-gray-100 dark:bg-[#1a1d2e] dark:bg-[#1a1d2e] border-0 text-sm text-gray-900 dark:text-white placeholder:text-gray-600 dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-primary/50"
                autoFocus
              />
            </div>
          </div>
          <div className="max-h-64 overflow-y-auto p-2">
            {filteredTournaments?.length === 0 ? (
              <div className="py-6 text-center text-sm text-gray-600 dark:text-gray-400">
                {t("noTournamentsFound") || "No tournaments found"}
              </div>
            ) : (
              filteredTournaments?.map((tournament) => {
                const tournamentId = getTournamentId(tournament);
                const isSelected = value === tournamentId;
                return (
                  <button
                    key={tournamentId}
                    type="button"
                    onClick={() => handleSelect(tournament)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left rtl:text-right transition-colors ${
                      isSelected ? "bg-amber-500/10 text-amber-500" : "hover:bg-gray-200 dark:hover:bg-[#1a1d2e]"
                    }`}
                  >
                    <div className="size-8 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-[#252a3d]">
                      {tournament.logo?.light ? (
                        <img src={getImgUrl(tournament.logo.light, "thumbnail")} alt={tournament.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Trophy className="size-4 text-gray-600 dark:text-gray-400" />
                        </div>
                      )}
                    </div>
                    <span className={`flex-1 text-sm font-medium ${isSelected ? "text-amber-500" : "text-gray-900 dark:text-white"}`}>
                      {tournament.name}
                    </span>
                    {isSelected && <Check className="size-4 text-amber-500 flex-shrink-0" />}
                  </button>
                );
              })
            )}
          </div>
        </PopoverContent>
      </Popover>
      {error && <p className="text-xs text-red-500">{t(error) || error}</p>}
    </div>
  );
}

// Event Select Field
function EventSelectField({
  label,
  name,
  events,
  formik,
  placeholder,
  searchPlaceholder,
  onEventChange,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const error = formik.touched[name] && formik.errors[name];
  const value = formik.values[name];
  const t = useTranslations("MatchForm");

  const getEventId = (event) => event?.id || event?._id;
  const selectedEvent = events?.find((e) => getEventId(e) === value);

  const filteredEvents = events?.filter(
    (event) =>
      event.name?.toLowerCase().includes(search.toLowerCase()) ||
      event.slug?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = async (event) => {
    await formik.setFieldValue(name, getEventId(event));
    await formik.setFieldTouched(name, true, true);
    formik.validateField(name);
    if (onEventChange) onEventChange();
    setIsOpen(false);
    setSearch("");
  };

  const handleClear = async (e) => {
    e.stopPropagation();
    await formik.setFieldValue(name, "");
    await formik.setFieldTouched(name, true, true);
    formik.validateField(name);
    if (onEventChange) onEventChange();
  };

  return (
    <div className="flex-1 space-y-2">
      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</label>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <div
            role="button"
            tabIndex={0}
            className={`w-full h-12 px-4 rounded-xl bg-gray-100 dark:bg-[#1a1d2e] border border-transparent text-sm text-left rtl:text-right focus:outline-none focus:ring-2 focus:ring-green-primary/50 cursor-pointer transition-all hover:bg-gray-200 dark:hover:bg-[#252a3d] flex items-center justify-between gap-2 ${
              error ? "ring-2 ring-red-500 border-red-500" : ""
            }`}
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {selectedEvent ? (
                <>
                  <div className="size-8 rounded-lg overflow-hidden flex-shrink-0 bg-purple-500/10 flex items-center justify-center">
                    {selectedEvent.logo?.light ? (
                      <img
                        src={getImgUrl(selectedEvent.logo.light, "thumbnail")}
                        alt={selectedEvent.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <CalendarDays className="size-4 text-purple-500" />
                    )}
                  </div>
                  <span className="text-gray-900 dark:text-white font-medium truncate">
                    {selectedEvent.name}
                  </span>
                </>
              ) : (
                <>
                  <div className="size-8 rounded-lg bg-gray-100 dark:bg-[#252a3d] flex items-center justify-center flex-shrink-0">
                    <CalendarDays className="size-4 text-gray-600 dark:text-gray-400" />
                  </div>
                  <span className="text-gray-600 dark:text-gray-400">{placeholder}</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-1">
              {selectedEvent && (
                <span
                  role="button"
                  tabIndex={0}
                  onClick={handleClear}
                  onKeyDown={(e) => e.key === "Enter" && handleClear(e)}
                  className="size-7 rounded-lg hover:bg-red-500/20 flex items-center justify-center transition-colors group cursor-pointer"
                >
                  <X className="size-4 text-gray-600 dark:text-gray-400 group-hover:text-red-500" />
                </span>
              )}
              <ChevronDown className={`size-4 text-gray-600 dark:text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] p-0 bg-white dark:bg-[#12141c] border-gray-200 dark:border-white/10"
          align="start"
        >
          <div className="p-3 border-b border-gray-200 dark:border-white/10">
            <div className="relative">
              <Search className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 size-4 text-gray-600 dark:text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full h-10 pl-10 pr-4 rtl:pl-4 rtl:pr-10 rounded-lg bg-gray-100 dark:bg-[#1a1d2e] border-0 text-sm text-gray-900 dark:text-white placeholder:text-gray-600 dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-primary/50"
                autoFocus
              />
            </div>
          </div>
          <div className="max-h-64 overflow-y-auto p-2">
            {filteredEvents?.length === 0 ? (
              <div className="py-6 text-center text-sm text-gray-600 dark:text-gray-400">
                {t("noEventsFound") || "No events found"}
              </div>
            ) : (
              filteredEvents?.map((event) => {
                const eventId = getEventId(event);
                const isSelected = value === eventId;
                return (
                  <button
                    key={eventId}
                    type="button"
                    onClick={() => handleSelect(event)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left rtl:text-right transition-colors ${
                      isSelected ? "bg-purple-500/10 text-purple-500" : "hover:bg-gray-200 dark:hover:bg-[#1a1d2e]"
                    }`}
                  >
                    <div className="size-8 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-[#252a3d]">
                      {event.logo?.light ? (
                        <img src={getImgUrl(event.logo.light, "thumbnail")} alt={event.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <CalendarDays className="size-4 text-gray-600 dark:text-gray-400" />
                        </div>
                      )}
                    </div>
                    <span className={`flex-1 text-sm font-medium ${isSelected ? "text-purple-500" : "text-gray-900 dark:text-white"}`}>
                      {event.name}
                    </span>
                    {isSelected && <Check className="size-4 text-purple-500 flex-shrink-0" />}
                  </button>
                );
              })
            )}
          </div>
        </PopoverContent>
      </Popover>
      {error && <p className="text-xs text-red-500">{t(error) || error}</p>}
    </div>
  );
}

// Game Select Field
function GameSelectField({ label, name, games, formik, placeholder, searchPlaceholder, required, onGameChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const error = formik.touched[name] && formik.errors[name];
  const value = formik.values[name];
  const t = useTranslations("MatchForm");

  // Ensure games is an array
  const safeGames = Array.isArray(games) ? games : [];

  const getGameId = (game) => game?.id || game?._id;
  const selectedGame = safeGames.find((g) => getGameId(g) === value);

  const filteredGames = safeGames.filter(
    (game) =>
      game.name?.toLowerCase().includes(search.toLowerCase()) ||
      game.slug?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = async (game) => {
    await formik.setFieldValue(name, getGameId(game));
    await formik.setFieldTouched(name, true, true);
    formik.validateField(name);
    if (onGameChange) onGameChange();
    setIsOpen(false);
    setSearch("");
  };

  const handleClear = async (e) => {
    e.stopPropagation();
    await formik.setFieldValue(name, "");
    await formik.setFieldTouched(name, true, true);
    formik.validateField(name);
    if (onGameChange) onGameChange();
  };

  return (
    <div className="flex-1 space-y-2">
      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <div
            role="button"
            tabIndex={0}
            className={`w-full h-12 px-4 rounded-xl bg-gray-100 dark:bg-[#1a1d2e] dark:bg-[#1a1d2e] border border-transparent text-sm text-left rtl:text-right focus:outline-none focus:ring-2 focus:ring-green-primary/50 cursor-pointer transition-all hover:bg-gray-200 dark:hover:bg-[#252a3d] flex items-center justify-between gap-2 ${
              error ? "ring-2 ring-red-500 border-red-500" : ""
            }`}
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {selectedGame ? (
                <>
                  <div className="size-8 rounded-lg overflow-hidden flex-shrink-0 bg-green-primary/10 flex items-center justify-center">
                    {selectedGame.logo?.light ? (
                      <img src={getImgUrl(selectedGame.logo.light, "thumbnail")} alt={selectedGame.name} className="w-full h-full object-cover" />
                    ) : (
                      <Gamepad2 className="size-4 text-green-primary" />
                    )}
                  </div>
                  <span className="text-gray-900 dark:text-white font-medium truncate">{selectedGame.name}</span>
                </>
              ) : (
                <>
                  <div className="size-8 rounded-lg bg-gray-100 dark:bg-[#252a3d] flex items-center justify-center flex-shrink-0">
                    <Gamepad2 className="size-4 text-gray-600 dark:text-gray-400" />
                  </div>
                  <span className="text-gray-600 dark:text-gray-400">{placeholder}</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-1">
              {selectedGame && (
                <span
                  role="button"
                  tabIndex={0}
                  onClick={handleClear}
                  onKeyDown={(e) => e.key === "Enter" && handleClear(e)}
                  className="size-7 rounded-lg hover:bg-red-500/20 flex items-center justify-center transition-colors group cursor-pointer"
                >
                  <X className="size-4 text-gray-600 dark:text-gray-400 group-hover:text-red-500" />
                </span>
              )}
              <ChevronDown className={`size-4 text-gray-600 dark:text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] p-0 bg-white dark:bg-[#12141c] border-gray-200 dark:border-white/10"
          align="start"
        >
          <div className="p-3 border-b border-gray-200 dark:border-white/10">
            <div className="relative">
              <Search className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 size-4 text-gray-600 dark:text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full h-10 pl-10 pr-4 rtl:pl-4 rtl:pr-10 rounded-lg bg-gray-100 dark:bg-[#1a1d2e] dark:bg-[#1a1d2e] border-0 text-sm text-gray-900 dark:text-white placeholder:text-gray-600 dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-primary/50"
                autoFocus
              />
            </div>
          </div>
          <div className="max-h-64 overflow-y-auto p-2">
            {filteredGames?.length === 0 ? (
              <div className="py-6 text-center text-sm text-gray-600 dark:text-gray-400">
                {t("noGamesFound") || "No games found"}
              </div>
            ) : (
              filteredGames?.map((game) => {
                const gameId = getGameId(game);
                const isSelected = value === gameId;
                return (
                  <button
                    key={gameId}
                    type="button"
                    onClick={() => handleSelect(game)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left rtl:text-right transition-colors ${
                      isSelected ? "bg-green-primary/10 text-green-primary" : "hover:bg-gray-200 dark:hover:bg-[#1a1d2e]"
                    }`}
                  >
                    <div className="size-8 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-[#252a3d]">
                      {game.logo?.light ? (
                        <img src={getImgUrl(game.logo.light, "thumbnail")} alt={game.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Gamepad2 className="size-4 text-gray-600 dark:text-gray-400" />
                        </div>
                      )}
                    </div>
                    <span className={`flex-1 text-sm font-medium ${isSelected ? "text-green-primary" : "text-gray-900 dark:text-white"}`}>
                      {game.name}
                    </span>
                    {isSelected && <Check className="size-4 text-green-primary flex-shrink-0" />}
                  </button>
                );
              })
            )}
          </div>
        </PopoverContent>
      </Popover>
      {error && <p className="text-xs text-red-500">{t(error) || error}</p>}
    </div>
  );
}

// Team Select Field
function TeamSelectField({ label, name, teams, formik, placeholder, searchPlaceholder, required, disabled }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const error = formik.touched[name] && formik.errors[name];
  const value = formik.values[name];
  const t = useTranslations("MatchForm");

  const getTeamId = (team) => team?.id || team?._id;
  const selectedTeam = teams?.find((t) => getTeamId(t) === value);

  const filteredTeams = teams?.filter(
    (team) =>
      team.name?.toLowerCase().includes(search.toLowerCase()) ||
      team.shortName?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = async (team) => {
    await formik.setFieldValue(name, getTeamId(team));
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

  return (
    <div className="flex-1 space-y-2">
      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild disabled={disabled}>
          <div
            role="button"
            tabIndex={disabled ? -1 : 0}
            className={`w-full h-12 px-4 rounded-xl bg-gray-100 dark:bg-[#1a1d2e] dark:bg-[#1a1d2e] border border-transparent text-sm text-left rtl:text-right focus:outline-none focus:ring-2 focus:ring-green-primary/50 cursor-pointer transition-all hover:bg-gray-200 dark:hover:bg-[#252a3d] flex items-center justify-between gap-2 ${
              error ? "ring-2 ring-red-500 border-red-500" : ""
            } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {selectedTeam ? (
                <>
                  <div className="size-8 rounded-lg overflow-hidden flex-shrink-0 bg-blue-500/10 flex items-center justify-center">
                    {selectedTeam.logo?.light ? (
                      <img src={getImgUrl(selectedTeam.logo.light, "thumbnail")} alt={selectedTeam.name} className="w-full h-full object-cover" />
                    ) : (
                      <Users className="size-4 text-blue-500" />
                    )}
                  </div>
                  <span className="text-gray-900 dark:text-white font-medium truncate">{selectedTeam.name}</span>
                </>
              ) : (
                <>
                  <div className="size-8 rounded-lg bg-gray-100 dark:bg-[#252a3d] flex items-center justify-center flex-shrink-0">
                    <Users className="size-4 text-gray-600 dark:text-gray-400" />
                  </div>
                  <span className="text-gray-600 dark:text-gray-400">{placeholder}</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-1">
              {selectedTeam && !disabled && (
                <span
                  role="button"
                  tabIndex={0}
                  onClick={handleClear}
                  onKeyDown={(e) => e.key === "Enter" && handleClear(e)}
                  className="size-7 rounded-lg hover:bg-red-500/20 flex items-center justify-center transition-colors group cursor-pointer"
                >
                  <X className="size-4 text-gray-600 dark:text-gray-400 group-hover:text-red-500" />
                </span>
              )}
              <ChevronDown className={`size-4 text-gray-600 dark:text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] p-0 bg-white dark:bg-[#12141c] border-gray-200 dark:border-white/10"
          align="start"
        >
          <div className="p-3 border-b border-gray-200 dark:border-white/10">
            <div className="relative">
              <Search className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 size-4 text-gray-600 dark:text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full h-10 pl-10 pr-4 rtl:pl-4 rtl:pr-10 rounded-lg bg-gray-100 dark:bg-[#1a1d2e] dark:bg-[#1a1d2e] border-0 text-sm text-gray-900 dark:text-white placeholder:text-gray-600 dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-primary/50"
                autoFocus
              />
            </div>
          </div>
          <div className="max-h-64 overflow-y-auto p-2">
            {filteredTeams?.length === 0 ? (
              <div className="py-6 text-center text-sm text-gray-600 dark:text-gray-400">
                {t("noTeamsFound") || "No teams found"}
              </div>
            ) : (
              filteredTeams?.map((team) => {
                const teamId = getTeamId(team);
                const isSelected = value === teamId;
                return (
                  <button
                    key={teamId}
                    type="button"
                    onClick={() => handleSelect(team)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left rtl:text-right transition-colors ${
                      isSelected ? "bg-blue-500/10 text-blue-500" : "hover:bg-gray-200 dark:hover:bg-[#1a1d2e]"
                    }`}
                  >
                    <div className="size-8 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-[#252a3d]">
                      {team.logo?.light ? (
                        <img src={getImgUrl(team.logo.light, "thumbnail")} alt={team.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Users className="size-4 text-gray-600 dark:text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className={`text-sm font-medium ${isSelected ? "text-blue-500" : "text-gray-900 dark:text-white"}`}>
                        {team.name}
                      </span>
                      {team.shortName && (
                        <span className="text-xs text-gray-600 dark:text-gray-400 ml-2">({team.shortName})</span>
                      )}
                    </div>
                    {isSelected && <Check className="size-4 text-blue-500 flex-shrink-0" />}
                  </button>
                );
              })
            )}
          </div>
        </PopoverContent>
      </Popover>
      {error && <p className="text-xs text-red-500">{t(error) || error}</p>}
    </div>
  );
}

// Status Select Field
function StatusSelectField({ label, name, formik, placeholder, required }) {
  const [isOpen, setIsOpen] = useState(false);
  const error = formik.touched[name] && formik.errors[name];
  const value = formik.values[name];
  const t = useTranslations("MatchForm");

  const selectedStatus = STATUS_OPTIONS.find((s) => s.value === value);

  const handleSelect = async (status) => {
    await formik.setFieldValue(name, status.value);
    await formik.setFieldTouched(name, true, true);
    formik.validateField(name);
    setIsOpen(false);
  };

  const getStatusColor = (color, isSelected) => {
    const colors = {
      blue: isSelected ? "bg-blue-500/10 text-blue-500" : "hover:bg-blue-500/10",
      red: isSelected ? "bg-red-500/10 text-red-500" : "hover:bg-red-500/10",
      green: isSelected ? "bg-green-500/10 text-green-500" : "hover:bg-green-500/10",
      amber: isSelected ? "bg-amber-500/10 text-amber-500" : "hover:bg-amber-500/10",
      gray: isSelected ? "bg-gray-500/10 text-gray-500" : "hover:bg-gray-500/10",
    };
    return colors[color] || colors.gray;
  };

  const getIconColor = (color) => {
    const colors = {
      blue: "text-blue-500",
      red: "text-red-500",
      green: "text-green-500",
      amber: "text-amber-500",
      gray: "text-gray-500",
    };
    return colors[color] || colors.gray;
  };

  return (
    <div className="flex-1 space-y-2">
      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <div
            role="button"
            tabIndex={0}
            className={`w-full h-12 px-4 rounded-xl bg-gray-100 dark:bg-[#1a1d2e] dark:bg-[#1a1d2e] border border-transparent text-sm text-left rtl:text-right focus:outline-none focus:ring-2 focus:ring-green-primary/50 cursor-pointer transition-all hover:bg-gray-200 dark:hover:bg-[#252a3d] flex items-center justify-between gap-2 ${
              error ? "ring-2 ring-red-500 border-red-500" : ""
            }`}
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {selectedStatus ? (
                <>
                  <div className={`size-8 rounded-lg flex items-center justify-center ${getStatusColor(selectedStatus.color, false).split(" ")[0]}`}>
                    <selectedStatus.icon className={`size-4 ${getIconColor(selectedStatus.color)}`} />
                  </div>
                  <span className="text-gray-900 dark:text-white font-medium">{t(selectedStatus.value) || selectedStatus.label}</span>
                </>
              ) : (
                <>
                  <div className="size-8 rounded-lg bg-gray-100 dark:bg-[#252a3d] flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="size-4 text-gray-600 dark:text-gray-400" />
                  </div>
                  <span className="text-gray-600 dark:text-gray-400">{placeholder}</span>
                </>
              )}
            </div>
            <ChevronDown className={`size-4 text-gray-600 dark:text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
          </div>
        </PopoverTrigger>
        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] p-2 bg-white dark:bg-[#12141c] border-gray-200 dark:border-white/10"
          align="start"
        >
          {STATUS_OPTIONS.map((status) => {
            const isSelected = value === status.value;
            return (
              <button
                key={status.value}
                type="button"
                onClick={() => handleSelect(status)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left rtl:text-right transition-colors ${
                  getStatusColor(status.color, isSelected)
                }`}
              >
                <div className={`size-8 rounded-lg flex items-center justify-center ${getStatusColor(status.color, false).split(" ")[0]}`}>
                  <status.icon className={`size-4 ${getIconColor(status.color)}`} />
                </div>
                <span className={`flex-1 text-sm font-medium ${isSelected ? getIconColor(status.color) : "text-gray-900 dark:text-white"}`}>
                  {t(status.value) || status.label}
                </span>
                {isSelected && <Check className={`size-4 ${getIconColor(status.color)} flex-shrink-0`} />}
              </button>
            );
          })}
        </PopoverContent>
      </Popover>
      {error && <p className="text-xs text-red-500">{t(error) || error}</p>}
    </div>
  );
}

// Best Of Select Field
function BestOfSelectField({ label, name, formik, placeholder }) {
  const [isOpen, setIsOpen] = useState(false);
  const error = formik.touched[name] && formik.errors[name];
  const value = formik.values[name];
  const t = useTranslations("MatchForm");

  const selectedFormat = BEST_OF_OPTIONS.find((f) => f.value === value);

  const handleSelect = async (format) => {
    await formik.setFieldValue(name, format.value);
    await formik.setFieldTouched(name, true, true);
    formik.validateField(name);
    setIsOpen(false);
  };

  return (
    <div className="flex-1 space-y-2">
      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</label>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <div
            role="button"
            tabIndex={0}
            className={`w-full h-12 px-4 rounded-xl bg-gray-100 dark:bg-[#1a1d2e] dark:bg-[#1a1d2e] border border-transparent text-sm text-left rtl:text-right focus:outline-none focus:ring-2 focus:ring-green-primary/50 cursor-pointer transition-all hover:bg-gray-200 dark:hover:bg-[#252a3d] flex items-center justify-between gap-2 ${
              error ? "ring-2 ring-red-500 border-red-500" : ""
            }`}
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="size-8 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                <Target className="size-4 text-purple-500" />
              </div>
              {selectedFormat ? (
                <span className="text-gray-900 dark:text-white font-medium">{t(selectedFormat.label) || selectedFormat.label}</span>
              ) : (
                <span className="text-gray-600 dark:text-gray-400">{placeholder}</span>
              )}
            </div>
            <ChevronDown className={`size-4 text-gray-600 dark:text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
          </div>
        </PopoverTrigger>
        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] p-2 bg-white dark:bg-[#12141c] border-gray-200 dark:border-white/10"
          align="start"
        >
          {BEST_OF_OPTIONS.map((format) => {
            const isSelected = value === format.value;
            return (
              <button
                key={format.value}
                type="button"
                onClick={() => handleSelect(format)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left rtl:text-right transition-colors ${
                  isSelected ? "bg-purple-500/10 text-purple-500" : "hover:bg-gray-200 dark:hover:bg-[#1a1d2e]"
                }`}
              >
                <div className="size-8 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-purple-500">Bo{format.value}</span>
                </div>
                <span className={`flex-1 text-sm font-medium ${isSelected ? "text-purple-500" : "text-gray-900 dark:text-white"}`}>
                  {t(format.label) || format.label}
                </span>
                {isSelected && <Check className="size-4 text-purple-500 flex-shrink-0" />}
              </button>
            );
          })}
        </PopoverContent>
      </Popover>
      {error && <p className="text-xs text-red-500">{t(error) || error}</p>}
    </div>
  );
}

// Date Picker Field
function DatePickerField({ label, name, formik, placeholder, required }) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(new Date());
  const error = formik.touched[name] && formik.errors[name];
  const value = formik.values[name];
  const t = useTranslations("MatchForm");

  const selectedDate = value ? new Date(value) : undefined;

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - 2 + i);

  const formatDisplayDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format date to YYYY-MM-DD using local timezone
  const formatLocalDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleSelect = async (date) => {
    if (date) {
      const formattedDate = formatLocalDate(date);
      await formik.setFieldValue(name, formattedDate);
      await formik.setFieldTouched(name, true, true);
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
      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <div
            role="button"
            tabIndex={0}
            className={`w-full h-12 px-4 rounded-xl bg-gray-100 dark:bg-[#1a1d2e] dark:bg-[#1a1d2e] border border-transparent text-sm text-left rtl:text-right focus:outline-none focus:ring-2 focus:ring-green-primary/50 cursor-pointer transition-all hover:bg-gray-200 dark:hover:bg-[#252a3d] flex items-center justify-between gap-2 ${
              error ? "ring-2 ring-red-500 border-red-500" : ""
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="size-8 rounded-lg bg-green-primary/10 flex items-center justify-center">
                <Calendar className="size-5 text-green-primary" />
              </div>
              {value ? (
                <span className="text-gray-900 dark:text-white font-medium">{formatDisplayDate(value)}</span>
              ) : (
                <span className="text-gray-600 dark:text-gray-400">{placeholder}</span>
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
                <X className="size-4 text-gray-600 dark:text-gray-400 group-hover:text-red-500" />
              </span>
            )}
          </div>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0 bg-white dark:bg-[#12141c] border-gray-200 dark:border-white/10"
          align="start"
        >
          <div className="p-3 border-b border-gray-200 dark:border-white/10">
            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={goToPreviousMonth}
                className="size-8 rounded-lg bg-gray-100 dark:bg-[#1a1d2e] hover:bg-gray-200 dark:hover:bg-[#252a3d] flex items-center justify-center transition-colors"
              >
                <ChevronLeft className="size-4 text-gray-900 dark:text-white rtl:rotate-180" />
              </button>

              <div className="flex items-center gap-2">
                <select
                  value={viewDate.getMonth()}
                  onChange={(e) => handleMonthChange(parseInt(e.target.value))}
                  className="h-8 px-2 rounded-lg bg-gray-100 dark:bg-[#1a1d2e] border-0 text-sm text-gray-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-green-primary/50 cursor-pointer"
                >
                  {months.map((month, index) => (
                    <option key={month} value={index}>
                      {month}
                    </option>
                  ))}
                </select>

                <select
                  value={viewDate.getFullYear()}
                  onChange={(e) => handleYearChange(parseInt(e.target.value))}
                  className="h-8 px-2 rounded-lg bg-gray-100 dark:bg-[#1a1d2e] border-0 text-sm text-gray-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-green-primary/50 cursor-pointer"
                >
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={goToNextMonth}
                className="size-8 rounded-lg bg-gray-100 dark:bg-[#1a1d2e] hover:bg-gray-200 dark:hover:bg-[#252a3d] flex items-center justify-center transition-colors"
              >
                <ChevronRight className="size-4 text-gray-900 dark:text-white rtl:rotate-180" />
              </button>
            </div>
          </div>

          <CalendarComponent
            mode="single"
            selected={selectedDate}
            onSelect={handleSelect}
            month={viewDate}
            onMonthChange={setViewDate}
            initialFocus
            className="rounded-xl"
            classNames={{
              nav: "hidden",
              caption: "hidden",
            }}
          />
        </PopoverContent>
      </Popover>
      {error && <p className="text-xs text-red-500">{t(error) || error}</p>}
    </div>
  );
}

export default MatchFormRedesign;
