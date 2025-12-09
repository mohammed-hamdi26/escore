"use client";

import Table from "@/components/ui app/Table";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import ThemeDialog from "./theme-dialog";
import ThemeDeleteDialog from "./theme-delete-dialog";
import { useTranslations } from "next-intl";
import { Palette } from "lucide-react";

const columns = [
  { id: "color-code", header: "Color Code" },
  { id: "theme-type", header: "Theme Type" },
  { id: "color", header: "Color" },
];

function ThemesTable({ initialThemes }) {
  const [themes, setThemes] = useState(initialThemes || []);
  const handleDeleteTheme = (theme_id) => {
    setThemes((prevThemes) =>
      prevThemes.filter((theme) => theme.id !== theme_id)
    );
  };
  const t = useTranslations("themes");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          {t("Themes")}
        </h2>
        <ThemeDialog
          t={t}
          trigger={
            <Button className="text-white text-center min-w-[100px] px-5 py-2 rounded-lg bg-green-primary cursor-pointer hover:bg-green-primary/80 transition-colors duration-300">
              {t("Add new theme")}
            </Button>
          }
          formType="add"
          setThemes={setThemes}
        />
      </div>

      {!themes || themes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-500 dark:text-gray-400">
          <Palette className="w-16 h-16 mb-4 opacity-50" />
          <p className="text-lg font-medium">{t("No themes found")}</p>
          <p className="text-sm mt-1">{t("Add your first theme to get started")}</p>
        </div>
      ) : (
        <Table
          grid_cols="grid-cols-[1fr_1fr_0.5fr_auto]"
          columns={columns}
          t={t}
        >
          {themes.map((theme) => (
            <Table.Row
              key={theme.id || theme.color}
              grid_cols="grid-cols-[1fr_1fr_0.5fr_auto]"
            >
              <Table.Cell>
                <code className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-sm font-mono">
                  {theme?.color}
                </code>
              </Table.Cell>
              <Table.Cell>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  theme?.typeTheme === "dark"
                    ? "bg-gray-800 text-white"
                    : "bg-gray-100 text-gray-800 dark:bg-gray-200"
                }`}>
                  {theme?.typeTheme === "dark" ? t("Dark") : t("Light")}
                </span>
              </Table.Cell>
              <Table.Cell>
                <div
                  className="w-8 h-8 rounded-lg border-2 border-gray-200 dark:border-gray-700 shadow-sm"
                  style={{ backgroundColor: theme.color }}
                  title={theme.color}
                />
              </Table.Cell>
              <Table.Cell>
                <div className="flex justify-end gap-2">
                  <ThemeDialog
                    theme={theme}
                    trigger={
                      <Button className="text-white bg-green-primary hover:bg-green-primary/80 rounded-full min-w-[80px] cursor-pointer">
                        {t("Edit")}
                      </Button>
                    }
                    t={t}
                    formType="edit"
                    setThemes={setThemes}
                    currentTheme={theme}
                  />
                  <ThemeDeleteDialog
                    t={t}
                    onDelete={handleDeleteTheme}
                    theme_id={theme.id}
                  />
                </div>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table>
      )}
    </div>
  );
}

export default ThemesTable;
