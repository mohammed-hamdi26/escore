import { addPlayer } from "@/app/_Lib/actions";
import { getCountries } from "@/app/_Lib/countriesApi";
import { getPlayer } from "@/app/_Lib/palyerApi";
import PlayerFrom from "@/components/Player Management/PlayerFrom";

async function page() {
  const countries = await getCountries();

  return (
    <PlayerFrom
      submit={addPlayer}
      countries={countries}
      successMessage="Player added"
    />
  );
}

export default page;
