"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  Eye,
  Trash2,
  MessageSquare,
  MoreHorizontal,
  Clock,
  User,
  Calendar,
  AlertCircle,
  Bug,
  Lightbulb,
  HelpCircle,
  AlertTriangle,
  MoreHorizontalIcon,
  CheckCircle,
  XCircle,
  Flame,
} from "lucide-react";
import { Button } from "../ui/button";
import { useTranslations } from "next-intl";
import TicketDetailsModal from "./TicketDetailsModal";
import Pagination from "../ui app/Pagination";
import { deleteSupportTicket } from "@/app/[locale]/_Lib/actions";
import toast from "react-hot-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Badge components with icons
const getStatusConfig = (status) => {
  const configs = {
    open: {
      icon: AlertCircle,
      bg: "bg-yellow-500/10",
      text: "text-yellow-500",
      border: "border-yellow-500/20",
    },
    in_progress: {
      icon: Clock,
      bg: "bg-purple-500/10",
      text: "text-purple-500",
      border: "border-purple-500/20",
    },
    waiting_reply: {
      icon: MessageSquare,
      bg: "bg-cyan-500/10",
      text: "text-cyan-500",
      border: "border-cyan-500/20",
    },
    resolved: {
      icon: CheckCircle,
      bg: "bg-green-500/10",
      text: "text-green-500",
      border: "border-green-500/20",
    },
    closed: {
      icon: XCircle,
      bg: "bg-gray-500/10",
      text: "text-gray-500",
      border: "border-gray-500/20",
    },
  };
  return configs[status] || configs.open;
};

const getCategoryConfig = (category) => {
  const configs = {
    bug: {
      icon: Bug,
      bg: "bg-red-500/10",
      text: "text-red-500",
      border: "border-red-500/20",
    },
    feature: {
      icon: Lightbulb,
      bg: "bg-indigo-500/10",
      text: "text-indigo-500",
      border: "border-indigo-500/20",
    },
    question: {
      icon: HelpCircle,
      bg: "bg-blue-500/10",
      text: "text-blue-500",
      border: "border-blue-500/20",
    },
    complaint: {
      icon: AlertTriangle,
      bg: "bg-amber-500/10",
      text: "text-amber-500",
      border: "border-amber-500/20",
    },
    other: {
      icon: MoreHorizontalIcon,
      bg: "bg-gray-500/10",
      text: "text-gray-500",
      border: "border-gray-500/20",
    },
  };
  return configs[category] || configs.other;
};

const getPriorityConfig = (priority) => {
  const configs = {
    low: {
      icon: AlertCircle,
      bg: "bg-gray-500/10",
      text: "text-gray-500",
      border: "border-gray-500/20",
    },
    medium: {
      icon: AlertCircle,
      bg: "bg-blue-500/10",
      text: "text-blue-500",
      border: "border-blue-500/20",
    },
    high: {
      icon: AlertTriangle,
      bg: "bg-orange-500/10",
      text: "text-orange-500",
      border: "border-orange-500/20",
    },
    urgent: {
      icon: Flame,
      bg: "bg-red-500/10",
      text: "text-red-500",
      border: "border-red-500/20",
    },
  };
  return configs[priority] || configs.low;
};

