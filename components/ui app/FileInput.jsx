"use client";
import { uploadPhoto } from "@/app/[locale]/_Lib/actions";
import Image from "next/image";
import { useState } from "react";
import ImageIcon from "../icons/ImageIcon";
import InputApp from "./InputApp";

import { ChevronUp, X } from "lucide-react";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";
import { Spinner } from "../ui/spinner";

const { Input } = require("../ui/input");
const { Label } = require("../ui/label");

function FileInput({
  label,
  icon,
  limitFiles = 8,
  formik,
  name,
  placeholder,
  disabled,
  typeFile = "image",
  flexGrow = "flex-1",
  error,
  ...props
}) {
  const [file, setFiles] = useState(null);
  const [url, setUrl] = useState(formik?.values?.[name]);
  const [isLoading, setIsLoading] = useState(false);
  const t = useTranslations("toast");

  async function handleAddFile(e) {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(e.target.files[0]);
    }
  }

  return (
    <div className={flexGrow + " "}>
      {label && (
        <Label className={"text-[#677185] dark:text-white mb-4"}>{label}</Label>
      )}
      <div
        className={`flex    ${
          typeFile === "image" ? "justify-between" : ""
        } gap-4`}
      >
        <UploadFile
          icon={icon}
          name={`${name}-file`}
          handleAddFile={handleAddFile}
          {...props}
        />
        {file && (
          <div className="flex  items-center gap-2">
            <PreviewImage file={file} />
            {
              <Button
                disabled={disabled || isLoading}
                className={
                  "bg-green-primary hover:bg-green-primary/70 disabled:bg-green-primary/20 disabled:cursor-not-allowed "
                }
                onClick={async () => {
                  setIsLoading(true);
                  try {
                    const formData = new FormData();
                    formData.append("file", file);
                    const url = await uploadPhoto(formData);
                    setUrl(`${url}`);
                    formik.setFieldValue(name, `${url}`);
                    toast.success(t("uploaded Photo"));
                    return url;
                  } catch (e) {
                    toast.error(t("error uploading photo"));
                  } finally {
                    setIsLoading(false);
                  }
                }}
              >
                {isLoading ? <Spinner /> : <ChevronUp />}
              </Button>
            }
            <Button
              disabled={disabled || isLoading}
              className={
                "bg-red-700 hover:bg-red-700/70  disabled:bg-red-700/20 disabled:cursor-not-allowed "
              }
              onClick={() => {
                setFiles(null);
                setUrl("");
                formik.setFieldValue(name, "");
              }}
            >
              <X />
            </Button>
          </div>
        )}

        <InputApp
          value={formik.values?.[name]}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={error}
          hidden={typeFile !== "image" ? true : false}
          name={name}
          type={"text"}
          placeholder={placeholder}
          className={`p-0 border-0 focus:outline-none `}
          backGroundColor={"bg-dashboard-box  dark:bg-[#0F1017]"}
          textColor="text-[#677185]"
          flexGrow={flexGrow}
        />
      </div>
    </div>
  );
}

function UploadFile({ name, handleAddFile, icon, ...props }) {
  return (
    <>
      <Label className={"cursor-pointer"} htmlFor={name}>
        {icon ? icon : <ImageIcon />}
      </Label>
      <Input
        onChange={handleAddFile}
        id={name}
        accept="image/*"
        type="file"
        hidden
        className={"bg-dashboard-box  dark:bg-[#0F1017] "}
        // {...props}
      />
    </>
  );
}

function PreviewImage({ file }) {
  return (
    <div className="relative size-10 overflow-hidden rounded-full">
      <Image
        fill
        alt="file"
        className=" object-cover"
        src={URL.createObjectURL(file)}
      />
    </div>
  );
}

function Button({ children, className, onClick, disabled }) {
  return (
    <button
      className={` text-white rounded-full size-8 flex justify-center items-center transition duration-300 cursor-pointer ${className} `}
      type="button"
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
export default FileInput;
