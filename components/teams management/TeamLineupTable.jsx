"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Edit, User } from "lucide-react";

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

  if (!players || players.length === 0) {
    return (
      <div className="text-center py-12 text-[#677185]">
        <User className="w-16 h-16 mx-auto mb-4 opacity-50" />
        <p>{t("noPlayers")}</p>
      </div>
    );
  }

  return (
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
            const photoUrl = player?.photo?.light || player?.photo?.dark;
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
                    <span>
                      {player.country.flag} {player.country.name}
                    </span>
                  ) : (
                    "-"
                  )}
                </td>
                <td className="p-4">{age}</td>
                <td className="p-4">
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
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default TeamLineupTable;
