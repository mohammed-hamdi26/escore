"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ChevronDown, GripVertical, Trophy } from "lucide-react";
import { getImgUrl } from "@/lib/utils";

function DraggableSeedItem({
  team,
  index,
  totalCount,
  onMoveUp,
  onMoveDown,
  isPlayerBased,
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: team.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 50 : "auto",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      role="listitem"
      className={`flex items-center gap-3 p-3 rounded-xl bg-muted/30 dark:bg-[#1a1d2e] border transition-colors ${
        isDragging
          ? "border-green-primary shadow-lg shadow-green-primary/10"
          : "border-transparent hover:border-green-primary/20"
      }`}
    >
      <span className="text-xs font-bold text-green-primary w-6 text-center">
        #{index + 1}
      </span>
      <button
        type="button"
        className="cursor-grab active:cursor-grabbing p-0.5 rounded hover:bg-muted/50 transition-colors touch-none"
        aria-label={`Drag to reorder ${team.name}`}
        {...attributes}
        {...listeners}
      >
        <GripVertical className="size-4 text-muted-foreground" />
      </button>
      {team.logo?.light ? (
        <img
          src={getImgUrl(team.logo.light, "thumbnail")}
          alt={team.name}
          className="size-6 rounded object-cover"
        />
      ) : (
        <div className="size-6 rounded bg-muted flex items-center justify-center">
          <Trophy className="size-3 text-muted-foreground" />
        </div>
      )}
      <span className="text-sm font-medium text-foreground flex-1 truncate">
        {team.name}
      </span>
      <div className="flex gap-1">
        <button
          type="button"
          onClick={onMoveUp}
          disabled={index === 0}
          className="p-1.5 sm:p-1 min-w-[36px] min-h-[36px] sm:min-w-0 sm:min-h-0 rounded hover:bg-muted disabled:opacity-30 transition-colors flex items-center justify-center"
          aria-label={`Move ${team.name} up to seed ${index}`}
        >
          <ChevronDown className="size-4 text-muted-foreground rotate-180" />
        </button>
        <button
          type="button"
          onClick={onMoveDown}
          disabled={index === totalCount - 1}
          className="p-1.5 sm:p-1 min-w-[36px] min-h-[36px] sm:min-w-0 sm:min-h-0 rounded hover:bg-muted disabled:opacity-30 transition-colors flex items-center justify-center"
          aria-label={`Move ${team.name} down to seed ${index + 2}`}
        >
          <ChevronDown className="size-4 text-muted-foreground" />
        </button>
      </div>
    </div>
  );
}

export default DraggableSeedItem;
