"use client";
import { useState, useRef } from "react";
import { X, Plus } from "lucide-react";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

function TagsInput({
  value = [],
  onChange,
  label,
  placeholder = "Add tag...",
  maxTags = 10,
  error,
  disabled = false,
}) {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef(null);

  const handleAddTag = () => {
    const tag = inputValue.trim().toLowerCase();
    if (tag && !value.includes(tag) && value.length < maxTags) {
      onChange([...value, tag]);
      setInputValue("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    onChange(value.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
      handleRemoveTag(value[value.length - 1]);
    }
  };

  return (
    <div className="flex-1 space-y-2">
      {label && (
        <Label className="text-[#677185] dark:text-white">{label}</Label>
      )}
      <div
        className={`flex flex-wrap gap-2 p-3 rounded-lg bg-dashboard-box dark:bg-[#0F1017] border ${
          error ? "border-red-500" : "border-transparent"
        } min-h-[48px] cursor-text`}
        onClick={() => inputRef.current?.focus()}
      >
        {value.map((tag) => (
          <Badge
            key={tag}
            variant="secondary"
            className="bg-green-primary/20 text-green-primary hover:bg-green-primary/30 gap-1 px-2 py-1"
          >
            {tag}
            {!disabled && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveTag(tag);
                }}
                className="hover:bg-green-primary/20 rounded-full p-0.5"
              >
                <X className="size-3" />
              </button>
            )}
          </Badge>
        ))}
        {value.length < maxTags && !disabled && (
          <div className="flex items-center gap-1 flex-1 min-w-[120px]">
            <Input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleAddTag}
              placeholder={value.length === 0 ? placeholder : ""}
              disabled={disabled}
              className="border-0 bg-transparent p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0 text-sm placeholder:text-[#677185]"
            />
            {inputValue && (
              <button
                type="button"
                onClick={handleAddTag}
                className="text-green-primary hover:text-green-primary/80"
              >
                <Plus className="size-4" />
              </button>
            )}
          </div>
        )}
      </div>
      <div className="flex justify-between text-xs text-[#677185]">
        {error && <span className="text-red-500">{error}</span>}
        <span className="ml-auto">
          {value.length}/{maxTags}
        </span>
      </div>
    </div>
  );
}

export default TagsInput;
