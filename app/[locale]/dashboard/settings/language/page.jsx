import LoadingScreen from "@/components/ui app/loading-screen";
import { Suspense } from "react";
import LanguageContainer from "./_components/language/LanguageContainer";

export default async function LanguagePage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <LanguageContainer />
    </Suspense>
  );
}
