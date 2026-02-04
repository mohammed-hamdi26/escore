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
        <div className="absolute left-0 rtl:left-auto rtl:right-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-green-primary rounded-r-full rtl:rounded-r-none rtl:rounded-l-full" />
      )}

      <Link
        href={href}
        className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all duration-200 ${
          isActive
            ? "bg-green-primary/10 dark:bg-green-primary/15"
            : "hover:bg-gray-50 dark:hover:bg-white/5"
        }`}
      >
        {/* Icon */}
        <span
          className={`flex items-center justify-center size-7 rounded-md transition-all duration-200 ${
            isActive
              ? "bg-green-primary text-white shadow-sm shadow-green-primary/25"
              : "text-gray-500 dark:text-gray-400 group-hover:text-green-primary"
          }`}
        >
          {cloneElement(icon, {
            className: `size-4 transition-colors duration-200 ${
              isActive
                ? "text-white"
                : "text-inherit"
            }`,
          })}
        </span>

        {/* Label */}
        <span
          className={`text-[13px] font-medium transition-colors duration-200 ${
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
