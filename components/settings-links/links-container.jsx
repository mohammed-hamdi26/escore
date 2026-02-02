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
  MoreVertical,
  Globe
} from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
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
import { deleteAppSocialLink } from "@/app/[locale]/_Lib/actions";
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

  return (
    <>
      <div className="bg-dashboard-box dark:bg-[#0F1017] rounded-xl overflow-hidden hover:ring-1 hover:ring-green-primary/30 transition-all">
        <div className="flex items-center p-4 gap-4">
          {/* Icon/Image */}
          <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#1a1f2e] flex items-center justify-center flex-shrink-0">
            {imageUrl ? (
              <Image
                src={imageUrl}
                width={56}
                height={56}
                alt={link.name || "Social link"}
                className="object-contain w-full h-full p-2"
              />
            ) : (
              <Globe className="w-6 h-6 text-[#677185]" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-white truncate">
              {link.name}
            </h3>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[#677185] hover:text-green-primary truncate block max-w-md transition-colors"
            >
              {link.url}
            </a>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg text-[#677185] hover:text-white hover:bg-white/5 transition-colors"
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
                  className="border-green-primary text-green-primary hover:bg-green-primary hover:text-white"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  {t("Edit")}
                </Button>
              }
              dialogTitle={t("Edit Link")}
              onSuccess={(updatedLink) => onEdit(link.id, updatedLink)}
            />

            <Button
              variant="ghost"
              size="icon"
              className="text-[#677185] hover:text-red-400 hover:bg-red-400/10"
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
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("Delete Link")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("Are you sure you want to delete this link")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>{t("Cancel")}</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
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
        <div>
          <h1 className="text-2xl font-bold text-white">{t("Social Links")}</h1>
          <p className="text-[#677185] mt-1">{t("Manage your social media links")}</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            disabled={isPending}
            className="border-[#677185] text-[#677185] hover:text-white"
          >
            <RefreshCw className={`w-4 h-4 ${isPending ? "animate-spin" : ""}`} />
          </Button>
          <DialogLinks
            t={t}
            trigger={
              <Button className="bg-green-primary hover:bg-green-primary/80 text-white">
                <Plus className="w-4 h-4 mr-2" />
                {t("Add New Link")}
              </Button>
            }
            dialogTitle={t("Add New Link")}
            onSuccess={handleAdd}
          />
        </div>
      </div>

      {/* Links List */}
      <div className="space-y-4">
        {!links || links.length === 0 ? (
          <div className="bg-dashboard-box dark:bg-[#0F1017] rounded-xl p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-[#1a1f2e] flex items-center justify-center mx-auto mb-4">
              <Link2 className="w-8 h-8 text-[#677185]" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {t("No links found")}
            </h3>
            <p className="text-[#677185] mb-6">{t("Add your first social link to get started")}</p>
            <DialogLinks
              t={t}
              trigger={
                <Button className="bg-green-primary hover:bg-green-primary/80 text-white">
                  <Plus className="w-4 h-4 mr-2" />
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
