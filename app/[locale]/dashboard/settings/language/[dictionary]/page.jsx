import LoadingScreen from "@/components/ui app/loading-screen";
import { Suspense } from "react";
import DictionaryContainer from "../_components/dictionary/dictionary-container";

async function DictionaryPage({ params }) {
  const { dictionary: code } = await params;
  return (
    <Suspense fallback={<LoadingScreen />}>
      <DictionaryContainer code={code} />
    </Suspense>
  );
}

export default DictionaryPage;
