"use client";
import { logout } from "@/app/[locale]/_Lib/actions";
import { Link } from "@/i18n/navigation";
import { LogOut } from "lucide-react";
import BackPage from "../ui app/BackPage";
import LocaleChange from "../ui app/LocaleChange";
import ToggleThemeMode from "../ui app/ToggleThemeMode";
import { Button } from "../ui/button";
import EscoreLogo from "./EscoreLogo";

function TopNav() {
  return (
    <div className="flex items-center justify-between md:gap-[190px] mb-8">
      <Link className="hidden md:block" href="/dashboard">
        <EscoreLogo width={100} height={50} />
      </Link>
      <div className="flex items-center  justify-between flex-1 ">
        <BackPage />
        <div className={`flex in-ltr:ml-auto rtl:mr-auto items-center gap-6`}>
          <ToggleThemeMode />
          <LocaleChange />
          <Button
            onClick={() => logout()}
            className={
              "bg-destructive hover:bg-destructive/90 cursor-pointer text-white "
            }
          >
            {" "}
            <LogOut className="rtl:rotate-180" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default TopNav;
