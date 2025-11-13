import ServicesContainer from "@/components/dashboard/ServicesContainer";
import SettingsIcon from '@/components/dashboard/SettingsIcon';
import GamesManagement from '@/components/icons/GamesManagement';
import MatchesManagement from '@/components/icons/MatchesManagement';
import News from '@/components/icons/News';
import Player from '@/components/icons/Player';
import SupportCenter from '@/components/icons/SuppotCenter';
import TeamsManagement from '@/components/icons/TeamsManagement';
import User from '@/components/icons/User';
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
    description: "Go to Support Center to view user messages and reply to them",
    icon: <SupportCenter />,
  },
  {
    title: "Settings",
    href: "/settings",
    description: "Manage your preferences and account configuration settings.",
    icon: <SettingsIcon width='41' height='49' className="icon-transition" />,
  },
]
export default function page() {
  return <ServicesContainer links={links} />;
}
