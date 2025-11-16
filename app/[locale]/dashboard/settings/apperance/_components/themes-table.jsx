"use client";

import { getAllThemes } from "@/app/[locale]/_Lib/themesApi";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Table from "@/components/ui app/Table";
import { cn } from "@/lib/utils";
import ThemeForm from './theme-form';
import ThemeDialog from './theme-dialog';

const columns = [
  { id: "color-code", header: "Color Code" },
  { id: "theme-type", header: "theme-type" },
  { id: "color", header: "Color" },
];
function ThemesTable({ initialThemes }) {
  const [themes, setThemes] = useState(initialThemes || []);
  async function handleAddOrUpdateTheme() {
    try {
      const { data: themes } = await getAllThemes();
      setThemes(themes);
    } catch {
      throw new Error("Failed to refresh themes");
    }
  }
  return (
    <>
      <div className='mb-5'>
        <ThemeDialog trigger={
            <Button className="text-white text-center min-w-[100px] px-5 py-2 rounded-lg bg-green-primary cursor-pointer hover:bg-green-primary/80 transition-all duration-300">
              Add new theme
            </Button>
          } 
          formType='add'
          onSucess={handleAddOrUpdateTheme}
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
          >
            {themes.map(theme => (
              <Table.Row
                key={theme.color}
                grid_cols="grid-cols-[0.5fr_0.5fr_0.5fr_2fr]"
              >
                <Table.Cell>{theme?.color}</Table.Cell>
                <Table.Cell>{theme?.type_theme}</Table.Cell>
                <Table.Cell>
                  <div className="w-5 h-5 rounded-full" style={{ backgroundColor: theme.color }}/>
                </Table.Cell>
                {/* <Table.Cell>
                  <div className="flex justify-end gap-4">
                    <Link href={`/dashboard/settings/language/${theme?.code}`}>
                      <Button className="text-white bg-green-primary rounded-full min-w-[100px] cursor-pointer">
                        Dictionary
                      </Button>
                    </Link>
                    <LanguageDialog
                      trigger={
                        <Button className="text-white bg-green-primary rounded-full min-w-[100px] cursor-pointer">
                          Edit
                        </Button>
                      }
                      formType="update"
                      languageCode={lang.code}
                      onSuccess={handleLanguageAddedOrUpdated}
                    />
                    <LanguageDeleteDialog
                      code={lang.code}
                      onDelete={handleLanguageDeleted}
                    />
                  </div>
                </Table.Cell> */}
              </Table.Row>
            ))}
          </Table>
        )}
      </div>
    </>
  );
}

export default ThemesTable;
