import { getEvents } from "@/app/[locale]/_Lib/eventsApi";
import EventList from "@/components/Events Management/EventList";
import { EventListWrapper } from "@/components/Events Management/EventFormWrapper";

async function EventsPage({ searchParams }) {
  const { size, page, search, status, sortBy, sortOrder } =
    await searchParams;
  const { data: events, pagination } = await getEvents({
    size,
    page,
    search,
    status,
    sortBy,
    sortOrder,
  });

  return (
    <EventListWrapper>
      <EventList events={events || []} pagination={pagination} />
    </EventListWrapper>
  );
}

export default EventsPage;
