"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MatchesManagementLayout({ children }) {
  const pathname = usePathname();
  return (
    <>
      <div className="flex mb-8">
        <Link href={"/dashboard/matches-management/add"}>
          <Button
            // disabled={pathname.includes("add")}
            className={` text-center min-w-[100px] mr-4 px-5 py-2 rounded-lg ${
              pathname.includes("add")
                ? "bg-green-primary cursor-not-allowed "
                : "bg-[#10131D] cursor-pointer"
            }  disabled:opacity-50`}
          >
            Add New
          </Button>
        </Link>
        <Link href={"/dashboard/matches-management/edit"}>
          <Button
            // disabled={pathname.includes("edit")}
            className={`text-center min-w-[100px] px-5 py-2 rounded-lg ${
              pathname.includes("edit")
                ? "bg-green-primary disabled:cursor-not-allowed "
                : "bg-[#10131D] cursor-pointer"
            }   disabled:opacity-50`}
          >
            Edit
          </Button>
        </Link>
      </div>
      {children}
    </>
  );
}
