"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import AwardsForm from "./AwardsForm";
import { Button } from "../ui/button";
import { deleteAward } from "@/app/[locale]/_Lib/actions";
import toast from "react-hot-toast";
import {
  Award,
  Edit,
  Gamepad2,
  MoreVertical,
  Trash2,
  Trophy,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Spinner } from "../ui/spinner";
import { getImgUrl } from "@/lib/utils";

function AwardsTable({ awards, games, awardsType, idUser }) {
  const t = useTranslations("Awards");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingId, setLoadingId] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editAward, setEditAward] = useState(null);

  const handleDelete = async (awardId) => {
    if (!confirm(t("confirmDelete") || "Are you sure you want to delete this award?")) {
      return;
    }

    try {
      setIsLoading(true);
      setLoadingId(awardId);
      await deleteAward(awardsType, idUser, awardId);
      toast.success(t("Award deleted successfully"));
    } catch (e) {
      toast.error(t("Error deleting award"));
    } finally {
      setIsLoading(false);
      setLoadingId(null);
    }
  };

  const handleEdit = (award) => {
    setEditAward(award);
    setEditOpen(true);
  };

  if (!awards || awards.length === 0) {
    return (
      <div className="bg-dashboard-box dark:bg-[#0F1017] rounded-xl p-12 text-center">
        <Trophy className="size-16 mx-auto mb-4 text-[#677185]" />
        <h3 className="text-xl font-semibold text-foreground mb-2">
          {t("noAwards") || "No Awards"}
        </h3>
        <p className="text-muted-foreground">
          {t("noAwardsDescription") || "Add awards to display them here."}
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Awards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {awards.map((award) => {
          const awardImage = getImgUrl(award.image?.light) || getImgUrl(award.image?.dark) || getImgUrl(award.icon);
          const gameImage = getImgUrl(award.game?.logo?.light) || getImgUrl(award.game?.logo?.dark);

          return (
            <div
              key={award.id}
              className="group bg-dashboard-box dark:bg-[#0F1017] rounded-xl overflow-hidden hover:ring-1 hover:ring-amber-500/30 transition-all"
            >
              {/* Award Image */}
              <div className="relative aspect-square bg-gradient-to-br from-amber-900/20 to-[#0F1017]">
                {awardImage ? (
                  <img
                    src={awardImage}
                    alt={award.name}
                    className="w-full h-full object-contain p-4"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Trophy className="size-16 text-amber-500/50" />
                  </div>
                )}

                {/* Game Badge */}
                {award.game && (
                  <div className="absolute top-2 left-2">
                    <div className="bg-black/70 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1.5">
                      {gameImage ? (
                        <img
                          src={gameImage}
                          alt={award.game.name}
                          className="size-4 rounded object-cover"
                        />
                      ) : (
                        <Gamepad2 className="size-4 text-white" />
                      )}
                      <span className="text-xs text-white font-medium">
                        {award.game.name}
                      </span>
                    </div>
                  </div>
                )}

                {/* Actions Menu */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="bg-black/50 backdrop-blur-sm hover:bg-black/70 text-white size-8"
                        disabled={isLoading && loadingId === award.id}
                      >
                        {isLoading && loadingId === award.id ? (
                          <Spinner className="size-4" />
                        ) : (
                          <MoreVertical className="size-4" />
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => handleEdit(award)}
                      >
                        <Edit className="size-4 mr-2" />
                        {t("Edit")}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="cursor-pointer text-red-400 focus:text-red-400"
                        onClick={() => handleDelete(award.id)}
                        disabled={isLoading}
                      >
                        <Trash2 className="size-4 mr-2" />
                        {t("Delete")}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Award Info */}
              <div className="p-4">
                <h3 className="font-semibold text-foreground text-lg truncate">
                  {award.name}
                </h3>
                {award.game && (
                  <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                    <Gamepad2 className="size-3" />
                    {award.game.name}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogTitle className="flex items-center gap-2">
            <Edit className="size-5 text-green-primary" />
            {t("Edit Award")}
          </DialogTitle>
          {editAward && (
            <AwardsForm
              award={editAward}
              id={idUser}
              t={t}
              setOpen={setEditOpen}
              awardsType={awardsType}
              games={games}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default AwardsTable;
