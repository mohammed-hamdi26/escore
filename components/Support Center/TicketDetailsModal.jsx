"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  X,
  Send,
  RefreshCw,
  User,
  UserCheck,
  Clock,
  AlertCircle,
  CheckCircle,
  MessageSquare,
  XCircle,
  Bug,
  Lightbulb,
  HelpCircle,
  AlertTriangle,
  MoreHorizontal,
  Flame,
  Calendar,
  ChevronDown,
  Check,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import {
  addTicketReply,
  updateTicket,
  closeTicket,
  reopenTicket,
  getTicketByIdAction,
} from "@/app/[locale]/_Lib/actions";
import toast from "react-hot-toast";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

// Config for badges
const getStatusConfig = (status) => {
  const configs = {
    open: { icon: AlertCircle, bg: "bg-yellow-500/10", text: "text-yellow-500", border: "border-yellow-500/20" },
    in_progress: { icon: Clock, bg: "bg-purple-500/10", text: "text-purple-500", border: "border-purple-500/20" },
    waiting_reply: { icon: MessageSquare, bg: "bg-cyan-500/10", text: "text-cyan-500", border: "border-cyan-500/20" },
    resolved: { icon: CheckCircle, bg: "bg-green-500/10", text: "text-green-500", border: "border-green-500/20" },
    closed: { icon: XCircle, bg: "bg-gray-500/10", text: "text-gray-500", border: "border-gray-500/20" },
  };
  return configs[status] || configs.open;
};

const getCategoryConfig = (category) => {
  const configs = {
    bug: { icon: Bug, bg: "bg-red-500/10", text: "text-red-500", border: "border-red-500/20" },
    feature: { icon: Lightbulb, bg: "bg-indigo-500/10", text: "text-indigo-500", border: "border-indigo-500/20" },
    question: { icon: HelpCircle, bg: "bg-blue-500/10", text: "text-blue-500", border: "border-blue-500/20" },
    complaint: { icon: AlertTriangle, bg: "bg-amber-500/10", text: "text-amber-500", border: "border-amber-500/20" },
    other: { icon: MoreHorizontal, bg: "bg-gray-500/10", text: "text-gray-500", border: "border-gray-500/20" },
  };
  return configs[category] || configs.other;
};

const getPriorityConfig = (priority) => {
  const configs = {
    low: { icon: AlertCircle, bg: "bg-gray-500/10", text: "text-gray-500", border: "border-gray-500/20" },
    medium: { icon: AlertCircle, bg: "bg-blue-500/10", text: "text-blue-500", border: "border-blue-500/20" },
    high: { icon: AlertTriangle, bg: "bg-orange-500/10", text: "text-orange-500", border: "border-orange-500/20" },
    urgent: { icon: Flame, bg: "bg-red-500/10", text: "text-red-500", border: "border-red-500/20" },
  };
  return configs[priority] || configs.low;
};

const STATUS_OPTIONS = [
  { value: "open", labelKey: "Open", icon: AlertCircle, color: "text-yellow-500" },
  { value: "in_progress", labelKey: "In Progress", icon: Clock, color: "text-purple-500" },
  { value: "waiting_reply", labelKey: "Waiting Reply", icon: MessageSquare, color: "text-cyan-500" },
  { value: "resolved", labelKey: "Resolved", icon: CheckCircle, color: "text-green-500" },
  { value: "closed", labelKey: "Closed", icon: XCircle, color: "text-gray-500" },
];

const PRIORITY_OPTIONS = [
  { value: "low", labelKey: "Low", icon: AlertCircle, color: "text-gray-500" },
  { value: "medium", labelKey: "Medium", icon: AlertCircle, color: "text-blue-500" },
  { value: "high", labelKey: "High", icon: AlertTriangle, color: "text-orange-500" },
  { value: "urgent", labelKey: "Urgent", icon: Flame, color: "text-red-500" },
];

