"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useTranslations } from "next-intl";
import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  Filter,
  Ban,
} from "lucide-react";
import { getSlotsAction, updateSlotAction, batchUpdateSlotsAction } from "@/app/[locale]/_Lib/actions";
import { showSuccess, showError } from "@/lib/bracket-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

// ── Helpers ──────────────────────────────────────────────────────────

function formatSlotLabel(slot) {
  if (slot.name) return slot.name;
  if (slot.roundLabel) return slot.roundLabel;
  const stagePrefix =
    slot.stage === "losers" ? "L" : slot.stage === "grand_finals" ? "GF" : "";
  return `${stagePrefix}${stagePrefix ? " " : ""}R${slot.round} M${slot.position + 1}`;
}

function participantName(p) {
  if (!p) return null;
  return p.name || p.slug || "—";
}

function slotStatusColor(slot) {
  if (slot.isBye) return "text-muted-foreground";
  if (slot.status === "completed") return "text-green-500";
  if (slot.status === "in_progress") return "text-blue-500";
  if (slot.scheduledDate) return "text-green-500";
  return "text-amber-500";
}

function slotStatusBadge(slot, t) {
  if (slot.isBye) {
    return <Badge variant="secondary" className="text-[10px]">{t("bye") || "BYE"}</Badge>;
  }
  if (slot.status === "completed") {
    return <Badge className="bg-green-500/20 text-green-600 border-green-500/30 text-[10px]">{t("completed") || "Completed"}</Badge>;
  }
  if (slot.status === "in_progress") {
    return <Badge className="bg-blue-500/20 text-blue-600 border-blue-500/30 text-[10px]">{t("live") || "Live"}</Badge>;
  }
  if (slot.scheduledDate) {
    return <Badge className="bg-green-500/20 text-green-600 border-green-500/30 text-[10px]">{t("scheduled") || "Scheduled"}</Badge>;
  }
  return <Badge className="bg-amber-500/20 text-amber-600 border-amber-500/30 text-[10px]">{t("unscheduled") || "Unscheduled"}</Badge>;
}

// ── Inline Date Picker Cell ──────────────────────────────────────────

