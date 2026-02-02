import { getPlayer, getPlayers, getPlayersLinks } from "@/app/[locale]/_Lib/palyerApi";
import LinksPageContainer from "@/components/Links/LinksPageContainer";

async function page({ params }) {
  const { id } = await params;
  const [player, players, links] = await Promise.all([
    getPlayer(id),
    getPlayers(),
    getPlayersLinks(id),
  ]);

  // Get player name for header
  const playerName = player?.nickname || player?.firstName
    ? `${player?.firstName || ""} ${player?.lastName || ""}`.trim() || player?.nickname
    : null;

  return (
    <LinksPageContainer
      players={players}
      links={links}
      id={id}
      playerName={playerName}
    />
  );
}

export default page;
