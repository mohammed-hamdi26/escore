import { Label } from "@radix-ui/react-label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";

import { Button } from "../ui/button";
import { useState } from "react";
import { format } from "date-fns";

function DatePicker({
  t,
  label,
  name,
  formik,
  placeholder,
  icon,
  disabled,
  disabledDate = { before: new Date() },
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className=" flex flex-col flex-1">
      {label && (
        <Label className={"mb-4 text-[#677185] dark:text-white"}>{label}</Label>
      )}
      <div className="flex items-center gap-4  ">
        {icon && icon}
        <div className="flex-1 space-y-2">
          <Popover
            open={open}
            onOpenChange={(open) => {
              setOpen(open);
              // formik.setFieldTouched(name, true);
              // if(open)
            }}
          >
            <PopoverTrigger className="w-full" asChild>
              <Button
                disabled={disabled}
                variant="outline"
                className="min-w-48 justify-between font-normal border-0 bg-dashboard-box hover:bg-dashboard-box  text-[#677185] dark:bg-[#0F1017] p-6 cursor-pointer "
              >
                {formik.values[name]
                  ? new Date(formik.values[name]).toLocaleDateString()
                  : placeholder}
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <Calendar
                onBlur={() => formik.setFieldTouched(name, true)}
                disabled={disabledDate}
                selected={formik.values[name]}
                onSelect={(date) => {
                  formik.setFieldValue(name, date);

                  setOpen(false);
                  // formik.setFieldTouched(name, true);
                }}
                mode="single"
                captionLayout="dropdown"
              />
            </PopoverContent>
          </Popover>
          {formik?.errors?.[name] && formik?.touched?.[name] && (
            <p className="text-red-600">
              {t ? t(formik?.errors?.[name]) : formik?.errors?.[name]}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default DatePicker;
