import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

function TextAreaInput({
  label,
  icon,
  placeholder,
  className,
  error,
  onBlur,
  onChange,
  value,
  name,
  disabled,
}) {
  return (
    <div className="flex flex-col flex-1 gap-4">
      <div className="flex items-center gap-4 ">
        {icon && icon}
        {label && (
          <Label className={"text-[#677185] dark:text-white"}>{label}</Label>
        )}
      </div>
      <Textarea
        name={name}
        value={value}
        onBlur={onBlur}
        onChange={onChange}
        placeholder={placeholder}
        className={
          className + " bg-dashboard-box  dark:bg-[#0F1017] border-0 p-6 "
        }
        disabled={disabled}
      />
      {error && <p className="text-red-600">* {error}</p>}
    </div>
  );
}

export default TextAreaInput;
