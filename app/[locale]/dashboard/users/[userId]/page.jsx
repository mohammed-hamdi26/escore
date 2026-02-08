import { redirect } from "next/navigation";

async function page({ params }) {
  const { locale, userId } = await params;
  redirect(`/${locale}/dashboard/users/list`);
}

export default page;
