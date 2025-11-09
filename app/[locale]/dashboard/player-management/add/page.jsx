import { addPlayer } from "@/app/[locale]/_Lib/actions";
import { getCountries } from "@/app/[locale]/_Lib/countriesApi";
// import { getPlayer } from "@/app/_Lib/palyerApi";
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
