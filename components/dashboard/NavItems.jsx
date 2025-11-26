"use client";
import { usePathname } from "next/navigation";
import NavItem from "./NavItem";
import SettingsIcon from "./SettingsIcon";
import { Button } from "../ui/button";
import { logout } from "@/app/[locale]/_Lib/actions";
import { LogOut } from "lucide-react";
import { cloneElement } from "react";
import PasswordIcon from "../icons/PasswordIcon";

const pages = [
  {
    icon: <SettingsIcon />,
    title: "Settings",
    href: "/dashboard/settings",
  },
  {
    icon: <PasswordIcon width="17" height="17" />,
    title: "Change Password",
    href: "/dashboard/change-password",
  },
];
function NavItems({ t }) {
  const pathname = usePathname();
  return (
    <ul className=" mx-auto space-y-6">
      {pages.map((page) => (
        <NavItem
          isActive={pathname === page.href}
          key={page.title}
          icon={page.icon}
          label={t(page.title)}
          href={page.href}
        />
      ))}
      {/* <NavItem
        onClick={() => logout()}
        className={
          "bg-destructive hover:bg-destructive/90 cursor-pointer text-white "
        }
      >

        <LogOut className="rtl:rotate-180" />
      </NavItem> */}
      <div
        className="group flex items-center gap-2  rounded-full cursor-pointer"
        onClick={() => logout()}
      >
        <span
          className={`px-2.5 py-2.5 rounded-lg  bg-[#262C3D33] group-hover:bg-green-primary transition-colors duration-500`}
        >
          {cloneElement(
            <LogOut width={17} height={17} className="rtl:rotate-180" />,
            {
              className: ` text-[#667085] group-hover:text-white transition-colors duration-500`,
            }
          )}
        </span>{" "}
        <p
          className={`text-lg font-semibold text-[#667085] dark:group-hover:text-white transition-colors duration-500 `}
        >
          {t("Logout")}
        </p>
      </div>
    </ul>
  );
}

export default NavItems;
