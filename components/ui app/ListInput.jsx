import { useState } from "react";
import SelectInput from "./SelectInput";
import { Button } from "../ui/button";
import { Delete, DeleteIcon, X } from "lucide-react";

function ListInput({
  placeholder,
  options,
  label,
  icon,
  error,
  name,
  onBlur,
  onChange,
  formik,
  initialData = [],
}) {
  const [selectedData, setSelectedData] = useState(initialData);

  return (
    <div className="flex-1">
      <SelectInput
        placeholder={placeholder}
        options={options
          .filter((item) => !selectedData.includes(JSON.stringify(item)))
          .map((item) => {
            return { value: JSON.stringify(item), label: item.name };
          })}
        label={label}
        icon={icon}
        error={error}
        name={name}
        onBlur={onBlur}
        onChange={(value) => {
          setSelectedData((prev) => [...prev, value]);
          formik.setFieldValue(name, [...selectedData, value]);
        }}
      />
      <div className="flex gap-4">
        {selectedData.map((item, index) => {
          return (
            <div
              className="bg-dashboard-box w-fit  dark:bg-[#0F1017] rounded-lg p-3 flex items-center gap-4"
              key={index}
            >
              <p>{JSON.parse(item).name}</p>

              <X
                className="hover:text-red-500 transition-colors duration-300 cursor-pointer"
                onClick={() => {
                  setSelectedData((prev) =>
                    prev.filter((item, i) => i !== index)
                  );
                  formik.setFieldValue(
                    name,
                    selectedData.filter((item, i) => i !== index)
                  );
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ListInput;
