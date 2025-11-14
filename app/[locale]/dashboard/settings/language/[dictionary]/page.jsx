import { getDictionaryWords } from "@/app/[locale]/_Lib/dictionary";
import Table from "@/components/ui app/Table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import DictionaryTable from '../_components/dictionary/DictionaryTable';


async function DictionaryPage({params}) {
  const {dictionary:code } =  await params
  const { data: dictionary } = await getDictionaryWords(code);
  return (
    <DictionaryTable code={code} initialDictionary={dictionary} />
  );
}

export default DictionaryPage;
