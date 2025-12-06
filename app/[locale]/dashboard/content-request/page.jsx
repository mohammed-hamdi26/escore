import { getContentStatus } from "../../_Lib/actions";
import { getLoginUser } from "../../_Lib/usersApi";
import ContentRequestForm from "@/components/content-request/ContentRequestForm";
import { redirect } from "next/navigation";

export default async function ContentRequestPage() {
  const user = await getLoginUser();

  // Redirect admins - they don't need to request
  if (user?.role === "admin") {
    redirect("/dashboard");
  }

  let contentStatus = null;
  try {
    contentStatus = await getContentStatus();
  } catch (error) {
    console.error("Error fetching content status:", error);
  }

  return (
    <div className="max-w-4xl mx-auto">
      <ContentRequestForm user={user} contentStatus={contentStatus} />
    </div>
  );
}
