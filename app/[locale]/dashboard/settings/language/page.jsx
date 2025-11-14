import { getLanguages } from "@/app/[locale]/_Lib/languageAPI";
import LanguagesTable from "./_components/LanguagesTable";

export const dynamic = "force-dynamic";

export default async function LanguagePage() {
  const { data: languages } = await getLanguages();
  return <LanguagesTable initialLanguages={languages} />;
}
