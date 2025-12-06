"use client";
import { logout } from "@/app/[locale]/_Lib/actions";
import { Link } from "@/i18n/navigation";
import { LogOut, Menu } from "lucide-react";
import { useTranslations } from "next-intl";
import BackPage from "../ui app/BackPage";
import LocaleChange from "../ui app/LocaleChange";
import ToggleThemeMode from "../ui app/ToggleThemeMode";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import EscoreLogo from "./EscoreLogo";
import HeaderSideNavBar from "./HeaderSideNavBar";
import NavItems from "./NavItems";

function TopNav({ user }) {
  const t = useTranslations("nav");

  return (
    <div className="flex items-center justify-between md:gap-[190px] mb-4 md:mb-8">
      {/* Mobile Menu */}
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-white">
              <Menu className="size-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px] bg-dashboard-box dark:bg-[#0F1017] border-0">
            <SheetHeader>
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-8 mt-4">
              <Link href="/dashboard" className="mx-auto">
                <EscoreLogo width={80} height={40} />
              </Link>
              {user && <HeaderSideNavBar user={user} t={t} />}
              <NavItems t={t} />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <Link className="hidden md:block" href="/dashboard">
        <EscoreLogo width={100} height={50} />
      </Link>
      <div className="flex items-center justify-between flex-1">
        <BackPage />
        <div className={`flex ltr:ml-auto rtl:mr-auto items-center gap-4 md:gap-6`}>
          <ToggleThemeMode />
          <LocaleChange />
        </div>
      </div>
    </div>
  );
}

export default TopNav;
