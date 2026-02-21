"use client";

import { Skeleton } from "../ui/skeleton";

function BracketSkeleton() {
  return (
    <div className="glass rounded-2xl p-6 border border-transparent dark:border-white/5">
      {/* Header skeleton */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Skeleton className="size-5 rounded" />
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-5 w-24 rounded-full" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-20 rounded-md" />
          <Skeleton className="h-8 w-20 rounded-md" />
          <Skeleton className="h-8 w-20 rounded-md" />
        </div>
      </div>

      {/* Bracket rounds skeleton */}
      <div className="flex gap-8 overflow-hidden">
        {[1, 2, 3, 4].map((round) => (
          <div key={round} className="flex flex-col min-w-[260px]">
            {/* Round header */}
            <div className="text-center mb-3">
              <Skeleton className="h-6 w-24 mx-auto rounded-full" />
            </div>
            {/* Match cards */}
            <div className="flex flex-col gap-4">
              {Array.from({ length: Math.max(1, 5 - round) }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-gray-200 dark:border-gray-700 p-3"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Skeleton className="size-6 rounded" />
                    <Skeleton className="h-4 w-24 flex-1" />
                    <Skeleton className="h-5 w-6" />
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-700 my-1" />
                  <div className="flex items-center gap-3 mt-2">
                    <Skeleton className="size-6 rounded" />
                    <Skeleton className="h-4 w-20 flex-1" />
                    <Skeleton className="h-5 w-6" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BracketSkeleton;
