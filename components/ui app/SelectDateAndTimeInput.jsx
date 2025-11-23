"use client";

import { useState } from "react";

import { ChevronDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const SelectDateTimeInput = ({
  t,
  label = { date: "Date", time: "Time" },
  names,
  formik,
  placeholder,
}) => {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(undefined);

  return (
    <div className="flex flex-1 gap-4">
      <div className="flex flex-1 flex-col gap-3">
        <Label htmlFor="date-picker" className="px-1 text-[#677185]">
          {label.date}
        </Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="date-picker"
              className="justify-between text-black dark:text-white dark:bg-[#10131D] p-6 font-normal"
            >
              {date ? date.toLocaleDateString() : "Pick a date"}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(date) => {
                setDate(date);
                setOpen(false);
                formik.setFieldValue(names?.date, date);
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex flex-1 flex-col gap-3">
        <Label htmlFor="time-picker" className="px-1 text-[#677185]">
          {label.time}
        </Label>
        <Input
          value={formik.values[names?.time]}
          name={names?.time}
          onChange={formik.handleChange}
          type="time"
          id="time-picker"
          step="1"
          defaultValue="06:30:00"
          className=" text-black dark:text-white dark:bg-[#10131D] h-13  appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
        />
      </div>
    </div>
  );
};

export default SelectDateTimeInput;
