import ServicesContainer from "@/components/dashboard/ServicesContainer";
import SettingsIcon from "@/components/dashboard/SettingsIcon";
import News from "@/components/icons/News";
import SupportCenter from "@/components/icons/SuppotCenter";
import User from "@/components/icons/User";
import { Link2, UserCircle } from "lucide-react";
const links = [
  {
    title: "Languages",
    href: "/settings/language",
    description: "update and modify supported languages",
    icon: <News />,
    isShowed: true,
  },
  {
    title: "Appearance",
    href: "/settings/apperance",
    description: "update and modify global appearance",
    icon: <User />,
    isShowed: true,
  },
  {
    title: "Links",
    href: "/settings/links",
    description: "Go to Links to view user messages and reply to them",
    icon: <Link2 className="icon-transition " width={"41"} height={"49"} />,
    isShowed: true,
  },
  {
    title: "About",
    href: "/settings/about",
    description: "update and modify about page",
    icon: <SupportCenter />,
    isShowed: true,
  },
  {
    title: "Avatars",
    href: "/settings/avatars",
    description: "Manage user profile avatars",
    icon: <UserCircle className="icon-transition" width={"41"} height={"49"} />,
    isShowed: true,
  },
  {
    title: "Privacy and Policy",
    href: "/settings/privacy-policy",
    description: "Manage your privacy and Policy configuration settings.",
    icon: <SettingsIcon width="41" height="49" className="icon-transition" />,
    isShowed: true,
  },
];
function page() {
  return <ServicesContainer links={links} />;
}

export default page;
