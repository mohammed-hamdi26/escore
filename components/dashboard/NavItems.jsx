import NavItem from "./NavItem";
import SettingsIcon from "./SettingsIcon";

const pages = [
  {
    icon: <SettingsIcon />,
    title: "Settings",
    href: "/dashboard/settings",
  },
];
function NavItems() {
  return (
    <ul className="w-[140px] mx-auto">
      {pages.map((page) => (
        <NavItem
          key={page.title}
          icon={page.icon}
          label={page.title}
          href={page.href}
        />
      ))}
    </ul>
  );
}

export default NavItems;
