import { editNews } from "@/app/[locale]/_Lib/actions";
import { getGames } from "@/app/[locale]/_Lib/gamesApi";
import { getNew } from "@/app/[locale]/_Lib/newsApi";
import { getPlayers } from "@/app/[locale]/_Lib/palyerApi";
import { getTeams } from "@/app/[locale]/_Lib/teamsApi";
import { getTournaments } from "@/app/[locale]/_Lib/tournamentsApi";
import NewsForm from "@/components/News/NewsForm";

async function page({ params }) {
  const { id } = await params;
  const [
    newData,
    teamsOptions,
    tournamentsOptions,
    gamesOptions,
    playersOptions,
  ] = await Promise.all([
    getNew(id),
    getTeams(),
    getTournaments(),
    getGames(),
    getPlayers(),
  ]);
  // const newData = await getNew(id);

  return (
    <NewsForm
      options={{
        teamsOptions,
        tournamentsOptions,
        gamesOptions,
        playersOptions,
      }}
      newData={newData}
      formType="edit"
      submit={editNews}
    />
  );
}

export default page;
