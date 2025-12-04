"use client";
import { useFormik } from "formik";
import * as yup from "yup";
import EmailIcon from "../icons/EmailIcon";
import PasswordIcon from "../icons/PasswordIcon";
import UserCardIcon from "../icons/UserCardIcon";
import FormRow from "../ui app/FormRow";
import FormSection from "../ui app/FormSection";
import InputApp from "../ui app/InputApp";
import { mappedArrayToSelectOptions } from "@/app/[locale]/_Lib/helps";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import SelectInput from "../ui app/SelectInput";
import { useId, useState } from "react";
import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { CheckIcon, ChevronsUpDownIcon, XIcon } from "lucide-react";
import { Badge } from "../ui/badge";
import toast from "react-hot-toast";
import { addUser } from "@/app/[locale]/_Lib/actions";
const validationSchema = yup.object({
  firstName: yup.string().required("Required"),
  lastName: yup.string().required("Required"),
  // permissions: yup.array().required(" Required"),
});
function UserForm({
  formType = "add",
  submit = addUser,
  user,
  setRes,
  setOpen,
}) {
  const permissions = [
    { label: "Game", value: "AddGamePermission" },
    { label: "Player", value: "AddPlayerPermission" },
    { label: "Team", value: "AddTeamPermission" },
    { label: "Tournament", value: "AddTournamentPermission" },
    { label: "News", value: "AddNewsPermission" },
    { label: "Transfer", value: "AddTransferPermission" },
    { label: "Standing", value: "AddStandingPermission" },
    { label: "Settings", value: "AddSettingsPermission" },
    { label: "Support", value: "AddSupportPermission" },
    { label: "User", value: "AddUserPermission" },
  ];

  const formik = useFormik({
    initialValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      permissions: [],
      phone: user?.phone || "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        let dataValues = user ? { ...user, ...values } : { ...values };
        let permissionsUser = [];

        for (let i = 0; i < permissions.length; i++) {
          const permissionsData = {};
          if (dataValues?.[permissions[i].value] === "yes") {
            permissionsData.entity = permissions[i].label;
            if (dataValues?.["actions" + permissions[i].value]) {
              permissionsData.actions = dataValues?.[
                "actions" + permissions[i].value
              ].map((a) => a.value);
            }
          } else {
            continue;
          }
          if (permissionsData) permissionsUser.push(permissionsData);
        }

        dataValues = {
          ...dataValues,
          permissions: permissionsUser,
        };

        console.log(dataValues);

        const res = await submit(dataValues);
        formType === "add" && formik.resetForm();
        toast.success(
          formType === "add"
            ? "User added successfully"
            : "User updated successfully"
        );
        setRes(res);
        setOpen(true);
      } catch (error) {
        if (!error.toString().includes("Error: NEXT_REDIRECT")) {
          toast.error("An error occurred");
        } else {
          toast.success(
            formType === "add"
              ? "User added successfully"
              : "User updated successfully"
          );
        }
      }
      //
    },
  });

  const actions = [
    { label: "create", value: "create" },
    { label: "read", value: "read" },
    { label: "update", value: "update" },
    { label: "delete", value: "delete" },
  ];

  return (
    <form className="space-y-8 " onSubmit={formik.handleSubmit}>
      <FormSection>
        <FormRow>
          <InputApp
            onChange={formik.handleChange}
            label={"first name"}
            name={"firstName"}
            type={"text"}
            placeholder={"enter first name"}
            className="border-0 focus:outline-none "
            backGroundColor={"bg-dashboard-box  dark:bg-[#0F1017]"}
            textColor="text-[#677185]"
            icon={<UserCardIcon color={"text-[#677185]"} />}
            error={formik.touched.name && formik.errors.name}
            onBlur={formik.handleBlur}
            value={formik.values.firstName}
          />

          <InputApp
            onChange={formik.handleChange}
            label={"Last Name"}
            name={"lastName"}
            type={"text"}
            placeholder={"enter last name"}
            className="border-0 focus:outline-none "
            backGroundColor={"bg-dashboard-box  dark:bg-[#0F1017]"}
            textColor="text-[#677185]"
            icon={
              <EmailIcon
                className={"fill-[#677185]"}
                color={"text-[#677185]"}
              />
            }
            error={formik.touched.lastName && formik.errors.lastName}
            onBlur={formik.handleBlur}
            value={formik.values.lastName}
          />
        </FormRow>
        {formType === "edit" && (
          <InputApp
            onChange={formik.handleChange}
            label={"Phone"}
            name={"phone"}
            type={"text"}
            placeholder={"enter phone"}
            className="border-0 focus:outline-none "
            backGroundColor={"bg-dashboard-box  dark:bg-[#0F1017]"}
            textColor="text-[#677185]"
            icon={
              <EmailIcon
                className={"fill-[#677185]"}
                color={"text-[#677185]"}
              />
            }
            error={formik.touched.phone && formik.errors.phone}
            onBlur={formik.handleBlur}
            value={formik.values.phone}
          />
        )}
      </FormSection>

      {permissions.map((item, index) => {
        return (
          <FormSection>
            <FormRow>
              <SelectInput
                formik={formik}
                label={item.label + " Permission"}
                name={item.value}
                options={mappedArrayToSelectOptions(
                  [
                    { label: "yes", value: "yes" },
                    { label: "no", value: "no" },
                  ],
                  "label",
                  "value"
                )}
                error={formik.touched.actions && formik.errors.actions}
                onChange={(value) => {
                  formik.setFieldValue(item.value, value);
                }}
              />
              {/* <div className="flex-1">{item.value}</div> */}
              {formik.values[item.value] === "yes" && (
                <ComboboxInput
                  formik={formik}
                  label={"Actions"}
                  name={"actions" + item.value}
                  options={mappedArrayToSelectOptions(
                    actions,
                    "label",
                    "value"
                  )}
                  onSelect={(value) => {
                    formik.setFieldValue("actions", value);
                  }}
                  error={formik.touched.actions && formik.errors.actions}
                  placeholder={"Select actions"}
                  icon={
                    <PasswordIcon
                      className={"fill-[#677185]"}
                      color={"text-[#677185]"}
                    />
                  }
                />
              )}
            </FormRow>
          </FormSection>
        );
      })}
      <div className="flex justify-end">
        <Button
          // disabled={formik.isSubmitting || !formik.isValid}
          type="submit"
          className={
            "text-white text-center min-w-[100px] px-5 py-2 rounded-lg bg-green-primary cursor-pointer hover:bg-green-primary/80"
          }
        >
          {formik.isSubmitting ? (
            <Spinner />
          ) : formType === "add" ? (
            "Submit"
          ) : (
            "Edit"
          )}
        </Button>
      </div>
    </form>
  );
}

