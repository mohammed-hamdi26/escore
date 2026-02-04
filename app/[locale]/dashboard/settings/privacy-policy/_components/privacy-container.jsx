"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { Shield, Globe, Languages } from "lucide-react";
import PrivacyEditor from "./privacy-editor";

function PrivacyContainer({ languages }) {
  const t = useTranslations("PrivacyPage");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const [languageCode, setLanguageCode] = useState("");

  const selectedLanguage = languages.find((lang) => lang.code === languageCode);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-500/5">
            <Shield className="size-6 text-purple-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t("Privacy Policy")}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t("Manage privacy policy content for your app")}
            </p>
          </div>
        </div>
      </div>

      {/* Language Selector Card */}
      <div className="bg-white dark:bg-[#0F1017] rounded-xl border border-gray-200 dark:border-white/5 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gray-100 dark:bg-white/5">
              <Languages className="size-5 text-gray-600 dark:text-gray-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {t("Select language")}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {t("Choose a language to edit its content")}
              </p>
            </div>
          </div>
          <div className={`sm:${isRTL ? "mr-auto" : "ml-auto"}`}>
            <Select value={languageCode} onValueChange={(value) => setLanguageCode(value)}>
              <SelectTrigger className="w-[200px] bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <Globe className="size-4 text-gray-500" />
                  <SelectValue placeholder={t("Select language")} />
                </div>
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded uppercase">
                        {lang.code}
                      </span>
                      <span>{lang.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Editor Section */}
      {languageCode ? (
        <div className="bg-white dark:bg-[#0F1017] rounded-xl border border-gray-200 dark:border-white/5 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 dark:border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t("Editing")}: {selectedLanguage?.name || languageCode}
              </span>
              <span className="text-xs font-mono bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded uppercase text-gray-600 dark:text-gray-400">
                {languageCode}
              </span>
            </div>
          </div>
          <PrivacyEditor languageCode={languageCode} />
        </div>
      ) : (
        <div className="bg-white dark:bg-[#0F1017] rounded-xl border border-gray-200 dark:border-white/5 p-12">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
              <Globe className="size-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {t("No language selected")}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
              {t("Select a language from the dropdown above to start editing the privacy policy content")}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default PrivacyContainer;
