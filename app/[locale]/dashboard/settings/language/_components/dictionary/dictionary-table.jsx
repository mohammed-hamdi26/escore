"use client";
import Table from "@/components/ui app/Table";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import DictionaryDeleteDialog from "./dictionary-delete-dialog";
import DictionaryDialog from "./dictionary-dialog";
import { useTranslations } from "next-intl";

const columns = [
  { id: "word", header: "Word" },
  { id: "translation", header: "Translation" },
];
function DictionaryTable({ code, initialDictionary }) {
  const [dictionary, setDictionary] = useState(initialDictionary || {});
  const t = useTranslations("languages");

  function handleDeleteWord(word) {
    setDictionary((prev) => {
      const { [word]: _, ...rest } = prev;
      return rest;
    });
  }

  return (
    <>
      <div className="mb-5">
        <DictionaryDialog
          trigger={
            <Button className="text-white text-center min-w-[100px] px-5 py-2 rounded-lg bg-green-primary cursor-pointer hover:bg-[#2ca54d] transition-all duration-300">
              {t("Add new Word")}
            </Button>
          }
          formType="add"
          languageCode={code}
          setDictionary={setDictionary}
          t={t}
        />
      </div>
      <div>
        {Object.keys(dictionary).length === 0 ? (
          <div className="text-center py-8 text-lg text-[#677185] dark:text-white">
            {t("No words found")}
          </div>
        ) : (
          <Table
            t={t}
            grid_cols="grid-cols-[0.5fr_0.5fr_2fr]"
            columns={columns}
          >
            {Object.entries(dictionary).map(([word, value]) => (
              <Table.Row key={word} grid_cols="grid-cols-[0.5fr_0.5fr_2fr]">
                <Table.Cell>{word}</Table.Cell>
                <Table.Cell>{value}</Table.Cell>
                <Table.Cell>
                  <div className="flex justify-end gap-4">
                    <DictionaryDialog
                      t={t}
                      trigger={
                        <Button className="text-white bg-green-primary hover:bg-[#2ca54d] rounded-full min-w-[100px] cursor-pointer">
                          {t("Edit")}
                        </Button>
                      }
                      formType="edit"
                      languageCode={code}
                      word={word}
                      translation={value}
                      setDictionary={setDictionary}
                      translate={t}
                    />
                    <DictionaryDeleteDialog
                      t={t}
                      code={code}
                      word={word}
                      onDelete={handleDeleteWord}
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

export default DictionaryTable;
