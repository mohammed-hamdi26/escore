import GamesManagement from "../icons/GamesManagement";
import MatchesManagement from "../icons/MatchesManagement";
import News from "../icons/News";
import Player from "../icons/Player";
import SupportCenter from "../icons/SuppotCenter";
import TeamsManagement from "../icons/TeamsManagement";
import User from "../icons/User";
import ServiceItem from "./ServiceItem";

const links = [
  {
    title: "Matches Management",
    href: "/matches-management/add",
    description:
      "Go to Matches Section to Add Match: Date, Time, Teams, Game, Tournament, Stream Links",
    icon: <MatchesManagement />,
  },
  {
    title: "Players",
    href: "/player-management/add",
    description:
      "Go to players Section to Add Player: Name, Age, Country, Team, Game, Photos",
    icon: <Player />,
  },
  {
    title: "Teams Management",
    href: "/teams-management/add",
    description: "Add Team: Name, Country, Linked Players, Logo/Images",
    icon: <TeamsManagement />,
  },
  {
    title: "Games Management",
    href: "/games-management/add",
    description: "go to Games Sectoin to Add Game: Name + Icon",
    icon: <GamesManagement />,
  },
  {
    title: "News & Updates",
    href: "/news/add",
    description:
      "Go to news Sectoin to Add News: Title, Description, Image/Video, Author",
    icon: <News />,
  },
  {
    title: "Users",
    href: "/users/",
    description:
      "Go to user Section to view Users , Edit email and password , see favorite teams for each user  ",
    icon: <User />,
  },
  {
    title: "Support Center",
    href: "/support-center/add",
    description:
      "Go to players Section to Add Player: Name, Age, Country, Team, Game, Photos",
    icon: <SupportCenter />,
  },
];
function ServicesContainer() {
  return (
    <div className="grid grid-rows-2 grid-cols-4 gap-5 h-full ">
      {links.map((link) => (
        <ServiceItem
          key={link.title}
          title={link.title}
          icon={link.icon}
          href={`/dashboard${link.href}`}
          description={link.description}
        />
      ))}
    </div>
  );
}

export default ServicesContainer;
