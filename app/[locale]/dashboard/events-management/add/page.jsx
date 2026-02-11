import { addEvent } from "@/app/[locale]/_Lib/actions";
import { getCountries } from "@/app/[locale]/_Lib/countriesApi";
import EventForm from "@/components/Events Management/EventForm";
import { EventAddWrapper } from "@/components/Events Management/EventFormWrapper";

async function AddEventPage() {
  let countries = [];
  try {
    const result = await getCountries();
    countries = result?.countries || [];
  } catch {
    countries = [];
  }

  return (
    <EventAddWrapper>
      <EventForm submit={addEvent} formType="add" countries={countries} />
    </EventAddWrapper>
  );
}

export default AddEventPage;
