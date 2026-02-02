import { Link } from "@/i18n/navigation";
import { cloneElement } from "react";

function NavItem({ icon, label, href, isActive, children }) {
  if (children) {
    return <li className="group">{children}</li>;
  }

  return (
    <li className="group relative">
      {/* Active indicator line */}
      {isActive && <div className="nav-active-indicator" />}

      <Link
        href={href}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
          isActive
            ? "nav-item-active"
            : "nav-item-hover"
        }`}
      >
        {/* Icon container */}
        <span
          className={`flex items-center justify-center size-9 rounded-lg transition-all duration-200 ${
            isActive
              ? "bg-green-primary glow-green-subtle"
              : "bg-muted/50 group-hover:bg-green-primary/20"
          }`}
        >
          {cloneElement(icon, {
            className: `size-[18px] transition-colors duration-200 ${
              isActive
                ? "fill-white text-white"
                : "fill-muted-foreground text-muted-foreground group-hover:fill-green-primary group-hover:text-green-primary"
            }`,
          })}
        </span>

        {/* Label */}
        <span
          className={`text-sm font-medium transition-colors duration-200 ${
            isActive
              ? "text-foreground"
              : "text-muted-foreground group-hover:text-foreground"
          }`}
        >
          {label}
        </span>
      </Link>
    </li>
  );
}

export default NavItem;
