"use client";
import { useState, useRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getImgUrl } from "@/lib/utils";
import { Button } from "../ui/button";
import {
  Loader2,
  ExternalLink,
  Globe,
  Sparkles,
  ImageIcon,
  Sun,
  Moon,
  Check,
  Link2,
  Type,
  Upload,
  X,
  AlertCircle,
} from "lucide-react";
import {
  addAppSocialLink,
  updateAppSocialLink,
  uploadPhoto,
} from "@/app/[locale]/_Lib/actions";
import toast from "react-hot-toast";
import Image from "next/image";
import ImageCropper from "../ui app/ImageCropper";
import { Spinner } from "../ui/spinner";
import { useLocale } from "next-intl";

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  url: Yup.string().url("Invalid URL").required("URL is required"),
  darkImage: Yup.string(),
  lightImage: Yup.string().required("Light image URL is required"),
});

// Social media platforms with SVG icons
const socialPlatforms = [
  {
    name: "Twitter / X",
    placeholder: "https://x.com/username",
    color: "#000000",
    icon: "https://upload.wikimedia.org/wikipedia/commons/5/53/X_logo_2023_original.svg",
  },
  {
    name: "Facebook",
    placeholder: "https://facebook.com/page",
    color: "#1877F2",
    icon: "https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg",
  },
  {
    name: "Instagram",
    placeholder: "https://instagram.com/username",
    color: "#E4405F",
    icon: "https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png",
  },
  {
    name: "YouTube",
    placeholder: "https://youtube.com/@channel",
    color: "#FF0000",
    icon: "https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg",
  },
  {
    name: "Discord",
    placeholder: "https://discord.gg/invite",
    color: "#5865F2",
    icon: "https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0a6a49cf127bf92de1e2_icon_clyde_blurple_RGB.png",
  },
  {
    name: "Twitch",
    placeholder: "https://twitch.tv/channel",
    color: "#9146FF",
    icon: "https://upload.wikimedia.org/wikipedia/commons/d/d3/Twitch_Glitch_Logo_Purple.svg",
  },
  {
    name: "TikTok",
    placeholder: "https://tiktok.com/@username",
    color: "#000000",
    icon: "https://upload.wikimedia.org/wikipedia/en/a/a9/TikTok_logo.svg",
  },
  {
    name: "LinkedIn",
    placeholder: "https://linkedin.com/company/name",
    color: "#0A66C2",
    icon: "https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png",
  },
  {
    name: "Telegram",
    placeholder: "https://t.me/username",
    color: "#26A5E4",
    icon: "https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg",
  },
  {
    name: "WhatsApp",
    placeholder: "https://wa.me/1234567890",
    color: "#25D366",
    icon: "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg",
  },
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

function LinkForm({ t, setOpen, link, onSuccess }) {
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
      name: link?.name || "",
      url: link?.url || "",
      darkImage: getImgUrl(link?.image?.dark) || "",
      lightImage: getImgUrl(link?.image?.light) || "",
    },
    validationSchema,
    onSubmit: async (values) => {
      const linkData = {
        name: values.name,
        url: values.url,
        image: {
          light: values.lightImage,
          dark: values.darkImage || values.lightImage,
        },
      };

      try {
        if (link) {
          await updateAppSocialLink({ id: link.id, ...linkData });
          if (onSuccess) {
            onSuccess({ ...linkData, id: link.id });
          }
          toast.success(t("Link updated successfully"));
        } else {
          const response = await addAppSocialLink(linkData);
          if (onSuccess && response?.data) {
            onSuccess(response.data);
          }
          toast.success(t("Link added successfully"));
        }
        setOpen(false);
      } catch (error) {
        toast.error(error.message || t("An error occurred"));
      }
    },
  });

  const handlePlatformSelect = (platform) => {
    formik.setFieldValue("name", platform.name);
    formik.setFieldValue("url", platform.placeholder);
    formik.setFieldValue("lightImage", platform.icon);
    formik.setFieldValue("darkImage", platform.icon);
  };

  // Handle file selection
  const handleFileSelect = async (e, target) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      toast.error(t("File size must be less than 5MB"));
      return;
    }

    const imageUrl = URL.createObjectURL(file);
    setCropperImage(imageUrl);
    setCropperTarget(target);
    setShowCropper(true);
    e.target.value = "";
  };

  // Handle crop complete
  const handleCropComplete = async (croppedBlob) => {
    setShowCropper(false);

    const isLight = cropperTarget === "light";
    const setUploading = isLight ? setUploadingLight : setUploadingDark;
    const fieldName = isLight ? "lightImage" : "darkImage";

    setUploading(true);

    try {
      const croppedFile = new File([croppedBlob], "link-icon.png", {
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

  // Image Upload Card Component
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
            <span className="text-xs">{t("Light image URL is required")}</span>
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
          {/* Light/Dark Icon Preview Side by Side */}
          <div className="flex gap-2">
            <div className="relative">
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-white border border-gray-200 flex items-center justify-center flex-shrink-0 shadow-sm">
                {formik.values.lightImage ? (
                  <img
                    src={getImageUrl(formik.values.lightImage)}
                    alt={formik.values.name || "Link icon"}
                    className="w-full h-full object-contain p-2"
                  />
                ) : (
                  <Globe className="w-5 h-5 text-gray-400" />
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-yellow-400 flex items-center justify-center shadow-sm">
                <Sun className="w-2.5 h-2.5 text-yellow-800" />
              </div>
            </div>
            <div className="relative">
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-900 border border-gray-700 flex items-center justify-center flex-shrink-0 shadow-sm">
                {formik.values.darkImage || formik.values.lightImage ? (
                  <img
                    src={getImageUrl(formik.values.darkImage || formik.values.lightImage)}
                    alt={formik.values.name || "Link icon"}
                    className="w-full h-full object-contain p-2"
                  />
                ) : (
                  <Globe className="w-5 h-5 text-gray-500" />
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-indigo-500 flex items-center justify-center shadow-sm">
                <Moon className="w-2.5 h-2.5 text-white" />
              </div>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
              {formik.values.name || t("Link Name")}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate flex items-center gap-1">
              {formik.values.url || "https://example.com"}
              <ExternalLink className="w-3 h-3 flex-shrink-0" />
            </p>
          </div>
        </div>
      </div>

      {/* Platform Selection */}
      {!link && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-green-primary" />
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t("Quick Select Platform")}
            </label>
          </div>
          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-3 border border-gray-200 dark:border-gray-800">
            <div className="grid grid-cols-5 gap-2">
              {socialPlatforms.map((platform) => (
                <button
                  key={platform.name}
                  type="button"
                  onClick={() => handlePlatformSelect(platform)}
                  className={`relative flex flex-col items-center gap-1.5 p-2.5 rounded-xl transition-all ${
                    formik.values.name === platform.name
                      ? "bg-white dark:bg-gray-800 shadow-md ring-2 ring-green-primary"
                      : "hover:bg-white dark:hover:bg-gray-800 hover:shadow-sm"
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden">
                    <img
                      src={platform.icon}
                      alt={platform.name}
                      className="w-6 h-6 object-contain"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  </div>
                  <span className="text-[10px] text-gray-600 dark:text-gray-400 text-center leading-tight font-medium truncate w-full">
                    {platform.name.split(" / ")[0]}
                  </span>
                  {formik.values.name === platform.name && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-green-primary flex items-center justify-center shadow-sm">
                      <Check className="w-2.5 h-2.5 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Name & URL in Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Name Input */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Type className="w-4 h-4 text-gray-500" />
            {t("Name")} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            placeholder={t("EnterLinkNamePlaceholder")}
            className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-primary/50 focus:border-green-primary transition-all"
            {...formik.getFieldProps("name")}
          />
          {formik.touched.name && formik.errors.name && (
            <p className="text-red-500 text-sm mt-1">{t(formik.errors.name)}</p>
          )}
        </div>

        {/* URL Input */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Link2 className="w-4 h-4 text-gray-500" />
            {t("URL")} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="url"
            placeholder="https://example.com/profile"
            dir="ltr"
            className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-primary/50 focus:border-green-primary transition-all font-mono text-sm"
            {...formik.getFieldProps("url")}
          />
          {formik.touched.url && formik.errors.url && (
            <p className="text-red-500 text-sm mt-1">{t(formik.errors.url)}</p>
          )}
        </div>
      </div>

      {/* Image Upload Section */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <ImageIcon className="w-4 h-4 text-blue-500" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t("Link Icons")}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {t("Upload icons for light and dark mode")}
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
          {t("OptionalDarkIcon")}
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
              {link ? t("Updating") : t("Adding")}
            </>
          ) : link ? (
            t("Update Link")
          ) : (
            t("Add Link")
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

export default LinkForm;
