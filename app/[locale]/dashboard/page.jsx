import ServicesContainer from "@/components/dashboard/ServicesContainer";
import SettingsIcon from "@/components/dashboard/SettingsIcon";
import Champion from "@/components/icons/Champion";
import GamesManagement from "@/components/icons/GamesManagement";
import MatchesManagement from "@/components/icons/MatchesManagement";
import News from "@/components/icons/News";
import Player from "@/components/icons/Player";
import SupportCenter from "@/components/icons/SuppotCenter";
import TeamsManagement from "@/components/icons/TeamsManagement";
import User from "@/components/icons/User";
import { ArrowRightLeft, icons } from "lucide-react";
const links = [
  {
    title: "Tournaments Management",
    href: "/tournaments-management/edit",
    description:
      "Go to Tournaments Section to Add Tournament: Name, Champion, Start Date, End Date, Teams, Players",

    icon: (
      <Champion
        width="57"
        height="56"
        className={"text-green-primary icon-transition"}
      />
    ),
  },
  {
    title: "Matches Management",
    href: "/matches-management/edit",
    description:
      "Go to Matches Section to Add Match: Date, Time, Teams, Game, Tournament, Stream Links",
    icon: <MatchesManagement width="57" height="56" />,
  },
  {
    title: "Players",
    href: "/player-management/edit",
    description:
      "Go to players Section to Add Player: Name, Age, Country, Team, Game, Photos",
    icon: <Player width="57" height="56" />,
  },

  {
    title: "Teams Management",
    href: "/teams-management/edit",
    description: "Add Team: Name, Country, Linked Players, Logo/Images",
    icon: <TeamsManagement width="57" height="56" />,
  },
  {
    title: "transfers Management",
    href: "/transfers-management/edit",
    description:
      "Go to Transfers Section to Add Transfer: Player, From Team, To Team, Transfer Date, Transfer Fee",
    icon: <ArrowRightLeft className="icon-transition" width="57" height="56" />,
  },
  {
    title: "Games Management",
    href: "/games-management/edit",
    description: "go to Games Section to Add Game: Name + Icon",
    icon: <GamesManagement width="57" height="56" />,
  },
  {
    title: "News & Updates",
    href: "/news/edit",
    description:
      "Go to news Sectoin to Add News: Title, Description, Image/Video, Author",
    icon: <News width="57" height="56" />,
  },
  // {
  //   title: "Users",
  //   href: "/users/",
  //   description:
  //     "Go to user Section to view Users , Edit email and password , see favorite teams for each user  ",
  //   icon: <User />,
  // },
  {
    title: "Support Center",
    href: "/support-center",
    description: "Go to Support Center to view user messages and reply to them",
    icon: <SupportCenter width="57" height="56" />,
  },
  // {
  //   title: "Settings",
  //   href: "/settings",
  //   description: "Manage your preferences and account configuration settings.",
  //   icon: <SettingsIcon width="41" height="49" className="icon-transition" />,
  // },
];
export default function page() {
  return <ServicesContainer links={links} />;
}
