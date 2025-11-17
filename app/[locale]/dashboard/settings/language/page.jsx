import { Suspense } from 'react';
import LanguageContainer from './_components/language/LanguageContainer';
import LoadingScreen from '@/components/ui app/loading-screen';

export default async function LanguagePage() {
  return <Suspense fallback={<LoadingScreen/>}>
    <LanguageContainer />
  </Suspense>
}
