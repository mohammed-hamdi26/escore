"use client";
import { deleteNew } from "@/app/[locale]/_Lib/actions";
import { getNews } from "@/app/[locale]/_Lib/newsApi";

import Table from "@/components/ui app/Table";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { format } from "date-fns";
import { useTranslations } from "next-intl";
import { useState } from "react";
import toast from "react-hot-toast";
import NewFilter from "./NewFilter";
import Pagination from "../ui app/Pagination";
import { useSearchParams } from "next/navigation";
import { getFirst10Words, getNumPages } from "@/app/[locale]/_Lib/helps";
function NewsTable({ news, columns, numOfNews }) {
  const t = useTranslations("NewsTable");
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const numPages = getNumPages(numOfNews, Number(searchParams.get("size")));

  console.log(news);

  return (
    <div className="space-y-8">
      <NewFilter numOfSize={numOfNews} />
      <Table
        // showHeader={false}
        t={t}
        data={news}
        grid_cols={"grid-cols-[0.5fr_0.5fr_0.5fr_0.5fr_2fr]"}
        columns={columns}
      >
        {news.map((newsItem) => (
          <Table.Row
            grid_cols={"grid-cols-[0.5fr_0.5fr_0.5fr_0.5fr_2fr]"}
            key={newsItem.id}
          >
            <Table.Cell>{getFirst10Words(newsItem.title)}</Table.Cell>
            <Table.Cell>{newsItem.authorName}</Table.Cell>
            <Table.Cell>
              {newsItem.publishedAt &&
                format(newsItem.publishedAt, "yyyy-MM-dd")}
            </Table.Cell>
            <Table.Cell></Table.Cell>
            <Table.Cell className="flex gap-4 justify-end">
              <Link href={`/dashboard/news/edit/${newsItem.id}`}>
                <Button
                  disabled={isLoading}
                  className={
                    "text-white bg-green-primary rounded-full min-w-[100px] cursor-pointer disabled:cursor-not-allowed"
                  }
                >
                  {t("Edit")}
                </Button>
              </Link>
              <Button
                disabled={isLoading}
                className={
                  "text-white bg-[#3A469D] rounded-full min-w-[100px] cursor-pointer disabled:cursor-not-allowed"
                }
                onClick={async () => {
                  try {
                    setIsLoading(true);
                    await deleteNew(newsItem.id);
                    toast.success("The New is Deleted");
                  } catch (e) {
                    toast.error("error in Delete");
                  } finally {
                    setIsLoading(false);
                  }
                }}
              >
                {t("Delete")}
              </Button>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table>
      <Pagination numPages={numPages} />
    </div>
  );
}

export default NewsTable;
