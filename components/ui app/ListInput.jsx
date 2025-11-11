import { useEffect, useLayoutEffect, useState } from "react";
import SelectInput from "./SelectInput";
import { Button } from "../ui/button";
import { Delete, DeleteIcon, X } from "lucide-react";
import { string } from "yup";

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
  typeForm = "add",
}) {
  const [selectedData, setSelectedData] = useState(initialData);

  return (
    <div className="flex-1">
      <SelectInput
        placeholder={placeholder}
        options={options
          .filter((item) =>
            typeForm === "add"
              ? !selectedData.includes(JSON.stringify(item))
              : !selectedData.find(
                  (selectedItem) => selectedItem.value === item.value
                )
          )
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
      <div className="grid grid-cols-2 gap-4">
        {formik.values[name].map((item, index) => {
          return (
            <div
              className="bg-dashboard-box   dark:bg-[#0F1017] rounded-lg p-3 w-full flex justify-between items-center gap-4"
              key={index}
            >
              <p>
                {" "}
                {typeof item === "string" ? JSON.parse(item).name : item.name}
              </p>

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
