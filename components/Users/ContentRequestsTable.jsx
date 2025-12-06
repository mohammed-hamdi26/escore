"use client";

import { approveContentRequest, rejectContentRequest } from "@/app/[locale]/_Lib/actions";
import { useTranslations } from "next-intl";
import { useState } from "react";
import toast from "react-hot-toast";
import Pagination from "../ui app/Pagination";
import {
  CheckCircle,
  XCircle,
  Clock,
  UserX,
  Mail,
  Calendar,
} from "lucide-react";

export default function ContentRequestsTable({ requests, meta }) {
  const [isLoading, setIsLoading] = useState(null);
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const t = useTranslations("UsersManagement");

  const handleApprove = async (userId) => {
    try {
      setIsLoading(userId);
      await approveContentRequest(userId);
      toast.success(t("requestApproved"));
    } catch (e) {
      toast.error(t("approveError"));
    } finally {
      setIsLoading(null);
    }
  };

  const handleReject = async (userId) => {
    if (!rejectReason || rejectReason.length < 10) {
      toast.error(t("rejectReasonRequired"));
      return;
    }

    try {
      setIsLoading(userId);
      await rejectContentRequest(userId, rejectReason);
      toast.success(t("requestRejected"));
      setRejectingId(null);
      setRejectReason("");
    } catch (e) {
      toast.error(t("rejectError"));
    } finally {
      setIsLoading(null);
    }
  };

  if (!requests || requests.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800/50 rounded-xl p-8 border border-gray-200 dark:border-gray-700 text-center shadow-sm dark:shadow-none">
        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
        <p className="text-gray-500 dark:text-gray-400">{t("noRequests")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Requests List */}
      <div className="space-y-4">
        {requests.map((request) => (
          <div
            key={request._id || request.id}
            className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm dark:shadow-none"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* User Info */}
              <div className="flex items-center gap-4">
                {request.avatar ? (
                  <img
                    src={request.avatar}
                    alt=""
                    className="w-14 h-14 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                    <span className="text-gray-600 dark:text-gray-300 text-xl font-medium">
                      {request.email?.[0]?.toUpperCase() || "U"}
                    </span>
                  </div>
                )}
                <div>
                  <h3 className="text-gray-900 dark:text-white font-medium text-lg">
                    {request.username || t("noUsername")}
                  </h3>
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
                    <Mail className="w-4 h-4" />
                    {request.email}
                  </div>
                  <div className="flex items-center gap-2 text-gray-400 dark:text-gray-500 text-sm mt-1">
                    <Calendar className="w-4 h-4" />
                    {t("requestedAt")}: {new Date(request.contentRequestedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                  <Clock className="w-4 h-4" />
                  {t("pending")}
                </span>
              </div>
            </div>

            {/* Actions */}
            {rejectingId === (request._id || request.id) ? (
              <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {t("rejectReasonLabel")}
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder={t("rejectReasonPlaceholder")}
                  className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-red-500 min-h-[100px]"
                />
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => handleReject(request._id || request.id)}
                    disabled={isLoading === (request._id || request.id)}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50"
                  >
                    {isLoading === (request._id || request.id) ? t("rejecting") : t("confirmReject")}
                  </button>
                  <button
                    onClick={() => {
                      setRejectingId(null);
                      setRejectReason("");
                    }}
                    className="px-4 py-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-800 dark:text-white rounded-lg transition-colors"
                  >
                    {t("cancel")}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex gap-3 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => handleApprove(request._id || request.id)}
                  disabled={isLoading === (request._id || request.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  <CheckCircle className="w-5 h-5" />
                  {isLoading === (request._id || request.id) ? t("approving") : t("approve")}
                </button>
                <button
                  onClick={() => setRejectingId(request._id || request.id)}
                  disabled={isLoading === (request._id || request.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors disabled:opacity-50"
                >
                  <XCircle className="w-5 h-5" />
                  {t("reject")}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pagination */}
      {meta.totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination numPages={meta.totalPages} />
        </div>
      )}
    </div>
  );
}
