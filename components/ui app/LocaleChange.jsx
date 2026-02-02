"use client";
import { Link, usePathname } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import Image from "next/image";
import SaudiImage from "../../public/images/Saudi_Arabia.webp";
import UKImage from "../../public/images/united_kingdom.png";
import { Languages } from "lucide-react";

function LocaleChange() {
  const locale = useLocale();
  const pathname = usePathname();

  const isEnglish = locale === "en";
  const srcImage = isEnglish ? SaudiImage : UKImage;
  const altText = isEnglish ? "Switch to Arabic" : "Switch to English";
  const langCode = isEnglish ? "AR" : "EN";

  return (
    <Link
      href={pathname}
      locale={isEnglish ? "ar" : "en"}
      className="group flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-[#1a1d2e] border border-gray-200 dark:border-white/10 hover:border-green-primary/50 transition-all duration-200 hover:shadow-md"
      title={altText}
    >
      {/* Flag */}
      <div className="relative size-6 rounded-full overflow-hidden ring-1 ring-gray-200 dark:ring-white/10 group-hover:ring-green-primary/50 transition-all">
        <Image
          fill
          className="object-cover"
          src={srcImage}
          alt={altText}
        />
      </div>

      {/* Language code */}
      <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 group-hover:text-green-primary transition-colors">
        {langCode}
      </span>
    </Link>
  );
}

export default LocaleChange;