function ComboboxInput({
  formik,
  label,
  name,
  options,
  initialData,
  placeholder,
  onSelect,
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [selectedValues, setSelectedValues] = useState(initialData || []);

  const toggleSelection = (value) => {
    setSelectedValues((prev) =>
      prev.find((v) => v.value === value.value)
        ? prev.filter((v) => v.value !== value.value)
        : [...prev, value]
    );
  };

  const removeSelection = (value) => {
    setSelectedValues((prev) => prev.filter((v) => v.value !== value.value));
  };

  return (
    <div className="w-full  space-y-2 flex-1">
      {label && (
        <Label className={"mb-4 text-[#677185] dark:text-white"} htmlFor={id}>
          {label}
        </Label>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            // variant="outline"
            role="combobox"
            aria-expanded={open}
            className="h-auto min-h-12 w-full   justify-between bg-dashboard-box  dark:bg-[#0F1017] hover:bg-dashboard-box dark:hover:bg-[#0F1017] "
          >
            <div className="flex flex-wrap items-center gap-1 pr-2.5">
              {selectedValues.length > 0 ? (
                selectedValues.map((val) => {
                  const option = options.find((c) => c.value === val.value);

                  return option ? (
                    <Badge
                      className="text-sm"
                      key={val.value}
                      variant="outline"
                    >
                      {option.image && (
                        <img
                          width={20}
                          //   height={16}
                          src={option.image}
                          alt={option.name}
                        />
                      )}
                      {option.name}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-4"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeSelection(val);
                          formik.setFieldValue(
                            name,
                            selectedValues.filter((v) => v.value !== val.value)
                          );
                        }}
                        asChild
                      >
                        <span>
                          <XIcon className="size-4" />
                        </span>
                      </Button>
                    </Badge>
                  ) : null;
                })
              ) : (
                <span className="text-muted-foreground">{placeholder}</span>
              )}
            </div>
            <ChevronsUpDownIcon
              size={16}
              className="text-muted-foreground/80 shrink-0"
              aria-hidden="true"
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-(--radix-popper-anchor-width) p-0">
          <Command>
            <CommandInput placeholder={placeholder} />
            <CommandList>
              <CommandEmpty>No framework found.</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={() => {
                      toggleSelection(option);
                      console.log(formik.values[name]);
                      formik.values[name]
                        ? !formik.values[name].find(
                            (v) => v.value === option.value
                          )
                          ? formik.setFieldValue(name, [
                              ...formik.values[name],
                              option,
                            ])
                          : formik.setFieldValue(
                              name,
                              formik.values[name].filter(
                                (v) => v.value !== option.value
                              )
                            )
                        : formik.setFieldValue(name, [option]);
                    }}
                  >
                    {(option.image || option.logo) && (
                      <img
                        width={20}
                        //   height={16}
                        src={option.image || option.logo}
                        alt={""}
                        className="mr-2"
                      />
                    )}{" "}
                    <span className="truncate">{option.name}</span>
                    {selectedValues.find((value) => {
                      return value.value === option.value;
                    }) && <CheckIcon size={16} className="ml-auto" />}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default UserForm;
