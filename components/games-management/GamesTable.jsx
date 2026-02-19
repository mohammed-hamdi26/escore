"use client";

import Table from "@/components/ui app/Table";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import GamesFilter from "./GamesFilter";
import Pagination from "../ui app/Pagination";
import { deleteGame, toggleGameActive } from "@/app/[locale]/_Lib/actions";
import { useState } from "react";
import toast from "react-hot-toast";
import DropMenu from "../ui app/DropMenu";
import { EllipsisVertical, Eye, Power, PowerOff, Gamepad2 } from "lucide-react";
import { format } from "date-fns";
import { getImgUrl } from "@/lib/utils";

const columns = [
  { id: "name", header: "Name" },
  { id: "releaseDate", header: "Release Date" },
  { id: "status", header: "Status" },
  { id: "followers", header: "Followers" },
  { id: "actions", header: "Actions" },
];

export default function GamesTable({ games, pagination }) {
  const t = useTranslations("GamesTable");
  const [isLoading, setIsLoading] = useState(false);
  const [togglingId, setTogglingId] = useState(null);
  const numPages = pagination?.totalPages || 1;
  const totalItems = pagination?.total || games.length;

  const handleDelete = async (id, name) => {
    if (!confirm(t("confirmDelete") || `Are you sure you want to delete "${name}"?`)) {
      return;
    }
    try {
      setIsLoading(true);
      await deleteGame(id);
      toast.success(t("deleteSuccess") || "Game deleted successfully");
    } catch (e) {
      toast.error(t("deleteError") || "Failed to delete game");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleActive = async (id) => {
    try {
      setTogglingId(id);
      await toggleGameActive(id);
      toast.success(t("toggleActiveSuccess") || "Status updated");
    } catch (e) {
      toast.error(t("toggleActiveError") || "Failed to update status");
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="space-y-8">
      <GamesFilter numOfSize={totalItems} />

      <Table
        grid_cols="grid-cols-[1.5fr_1fr_0.8fr_0.8fr_2fr]"
        columns={columns}
        t={t}
      >
        {games.map((game) => (
          <Table.Row key={game.id || game._id} grid_cols="grid-cols-[1.5fr_1fr_0.8fr_0.8fr_2fr]">
            <Table.Cell className="flex gap-3 items-center">
              {game?.logo?.light ? (
                <img
                  src={getImgUrl(game.logo.light, "thumbnail")}
                  alt={game.name}
                  className="size-10 rounded-lg object-cover"
                />
              ) : (
                <div className="size-10 rounded-lg bg-green-primary/10 flex items-center justify-center">
                  <Gamepad2 className="size-5 text-green-primary" />
                </div>
              )}
              <div>
                <span className="font-medium">{game?.name}</span>
                {game?.slug && (
                  <p className="text-xs text-muted-foreground">{game.slug}</p>
                )}
              </div>
            </Table.Cell>
            <Table.Cell>
              {game.releaseDate
                ? format(new Date(game.releaseDate), "MMM d, yyyy")
                : "-"}
            </Table.Cell>
            <Table.Cell>
              <span
                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                  game.isActive !== false
                    ? "bg-green-500/10 text-green-500"
                    : "bg-red-500/10 text-red-500"
                }`}
              >
                {game.isActive !== false ? t("active") || "Active" : t("inactive") || "Inactive"}
              </span>
            </Table.Cell>
            <Table.Cell>{game.followersCount || 0}</Table.Cell>
            <Table.Cell className="flex justify-end gap-4">
              <Link href={`/dashboard/games-management/edit/${game.id || game._id}`}>
                <Button
                  disabled={isLoading}
                  className="text-white bg-green-primary rounded-full min-w-[100px] cursor-pointer"
                >
                  {t("Edit") || "Edit"}
                </Button>
              </Link>

              <Button
                disabled={isLoading}
                className="text-white bg-[#3A469D] rounded-full min-w-[100px] cursor-pointer disabled:cursor-not-allowed"
                onClick={() => handleDelete(game.id || game._id, game.name)}
              >
                {t("Delete") || "Delete"}
              </Button>

              <DropMenu
                menuTrigger={<EllipsisVertical />}
                menuContent={[
                  {
                    id: "view",
                    menuItem: (
                      <Link
                        href={`/dashboard/games-management/view/${game.id || game._id}`}
                        className="flex items-center gap-2"
                      >
                        <Eye className="size-4" />
                        <span>{t("viewDetails") || "View Details"}</span>
                      </Link>
                    ),
                  },
                  {
                    id: "toggle",
                    menuItem: (
                      <button
                        onClick={() => handleToggleActive(game.id || game._id)}
                        disabled={togglingId === (game.id || game._id)}
                        className="flex items-center gap-2 w-full"
                      >
                        {game.isActive !== false ? (
                          <>
                            <PowerOff className="size-4 text-red-500" />
                            <span>{t("deactivate") || "Deactivate"}</span>
                          </>
                        ) : (
                          <>
                            <Power className="size-4 text-green-500" />
                            <span>{t("activate") || "Activate"}</span>
                          </>
                        )}
                      </button>
                    ),
                  },
                ]}
              />
            </Table.Cell>
          </Table.Row>
        ))}
      </Table>

      <Pagination numPages={numPages} />
    </div>
  );
}
