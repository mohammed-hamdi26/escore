import Image from "next/image";
import { Users } from "lucide-react";
import { getImgUrl } from "@/lib/utils";

function TeamLineupHeader({ team, playersCount }) {
  const logoUrl = getImgUrl(team?.logo?.light, "medium") || getImgUrl(team?.logo?.dark, "medium");

  return (
    <div className="flex items-center gap-6 mb-8">
      <div className="bg-[#232838] dark:bg-[#1a1f2e] size-28 flex justify-center items-center rounded-full overflow-hidden">
        {logoUrl ? (
          <Image
            src={logoUrl}
            height={64}
            width={64}
            alt={team?.name || "Team Logo"}
            className="object-contain"
          />
        ) : (
          <Users className="w-12 h-12 text-gray-400" />
        )}
      </div>
      <div>
        <h3 className="text-2xl font-bold">{team?.name}</h3>
        <p className="text-[#BABDC4]">
          {team?.country?.flag} {team?.country?.name}
        </p>
        <p className="text-sm text-[#677185] mt-1">
          {playersCount} {playersCount === 1 ? "Player" : "Players"}
        </p>
      </div>
    </div>
  );
}

export default TeamLineupHeader;
