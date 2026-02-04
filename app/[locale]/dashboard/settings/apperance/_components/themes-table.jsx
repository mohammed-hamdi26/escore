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
import { Switch } from "@/components/ui/switch";
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
import { deleteTheme, updateTheme } from "@/app/[locale]/_Lib/actions";
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

  const handleToggleActive = async (isActive) => {
    try {
      await updateTheme({ isActive }, theme.id);
      onEdit(theme.id, { isActive });
      toast.success(isActive ? t("Theme enabled") : t("Theme disabled"));
    } catch (e) {
      toast.error(t("Failed to update theme status"));
    }
  };

  return (
    <>
      <div className="bg-white dark:bg-[#0F1017] rounded-xl overflow-hidden border border-gray-200 dark:border-white/5 hover:border-green-primary/30 dark:hover:ring-1 dark:hover:ring-green-primary/30 transition-all">
        <div className="flex flex-col sm:flex-row sm:items-center p-4 gap-4">
          {/* Color Preview */}
          <div
            className="w-14 h-14 rounded-xl flex-shrink-0 shadow-lg ring-2 ring-white/20 dark:ring-white/10"
            style={{ backgroundColor: theme.color }}
          />

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <code className="text-lg font-mono font-semibold text-gray-900 dark:text-white">
                {theme.color}
              </code>
            </div>
            <div className="flex items-center gap-2">
              {isDark ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
                  <Moon className="w-3 h-3" />
                  {t("Dark")}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400">
                  <Sun className="w-3 h-3" />
                  {t("Light")}
                </span>
              )}
            </div>
          </div>

          {/* Status Toggle */}
          <div className="flex items-center gap-2 sm:border-l sm:border-gray-200 sm:dark:border-white/10 sm:pl-4">
            <Switch
              checked={theme.isActive !== false}
              onCheckedChange={handleToggleActive}
            />
            <span
              className={`text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${
                theme.isActive !== false
                  ? "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400"
                  : "bg-gray-100 text-gray-600 dark:bg-gray-500/10 dark:text-gray-400"
              }`}
            >
              {theme.isActive !== false ? t("Active") : t("Inactive")}
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:border-l sm:border-gray-200 sm:dark:border-white/10 sm:pl-4">
            <ThemeDialog
              theme={theme}
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
              t={t}
              formType="edit"
              onSuccess={(updatedTheme) => onEdit(theme.id, updatedTheme)}
              currentTheme={theme}
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
                  {t("DialogDeleteTitle")}
                </AlertDialogTitle>
                <AlertDialogDescription className="text-gray-500 dark:text-[#677185] mt-1">
                  {t("DialogDeleteDescription")}
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
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-green-primary/20 to-green-primary/5 dark:from-green-primary/20 dark:to-green-primary/5">
            <Palette className="size-6 text-green-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t("Themes")}</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t("Managing")} {themes?.length || 0} {t("themes")}
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
          <ThemeDialog
            t={t}
            trigger={
              <Button className="bg-green-primary hover:bg-green-primary/90 text-white gap-2">
                <Plus className="w-4 h-4" />
                {t("Add new theme")}
              </Button>
            }
            formType="add"
            onSuccess={handleAdd}
          />
        </div>
      </div>

      {/* Themes List */}
      <div className="space-y-3">
        {!themes || themes.length === 0 ? (
          <div className="bg-white dark:bg-[#0F1017] rounded-xl p-12 text-center border border-gray-200 dark:border-white/5">
            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-[#1a1f2e] flex items-center justify-center mx-auto mb-4">
              <Palette className="w-8 h-8 text-gray-400 dark:text-[#677185]" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {t("No themes found")}
            </h3>
            <p className="text-gray-600 dark:text-[#677185] mb-6">{t("Add your first theme to get started")}</p>
            <ThemeDialog
              t={t}
              trigger={
                <Button className="bg-green-primary hover:bg-green-primary/90 text-white gap-2">
                  <Plus className="w-4 h-4" />
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
