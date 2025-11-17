"use client";
import { uploadPhoto } from "@/app/[locale]/_Lib/actions";
import Image from "next/image";
import { useState } from "react";
import ImageIcon from "../icons/ImageIcon";
import InputApp from "./InputApp";

import { ChevronUp, X } from "lucide-react";
import toast from "react-hot-toast";

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
  t,
  ...props
}) {
  const [file, setFiles] = useState(null);
  const [url, setUrl] = useState(formik?.values?.[name]);

  async function handleAddFile(e) {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(e.target.files[0]);
    }
  }
  // console.log(name);

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
                disabled={disabled}
                className={"bg-green-primary hover:bg-green-primary/70 "}
                onClick={async () => {
                  try {
                    const formData = new FormData();
                    formData.append("file", file);
                    const url = await uploadPhoto(formData);
                    setUrl(`https://b1fd0acd5715.ngrok-free.app${url}`);
                    formik.setFieldValue(
                      name,
                      `https://b1fd0acd5715.ngrok-free.app${url}`
                    );
                    toast.success("uploaded Photo");
                    return url;
                  } catch (e) {
                    // console.log(e);
                    toast.error("error");
                  }
                }}
              >
                <ChevronUp />
              </Button>
            }
            <Button
              className={"bg-red-700 hover:bg-red-700/70 "}
              onClick={() => {
                setFiles(null);
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
          // name={"logo"}
          t={t}
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

function Button({ children, className, onClick }) {
  return (
    <button
      className={` text-white rounded-full size-8 flex justify-center items-center transition duration-300 cursor-pointer ${className} `}
      type="button"
      onClick={onClick}
    >
      {children}
    </button>
  );
}
export default FileInput;
