"use client";
import Table from "@/components/ui app/Table";
import { useTranslations } from "next-intl";

import DialogLinks from "./DialogLinks";
import Image from "next/image";
import { Button } from "../ui/button";
import { useState } from "react";
import { deleteAppSocialLink } from "@/app/[locale]/_Lib/actions";
import toast from "react-hot-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useTheme } from "next-themes";
import { Link2, Trash2 } from "lucide-react";

function LinksContainer({ links: initialLinks }) {
  const t = useTranslations("LinksApp");
  const [links, setLinks] = useState(initialLinks || []);
  const [deletingId, setDeletingId] = useState(null);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const getImageUrl = (link) => {
    if (!link?.image) return null;
    const imageUrl = isDark ? (link.image.dark || link.image.light) : link.image.light;
    if (!imageUrl) return null;
    // If it's already a full URL, return as-is
    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
      return imageUrl;
    }
    // Otherwise, prepend the base URL
    return `${process.env.NEXT_PUBLIC_BASE_URL}${imageUrl}`;
  };

  const handleDelete = async (linkId) => {
    try {
      setDeletingId(linkId);
      await deleteAppSocialLink(linkId);
      setLinks((prev) => prev.filter((l) => l.id !== linkId));
      toast.success(t("The Link is Deleted"));
    } catch (e) {
      toast.error(t("error in Delete"));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          {t("Social Links")}
        </h2>
        <DialogLinks
          trigger={
            <Button
              className="text-white text-center w-fit min-w-[100px] px-5 py-2 rounded-lg bg-green-primary cursor-pointer hover:bg-green-primary/80 transition-colors duration-300"
            >
              {t("Add New Link")}
            </Button>
          }
          dialogTitle={t("Add New Link")}
          t={t}
          setLinks={setLinks}
        />
      </div>

      {!links || links.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-500 dark:text-gray-400">
          <Link2 className="w-16 h-16 mb-4 opacity-50" />
          <p className="text-lg font-medium">{t("No links found")}</p>
          <p className="text-sm mt-1">{t("Add your first social link to get started")}</p>
        </div>
      ) : (
        <Table
          t={t}
          grid_cols="grid-cols-[1fr_1.5fr_auto]"
          columns={[
            { id: "name", header: "name" },
            { id: "link", header: "Link" },
          ]}
        >
          {links.map((link) => {
            const imageUrl = getImageUrl(link);
            return (
              <Table.Row key={link.id} grid_cols="grid-cols-[1fr_1.5fr_auto]">
                <Table.Cell className="flex gap-3 items-center">
                  {imageUrl ? (
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                      <Image
                        src={imageUrl}
                        width={40}
                        height={40}
                        alt={link.name || "Social link"}
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                      <Link2 className="w-5 h-5 text-gray-400" />
                    </div>
                  )}
                  <span className="font-medium text-gray-800 dark:text-white">
                    {link.name}
                  </span>
                </Table.Cell>
                <Table.Cell>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline truncate block max-w-[300px]"
                  >
                    {link.url}
                  </a>
                </Table.Cell>
                <Table.Cell className="flex gap-2 items-center justify-end">
                  <DialogLinks
                    t={t}
                    link={link}
                    trigger={
                      <Button className="text-white bg-green-primary rounded-full min-w-[80px] cursor-pointer hover:bg-green-primary/80">
                        {t("Edit")}
                      </Button>
                    }
                    dialogTitle={t("Edit Link")}
                    setLinks={setLinks}
                  />
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        disabled={deletingId === link.id}
                        variant="destructive"
                        className="rounded-full min-w-[80px] cursor-pointer"
                      >
                        {deletingId === link.id ? (
                          <span className="animate-spin">...</span>
                        ) : (
                          <>
                            <Trash2 className="w-4 h-4 mr-1" />
                            {t("Delete")}
                          </>
                        )}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          {t("Delete Link")}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          {t("Are you sure you want to delete this link? This action cannot be undone.")}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>{t("Cancel")}</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-red-600 hover:bg-red-700"
                          onClick={() => handleDelete(link.id)}
                        >
                          {t("Delete")}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table>
      )}
    </div>
  );
}

export default LinksContainer;
