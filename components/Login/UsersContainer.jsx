import { UserCog } from "lucide-react";
import UserItem from "./UserItem";

function UsersContainer() {
  return (
    <ul className="flex flex-col w-[200px] gap-4">
      <UserItem icon={<UserCog />} label={"Admin"} />
      <UserItem icon={<UserCog />} label={"Admin"} />
      <UserItem icon={<UserCog />} label={"Admin"} />
    </ul>
  );
}

export default UsersContainer;
