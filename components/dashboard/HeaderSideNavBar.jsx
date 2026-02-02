import { Shield, User, Newspaper, HeadphonesIcon } from "lucide-react";

const roleConfig = {
  admin: { color: "text-red-400", bgColor: "bg-red-400/10", icon: Shield },
  content: { color: "text-purple-400", bgColor: "bg-purple-400/10", icon: Newspaper },
  support: { color: "text-cyan-400", bgColor: "bg-cyan-400/10", icon: HeadphonesIcon },
  user: { color: "text-gray-400", bgColor: "bg-gray-400/10", icon: User },
};

function HeaderSideNavBar({ user, t }) {
  const role = user?.role || "user";
  const { color, bgColor, icon: RoleIcon } = roleConfig[role] || roleConfig.user;

  return (
    <div className="flex flex-col items-center text-center gap-3">
      {/* Avatar with glow ring */}
      <div className="relative">
        <div className="size-16 overflow-hidden rounded-full avatar-ring">
          {(user?.avatar?.light || user?.avatar?.dark) ? (
            <img
              alt="avatar"
              src={user?.avatar?.light || user?.avatar?.dark}
              className="w-full h-full object-cover object-center"
            />
          ) : (
            <div className="w-full h-full bg-green-primary/20 flex items-center justify-center">
              <User className="size-8 text-green-primary" />
            </div>
          )}
        </div>
      </div>

      {/* User Info */}
      <div className="space-y-1">
        <h3 className="text-base font-semibold text-foreground capitalize">
          {user?.firstName} {user?.lastName}
        </h3>

        {/* Role Badge */}
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${color} ${bgColor}`}
        >
          <RoleIcon className="size-3" />
          {t(role)}
        </span>
      </div>
    </div>
  );
}

export default HeaderSideNavBar;
