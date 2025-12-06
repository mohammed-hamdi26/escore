"use client";

import { deleteUser, updateUser } from "@/app/[locale]/_Lib/actions";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import toast from "react-hot-toast";
import Pagination from "../ui app/Pagination";
import {
  Edit,
  Trash2,
  Shield,
  UserCheck,
  UserX,
  MoreVertical,
  Eye,
  Key,
} from "lucide-react";

export default function UsersListTable({ users, meta }) {
  const [isLoading, setIsLoading] = useState(null);
  const t = useTranslations("UsersManagement");

  const getRoleBadge = (role) => {
    const badges = {
      admin: "bg-red-500/20 text-red-400 border-red-500/30",
      content: "bg-purple-500/20 text-purple-400 border-purple-500/30",
      support: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
      user: "bg-gray-500/20 text-gray-400 border-gray-500/30",
    };
    return badges[role] || badges.user;
  };

  const handleDelete = async (userId) => {
    if (!confirm(t("confirmDelete"))) return;

    try {
      setIsLoading(userId);
      await deleteUser(userId);
      toast.success(t("userDeleted"));
    } catch (e) {
      toast.error(t("deleteError"));
    } finally {
      setIsLoading(null);
    }
  };

  if (!users || users.length === 0) {
    return (
      <div className="bg-gray-800/50 rounded-xl p-8 border border-gray-700 text-center">
        <UserX className="w-12 h-12 text-gray-500 mx-auto mb-4" />
        <p className="text-gray-400">{t("noUsers")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Table */}
      <div className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left px-4 py-3 text-gray-400 font-medium">
                {t("table.user")}
              </th>
              <th className="text-left px-4 py-3 text-gray-400 font-medium">
                {t("table.email")}
              </th>
              <th className="text-left px-4 py-3 text-gray-400 font-medium">
                {t("table.role")}
              </th>
              <th className="text-left px-4 py-3 text-gray-400 font-medium">
                {t("table.status")}
              </th>
              <th className="text-left px-4 py-3 text-gray-400 font-medium">
                {t("table.lastLogin")}
              </th>
              <th className="text-right px-4 py-3 text-gray-400 font-medium">
                {t("table.actions")}
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors"
              >
                {/* User Info */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {user.avatar?.light ? (
                      <img
                        src={user.avatar.light}
                        alt=""
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
                        <span className="text-gray-300 font-medium">
                          {user.email?.[0]?.toUpperCase() || "U"}
                        </span>
                      </div>
                    )}
                    <div>
                      <p className="text-white font-medium">
                        {user.firstName && user.lastName
                          ? `${user.firstName} ${user.lastName}`
                          : user.username || t("noName")}
                      </p>
                      {user.phone && (
                        <p className="text-gray-500 text-sm">{user.phone}</p>
                      )}
                    </div>
                  </div>
                </td>

                {/* Email */}
                <td className="px-4 py-3">
                  <span className="text-gray-300">{user.email}</span>
                </td>

                {/* Role */}
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getRoleBadge(
                      user.role
                    )}`}
                  >
                    <Shield className="w-3 h-3" />
                    {t(`roles.${user.role}`)}
                  </span>
                </td>

                {/* Status */}
                <td className="px-4 py-3">
                  <div className="flex flex-col gap-1">
                    {user.isVerified ? (
                      <span className="inline-flex items-center gap-1 text-green-400 text-sm">
                        <UserCheck className="w-4 h-4" />
                        {t("verified")}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-yellow-400 text-sm">
                        <UserX className="w-4 h-4" />
                        {t("unverified")}
                      </span>
                    )}
                    {user.isDeleted && (
                      <span className="inline-flex items-center gap-1 text-red-400 text-sm">
                        <Trash2 className="w-4 h-4" />
                        {t("deleted")}
                      </span>
                    )}
                  </div>
                </td>

                {/* Last Login */}
                <td className="px-4 py-3">
                  <span className="text-gray-400 text-sm">
                    {user.lastLogin
                      ? new Date(user.lastLogin).toLocaleDateString()
                      : t("never")}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/dashboard/users/${user.id}/edit`}>
                      <button
                        className="p-2 text-gray-400 hover:text-green-primary hover:bg-green-primary/10 rounded-lg transition-colors"
                        title={t("edit")}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </Link>

                    <button
                      onClick={() => handleDelete(user.id)}
                      disabled={isLoading === user.id || user.role === "admin"}
                      className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title={t("delete")}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center">
        <p className="text-gray-400 text-sm">
          {t("showing", {
            from: (meta.currentPage - 1) * meta.limit + 1,
            to: Math.min(meta.currentPage * meta.limit, meta.total),
            total: meta.total,
          })}
        </p>
        <Pagination numPages={meta.totalPages} />
      </div>
    </div>
  );
}
