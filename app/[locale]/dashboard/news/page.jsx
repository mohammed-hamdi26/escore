import { getNews } from "@/app/[locale]/_Lib/newsApi";
import { getGames } from "@/app/[locale]/_Lib/gamesApi";
import NewsTable from "@/components/News Management/NewsTable";

async function NewsPage({ searchParams }) {
  const {
    size,
    page,
    search,
    category,
    game,
    isPublished,
    isFeatured,
    isPinned,
    sortBy,
    sortOrder
  } = await searchParams;

  // Fetch news and games in parallel
  const [newsResult, gamesResult] = await Promise.all([
    getNews({
      limit: size || 10,
      page: page || 1,
      search,
      category,
      game,
      isPublished,
      isFeatured,
      isPinned,
      sortBy: sortBy || "createdAt",
      sortOrder: sortOrder || "desc",
    }),
    getGames({ limit: 100 }),
  ]);

  const { data: news, pagination } = newsResult;
  const games = gamesResult?.data || [];

  return (
    <NewsTable
      news={news || []}
      pagination={pagination}
      games={games}
    />
  );
}

export default NewsPage;
