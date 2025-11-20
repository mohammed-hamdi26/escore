"use client";

import { useId, useState } from "react";

import { CheckIcon, ChevronsUpDownIcon, XIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const ComboboxInput = ({
  initialData = [],
  options,
  formik,
  name,
  placeholder,
  label,
}) => {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [selectedValues, setSelectedValues] = useState(initialData);

  const toggleSelection = (value) => {
    setSelectedValues((prev) =>
      prev.find((v) => v.value === value.value)
        ? prev.filter((v) => v.value !== value.value)
        : [...prev, value]
    );
  };

  const removeSelection = (value) => {
    setSelectedValues((prev) => prev.filter((v) => v.value !== value.value));
  };

  return (
    <div className="w-full  space-y-2 flex-1">
      {label && (
        <Label className={"mb-4 text-[#677185] dark:text-white"} htmlFor={id}>
          {label}
        </Label>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            // variant="outline"
            role="combobox"
            aria-expanded={open}
            className="h-auto min-h-12 w-full   justify-between bg-dashboard-box  dark:bg-[#0F1017] hover:bg-dashboard-box dark:hover:bg-[#0F1017] "
          >
            <div className="flex flex-wrap items-center gap-1 pr-2.5">
              {selectedValues.length > 0 ? (
                selectedValues.map((val) => {
                  const option = options.find((c) => c.value === val.value);

                  return option ? (
                    <Badge
                      className="text-sm"
                      key={val.value}
                      variant="outline"
                    >
                      {option.image && (
                        <img
                          width={20}
                          //   height={16}
                          src={option.image}
                          alt={option.name}
                        />
                      )}
                      {option.name}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-4"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeSelection(val);
                        }}
                        asChild
                      >
                        <span>
                          <XIcon className="size-4" />
                        </span>
                      </Button>
                    </Badge>
                  ) : null;
                })
              ) : (
                <span className="text-muted-foreground">{placeholder}</span>
              )}
            </div>
            <ChevronsUpDownIcon
              size={16}
              className="text-muted-foreground/80 shrink-0"
              aria-hidden="true"
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-(--radix-popper-anchor-width) p-0">
          <Command>
            <CommandInput placeholder={placeholder} />
            <CommandList>
              <CommandEmpty>No framework found.</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={() => {
                      toggleSelection(option);
                      formik.setFieldValue(name, [
                        ...formik.values[name],
                        { id: option.value, name: option.name },
                      ]);
                    }}
                  >
                    {(option.image || option.logo) && (
                      <img
                        width={20}
                        //   height={16}
                        src={option.image || option.logo}
                        alt={""}
                        className="mr-2"
                      />
                    )}{" "}
                    <span className="truncate">{option.name}</span>
                    {selectedValues.find((value) => {
                      return value.value === option.value;
                    }) && <CheckIcon size={16} className="ml-auto" />}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ComboboxInput;
