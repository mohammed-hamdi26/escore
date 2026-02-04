import { editNews } from "@/app/[locale]/_Lib/actions";
import { getNew } from "@/app/[locale]/_Lib/newsApi";
import { getGames } from "@/app/[locale]/_Lib/gamesApi";
import { getTournaments } from "@/app/[locale]/_Lib/tournamentsApi";
import { getTeams } from "@/app/[locale]/_Lib/teamsApi";
import { getPlayers } from "@/app/[locale]/_Lib/palyerApi";
import NewsForm from "@/components/News Management/NewsForm";

async function EditNewsPage({ params }) {
  const { id } = await params;

  const [news, games, tournamentsResult, teamsResult, playersResult] = await Promise.all([
    getNew(id),
    getGames({ limit: 100 }),
    getTournaments({ size: 100 }),
    getTeams({ limit: 100 }),
    getPlayers({ size: 100 }),
  ]);

  return (
    <NewsForm
      news={news}
      formType="edit"
      submit={editNews}
      games={games || []}
      tournaments={tournamentsResult?.data || []}
      teams={teamsResult?.data || []}
      players={playersResult?.data || []}
    />
  );
}

export default EditNewsPage;
