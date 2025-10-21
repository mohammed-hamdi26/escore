import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

function TextAreaInput({ label, icon, placeholder, className }) {
  return (
    <div className="flex flex-col flex-1 gap-4">
      <div className="flex items-center gap-4 ">
        {icon && icon}
        {label && <Label>{label}</Label>}
      </div>
      <Textarea
        placeholder={placeholder}
        className={className + " bg-[#0F1017] border-0 p-6 "}
      />
    </div>
  );
}

export default TextAreaInput;
