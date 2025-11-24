"use client";

import Table from "@/components/ui app/Table";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import ThemeDialog from "./theme-dialog";
import ThemeDeleteDialog from "./theme-delete-dialog";
import { useTranslations } from "next-intl";

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
    <>
      <div className="mb-5">
        <ThemeDialog
          t={t}
          trigger={
            <Button className="text-white text-center min-w-[100px] px-5 py-2 rounded-lg bg-green-primary cursor-pointer hover:bg-[#2ca54d] transition-all duration-300">
              {t("Add new theme")}
            </Button>
          }
          formType="add"
          setThemes={setThemes}
        />
      </div>
      <div>
        {!themes || themes.length === 0 ? (
          <div className="text-center py-8 text-lg text-[#677185] dark:text-white">
            No themes found
          </div>
        ) : (
          <Table
            grid_cols="grid-cols-[0.5fr_0.5fr_0.5fr_2fr]"
            columns={columns}
            t={t}
          >
            {themes.map((theme) => (
              <Table.Row
                key={theme.color}
                grid_cols="grid-cols-[0.5fr_0.5fr_0.5fr_2fr]"
              >
                <Table.Cell>{theme?.color}</Table.Cell>
                <Table.Cell>{theme?.typeTheme}</Table.Cell>
                <Table.Cell>
                  <div
                    className="w-5 h-5 rounded-full"
                    style={{ backgroundColor: theme.color }}
                  />
                </Table.Cell>
                <Table.Cell>
                  <div className="flex justify-end gap-4">
                    <ThemeDialog
                      theme={theme}
                      trigger={
                        <Button className="text-white bg-green-primary hover:bg-[#2ca54d] rounded-full min-w-[100px] cursor-pointer">
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
    </>
  );
}

export default ThemesTable;
