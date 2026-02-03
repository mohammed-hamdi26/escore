import { getMatch } from "@/app/[locale]/_Lib/matchesApi";
import MatchDetails from "@/components/Matches Management/MatchDetails";
import BackPage from "@/components/ui app/BackPage";
import { getTranslations } from "next-intl/server";

export default async function MatchViewPage({ params }) {
  const { id } = await params;
  const t = await getTranslations("MatchDetails");

  const match = await getMatch(id);

  return (
    <div className="space-y-6">
      <BackPage title={t("title")} />
      <MatchDetails match={match} />
    </div>
  );
}
