import { getDictionaryWords } from "@/app/[locale]/_Lib/dictionary";
import Table from "@/components/ui app/Table";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const columns = [
  { id: "word", header: "Word" },
  { id: "translation", header: "Translation" },
];
async function DictionaryPage({params}) {
  const {dictionary:code } =  await params

  const { data: words } = await getDictionaryWords(code);
  return (
    <div>
      <Table
        grid_cols="grid-cols-[0.5fr_0.5fr_0.5fr_2fr]"
        columns={[...columns]}
      >
        {Object.entries(words).map(([word, value]) => (
          <Table.Row key={word} grid_cols="grid-cols-[0.5fr_0.5fr_0.5fr_2fr]">
            <Table.Cell>{word}</Table.Cell>
            <Table.Cell>{value}</Table.Cell>
            <Table.Cell>{value}</Table.Cell>
            <Table.Cell>
              <div className="flex justify-end gap-4">
                  <Button className="text-white bg-green-primary rounded-full min-w-[100px] cursor-pointer">
                    Edit
                  </Button>
                  <Button className="text-white bg-green-primary rounded-full min-w-[100px] cursor-pointer">
                    Delete
                  </Button>
                {/* <DeleteLanguageButton code={lang.code}/> */}
              </div>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table>
    </div>
  );
}

export default DictionaryPage;
