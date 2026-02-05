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
    <header className="sticky top-0 z-50 h-16 bg-white dark:bg-[#0a0c10] border-b border-gray-200 dark:border-white/10">
      <div className="h-full flex items-center justify-between px-4 lg:px-6">
        {/* Left section: Logo + Mobile Menu */}
        <div className="flex items-center gap-3">
          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-700 dark:text-white hover:bg-green-primary/10"
                >
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-[280px] p-0 bg-white dark:bg-[#0f1118] border-r border-gray-200 dark:border-white/10"
              >
                <SheetHeader className="sr-only">
                  <SheetTitle>Navigation Menu</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col h-full">
                  <div className="p-4 border-b border-gray-200 dark:border-white/10">
                    <Link href="/dashboard" className="inline-block">
                      <EscoreLogo width={120} height={45} />
                    </Link>
                  </div>
                  <div className="p-4">
                    {user && <HeaderSideNavBar user={user} t={t} />}
                  </div>
                  <div className="flex-1 overflow-y-auto px-2">
                    <NavItems user={user} t={t} />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Logo */}
          <Link href="/dashboard" className="flex-shrink-0 group">
            <EscoreLogo width={140} height={52} className="group-hover:opacity-90" />
          </Link>
        </div>

        {/* Center section: Back button */}
        <div className="hidden md:flex flex-1 justify-center">
          <BackPage />
        </div>

        {/* Right section: Controls */}
        <div className="flex items-center gap-2">
          <ToggleThemeMode />
          <LocaleChange />
        </div>
      </div>
    </header>
  );
}

export default TopNav;
