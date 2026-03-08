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
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { getSlotsAction, updateSlotAction, batchUpdateSlotsAction } from "@/app/[locale]/_Lib/actions";
import { showSuccess, showError } from "@/lib/bracket-toast";
import { Checkbox } from "@/components/ui/checkbox";
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

function formatRoundLabel(slot) {
  if (slot.roundLabel) return slot.roundLabel;
  if (slot.name) return slot.name;
  const stagePrefix =
    slot.stage === "losers" ? "Losers " : slot.stage === "grand_finals" ? "Grand Finals" : "";
  if (stagePrefix === "Grand Finals") return stagePrefix;
  return `${stagePrefix}Round ${slot.round}`;
}

function participantName(p) {
  if (!p) return null;
  return p.name || p.slug || null;
}

function slotStatusDot(slot) {
  if (slot.isBye) return "bg-gray-400";
  if (slot.status === "completed") return "bg-green-500";
  if (slot.status === "in_progress") return "bg-blue-500 animate-pulse";
  if (slot.scheduledDate) return "bg-green-500";
  return "bg-amber-500";
}

// ── Inline Date Picker Cell ──────────────────────────────────────────

function DateTimeCell({ slot, tournamentId, onUpdated }) {
  const t = useTranslations("TournamentDetails");
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
      <span className="text-[11px] text-muted-foreground tabular-nums">
        {date ? format(date, "MMM d, HH:mm") : "—"}
      </span>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className={`flex items-center gap-1.5 text-[11px] px-2.5 py-1.5 rounded-md border transition-colors tabular-nums ${
            date
              ? "border-green-500/30 bg-green-500/5 text-green-600 dark:text-green-400 hover:bg-green-500/10"
              : "border-dashed border-gray-300 dark:border-gray-600 text-muted-foreground hover:border-green-primary/50 hover:bg-muted/30"
          }`}
          disabled={saving}
        >
          {saving ? (
            <Loader2 className="size-3 animate-spin" />
          ) : (
            <CalendarIcon className="size-3 shrink-0" />
          )}
          <span>{date ? format(date, "MMM d, HH:mm") : (t("selectDate") || "Select date...")}</span>
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
    <div className="p-3 rounded-xl bg-muted/10 dark:bg-[#1a1d2e]/50 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <CheckCircle className={`size-4 ${pct === 100 ? "text-green-500" : "text-muted-foreground"}`} />
          <span className="text-sm font-medium text-foreground">
            {scheduled}/{total} {t("matchesScheduled") || "scheduled"}
          </span>
        </div>
        <span className={`text-sm font-bold ${pct === 100 ? "text-green-500" : "text-muted-foreground"}`}>
          {pct}%
        </span>
      </div>
      <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${pct === 100 ? "bg-green-500" : "bg-green-primary"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {completed > 0 && (
        <p className="text-[11px] text-muted-foreground mt-1.5">
          {completed} {t("completed") || "completed"}
        </p>
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
    <div className="flex flex-wrap items-center gap-3 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
      <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
        {selectedCount} {t("selected") || "selected"}
      </span>
      <div className="h-4 w-px bg-blue-500/20 hidden sm:block" />
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

// ── Match Row ────────────────────────────────────────────────────────

function MatchRow({ slot, tournamentId, isSelected, onToggleSelect, onUpdated, t }) {
  const isEditable = slot.status !== "completed";
  const p1 = participantName(slot.participant1);
  const p2 = participantName(slot.participant2);
  const p1Won = slot.winnerId && slot.participant1 && String(slot.winnerId) === String(slot.participant1.id);
  const p2Won = slot.winnerId && slot.participant2 && String(slot.winnerId) === String(slot.participant2.id);

  return (
    <div
      className={`flex items-center gap-2 sm:gap-3 px-3 py-2 rounded-lg transition-colors group ${
        isSelected
          ? "bg-blue-500/10 border border-blue-500/20"
          : "hover:bg-muted/20 border border-transparent"
      }`}
    >
      {/* Checkbox */}
      <div className="w-5 shrink-0 flex items-center justify-center">
        {isEditable ? (
          <Checkbox
            checked={isSelected}
            onCheckedChange={onToggleSelect}
            className="shrink-0"
          />
        ) : (
          <CheckCircle className="size-3.5 text-green-500" />
        )}
      </div>

      {/* Match number */}
      <span className="text-[10px] text-muted-foreground font-mono w-5 shrink-0 text-center">
        M{(slot.position || 0) + 1}
      </span>

      {/* Status dot */}
      <div className="shrink-0">
        <div className={`size-2 rounded-full ${slotStatusDot(slot)}`} title={slot.status} />
      </div>

      {/* Participants — compact */}
      <div className="flex-1 min-w-0 flex items-center gap-1 text-xs">
        <span className={`truncate ${p1Won ? "font-bold text-green-600 dark:text-green-400" : p1 ? "text-foreground" : "text-muted-foreground"}`}>
          {p1 || (t("tbd") || "TBD")}
        </span>
        {slot.score && (
          <span className="text-muted-foreground shrink-0 font-mono text-[10px]">
            {slot.score.p1}
          </span>
        )}
        <span className="text-muted-foreground/50 shrink-0 text-[10px] mx-0.5">vs</span>
        {slot.score && (
          <span className="text-muted-foreground shrink-0 font-mono text-[10px]">
            {slot.score.p2}
          </span>
        )}
        <span className={`truncate ${p2Won ? "font-bold text-green-600 dark:text-green-400" : p2 ? "text-foreground" : "text-muted-foreground"}`}>
          {p2 || (t("tbd") || "TBD")}
        </span>
      </div>

      {/* Date/time cell */}
      <div className="shrink-0">
        <DateTimeCell
          slot={slot}
          tournamentId={tournamentId}
          onUpdated={onUpdated}
        />
      </div>
    </div>
  );
}

// ── Round Group ──────────────────────────────────────────────────────

function RoundGroup({ roundKey, label, slots, tournamentId, selected, onToggleSelect, onSelectRound, onUpdated, t }) {
  const [collapsed, setCollapsed] = useState(false);
  const total = slots.length;
  const scheduled = slots.filter((s) => s.scheduledDate).length;
  const completed = slots.filter((s) => s.status === "completed").length;
  const allScheduled = scheduled === total;
  const allCompleted = completed === total;

  const roundSelected = slots.filter((s) => s.status !== "completed").every((s) => selected.has(s.slotId));
  const someSelected = slots.some((s) => selected.has(s.slotId));

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Round header */}
      <button
        type="button"
        onClick={() => setCollapsed(!collapsed)}
        className="w-full flex items-center gap-2 px-3 py-2.5 bg-muted/20 dark:bg-[#1a1d2e]/50 hover:bg-muted/30 dark:hover:bg-[#1a1d2e]/70 transition-colors"
      >
        {/* Expand/collapse chevron */}
        {collapsed ? (
          <ChevronRight className="size-3.5 text-muted-foreground shrink-0" />
        ) : (
          <ChevronDown className="size-3.5 text-muted-foreground shrink-0" />
        )}

        {/* Round checkbox */}
        <div
          className="shrink-0"
          onClick={(e) => {
            e.stopPropagation();
            onSelectRound(slots, !roundSelected);
          }}
        >
          <Checkbox
            checked={roundSelected && slots.some((s) => s.status !== "completed")}
            onCheckedChange={() => onSelectRound(slots, !roundSelected)}
            className="shrink-0"
          />
        </div>

        {/* Round title */}
        <span className="text-xs font-semibold text-foreground flex-1 text-left truncate">
          {label}
        </span>

        {/* Counters */}
        <div className="flex items-center gap-2 shrink-0">
          {allCompleted ? (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/15 text-green-600 dark:text-green-400 font-medium">
              {t("completed") || "Completed"}
            </span>
          ) : allScheduled ? (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/15 text-green-600 dark:text-green-400 font-medium">
              {scheduled}/{total}
            </span>
          ) : (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 font-medium">
              {scheduled}/{total}
            </span>
          )}
          <span className="text-[10px] text-muted-foreground">
            {total} {total === 1 ? "match" : "matches"}
          </span>
        </div>
      </button>

      {/* Match rows */}
      {!collapsed && (
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {slots.map((slot) => (
            <MatchRow
              key={slot.slotId}
              slot={slot}
              tournamentId={tournamentId}
              isSelected={selected.has(slot.slotId)}
              onToggleSelect={() => onToggleSelect(slot.slotId)}
              onUpdated={onUpdated}
              t={t}
            />
          ))}
        </div>
      )}
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

    return result;
  }, [slots, filterRound, filterGroup, sortBy]);

  // Group slots by round for visual grouping
  const groupedSlots = useMemo(() => {
    const map = new Map();
    for (const slot of filteredSlots) {
      const key = `${slot.stage || "main"}_${slot.round}_${slot.roundLabel || ""}`;
      if (!map.has(key)) {
        map.set(key, { label: formatRoundLabel(slot), slots: [] });
      }
      map.get(key).slots.push(slot);
    }
    return [...map.entries()];
  }, [filteredSlots]);

  // Selection
  const toggleSelect = (slotId) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(slotId)) next.delete(slotId);
      else next.add(slotId);
      return next;
    });
  };

  const selectRound = (roundSlots, shouldSelect) => {
    setSelected((prev) => {
      const next = new Set(prev);
      for (const s of roundSlots) {
        if (s.status === "completed") continue;
        if (shouldSelect) next.add(s.slotId);
        else next.delete(s.slotId);
      }
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
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-12 rounded-xl bg-muted/30 animate-pulse" />
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
            className="text-xs px-2.5 py-1.5 rounded-lg border border-input bg-background"
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
            className="text-xs px-2.5 py-1.5 rounded-lg border border-input bg-background"
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
          className="text-xs px-2.5 py-1.5 rounded-lg border border-input bg-background"
        >
          <option value="bracket">{t("bracketOrder") || "Bracket Order"}</option>
          <option value="date">{t("byDate") || "By Date"}</option>
          <option value="status">{t("byStatus") || "By Status"}</option>
        </select>

        <div className="flex-1" />

        {/* Select all / Deselect */}
        <button
          onClick={selected.size > 0 ? deselectAll : selectAll}
          className="text-xs px-2.5 py-1.5 rounded-lg border border-input hover:bg-muted/50 text-muted-foreground transition-colors"
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

      {/* Slot list — grouped by round */}
      {sortBy === "bracket" ? (
        <div className="space-y-3">
          {groupedSlots.map(([key, group]) => (
            <RoundGroup
              key={key}
              roundKey={key}
              label={group.label}
              slots={group.slots}
              tournamentId={tournamentId}
              selected={selected}
              onToggleSelect={toggleSelect}
              onSelectRound={selectRound}
              onUpdated={fetchSlots}
              t={t}
            />
          ))}
        </div>
      ) : (
        /* Flat list for date/status sort */
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-800 overflow-hidden">
          {filteredSlots.map((slot) => (
            <div key={slot.slotId} className="flex items-center gap-2 sm:gap-3 px-3 py-2 hover:bg-muted/10 transition-colors">
              {/* Checkbox */}
              <div className="w-5 shrink-0 flex items-center justify-center">
                {slot.status !== "completed" ? (
                  <Checkbox
                    checked={selected.has(slot.slotId)}
                    onCheckedChange={() => toggleSelect(slot.slotId)}
                  />
                ) : (
                  <CheckCircle className="size-3.5 text-green-500" />
                )}
              </div>

              {/* Status dot */}
              <div className={`size-2 rounded-full shrink-0 ${slotStatusDot(slot)}`} />

              {/* Round label */}
              <span className="text-[10px] text-muted-foreground font-medium shrink-0 min-w-[60px]">
                {formatSlotLabel(slot)}
              </span>

              {/* Participants */}
              <div className="flex-1 min-w-0 flex items-center gap-1 text-xs">
                <span className={`truncate ${slot.winnerId && slot.participant1 && String(slot.winnerId) === String(slot.participant1.id) ? "font-bold text-green-600 dark:text-green-400" : participantName(slot.participant1) ? "text-foreground" : "text-muted-foreground"}`}>
                  {participantName(slot.participant1) || (t("tbd") || "TBD")}
                </span>
                <span className="text-muted-foreground/50 shrink-0 text-[10px] mx-0.5">vs</span>
                <span className={`truncate ${slot.winnerId && slot.participant2 && String(slot.winnerId) === String(slot.participant2.id) ? "font-bold text-green-600 dark:text-green-400" : participantName(slot.participant2) ? "text-foreground" : "text-muted-foreground"}`}>
                  {participantName(slot.participant2) || (t("tbd") || "TBD")}
                </span>
              </div>

              {/* Date */}
              <div className="shrink-0">
                <DateTimeCell slot={slot} tournamentId={tournamentId} onUpdated={fetchSlots} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
