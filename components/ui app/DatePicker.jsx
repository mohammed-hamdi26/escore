import { Label } from "@radix-ui/react-label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
// import { PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { Button } from "../ui/button";
import { useState } from "react";

function DatePicker({ label, formik, placeholder, icon }) {
  const [open, setOpen] = useState(false);

  return (
    <div className=" flex flex-col flex-1">
      {label && <Label className={"mb-4"}>{label}</Label>}
      <div className="flex items-center gap-4  ">
        {icon && icon}
        <div className="flex-1 space-y-2">
          <Popover
            open={open}
            onOpenChange={(open) => {
              setOpen(open);
              // if(open)
            }}
          >
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="min-w-48 justify-between font-normal border-0 bg-[#0F1017] p-6 cursor-pointer "
              >
                {formik.values.date
                  ? new Date(formik.values.date).toLocaleDateString()
                  : placeholder}
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
          {formik?.errors?.date &&
            formik?.touched?.date &&
            formik?.values?.date && (
              <p className="text-red-600">{formik?.errors?.date}</p>
            )}
        </div>
      </div>
    </div>
  );
}

export default DatePicker;
