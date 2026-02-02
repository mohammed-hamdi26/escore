import { redirect } from "next/navigation";

// Redirect to the main teams list page
export default function page() {
  redirect("/dashboard/teams-management");
}
