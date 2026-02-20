import { getEvent, getEventLinks } from "@/app/[locale]/_Lib/eventsApi";
import LinksPageContainer from "@/components/Links/LinksPageContainer";

async function page({ params }) {
  const { id } = await params;
  const [event, links] = await Promise.all([
    getEvent(id),
    getEventLinks(id),
  ]);

  const eventName = event?.name || null;

  return (
    <LinksPageContainer
      links={links}
      id={id}
      linkType="events"
      playerName={eventName}
    />
  );
}

export default page;
