"use client";
import { useState } from "react";
import ImageIcon from "../icons/ImageIcon";
import { fi } from "date-fns/locale";
import Image from "next/image";

const { Input } = require("../ui/input");
const { Label } = require("../ui/label");

function FileInput({ label, icon, limitFiles = 8, formik, name, ...props }) {
  const [files, setFiles] = useState([]);

  function handleAddFile(e) {
    if (e.target.files && e.target.files.length > 0) {
      setFiles([...files, e.target.files[0]]);
      formik.setFieldValue(name, [...files, e.target.files[0]]);
    }
  }

  return (
    <div className="flex-1">
      <Label className={"text-[#677185] dark:text-white mb-4"}>{label}</Label>
      <div className="flex justify-between items-center gap-4 border-2 dark:border-[#677185] rounded-[10px]   px-4 py-2">
        {files.length > 0 && <PreviewImage files={files} />}
        {files.length < limitFiles && (
          <UploadFile name={name} handleAddFile={handleAddFile} {...props} />
        )}
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
        {...props}
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
