"use client";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Languages, RefreshCw, Book, Edit, Plus, Globe } from "lucide-react";
import LanguageDeleteDialog from "./language-delete-dialog";
import LanguageDialog from "./language-dialog";
import { updateLanguage } from "@/app/[locale]/_Lib/actions";
import toast from "react-hot-toast";

function LanguageCard({ lang, onDelete, onEdit, t }) {
  const handleToggleActive = async (isActive) => {
    try {
      await updateLanguage(lang.code, { isActive });
      onEdit(lang.code, { isActive });
      toast.success(isActive ? t("Language enabled") : t("Language disabled"));
    } catch (e) {
      toast.error(t("Failed to update language status"));
    }
  };

  return (
    <div className="bg-white dark:bg-[#0F1017] rounded-xl overflow-hidden border border-gray-200 dark:border-white/5 hover:border-green-primary/30 dark:hover:ring-1 dark:hover:ring-green-primary/30 transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center p-4 gap-4">
        {/* Language Icon */}
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-primary/20 to-green-primary/5 dark:from-green-primary/20 dark:to-green-primary/5 flex items-center justify-center flex-shrink-0">
          <Globe className="w-7 h-7 text-green-primary" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {lang.name}
            </h3>
            <span className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-xs font-mono font-medium text-gray-600 dark:text-gray-400">
              {lang.code}
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {lang.nameLocal}
          </p>
        </div>

        {/* Status Toggle */}
        <div className="flex items-center gap-2 sm:border-l sm:border-gray-200 sm:dark:border-white/10 sm:pl-4">
          <Switch
            checked={lang.isActive !== false}
            onCheckedChange={handleToggleActive}
          />
          <span
            className={`text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${
              lang.isActive !== false
                ? "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400"
                : "bg-gray-100 text-gray-600 dark:bg-gray-500/10 dark:text-gray-400"
            }`}
          >
            {lang.isActive !== false ? t("Active") : t("Inactive")}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:border-l sm:border-gray-200 sm:dark:border-white/10 sm:pl-4">
          <Link href={`/dashboard/settings/language/${lang.code}`}>
            <Button
              variant="outline"
              size="sm"
              className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white gap-1"
            >
              <Book className="w-4 h-4" />
              {t("Dictionary")}
            </Button>
          </Link>

          <LanguageDialog
            t={t}
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
            formType="update"
            languageOptions={lang}
            onSuccess={(updatedLang) => onEdit(lang.code, updatedLang)}
          />

          <LanguageDeleteDialog
            t={t}
            code={lang.code}
            onDelete={onDelete}
          />
        </div>
      </div>
    </div>
  );
}

function LanguagesTable({ initialLanguages }) {
  const [languagesTable, setLanguagesTable] = useState(initialLanguages || []);
  const t = useTranslations("LanguagesTable");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleLanguageDeleted = (deletedCode) => {
    setLanguagesTable((prev) => prev.filter((lang) => lang.code !== deletedCode));
  };

  const handleRefresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  const handleEdit = (code, updatedData) => {
    setLanguagesTable((prev) =>
      prev.map((lang) => (lang.code === code ? { ...lang, ...updatedData } : lang))
    );
  };

  const handleAdd = (newLang) => {
    setLanguagesTable((prev) => [...prev, newLang]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-green-primary/10">
            <Languages className="size-6 text-green-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t("Languages")}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t("Managing")} {languagesTable?.length || 0} {t("languages")}
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
          <LanguageDialog
            t={t}
            trigger={
              <Button className="bg-green-primary hover:bg-green-primary/90 text-white gap-2">
                <Plus className="w-4 h-4" />
                {t("Add new language")}
              </Button>
            }
            formType="add"
            onSuccess={handleAdd}
            setLanguagesTable={setLanguagesTable}
          />
        </div>
      </div>

      {/* Languages List */}
      <div className="space-y-3">
        {!languagesTable || languagesTable.length === 0 ? (
          <div className="bg-white dark:bg-[#0F1017] rounded-xl p-12 text-center border border-gray-200 dark:border-white/5">
            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-[#1a1f2e] flex items-center justify-center mx-auto mb-4">
              <Languages className="w-8 h-8 text-gray-400 dark:text-[#677185]" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {t("No languages found")}
            </h3>
            <p className="text-gray-600 dark:text-[#677185] mb-6">
              {t("Add your first language to get started")}
            </p>
            <LanguageDialog
              t={t}
              trigger={
                <Button className="bg-green-primary hover:bg-green-primary/90 text-white gap-2">
                  <Plus className="w-4 h-4" />
                  {t("Add new language")}
                </Button>
              }
              formType="add"
              onSuccess={handleAdd}
              setLanguagesTable={setLanguagesTable}
            />
          </div>
        ) : (
          languagesTable.map((lang) => (
            <LanguageCard
              key={lang.code}
              lang={lang}
              onDelete={handleLanguageDeleted}
              onEdit={handleEdit}
              t={t}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default LanguagesTable;
