"use client";
import { ArrowLeft, ArrowRight } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function Pagination() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  return (
    <div className="flex justify-between items-center">
      <Button
        disabled={page <= 1}
        onClick={() => {
          const params = new URLSearchParams(searchParams);
          params.set("page", page - 1);
          setPage(page - 1);
          router.replace(`${pathname}?${params.toString()}`);
        }}
        className={
          "bg-green-primary text-white hover:bg-green-primary/70 cursor-pointer"
        }
      >
        <ArrowLeft />
      </Button>
      <Button
        onClick={() => {
          const params = new URLSearchParams(searchParams);
          params.set("page", page + 1);
          setPage(page + 1);
          router.replace(`${pathname}?${params.toString()}`);
        }}
        className={
          "bg-green-primary text-white hover:bg-green-primary/70 cursor-pointer"
        }
      >
        <ArrowRight />
      </Button>
    </div>
  );
}
