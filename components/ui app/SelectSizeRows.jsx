import { usePathname, useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import React, { useState } from "react";
import SelectInput from "./SelectInput";

export default function SelectSizeRows({ numOfSize }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [size, setSize] = useState(Number(searchParams.get("size")) || 20);
  return (
    <SelectInput
      flexGrow="flex-0"
      value={size}
      options={Array.from(
        { length: numOfSize > 20 ? 20 : numOfSize },
        (_, i) => {
          return { name: i + 1, value: i + 1 };
        }
      )}
      onChange={(value) => {
        const params = new URLSearchParams(searchParams);
        params.set("size", value);
        params.delete("page");
        setSize(value);
        router.replace(`${pathname}?${params.toString()}`);
      }}
    />
  );
}
