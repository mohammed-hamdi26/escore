import { getNews } from "@/app/[locale]/_Lib/newsApi";
import { getGames } from "@/app/[locale]/_Lib/gamesApi";
import NewsListRedesign from "@/components/News/NewsListRedesign";
import { NewsListWrapper } from "@/components/News/NewsFormWrapper";
import { getLocale } from "next-intl/server";

export const dynamic = "force-dynamic";

async function NewsPage({ searchParams }) {
  const params = await searchParams;
  const locale = await getLocale();

  // Fetch news with all filters
  const [newsResponse, gamesResponse] = await Promise.all([
    getNews({
      page: params.page || 1,
      limit: params.limit || 10,
      search: params.search,
      game: params.game,
      status: params.status,
      isPublished: params.isPublished,
      isFeatured: params.isFeatured,
      sortBy: params.sortBy || "createdAt",
      sortOrder: params.sortOrder || "desc",
    }),
    getGames({ limit: 100 }),
  ]);

  const news = newsResponse.data || [];
  const pagination = newsResponse.pagination || null;
  const games = gamesResponse.data || [];

  return (
    <NewsListWrapper>
      <NewsListRedesign
        news={news}
        pagination={pagination}
        games={games}
        locale={locale}
      />
    </NewsListWrapper>
  );
}

export default NewsPage;
