"use client";
import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";
import { deleteLink, editLinks } from "@/app/[locale]/_Lib/actions";
import toast from "react-hot-toast";
import LinksForm from "./LinksForm";
import {
  Edit,
  ExternalLink,
  Link2,
  MoreVertical,
  Trash2,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Spinner } from "../ui/spinner";
import { getImgUrl } from "@/lib/utils";

function LinksTable({ links, numOfLinks, idUser, linksType = "players" }) {
  const t = useTranslations("Links");
  const locale = useLocale();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingId, setLoadingId] = useState(null);
  const [togglingId, setTogglingId] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editLink, setEditLink] = useState(null);

  const handleDelete = async (linkId) => {
    if (!confirm(t("confirmDelete") || "Are you sure you want to delete this link?")) {
      return;
    }

    try {
      setIsLoading(true);
      setLoadingId(linkId);
      await deleteLink(linksType, idUser, linkId);
      toast.success(t("Link deleted successfully") || "Link deleted successfully");
    } catch (e) {
      toast.error(t("Error deleting link") || "Error deleting link");
    } finally {
      setIsLoading(false);
      setLoadingId(null);
    }
  };

  const handleEdit = (link) => {
    setEditLink(link);
    setEditOpen(true);
  };

  const handleToggleActive = async (link) => {
    try {
      setTogglingId(link.id);
      const linkData = {
        id: link.id,
        name: link.name,
        url: link.url,
        image: link.image,
        isActive: !link.isActive,
      };
      await editLinks(linksType, idUser, linkData);
      toast.success(
        link.isActive
          ? t("Link hidden successfully") || "Link hidden"
          : t("Link shown successfully") || "Link visible"
      );
    } catch (e) {
      toast.error(t("Error updating link") || "Error updating link");
    } finally {
      setTogglingId(null);
    }
  };

  if (!links || links.length === 0) {
    return (
      <div className="bg-dashboard-box dark:bg-[#0F1017] rounded-xl p-12 text-center">
        <Link2 className="size-16 mx-auto mb-4 text-[#677185]" />
        <h3 className="text-xl font-semibold text-foreground mb-2">
          {t("noLinks") || "No Links"}
        </h3>
        <p className="text-muted-foreground">
          {t("noLinksDescription") || "Add social links to display them here."}
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Links Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {links.map((link) => {
          const linkImage = getImgUrl(link.image?.light) || getImgUrl(link.image?.dark);
          const isActive = link.isActive !== false; // Default to true if not set

          return (
            <div
              key={link.id}
              className={`group bg-dashboard-box dark:bg-[#0F1017] rounded-xl overflow-hidden transition-all ${
                isActive
                  ? "hover:ring-1 hover:ring-blue-500/30"
                  : "opacity-60 hover:opacity-80"
              }`}
            >
              {/* Link Header */}
              <div className="flex items-center justify-between p-4 border-b border-white/5">
                <div className="flex items-center gap-3 min-w-0">
                  {linkImage ? (
                    <img
                      src={linkImage}
                      alt={link.name}
                      className="size-10 rounded-lg object-contain bg-white/5 p-1"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="size-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <Link2 className="size-5 text-blue-500" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <h3 className="font-semibold text-foreground truncate">
                      {link.name}
                    </h3>
                    <div className="flex items-center gap-1.5">
                      {isActive ? (
                        <Eye className="size-3 text-green-500" />
                      ) : (
                        <EyeOff className="size-3 text-muted-foreground" />
                      )}
                      <span className="text-xs text-muted-foreground">
                        {isActive
                          ? t("visible") || "Visible"
                          : t("hidden") || "Hidden"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-[#677185] hover:text-white size-8"
                      disabled={isLoading && loadingId === link.id}
                    >
                      {isLoading && loadingId === link.id ? (
                        <Spinner className="size-4" />
                      ) : (
                        <MoreVertical className="size-4" />
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => handleEdit(link)}
                    >
                      <Edit className="size-4 mr-2" />
                      {t("Edit")}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => window.open(link.url, "_blank")}
                    >
                      <ExternalLink className="size-4 mr-2" />
                      {t("openLink") || "Open Link"}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="cursor-pointer text-red-400 focus:text-red-400"
                      onClick={() => handleDelete(link.id)}
                      disabled={isLoading}
                    >
                      <Trash2 className="size-4 mr-2" />
                      {t("Delete")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Link URL */}
              <div className="p-4 space-y-3">
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-400 hover:text-blue-300 hover:underline truncate block"
                >
                  {link.url}
                </a>

                {/* Visibility Toggle */}
                <div className="flex items-center justify-between pt-3 border-t border-white/5">
                  <span className="text-xs text-muted-foreground">
                    {t("showInApp") || "Show in app"}
                  </span>
                  <Switch
                    checked={isActive}
                    onCheckedChange={() => handleToggleActive(link)}
                    disabled={togglingId === link.id}
                    className="data-[state=checked]:bg-green-500"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent
          dir={locale === "en" ? "ltr" : "rtl"}
          className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto"
        >
          <DialogTitle className="flex items-center gap-2">
            <Edit className="size-5 text-green-primary" />
            {t("Edit Link") || "Edit Link"}
          </DialogTitle>
          {editLink && (
            <LinksForm
              link={editLink}
              id={idUser}
              setOpen={setEditOpen}
              linksType={linksType}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default LinksTable;
