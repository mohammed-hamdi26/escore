import { getEvent } from "@/app/[locale]/_Lib/eventsApi";
import { editEvent } from "@/app/[locale]/_Lib/actions";
import EventForm from "@/components/Events Management/EventForm";
import { EventEditWrapper } from "@/components/Events Management/EventFormWrapper";

async function EditEventPage({ params }) {
  const { id } = await params;
  const event = await getEvent(id);

  return (
    <EventEditWrapper>
      <EventForm event={event} submit={editEvent} formType="edit" />
    </EventEditWrapper>
  );
}

export default EditEventPage;
