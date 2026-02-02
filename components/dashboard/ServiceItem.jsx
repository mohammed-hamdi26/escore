import { Link } from "@/i18n/navigation";
import { cloneElement } from "react";

function ServiceItem({ title, icon, href, description }) {
  return (
    <Link
      href={href}
      className="group relative glass rounded-2xl p-6 md:p-8 border border-transparent hover:border-green-primary/30 dark:hover:border-green-primary/50 transition-all duration-300 cursor-pointer overflow-hidden"
    >
      {/* Background gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-primary/0 to-green-primary/0 group-hover:from-green-primary/5 group-hover:to-green-primary/10 dark:group-hover:from-green-primary/10 dark:group-hover:to-green-primary/20 transition-all duration-300" />

      {/* Content */}
      <div className="relative z-10">
        {/* Icon container */}
        <div className="inline-flex items-center justify-center size-12 md:size-14 rounded-xl bg-green-primary/10 dark:bg-green-primary/15 group-hover:bg-green-primary group-hover:glow-green-subtle transition-all duration-300 mb-4">
          {cloneElement(icon, {
            className:
              "size-6 md:size-7 fill-green-primary group-hover:fill-white transition-colors duration-300",
          })}
        </div>

        {/* Title */}
        <h3 className="text-base md:text-lg font-semibold text-foreground group-hover:text-green-primary dark:group-hover:text-white transition-colors duration-300 mb-2">
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300 line-clamp-2">
          {description}
        </p>
      </div>

      {/* Corner accent */}
      <div className="absolute top-0 right-0 rtl:right-auto rtl:left-0 w-16 h-16 bg-gradient-to-bl from-green-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-tr-2xl rtl:rounded-tr-none rtl:rounded-tl-2xl" />
    </Link>
  );
}

export default ServiceItem;
