import { Popover, PopoverTrigger } from "@radix-ui/react-popover";
import { Button } from "../ui/button";
import { PopoverContent } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { useState } from "react";
import { format } from "date-fns";
import { X } from "lucide-react";

function FilterDatePicker({ onSelectDate, onRemoveDate }) {
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  return (
    <div className="flex items-center gap-4">
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
            className="min-w-48 justify-between font-normal border-0 bg-dashboard-box hover:bg-dashboard-box  text-[#677185] dark:bg-[#0F1017] p-6 cursor-pointer "
          >
            {selectedDate
              ? format(selectedDate, "MMMM dd, yyyy")
              : "Select a date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <Calendar
            selected={selectedDate}
            onSelect={(date) => {
              setSelectedDate(date);
              onSelectDate(date);
              setOpen(false);
            }}
            mode="single"
            captionLayout="dropdown"
          />
        </PopoverContent>
      </Popover>
      {selectedDate && (
        <span className="size-8 bg-red-600 rounded-full  cursor-pointer flex justify-center items-center">
          <X
            onClick={() => {
              setSelectedDate(null);
              onRemoveDate();
            }}
          />
        </span>
      )}
    </div>
  );
}

export default FilterDatePicker;
