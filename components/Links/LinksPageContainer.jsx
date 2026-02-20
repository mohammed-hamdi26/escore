"use client";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import LinksForm from "./LinksForm";
import LinksTable from "./LinksTable";
import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { ArrowLeft, Link2, Plus, User, Users, Trophy, Calendar, Building2 } from "lucide-react";

function LinksPageContainer({
  players,
  teams,
  id,
  links,
  linkType = "players",
  playerName,
}) {
  const t = useTranslations("Links");
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-dashboard-box dark:bg-[#0F1017] rounded-xl p-4">
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="text-[#677185] dark:hover:text-white"
          >
            <ArrowLeft className="rtl:rotate-180 size-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Link2 className="size-5 text-blue-500" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">
                {t("title") || "Social Links"}
              </h1>
              {playerName && (
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  {linkType === "clubs" ? (
                    <Building2 className="size-3" />
                  ) : linkType === "events" ? (
                    <Calendar className="size-3" />
                  ) : linkType === "tournaments" ? (
                    <Trophy className="size-3" />
                  ) : linkType === "teams" ? (
                    <Users className="size-3" />
                  ) : (
                    <User className="size-3" />
                  )}
                  {playerName}
                </p>
              )}
            </div>
          </div>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-primary text-white cursor-pointer hover:bg-green-primary/70">
              <Plus className="size-4 mr-2 rtl:mr-0 rtl:ml-2" />
              {t("Add new link")}
            </Button>
          </DialogTrigger>
          <DialogContent
            dir={locale === "en" ? "ltr" : "rtl"}
            className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto"
          >
            <DialogTitle className="flex items-center gap-2">
              <Link2 className="size-5 text-blue-500" />
              {t("Add new link")}
            </DialogTitle>
            <LinksForm
              setOpen={setOpen}
              id={id}
              teams={teams}
              players={players}
              linksType={linkType}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Links Table/Grid */}
      <LinksTable
        linksType={linkType}
        links={links}
        numOfLinks={links.length}
        idUser={id}
      />
    </div>
  );
}

export default LinksPageContainer;
