import { getAppLinks } from "@/app/[locale]/_Lib/appLinksApi";
import LinksContainer from "@/components/settings-links/links-container";

async function page() {
  const links = await getAppLinks();

  return <LinksContainer links={links} />;
}

export default page;
