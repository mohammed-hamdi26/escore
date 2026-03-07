"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { format, addDays, addMinutes, parse } from "date-fns";
import { CalendarClock, Loader2 } from "lucide-react";
import { applyScheduleTemplateAction } from "@/app/[locale]/_Lib/actions";
import { showSuccess, showError } from "@/lib/bracket-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export default function ScheduleTemplateDialog({
  tournamentId,
  bracket,
  slotCount,
  open,
  onOpenChange,
  onApplied,
}) {
  const t = useTranslations("TournamentDetails");

  const [startDate, setStartDate] = useState(null);
  const [matchesPerDay, setMatchesPerDay] = useState(4);
  const [startTime, setStartTime] = useState("18:00");
  const [intervalMinutes, setIntervalMinutes] = useState(120);
  const [roundOrder, setRoundOrder] = useState("sequential");
  const [applying, setApplying] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);

  // Groups for round robin
  const groups = useMemo(() => {
    if (!bracket?.groups) return [];
    return bracket.groups.map((g) => g.name).filter(Boolean);
  }, [bracket]);

  // Calculate preview
  const preview = useMemo(() => {
    if (!startDate || !matchesPerDay || !startTime || !intervalMinutes) return null;

    const total = slotCount || 0;
    if (total === 0) return null;

    const days = [];
    let remaining = total;
    let dayIndex = 0;

    while (remaining > 0) {
      const matchesToday = Math.min(remaining, matchesPerDay);
      const dayDate = addDays(startDate, dayIndex);
      const [hh, mm] = startTime.split(":").map(Number);
      const firstMatch = new Date(dayDate);
      firstMatch.setHours(hh, mm, 0, 0);
      const lastMatch = addMinutes(firstMatch, intervalMinutes * (matchesToday - 1));

      days.push({
        date: dayDate,
        matchCount: matchesToday,
        firstTime: format(firstMatch, "HH:mm"),
        lastTime: format(lastMatch, "HH:mm"),
      });

      remaining -= matchesToday;
      dayIndex++;
    }

    return { days, totalDays: days.length };
  }, [startDate, matchesPerDay, startTime, intervalMinutes, slotCount]);

  const handleApply = async () => {
    if (!startDate || !startTime) return;

    const template = {
      startDate: format(startDate, "yyyy-MM-dd"),
      matchesPerDay,
      startTime,
      intervalMinutes,
      roundOrder,
    };

    if (groups.length > 0) {
      template.groupOrder = groups;
    }

    setApplying(true);
    const res = await applyScheduleTemplateAction(tournamentId, template);
    setApplying(false);

    if (res.success) {
      const count = res.data?.updatedCount || 0;
      showSuccess(
        (t("scheduleApplied") || "Schedule applied to {count} matches").replace("{count}", count)
      );
      onOpenChange(false);
      onApplied?.();
    } else {
      showError(res.error);
    }
  };

  const isValid = startDate && matchesPerDay > 0 && startTime && intervalMinutes >= 15;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarClock className="size-5 text-green-primary" />
            {t("autoSchedule") || "Auto Schedule"}
          </DialogTitle>
          <DialogDescription>
            {t("autoScheduleDesc") || "Automatically distribute match dates across days"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Start Date */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium">{t("startDate") || "Start Date"}</label>
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <button className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md border border-input bg-background hover:bg-muted/50 text-left">
                  {startDate ? format(startDate, "EEEE, MMM d, yyyy") : (t("selectDate") || "Select date...")}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={(d) => { setStartDate(d); setCalendarOpen(false); }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Matches per day + Start time (side by side) */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">{t("matchesPerDay") || "Matches/Day"}</label>
              <input
                type="number"
                min={1}
                max={50}
                value={matchesPerDay}
                onChange={(e) => setMatchesPerDay(Math.max(1, Math.min(50, Number(e.target.value))))}
                className="w-full px-3 py-2 text-sm rounded-md border border-input bg-background"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">{t("startTime") || "Start Time"}</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-md border border-input bg-background"
              />
            </div>
          </div>

          {/* Interval */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium">{t("intervalMinutes") || "Interval (minutes)"}</label>
            <input
              type="number"
              min={15}
              max={1440}
              value={intervalMinutes}
              onChange={(e) => setIntervalMinutes(Math.max(15, Math.min(1440, Number(e.target.value))))}
              className="w-full px-3 py-2 text-sm rounded-md border border-input bg-background"
            />
          </div>

          {/* Round order */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium">{t("roundOrder") || "Round Order"}</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="radio"
                  name="roundOrder"
                  value="sequential"
                  checked={roundOrder === "sequential"}
                  onChange={() => setRoundOrder("sequential")}
                  className="accent-green-500"
                />
                {t("sequential") || "Sequential"}
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="radio"
                  name="roundOrder"
                  value="interleaved"
                  checked={roundOrder === "interleaved"}
                  onChange={() => setRoundOrder("interleaved")}
                  className="accent-green-500"
                />
                {t("interleaved") || "Interleaved"}
              </label>
            </div>
          </div>

          {/* Preview */}
          {preview && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">
                {t("schedulePreview") || "Schedule Preview"} — {preview.totalDays} {t("day") || "day"}(s)
              </h4>
              <div className="space-y-1 max-h-[160px] overflow-y-auto rounded-md bg-muted/20 p-2">
                {preview.days.map((day, i) => (
                  <div key={i} className="flex items-center justify-between text-xs px-2 py-1 rounded hover:bg-muted/30">
                    <span className="font-medium">
                      {t("day") || "Day"} {i + 1} — {format(day.date, "EEE, MMM d")}
                    </span>
                    <span className="text-muted-foreground">
                      {day.matchCount} {t("totalMatches") || "matches"} ({day.firstTime}–{day.lastTime})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <button
            onClick={() => onOpenChange(false)}
            className="px-4 py-2 text-sm rounded-md border border-input hover:bg-muted/50"
          >
            {t("cancel") || "Cancel"}
          </button>
          <button
            onClick={handleApply}
            disabled={!isValid || applying}
            className="px-4 py-2 text-sm font-medium rounded-md bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {applying && <Loader2 className="size-3.5 animate-spin" />}
            {t("applySchedule") || "Apply Schedule"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
