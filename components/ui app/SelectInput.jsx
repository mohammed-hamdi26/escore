import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "../ui/label";
function SelectInput({
  t,
  placeholder,
  options = [],
  label,
  icon,
  error,
  name,
  onBlur,
  onChange,
  value,
  disabled,
  flexGrow = "flex-1",
}) {
  // const mappedOptions = options.map((option) => ({
  //   label: option?.name ? option?.name : option?.label,
  //   value: option?.value,
  // }));
  return (
    <div className={`${flexGrow}`}>
      {label && (
        <Label className={" text-[#677185] dark:text-white mb-4"}>
          {label}
        </Label>
      )}
      <div className="flex items-center gap-4  ">
        {icon && icon}
        <div className="flex-1 space-y-2">
          <Select
            className="text-black  dark:text-[#677185] p-6 "
            onValueChange={onChange}
            onOpenChange={onBlur}
            name={name}
            value={value}
            disabled={disabled}
          >
            <SelectTrigger
              className={
                " bg-dashboard-box w-full text-black dark:text-[#677185]  dark:bg-[#0F1017] border-0 p-6 "
              }
            >
              <SelectValue
                placeholder={placeholder}
                className="text-[#677185]"
              />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option?.value} value={option?.value}>
                  {option?.label || option?.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {error && <p className="text-red-600">{error}</p>}
        </div>
      </div>
    </div>
  );
}

export default SelectInput;
