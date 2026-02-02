import { Link } from "@/i18n/navigation";
import { cloneElement } from "react";
import { ArrowUpRight } from "lucide-react";

function ServiceItem({ title, icon, href, description }) {
  return (
    <Link
      href={href}
      className="group relative bg-white dark:bg-[#0f1118] rounded-2xl p-6 md:p-8 border border-gray-200 dark:border-white/5 hover:border-green-primary/30 dark:hover:border-green-primary/50 transition-all duration-300 cursor-pointer overflow-hidden shadow-sm hover:shadow-lg dark:shadow-none"
    >
      {/* Background gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-primary/0 to-green-primary/0 group-hover:from-green-primary/5 group-hover:to-green-primary/10 dark:group-hover:from-green-primary/10 dark:group-hover:to-green-primary/20 transition-all duration-300" />

      {/* Content */}
      <div className="relative z-10">
        {/* Top row with icon and arrow */}
        <div className="flex items-start justify-between mb-4">
          {/* Icon container */}
          <div className="inline-flex items-center justify-center size-14 md:size-16 rounded-2xl bg-green-primary/10 group-hover:bg-green-primary group-hover:shadow-lg group-hover:shadow-green-primary/30 transition-all duration-300">
            {cloneElement(icon, {
              className:
                "size-7 md:size-8 fill-green-primary group-hover:fill-white transition-colors duration-300",
            })}
          </div>

          {/* Arrow indicator */}
          <div className="size-8 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center group-hover:bg-green-primary/10 dark:group-hover:bg-green-primary/20 transition-all duration-300">
            <ArrowUpRight className="size-4 text-gray-400 dark:text-gray-500 group-hover:text-green-primary transition-colors duration-300 rtl:-rotate-90" />
          </div>
        </div>

        {/* Title */}
        <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white group-hover:text-green-primary dark:group-hover:text-green-primary transition-colors duration-300 mb-2">
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300 line-clamp-2">
          {description}
        </p>
      </div>

      {/* Corner accent */}
      <div className="absolute top-0 right-0 rtl:right-auto rtl:left-0 w-20 h-20 bg-gradient-to-bl from-green-primary/5 dark:from-green-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-tr-2xl rtl:rounded-tr-none rtl:rounded-tl-2xl" />

      {/* Bottom line accent */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-green-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </Link>
  );
}

export default ServiceItem;
