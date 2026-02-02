"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { useState, useMemo } from "react";

export default function Pagination({ numPages }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);

  const goToPage = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage);
    setPage(newPage);
    router.replace(`${pathname}?${params.toString()}`);
  };

  // Generate page numbers to show
  const pageNumbers = useMemo(() => {
    const pages = [];
    const showPages = 5;
    let start = Math.max(1, page - Math.floor(showPages / 2));
    let end = Math.min(numPages, start + showPages - 1);

    if (end - start + 1 < showPages) {
      start = Math.max(1, end - showPages + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }, [page, numPages]);

  if (numPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-1 mt-6">
      {/* Previous Button */}
      <Button
        variant="ghost"
        size="icon"
        disabled={page <= 1}
        onClick={() => goToPage(page - 1)}
        className="size-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <ChevronLeft className="size-4 rtl:rotate-180" />
      </Button>

      {/* First page + ellipsis */}
      {pageNumbers[0] > 1 && (
        <>
          <Button
            variant="ghost"
            onClick={() => goToPage(1)}
            className="size-9 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
          >
            1
          </Button>
          {pageNumbers[0] > 2 && (
            <span className="px-2 text-muted-foreground">...</span>
          )}
        </>
      )}

      {/* Page Numbers */}
      {pageNumbers.map((p) => (
        <Button
          key={p}
          variant="ghost"
          onClick={() => goToPage(p)}
          className={`size-9 rounded-lg text-sm font-medium transition-all ${
            p === page
              ? "bg-green-primary text-white hover:bg-green-primary glow-green-subtle"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          }`}
        >
          {p}
        </Button>
      ))}

      {/* Last page + ellipsis */}
      {pageNumbers[pageNumbers.length - 1] < numPages && (
        <>
          {pageNumbers[pageNumbers.length - 1] < numPages - 1 && (
            <span className="px-2 text-muted-foreground">...</span>
          )}
          <Button
            variant="ghost"
            onClick={() => goToPage(numPages)}
            className="size-9 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
          >
            {numPages}
          </Button>
        </>
      )}

      {/* Next Button */}
      <Button
        variant="ghost"
        size="icon"
        disabled={page >= numPages}
        onClick={() => goToPage(page + 1)}
        className="size-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <ChevronRight className="size-4 rtl:rotate-180" />
      </Button>
    </div>
  );
}
