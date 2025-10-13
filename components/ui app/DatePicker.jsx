import { Label } from "@radix-ui/react-label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
// import { PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { Button } from "../ui/button";
import { useState } from "react";

function DatePicker({ label, formik }) {
  const [open, setOpen] = useState(false);

  return (
    <div className=" flex flex-col flex-1">
      {label && <Label className={"mb-4"}>{label}</Label>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-48 justify-between font-normal border-0 bg-[#0F1017] p-6 cursor-pointer "
          >
            {formik.values.date
              ? new Date(formik.values.date).toLocaleDateString()
              : "Select a date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <Calendar
            disabled={{
              before: new Date(),
            }}
            selected={formik.values.date}
            onSelect={(date) => {
              console.log(date);
              formik.setFieldValue("date", date);
              setOpen(false);
              formik.setFieldTouched("date", true);
              console.log(formik.values);
            }}
            mode="single"
            captionLayout="dropdown"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default DatePicker;
