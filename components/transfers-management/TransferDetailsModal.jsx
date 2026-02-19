"use client";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { X, ArrowRight, DollarSign, Calendar, FileText, Link as LinkIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Spinner } from "../ui/spinner";
import { FeaturedBadge } from "./TransfersBadges";
import { getTransferByIdAction } from "@/app/[locale]/_Lib/actions";
import toast from "react-hot-toast";
import Image from "next/image";
import { getImgUrl } from "@/lib/utils";

export default function TransferDetailsModal({ transferId, onClose }) {
  const t = useTranslations("TransfersManagement");
  const [transfer, setTransfer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (transferId) {
      fetchTransfer();
    }
  }, [transferId]);

  const fetchTransfer = async () => {
    setLoading(true);
    try {
      const result = await getTransferByIdAction(transferId);
      if (result.success) {
        setTransfer(result.data);
      } else {
        toast.error(t("Failed to load transfer"));
      }
    } catch (error) {
      toast.error(t("Failed to load transfer"));
    } finally {
      setLoading(false);
    }
  };

  const formatFee = (fee, currency = "USD") => {
    if (!fee) return "-";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      maximumFractionDigits: 0,
    }).format(fee);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8">
          <Spinner />
        </div>
      </div>
    );
  }

  if (!transfer) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t("Transfer Details")}
            </h2>
            {transfer.isFeatured && <FeaturedBadge t={t} />}
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Player & Teams */}
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
            <div className="flex items-center justify-center gap-4">
              {/* From Team */}
              <div className="flex flex-col items-center gap-2 flex-1">
                <span className="text-xs text-gray-500 dark:text-gray-400">{t("From")}</span>
                {transfer.fromTeam ? (
                  <>
                    {transfer.fromTeam.logo && (
                      <Image
                        src={getImgUrl(transfer.fromTeam.logo.light, "medium") || getImgUrl(transfer.fromTeam.logo, "medium")}
                        alt={transfer.fromTeam.name}
                        width={48}
                        height={48}
                        className="rounded-lg object-contain dark:hidden"
                      />
                    )}
                    {transfer.fromTeam.logo?.dark && (
                      <Image
                        src={getImgUrl(transfer.fromTeam.logo.dark, "medium")}
                        alt={transfer.fromTeam.name}
                        width={48}
                        height={48}
                        className="rounded-lg object-contain hidden dark:block"
                      />
                    )}
                    <span className="text-sm font-medium text-gray-900 dark:text-white text-center">
                      {transfer.fromTeam.name}
                    </span>
                  </>
                ) : (
                  <span className="text-sm text-gray-500 dark:text-gray-400">{t("Free Agent")}</span>
                )}
              </div>

              {/* Arrow */}
              <ArrowRight className="w-8 h-8 text-gray-400 flex-shrink-0" />

              {/* To Team */}
              <div className="flex flex-col items-center gap-2 flex-1">
                <span className="text-xs text-gray-500 dark:text-gray-400">{t("To")}</span>
                {transfer.toTeam ? (
                  <>
                    {transfer.toTeam.logo && (
                      <Image
                        src={getImgUrl(transfer.toTeam.logo.light, "medium") || getImgUrl(transfer.toTeam.logo, "medium")}
                        alt={transfer.toTeam.name}
                        width={48}
                        height={48}
                        className="rounded-lg object-contain dark:hidden"
                      />
                    )}
                    {transfer.toTeam.logo?.dark && (
                      <Image
                        src={getImgUrl(transfer.toTeam.logo.dark, "medium")}
                        alt={transfer.toTeam.name}
                        width={48}
                        height={48}
                        className="rounded-lg object-contain hidden dark:block"
                      />
                    )}
                    <span className="text-sm font-medium text-gray-900 dark:text-white text-center">
                      {transfer.toTeam.name}
                    </span>
                  </>
                ) : (
                  <span className="text-sm text-gray-500 dark:text-gray-400">-</span>
                )}
              </div>
            </div>

            {/* Player */}
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                {transfer.player?.photo && (
                  <Image
                    src={getImgUrl(transfer.player.photo.light, "medium") || getImgUrl(transfer.player.photo, "medium")}
                    alt={transfer.player.nickname}
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                  />
                )}
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {transfer.player?.nickname}
                  </p>
                  {transfer.player?.firstName && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {transfer.player.firstName} {transfer.player.lastName}
                    </p>
                  )}
                </div>
                {transfer.game?.name && (
                  <span className="ltr:ml-auto rtl:mr-auto text-sm text-gray-600 dark:text-gray-400">
                    {transfer.game.name}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Fee */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1">
                <DollarSign className="w-4 h-4" />
                <span className="text-xs">{t("Transfer Fee")}</span>
              </div>
              <p className="font-semibold text-gray-900 dark:text-white">
                {formatFee(transfer.fee, transfer.currency)}
              </p>
            </div>

            {/* Contract Length */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1">
                <Calendar className="w-4 h-4" />
                <span className="text-xs">{t("Contract Length")}</span>
              </div>
              <p className="font-semibold text-gray-900 dark:text-white">
                {transfer.contractLength ? `${transfer.contractLength} ${t("months")}` : "-"}
              </p>
            </div>

            {/* Transfer Date */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1">
                <Calendar className="w-4 h-4" />
                <span className="text-xs">{t("Transfer Date")}</span>
              </div>
              <p className="font-semibold text-gray-900 dark:text-white">
                {transfer.transferDate
                  ? format(new Date(transfer.transferDate), "yyyy-MM-dd")
                  : "-"}
              </p>
            </div>
          </div>

          {/* Source */}
          {transfer.source && (
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1">
                <LinkIcon className="w-4 h-4" />
                <span className="text-xs">{t("Source")}</span>
              </div>
              <p className="text-gray-900 dark:text-white">{transfer.source}</p>
            </div>
          )}

          {/* Content */}
          {transfer.content && (
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1">
                <FileText className="w-4 h-4" />
                <span className="text-xs">{t("Content")}</span>
              </div>
              <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
                {transfer.content}
              </p>
            </div>
          )}

          {/* Timestamps */}
          <div className="text-xs text-gray-500 dark:text-gray-400 flex gap-4">
            <span>
              {t("Created")}: {format(new Date(transfer.createdAt), "yyyy-MM-dd HH:mm")}
            </span>
            <span>
              {t("Updated")}: {format(new Date(transfer.updatedAt), "yyyy-MM-dd HH:mm")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
