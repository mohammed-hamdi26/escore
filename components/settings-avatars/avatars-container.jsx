"use client";
import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import {
  UserCircle,
  Plus,
  RefreshCw,
  Edit,
  Trash2,
} from "lucide-react";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteAvatar, toggleAvatarStatus } from "@/app/[locale]/_Lib/actions";
import toast from "react-hot-toast";
import { useTheme } from "next-themes";
import DialogAvatar from "./DialogAvatar";
import { Spinner } from "../ui/spinner";

function AvatarCard({ avatar, onDelete, onEdit, t, isDark }) {
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const getImageUrl = () => {
    if (!avatar?.image) return null;
    const imageUrl = isDark ? (avatar.image.dark || avatar.image.light) : avatar.image.light;
    if (!imageUrl) return null;
    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
      return imageUrl;
    }
    return `${process.env.NEXT_PUBLIC_BASE_URL}${imageUrl}`;
  };

  const imageUrl = getImageUrl();

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await deleteAvatar(avatar.id);
      onDelete(avatar.id);
      toast.success(t("Avatar deleted successfully"));
    } catch (e) {
      toast.error(t("Failed to delete avatar"));
    } finally {
      setIsLoading(false);
      setShowDeleteDialog(false);
    }
  };

  const handleToggleActive = async (isActive) => {
    try {
      await toggleAvatarStatus(avatar.id);
      onEdit(avatar.id, { isActive });
      toast.success(isActive ? t("Avatar enabled") : t("Avatar disabled"));
    } catch (e) {
      toast.error(t("Failed to update avatar status"));
    }
  };

  return (
    <>
      <div className="bg-white dark:bg-[#0F1017] rounded-xl overflow-hidden border border-gray-200 dark:border-white/5 hover:border-green-primary/30 dark:hover:ring-1 dark:hover:ring-green-primary/30 transition-all">
        <div className="flex flex-col sm:flex-row sm:items-center p-4 gap-4">
          {/* Avatar Image */}
          <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-green-primary/20 to-green-primary/5 dark:from-green-primary/20 dark:to-green-primary/5 flex items-center justify-center flex-shrink-0">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={avatar.name || "Avatar"}
                className="object-cover w-full h-full"
              />
            ) : (
              <UserCircle className="w-8 h-8 text-green-primary" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
              {avatar.name}
            </h3>
          </div>

          {/* Status Toggle */}
          <div className="flex items-center gap-2 sm:border-l sm:border-gray-200 sm:dark:border-white/10 sm:pl-4">
            <Switch
              checked={avatar.isActive !== false}
              onCheckedChange={handleToggleActive}
            />
            <span
              className={`text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${
                avatar.isActive !== false
                  ? "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400"
                  : "bg-gray-100 text-gray-600 dark:bg-gray-500/10 dark:text-gray-400"
              }`}
            >
              {avatar.isActive !== false ? t("Active") : t("Inactive")}
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:border-l sm:border-gray-200 sm:dark:border-white/10 sm:pl-4">
            <DialogAvatar
              t={t}
              avatar={avatar}
              trigger={
                <Button
                  variant="outline"
                  size="sm"
                  className="border-green-primary text-green-primary hover:bg-green-primary hover:text-white gap-1"
                >
                  <Edit className="w-4 h-4" />
                  {t("Edit")}
                </Button>
              }
              dialogTitle={t("Edit Avatar")}
              onSuccess={(updatedAvatar) => onEdit(avatar.id, updatedAvatar)}
            />

            <Button
              variant="ghost"
              size="icon"
              className="text-gray-500 dark:text-[#677185] hover:text-red-500 hover:bg-red-500/10"
              onClick={() => setShowDeleteDialog(true)}
              disabled={isLoading}
            >
              {isLoading ? <Spinner className="w-4 h-4" /> : <Trash2 className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-white dark:bg-[#0F1017] border-gray-200 dark:border-gray-800">
          <AlertDialogHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-red-100 dark:bg-red-500/10">
                <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <AlertDialogTitle className="text-gray-900 dark:text-white">
                  {t("Delete Avatar")}
                </AlertDialogTitle>
                <AlertDialogDescription className="text-gray-500 dark:text-[#677185] mt-1">
                  {t("Are you sure you want to delete this avatar")}
                </AlertDialogDescription>
              </div>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter className="border-t border-gray-200 dark:border-gray-800 pt-4 mt-2">
            <AlertDialogCancel
              disabled={isLoading}
              className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {t("Cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={handleDelete}
              disabled={isLoading}
            >
              {isLoading ? <Spinner className="w-4 h-4 mr-2" /> : null}
              {t("Delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function AvatarsContainer({ avatars: initialAvatars }) {
  const t = useTranslations("Avatars");
  const router = useRouter();
  const [avatars, setAvatars] = useState(initialAvatars || []);
  const [isPending, startTransition] = useTransition();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const handleRefresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  const handleDelete = (avatarId) => {
    setAvatars((prev) => prev.filter((a) => a.id !== avatarId));
  };

  const handleEdit = (avatarId, updatedData) => {
    setAvatars((prev) =>
      prev.map((a) => (a.id === avatarId ? { ...a, ...updatedData } : a))
    );
  };

  const handleAdd = (newAvatar) => {
    setAvatars((prev) => [...prev, newAvatar]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-green-primary/20 to-green-primary/5 dark:from-green-primary/20 dark:to-green-primary/5">
            <UserCircle className="size-6 text-green-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t("Profile Avatars")}</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t("Managing")} {avatars?.length || 0} {t("avatars")}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            disabled={isPending}
            className="border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <RefreshCw className={`w-4 h-4 ${isPending ? "animate-spin" : ""}`} />
          </Button>
          <DialogAvatar
            t={t}
            trigger={
              <Button className="bg-green-primary hover:bg-green-primary/90 text-white gap-2">
                <Plus className="w-4 h-4" />
                {t("Add New Avatar")}
              </Button>
            }
            dialogTitle={t("Add New Avatar")}
            onSuccess={handleAdd}
          />
        </div>
      </div>

      {/* Avatars List */}
      <div className="space-y-3">
        {!avatars || avatars.length === 0 ? (
          <div className="bg-white dark:bg-[#0F1017] rounded-xl p-12 text-center border border-gray-200 dark:border-white/5">
            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-[#1a1f2e] flex items-center justify-center mx-auto mb-4">
              <UserCircle className="w-8 h-8 text-gray-400 dark:text-[#677185]" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {t("No avatars found")}
            </h3>
            <p className="text-gray-600 dark:text-[#677185] mb-6">{t("Add your first avatar to get started")}</p>
            <DialogAvatar
              t={t}
              trigger={
                <Button className="bg-green-primary hover:bg-green-primary/90 text-white gap-2">
                  <Plus className="w-4 h-4" />
                  {t("Add New Avatar")}
                </Button>
              }
              dialogTitle={t("Add New Avatar")}
              onSuccess={handleAdd}
            />
          </div>
        ) : (
          avatars.map((avatar) => (
            <AvatarCard
              key={avatar.id}
              avatar={avatar}
              onDelete={handleDelete}
              onEdit={handleEdit}
              t={t}
              isDark={isDark}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default AvatarsContainer;
