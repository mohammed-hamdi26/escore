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
}) {
  // const mappedOptions = options.map((option) => ({
  //   label: option?.name ? option?.name : option?.label,
  //   value: option?.value,
  // }));
  return (
    <div className="flex-1">
      {label && (
        <Label className={" text-[#677185] dark:text-white"}>{label}</Label>
      )}
      <div className="flex items-center gap-4 mt-4 ">
        {icon && icon}
        <div className="flex-1 space-y-2">
          <Select
            className=" text-[#677185] p-6 "
            onValueChange={onChange}
            onOpenChange={onBlur}
            name={name}
            value={value}
          >
            <SelectTrigger
              className={
                " bg-dashboard-box w-full  dark:bg-[#0F1017] border-0 p-6 "
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
                  {t ? t(option?.label) : option?.label}
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
