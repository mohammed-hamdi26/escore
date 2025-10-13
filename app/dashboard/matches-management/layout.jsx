"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MatchesManagementLayout({ children }) {
  const pathname = usePathname();
  return (
    <>
      <div className="flex mb-8">
        <Button
          disabled={pathname.includes("add")}
          className={` text-center min-w-[100px] mr-4 px-5 py-2 rounded-lg ${
            pathname.includes("add")
              ? "bg-green-primary cursor-not-allowed "
              : "bg-[#10131D] cursor-pointer"
          }  disabled:opacity-50`}
        >
          <Link href={"/dashboard/matches-management/add"}>Add New</Link>
        </Button>
        <Button
          disabled={pathname.includes("edit")}
          className={`text-center min-w-[100px] px-5 py-2 rounded-lg ${
            pathname.includes("edit")
              ? "bg-green-primary disabled:cursor-not-allowed "
              : "bg-[#10131D] cursor-pointer"
          }   disabled:opacity-50`}
        >
          <Link href={"/dashboard/matches-management/edit"}>Edit</Link>
        </Button>
      </div>
      {children}
    </>
  );
}
