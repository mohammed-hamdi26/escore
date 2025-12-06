"use client";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import InputApp from "../ui app/InputApp";
import SelectSizeRows from "../ui app/SelectSizeRows";

function TransfersFilter({ numOfSize }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );
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
          params.delete("page");
          router.push(`${pathname}?${params.toString()}`);
        }}
        className="w-[200px]"
        flexGrow="flex-0"
        placeholder="Search..."
      />

      <SelectSizeRows numOfSize={numOfSize} />
    </div>
  );
}

export default TransfersFilter;
