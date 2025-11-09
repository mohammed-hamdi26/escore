import { getNews } from "@/app/[locale]/_Lib/newsApi";
import Table from "@/components/ui app/Table";
import { Button } from "@/components/ui/button";
const columns = [
  { id: "title", header: "title " },
  { id: "Author", header: "Author" },
  { id: "date", header: "Date" },
  { id: "link", header: "Link" },
];
async function page() {
  const news = await getNews();

  return (
    <Table
      // showHeader={false}
      data={news}
      grid_cols={"grid-cols-[0.5fr_0.5fr_0.5fr_0.5fr_2fr]"}
      columns={columns}
    >
      {news.map((newsItem) => (
        <Table.Row
          grid_cols={"grid-cols-[0.5fr_0.5fr_0.5fr_0.5fr_2fr]"}
          key={newsItem.id}
        >
          <Table.Cell>{newsItem.title}</Table.Cell>
          <Table.Cell>{newsItem.authorName}</Table.Cell>
          <Table.Cell>{newsItem.publishDate}</Table.Cell>
        </Table.Row>
      ))}
    </Table>
  );
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
