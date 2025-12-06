import { Link } from "@/i18n/navigation";
import { Bell, Send, Smartphone, BarChart3 } from "lucide-react";

export default function NotificationsLayout({ children }) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Bell className="w-8 h-8 text-green-primary" />
        <h1 className="text-2xl font-bold text-white">Notifications Management</h1>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-4 border-b border-gray-700 pb-4">
        <Link
          href="/dashboard/notifications"
          className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors text-gray-300 hover:text-white"
        >
          <BarChart3 className="w-5 h-5" />
          <span>Dashboard</span>
        </Link>
        <Link
          href="/dashboard/notifications/send"
          className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors text-gray-300 hover:text-white"
        >
          <Send className="w-5 h-5" />
          <span>Send Notification</span>
        </Link>
        <Link
          href="/dashboard/notifications/devices"
          className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors text-gray-300 hover:text-white"
        >
          <Smartphone className="w-5 h-5" />
          <span>Registered Devices</span>
        </Link>
      </div>

      {/* Content */}
      {children}
    </div>
  );
}
