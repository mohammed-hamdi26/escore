import { editUser } from "@/app/[locale]/_Lib/actions";
import { getUser } from "@/app/[locale]/_Lib/usersApi";
import UserForm from "@/components/user-management/UserForm";

async function page({ params }) {
  const { userId } = params;
  const user = await getUser(userId);
  return <UserForm user={user} formType="edit" submit={editUser} />;
}

export default page;
