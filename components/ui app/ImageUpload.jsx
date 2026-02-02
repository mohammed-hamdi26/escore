"use client";
import { uploadPhoto } from "@/app/[locale]/_Lib/actions";
import Image from "next/image";
import { useState, useCallback } from "react";
import { Upload, X, Loader2, ImageIcon, Check } from "lucide-react";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";
import ImageCropper from "./ImageCropper";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

function ImageUpload({
  label,
  name,
  formik,
  placeholder = "Drop image here or click to upload",
  aspectRatio = "square", // square, landscape, portrait
  enableCrop = true,
  showUrlInput = false,
  compact = false, // Smaller version for compact layouts
  hint,
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showCropper, setShowCropper] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const t = useTranslations("ImageUpload");

  const currentValue = formik?.values?.[name] || "";
  const hasImage = !!currentValue;
  const error = formik?.touched?.[name] && formik?.errors?.[name];

  const aspectClasses = {
    square: "aspect-square",
    landscape: "aspect-video",
    portrait: "aspect-[3/4]",
  };

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) processFile(file);
  }, []);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = "";
  };

  const processFile = (file) => {
    if (!file.type.startsWith("image/")) {
      toast.error(t?.("invalidType") || "Please select an image file");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error(t?.("fileTooLarge") || "File size must be less than 5MB");
      return;
    }

    if (enableCrop) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setShowCropper(true);
    } else {
      uploadFile(file);
    }
  };

  const handleCropComplete = async (croppedBlob) => {
    setShowCropper(false);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    const croppedFile = new File([croppedBlob], "image.png", { type: "image/png" });
    await uploadFile(croppedFile);
  };

  const handleCropperClose = () => {
    setShowCropper(false);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const uploadFile = async (file) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const url = await uploadPhoto(formData);
      formik?.setFieldValue(name, url);
      formik?.setFieldTouched(name, true, false);
      toast.success(t?.("uploadSuccess") || "Image uploaded successfully");
    } catch (error) {
      console.error(error);
      toast.error(t?.("uploadError") || "Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    formik?.setFieldValue(name, "");
    formik?.setFieldTouched(name, true, false);
  };

  const handleUrlChange = (e) => {
    formik?.setFieldValue(name, e.target.value);
  };

  return (
    <div className="flex-1 space-y-2">
      {label && (
        <label className="text-sm font-medium text-muted-foreground">
          {label}
        </label>
      )}

      <div
        className={`relative rounded-xl overflow-hidden transition-all ${aspectClasses[aspectRatio]} ${
          isDragging
            ? "ring-2 ring-green-primary ring-offset-2 ring-offset-background"
            : error
            ? "ring-2 ring-red-500"
            : ""
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {hasImage ? (
          // Image Preview
          <div className="relative w-full h-full group">
            <Image
              src={currentValue}
              alt={label || "Uploaded image"}
              fill
              className="object-cover"
              unoptimized
            />
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <label className="cursor-pointer p-3 rounded-full bg-white/20 hover:bg-white/30 transition-colors">
                <Upload className="size-5 text-white" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
              <button
                type="button"
                onClick={handleRemove}
                className="p-3 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors"
              >
                <X className="size-5 text-white" />
              </button>
            </div>
            {/* Success indicator */}
            <div className="absolute top-2 right-2 rtl:right-auto rtl:left-2 size-8 rounded-full bg-green-500 flex items-center justify-center">
              <Check className="size-4 text-white" />
            </div>
          </div>
        ) : (
          // Upload Zone
          <label
            className={`w-full h-full flex flex-col items-center justify-center cursor-pointer transition-all ${
              isDragging
                ? "bg-green-primary/10"
                : "bg-muted/50 dark:bg-[#1a1d2e] hover:bg-muted dark:hover:bg-[#252a3d]"
            } ${isUploading ? "pointer-events-none" : ""}`}
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              disabled={isUploading}
            />

            {isUploading ? (
              <div className={`flex flex-col items-center gap-2 text-muted-foreground ${compact ? "p-2" : ""}`}>
                <Loader2 className={`${compact ? "size-6" : "size-10"} animate-spin text-green-primary`} />
                <span className={`${compact ? "text-xs" : "text-sm"}`}>{t?.("uploading") || "Uploading..."}</span>
              </div>
            ) : (
              <div className={`flex flex-col items-center text-muted-foreground ${compact ? "gap-1 p-2" : "gap-3 p-4"}`}>
                <div className={`${compact ? "size-8" : "size-14"} rounded-full bg-green-primary/10 flex items-center justify-center`}>
                  <ImageIcon className={`${compact ? "size-4" : "size-7"} text-green-primary`} />
                </div>
                <div className="text-center">
                  <p className={`${compact ? "text-xs" : "text-sm"} font-medium text-foreground`}>
                    {compact ? (t?.("clickUpload") || "Click to upload") : (t?.("dropHere") || "Drop image here")}
                  </p>
                  {!compact && (
                    <p className="text-xs mt-1">
                      {t?.("orClick") || "or click to browse"}
                    </p>
                  )}
                </div>
                <p className={`${compact ? "text-[10px]" : "text-xs"}`}>
                  {t?.("maxSize") || "PNG, JPG up to 5MB"}
                </p>
              </div>
            )}
          </label>
        )}
      </div>

      {/* Optional URL Input */}
      {showUrlInput && (
        <input
          type="text"
          value={currentValue}
          onChange={handleUrlChange}
          onBlur={() => formik?.setFieldTouched(name, true)}
          placeholder={t?.("urlPlaceholder") || "Or paste image URL"}
          className="w-full h-10 px-4 rounded-lg bg-muted/50 dark:bg-[#1a1d2e] border-0 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-green-primary/50"
        />
      )}

      {/* Error Message */}
      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}

      {/* Image Cropper */}
      <ImageCropper
        isOpen={showCropper}
        onClose={handleCropperClose}
        imageSrc={previewUrl}
        onCropComplete={handleCropComplete}
      />
    </div>
  );
}

export default ImageUpload;
