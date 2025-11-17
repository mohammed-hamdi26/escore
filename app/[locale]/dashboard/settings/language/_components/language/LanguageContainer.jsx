import { getLanguages } from "@/app/[locale]/_Lib/languageAPI";
import LanguagesTable from "./LanguagesTable";
export const dynamic = "force-dynamic";
async function LanguageContainer() {
  const { data: languages } = await getLanguages();
  return <LanguagesTable initialLanguages={languages} />;
}

export default LanguageContainer;
