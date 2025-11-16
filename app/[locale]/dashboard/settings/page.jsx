import ServicesContainer from "@/components/dashboard/ServicesContainer";
import SettingsIcon from "@/components/dashboard/SettingsIcon";
import News from "@/components/icons/News";
import SupportCenter from "@/components/icons/SuppotCenter";
import User from "@/components/icons/User";
const links = [
  {
    title: "Languages",
    href: "/settings/language",
    description: "update and modify supported languages",
    icon: <News />,
  },
  {
    title: "Appearance",
    href: "/settings/appearance",
    description: "update and modify global appearance",
    icon: <User />,
  },
  {
    title: "About",
    href: "/settings/about",
    description: "update and modify about page",
    icon: <SupportCenter />,
  },
  {
    title: "Privacy and Policy",
    href: "/settings/privacy-policy",
    description: "Manage your privacy and Policy configuration settings.",
    icon: <SettingsIcon width="41" height="49" className="icon-transition" />,
  },
];
function page() {
  return <ServicesContainer links={links} />;
}

export default page;
