import { addMatch } from "@/app/[locale]/_Lib/actions";
import { getGames } from "@/app/[locale]/_Lib/gamesApi";
import { getTeams } from "@/app/[locale]/_Lib/teamsApi";
import { getTournaments } from "@/app/[locale]/_Lib/tournamentsApi";
import MatchFormRedesign from "@/components/Matches Management/MatchFormRedesign";
import { MatchAddWrapper } from "@/components/Matches Management/MatchFormWrapper";
import BackPage from "@/components/ui app/BackPage";
import { getTranslations } from "next-intl/server";

export default async function AddMatchPage() {
  const t = await getTranslations("MatchForm");

  const [{ data: teamsOptions }, { data: gamesOptions }, { data: tournamentsOptions }] =
    await Promise.all([
      getTeams({ size: 500 }),
      getGames({ limit: 100 }),
      getTournaments({ size: 500 }),
    ]);

  return (
    <MatchAddWrapper>
      <div className="space-y-6">
        <BackPage title={t("addMatch") || "Add Match"} />
        <div className="glass rounded-2xl p-6 border border-gray-200 dark:border-white/5">
          <MatchFormRedesign
            submit={addMatch}
            gamesOptions={gamesOptions || []}
            teamsOptions={teamsOptions || []}
            tournamentsOptions={tournamentsOptions || []}
            formType="add"
          />
        </div>
      </div>
    </MatchAddWrapper>
  );
}
