import { getEvent, getEventTournaments, getEventClubs, getEventStandings } from "@/app/[locale]/_Lib/eventsApi";
import { getActiveClubs } from "@/app/[locale]/_Lib/clubsApi";
import { getTournaments } from "@/app/[locale]/_Lib/tournamentsApi";
import EventDetails from "@/components/Events Management/EventDetails";
import { EventListWrapper } from "@/components/Events Management/EventFormWrapper";

async function ViewEventPage({ params }) {
  const { id } = await params;
  const [event, { data: tournaments }, clubs, { data: standings }, { data: allTournaments }, allClubs] =
    await Promise.all([
      getEvent(id),
      getEventTournaments(id, { size: 100 }),
      getEventClubs(id),
      getEventStandings(id, { limit: 50 }),
      getTournaments({ size: 200 }),
      getActiveClubs(),
    ]);

  return (
    <EventListWrapper>
      <EventDetails
        event={event}
        tournaments={tournaments || []}
        clubs={clubs || []}
        standings={standings || []}
        allTournaments={allTournaments || []}
        allClubs={allClubs || []}
      />
    </EventListWrapper>
  );
}

export default ViewEventPage;
