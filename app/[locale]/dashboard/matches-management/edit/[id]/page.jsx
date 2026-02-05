import { updateMatch } from "@/app/[locale]/_Lib/actions";
import { getGames } from "@/app/[locale]/_Lib/gamesApi";
import { getMatch } from "@/app/[locale]/_Lib/matchesApi";
import { getTeams } from "@/app/[locale]/_Lib/teamsApi";
import { getTournaments } from "@/app/[locale]/_Lib/tournamentsApi";
import MatchFormRedesign from "@/components/Matches Management/MatchFormRedesign";
import { MatchEditWrapper } from "@/components/Matches Management/MatchFormWrapper";
import BackPage from "@/components/ui app/BackPage";
import { getTranslations } from "next-intl/server";

export default async function EditMatchPage({ params }) {
  const { id } = await params;
  const t = await getTranslations("MatchForm");

  const [match, { data: teamsOptions }, { data: gamesOptions }, { data: tournamentsOptions }] =
    await Promise.all([
      getMatch(id),
      getTeams({ size: 500 }),
      getGames({ limit: 100 }),
      getTournaments({ size: 500 }),
    ]);

  return (
    <MatchEditWrapper>
      <div className="space-y-6">
        <BackPage title={t("editMatch") || "Edit Match"} />
        <div className="glass rounded-2xl p-6 border border-gray-200 dark:border-white/5">
          <MatchFormRedesign
            gamesOptions={gamesOptions || []}
            teamsOptions={teamsOptions || []}
            match={match}
            formType="edit"
            tournamentsOptions={tournamentsOptions || []}
            submit={updateMatch}
          />
        </div>
      </div>
    </MatchEditWrapper>
  );
}
