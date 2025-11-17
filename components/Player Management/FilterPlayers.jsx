import { useState } from "react";
import FilterItem from "../Matches Management/FilterItem";
import FilterDatePicker from "../ui app/FilterDatePicker";
import InputApp from "../ui app/InputApp";

import { usePathname, useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import SelectSizeRows from "../ui app/SelectSizeRows";

function FilterPlayers({ search, numOfPlayers }) {
  const [searchTerm, setSearchTerm] = useState(search || "");
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  return (
    <div className="flex items-center gap-4">
      <InputApp
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);

          const params = new URLSearchParams(searchParams);
          if (e.target.value) {
            params.set("search", e.target.value);
          } else {
            params.delete("search");
          }
          router.push(`${pathname}?${params.toString()}`);
        }}
        className="w-[200px] "
        flexGrow="flex-0"
      />

      <SelectSizeRows numOfSize={numOfPlayers} />
    </div>
  );
}

export default FilterPlayers;
