import { getNews, getNewsStats } from "@/app/[locale]/_Lib/newsApi";
import { getGames } from "@/app/[locale]/_Lib/gamesApi";
import NewsListRedesign from "@/components/News/NewsListRedesign";
import { getLocale } from "next-intl/server";

async function page({ searchParams }) {
  const params = await searchParams;
  const locale = await getLocale();

  const [newsResponse, stats, gamesOptions] = await Promise.all([
    getNews({
      page: params.page || 1,
      limit: params.limit || 10,
      search: params.search,
      category: params.category,
      game: params.game,
      isFeatured: params.isFeatured,
      isPinned: params.isPinned,
    }),
    getNewsStats(),
    getGames(),
  ]);

  const news = newsResponse.data || [];
  const pagination = newsResponse.pagination || null;

  return (
    <NewsListRedesign
      news={news}
      pagination={pagination}
      stats={stats}
      gamesOptions={gamesOptions}
      locale={locale}
    />
  );
}

export default page;
