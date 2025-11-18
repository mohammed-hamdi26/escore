import { getAllThemes } from "@/app/[locale]/_Lib/themesApi";
import ThemesTable from './themes-table';

async function ThemesContainer() {
  const { data: themes } = await getAllThemes();
  return <ThemesTable initialThemes={themes} />;
}

export default ThemesContainer;
