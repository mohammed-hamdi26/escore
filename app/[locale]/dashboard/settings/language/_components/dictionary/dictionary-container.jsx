import { getDictionaryWords } from '@/app/[locale]/_Lib/dictionary';
import DictionaryTable from './dictionary-table';

async function DictionaryContainer({code}) {
  const { data: dictionary } = await getDictionaryWords(code);
  return <DictionaryTable code={code} initialDictionary={dictionary} />
}

export default DictionaryContainer
