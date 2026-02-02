"use client";
import { Dialog } from "@radix-ui/react-dialog";
import { DialogContent, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import AwardsForm from "./AwardsForm";
import { useTranslations } from "next-intl";
import AwardsTable from "./AwardsTable";
import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { ArrowLeft, Award, Plus, User } from "lucide-react";

function AwardsPageContainer({
  awardsType = "players",
  players,
  teams,
  tournaments,
  games,
  id,
  awards,
  playerName,
}) {
  const t = useTranslations("Awards");
  const [isOpen, setIsOpen] = useState(false);
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
            <div className="size-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <Award className="size-5 text-amber-500" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">
                {t("title") || "Awards"}
              </h1>
              {playerName && (
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <User className="size-3" />
                  {playerName}
                </p>
              )}
            </div>
          </div>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-primary text-white cursor-pointer hover:bg-green-primary/70">
              <Plus className="size-4 mr-2 rtl:mr-0 rtl:ml-2" />
              {t("Add new Award")}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogTitle className="flex items-center gap-2">
              <Award className="size-5 text-amber-500" />
              {t("Add new Award")}
            </DialogTitle>
            <AwardsForm
              id={id}
              tournaments={tournaments}
              teams={teams}
              games={games}
              players={players}
              awardsType={awardsType}
              t={t}
              setOpen={setIsOpen}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Awards Grid */}
      <AwardsTable
        awards={awards}
        awardsType={awardsType}
        games={games}
        idUser={id}
        t={t}
      />
    </div>
  );
}

export default AwardsPageContainer;
