import BackPage from "@/components/ui app/BackPage";
import TeamLineupHeader from "@/components/teams management/TeamLineupHeader";
import TeamLineupTable from "@/components/teams management/TeamLineupTable";
import { getTeam } from "@/app/[locale]/_Lib/teamsApi";
import { getPlayersByTeam } from "@/app/[locale]/_Lib/palyerApi";
import { getTranslations } from "next-intl/server";

export default async function TeamLineupsPage({ params }) {
  const { id } = await params;
  const t = await getTranslations("TeamLineups");

  const [team, players] = await Promise.all([
    getTeam(id),
    getPlayersByTeam(id),
  ]);

  return (
    <div>
      <BackPage title={t("title")} />
      <TeamLineupHeader team={team} playersCount={players?.length || 0} />
      <TeamLineupTable players={players || []} teamId={id} />
    </div>
  );
}
