import { getEvent } from "@/app/[locale]/_Lib/eventsApi";
import { editEvent } from "@/app/[locale]/_Lib/actions";
import { getCountries } from "@/app/[locale]/_Lib/countriesApi";
import EventForm from "@/components/Events Management/EventForm";
import { EventEditWrapper } from "@/components/Events Management/EventFormWrapper";

async function EditEventPage({ params }) {
  const { id } = await params;

  let countries = [];
  try {
    const result = await getCountries();
    countries = result?.countries || [];
  } catch {
    countries = [];
  }

  const event = await getEvent(id);

  return (
    <EventEditWrapper>
      <EventForm event={event} submit={editEvent} formType="edit" countries={countries} />
    </EventEditWrapper>
  );
}

export default EditEventPage;
