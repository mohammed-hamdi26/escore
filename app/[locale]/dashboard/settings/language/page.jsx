import { getLanguages } from "@/app/[locale]/_Lib/languageAPI";
import Table from "@/components/ui app/Table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
// import DeleteLanguageButton from './_components/DeleteButton';

const columns = [
  { id: "code", header: "Code" },
  { id: "name", header: "Name" },
  { id: "name_local", header: "Local name" },
];

export default async function LanguagePage() {
  const { data: languages } = await getLanguages();
  return (
    <>
      <div>
        <Link href={"/dashboard/settings/language/add-language"}>
          <Button
            className={
              "text-white  text-center min-w-[100px]  px-5 py-2 rounded-lg bg-green-primary cursor-pointer hover:bg-green-primary/80 transition-all duration-300 mb-5"
            }
          >
            Add new language
          </Button>
        </Link>
      </div>
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
                  <Link href={`/dashboard/settings/language/edit-page`}>
                    <Button className="text-white bg-green-primary rounded-full min-w-[100px] cursor-pointer">
                      Edit
                    </Button>
                  </Link>
                  {/* <DeleteLanguageButton code={lang.code}/> */}
                </div>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table>
      </div>
    </>
  );
}
