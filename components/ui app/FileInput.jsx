"use client";
import { uploadPhoto } from "@/app/[locale]/_Lib/actions";
import Image from "next/image";
import { useState, useEffect } from "react";
import ImageIcon from "../icons/ImageIcon";
import InputApp from "./InputApp";
import ImageCropper from "./ImageCropper";

import { ChevronUp, X, Crop } from "lucide-react";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";
import { Spinner } from "../ui/spinner";

const { Input } = require("../ui/input");
const { Label } = require("../ui/label");

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

function FileInput({
  showIcon = true,
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
  inputAuth = false,
  enableCrop = true, // New prop to enable/disable cropping
  ...props
}) {
  const [file, setFiles] = useState(null);
  const [url, setUrl] = useState(formik?.values?.[name]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCropper, setShowCropper] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const t = useTranslations("toast");
  const tCropper = useTranslations("imageCropper");

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  async function handleAddFile(e) {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];

      // Check file size (5MB max)
      if (selectedFile.size > MAX_FILE_SIZE) {
        toast.error(tCropper("fileTooLarge"));
        formik?.setFieldError(name, tCropper("fileTooLarge"));
        formik?.setFieldTouched(name, true, false);
        // Reset the input
        e.target.value = "";
        return;
      }

      // If cropping is enabled and it's an image, show the cropper
      if (enableCrop && selectedFile.type.startsWith("image/")) {
        const imageUrl = URL.createObjectURL(selectedFile);
        setPreviewUrl(imageUrl);
        setShowCropper(true);
      } else {
        // No cropping, just set the file directly
        setFiles(selectedFile);
      }

      // Reset the input to allow selecting the same file again
      e.target.value = "";
    }
  }

  function handleCropComplete(croppedBlob) {
    // Convert blob to File object
    const croppedFile = new File([croppedBlob], "cropped-image.jpg", {
      type: "image/jpeg",
    });
    setFiles(croppedFile);
    setShowCropper(false);

    // Cleanup preview URL
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  }

  function handleCropperClose() {
    setShowCropper(false);
    // Cleanup preview URL
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
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
            {/* Re-crop button */}
            {enableCrop && (
              <Button
                disabled={disabled || isLoading}
                className={
                  "bg-blue-600 hover:bg-blue-600/70 disabled:bg-blue-600/20 disabled:cursor-not-allowed"
                }
                onClick={() => {
                  const imageUrl = URL.createObjectURL(file);
                  setPreviewUrl(imageUrl);
                  setShowCropper(true);
                }}
                title={tCropper("title")}
              >
                <Crop className="size-4" />
              </Button>
            )}
            {/* Upload button */}
            <Button
              disabled={disabled || isLoading}
              className={
                "bg-green-primary hover:bg-green-primary/70 disabled:bg-green-primary/20 disabled:cursor-not-allowed "
              }
              onClick={async () => {
                setIsLoading(true);
                try {
                  // File size already validated, but double-check
                  if (file.size > MAX_FILE_SIZE) {
                    formik.setFieldError(name, tCropper("fileTooLarge"));
                    formik.setFieldTouched(name, true, false);
                    toast.error(tCropper("fileTooLarge"));
                    return;
                  } else {
                    formik.setFieldError(name, "");
                    formik.setFieldTouched(name, true, false);
                  }
                  const formData = new FormData();
                  formData.append("image", file);
                  const url = await uploadPhoto(formData);
                  setUrl(`${url}`);
                  formik.setFieldValue(name, `${url}`);
                  toast.success(t("uploaded Photo"));
                  return url;
                } catch (e) {
                  console.log(e);
                  toast.error(t("error uploading photo"));
                } finally {
                  setIsLoading(false);
                }
              }}
            >
              {isLoading ? <Spinner /> : <ChevronUp />}
            </Button>
            {/* Remove button */}
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
          className={!inputAuth && `p-0 border-0 focus:outline-none `}
          backGroundColor={!inputAuth && "bg-dashboard-box  dark:bg-[#0F1017]"}
          textColor={!inputAuth && "text-[#677185]"}
          flexGrow={flexGrow}
        />
      </div>

      {/* Image Cropper Dialog */}
      <ImageCropper
        isOpen={showCropper}
        onClose={handleCropperClose}
        imageSrc={previewUrl}
        onCropComplete={handleCropComplete}
      />
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
    <div className="relative size-10 ">
      <Image
        fill
        alt="file"
        className=" object-cover"
        src={URL.createObjectURL(file)}
      />
    </div>
  );
}

function Button({ children, className, onClick, disabled, title }) {
  return (
    <button
      className={` text-white rounded-full size-8 flex justify-center items-center transition duration-300 cursor-pointer ${className} `}
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
    >
      {children}
    </button>
  );
}
export default FileInput;
