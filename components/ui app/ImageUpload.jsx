"use client";
import { uploadPhoto } from "@/app/[locale]/_Lib/actions";
import Image from "next/image";
import { useState, useCallback } from "react";
import { Upload, X, Loader2, ImageIcon, Check } from "lucide-react";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";
import ImageCropper from "./ImageCropper";
import { getImageSpec, isValidImageType } from "@/app/[locale]/_Lib/imageSpecs";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

function ImageUpload({
  label,
  name,
  formik,
  placeholder = "Drop image here or click to upload",
  aspectRatio = "square", // square, landscape, portrait, news-cover, wide (legacy)
  imageType = null, // NEW: Image type from IMAGE_SPECS (locks aspect ratio)
  enableCrop = true,
  showUrlInput = false,
  compact = false, // Smaller version for compact layouts
  hint,
}) {
  // Get spec if imageType is provided
  const imageSpec = imageType && isValidImageType(imageType) ? getImageSpec(imageType) : null;
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showCropper, setShowCropper] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const t = useTranslations("ImageUpload");

  const rawValue = formik?.values?.[name] || "";
  // Support both string URLs and ImageSizes objects { thumbnail, medium, large }
  const displayUrl = typeof rawValue === "object" && rawValue !== null
    ? (rawValue.large || rawValue.medium || rawValue.thumbnail || "")
    : rawValue;
  const currentValue = displayUrl;
  const hasImage = !!displayUrl;
  const error = formik?.touched?.[name] && formik?.errors?.[name];

  // Aspect ratio CSS classes (legacy)
  const aspectClasses = {
    square: "aspect-square",
    landscape: "aspect-video", // 16:9
    portrait: "aspect-[3/4]",
    "news-cover": "aspect-[1200/630]", // Social media standard
    wide: "aspect-[2/1]",
    "4:3": "aspect-[4/3]",
    "3:2": "aspect-[3/2]",
  };

  // Determine aspect class from imageSpec or legacy aspectRatio
  const getAspectClass = () => {
    if (imageSpec) {
      const ratio = imageSpec.aspectRatio;
      if (ratio === 1) return "aspect-square";
      if (ratio === 16 / 9) return "aspect-video";
      if (ratio === 3 / 4) return "aspect-[3/4]";
      if (ratio === 3 / 2) return "aspect-[3/2]";
      if (ratio === 2) return "aspect-[2/1]";
      // For custom ratios, use the exact ratio
      return `aspect-[${imageSpec.sizes.large.width}/${imageSpec.sizes.large.height}]`;
    }
    return aspectClasses[aspectRatio] || "aspect-square";
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
      // Pass imageType if provided for backend processing
      const url = await uploadPhoto(formData, imageType);
      await formik?.setFieldValue(name, url);
      await formik?.setFieldTouched(name, true, true);
      // Wrap validateField in try-catch to prevent schema mismatch errors
      try {
        formik?.validateField(name);
      } catch (validationError) {
        console.warn("Field validation skipped:", validationError.message);
      }
      toast.success(t?.("uploadSuccess") || "Image uploaded successfully");
    } catch (error) {
      console.error("Upload error:", error);
      // Show the actual error message if available
      const errorMessage = error?.message || t?.("uploadError") || "Failed to upload image";
      toast.error(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = async () => {
    await formik?.setFieldValue(name, "");
    await formik?.setFieldTouched(name, true, true);
    formik?.validateField(name);
  };

  const handleUrlChange = async (e) => {
    await formik?.setFieldValue(name, e.target.value);
    formik?.validateField(name);
  };

  return (
    <div className="flex-1 space-y-2">
      {label && (
        <label className="text-sm font-medium text-muted-foreground">
          {label}
        </label>
      )}

      <div
        className={`relative rounded-xl overflow-hidden transition-all ${getAspectClass()} ${
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

      {/* Hint text */}
      {hint && !hasImage && (
        <p className="text-xs text-muted-foreground">{hint}</p>
      )}

      {/* Image Cropper */}
      <ImageCropper
        isOpen={showCropper}
        onClose={handleCropperClose}
        imageSrc={previewUrl}
        onCropComplete={handleCropComplete}
        defaultAspect={aspectRatio}
        imageType={imageType}
      />
    </div>
  );
}

export default ImageUpload;
