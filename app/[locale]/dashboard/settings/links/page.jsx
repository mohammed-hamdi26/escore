import { getAppLinks } from "@/app/[locale]/_Lib/appLinksApi";
import LinksContainer from "@/components/settings-links/links-container";

async function page() {
  const links = await getAppLinks();
  console.log(links);

  return <LinksContainer links={links} />;
}

export default page;
