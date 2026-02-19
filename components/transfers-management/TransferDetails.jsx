"use client";

import { getImgUrl } from "@/lib/utils";
import { Link, useRouter } from "@/i18n/navigation";
import { Button } from "../ui/button";
import { format } from "date-fns";
import { useTranslations } from "next-intl";
import { useState } from "react";
import toast from "react-hot-toast";
import { deleteTransfer } from "@/app/[locale]/_Lib/actions";
import {
  Calendar,
  User,
  Clock,
  Pencil,
  ArrowLeft,
  Trash2,
  Loader2,
  DollarSign,
  FileText,
  Gamepad2,
  Users,
  ArrowRight,
  Briefcase,
} from "lucide-react";

function TransferDetails({ transfer }) {
  const t = useTranslations("TransferDetails");
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const formatDate = (date) => {
    if (!date) return "-";
    return format(new Date(date), "PPP");
  };

  const formatFee = (fee, currency = "USD") => {
    if (!fee) return "-";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      maximumFractionDigits: 0,
    }).format(fee);
  };

  const handleDelete = async () => {
    if (!confirm(t("confirmDelete") || `Are you sure you want to delete this transfer?`)) {
      return;
    }

    try {
      setIsDeleting(true);
      const result = await deleteTransfer(transfer.id || transfer._id);
      if (result.success) {
        toast.success(t("deleteSuccess") || "Transfer deleted successfully");
        router.push("/dashboard/transfers-management");
      } else {
        toast.error(result.error || t("deleteError") || "Failed to delete transfer");
      }
    } catch (e) {
      toast.error(t("deleteError") || "Failed to delete transfer");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/transfers-management">
            <Button variant="outline" size="sm" className="gap-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
              <ArrowLeft className="size-4" />
              {t("back") || "Back"}
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">{t("title") || "Transfer Details"}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/dashboard/transfers-management/edit/${transfer.id || transfer._id}`}>
            <Button className="gap-2 bg-green-primary hover:bg-green-primary/90 text-white">
              <Pencil className="size-4" />
              {t("edit") || "Edit"}
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Transfer Visual Card */}
          <div className="glass rounded-2xl p-8 border border-gray-200 dark:border-white/5">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              {/* From Team */}
              <div className="flex flex-col items-center text-center">
                <p className="text-sm text-muted-foreground mb-3">{t("from") || "From"}</p>
                {transfer.fromTeam ? (
                  <>
                    {transfer.fromTeam.logo ? (
                      <>
                        <img
                          src={getImgUrl(transfer.fromTeam.logo.light) || getImgUrl(transfer.fromTeam.logo)}
                          alt={transfer.fromTeam.name}
                          className="size-20 rounded-xl object-contain dark:hidden"
                        />
                        {transfer.fromTeam.logo.dark && (
                          <img
                            src={getImgUrl(transfer.fromTeam.logo.dark)}
                            alt={transfer.fromTeam.name}
                            className="size-20 rounded-xl object-contain hidden dark:block"
                          />
                        )}
                      </>
                    ) : (
                      <div className="size-20 rounded-xl bg-muted flex items-center justify-center">
                        <Users className="size-8 text-muted-foreground" />
                      </div>
                    )}
                    <p className="font-semibold text-foreground mt-3">{transfer.fromTeam.name}</p>
                  </>
                ) : (
                  <>
                    <div className="size-20 rounded-xl bg-gray-500/10 flex items-center justify-center">
                      <User className="size-8 text-gray-500" />
                    </div>
                    <p className="font-semibold text-muted-foreground mt-3">{t("freeAgent") || "Free Agent"}</p>
                  </>
                )}
              </div>

              {/* Player & Arrow */}
              <div className="flex flex-col items-center">
                {transfer.player?.photo ? (
                  <img
                    src={getImgUrl(transfer.player.photo.light) || getImgUrl(transfer.player.photo)}
                    alt={transfer.player.nickname}
                    className="size-24 rounded-full object-cover border-4 border-green-primary/20"
                  />
                ) : (
                  <div className="size-24 rounded-full bg-green-primary/10 flex items-center justify-center border-4 border-green-primary/20">
                    <User className="size-10 text-green-primary" />
                  </div>
                )}
                <p className="font-bold text-xl text-foreground mt-3">{transfer.player?.nickname || "-"}</p>
                {transfer.player?.firstName && transfer.player?.lastName && (
                  <p className="text-sm text-muted-foreground">
                    {transfer.player.firstName} {transfer.player.lastName}
                  </p>
                )}
                <div className="flex items-center gap-4 mt-4">
                  <ArrowRight className="size-8 text-green-primary" />
                </div>
              </div>

              {/* To Team */}
              <div className="flex flex-col items-center text-center">
                <p className="text-sm text-muted-foreground mb-3">{t("to") || "To"}</p>
                {transfer.toTeam ? (
                  <>
                    {transfer.toTeam.logo ? (
                      <>
                        <img
                          src={getImgUrl(transfer.toTeam.logo.light) || getImgUrl(transfer.toTeam.logo)}
                          alt={transfer.toTeam.name}
                          className="size-20 rounded-xl object-contain dark:hidden"
                        />
                        {transfer.toTeam.logo.dark && (
                          <img
                            src={getImgUrl(transfer.toTeam.logo.dark)}
                            alt={transfer.toTeam.name}
                            className="size-20 rounded-xl object-contain hidden dark:block"
                          />
                        )}
                      </>
                    ) : (
                      <div className="size-20 rounded-xl bg-muted flex items-center justify-center">
                        <Users className="size-8 text-muted-foreground" />
                      </div>
                    )}
                    <p className="font-semibold text-foreground mt-3">{transfer.toTeam.name}</p>
                  </>
                ) : (
                  <>
                    <div className="size-20 rounded-xl bg-gray-500/10 flex items-center justify-center">
                      <User className="size-8 text-gray-500" />
                    </div>
                    <p className="font-semibold text-muted-foreground mt-3">{t("unknown") || "Unknown"}</p>
                  </>
                )}
              </div>
            </div>

            {/* Game Badge */}
            {transfer.game && (
              <div className="flex flex-wrap items-center justify-center gap-2 mt-6 pt-6 border-t border-border">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border bg-blue-500/10 text-blue-500 border-blue-500/30">
                  <Gamepad2 className="size-4" />
                  {transfer.game.name}
                </span>
              </div>
            )}
          </div>

          {/* Financial Details Card */}
          <div className="glass rounded-2xl p-6 border border-gray-200 dark:border-white/5">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <DollarSign className="size-5 text-green-primary" />
              {t("financialDetails") || "Financial Details"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-muted/50 dark:bg-[#1a1d2e] rounded-xl p-4">
                <p className="text-sm text-muted-foreground mb-1">{t("transferFee") || "Transfer Fee"}</p>
                <p className="text-2xl font-bold text-green-primary">
                  {formatFee(transfer.fee, transfer.currency)}
                </p>
              </div>
              <div className="bg-muted/50 dark:bg-[#1a1d2e] rounded-xl p-4">
                <p className="text-sm text-muted-foreground mb-1">{t("currency") || "Currency"}</p>
                <p className="text-2xl font-bold text-foreground">
                  {transfer.currency || "USD"}
                </p>
              </div>
            </div>
          </div>

          {/* Content Card */}
          {transfer.content && (
            <div className="glass rounded-2xl p-6 border border-gray-200 dark:border-white/5">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <FileText className="size-5 text-green-primary" />
                {t("content") || "Content"}
              </h3>
              <div
                className="prose prose-sm dark:prose-invert max-w-none text-foreground"
                dangerouslySetInnerHTML={{ __html: transfer.content }}
              />
            </div>
          )}
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="glass rounded-2xl p-6 border border-gray-200 dark:border-white/5">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              {t("quickActions") || "Quick Actions"}
            </h3>
            <div className="space-y-3">
              {/* Delete */}
              <Button
                variant="outline"
                onClick={handleDelete}
                disabled={isDeleting}
                className="w-full gap-2 justify-start border-red-500/30 text-red-500 hover:bg-red-500/10"
              >
                {isDeleting ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Trash2 className="size-4" />
                )}
                {isDeleting ? t("deleting") || "Deleting..." : t("delete") || "Delete"}
              </Button>
            </div>
          </div>

          {/* Transfer Info */}
          <div className="glass rounded-2xl p-6 border border-gray-200 dark:border-white/5">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Briefcase className="size-5 text-green-primary" />
              {t("transferInfo") || "Transfer Info"}
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="size-4" />
                  {t("transferDate") || "Transfer Date"}
                </div>
                <span className="font-medium text-foreground">
                  {formatDate(transfer.transferDate)}
                </span>
              </div>
              {transfer.game && (
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Gamepad2 className="size-4" />
                    {t("game") || "Game"}
                  </div>
                  <span className="font-medium text-foreground">
                    {transfer.game.name}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Related Player */}
          {transfer.player && (
            <div className="glass rounded-2xl p-6 border border-gray-200 dark:border-white/5">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <User className="size-5 text-green-primary" />
                {t("player") || "Player"}
              </h3>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 dark:bg-[#1a1d2e]">
                {transfer.player.photo ? (
                  <img
                    src={getImgUrl(transfer.player.photo.light, "medium") || getImgUrl(transfer.player.photo, "medium")}
                    alt={transfer.player.nickname}
                    className="size-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="size-12 rounded-full bg-green-primary/10 flex items-center justify-center">
                    <User className="size-6 text-green-primary" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-foreground truncate">{transfer.player.nickname}</p>
                  {transfer.player.country?.name && (
                    <p className="text-sm text-muted-foreground truncate">{transfer.player.country.name}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div className="glass rounded-2xl p-6 border border-gray-200 dark:border-white/5">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Clock className="size-5 text-green-primary" />
              {t("timestamps") || "Timestamps"}
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("created") || "Created"}</span>
                <span className="font-medium text-foreground">
                  {formatDate(transfer.createdAt)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("updated") || "Updated"}</span>
                <span className="font-medium text-foreground">
                  {formatDate(transfer.updatedAt)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TransferDetails;
