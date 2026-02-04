"use client";
import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Link2,
  Plus,
  RefreshCw,
  Edit,
  Trash2,
  ExternalLink,
  Globe
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
import { deleteAppSocialLink, updateAppSocialLink } from "@/app/[locale]/_Lib/actions";
import toast from "react-hot-toast";
import { useTheme } from "next-themes";
import DialogLinks from "./DialogLinks";
import { Spinner } from "../ui/spinner";

function LinkCard({ link, onDelete, onEdit, t, isDark }) {
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const getImageUrl = () => {
    if (!link?.image) return null;
    const imageUrl = isDark ? (link.image.dark || link.image.light) : link.image.light;
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
      await deleteAppSocialLink(link.id);
      onDelete(link.id);
      toast.success(t("The Link is Deleted"));
    } catch (e) {
      toast.error(t("error in Delete"));
    } finally {
      setIsLoading(false);
      setShowDeleteDialog(false);
    }
  };

  const handleToggleActive = async (isActive) => {
    try {
      await updateAppSocialLink({ id: link.id, isActive });
      onEdit(link.id, { isActive });
      toast.success(isActive ? t("Link enabled") : t("Link disabled"));
    } catch (e) {
      toast.error(t("Failed to update link status"));
    }
  };

  return (
    <>
      <div className="bg-white dark:bg-[#0F1017] rounded-xl overflow-hidden border border-gray-200 dark:border-white/5 hover:border-green-primary/30 dark:hover:ring-1 dark:hover:ring-green-primary/30 transition-all">
        <div className="flex flex-col sm:flex-row sm:items-center p-4 gap-4">
          {/* Icon/Image */}
          <div className="w-14 h-14 rounded-xl overflow-hidden bg-gradient-to-br from-green-primary/20 to-green-primary/5 dark:from-green-primary/20 dark:to-green-primary/5 flex items-center justify-center flex-shrink-0">
            {imageUrl ? (
              <Image
                src={imageUrl}
                width={56}
                height={56}
                alt={link.name || "Social link"}
                className="object-contain w-full h-full p-2"
              />
            ) : (
              <Globe className="w-7 h-7 text-green-primary" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
              {link.name}
            </h3>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-600 dark:text-[#677185] hover:text-green-primary truncate block max-w-md transition-colors"
            >
              {link.url}
            </a>
          </div>

          {/* Status Toggle */}
          <div className="flex items-center gap-2 sm:border-l sm:border-gray-200 sm:dark:border-white/10 sm:pl-4">
            <Switch
              checked={link.isActive !== false}
              onCheckedChange={handleToggleActive}
            />
            <span
              className={`text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${
                link.isActive !== false
                  ? "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400"
                  : "bg-gray-100 text-gray-600 dark:bg-gray-500/10 dark:text-gray-400"
              }`}
            >
              {link.isActive !== false ? t("Active") : t("Inactive")}
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:border-l sm:border-gray-200 sm:dark:border-white/10 sm:pl-4">
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg text-gray-500 dark:text-[#677185] hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
            </a>

            <DialogLinks
              t={t}
              link={link}
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
              dialogTitle={t("Edit Link")}
              onSuccess={(updatedLink) => onEdit(link.id, updatedLink)}
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
                  {t("Delete Link")}
                </AlertDialogTitle>
                <AlertDialogDescription className="text-gray-500 dark:text-[#677185] mt-1">
                  {t("Are you sure you want to delete this link")}
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

function LinksContainer({ links: initialLinks }) {
  const t = useTranslations("LinksApp");
  const router = useRouter();
  const [links, setLinks] = useState(initialLinks || []);
  const [isPending, startTransition] = useTransition();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const handleRefresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  const handleDelete = (linkId) => {
    setLinks((prev) => prev.filter((l) => l.id !== linkId));
  };

  const handleEdit = (linkId, updatedData) => {
    setLinks((prev) =>
      prev.map((l) => (l.id === linkId ? { ...l, ...updatedData } : l))
    );
  };

  const handleAdd = (newLink) => {
    setLinks((prev) => [...prev, newLink]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-green-primary/20 to-green-primary/5 dark:from-green-primary/20 dark:to-green-primary/5">
            <Link2 className="size-6 text-green-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t("Social Links")}</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t("Managing")} {links?.length || 0} {t("links")}
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
          <DialogLinks
            t={t}
            trigger={
              <Button className="bg-green-primary hover:bg-green-primary/90 text-white gap-2">
                <Plus className="w-4 h-4" />
                {t("Add New Link")}
              </Button>
            }
            dialogTitle={t("Add New Link")}
            onSuccess={handleAdd}
          />
        </div>
      </div>

      {/* Links List */}
      <div className="space-y-3">
        {!links || links.length === 0 ? (
          <div className="bg-white dark:bg-[#0F1017] rounded-xl p-12 text-center border border-gray-200 dark:border-white/5">
            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-[#1a1f2e] flex items-center justify-center mx-auto mb-4">
              <Link2 className="w-8 h-8 text-gray-400 dark:text-[#677185]" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {t("No links found")}
            </h3>
            <p className="text-gray-600 dark:text-[#677185] mb-6">{t("Add your first social link to get started")}</p>
            <DialogLinks
              t={t}
              trigger={
                <Button className="bg-green-primary hover:bg-green-primary/90 text-white gap-2">
                  <Plus className="w-4 h-4" />
                  {t("Add New Link")}
                </Button>
              }
              dialogTitle={t("Add New Link")}
              onSuccess={handleAdd}
            />
          </div>
        ) : (
          links.map((link) => (
            <LinkCard
              key={link.id}
              link={link}
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

export default LinksContainer;