export default function TicketDetailsModal({ ticketId, onClose }) {
  const t = useTranslations("SupportCenter");
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [replyMessage, setReplyMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [priorityOpen, setPriorityOpen] = useState(false);

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
    setStatusOpen(false);
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
    setPriorityOpen(false);
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
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="bg-white dark:bg-[#0f1118] rounded-2xl p-8 shadow-2xl border border-gray-200 dark:border-white/10">
          <Spinner />
        </div>
      </div>
    );
  }

  if (!ticket) return null;

  const statusConfig = getStatusConfig(ticket.status);
  const categoryConfig = getCategoryConfig(ticket.category);
  const priorityConfig = getPriorityConfig(ticket.priority);
  const StatusIcon = statusConfig.icon;
  const CategoryIcon = categoryConfig.icon;
  const PriorityIcon = priorityConfig.icon;

  const selectedStatus = STATUS_OPTIONS.find((s) => s.value === ticket.status) || STATUS_OPTIONS[0];
  const selectedPriority = PRIORITY_OPTIONS.find((p) => p.value === ticket.priority) || PRIORITY_OPTIONS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-[#0f1118] rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-gray-200 dark:border-white/10">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-white/5">
          <div className="flex items-center gap-3">
            <span className="text-sm font-mono text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-[#1a1d2e] px-3 py-1 rounded-lg">
              {ticket.ticketNumber}
            </span>
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}
            >
              <StatusIcon className="size-3.5" />
              {t(selectedStatus.labelKey)}
            </span>
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${priorityConfig.bg} ${priorityConfig.text} ${priorityConfig.border}`}
            >
              <PriorityIcon className="size-3.5" />
              {t(selectedPriority.labelKey)}
            </span>
          </div>
          <button
            onClick={onClose}
            className="size-8 rounded-lg bg-gray-100 dark:bg-[#1a1d2e] flex items-center justify-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Ticket Info */}
          <div className="bg-gray-50 dark:bg-[#1a1d2e] rounded-xl p-5 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {ticket.subject}
              </h3>
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border shrink-0 ${categoryConfig.bg} ${categoryConfig.text} ${categoryConfig.border}`}
              >
                <CategoryIcon className="size-3.5" />
                {t(ticket.category === "feature" ? "Feature Request" : ticket.category.charAt(0).toUpperCase() + ticket.category.slice(1))}
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
              {ticket.description}
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-white/5">
              <div className="flex items-center gap-1.5">
                <User className="size-4" />
                {ticket.user?.email || t("Unknown User")}
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="size-4" />
                {format(new Date(ticket.createdAt), "MMM dd, yyyy HH:mm")}
              </div>
            </div>
          </div>

          {/* Admin Controls */}
          <div className="bg-green-50 dark:bg-green-500/5 rounded-xl p-4 border border-green-200 dark:border-green-500/10">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t("Update")}:
              </span>

              {/* Status Selector */}
              <Popover open={statusOpen} onOpenChange={setStatusOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    disabled={updating}
                    className="h-9 justify-between rounded-lg bg-white dark:bg-[#1a1d2e] border-gray-200 dark:border-white/10 font-normal hover:bg-gray-50 dark:hover:bg-[#252a3d] min-w-[140px]"
                  >
                    <span className="flex items-center gap-2">
                      {(() => {
                        const SelStatusIcon = selectedStatus.icon;
                        return (
                          <>
                            <SelStatusIcon className={`size-4 ${selectedStatus.color}`} />
                            <span className="text-gray-900 dark:text-white text-sm">
                              {t(selectedStatus.labelKey)}
                            </span>
                          </>
                        );
                      })()}
                    </span>
                    <ChevronDown className="size-4 text-gray-400" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[180px] p-0" align="start">
                  <Command>
                    <CommandList>
                      <CommandGroup>
                        {STATUS_OPTIONS.map((option) => {
                          const OptionIcon = option.icon;
                          return (
                            <CommandItem
                              key={option.value}
                              value={option.value}
                              onSelect={() => handleStatusChange(option.value)}
                              className="flex items-center gap-2 cursor-pointer"
                            >
                              <Check className={`size-4 ${ticket.status === option.value ? "opacity-100" : "opacity-0"}`} />
                              <OptionIcon className={`size-4 ${option.color}`} />
                              <span>{t(option.labelKey)}</span>
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              {/* Priority Selector */}
              <Popover open={priorityOpen} onOpenChange={setPriorityOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    disabled={updating}
                    className="h-9 justify-between rounded-lg bg-white dark:bg-[#1a1d2e] border-gray-200 dark:border-white/10 font-normal hover:bg-gray-50 dark:hover:bg-[#252a3d] min-w-[120px]"
                  >
                    <span className="flex items-center gap-2">
                      {(() => {
                        const SelPriorityIcon = selectedPriority.icon;
                        return (
                          <>
                            <SelPriorityIcon className={`size-4 ${selectedPriority.color}`} />
                            <span className="text-gray-900 dark:text-white text-sm">
                              {t(selectedPriority.labelKey)}
                            </span>
                          </>
                        );
                      })()}
                    </span>
                    <ChevronDown className="size-4 text-gray-400" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[160px] p-0" align="start">
                  <Command>
                    <CommandList>
                      <CommandGroup>
                        {PRIORITY_OPTIONS.map((option) => {
                          const OptionIcon = option.icon;
                          return (
                            <CommandItem
                              key={option.value}
                              value={option.value}
                              onSelect={() => handlePriorityChange(option.value)}
                              className="flex items-center gap-2 cursor-pointer"
                            >
                              <Check className={`size-4 ${ticket.priority === option.value ? "opacity-100" : "opacity-0"}`} />
                              <OptionIcon className={`size-4 ${option.color}`} />
                              <span>{t(option.labelKey)}</span>
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              {/* Close/Reopen Button */}
              {ticket.status === "closed" ? (
                <Button
                  size="sm"
                  onClick={handleReopenTicket}
                  disabled={updating}
                  className="h-9 bg-green-primary hover:bg-green-primary/90 text-white rounded-lg"
                >
                  <RefreshCw className="size-4 mr-2 rtl:mr-0 rtl:ml-2" />
                  {t("Reopen")}
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCloseTicket}
                  disabled={updating}
                  className="h-9 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1a1d2e]"
                >
                  <XCircle className="size-4 mr-2 rtl:mr-0 rtl:ml-2" />
                  {t("Close")}
                </Button>
              )}
            </div>
          </div>

          {/* Replies */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <MessageSquare className="size-4" />
              {t("Replies")} ({ticket.replies?.length || 0})
            </h4>
            {ticket.replies?.length > 0 ? (
              <div className="space-y-3">
                {ticket.replies.map((reply) => (
                  <div
                    key={reply.id || reply._id}
                    className={`p-4 rounded-xl ${
                      reply.isStaff
                        ? "bg-green-50 dark:bg-green-500/5 border border-green-200 dark:border-green-500/10 ltr:ml-6 rtl:mr-6"
                        : "bg-gray-50 dark:bg-[#1a1d2e] border border-gray-200 dark:border-white/5 ltr:mr-6 rtl:ml-6"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {reply.isStaff ? (
                        <div className="size-7 rounded-full bg-green-500/10 flex items-center justify-center">
                          <UserCheck className="size-4 text-green-600 dark:text-green-400" />
                        </div>
                      ) : (
                        <div className="size-7 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                          <User className="size-4 text-gray-600 dark:text-gray-400" />
                        </div>
                      )}
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {reply.user?.email || t("User")}
                      </span>
                      {reply.isStaff && (
                        <span className="text-xs bg-green-500/10 text-green-600 dark:text-green-400 px-2 py-0.5 rounded-full border border-green-500/20">
                          {t("Staff")}
                        </span>
                      )}
                      <span className="text-xs text-gray-500 dark:text-gray-400 ltr:ml-auto rtl:mr-auto">
                        {format(new Date(reply.createdAt), "MMM dd, HH:mm")}
                      </span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap text-sm leading-relaxed">
                      {reply.message}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 dark:bg-[#1a1d2e] rounded-xl border border-gray-200 dark:border-white/5">
                <MessageSquare className="size-8 mx-auto text-gray-400 mb-2" />
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {t("No replies yet")}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Reply Form */}
        {ticket.status !== "closed" && (
          <form
            onSubmit={handleReply}
            className="p-5 border-t border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-[#0a0c14]"
          >
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                placeholder={t("typeReply") || "Type your reply..."}
                disabled={submitting}
                className="flex-1 h-11 px-4 rounded-xl bg-white dark:bg-[#1a1d2e] border border-gray-200 dark:border-white/10 text-sm text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-primary/50 transition-all"
              />
              <Button
                type="submit"
                disabled={submitting || !replyMessage.trim()}
                className="h-11 px-5 bg-green-primary hover:bg-green-primary/90 text-white rounded-xl"
              >
                {submitting ? (
                  <Spinner className="size-5" />
                ) : (
                  <>
                    <Send className="size-5 mr-2 rtl:mr-0 rtl:ml-2" />
                    {t("Send") || "Send"}
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
