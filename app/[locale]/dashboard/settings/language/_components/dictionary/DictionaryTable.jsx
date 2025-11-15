"use client";
import { getDictionaryWords } from "@/app/[locale]/_Lib/dictionary";
import Table from "@/components/ui app/Table";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import DictionaryDeleteDialog from "./DictionaryDeleteDialog";
import DictionaryDialog from "./DictionaryDialog";

const columns = [
  { id: "word", header: "Word" },
  { id: "translation", header: "Translation" },
];
function DictionaryTable({ code, initialDictionary }) {
  const [dictionary, setDictionary] = useState(initialDictionary || {});
  const [loadingInitial, setLoadingInitial] = useState(true);

  const handleWordAddedOrUpdated = async () => {
    try {
      const updatedDictionary = await getDictionaryWords(code);
      setDictionary(updatedDictionary);
    } catch (error) {
      console.error("Failed to refresh dictionary:", error);
    }
  };

  // Fetch existing words on initial mount so table isn't empty when data exists.
  useEffect(() => {
    let ignore = false;
    const fetchInitial = async () => {
      try {
        const existing = await getDictionaryWords(code);
        if (!ignore && existing && typeof existing === "object") {
          setDictionary(existing);
        }
      } catch (e) {
        console.error("Failed initial dictionary load:", e);
      } finally {
        !ignore && setLoadingInitial(false);
      }
    };
    fetchInitial();
    return () => {
      ignore = true;
    };
  }, [code]);
  return (
    <>
      <div className="mb-5">
        <DictionaryDialog
          trigger={
            <Button className="text-white text-center min-w-[100px] px-5 py-2 rounded-lg bg-green-primary cursor-pointer hover:bg-green-primary/80 transition-all duration-300">
              Add new Word
            </Button>
          }
          formType="add"
          languageCode={code}
          onSuccess={handleWordAddedOrUpdated}
        />
      </div>
      <div>
        {loadingInitial ? (
          <div className="text-center py-8 text-lg text-[#677185] dark:text-white">
            Loading dictionary...
          </div>
        ) : Object.keys(dictionary).length === 0 ? (
          <div className="text-center py-8 text-lg text-[#677185] dark:text-white">
            No words found
          </div>
        ) : (
          <Table
            grid_cols="grid-cols-[0.5fr_0.5fr_0.5fr_2fr]"
            columns={columns}
          >
            {Object.entries(dictionary).map(([word, value]) => (
              <Table.Row
                key={word}
                grid_cols="grid-cols-[0.5fr_0.5fr_0.5fr_2fr]"
              >
                <Table.Cell>{word}</Table.Cell>
                <Table.Cell>{value}</Table.Cell>
                <Table.Cell>
                  <div className="flex justify-end gap-4">
                    <DictionaryDialog
                      trigger={
                        <Button className="text-white bg-green-primary rounded-full min-w-[100px] cursor-pointer">
                          Edit
                        </Button>
                      }
                      formType="edit"
                      languageCode={code}
                      word={word}
                      translation={value}
                      onSuccess={handleWordAddedOrUpdated}
                    />
                    <DictionaryDeleteDialog
                      code={code}
                      word={word}
                      onDelete={() => {
                        // After successful deletion, refetch authoritative dictionary
                        handleWordAddedOrUpdated();
                      }}
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
