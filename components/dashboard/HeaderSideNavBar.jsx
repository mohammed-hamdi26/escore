import { Shield, User, Newspaper, HeadphonesIcon } from "lucide-react";

const roleConfig = {
  admin: {
    color: "text-red-600 dark:text-red-400",
    bgColor: "bg-red-100 dark:bg-red-400/10",
    icon: Shield
  },
  content: {
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-100 dark:bg-purple-400/10",
    icon: Newspaper
  },
  support: {
    color: "text-cyan-600 dark:text-cyan-400",
    bgColor: "bg-cyan-100 dark:bg-cyan-400/10",
    icon: HeadphonesIcon
  },
  user: {
    color: "text-gray-600 dark:text-gray-400",
    bgColor: "bg-gray-100 dark:bg-gray-400/10",
    icon: User
  },
};

function HeaderSideNavBar({ user, t }) {
  const role = user?.role || "user";
  const { color, bgColor, icon: RoleIcon } = roleConfig[role] || roleConfig.user;

  return (
    <div className="flex flex-col items-center text-center gap-3">
      {/* Avatar with glow ring */}
      <div className="relative">
        <div className="size-16 overflow-hidden rounded-full ring-2 ring-green-primary/30 ring-offset-2 ring-offset-white dark:ring-offset-[#0f1118]">
          {(user?.avatar?.light || user?.avatar?.dark) ? (
            <img
              alt="avatar"
              src={user?.avatar?.light || user?.avatar?.dark}
              className="w-full h-full object-cover object-center"
            />
          ) : (
            <div className="w-full h-full bg-green-primary/10 dark:bg-green-primary/20 flex items-center justify-center">
              <User className="size-8 text-green-primary" />
            </div>
          )}
        </div>
        {/* Online status indicator */}
        <span className="absolute bottom-0 right-0 size-4 bg-green-500 rounded-full ring-2 ring-white dark:ring-[#0f1118]" />
      </div>

      {/* User Info */}
      <div className="space-y-1.5">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white capitalize">
          {user?.firstName} {user?.lastName}
        </h3>

        {/* Role Badge */}
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${color} ${bgColor}`}
        >
          <RoleIcon className="size-3" />
          {t(role)}
        </span>
      </div>
    </div>
  );
}

export default HeaderSideNavBar;
