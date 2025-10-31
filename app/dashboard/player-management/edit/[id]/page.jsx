import { editPlayer } from "@/app/_Lib/actions";
import { getCountries } from "@/app/_Lib/countriesApi";
import { getPlayer } from "@/app/_Lib/palyerApi";
import PlayerFrom from "@/components/Player Management/PlayerFrom";

async function page({ params }) {
  const id = await params.id;
  const [countries, player] = await Promise.all([
    getCountries(),
    getPlayer(id),
  ]);
  console.log(player);
  return (
    <PlayerFrom
      submit={editPlayer}
      countries={countries}
      player={player}
      formType="edit"
      successMessage="Player updated"
    />
  );
}

export default page;
