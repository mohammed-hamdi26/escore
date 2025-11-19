import { getLanguages } from "@/app/[locale]/_Lib/languageAPI";
import PrivacyContainer from "./_components/privacy-container";

async function PrivacyAndPolicyPage() {
  const { data: languages } = await getLanguages();
  return <PrivacyContainer languages={languages} />;
}

export default PrivacyAndPolicyPage;
