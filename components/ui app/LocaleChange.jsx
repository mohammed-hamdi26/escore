"use client";
import { Link, usePathname } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { Button } from "../ui/button";
import Image from "next/image";
import SaudiImage from "../../public/images/Saudi_Arabia.webp";
import UKImage from "../../public/images/united_kingdom.png";
function LocaleChange() {
  const locale = useLocale();
  const pathname = usePathname();

  const srcImage = locale === "en" ? SaudiImage : UKImage;
  return (
    <Link
      href={pathname}
      locale={locale === "en" ? "ar" : "en"}
      className="cursor-pointer rounded-lg overflow-hidden relative w-12 h-7.5"
    >
      <Image
        fill
        className="object-cover"
        src={srcImage}
        alt={locale === "en" ? "Arabic" : "English"}
      />
    </Link>
  );
}

export default LocaleChange;
