import { getLanguages } from "@/app/[locale]/_Lib/languageAPI";
import LanguagesTable from "./languages-table";
async function LanguageContainer() {
  const { data: languages } = await getLanguages();

  return <LanguagesTable initialLanguages={languages} />;
  return <div></div>;
}

export default LanguageContainer;
