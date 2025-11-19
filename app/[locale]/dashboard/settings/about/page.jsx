import { getLanguages } from "@/app/[locale]/_Lib/languageAPI";
import AboutContainer from './_components/about-container';

async function AboutPage() {
  const { data: languages } = await getLanguages();
  return (
    <div>
      <AboutContainer languages={languages} />
    </div>
  );
}

export default AboutPage;