function DateTimeCell({ slot, tournamentId, onUpdated }) {
  const [saving, setSaving] = useState(false);
  const [date, setDate] = useState(slot.scheduledDate ? new Date(slot.scheduledDate) : null);
  const [time, setTime] = useState(
    slot.scheduledDate ? format(new Date(slot.scheduledDate), "HH:mm") : ""
  );
  const [open, setOpen] = useState(false);
  const isEditable = slot.status !== "completed" && !slot.isBye;

  const handleSave = useCallback(async (newDate, newTime) => {
    if (!newDate) return;
    const t = newTime || "12:00";
    const [hh, mm] = t.split(":").map(Number);
    const dt = new Date(newDate);
    dt.setHours(hh, mm, 0, 0);
    const isoDate = dt.toISOString();

    setSaving(true);
    const res = await updateSlotAction(tournamentId, slot.slotId, {
      scheduledDate: isoDate,
    });
    setSaving(false);

    if (res.success) {
      setDate(dt);
      setTime(t);
      setOpen(false);
      onUpdated?.();
    } else {
      showError(res.error);
    }
  }, [tournamentId, slot.slotId, onUpdated]);

  if (!isEditable) {
    return (
      <span className="text-xs text-muted-foreground">
        {date ? format(date, "MMM d, HH:mm") : "—"}
      </span>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className="flex items-center gap-1.5 text-xs px-2 py-1 rounded-md hover:bg-muted/50 transition-colors min-w-[120px]"
          disabled={saving}
        >
          {saving ? (
            <Loader2 className="size-3 animate-spin" />
          ) : (
            <CalendarIcon className="size-3 text-muted-foreground" />
          )}
          <span className={date ? "text-foreground" : "text-muted-foreground"}>
            {date ? format(date, "MMM d, HH:mm") : "Set date..."}
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-3 space-y-3">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(d) => {
              setDate(d);
              if (d && time) handleSave(d, time);
            }}
            initialFocus
          />
          <div className="flex items-center gap-2 px-1">
            <Clock className="size-3.5 text-muted-foreground" />
            <input
              type="time"
              value={time}
              onChange={(e) => {
                setTime(e.target.value);
                if (date && e.target.value) handleSave(date, e.target.value);
              }}
              className="flex-1 px-2 py-1 text-sm rounded border border-input bg-background"
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

// ── Progress Bar ─────────────────────────────────────────────────────

function ScheduleProgress({ slots, t }) {
  const total = slots.filter((s) => !s.isBye).length;
  const scheduled = slots.filter((s) => !s.isBye && s.scheduledDate).length;
  const completed = slots.filter((s) => s.status === "completed").length;
  const pct = total > 0 ? Math.round((scheduled / total) * 100) : 0;

  return (
    <div className="flex items-center gap-4 text-xs text-muted-foreground">
      <div className="flex items-center gap-1.5">
        <CheckCircle className="size-3.5 text-green-500" />
        <span>{scheduled}/{total} {t("matchesScheduled") || "scheduled"}</span>
      </div>
      <div className="flex-1 h-1.5 bg-muted/30 rounded-full overflow-hidden max-w-[200px]">
        <div
          className="h-full bg-green-500 rounded-full transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span>{pct}%</span>
      {completed > 0 && (
        <div className="flex items-center gap-1.5">
          <span>{completed} {t("completed") || "completed"}</span>
        </div>
      )}
    </div>
  );
}

// ── Batch Date Toolbar ───────────────────────────────────────────────

function BatchToolbar({ selectedCount, onApply, applying, t }) {
  const [date, setDate] = useState(null);
  const [time, setTime] = useState("18:00");
  const [open, setOpen] = useState(false);

  const handleApply = () => {
    if (!date || !time) return;
    const [hh, mm] = time.split(":").map(Number);
    const dt = new Date(date);
    dt.setHours(hh, mm, 0, 0);
    onApply(dt.toISOString());
  };

  return (
    <div className="flex flex-wrap items-center gap-3 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
      <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
        {selectedCount} {t("selected") || "selected"}
      </span>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md bg-background border border-input hover:bg-muted/50">
            <CalendarIcon className="size-3" />
            {date ? format(date, "MMM d, yyyy") : t("selectDate") || "Select date"}
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar mode="single" selected={date} onSelect={(d) => { setDate(d); setOpen(false); }} />
        </PopoverContent>
      </Popover>
      <div className="flex items-center gap-1.5">
        <Clock className="size-3 text-muted-foreground" />
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="px-2 py-1 text-xs rounded border border-input bg-background"
        />
      </div>
      <button
        onClick={handleApply}
        disabled={!date || !time || applying}
        className="px-3 py-1.5 text-xs font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
      >
        {applying && <Loader2 className="size-3 animate-spin" />}
        {t("setDateForSelected") || "Set Date for Selected"}
      </button>
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────

export default function MatchSchedulingPanel({ tournamentId, bracket, onRefresh }) {
  const t = useTranslations("TournamentDetails");
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(new Set());
  const [applying, setApplying] = useState(false);

  // Filters
  const [filterRound, setFilterRound] = useState("all");
  const [filterGroup, setFilterGroup] = useState("all");
  const [sortBy, setSortBy] = useState("bracket"); // bracket | date | status

  // Fetch slots
  const fetchSlots = useCallback(async () => {
    setLoading(true);
    const res = await getSlotsAction(tournamentId);
    if (res.success) {
      setSlots(res.data || []);
    } else {
      showError(res.error);
    }
    setLoading(false);
  }, [tournamentId]);

  useEffect(() => {
    fetchSlots();
  }, [fetchSlots]);

  // Derived filter options
  const rounds = useMemo(() => {
    const set = new Set(slots.map((s) => s.round));
    return [...set].sort((a, b) => a - b);
  }, [slots]);

  const groups = useMemo(() => {
    const set = new Set(slots.filter((s) => s.group).map((s) => s.group));
    return [...set].sort();
  }, [slots]);

  // Filtered and sorted slots
  const filteredSlots = useMemo(() => {
    let result = slots.filter((s) => !s.isBye);

    if (filterRound !== "all") {
      result = result.filter((s) => s.round === Number(filterRound));
    }
    if (filterGroup !== "all") {
      result = result.filter((s) => s.group === filterGroup);
    }

    if (sortBy === "date") {
      result = [...result].sort((a, b) => {
        if (!a.scheduledDate && !b.scheduledDate) return 0;
        if (!a.scheduledDate) return 1;
        if (!b.scheduledDate) return -1;
        return new Date(a.scheduledDate) - new Date(b.scheduledDate);
      });
    } else if (sortBy === "status") {
      const order = { pending: 0, ready: 1, in_progress: 2, completed: 3 };
      result = [...result].sort((a, b) => (order[a.status] || 0) - (order[b.status] || 0));
    }
    // bracket order is default (by round + position)

    return result;
  }, [slots, filterRound, filterGroup, sortBy]);

  // Selection
  const toggleSelect = (slotId) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(slotId)) next.delete(slotId);
      else next.add(slotId);
      return next;
    });
  };

  const selectAll = () => {
    const editable = filteredSlots.filter((s) => s.status !== "completed");
    setSelected(new Set(editable.map((s) => s.slotId)));
  };

  const deselectAll = () => setSelected(new Set());

  // Batch date apply
  const handleBatchApply = async (isoDate) => {
    const updates = [...selected].map((slotId) => ({
      slotId,
      scheduledDate: isoDate,
    }));

    setApplying(true);
    const res = await batchUpdateSlotsAction(tournamentId, updates);
    setApplying(false);

    if (res.success) {
      showSuccess(`${updates.length} ${t("matchesScheduled") || "matches scheduled"}`);
      setSelected(new Set());
      await fetchSlots();
      onRefresh?.();
    } else {
      showError(res.error);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="space-y-3 p-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-10 rounded-md bg-muted/30 animate-pulse" />
        ))}
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-muted-foreground gap-2">
        <AlertCircle className="size-8" />
        <p className="text-sm">{t("noSlotsAvailable") || "No slots available for scheduling"}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Progress */}
      <ScheduleProgress slots={slots} t={t} />

      {/* Filters & Sort */}
      <div className="flex flex-wrap items-center gap-2">
        <Filter className="size-3.5 text-muted-foreground" />

        {/* Round filter */}
        {rounds.length > 1 && (
          <select
            value={filterRound}
            onChange={(e) => setFilterRound(e.target.value)}
            className="text-xs px-2 py-1 rounded border border-input bg-background"
          >
            <option value="all">{t("allRounds") || "All Rounds"}</option>
            {rounds.map((r) => (
              <option key={r} value={r}>
                {t("round") || "Round"} {r}
              </option>
            ))}
          </select>
        )}

        {/* Group filter */}
        {groups.length > 0 && (
          <select
            value={filterGroup}
            onChange={(e) => setFilterGroup(e.target.value)}
            className="text-xs px-2 py-1 rounded border border-input bg-background"
          >
            <option value="all">{t("allGroups") || "All Groups"}</option>
            {groups.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        )}

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="text-xs px-2 py-1 rounded border border-input bg-background"
        >
          <option value="bracket">{t("bracketOrder") || "Bracket Order"}</option>
          <option value="date">{t("byDate") || "By Date"}</option>
          <option value="status">{t("byStatus") || "By Status"}</option>
        </select>

        <div className="flex-1" />

        {/* Select all / Deselect */}
        <button
          onClick={selected.size > 0 ? deselectAll : selectAll}
          className="text-xs px-2 py-1 rounded hover:bg-muted/50 text-muted-foreground"
        >
          {selected.size > 0
            ? (t("deselectAll") || "Deselect All")
            : (t("selectAll") || "Select All")}
        </button>
      </div>

      {/* Batch toolbar */}
      {selected.size > 0 && (
        <BatchToolbar
          selectedCount={selected.size}
          onApply={handleBatchApply}
          applying={applying}
          t={t}
        />
      )}

      {/* Slot list */}
      <div className="space-y-1">
        {filteredSlots.map((slot) => {
          const isEditable = slot.status !== "completed";
          return (
            <div
              key={slot.slotId}
              className={`flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-3 px-3 py-2 rounded-lg transition-colors ${
                selected.has(slot.slotId)
                  ? "bg-blue-500/10 border border-blue-500/20"
                  : "bg-muted/10 hover:bg-muted/20 border border-transparent"
              }`}
            >
              {/* Checkbox */}
              {isEditable && (
                <Checkbox
                  checked={selected.has(slot.slotId)}
                  onCheckedChange={() => toggleSelect(slot.slotId)}
                  className="shrink-0"
                />
              )}
              {!isEditable && <div className="w-4 shrink-0" />}

              {/* Slot label */}
              <div className="min-w-[70px] sm:min-w-[80px] shrink-0">
                <span className="text-xs font-medium text-foreground">
                  {formatSlotLabel(slot)}
                </span>
                {slot.group && (
                  <span className="text-[10px] text-muted-foreground block">
                    {slot.group}
                  </span>
                )}
              </div>

              {/* Participants */}
              <div className="flex-1 min-w-0 order-last sm:order-none w-full sm:w-auto">
                <div className="flex items-center gap-1.5 text-xs truncate">
                  <span className={`truncate ${slot.winnerId && slot.participant1 && String(slot.winnerId) === String(slot.participant1.id) ? "font-bold" : ""}`}>
                    {participantName(slot.participant1) || (t("tbd") || "TBD")}
                  </span>
                  <span className="text-muted-foreground shrink-0">{t("vs") || "vs"}</span>
                  <span className={`truncate ${slot.winnerId && slot.participant2 && String(slot.winnerId) === String(slot.participant2.id) ? "font-bold" : ""}`}>
                    {participantName(slot.participant2) || (t("tbd") || "TBD")}
                  </span>
                  {slot.score && (
                    <span className="text-muted-foreground shrink-0 ml-1">
                      ({slot.score.p1}-{slot.score.p2})
                    </span>
                  )}
                </div>
              </div>

              {/* Status badge */}
              <div className="shrink-0 hidden sm:block">
                {slotStatusBadge(slot, t)}
              </div>

              {/* Date/time cell */}
              <div className="shrink-0">
                <DateTimeCell
                  slot={slot}
                  tournamentId={tournamentId}
                  onUpdated={fetchSlots}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
