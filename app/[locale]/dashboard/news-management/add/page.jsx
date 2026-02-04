import { addNews } from "@/app/[locale]/_Lib/actions";
import { getGames } from "@/app/[locale]/_Lib/gamesApi";
import { getTournaments } from "@/app/[locale]/_Lib/tournamentsApi";
import { getTeams } from "@/app/[locale]/_Lib/teamsApi";
import { getPlayers } from "@/app/[locale]/_Lib/palyerApi";
import NewsForm from "@/components/News Management/NewsForm";

export default async function AddNewsPage() {
  const [games, tournamentsResult, teamsResult, playersResult] = await Promise.all([
    getGames({ limit: 100 }),
    getTournaments({ size: 100 }),
    getTeams({ limit: 100 }),
    getPlayers({ size: 100 }),
  ]);

  return (
    <div>
      <NewsForm
        submit={addNews}
        games={games || []}
        tournaments={tournamentsResult?.data || []}
        teams={teamsResult?.data || []}
        players={playersResult?.data || []}
      />
    </div>
  );
}
