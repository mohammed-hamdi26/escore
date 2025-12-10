import { useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Eye, EyeOff } from "lucide-react";

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
  hidden = false,
  disabled = false,
  t,
}) {
  const [show, setShow] = useState(false);

  return (
    <div className={flexGrow}>
      {label && (
        <Label htmlFor={name} className={"mb-4 text-[#677185] dark:text-white"}>
          {label}
        </Label>
      )}
      <div className="relative flex items-center gap-4">
        {icon && icon}
        <Input
          id={name}
          value={value}
          onBlur={onBlur}
          placeholder={placeholder}
          className={
            className +
            ` ${backGroundColor} ${
              textColor || "text-black"
            } rounded-[10px] p-6 pr-12 focus:outline-none focus:border-0 relative focus:border-green-primary`
          }
          type={show ? "text" : type}
          name={name}
          onChange={onChange}
          disabled={disabled}
          hidden={hidden}
        />
        {type === "password" && (
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            aria-label={show ? "Hide password" : "Show password"}
          >
            {show ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
      {error && <p className="text-red-600 mt-1">* {t ? t(error) : error}</p>}
    </div>
  );
}

export default InputApp;
