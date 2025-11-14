import { getLanguages } from "@/app/[locale]/_Lib/languageAPI";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import LanguagesTable from "./_components/LanguagesTable";

export const dynamic = "force-dynamic";

export default async function LanguagePage() {
  const { data: languages } = await getLanguages();
  return (
    <>
      <div>
        <Link href={"/dashboard/settings/language/add-language"}>
          <Button
            className={
              "text-white  text-center min-w-[100px]  px-5 py-2 rounded-lg bg-green-primary cursor-pointer hover:bg-green-primary/80 transition-all duration-300 mb-5"
            }
          >
            Add new language
          </Button>
        </Link>
      </div>
      <div>
        <LanguagesTable initialLanguages={languages} />
      </div>
    </>
  );
}
