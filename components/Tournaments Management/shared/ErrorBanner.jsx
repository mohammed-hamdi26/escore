"use client";

import { AlertTriangle, X } from "lucide-react";

function ErrorBanner({ error, onDismiss }) {
  if (!error) return null;

  const { message, fieldErrors = {}, suggestions = [] } = error;
  const fieldErrorEntries = Object.entries(fieldErrors);

  return (
    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-sm animate-in fade-in slide-in-from-top-2">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2">
          <AlertTriangle className="size-4 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-red-500">{message}</p>

            {fieldErrorEntries.length > 0 && (
              <ul className="mt-2 space-y-1">
                {fieldErrorEntries.map(([field, msg]) => (
                  <li
                    key={field}
                    className="text-xs text-red-400 flex items-center gap-1.5"
                  >
                    <span className="size-1 rounded-full bg-red-400 flex-shrink-0" />
                    {msg}
                  </li>
                ))}
              </ul>
            )}

            {suggestions.length > 0 && (
              <div className="mt-3 p-2 rounded-lg bg-red-500/5 border border-red-500/10">
                <p className="text-xs font-medium text-red-400 mb-1">
                  Suggestions:
                </p>
                <ul className="space-y-0.5">
                  {suggestions.map((suggestion, i) => (
                    <li key={i} className="text-xs text-red-400/80">
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="p-1 rounded hover:bg-red-500/10 text-red-500 transition-colors flex-shrink-0"
          >
            <X className="size-4" />
          </button>
        )}
      </div>
    </div>
  );
}

export default ErrorBanner;
