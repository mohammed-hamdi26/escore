"use client";
import { Link } from "@/i18n/navigation";
import { Menu } from "lucide-react";
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
    <header className="sticky top-0 z-50 mb-4 bg-white/80 dark:bg-[#0a0c10]/80 backdrop-blur-xl border-b border-gray-200 dark:border-green-primary/20 shadow-sm dark:shadow-none">
      <div className="flex items-center justify-between px-4 md:px-6 lg:px-8 py-3">
        {/* Left section: Logo + Mobile Menu */}
        <div className="flex items-center gap-3">
          {/* Logo - always visible */}
          <Link href="/dashboard" className="flex-shrink-0">
            <EscoreLogo width={80} height={40} className="md:w-[100px] md:h-[50px]" />
          </Link>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-700 dark:text-white hover:bg-green-primary/10 hover:text-green-primary transition-colors"
                >
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-[280px] bg-white dark:bg-[#0f1118] border-0 border-r border-gray-200 dark:border-green-primary/20"
              >
                <SheetHeader>
                  <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-6 mt-6">
                  <Link href="/dashboard" className="mx-auto">
                    <EscoreLogo width={80} height={40} />
                  </Link>
                  {user && <HeaderSideNavBar user={user} t={t} />}
                  <NavItems t={t} />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Center section: Back button + Page title */}
        <div className="flex-1 flex justify-center px-4">
          <BackPage />
        </div>

        {/* Right section: Controls */}
        <div className="flex items-center gap-2 md:gap-3">
          <ToggleThemeMode />
          <LocaleChange />
        </div>
      </div>
    </header>
  );
}

export default TopNav;
