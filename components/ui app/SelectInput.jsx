import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@radix-ui/react-label";
function SelectInput({
  placeholder,
  options,
  label,
  icon,
  error,
  name,
  onBlur,
  onChange,
}) {
  return (
    <div className="flex-1">
      {label && <Label className={"mb-4 text-[#677185]"}>{label}</Label>}
      <div className="flex items-center gap-4 mt-4 ">
        {icon && icon}
        <div className="flex-1 space-y-2">
          <Select
            className="text-[#677185] "
            onValueChange={onChange}
            onOpenChange={onBlur}
            name={name}
          >
            <SelectTrigger
              className={" bg-dashboard-box  dark:bg-[#0F1017] border-0 p-6 "}
            >
              <SelectValue
                placeholder={placeholder}
                className="text-[#677185]"
              />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
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
