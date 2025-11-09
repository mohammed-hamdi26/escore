import { addNews } from "@/app/[locale]/_Lib/actions";
import NewsForm from "@/components/News/NewsForm";

function page() {
  return <NewsForm submit={addNews} />;
}

export default page;
