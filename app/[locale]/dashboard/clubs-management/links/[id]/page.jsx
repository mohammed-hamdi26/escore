import { getClub, getClubsLinks } from "@/app/[locale]/_Lib/clubsApi";
import LinksPageContainer from "@/components/Links/LinksPageContainer";

async function page({ params }) {
  const { id } = await params;
  const [club, links] = await Promise.all([
    getClub(id),
    getClubsLinks(id),
  ]);

  const clubName = club?.name || null;

  return (
    <LinksPageContainer
      links={links}
      id={id}
      linkType="clubs"
      playerName={clubName}
    />
  );
}

export default page;
