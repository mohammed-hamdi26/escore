"use client";

import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import Link from "next/link";

function LinksButtons() {
  const pathname = usePathname();

  return (
    <div className="flex mb-8">
      <Link href={pathname.slice(0, pathname.lastIndexOf("edit")) + "add"}>
        <Button
          // disabled={pathname.includes("add")}
          className={`text-white  text-center min-w-[100px] mr-4 px-5 py-2 rounded-lg ${
            pathname.includes("add")
              ? "bg-green-primary cursor-not-allowed hover:bg-green-primary "
              : "bg-[#F5F6F8]  dark:bg-[#10131D] text-black dark:text-white cursor-pointer hover:bg-green-primary/50 hover:text-white"
          }  disabled:opacity-50`}
        >
          Add New
        </Button>
      </Link>
      <Link href={pathname.slice(0, pathname.lastIndexOf("add")) + "edit"}>
        <Button
          // disabled={pathname.includes("edit")}
          className={` text-white text-center min-w-[100px] px-5 py-2 rounded-lg ${
            pathname.includes("edit")
              ? "bg-green-primary disabled:cursor-not-allowed hover:bg-green-primary "
              : "bg-[#F5F6F8] dark:bg-[#10131D] text-black dark:text-white cursor-pointer hover:bg-green-primary/50 hover:text-white"
          }   disabled:opacity-50`}
        >
          Edit
        </Button>
      </Link>
    </div>
  );
}

export default LinksButtons;
