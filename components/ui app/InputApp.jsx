import { Input } from "../ui/input";
import { Label } from "../ui/label";

function InputApp({
  label,
  name,
  type,
  onChange,
  className = "",
  placeholder,
  backGroundColor = "text-white",
  textColor = "text-[#4F555A]",
  icon,
  error,
  onBlur,
}) {
  return (
    <div className="flex-1">
      {label && <Label className={"mb-4"}>{label}</Label>}
      <div className="flex items-center gap-4 ">
        {icon && icon}
        <div className="flex-1 space-y-2">
          <Input
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
