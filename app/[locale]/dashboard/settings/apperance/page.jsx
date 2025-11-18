import { Suspense } from 'react';
import ThemesContainer from './_components/themes-container';
import LoadingScreen from '@/components/ui app/loading-screen';

async function ApperancePage() {
  return <Suspense fallback={<LoadingScreen/>}>
    <ThemesContainer/>
  </Suspense>
}

export default ApperancePage;
