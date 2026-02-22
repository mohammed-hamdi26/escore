"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { GripVertical, Trophy } from "lucide-react";
import { getImgUrl } from "@/lib/utils";
import InlineError from "./shared/InlineError";
import DraggableSeedItem from "./shared/DraggableSeedItem";

function SeedOrderManager({ seeds, onSeedsChange, participationType, minSeeds = 2 }) {
  const t = useTranslations("TournamentDetails");
  const isPlayerBased = participationType === "player";
  const seedCount = seeds.length;
  const isValid = seedCount >= minSeeds;
  const label = isPlayerBased ? (t("playersCount") || "Players") : (t("teamsCount") || "Teams");

  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = useCallback((event) => {
    setActiveId(event.active.id);
  }, []);

  const handleDragEnd = useCallback(
    (event) => {
      const { active, over } = event;
      setActiveId(null);

      if (over && active.id !== over.id) {
        const oldIndex = seeds.findIndex((s) => s.id === active.id);
        const newIndex = seeds.findIndex((s) => s.id === over.id);
        if (oldIndex !== -1 && newIndex !== -1) {
          onSeedsChange(arrayMove(seeds, oldIndex, newIndex));
        }
      }
    },
    [seeds, onSeedsChange]
  );

  const handleDragCancel = useCallback(() => {
    setActiveId(null);
  }, []);

  const moveSeed = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= seeds.length) return;
    onSeedsChange(arrayMove(seeds, index, targetIndex));
  };

  const activeTeam = activeId ? seeds.find((s) => s.id === activeId) : null;

  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-2">
        {t("seedOrder") || "Seed Order"}
      </label>
      <p className="text-xs text-muted-foreground mb-3">
        {t("seedOrderDesc") || "Drag to reorder. Seed #1 is the top seed."}
      </p>
      <div className="flex items-center gap-2 mb-3">
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
            isValid
              ? "bg-green-primary/10 text-green-primary"
              : "bg-red-500/10 text-red-500"
          }`}
        >
          {seedCount} {label}
        </span>
        {!isValid && (
          <span className="text-xs text-muted-foreground">
            ({t("minimumRequired") || "minimum"}: {minSeeds})
          </span>
        )}
      </div>
      <InlineError
        error={
          !isValid
            ? (t("seedCountError") || `At least ${minSeeds} ${label.toLowerCase()} required. Currently: ${seedCount}`)
            : null
        }
      />
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <SortableContext
          items={seeds.map((s) => s.id)}
          strategy={verticalListSortingStrategy}
        >
          <div
            className="space-y-2 max-h-[400px] overflow-y-auto"
            role="list"
            aria-label={t("seedOrder") || "Seed order"}
          >
            {seeds.map((team, index) => (
              <DraggableSeedItem
                key={team.id}
                team={team}
                index={index}
                totalCount={seeds.length}
                onMoveUp={() => moveSeed(index, -1)}
                onMoveDown={() => moveSeed(index, 1)}
                isPlayerBased={isPlayerBased}
              />
            ))}
          </div>
        </SortableContext>
        <DragOverlay dropAnimation={null}>
          {activeTeam ? (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 dark:bg-[#1a1d2e] border border-green-primary shadow-lg shadow-green-primary/20">
              <span className="text-xs font-bold text-green-primary w-6 text-center">
                #{seeds.findIndex((s) => s.id === activeTeam.id) + 1}
              </span>
              <GripVertical className="size-4 text-green-primary" />
              {activeTeam.logo?.light ? (
                <img
                  src={getImgUrl(activeTeam.logo.light, "thumbnail")}
                  alt={activeTeam.name}
                  className="size-6 rounded object-cover"
                />
              ) : (
                <div className="size-6 rounded bg-muted flex items-center justify-center">
                  <Trophy className="size-3 text-muted-foreground" />
                </div>
              )}
              <span className="text-sm font-medium text-foreground flex-1 truncate">
                {activeTeam.name}
              </span>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

export default SeedOrderManager;
