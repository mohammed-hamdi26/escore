"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  Palette,
  Plus,
  RefreshCw,
  Edit,
  Trash2,
  Sun,
  Moon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
import ThemeDialog from "./theme-dialog";
import { deleteTheme } from "@/app/[locale]/_Lib/actions";
import toast from "react-hot-toast";
import { Spinner } from "@/components/ui/spinner";

function ThemeCard({ theme, onDelete, onEdit, t }) {
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const isDark = theme.typeTheme === "dark";

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await deleteTheme(theme.id);
      onDelete(theme.id);
      toast.success(t("Theme deleted successfully"));
    } catch (e) {
      toast.error(t("Failed to delete theme"));
    } finally {
      setIsLoading(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <>
      <div className="bg-dashboard-box dark:bg-[#0F1017] rounded-xl overflow-hidden hover:ring-1 hover:ring-green-primary/30 transition-all">
        <div className="flex items-center p-4 gap-4">
          {/* Color Preview */}
          <div
            className="w-14 h-14 rounded-xl flex-shrink-0 shadow-lg border-2 border-gray-700"
            style={{ backgroundColor: theme.color }}
          />

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <code className="text-lg font-mono font-semibold text-white">
                {theme.color}
              </code>
            </div>
            <div className="flex items-center gap-2">
              {isDark ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-800 text-gray-200">
                  <Moon className="w-3 h-3" />
                  {t("Dark")}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-400">
                  <Sun className="w-3 h-3" />
                  {t("Light")}
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <ThemeDialog
              theme={theme}
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
              t={t}
              formType="edit"
              onSuccess={(updatedTheme) => onEdit(theme.id, updatedTheme)}
              currentTheme={theme}
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
            <AlertDialogTitle>{t("DialogDeleteTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("DialogDeleteDescription")}
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

function ThemesTable({ initialThemes }) {
  const t = useTranslations("themes");
  const router = useRouter();
  const [themes, setThemes] = useState(initialThemes || []);
  const [isPending, startTransition] = useTransition();

  const handleRefresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  const handleDelete = (themeId) => {
    setThemes((prev) => prev.filter((t) => t.id !== themeId));
  };

  const handleEdit = (themeId, updatedData) => {
    setThemes((prev) =>
      prev.map((t) => (t.id === themeId ? { ...t, ...updatedData } : t))
    );
  };

  const handleAdd = (newTheme) => {
    setThemes((prev) => [newTheme, ...prev]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">{t("Themes")}</h1>
          <p className="text-[#677185] mt-1">{t("Manage app color themes")}</p>
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
          <ThemeDialog
            t={t}
            trigger={
              <Button className="bg-green-primary hover:bg-green-primary/80 text-white">
                <Plus className="w-4 h-4 mr-2" />
                {t("Add new theme")}
              </Button>
            }
            formType="add"
            onSuccess={handleAdd}
          />
        </div>
      </div>

      {/* Themes List */}
      <div className="space-y-4">
        {!themes || themes.length === 0 ? (
          <div className="bg-dashboard-box dark:bg-[#0F1017] rounded-xl p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-[#1a1f2e] flex items-center justify-center mx-auto mb-4">
              <Palette className="w-8 h-8 text-[#677185]" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {t("No themes found")}
            </h3>
            <p className="text-[#677185] mb-6">{t("Add your first theme to get started")}</p>
            <ThemeDialog
              t={t}
              trigger={
                <Button className="bg-green-primary hover:bg-green-primary/80 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  {t("Add new theme")}
                </Button>
              }
              formType="add"
              onSuccess={handleAdd}
            />
          </div>
        ) : (
          themes.map((theme) => (
            <ThemeCard
              key={theme.id || theme.color}
              theme={theme}
              onDelete={handleDelete}
              onEdit={handleEdit}
              t={t}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default ThemesTable;
