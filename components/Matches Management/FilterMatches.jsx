import { usePathname, useRouter } from "@/i18n/navigation";
import FilterItem from "./FilterItem";
import DatePicker from "../ui app/DatePicker";
import FilterDatePicker from "../ui app/FilterDatePicker";
import { format } from "date-fns";
import { useSearchParams } from "next/navigation";

function FilterMatches() {
  const searchParams = new useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="flex gap-4">
      <FilterItem
        onClick={() => {
          const params = new URLSearchParams(searchParams);
          params.set("filter", "team");
          router.replace(`${pathname}?${params.toString()}`);
        }}
      >
        Filter by Team
      </FilterItem>
      <FilterItem
        onClick={() => {
          const params = new URLSearchParams(searchParams);
          params.set("filter", "country");
          router.replace(`${pathname}?${params.toString()}`);
        }}
      >
        Filter by Country
      </FilterItem>
      <FilterDatePicker
        onRemoveDate={() => {
          const params = new URLSearchParams(searchParams);
          params.delete("date");
          router.replace(`${pathname}?${params.toString()}`);
        }}
        onSelectDate={(date) => {
          const params = new URLSearchParams(searchParams);

          params.set("date", format(date, "yyyy-MM-dd"));
          router.replace(`${pathname}?${params.toString()}`);
        }}
      />
    </div>
  );
}

export default FilterMatches;
