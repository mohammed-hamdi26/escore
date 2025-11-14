"use client";

import Table from "@/components/ui app/Table";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { useState } from "react";
import DeleteLanguageButton from "./DeleteButton";

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

  if (!languages || languages.length === 0) {
    return (
      <div className="text-center py-8 text-lg text-[#677185] dark:text-white">
        No languages found
      </div>
    );
  }

  return (
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
              <Link
                href={`/dashboard/settings/language/edit-language?lang=${lang?.code}`}
              >
                <Button className="text-white bg-green-primary rounded-full min-w-[100px] cursor-pointer">
                  Edit
                </Button>
              </Link>
              <DeleteLanguageButton
                code={lang.code}
                onDelete={handleLanguageDeleted}
              />
            </div>
          </Table.Cell>
        </Table.Row>
      ))}
    </Table>
  );
}

export default LanguagesTable;
