import { getNew } from "@/app/[locale]/_Lib/newsApi";
import NewsDetails from "@/components/News Management/NewsDetails";

async function ViewNewsPage({ params }) {
  const { id } = await params;

  const news = await getNew(id);

  return <NewsDetails news={news} />;
}

export default ViewNewsPage;
