"use client";
import { useState, useRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button } from "../ui/button";
import {
  Loader2,
  Sparkles,
  ImageIcon,
  Sun,
  Moon,
  Check,
  Type,
  Upload,
  X,
  AlertCircle,
  UserCircle,
} from "lucide-react";
import {
  addAvatar,
  updateAvatar,
  uploadPhoto,
} from "@/app/[locale]/_Lib/actions";
import toast from "react-hot-toast";
import ImageCropper from "../ui app/ImageCropper";
import { Spinner } from "../ui/spinner";
import { useLocale } from "next-intl";

const validationSchema = Yup.object({
  name: Yup.string().min(1).max(100).required("Name is required"),
  lightImage: Yup.string().required("Light image is required"),
  darkImage: Yup.string(),
});

function AvatarForm({ t, setOpen, avatar, onSuccess }) {
  const locale = useLocale();
  const isRTL = locale === "ar";
  const [uploadingLight, setUploadingLight] = useState(false);
  const [uploadingDark, setUploadingDark] = useState(false);
  const [showCropper, setShowCropper] = useState(false);
  const [cropperImage, setCropperImage] = useState(null);
  const [cropperTarget, setCropperTarget] = useState(null);
  const lightInputRef = useRef(null);
  const darkInputRef = useRef(null);

  const formik = useFormik({
    initialValues: {
      name: avatar?.name || "",
      lightImage: avatar?.image?.light || "",
      darkImage: avatar?.image?.dark || "",
    },
    validationSchema,
    onSubmit: async (values) => {
      const avatarData = {
        name: values.name,
        image: {
          light: values.lightImage,
          ...(values.darkImage && { dark: values.darkImage }),
        },
      };

      try {
        if (avatar) {
          await updateAvatar({ id: avatar.id, ...avatarData });
          if (onSuccess) {
            onSuccess({ ...avatarData, id: avatar.id });
          }
          toast.success(t("Avatar updated successfully"));
        } else {
          const response = await addAvatar(avatarData);
          if (onSuccess && response?.data) {
            onSuccess(response.data);
          }
          toast.success(t("Avatar added successfully"));
        }
        setOpen(false);
      } catch (error) {
        toast.error(error.message || t("An error occurred"));
      }
    },
  });

  const handleFileSelect = async (e, target) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error(t("File size must be less than 5MB"));
      return;
    }

    const imageUrl = URL.createObjectURL(file);
    setCropperImage(imageUrl);
    setCropperTarget(target);
    setShowCropper(true);
    e.target.value = "";
  };

  const handleCropComplete = async (croppedBlob) => {
    setShowCropper(false);

    const isLight = cropperTarget === "light";
    const setUploading = isLight ? setUploadingLight : setUploadingDark;
    const fieldName = isLight ? "lightImage" : "darkImage";

    setUploading(true);

    try {
      const croppedFile = new File([croppedBlob], "avatar.png", {
        type: "image/png",
      });

      const formData = new FormData();
      formData.append("image", croppedFile);
      const url = await uploadPhoto(formData);

      formik.setFieldValue(fieldName, url);
      toast.success(t("Image uploaded successfully"));
    } catch (error) {
      toast.error(t("Failed to upload image"));
    } finally {
      setUploading(false);
      if (cropperImage) {
        URL.revokeObjectURL(cropperImage);
        setCropperImage(null);
      }
    }
  };

  const handleCropperClose = () => {
    setShowCropper(false);
    if (cropperImage) {
      URL.revokeObjectURL(cropperImage);
      setCropperImage(null);
    }
  };

  const removeImage = (fieldName) => {
    formik.setFieldValue(fieldName, "");
  };

  const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }
    return `${process.env.NEXT_PUBLIC_BASE_URL}${url}`;
  };

  const ImageUploadCard = ({
    label,
    icon: Icon,
    iconColor,
    bgGradient,
    borderColor,
    value,
    fieldName,
    inputRef,
    isUploading,
    isRequired,
    hasError,
  }) => {
    const hasImage = !!value;
    const imageUrl = getImageUrl(value);

    return (
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <div className={`w-6 h-6 rounded-full ${iconColor === "text-amber-400" ? "bg-yellow-400" : "bg-indigo-500"} flex items-center justify-center`}>
            <Icon className={`w-3.5 h-3.5 ${iconColor === "text-amber-400" ? "text-yellow-800" : "text-white"}`} />
          </div>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
            {isRequired && <span className="text-red-500 ml-1">*</span>}
          </span>
        </div>

        <div
          className={`relative rounded-xl overflow-hidden transition-all duration-300 ${
            hasImage
              ? "ring-2 ring-green-primary/50"
              : hasError
              ? "ring-2 ring-red-500/50"
              : "ring-1 ring-gray-200 dark:ring-white/10 hover:ring-gray-300 dark:hover:ring-white/20"
          }`}
        >
          {hasImage ? (
            <div className={`relative aspect-square ${bgGradient}`}>
              <img
                src={imageUrl}
                alt={label}
                className="w-full h-full object-contain p-4"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
              <div className="absolute top-2 left-2 bg-green-500 text-white rounded-full p-1">
                <Check className="w-3 h-3" />
              </div>
              <button
                type="button"
                onClick={() => removeImage(fieldName)}
                disabled={formik.isSubmitting}
                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 transition-colors disabled:opacity-50"
              >
                <X className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                disabled={formik.isSubmitting || isUploading}
                className="absolute bottom-2 right-2 bg-black/70 hover:bg-black/90 text-white text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <Upload className="w-3 h-3" />
                {t("Replace")}
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={formik.isSubmitting || isUploading}
              className={`w-full aspect-square ${bgGradient} border-2 border-dashed ${borderColor} rounded-xl flex flex-col items-center justify-center gap-3 transition-all hover:border-opacity-100 disabled:opacity-50 disabled:cursor-not-allowed group`}
            >
              {isUploading ? (
                <>
                  <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-white/10 flex items-center justify-center">
                    <Spinner className="w-6 h-6" />
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {t("Uploading")}
                  </span>
                </>
              ) : (
                <>
                  <div className="w-14 h-14 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center group-hover:bg-gray-200 dark:group-hover:bg-white/10 transition-colors">
                    <Icon className={`w-7 h-7 ${iconColor}`} />
                  </div>
                  <div className="text-center px-4">
                    <p className="text-sm font-medium text-gray-700 dark:text-white">
                      {t("Click to upload")}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      PNG, JPG {t("up to")} 5MB
                    </p>
                  </div>
                </>
              )}
            </button>
          )}

          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={(e) =>
              handleFileSelect(e, fieldName === "lightImage" ? "light" : "dark")
            }
            className="hidden"
          />
        </div>

        {hasError && (
          <div className="flex items-center gap-1.5 mt-2 text-red-500">
            <AlertCircle className="w-3 h-3" />
            <span className="text-xs">{t("Light image is required")}</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <form className="space-y-5" onSubmit={formik.handleSubmit}>
      {/* Live Preview */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-gray-900/50 dark:to-gray-800/30 rounded-xl p-4 border border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-green-primary" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t("Preview")}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <div className="relative">
              <div className="w-14 h-14 rounded-full overflow-hidden bg-white border border-gray-200 flex items-center justify-center flex-shrink-0 shadow-sm">
                {formik.values.lightImage ? (
                  <img
                    src={getImageUrl(formik.values.lightImage)}
                    alt={formik.values.name || "Avatar"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <UserCircle className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-yellow-400 flex items-center justify-center shadow-sm">
                <Sun className="w-2.5 h-2.5 text-yellow-800" />
              </div>
            </div>
            <div className="relative">
              <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-900 border border-gray-700 flex items-center justify-center flex-shrink-0 shadow-sm">
                {formik.values.darkImage || formik.values.lightImage ? (
                  <img
                    src={getImageUrl(formik.values.darkImage || formik.values.lightImage)}
                    alt={formik.values.name || "Avatar"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <UserCircle className="w-8 h-8 text-gray-500" />
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-indigo-500 flex items-center justify-center shadow-sm">
                <Moon className="w-2.5 h-2.5 text-white" />
              </div>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
              {formik.values.name || t("Avatar Name")}
            </h3>
          </div>
        </div>
      </div>

      {/* Name Input */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          <Type className="w-4 h-4 text-gray-500" />
          {t("Name")} <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="name"
          placeholder={t("Enter avatar name")}
          className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-primary/50 focus:border-green-primary transition-all"
          {...formik.getFieldProps("name")}
        />
        {formik.touched.name && formik.errors.name && (
          <p className="text-red-500 text-sm mt-1">{t(formik.errors.name)}</p>
        )}
      </div>

      {/* Image Upload Section */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <ImageIcon className="w-4 h-4 text-blue-500" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t("Avatar Images")}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {t("Upload images for light and dark mode")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <ImageUploadCard
            label={t("Light Mode")}
            icon={Sun}
            iconColor="text-amber-400"
            bgGradient="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-200 dark:to-gray-300"
            borderColor="border-amber-400/30"
            value={formik.values.lightImage}
            fieldName="lightImage"
            inputRef={lightInputRef}
            isUploading={uploadingLight}
            isRequired={true}
            hasError={formik.touched.lightImage && formik.errors.lightImage}
          />

          <ImageUploadCard
            label={t("Dark Mode")}
            icon={Moon}
            iconColor="text-indigo-400"
            bgGradient="bg-gradient-to-br from-[#1a1f2e] to-[#0F1017]"
            borderColor="border-indigo-400/30"
            value={formik.values.darkImage}
            fieldName="darkImage"
            inputRef={darkInputRef}
            isUploading={uploadingDark}
            isRequired={false}
            hasError={false}
          />
        </div>

        <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
          {t("Optional dark image")}
        </p>
      </div>

      {/* Submit Button */}
      <div className={`flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-800 ${isRTL ? "flex-row-reverse" : "justify-end"}`}>
        <Button
          type="button"
          variant="outline"
          onClick={() => setOpen(false)}
          className="px-6 py-2.5 rounded-xl border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          {t("Cancel")}
        </Button>
        <Button
          disabled={formik.isSubmitting || !formik.isValid}
          type="submit"
          className="bg-green-primary hover:bg-green-primary/90 text-white px-8 py-2.5 rounded-xl font-medium flex items-center gap-2"
        >
          {formik.isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {avatar ? t("Updating") : t("Adding")}
            </>
          ) : avatar ? (
            t("Update Avatar")
          ) : (
            t("Add Avatar")
          )}
        </Button>
      </div>

      {/* Image Cropper */}
      <ImageCropper
        isOpen={showCropper}
        onClose={handleCropperClose}
        imageSrc={cropperImage}
        onCropComplete={handleCropComplete}
        defaultAspect="square"
      />
    </form>
  );
}

export default AvatarForm;
