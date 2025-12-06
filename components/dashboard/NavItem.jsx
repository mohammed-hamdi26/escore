import { Link } from "@/i18n/navigation";
import { cloneElement } from "react";

function NavItem({ icon, label, href, isActive, children }) {
  return (
    <li className="group">
      {children ? (
        children
      ) : (
        <Link href={href} className="flex items-center gap-2  rounded-full  ">
          <span
            className={`px-2.5 py-2.5 rounded-lg ${
              isActive ? "bg-green-primary" : "bg-[#262C3D33]"
            } group-hover:bg-green-primary transition-colors duration-500`}
          >
            {cloneElement(icon, {
              className: `${
                isActive ? "fill-white" : "fill-[#667085]"
              } group-hover:fill-white transition-colors duration-500`,
            })}
          </span>{" "}
          <p
            className={`text-lg font-semibold ${
              isActive ? "text-[#677185] dark:text-white" : "text-[#667085]"
            } dark:group-hover:text-white transition-colors duration-500 `}
          >
            {label}
          </p>
        </Link>
      )}
    </li>
  );
}

export default NavItem;