export default function SupportTicketsTable({ tickets, pagination }) {
  const t = useTranslations("SupportCenter");
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const numPages = pagination?.totalPages || 1;

  const handleDelete = async (id) => {
    if (!confirm(t("Are you sure you want to delete this ticket?"))) return;

    setDeletingId(id);
    const result = await deleteSupportTicket(id);
    if (result.success) {
      toast.success(t("Ticket deleted successfully"));
    } else {
      toast.error(result.error || t("Failed to delete ticket"));
    }
    setDeletingId(null);
  };

  // Status label mapping
  const getStatusLabel = (status) => {
    const labels = {
      open: "Open",
      in_progress: "In Progress",
      waiting_reply: "Waiting Reply",
      resolved: "Resolved",
      closed: "Closed",
    };
    return t(labels[status] || status);
  };

  // Category label mapping
  const getCategoryLabel = (category) => {
    const labels = {
      bug: "Bug",
      feature: "Feature Request",
      question: "Question",
      complaint: "Complaint",
      other: "Other",
    };
    return t(labels[category] || category);
  };

  // Priority label mapping
  const getPriorityLabel = (priority) => {
    const labels = {
      low: "Low",
      medium: "Medium",
      high: "High",
      urgent: "Urgent",
    };
    return t(labels[priority] || priority);
  };

  if (!tickets || tickets.length === 0) {
    return (
      <div className="bg-white dark:bg-[#0f1118] rounded-xl p-12 border border-gray-200 dark:border-white/5 text-center">
        <div className="size-16 rounded-full bg-gray-100 dark:bg-[#1a1d2e] flex items-center justify-center mx-auto mb-4">
          <MessageSquare className="size-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {t("No tickets found") || "No tickets found"}
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          {t("noTicketsDescription") || "Try adjusting your filters"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Tickets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {tickets.map((ticket) => {
          const statusConfig = getStatusConfig(ticket.status);
          const categoryConfig = getCategoryConfig(ticket.category);
          const priorityConfig = getPriorityConfig(ticket.priority);
          const StatusIcon = statusConfig.icon;
          const CategoryIcon = categoryConfig.icon;
          const PriorityIcon = priorityConfig.icon;

          return (
            <div
              key={ticket.id}
              className="bg-white dark:bg-[#0f1118] rounded-xl border border-gray-200 dark:border-white/5 p-4 hover:border-green-primary/30 transition-all duration-200 group"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-[#1a1d2e] px-2 py-0.5 rounded">
                      {ticket.ticketNumber}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-medium border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}
                    >
                      <StatusIcon className="size-3" />
                      {getStatusLabel(ticket.status)}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1">
                    {ticket.subject}
                  </h3>
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
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem
                      onClick={() => setSelectedTicketId(ticket.id)}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Eye className="size-4" />
                      {t("View")}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => handleDelete(ticket.id)}
                      disabled={deletingId === ticket.id}
                      className="flex items-center gap-2 cursor-pointer text-red-600 dark:text-red-500 focus:text-red-600 dark:focus:text-red-500"
                    >
                      <Trash2 className="size-4" />
                      {t("Delete")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Description Preview */}
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                {ticket.description}
              </p>

              {/* Tags */}
              <div className="flex items-center gap-2 flex-wrap mb-3">
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-medium border ${categoryConfig.bg} ${categoryConfig.text} ${categoryConfig.border}`}
                >
                  <CategoryIcon className="size-3" />
                  {getCategoryLabel(ticket.category)}
                </span>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-medium border ${priorityConfig.bg} ${priorityConfig.text} ${priorityConfig.border}`}
                >
                  <PriorityIcon className="size-3" />
                  {getPriorityLabel(ticket.priority)}
                </span>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-3 border-t border-gray-100 dark:border-white/5">
                <div className="flex items-center gap-1">
                  <User className="size-3" />
                  <span className="truncate max-w-[120px]">
                    {ticket.user?.email || t("Unknown User")}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="size-3" />
                  <span>{format(new Date(ticket.createdAt), "MMM dd, yyyy")}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {numPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {t("showing") || "Showing"} {tickets.length} {t("of") || "of"}{" "}
            {pagination?.total || tickets.length} {t("tickets") || "tickets"}
          </p>
          <Pagination numPages={numPages} />
        </div>
      )}

      {/* Ticket Details Modal */}
      {selectedTicketId && (
        <TicketDetailsModal
          ticketId={selectedTicketId}
          onClose={() => setSelectedTicketId(null)}
        />
      )}
    </div>
  );
}
