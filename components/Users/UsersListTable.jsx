"use client";

import { deleteUser, resetUserPassword } from "@/app/[locale]/_Lib/actions";
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
  Key,
  Copy,
  Check,
  MoreHorizontal,
  Eye,
  Heart,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { getImgUrl } from "@/lib/utils";

export default function UsersListTable({ users, meta }) {
  const [isLoading, setIsLoading] = useState(null);
  const [resetResult, setResetResult] = useState(null);
  const [copied, setCopied] = useState(false);
  const t = useTranslations("UsersManagement");

  const getRoleBadge = (role) => {
    const badges = {
      admin: "bg-red-500/10 text-red-500 border-red-500/20",
      content: "bg-purple-500/10 text-purple-500 border-purple-500/20",
      support: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
      user: "bg-gray-500/10 text-gray-500 border-gray-500/20",
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

  const handleResetPassword = async (userId, userEmail) => {
    if (!confirm(t("confirmResetPassword", { email: userEmail }))) return;

    try {
      setIsLoading(`reset-${userId}`);
      const result = await resetUserPassword(userId);
      if (!result.success) {
        toast.error(result.error || t("resetPasswordError"));
        return;
      }
      setResetResult(result.data);
      toast.success(t("passwordReset"));
    } catch (e) {
      toast.error(t("resetPasswordError"));
    } finally {
      setIsLoading(null);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success(t("copied"));
    setTimeout(() => setCopied(false), 2000);
  };

  const closeResetModal = () => {
    setResetResult(null);
    setCopied(false);
  };

  if (!users || users.length === 0) {
    return (
      <div className="bg-white dark:bg-[#0f1118] rounded-xl p-12 border border-gray-200 dark:border-white/5 text-center">
        <div className="size-16 rounded-full bg-gray-100 dark:bg-[#1a1d2e] flex items-center justify-center mx-auto mb-4">
          <UserX className="size-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {t("noUsersTitle") || "No users found"}
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          {t("noUsers") || "Try adjusting your filters"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {users.map((user) => (
          <div
            key={user.id}
            className="bg-white dark:bg-[#0f1118] rounded-xl border border-gray-200 dark:border-white/5 p-4 hover:border-green-primary/30 transition-all duration-200 group"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                {user.avatar?.light ? (
                  <img
                    src={getImgUrl(user.avatar.light)}
                    alt=""
                    className="size-12 rounded-xl object-cover ring-2 ring-gray-100 dark:ring-white/10"
                  />
                ) : (
                  <div className="size-12 rounded-xl bg-gradient-to-br from-green-primary/20 to-green-primary/5 flex items-center justify-center ring-2 ring-gray-100 dark:ring-white/10">
                    <span className="text-green-primary font-bold text-lg">
                      {user.email?.[0]?.toUpperCase() || "U"}
                    </span>
                  </div>
                )}
                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                    {user.firstName && user.lastName
                      ? `${user.firstName} ${user.lastName}`
                      : user.username || t("noName")}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {user.email}
                  </p>
                </div>
              </div>

              {/* Actions Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 text-gray-400 hover:text-gray-600 dark:hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreHorizontal className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link
                      href={`/dashboard/users/${user.id}/edit`}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Edit className="size-4" />
                      {t("edit")}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href={`/dashboard/users/${user.id}/following-teams`}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Heart className="size-4" />
                      {t("followingTeams") || "Following Teams"}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href={`/dashboard/users/${user.id}/following-players`}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Heart className="size-4" />
                      {t("followingPlayers") || "Following Players"}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => handleResetPassword(user.id, user.email)}
                    disabled={isLoading === `reset-${user.id}` || user.role === "admin"}
                    className="flex items-center gap-2 cursor-pointer text-yellow-600 dark:text-yellow-500 focus:text-yellow-600 dark:focus:text-yellow-500"
                  >
                    <Key className="size-4" />
                    {t("resetPassword")}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleDelete(user.id)}
                    disabled={isLoading === user.id || user.role === "admin"}
                    className="flex items-center gap-2 cursor-pointer text-red-600 dark:text-red-500 focus:text-red-600 dark:focus:text-red-500"
                  >
                    <Trash2 className="size-4" />
                    {t("delete")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Info */}
            <div className="space-y-3">
              {/* Role & Status */}
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${getRoleBadge(
                    user.role
                  )}`}
                >
                  <Shield className="size-3" />
                  {t(`roles.${user.role}`)}
                </span>

                {user.isVerified ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-green-500/10 text-green-500 border border-green-500/20">
                    <UserCheck className="size-3" />
                    {t("verified")}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
                    <UserX className="size-3" />
                    {t("unverified")}
                  </span>
                )}

                {user.isDeleted && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-red-500/10 text-red-500 border border-red-500/20">
                    <Trash2 className="size-3" />
                    {t("deleted")}
                  </span>
                )}
              </div>

              {/* Additional Info */}
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-100 dark:border-white/5">
                {user.phone && <span>{user.phone}</span>}
                <span>
                  {t("lastLogin")}:{" "}
                  {user.lastLogin
                    ? new Date(user.lastLogin).toLocaleDateString()
                    : t("never")}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4">
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          {t("showing", {
            from: (meta.page - 1) * meta.limit + 1,
            to: Math.min(meta.page * meta.limit, meta.total),
            total: meta.total,
          })}
        </p>
        <Pagination numPages={meta.totalPages} />
      </div>

      {/* Reset Password Result Modal */}
      {resetResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#0f1118] rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl border border-gray-200 dark:border-white/10">
            <div className="text-center mb-6">
              <div className="size-16 mx-auto mb-4 bg-green-500/10 rounded-2xl flex items-center justify-center">
                <Key className="size-8 text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {t("passwordResetSuccess")}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                {t("passwordResetNote")}
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-[#1a1d2e] rounded-xl p-4">
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">
                  {t("email")}
                </p>
                <p className="text-gray-900 dark:text-white font-medium">
                  {resetResult.email}
                </p>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-500/20 rounded-xl p-4">
                <p className="text-yellow-700 dark:text-yellow-400 text-sm mb-1">
                  {t("newPassword")}
                </p>
                <div className="flex items-center justify-between gap-2">
                  <code className="text-lg font-mono font-bold text-yellow-800 dark:text-yellow-300">
                    {resetResult.newPassword}
                  </code>
                  <button
                    onClick={() => copyToClipboard(resetResult.newPassword)}
                    className="p-2 hover:bg-yellow-100 dark:hover:bg-yellow-500/20 rounded-lg transition-colors"
                    title={t("copy")}
                  >
                    {copied ? (
                      <Check className="size-5 text-green-500" />
                    ) : (
                      <Copy className="size-5 text-yellow-600 dark:text-yellow-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={closeResetModal}
              className="w-full mt-6 bg-green-primary hover:bg-green-primary/90 text-white font-medium py-3 rounded-xl transition-colors"
            >
              {t("close")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
