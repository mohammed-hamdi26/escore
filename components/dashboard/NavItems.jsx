"use client";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();
  return (
    <ul className="w-[140px] mx-auto">
      {pages.map((page) => (
        <NavItem
          isActive={pathname === page.href}
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
