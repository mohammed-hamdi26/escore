import { getLanguages } from "@/app/[locale]/_Lib/languageAPI";
import Table from "@/components/ui app/Table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import DeleteLanguageButton from "./_components/DeleteButton";

const columns = [
  { id: "code", header: "Code" },
  { id: "name", header: "Name" },
  { id: "name_local", header: "Local name" },
  { id: "actions", header: "Actions" },
];

export default async function LanguagePage() {
  const { data: languages } = await getLanguages();
  console.log(languages);
  return (
    <div>
      <Table
        grid_cols="grid-cols-[0.5fr_0.5fr_0.5fr_2fr]"
        columns={[...columns]}
      >
        {languages.map(lang => (
          <Table.Row
            key={lang.code}
            grid_cols="grid-cols-[0.5fr_0.5fr_0.5fr_2fr]"
          >
            <Table.Cell>{lang.code}</Table.Cell>
            <Table.Cell>{lang.name}</Table.Cell>
            <Table.Cell>{lang.name_local}</Table.Cell>
            <Table.Cell>
              <div className="flex justify-end gap-4">
                <Link href={`/dashboard/settings/language/${lang.code}`}>
                  <Button className="text-white bg-green-primary rounded-full min-w-[100px] cursor-pointer">
                    Dictionary
                  </Button>
                </Link>
                <Link href={`/dashboard/langs-management/edit/${lang.id}`}>
                  <Button className="text-white bg-green-primary rounded-full min-w-[100px] cursor-pointer">
                    Edit
                  </Button>
                </Link>
                {/* <DeleteLanguageButton
                  code={lang.code}
                  onDelete={handleDelete}
                /> */}
              </div>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table>
    </div>
  );
}
