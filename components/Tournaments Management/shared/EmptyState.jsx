"use client";

function EmptyState({ icon: Icon, title, description, actionLabel, onAction }) {
  return (
    <div className="text-center py-10 px-4">
      {Icon && (
        <div className="flex justify-center mb-3">
          <Icon className="size-12 text-muted-foreground/30" />
        </div>
      )}
      {title && (
        <h4 className="text-sm font-medium text-foreground mb-1">{title}</h4>
      )}
      {description && (
        <p className="text-xs text-muted-foreground max-w-xs mx-auto">{description}</p>
      )}
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-4 px-4 py-2 text-xs rounded-lg bg-green-primary text-white hover:bg-green-primary/90 transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export default EmptyState;
