"use client";
import { getLanguages } from "@/app/[locale]/_Lib/languageAPI";
import Table from "@/components/ui app/Table";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { useState } from "react";
import LanguageDialog from "./LanguageDialog";
import LanguageDeleteDialog from './LanguageDeleteDialog';

const columns = [
  { id: "code", header: "Code" },
  { id: "name", header: "Name" },
  { id: "name_local", header: "Local name" },
];

function LanguagesTable({ initialLanguages }) {
  const [languages, setLanguages] = useState(initialLanguages || []);

  const handleLanguageDeleted = deletedCode => {
    setLanguages(prevLanguages =>
      prevLanguages.filter(lang => lang.code !== deletedCode)
    );
  };

  const handleLanguageAddedOrUpdated = async () => {
    try {
      const { data: updatedLanguages } = await getLanguages();
      setLanguages(updatedLanguages);
    } catch (error) {
      console.error("Failed to refresh languages:", error);
    }
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
              Add new language
            </Button>
          }
          formType="add"
          onSuccess={handleLanguageAddedOrUpdated}
        />
      </div>
      {!languages || languages.length === 0 ? (
        <div className="text-center py-8 text-lg text-[#677185] dark:text-white">
          No languages found
        </div>
      ) : (
        <Table grid_cols="grid-cols-[0.5fr_0.5fr_0.5fr_2fr]" columns={columns}>
          {languages.map(lang => (
            <Table.Row
              key={lang.code}
              grid_cols="grid-cols-[0.5fr_0.5fr_0.5fr_2fr]"
            >
              <Table.Cell>{lang?.code}</Table.Cell>
              <Table.Cell>{lang?.name}</Table.Cell>
              <Table.Cell>{lang?.name_local}</Table.Cell>
              <Table.Cell>
                <div className="flex justify-end gap-4">
                  <Link href={`/dashboard/settings/language/${lang?.code}`}>
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
              </Table.Cell>
            </Table.Row>
          ))}
        </Table>
      )}
    </>
  );
}

export default LanguagesTable;
