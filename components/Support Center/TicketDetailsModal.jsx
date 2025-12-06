"use client";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { X, Send, RefreshCw, User, UserCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Spinner } from "../ui/spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { StatusBadge, PriorityBadge, CategoryBadge } from "./TicketBadges";
import {
  addTicketReply,
  updateTicket,
  closeTicket,
  reopenTicket,
  getTicketByIdAction,
} from "@/app/[locale]/_Lib/actions";
import toast from "react-hot-toast";

export default function TicketDetailsModal({ ticketId, onClose }) {
  const t = useTranslations("SupportCenter");
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [replyMessage, setReplyMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (ticketId) {
      fetchTicket();
    }
  }, [ticketId]);

  const fetchTicket = async () => {
    setLoading(true);
    try {
      const result = await getTicketByIdAction(ticketId);
      if (result.success) {
        setTicket(result.data);
      } else {
        toast.error(t("Failed to load ticket"));
      }
    } catch (error) {
      toast.error(t("Failed to load ticket"));
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (e) => {
    e.preventDefault();
    if (!replyMessage.trim()) return;

    setSubmitting(true);
    const result = await addTicketReply(ticketId, replyMessage);
    if (result.success) {
      toast.success(t("Reply sent successfully"));
      setReplyMessage("");
      fetchTicket();
    } else {
      toast.error(result.error || t("Failed to send reply"));
    }
    setSubmitting(false);
  };

  const handleStatusChange = async (newStatus) => {
    setUpdating(true);
    const result = await updateTicket(ticketId, { status: newStatus });
    if (result.success) {
      toast.success(t("Status updated"));
      fetchTicket();
    } else {
      toast.error(result.error || t("Failed to update status"));
    }
    setUpdating(false);
  };

  const handlePriorityChange = async (newPriority) => {
    setUpdating(true);
    const result = await updateTicket(ticketId, { priority: newPriority });
    if (result.success) {
      toast.success(t("Priority updated"));
      fetchTicket();
    } else {
      toast.error(result.error || t("Failed to update priority"));
    }
    setUpdating(false);
  };

  const handleCloseTicket = async () => {
    setUpdating(true);
    const result = await closeTicket(ticketId);
    if (result.success) {
      toast.success(t("Ticket closed"));
      fetchTicket();
    } else {
      toast.error(result.error || t("Failed to close ticket"));
    }
    setUpdating(false);
  };

  const handleReopenTicket = async () => {
    setUpdating(true);
    const result = await reopenTicket(ticketId);
    if (result.success) {
      toast.success(t("Ticket reopened"));
      fetchTicket();
    } else {
      toast.error(result.error || t("Failed to reopen ticket"));
    }
    setUpdating(false);
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

  if (!ticket) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {ticket.ticketNumber}
            </h2>
            <StatusBadge status={ticket.status} t={t} />
            <PriorityBadge priority={ticket.priority} t={t} />
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
          {/* Ticket Info */}
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {ticket.subject}
              </h3>
              <CategoryBadge category={ticket.category} t={t} />
            </div>
            <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
              {ticket.description}
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                {ticket.user?.email || t("Unknown User")}
              </div>
              <span>
                {format(new Date(ticket.createdAt), "yyyy-MM-dd HH:mm")}
              </span>
            </div>
          </div>

          {/* Admin Controls */}
          <div className="flex flex-wrap items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t("Update")}:
            </span>
            <Select
              value={ticket.status}
              onValueChange={handleStatusChange}
              disabled={updating}
            >
              <SelectTrigger className="w-[140px] bg-white dark:bg-gray-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">{t("Open")}</SelectItem>
                <SelectItem value="in_progress">{t("In Progress")}</SelectItem>
                <SelectItem value="waiting_reply">{t("Waiting Reply")}</SelectItem>
                <SelectItem value="resolved">{t("Resolved")}</SelectItem>
                <SelectItem value="closed">{t("Closed")}</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={ticket.priority}
              onValueChange={handlePriorityChange}
              disabled={updating}
            >
              <SelectTrigger className="w-[120px] bg-white dark:bg-gray-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">{t("Low")}</SelectItem>
                <SelectItem value="medium">{t("Medium")}</SelectItem>
                <SelectItem value="high">{t("High")}</SelectItem>
                <SelectItem value="urgent">{t("Urgent")}</SelectItem>
              </SelectContent>
            </Select>

            {ticket.status === "closed" ? (
              <Button
                size="sm"
                variant="outline"
                onClick={handleReopenTicket}
                disabled={updating}
                className="flex items-center gap-1"
              >
                <RefreshCw className="w-4 h-4" />
                {t("Reopen")}
              </Button>
            ) : (
              <Button
                size="sm"
                variant="outline"
                onClick={handleCloseTicket}
                disabled={updating}
                className="flex items-center gap-1"
              >
                <X className="w-4 h-4" />
                {t("Close")}
              </Button>
            )}
          </div>

          {/* Replies */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900 dark:text-white">
              {t("Replies")} ({ticket.replies?.length || 0})
            </h4>
            {ticket.replies?.length > 0 ? (
              ticket.replies.map((reply) => (
                <div
                  key={reply.id || reply._id}
                  className={`p-3 rounded-lg ${
                    reply.isStaff
                      ? "bg-green-50 dark:bg-green-900/20 ltr:ml-8 rtl:mr-8"
                      : "bg-gray-50 dark:bg-gray-900 ltr:mr-8 rtl:ml-8"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {reply.isStaff ? (
                      <UserCheck className="w-4 h-4 text-green-600 dark:text-green-400" />
                    ) : (
                      <User className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    )}
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {reply.user?.email || t("User")}
                    </span>
                    {reply.isStaff && (
                      <span className="text-xs bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 px-2 py-0.5 rounded">
                        {t("Staff")}
                      </span>
                    )}
                    <span className="text-xs text-gray-500 dark:text-gray-400 ltr:ml-auto rtl:mr-auto">
                      {format(new Date(reply.createdAt), "yyyy-MM-dd HH:mm")}
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {reply.message}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                {t("No replies yet")}
              </p>
            )}
          </div>
        </div>

        {/* Reply Form */}
        {ticket.status !== "closed" && (
          <form
            onSubmit={handleReply}
            className="p-4 border-t border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center gap-3">
              <Input
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                placeholder={t("Type your reply...")}
                disabled={submitting}
                className="flex-1 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
              />
              <Button
                type="submit"
                disabled={submitting || !replyMessage.trim()}
                className="bg-green-primary hover:bg-green-primary/80"
              >
                {submitting ? <Spinner /> : <Send className="w-5 h-5" />}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
