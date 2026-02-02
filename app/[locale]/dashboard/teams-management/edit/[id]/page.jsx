import { updateTeam } from "@/app/[locale]/_Lib/actions";
import { getCountries } from "@/app/[locale]/_Lib/countriesApi";
import { getGames } from "@/app/[locale]/_Lib/gamesApi";
import { getTeam } from "@/app/[locale]/_Lib/teamsApi";
import { getTournaments } from "@/app/[locale]/_Lib/tournamentsApi";
import { getPlayers } from "@/app/[locale]/_Lib/palyerApi";
import TeamFormRedesign from "@/components/teams management/TeamFormRedesign";

export default async function page({ params }) {
  const { id } = await params;

  const [countries, gamesOptions, team, tournamentsResult, playersResult] = await Promise.all([
    getCountries(),
    getGames(),
    getTeam(id),
    getTournaments({ size: 200 }),
    getPlayers({ size: 200 }),
  ]);

  // Map tournaments and players to options format
  const tournamentsOptions = tournamentsResult?.data?.map(t => ({
    id: t.id || t._id,
    _id: t.id || t._id,
    name: t.name,
    slug: t.slug,
    logo: t.logo,
    status: t.status,
  })) || [];

  const playersOptions = playersResult?.data?.map(p => ({
    id: p.id || p._id,
    _id: p.id || p._id,
    nickname: p.nickname,
    firstName: p.firstName,
    lastName: p.lastName,
    photo: p.photo,
    country: p.country,
  })) || [];

  return (
    <TeamFormRedesign
      submit={updateTeam}
      countries={countries.countries}
      team={team}
      OptionsData={{ gamesOptions, tournamentsOptions, playersOptions }}
      formType="edit"
    />
  );
}
