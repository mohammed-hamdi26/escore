"use client";

import { useEffect, useState } from "react";

import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { cn } from "@/lib/utils";
import { getFlagEmoji } from "@/app/[locale]/_Lib/helps";

const SelectInputCombox = ({
  options,
  formik,
  name,
  placeholder,
  onChange,
  disabled,
}) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(formik?.values[name] || "");
  console.log(formik?.values[name]);
  useEffect(() => {
    setValue(formik?.values[name]);
  }, [formik?.values[name]]);
  //   console.log("SelectInputCombox value", options);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          disabled={formik?.isSubmitting || disabled}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={
            " bg-dashboard-box  text-black dark:text-[#677185]   dark:bg-[#0F1017] border-0 p-6  w-full  justify-between"
          }
          aria-label="Framework combobox"
        >
          {value
            ? options.find((option) => option.value === value)?.name
            : placeholder}
          <ChevronsUpDownIcon className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-full min-w-[400px]  ">
        <Command>
          <CommandInput placeholder={placeholder} className="h-9" />
          <CommandList value={formik?.values[name]}>
            <CommandEmpty>No Data.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={
                    name === "country"
                      ? option.value.split(" ")[1]
                      : option.value
                  }
                  onSelect={(currentValue) => {
                    // console.log(option.value);
                    setValue(option.value === value ? "" : option.value);
                    onChange
                      ? onChange(option.value === value ? "" : option.value)
                      : formik.setFieldValue(
                          name,
                          option.value === value ? "" : { id: option.value }
                        );
                    setOpen(false);
                  }}
                >
                  {/* {option?.name?.split(" ")[1]} */}
                  {option.name}
                  <CheckIcon
                    className={cn(
                      "ml-auto",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default SelectInputCombox;
