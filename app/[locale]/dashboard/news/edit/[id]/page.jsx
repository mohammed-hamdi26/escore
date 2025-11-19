import { editNews } from "@/app/[locale]/_Lib/actions";
import { getNew } from "@/app/[locale]/_Lib/newsApi";
import NewsForm from "@/components/News/NewsForm";

async function page({ params }) {
  const { id } = await params;

  const newData = await getNew(id);

  return <NewsForm newData={newData} formType="edit" submit={editNews} />;
}

export default page;
