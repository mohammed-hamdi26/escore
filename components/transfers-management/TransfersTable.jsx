"use client";
import { Link } from "@/i18n/navigation";
import { format } from "date-fns";
import { Button } from "../ui/button";
import { useState } from "react";
import { useTranslations } from "next-intl";
import Pagination from "../ui app/Pagination";
import { deleteTransfer } from "@/app/[locale]/_Lib/actions";
import toast from "react-hot-toast";
import { FeaturedBadge } from "./TransfersBadges";
import TransferDetailsModal from "./TransferDetailsModal";
import TransfersFilter from "./TransfersFilter";
import { Eye, Trash2, Edit, ArrowRight } from "lucide-react";
import Image from "next/image";

export default function TransfersTable({ transfers, pagination, games = [] }) {
  const [deletingId, setDeletingId] = useState(null);
  const [selectedTransferId, setSelectedTransferId] = useState(null);
  const t = useTranslations("TransfersManagement");
  const numPages = pagination?.totalPages || 1;

  const handleDelete = async (id) => {
    if (!confirm(t("Are you sure you want to delete this transfer?"))) return;

    setDeletingId(id);
    const result = await deleteTransfer(id);
    if (result.success) {
      toast.success(t("Transfer deleted successfully"));
    } else {
      toast.error(result.error || t("Failed to delete transfer"));
    }
    setDeletingId(null);
  };

  const formatFee = (fee, currency = "USD") => {
    if (!fee) return "-";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      maximumFractionDigits: 0,
    }).format(fee);
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <TransfersFilter games={games} />

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-4 py-3 text-start text-sm font-medium text-gray-600 dark:text-gray-300">
                  {t("Player")}
                </th>
                <th className="px-4 py-3 text-start text-sm font-medium text-gray-600 dark:text-gray-300">
                  {t("Transfer")}
                </th>
                <th className="px-4 py-3 text-start text-sm font-medium text-gray-600 dark:text-gray-300">
                  {t("Fee")}
                </th>
                <th className="px-4 py-3 text-start text-sm font-medium text-gray-600 dark:text-gray-300">
                  {t("Date")}
                </th>
                <th className="px-4 py-3 text-end text-sm font-medium text-gray-600 dark:text-gray-300">
                  {t("Actions")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {transfers.length > 0 ? (
                transfers.map((transfer) => (
                  <tr
                    key={transfer.id || transfer._id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    {/* Player */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {transfer.player?.photo && (
                          <img
                            src={
                              transfer.player.photo.light ||
                              transfer.player.photo
                            }
                            alt={transfer.player.nickname || "Player"}
                            width={36}
                            height={36}
                            className="rounded-full object-cover"
                          />
                        )}
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white text-sm">
                            {transfer.player?.nickname || "-"}
                          </p>
                          {transfer.game?.name && (
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {transfer.game.name}
                            </p>
                          )}
                        </div>
                        {transfer.isFeatured && <FeaturedBadge t={t} />}
                      </div>
                    </td>

                    {/* Teams */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {/* From Team */}
                        <div className="flex items-center gap-1">
                          {transfer.fromTeam?.logo && (
                            <img
                              src={
                                transfer.fromTeam.logo.light ||
                                transfer.fromTeam.logo
                              }
                              alt={transfer.fromTeam.name}
                              width={24}
                              height={24}
                              className="rounded object-contain dark:hidden"
                            />
                          )}
                          {transfer.fromTeam?.logo?.dark && (
                            <img
                              src={transfer.fromTeam.logo.dark}
                              alt={transfer.fromTeam.name}
                              width={24}
                              height={24}
                              className="rounded object-contain hidden dark:block"
                            />
                          )}
                          <span className="text-sm text-gray-700 dark:text-gray-300 max-w-[80px] truncate">
                            {transfer.fromTeam?.name || t("Free Agent")}
                          </span>
                        </div>

                        <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0" />

                        {/* To Team */}
                        <div className="flex items-center gap-1">
                          {transfer.toTeam?.logo && (
                            <img
                              src={
                                transfer.toTeam.logo.light ||
                                transfer.toTeam.logo
                              }
                              alt={transfer.toTeam.name}
                              width={24}
                              height={24}
                              className="rounded object-contain dark:hidden"
                            />
                          )}
                          {transfer.toTeam?.logo?.dark && (
                            <img
                              src={transfer.toTeam.logo.dark}
                              alt={transfer.toTeam.name}
                              width={24}
                              height={24}
                              className="rounded object-contain hidden dark:block"
                            />
                          )}
                          <span className="text-sm text-gray-700 dark:text-gray-300 max-w-[80px] truncate">
                            {transfer.toTeam?.name || "-"}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Fee */}
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {formatFee(transfer.fee, transfer.currency)}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {transfer.transferDate
                          ? format(
                              new Date(transfer.transferDate),
                              "yyyy-MM-dd"
                            )
                          : "-"}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            setSelectedTransferId(transfer.id || transfer._id)
                          }
                          className="flex items-center text-black dark:text-white gap-1"
                        >
                          <Eye className="w-4 h-4" />
                          <span className="hidden md:inline">{t("View")}</span>
                        </Button>
                        <Link
                          href={`/dashboard/transfers-management/edit/${
                            transfer.id || transfer._id
                          }`}
                        >
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex items-center text-black dark:text-white gap-1"
                          >
                            <Edit className="w-4 h-4" />
                            <span className="hidden md:inline">
                              {t("Edit")}
                            </span>
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() =>
                            handleDelete(transfer.id || transfer._id)
                          }
                          disabled={
                            deletingId === (transfer.id || transfer._id)
                          }
                          className="flex items-center gap-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center">
                    <ArrowRight className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                    <p className="text-gray-500 dark:text-gray-400">
                      {t("No transfers found")}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {numPages > 1 && <Pagination numPages={numPages} />}

      {/* Transfer Details Modal */}
      {selectedTransferId && (
        <TransferDetailsModal
          transferId={selectedTransferId}
          onClose={() => setSelectedTransferId(null)}
        />
      )}
    </div>
  );
}
