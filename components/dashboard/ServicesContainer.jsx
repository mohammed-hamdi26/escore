import { getTranslations } from "next-intl/server";
import ServiceItem from "./ServiceItem";

async function ServicesContainer({ links }) {
  const t = await getTranslations("Dashboard");

  return (
    <div className="grid lg:grid-rows-2 md:grid-cols-2  xl:grid-cols-4 gap-5 h-full ">
      {links.map((link) => (
        <ServiceItem
          key={link.title}
          title={t(`${link.title}.title`)}
          icon={link.icon}
          href={`/dashboard${link.href}`}
          description={t(`${link.title}.description`)}
        />
      ))}
    </div>
  );
}

export default ServicesContainer;
