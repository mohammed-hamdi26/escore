"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { requestContentRole } from "@/app/[locale]/_Lib/actions";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import {
  Newspaper,
  Clock,
  CheckCircle,
  XCircle,
  Send,
  Shield,
  AlertCircle,
  User,
  Sparkles,
} from "lucide-react";

const statusConfig = {
  pending: {
    icon: Clock,
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-500/50",
  },
  approved: {
    icon: CheckCircle,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/50",
  },
  rejected: {
    icon: XCircle,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/50",
  },
};

export default function ContentRequestForm({ user, contentStatus }) {
  const t = useTranslations("ContentRequest");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await requestContentRole();
      toast.success(t("requestSubmitted"));
      router.refresh();
    } catch (error) {
      toast.error(error.message || t("requestFailed"));
    } finally {
      setIsLoading(false);
    }
  };

  const currentStatus = contentStatus?.contentStatus;
  const canRequest = contentStatus?.canRequest !== false;
  const StatusIcon = currentStatus ? statusConfig[currentStatus]?.icon : null;

  // Check if user is already a content creator
  if (user?.role === "content") {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Newspaper className="w-8 h-8 text-purple-500" />
          <h1 className="text-2xl font-bold text-white">{t("title")}</h1>
        </div>

        <div className="bg-green-500/10 border-2 border-green-500/50 rounded-2xl p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">{t("alreadyContentCreator")}</h2>
          <p className="text-[#677185]">{t("alreadyContentCreatorDesc")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Newspaper className="w-8 h-8 text-purple-500" />
        <h1 className="text-2xl font-bold text-white">{t("title")}</h1>
      </div>

      {/* Current Status Card */}
      {currentStatus && (
        <div
          className={`rounded-2xl border-2 p-6 ${statusConfig[currentStatus].bgColor} ${statusConfig[currentStatus].borderColor}`}
        >
          <div className="flex items-start gap-4">
            <StatusIcon className={`w-8 h-8 ${statusConfig[currentStatus].color}`} />
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white mb-1">
                {t(`status.${currentStatus}`)}
              </h3>
              <p className="text-[#677185] text-sm mb-3">
                {contentStatus?.message}
              </p>

              {currentStatus === "pending" && (
                <div className="flex items-center gap-2 text-sm text-yellow-500">
                  <Clock className="w-4 h-4" />
                  <span>
                    {t("requestedAt")}:{" "}
                    {new Date(contentStatus?.contentRequestedAt).toLocaleDateString()}
                  </span>
                </div>
              )}

              {currentStatus === "approved" && contentStatus?.contentApprovedAt && (
                <div className="flex items-center gap-2 text-sm text-green-500">
                  <CheckCircle className="w-4 h-4" />
                  <span>
                    {t("approvedAt")}:{" "}
                    {new Date(contentStatus?.contentApprovedAt).toLocaleDateString()}
                  </span>
                </div>
              )}

              {currentStatus === "rejected" && contentStatus?.contentRejectionReason && (
                <div className="mt-3 p-3 bg-red-500/10 rounded-lg">
                  <p className="text-sm text-red-400">
                    <span className="font-medium">{t("rejectionReason")}:</span>{" "}
                    {contentStatus?.contentRejectionReason}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Benefits Section */}
      <div className="bg-[#0F1017] rounded-2xl border border-[#1a1f2e] p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-500" />
          {t("benefits.title")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {["createNews", "editContent", "manageArticles", "buildAudience"].map((benefit) => (
            <div key={benefit} className="flex items-start gap-3 p-3 bg-[#1a1f2e]/50 rounded-xl">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
              <div>
                <p className="text-white font-medium">{t(`benefits.${benefit}.title`)}</p>
                <p className="text-sm text-[#677185]">{t(`benefits.${benefit}.desc`)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Requirements Section */}
      <div className="bg-[#0F1017] rounded-2xl border border-[#1a1f2e] p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-yellow-500" />
          {t("requirements.title")}
        </h3>
        <ul className="space-y-3">
          {["verifiedEmail", "activeAccount", "followGuidelines"].map((req) => (
            <li key={req} className="flex items-center gap-3 text-[#677185]">
              <div className="w-2 h-2 rounded-full bg-yellow-500" />
              {t(`requirements.${req}`)}
            </li>
          ))}
        </ul>
      </div>

      {/* Submit Button */}
      {canRequest && !currentStatus && (
        <div className="flex justify-center pt-4">
          <Button
            onClick={handleSubmit}
            disabled={isLoading || !user?.isVerified}
            className="bg-purple-600 hover:bg-purple-700 text-white min-w-[200px] h-12 text-lg disabled:opacity-50"
          >
            {isLoading ? (
              <Spinner />
            ) : (
              <>
                <Send className="w-5 h-5 mr-2" />
                {t("submitRequest")}
              </>
            )}
          </Button>
        </div>
      )}

      {/* Can resubmit after rejection */}
      {canRequest && currentStatus === "rejected" && (
        <div className="flex justify-center pt-4">
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-purple-600 hover:bg-purple-700 text-white min-w-[200px] h-12 text-lg disabled:opacity-50"
          >
            {isLoading ? (
              <Spinner />
            ) : (
              <>
                <Send className="w-5 h-5 mr-2" />
                {t("resubmitRequest")}
              </>
            )}
          </Button>
        </div>
      )}

      {/* Not verified warning */}
      {!user?.isVerified && (
        <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="w-6 h-6 text-yellow-500" />
          <p className="text-yellow-500">{t("verifyEmailFirst")}</p>
        </div>
      )}
    </div>
  );
}
