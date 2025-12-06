import Image from "next/image";
import avatar from "@/public/images/dashboard/avatar.jpg";
import { Shield, User, Newspaper, HeadphonesIcon } from "lucide-react";

const roleConfig = {
  admin: { color: "text-red-400", icon: Shield },
  content: { color: "text-purple-400", icon: Newspaper },
  support: { color: "text-cyan-400", icon: HeadphonesIcon },
  user: { color: "text-gray-400", icon: User },
};

function HeaderSideNavBar({ user, t }) {
  const role = user?.role || "user";
  const { color, icon: RoleIcon } = roleConfig[role] || roleConfig.user;

  return (
    <div className="flex justify-center gap-4 mb-10 ">
      <div className="size-12 overflow-hidden rounded-full relative">
        {(user?.avatar?.light || user?.avatar?.dark) && (
          <img
            alt="avatar"
            src={user?.avatar?.light || user?.avatar?.dark}
            fill
            className="object-cover object-center"
          />
        )}{" "}
      </div>
      <div className="text-white capitalize">
        <h3 className="text-lg text-[#677185] dark:text-white font-bold ">
          {user?.firstName} {user?.lastName}
        </h3>
        <p className={`text-sm flex items-center gap-1.5 ${color}`}>
          <RoleIcon className="size-3.5" />
          {t(role)}
        </p>
      </div>
    </div>
  );
}

export default HeaderSideNavBar;
