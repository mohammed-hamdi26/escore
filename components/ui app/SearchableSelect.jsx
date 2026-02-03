"use client";

import { useState, useMemo } from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

export default function SearchableSelect({
  label,
  placeholder = "Select...",
  searchPlaceholder = "Search...",
  emptyMessage = "No results found",
  options = [],
  value,
  onChange,
  icon: Icon,
  disabled = false,
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  // Filter options based on search
  const filteredOptions = useMemo(() => {
    if (!search) return options;
    return options.filter((option) =>
      option.label.toLowerCase().includes(search.toLowerCase())
    );
  }, [options, search]);

  // Get selected option
  const selectedOption = useMemo(() => {
    return options.find((opt) => opt.value === value);
  }, [options, value]);

  return (
    <div className="space-y-1.5">
      {label && (
        <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          {Icon && <Icon className="size-4" />}
          {label}
        </label>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className="w-full h-11 justify-between rounded-xl bg-gray-50 dark:bg-[#0F1017] border-0 hover:bg-gray-100 dark:hover:bg-[#1a1d2e] font-normal"
          >
            <span className="flex items-center gap-2 truncate">
              {selectedOption ? (
                <>
                  {selectedOption.image && (
                    <img
                      src={selectedOption.image}
                      alt=""
                      className="size-6 rounded object-contain bg-white dark:bg-white/10 p-0.5"
                    />
                  )}
                  <span className="text-gray-900 dark:text-white truncate">
                    {selectedOption.label}
                  </span>
                </>
              ) : (
                <span className="text-gray-400 dark:text-gray-500">{placeholder}</span>
              )}
            </span>
            <ChevronDown className="size-4 shrink-0 text-gray-400" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] p-0 bg-white dark:bg-[#12141c] border-gray-200 dark:border-white/10"
          align="start"
        >
          <Command>
            <CommandInput
              placeholder={searchPlaceholder}
              value={search}
              onValueChange={setSearch}
              className="h-10"
            />
            <CommandList className="max-h-[250px]">
              <CommandEmpty className="py-6 text-center text-sm text-gray-500">
                {emptyMessage}
              </CommandEmpty>
              <CommandGroup>
                {/* Clear option */}
                <CommandItem
                  value="__clear__"
                  onSelect={() => {
                    onChange("");
                    setOpen(false);
                    setSearch("");
                  }}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Check
                    className={`size-4 ${!value ? "opacity-100" : "opacity-0"}`}
                  />
                  <span className="text-gray-500">{placeholder}</span>
                </CommandItem>

                {filteredOptions.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.label}
                    onSelect={() => {
                      onChange(option.value);
                      setOpen(false);
                      setSearch("");
                    }}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Check
                      className={`size-4 ${
                        value === option.value ? "opacity-100 text-green-primary" : "opacity-0"
                      }`}
                    />
                    {option.image && (
                      <img
                        src={option.image}
                        alt={option.label}
                        className="size-6 rounded object-contain bg-white dark:bg-white/10 p-0.5"
                      />
                    )}
                    <span className="truncate">{option.label}</span>
                    {option.subtitle && (
                      <span className="text-xs text-gray-400 ml-auto">
                        {option.subtitle}
                      </span>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
