import { getDictionaryWords } from '@/app/[locale]/_Lib/dictionary';
import DictionaryTable from './dictionary-table';

async function DictionaryContainer({code}) {
  const languageData = await getDictionaryWords(code);
  // Extract the dictionary object from the language data
  const dictionary = languageData?.dictionary || {};
  return <DictionaryTable code={code} initialDictionary={dictionary} />
}

export default DictionaryContainer
