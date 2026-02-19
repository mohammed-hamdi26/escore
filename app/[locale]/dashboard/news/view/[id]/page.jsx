import { getNew } from "@/app/[locale]/_Lib/newsApi";
import NewsDetails from "@/components/News/NewsDetails";
import { notFound } from "next/navigation";

async function ViewNewsPage({ params }) {
  const { id } = await params;

  try {
    const news = await getNew(id);

    if (!news) {
      notFound();
    }

    return <NewsDetails news={news} />;
  } catch (error) {
    notFound();
  }
}

export default ViewNewsPage;
