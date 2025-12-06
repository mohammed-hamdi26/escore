import { getAdminStats } from "../../_Lib/usersApi";
import { getTranslations } from "next-intl/server";
import {
  Users,
  UserCheck,
  UserX,
  Shield,
  Clock,
  CheckCircle,
  XCircle,
  Trash2,
} from "lucide-react";

export default async function UsersDashboardPage() {
  const stats = await getAdminStats();
  const t = await getTranslations("UsersManagement");

  const userStats = [
    {
      label: t("stats.totalUsers"),
      value: stats.users.total,
      icon: Users,
      color: "bg-blue-500/10 text-blue-500",
      iconBg: "bg-blue-500/20",
    },
    {
      label: t("stats.verified"),
      value: stats.users.verified,
      icon: UserCheck,
      color: "bg-green-500/10 text-green-500",
      iconBg: "bg-green-500/20",
    },
    {
      label: t("stats.unverified"),
      value: stats.users.unverified,
      icon: UserX,
      color: "bg-yellow-500/10 text-yellow-500",
      iconBg: "bg-yellow-500/20",
    },
    {
      label: t("stats.deleted"),
      value: stats.users.deleted,
      icon: Trash2,
      color: "bg-red-500/10 text-red-500",
      iconBg: "bg-red-500/20",
    },
  ];

  const roleStats = [
    {
      label: t("roles.user"),
      value: stats.users.byRole.user,
      color: "text-gray-400",
    },
    {
      label: t("roles.admin"),
      value: stats.users.byRole.admin,
      color: "text-red-400",
    },
    {
      label: t("roles.content"),
      value: stats.users.byRole.content,
      color: "text-purple-400",
    },
    {
      label: t("roles.support"),
      value: stats.users.byRole.support,
      color: "text-cyan-400",
    },
  ];

  const contentRequestStats = [
    {
      label: t("contentRequests.pending"),
      value: stats.contentRequests.pending,
      icon: Clock,
      color: "text-yellow-500",
    },
    {
      label: t("contentRequests.approved"),
      value: stats.contentRequests.approved,
      icon: CheckCircle,
      color: "text-green-500",
    },
    {
      label: t("contentRequests.rejected"),
      value: stats.contentRequests.rejected,
      icon: XCircle,
      color: "text-red-500",
    },
  ];

  return (
    <div className="space-y-8">
      {/* User Statistics */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">
          {t("stats.userStats")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {userStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className={`${stat.color} rounded-xl p-6 border border-gray-700/50`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">{stat.label}</p>
                    <p className="text-3xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className={`${stat.iconBg} p-3 rounded-lg`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Role Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-primary" />
            {t("stats.roleDistribution")}
          </h3>
          <div className="space-y-4">
            {roleStats.map((role, index) => {
              const percentage =
                stats.users.total > 0
                  ? Math.round((role.value / stats.users.total) * 100)
                  : 0;
              return (
                <div key={index}>
                  <div className="flex justify-between items-center mb-1">
                    <span className={`${role.color} font-medium`}>
                      {role.label}
                    </span>
                    <span className="text-gray-400">
                      {role.value} ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        role.color.replace("text-", "bg-").replace("-400", "-500")
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Content Creator Requests */}
        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-green-primary" />
            {t("stats.contentRequestsStats")}
          </h3>
          <div className="grid grid-cols-3 gap-4">
            {contentRequestStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="bg-gray-700/50 rounded-lg p-4 text-center"
                >
                  <Icon className={`w-8 h-8 ${stat.color} mx-auto mb-2`} />
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-gray-400 text-sm">{stat.label}</p>
                </div>
              );
            })}
          </div>
          {stats.contentRequests.pending > 0 && (
            <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <p className="text-yellow-500 text-sm">
                {t("stats.pendingRequestsNote", {
                  count: stats.contentRequests.pending,
                })}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
