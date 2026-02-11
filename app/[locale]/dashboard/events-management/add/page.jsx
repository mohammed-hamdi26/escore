import { addEvent } from "@/app/[locale]/_Lib/actions";
import EventForm from "@/components/Events Management/EventForm";
import { EventAddWrapper } from "@/components/Events Management/EventFormWrapper";

async function AddEventPage() {
  return (
    <EventAddWrapper>
      <EventForm submit={addEvent} formType="add" />
    </EventAddWrapper>
  );
}

export default AddEventPage;
