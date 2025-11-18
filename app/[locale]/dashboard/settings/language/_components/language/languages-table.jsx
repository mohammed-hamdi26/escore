"use client";
import Table from "@/components/ui app/Table";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import LanguageDeleteDialog from "./language-delete-dialog";
import LanguageDialog from "./language-dialog";

const columns = [
  { id: "code", header: "Code" },
  { id: "name", header: "Name" },
  { id: "name_local", header: "Local name" },
];

function LanguagesTable({ initialLanguages }) {
  const [languagesTable, setLanguagesTable] = useState(initialLanguages || []);
  const t = useTranslations("LanguagesTable");

  const handleLanguageDeleted = deletedCode => {
    setLanguagesTable(prevLanguages =>
      prevLanguages.filter(lang => lang.code !== deletedCode)
    );
  };

  return (
    <>
      <div className="mb-5">
        <LanguageDialog
          trigger={
            <Button
              className={
                "text-white  text-center min-w-[100px]  px-5 py-2 rounded-lg bg-green-primary cursor-pointer hover:bg-green-primary/80 transition-all duration-300"
              }
            >
              {t("Add new language")}
            </Button>
          }
          formType="add"
          setLanguagesTable={setLanguagesTable}
        />
      </div>
      {!languagesTable || languagesTable.length === 0 ? (
        <div className="text-center py-8 text-lg text-[#677185] dark:text-white">
          No languages found
        </div>
      ) : (
        <Table
          t={t}
          grid_cols="grid-cols-[0.5fr_0.5fr_0.5fr_2fr]"
          columns={columns}
        >
          {languagesTable.map(lang => (
            <Table.Row
              key={lang.code}
              grid_cols="grid-cols-[0.5fr_0.5fr_0.5fr_2fr]"
            >
              <Table.Cell>{lang?.code}</Table.Cell>
              <Table.Cell>{lang?.name}</Table.Cell>
              <Table.Cell>{lang?.nameLocal}</Table.Cell>
              <Table.Cell>
                <div className="flex justify-end gap-4">
                  <Link href={`/dashboard/settings/language/${lang?.code}`}>
                    <Button className="text-white bg-green-primary rounded-full min-w-[100px] cursor-pointer hover:bg-green-primary/70">
                      {t("Dictionary")}
                    </Button>
                  </Link>
                  <LanguageDialog
                    trigger={
                      <Button className="text-white bg-green-primary rounded-full min-w-[100px] cursor-pointer hover:bg-green-primary/70">
                        {t("Edit")}
                      </Button>
                    }
                    formType="update"
                    languageOptions={lang}
                    setLanguagesTable={setLanguagesTable}
                  />
                  <LanguageDeleteDialog
                    t={t}
                    code={lang.code}
                    onDelete={handleLanguageDeleted}
                  />
                </div>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table>
      )}
    </>
  );
}

export default LanguagesTable;
