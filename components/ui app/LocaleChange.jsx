"use client";
import { Link, usePathname } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import Image from "next/image";
import SaudiImage from "../../public/images/Saudi_Arabia.webp";
import UKImage from "../../public/images/united_kingdom.png";

function LocaleChange() {
  const locale = useLocale();
  const pathname = usePathname();

  const srcImage = locale === "en" ? SaudiImage : UKImage;
  const altText = locale === "en" ? "Switch to Arabic" : "Switch to English";

  return (
    <Link
      href={pathname}
      locale={locale === "en" ? "ar" : "en"}
      className="relative w-10 h-7 rounded-md overflow-hidden ring-1 ring-border hover:ring-green-primary/50 transition-all duration-200 hover:scale-105"
      title={altText}
    >
      <Image
        fill
        className="object-cover"
        src={srcImage}
        alt={altText}
      />
    </Link>
  );
}

export default LocaleChange;
