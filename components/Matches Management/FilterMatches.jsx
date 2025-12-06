"use client";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import SelectSizeRows from "../ui app/SelectSizeRows";
import { Button } from "../ui/button";
import { useTranslations } from "next-intl";

function FilterMatches() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("MatchesTable");

  const currentStatus = searchParams.get("status") || "";

  const statusOptions = [
    { value: "", label: t("All") },
    { value: "scheduled", label: t("Scheduled") },
    { value: "live", label: t("Live") },
    { value: "completed", label: t("Completed") },
    { value: "postponed", label: t("Postponed") },
    { value: "cancelled", label: t("Cancelled") },
  ];

  const handleStatusChange = (status) => {
    const params = new URLSearchParams(searchParams);
    if (status) {
      params.set("status", status);
    } else {
      params.delete("status");
    }
    params.delete("page"); // Reset to first page when filtering
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap items-center gap-4">
      {/* Status Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        {statusOptions.map((option) => (
          <Button
            key={option.value}
            variant={currentStatus === option.value ? "default" : "outline"}
            size="sm"
            onClick={() => handleStatusChange(option.value)}
            className={
              currentStatus === option.value
                ? "bg-green-primary text-white hover:bg-green-primary/80"
                : "hover:bg-green-primary/10"
            }
          >
            {option.label}
          </Button>
        ))}
      </div>

      {/* Rows per page selector */}
      <div className="ml-auto">
        <SelectSizeRows />
      </div>
    </div>
  );
}

export default FilterMatches;
