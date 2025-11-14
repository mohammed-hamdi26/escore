"use client";
import { useState } from "react";
import { Button } from '@/components/ui/button';
import Table from "@/components/ui app/Table";
import DictionaryDeleteDialog from './DictionaryDeleteDialog';

const columns = [
  { id: "word", header: "Word" },
  { id: "translation", header: "Translation" },
];
function DictionaryTable({ code,initialDictionary }) {
  const [dictionary, setDictionary] = useState(initialDictionary || {});

  function handleDeleteWord(word) {
    setDictionary(prevDictionary => {
      const { [word]: _, ...rest } = prevDictionary;
      return rest;
    });
  }

  return (
    <>
      <div className='mb-5'>
        <Button
          className={
            "text-white  text-center min-w-[100px]  px-5 py-2 rounded-lg bg-green-primary cursor-pointer hover:bg-green-primary/80 transition-all duration-300"
          }
        >
          Add new Word
        </Button>
      </div>
      <div>
        {Object.keys(dictionary).length === 0 ? (
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
                <Table.Cell>{value}</Table.Cell>
                <Table.Cell>
                  <div className="flex justify-end gap-4">
                    <Button className="text-white bg-green-primary rounded-full min-w-[100px] cursor-pointer">
                      Edit
                    </Button>
                    <DictionaryDeleteDialog code = {code} word={word} onDelete={handleDeleteWord} />
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
