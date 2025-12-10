"use client";
import { useState } from "react";
import { format } from "date-fns";
import { Eye, Trash2, MessageSquare } from "lucide-react";
import { Button } from "../ui/button";
import { useTranslations } from "next-intl";
import { StatusBadge, PriorityBadge, CategoryBadge } from "./TicketBadges";
import TicketDetailsModal from "./TicketDetailsModal";
import Pagination from "../ui app/Pagination";
import { deleteSupportTicket } from "@/app/[locale]/_Lib/actions";
import toast from "react-hot-toast";

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

  return (
    <div className="space-y-4">
      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-4 py-3 text-start text-sm font-medium text-gray-600 dark:text-gray-300">
                  {t("Ticket")}
                </th>
                <th className="px-4 py-3 text-start text-sm font-medium text-gray-600 dark:text-gray-300">
                  {t("User")}
                </th>
                <th className="px-4 py-3 text-start text-sm font-medium text-gray-600 dark:text-gray-300">
                  {t("Category")}
                </th>
                <th className="px-4 py-3 text-start text-sm font-medium text-gray-600 dark:text-gray-300">
                  {t("Status")}
                </th>
                <th className="px-4 py-3 text-start text-sm font-medium text-gray-600 dark:text-gray-300">
                  {t("Priority")}
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
              {tickets.length > 0 ? (
                tickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="space-y-1">
                        <p className="font-medium text-gray-900 dark:text-white text-sm">
                          {ticket.ticketNumber}
                        </p>
                        <p className="text-gray-600 dark:text-gray-400 text-xs line-clamp-1 max-w-[200px]">
                          {ticket.subject}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-gray-900 dark:text-white">
                        {ticket.user?.email || "-"}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <CategoryBadge category={ticket.category} t={t} />
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={ticket.status} t={t} />
                    </td>
                    <td className="px-4 py-3">
                      <PriorityBadge priority={ticket.priority} t={t} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {format(new Date(ticket.createdAt), "yyyy-MM-dd")}
                        <div className="text-xs text-gray-500">
                          {format(new Date(ticket.createdAt), "HH:mm")}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedTicketId(ticket.id)}
                          className="flex text-black dark:text-white items-center gap-1"
                        >
                          <Eye className="w-4 h-4" />
                          <span className="hidden md:inline">{t("View")}</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(ticket.id)}
                          disabled={deletingId === ticket.id}
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
                  <td colSpan={7} className="px-4 py-12 text-center">
                    <MessageSquare className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                    <p className="text-gray-500 dark:text-gray-400">
                      {t("No tickets found")}
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
