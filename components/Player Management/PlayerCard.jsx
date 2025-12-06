"use client";
import { useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import {
  Edit,
  Trash2,
  MoreVertical,
  User,
  Users,
  Calendar,
  Globe,
  Gamepad2,
  Award,
  Link as LinkIcon,
  Star,
} from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Spinner } from "../ui/spinner";
import toast from "react-hot-toast";

function PlayerCard({
  player,
  onDelete,
  t,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingAction, setLoadingAction] = useState(null);

  const playerImage = player.photo?.light || player.photo?.dark;
  const teamImage = player.team?.logo?.light || player.team?.logo?.dark;

  // Calculate age from dateOfBirth
  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return null;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const age = calculateAge(player.dateOfBirth);

  const handleAction = async (action, actionName) => {
    setIsLoading(true);
    setLoadingAction(actionName);
    try {
      await action();
      toast.success(t(`${actionName}Success`));
    } catch (error) {
      toast.error(t(`${actionName}Error`));
    } finally {
      setIsLoading(false);
      setLoadingAction(null);
    }
  };

  return (
    <div className="bg-dashboard-box dark:bg-[#0F1017] rounded-xl overflow-hidden hover:ring-1 hover:ring-green-primary/30 transition-all">
      <div className="flex flex-col md:flex-row">
        {/* Player Image */}
        <div className="relative w-full md:w-48 h-48 md:h-auto flex-shrink-0">
          {playerImage ? (
            <Image
              src={playerImage}
              alt={player.nickname}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-[#1a1f2e] flex items-center justify-center">
              <User className="size-16 text-[#677185]" />
            </div>
          )}
          {/* Team Badge Overlay */}
          {player.team && (
            <div className="absolute bottom-2 left-2">
              <div className="bg-black/70 rounded-lg p-1.5 flex items-center gap-1.5">
                {teamImage ? (
                  <Image
                    src={teamImage}
                    alt={player.team.name}
                    width={20}
                    height={20}
                    className="rounded"
                  />
                ) : (
                  <Users className="size-4 text-white" />
                )}
                <span className="text-xs text-white font-medium">
                  {player.team.name}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-4 flex flex-col">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-2">
            <div className="flex-1">
              {/* Game & Country */}
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                {player.game && (
                  <Badge variant="outline" className="text-xs border-[#677185] text-[#677185]">
                    <Gamepad2 className="size-3 mr-1" />
                    {player.game.name}
                  </Badge>
                )}
                {player.country && (
                  <Badge variant="outline" className="text-xs border-[#677185] text-[#677185]">
                    <Globe className="size-3 mr-1" />
                    {player.country.name || player.country.code}
                  </Badge>
                )}
              </div>

              {/* Nickname */}
              <h3 className="text-lg font-semibold text-white">
                {player.nickname}
              </h3>

              {/* Real Name */}
              {(player.firstName || player.lastName) && (
                <p className="text-sm text-[#677185]">
                  {player.firstName} {player.lastName}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Link href={`/dashboard/player-management/edit/${player.id}`}>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-green-primary text-green-primary hover:bg-green-primary hover:text-white"
                >
                  <Edit className="size-4 mr-1" />
                  {t("edit")}
                </Button>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-[#677185] hover:text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Spinner className="size-4" />
                    ) : (
                      <MoreVertical className="size-4" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <Link href={`/dashboard/player-management/awards/${player.id}`}>
                    <DropdownMenuItem className="cursor-pointer">
                      <Award className="size-4 mr-2" />
                      {t("awards")}
                    </DropdownMenuItem>
                  </Link>
                  <Link href={`/dashboard/player-management/links/${player.id}`}>
                    <DropdownMenuItem className="cursor-pointer">
                      <LinkIcon className="size-4 mr-2" />
                      {t("links")}
                    </DropdownMenuItem>
                  </Link>
                  <Link href={`/dashboard/player-management/favorites-characters/${player.id}`}>
                    <DropdownMenuItem className="cursor-pointer">
                      <Star className="size-4 mr-2" />
                      {t("favoritesCharacters")}
                    </DropdownMenuItem>
                  </Link>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    className="cursor-pointer text-red-400 focus:text-red-400"
                    onClick={() => handleAction(() => onDelete(player.id), "delete")}
                    disabled={loadingAction === "delete"}
                  >
                    <Trash2 className="size-4 mr-2" />
                    {t("delete")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Meta Info */}
          <div className="mt-auto flex flex-wrap items-center gap-4 text-xs text-[#677185]">
            {/* Age */}
            {age && (
              <div className="flex items-center gap-1">
                <Calendar className="size-3" />
                <span>{age} {t("yearsOld")}</span>
              </div>
            )}

            {/* Team */}
            <div className="flex items-center gap-1">
              <Users className="size-3" />
              <span>{player.team?.name || t("noTeam")}</span>
            </div>

            {/* Country */}
            {player.country && (
              <div className="flex items-center gap-1">
                <Globe className="size-3" />
                <span>{player.country.name || player.country.code}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlayerCard;
