"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Edit, User, Trash2, Loader2 } from "lucide-react";
import { removePlayerFromTeam } from "@/app/[locale]/_Lib/actions";
import toast from "react-hot-toast";
import { getImgUrl } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

function calculateAge(dateOfBirth) {
  if (!dateOfBirth) return "-";
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
}

function TeamLineupTable({ players, teamId }) {
  const t = useTranslations("TeamLineups");
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [playerToDelete, setPlayerToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (player) => {
    setPlayerToDelete(player);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!playerToDelete) return;

    setIsDeleting(true);
    try {
      await removePlayerFromTeam(playerToDelete.id || playerToDelete._id, teamId);
      toast.success(t("playerRemoved") || "Player removed from team");
      setDeleteDialogOpen(false);
      setPlayerToDelete(null);
      router.refresh();
    } catch (error) {
      toast.error(t("playerRemoveError") || "Failed to remove player");
    } finally {
      setIsDeleting(false);
    }
  };

  if (!players || players.length === 0) {
    return (
      <div className="text-center py-12 text-[#677185]">
        <User className="w-16 h-16 mx-auto mb-4 opacity-50" />
        <p>{t("noPlayers")}</p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-lg border border-[#2a2f3e] overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#1a1f2e]">
            <tr>
              <th className="p-4 text-start font-medium text-[#BABDC4]">
                {t("columns.photo")}
              </th>
              <th className="p-4 text-start font-medium text-[#BABDC4]">
                {t("columns.name")}
              </th>
              <th className="p-4 text-start font-medium text-[#BABDC4]">
                {t("columns.role")}
              </th>
              <th className="p-4 text-start font-medium text-[#BABDC4]">
                {t("columns.country")}
              </th>
              <th className="p-4 text-start font-medium text-[#BABDC4]">
                {t("columns.age")}
              </th>
              <th className="p-4 text-start font-medium text-[#BABDC4]">
                {t("columns.actions")}
              </th>
            </tr>
          </thead>
          <tbody>
            {players.map((player) => {
              const photoUrl = getImgUrl(player?.photo?.light, "thumbnail") || getImgUrl(player?.photo?.dark, "thumbnail");
              const age = calculateAge(player?.dateOfBirth);

              return (
                <tr
                  key={player.id || player._id}
                  className="border-t border-[#2a2f3e] hover:bg-[#1a1f2e]/50 transition-colors"
                >
                  <td className="p-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-[#232838] flex items-center justify-center">
                      {photoUrl ? (
                        <Image
                          src={photoUrl}
                          width={48}
                          height={48}
                          alt={player.nickname || "Player"}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <User className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div>
                      <p className="font-semibold">{player.nickname}</p>
                      {(player.firstName || player.lastName) && (
                        <p className="text-sm text-[#677185]">
                          {player.firstName} {player.lastName}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-3 py-1 rounded-full bg-[#232838] text-sm">
                      {player.role || "-"}
                    </span>
                  </td>
                  <td className="p-4">
                    {player.country ? (
                      <div className="flex items-center gap-2">
                        {player.country.flag && (
                          player.country.flag.startsWith("http") ? (
                            <Image
                              src={player.country.flag}
                              width={24}
                              height={18}
                              alt={player.country.name || "Flag"}
                              className="rounded-sm object-cover"
                            />
                          ) : (
                            <span>{player.country.flag}</span>
                          )
                        )}
                        <span>{player.country.name}</span>
                      </div>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="p-4">{age}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/dashboard/player-management/edit/${player.id || player._id}`}
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          className="hover:bg-green-primary hover:text-white"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hover:bg-red-500 hover:text-white text-red-400"
                        onClick={() => handleDeleteClick(player)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("removePlayerTitle") || "Remove Player from Team"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("removePlayerDescription", {
                player: playerToDelete?.nickname,
              }) ||
                `Are you sure you want to remove ${playerToDelete?.nickname} from this team? The player will become a free agent.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              {t("cancel") || "Cancel"}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2 animate-spin" />
                  {t("removing") || "Removing..."}
                </>
              ) : (
                t("remove") || "Remove"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default TeamLineupTable;
