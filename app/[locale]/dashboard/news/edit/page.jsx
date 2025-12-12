import { getNews } from "@/app/[locale]/_Lib/newsApi";
import NewsListRedesign from "@/components/News/NewsListRedesign";
import { getLocale } from "next-intl/server";

async function page({ searchParams }) {
  const params = await searchParams;
  const locale = await getLocale();

  const newsResponse = await getNews({
    page: params.page || 1,
    limit: params.limit || 10,
    search: params.search,
  });

  const news = newsResponse.data || [];
  const pagination = newsResponse.meta || null;

  return (
    <NewsListRedesign news={news} pagination={pagination} locale={locale} />
  );
}

export default page;
