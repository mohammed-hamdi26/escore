import { getSpecificLanguage } from "@/app/[locale]/_Lib/languageAPI";
import LanguageForm from "../_components/LanguageForm";

async function EditLanguagePage({ searchParams }) {
  const { lang: code } = await searchParams;
  const response = await getSpecificLanguage(code);
  const language = response?.data || response;
  return (
    <div>
      <LanguageForm
        successMessage="Language updated successfully"
        language={language}
        formType="update"
        code={code}
      />
    </div>
  );
}

export default EditLanguagePage;
