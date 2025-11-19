import { getNews, getNewsCount } from "@/app/[locale]/_Lib/newsApi";
import NewsTable from "@/components/News/NewsTable";
import Table from "@/components/ui app/Table";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
const columns = [
  { id: "title", header: "title" },
  { id: "Author", header: "Author" },
  { id: "date", header: "Date" },
  // { id: "link", header: "Link" },
];
async function page({ searchParams }) {
  const { size, page } = await searchParams;
  const news = await getNews({ size, page });
  const numOfNews = await getNewsCount();

  return <NewsTable news={news} columns={columns} numOfNews={numOfNews} />;
}
{
  /* <Button
          className={
            "text-white bg-green-primary rounded-full min-w-[100px] cursor-pointer"
          }
        >
          Edit
        </Button> */
}

export default page;
