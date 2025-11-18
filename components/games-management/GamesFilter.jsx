import { usePathname, useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import React, { useState } from "react";
import SelectSizeRows from "../ui app/SelectSizeRows";
import InputApp from "../ui app/InputApp";

export default function GamesFilter({ numOfSize }) {
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
          router.push(`${pathname}?${params.toString()}`);
        }}
        className="w-[200px] "
        flexGrow="flex-0"
      />

      <SelectSizeRows numOfSize={numOfSize} />
    </div>
  );
}
