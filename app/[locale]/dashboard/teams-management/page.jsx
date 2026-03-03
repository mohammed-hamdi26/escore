import { redirect } from "next/navigation";

export default async function TeamsPage({ params }) {
  const { locale } = await params;
  redirect(`/${locale}/dashboard/clubs-management`);
}
