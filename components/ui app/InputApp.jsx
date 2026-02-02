import { useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Eye, EyeOff } from "lucide-react";

function InputApp({
  label,
  name,
  type,
  onChange,
  className = "",
  placeholder,
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
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={flexGrow}>
      {label && (
        <Label
          htmlFor={name}
          className="block mb-2 text-sm font-medium text-muted-foreground"
        >
          {label}
        </Label>
      )}
      <div
        className={`relative flex items-center gap-3 rounded-xl transition-all duration-200 ${
          isFocused
            ? "ring-2 ring-green-primary/50 dark:ring-green-primary/30"
            : ""
        } ${error ? "ring-2 ring-red-500/50" : ""}`}
      >
        {icon && (
          <span className="absolute left-4 rtl:left-auto rtl:right-4 text-muted-foreground">
            {icon}
          </span>
        )}
        <Input
          id={name}
          value={value}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          onFocus={() => setIsFocused(true)}
          placeholder={placeholder}
          className={`w-full bg-muted/50 dark:bg-white/5 border-0 rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0 transition-colors ${
            icon ? "pl-11 rtl:pl-4 rtl:pr-11" : ""
          } ${type === "password" ? "pr-11 rtl:pr-4 rtl:pl-11" : ""} ${
            disabled ? "opacity-50 cursor-not-allowed" : ""
          } ${className}`}
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
            className="absolute right-4 rtl:right-auto rtl:left-4 text-muted-foreground hover:text-foreground transition-colors"
            aria-label={show ? "Hide password" : "Show password"}
          >
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && (
        <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
          <span className="inline-block size-1 rounded-full bg-red-500" />
          {t ? t(error) : error}
        </p>
      )}
    </div>
  );
}

export default InputApp;
