import { Input } from "../ui/input";
import { Label } from "../ui/label";

function InputApp({
  label,
  name,
  type,
  onChange,
  className = "",
  placeholder,
  backGroundColor = "bg-white",
  textColor = "text-[#4F555A]",
  icon,
  error,
  onBlur,
  value,
  flexGrow = "flex-1",
}) {
  return (
    <div className={flexGrow}>
      {label && (
        <Label className={"mb-4 text-[#677185] dark:text-white"}>{label}</Label>
      )}
      <div className="flex items-center gap-4 ">
        {icon && icon}
        <div className="flex-1 space-y-2">
          <Input
            value={value}
            onBlur={onBlur}
            placeholder={placeholder}
            className={
              className +
              ` ${backGroundColor} ${textColor} rounded-[10px] p-6 focus:outline-none focus:border-0  focus:border-green-primary`
            }
            type={type}
            name={name}
            onChange={onChange}
          />
          {error && <p className="text-red-600">* {error}</p>}
        </div>
      </div>
    </div>
  );
}

export default InputApp;
