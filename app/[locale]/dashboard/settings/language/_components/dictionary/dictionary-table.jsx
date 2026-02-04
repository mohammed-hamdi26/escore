"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useTransition, useMemo } from "react";
import { useRouter } from "next/navigation";
import DictionaryDeleteDialog from "./dictionary-delete-dialog";
import DictionaryDialog from "./dictionary-dialog";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  Book,
  Plus,
  RefreshCw,
  Edit,
  ArrowLeft,
  Search,
  FileText,
} from "lucide-react";

function WordCard({ word, translation, code, onDelete, onEdit, t }) {
  return (
    <div className="bg-white dark:bg-[#0F1017] rounded-xl overflow-hidden border border-gray-200 dark:border-white/5 hover:border-green-primary/30 dark:hover:ring-1 dark:hover:ring-green-primary/30 transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center p-4 gap-4">
        {/* Word Icon */}
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-500/5 dark:from-blue-500/20 dark:to-blue-500/5 flex items-center justify-center flex-shrink-0">
          <FileText className="w-6 h-6 text-blue-500" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {word}
            </h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
            {translation}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:border-l sm:border-gray-200 sm:dark:border-white/10 sm:pl-4">
          <DictionaryDialog
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
            formType="edit"
            languageCode={code}
            word={word}
            translation={translation}
            setDictionary={onEdit}
          />

          <DictionaryDeleteDialog
            t={t}
            code={code}
            word={word}
            onDelete={onDelete}
          />
        </div>
      </div>
    </div>
  );
}

function DictionaryTable({ code, initialDictionary }) {
  const [dictionary, setDictionary] = useState(initialDictionary || {});
  const [searchQuery, setSearchQuery] = useState("");
  const t = useTranslations("languages");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleDeleteWord = (word) => {
    setDictionary((prev) => {
      const { [word]: _, ...rest } = prev;
      return rest;
    });
  };

  const handleRefresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  // Filter dictionary based on search query
  const filteredEntries = useMemo(() => {
    const entries = Object.entries(dictionary);
    if (!searchQuery.trim()) return entries;

    const query = searchQuery.toLowerCase();
    return entries.filter(
      ([word, translation]) =>
        word.toLowerCase().includes(query) ||
        translation.toLowerCase().includes(query)
    );
  }, [dictionary, searchQuery]);

  const totalCount = Object.keys(dictionary).length;
  const filteredCount = filteredEntries.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/settings/language">
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-green-primary/20 to-green-primary/5 dark:from-green-primary/20 dark:to-green-primary/5">
            <Book className="size-6 text-green-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {t("Dictionary")}
              </h1>
              <span className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-sm font-mono font-medium text-gray-600 dark:text-gray-400 uppercase">
                {code}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t("Managing")} {totalCount} {t("words")}
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
          <DictionaryDialog
            t={t}
            trigger={
              <Button className="bg-green-primary hover:bg-green-primary/90 text-white gap-2">
                <Plus className="w-4 h-4" />
                {t("Add new Word")}
              </Button>
            }
            formType="add"
            languageCode={code}
            setDictionary={setDictionary}
          />
        </div>
      </div>

      {/* Search Bar */}
      {totalCount > 0 && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder={t("SearchWordsPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white dark:bg-[#0F1017] border-gray-200 dark:border-white/10 focus:border-green-primary dark:focus:border-green-primary"
          />
          {searchQuery && (
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {t("Showing")} {filteredCount} {t("of")} {totalCount} {t("words")}
            </p>
          )}
        </div>
      )}

      {/* Words List */}
      <div className="space-y-3">
        {totalCount === 0 ? (
          <div className="bg-white dark:bg-[#0F1017] rounded-xl p-12 text-center border border-gray-200 dark:border-white/5">
            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-[#1a1f2e] flex items-center justify-center mx-auto mb-4">
              <Book className="w-8 h-8 text-gray-400 dark:text-[#677185]" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {t("No words found")}
            </h3>
            <p className="text-gray-600 dark:text-[#677185] mb-6">
              {t("Add your first word to get started")}
            </p>
            <DictionaryDialog
              t={t}
              trigger={
                <Button className="bg-green-primary hover:bg-green-primary/90 text-white gap-2">
                  <Plus className="w-4 h-4" />
                  {t("Add new Word")}
                </Button>
              }
              formType="add"
              languageCode={code}
              setDictionary={setDictionary}
            />
          </div>
        ) : filteredEntries.length === 0 ? (
          <div className="bg-white dark:bg-[#0F1017] rounded-xl p-12 text-center border border-gray-200 dark:border-white/5">
            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-[#1a1f2e] flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400 dark:text-[#677185]" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {t("No results found")}
            </h3>
            <p className="text-gray-600 dark:text-[#677185]">
              {t("Try a different search term")}
            </p>
          </div>
        ) : (
          filteredEntries.map(([word, translation]) => (
            <WordCard
              key={word}
              word={word}
              translation={translation}
              code={code}
              onDelete={handleDeleteWord}
              onEdit={setDictionary}
              t={t}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default DictionaryTable;
