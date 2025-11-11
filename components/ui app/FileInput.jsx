"use client";
import { useState } from "react";
import ImageIcon from "../icons/ImageIcon";
import { fi } from "date-fns/locale";
import Image from "next/image";
import InputApp from "./InputApp";
import apiClient from "@/app/[locale]/_Lib/apiCLient";
import { uploadPhoto } from "@/app/[locale]/_Lib/actions";
import { Button } from "../ui/button";
import toast from "react-hot-toast";
import { useFormik } from "formik";

const { Input } = require("../ui/input");
const { Label } = require("../ui/label");

function FileInput({
  label,
  icon,
  limitFiles = 8,
  formik,
  name,
  placeholder,
  ...props
}) {
  const [file, setFiles] = useState(null);
  const [url, setUrl] = useState(formik?.values?.[name]);

  async function handleAddFile(e) {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(e.target.files[0]);
      formik.setFieldValue(name, e.target.files[0]);
    }
  }
  console.log(name);

  return (
    <div className="flex-1">
      <Label className={"text-[#677185] dark:text-white mb-4"}>{label}</Label>
      <div className="flex justify-between items-center gap-4    ">
        {/* {file && <PreviewImage files={file} />} */}
        <UploadFile
          name={`${name}-file`}
          handleAddFile={handleAddFile}
          {...props}
        />
        {file && (
          <Button
            type="button"
            onClick={async () => {
              try {
                const formData = new FormData();
                formData.append("file", file);
                const url = await uploadPhoto(formData);
                setUrl(`https://db8f573bab41.ngrok-free.app${url}`);
                formik.setFieldValue(
                  name,
                  `https://db8f573bab41.ngrok-free.app${url}`
                );
                toast.success("uploaded Photo");
                return url;
              } catch (e) {
                console.log(e);
                toast.error("error");
              }
            }}
          >
            Upload
          </Button>
        )}

        <InputApp
          value={url}
          onChange={formik.handleChange}
          // name={"logo"}
          name={name}
          type={"text"}
          placeholder={placeholder}
          className="p-0 border-0 focus:outline-none  "
          backGroundColor={"bg-dashboard-box  dark:bg-[#0F1017]"}
          textColor="text-[#677185]"
        />
      </div>
    </div>
  );
}

function UploadFile({ name, handleAddFile, ...props }) {
  return (
    <>
      <Label className={"cursor-pointer"} htmlFor={name}>
        <ImageIcon />
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

function PreviewImage({ files }) {
  return (
    <div className="grid grid-cols-4 gap-4">
      {files.map((file, index) => (
        <div className="relative size-10 overflow-hidden rounded-full ">
          <Image
            fill
            alt="file"
            className=" object-cover"
            key={index}
            src={URL.createObjectURL(file)}
          />
        </div>
      ))}
    </div>
  );
}
export default FileInput;
