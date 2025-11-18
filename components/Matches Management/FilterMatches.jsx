import { usePathname, useRouter } from "@/i18n/navigation";
import FilterItem from "./FilterItem";
import DatePicker from "../ui app/DatePicker";
import FilterDatePicker from "../ui app/FilterDatePicker";
import { format } from "date-fns";
import { useSearchParams } from "next/navigation";
import SelectInput from "../ui app/SelectInput";
import SelectSizeRows from "../ui app/SelectSizeRows";

function FilterMatches({ numOfSize }) {
  const searchParams = new useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-4">
      {/* <FilterDatePicker
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
      /> */}

      <SelectSizeRows numOfSize={numOfSize} />
    </div>
  );
}

export default FilterMatches;
