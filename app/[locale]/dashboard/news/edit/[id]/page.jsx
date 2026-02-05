import { editNews } from "@/app/[locale]/_Lib/actions";
import { getGames } from "@/app/[locale]/_Lib/gamesApi";
import { getMatches } from "@/app/[locale]/_Lib/matchesApi";
import { getNew } from "@/app/[locale]/_Lib/newsApi";
import { getPlayers } from "@/app/[locale]/_Lib/palyerApi";
import { getTeams } from "@/app/[locale]/_Lib/teamsApi";
import { getTournaments } from "@/app/[locale]/_Lib/tournamentsApi";
import NewsFormRedesign from "@/components/News/NewsFormRedesign";
import { NewsEditWrapper } from "@/components/News/NewsFormWrapper";
import { getLocale } from "next-intl/server";

async function page({ params }) {
  const { id } = await params;
  const locale = await getLocale();

  const [
    newData,
    { data: teamsOptions },
    { data: tournamentsOptions },
    { data: gamesOptions },
    { data: playersOptions },
    { data: matchesOptions },
  ] = await Promise.all([
    getNew(id),
    getTeams(),
    getTournaments(),
    getGames(),
    getPlayers(),
    getMatches(),
  ]);

  return (
    <NewsEditWrapper>
      <NewsFormRedesign
        options={{
          teamsOptions,
          tournamentsOptions,
          gamesOptions,
          playersOptions,
          matchesOptions,
        }}
        newData={newData}
        formType="edit"
        submit={editNews}
        locale={locale}
      />
    </NewsEditWrapper>
  );
}

export default page;
