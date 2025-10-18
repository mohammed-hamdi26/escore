"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";

function LinkButtonsUsers({ userId }) {
  const pathname = usePathname();
  return (
    <div className="flex mb-8">
      <Link href={`/dashboard/users/${userId}/following-teams`}>
        <Button
          className={` text-center min-w-[100px] mr-4 px-5 py-2 rounded-lg ${
            pathname.includes("following-teams")
              ? "bg-green-primary cursor-not-allowed "
              : "bg-[#10131D] cursor-pointer"
          }  disabled:opacity-50`}
        >
          Following Teams
        </Button>
      </Link>
      <Link href={`/dashboard/users/${userId}/following-players`}>
        <Button
          className={`text-center min-w-[100px] px-5 py-2 rounded-lg ${
            pathname.includes("following-players")
              ? "bg-green-primary disabled:cursor-not-allowed "
              : "bg-[#10131D] cursor-pointer"
          }   disabled:opacity-50`}
        >
          following Players
        </Button>
      </Link>
    </div>
  );
}

export default LinkButtonsUsers;
