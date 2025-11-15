import { getAllThemes } from "@/app/[locale]/_Lib/themesApi";
import ThemesTable from "./_components/themes-table";

async function ApperancePage() {
  const { data: themes } = await getAllThemes();
  console.log(themes);
  return <ThemesTable initialThemes={themes} />;
}

export default ApperancePage;
