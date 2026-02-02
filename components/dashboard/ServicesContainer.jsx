import { getTranslations } from "next-intl/server";
import ServiceItem from "./ServiceItem";
import { LayoutGrid } from "lucide-react";

async function ServicesContainer({ links }) {
  const t = await getTranslations("Dashboard");

  const visibleLinks = links.filter((link) => link.isShowed);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-green-primary/10 flex items-center justify-center">
            <LayoutGrid className="size-5 text-green-primary" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
              {t("title")}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t("subtitle")}
            </p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-white/5 text-sm text-gray-600 dark:text-gray-400">
          <span className="size-2 rounded-full bg-green-primary animate-pulse" />
          {visibleLinks.length} {t("modules")}
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-5">
        {visibleLinks.map((link) => (
          <ServiceItem
            key={link.title}
            title={t(`${link.title}.title`)}
            icon={link.icon}
            href={`/dashboard${link.href}`}
            description={t(`${link.title}.description`)}
          />
        ))}
      </div>
    </div>
  );
}

export default ServicesContainer;
