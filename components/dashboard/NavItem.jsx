import { Link } from "@/i18n/navigation";
import { cloneElement } from "react";

function NavItem({ icon, label, href, isActive, children }) {
  if (children) {
    return <li className="group">{children}</li>;
  }

  return (
    <li className="group relative">
      {/* Active indicator line */}
      {isActive && (
        <div className="absolute left-0 rtl:left-auto rtl:right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-green-primary rounded-r-full rtl:rounded-r-none rtl:rounded-l-full" />
      )}

      <Link
        href={href}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
          isActive
            ? "bg-green-primary/10 dark:bg-green-primary/10"
            : "hover:bg-gray-100 dark:hover:bg-white/5"
        }`}
      >
        {/* Icon container */}
        <span
          className={`flex items-center justify-center size-9 rounded-lg transition-all duration-200 ${
            isActive
              ? "bg-green-primary shadow-lg shadow-green-primary/30"
              : "bg-gray-100 dark:bg-white/5 group-hover:bg-green-primary/20"
          }`}
        >
          {cloneElement(icon, {
            className: `size-[18px] transition-colors duration-200 ${
              isActive
                ? "fill-white text-white"
                : "fill-gray-500 dark:fill-gray-400 text-gray-500 dark:text-gray-400 group-hover:fill-green-primary group-hover:text-green-primary"
            }`,
          })}
        </span>

        {/* Label */}
        <span
          className={`text-sm font-medium transition-colors duration-200 ${
            isActive
              ? "text-gray-900 dark:text-white"
              : "text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
          }`}
        >
          {label}
        </span>
      </Link>
    </li>
  );
}

export default NavItem;
