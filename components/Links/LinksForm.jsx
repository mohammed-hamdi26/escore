"use client";

import { useState, useRef } from "react";
import { editLinks, uploadPhoto } from "@/app/[locale]/_Lib/actions";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import * as Yup from "yup";
import InputApp from "../ui app/InputApp";
import { Button } from "../ui/button";
import { useTranslations } from "next-intl";
import { Spinner } from "../ui/spinner";
import { Switch } from "../ui/switch";
import {
  Link2,
  ImageIcon,
  Sun,
  Moon,
  Upload,
  X,
  Check,
  AlertCircle,
  Globe,
  Save,
  Sparkles,
  Eye,
  EyeOff,
} from "lucide-react";
import ImageCropper from "../ui app/ImageCropper";

// Common social platform presets
const SOCIAL_PRESETS = [
  {
    name: "Twitter / X",
    icon: "https://upload.wikimedia.org/wikipedia/commons/5/53/X_logo_2023_original.svg",
    placeholder: "https://twitter.com/username",
  },
  {
    name: "Discord",
    icon: "https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0a6a49cf127bf92de1e2_icon_clyde_blurple_RGB.png",
    placeholder: "https://discord.gg/invite",
  },
  {
    name: "YouTube",
    icon: "https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg",
    placeholder: "https://youtube.com/@channel",
  },
  {
    name: "Twitch",
    icon: "https://upload.wikimedia.org/wikipedia/commons/d/d3/Twitch_Glitch_Logo_Purple.svg",
    placeholder: "https://twitch.tv/username",
  },
  {
    name: "Instagram",
    icon: "https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png",
    placeholder: "https://instagram.com/username",
  },
  {
    name: "TikTok",
    icon: "https://upload.wikimedia.org/wikipedia/en/a/a9/TikTok_logo.svg",
    placeholder: "https://tiktok.com/@username",
  },
  {
    name: "Facebook",
    icon: "https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg",
    placeholder: "https://facebook.com/page",
  },
  {
    name: "LinkedIn",
    icon: "https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png",
    placeholder: "https://linkedin.com/in/username",
  },
];

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  icon: Yup.string().required("Icon is required"),
  url: Yup.string().url("Invalid URL").required("URL is required"),
});

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

function LinksForm({ players, teams, id, linksType = "players", link, setOpen }) {
  const t = useTranslations("Links");
  const [uploadingLight, setUploadingLight] = useState(false);
  const [uploadingDark, setUploadingDark] = useState(false);
  const [showCropper, setShowCropper] = useState(false);
  const [cropperImage, setCropperImage] = useState(null);
  const [cropperTarget, setCropperTarget] = useState(null);
  const [showPresets, setShowPresets] = useState(!link); // Show presets for new links
  const lightInputRef = useRef(null);
  const darkInputRef = useRef(null);

  const formik = useFormik({
    initialValues: {
      name: link?.name || "",
      icon: link?.image?.light || "",
      iconDark: link?.image?.dark || link?.image?.iconDark || "",
      url: link?.url || "",
      isActive: link?.isActive !== undefined ? link.isActive : true,
    },
    onSubmit: async (values) => {
      const linkData = link ? { id: link.id, ...values } : values;
      linkData.image = {
        light: values.icon,
        dark: values.iconDark || values.icon,
        iconDark: values.iconDark || values.icon,
      };
      linkData.isActive = values.isActive;
      try {
        linksType === "players"
          ? await editLinks("players", id, linkData)
          : await editLinks("teams", id, linkData);
        !link && formik.resetForm();
        toast.success(
          link ? t("Link updated successfully") : t("Link added successfully")
        );
        setOpen(false);
      } catch (error) {
        toast.error(error.message);
      }
    },
    validationSchema,
  });

  // Apply preset
  const applyPreset = (preset) => {
    formik.setFieldValue("name", preset.name);
    formik.setFieldValue("icon", preset.icon);
    formik.setFieldValue("iconDark", preset.icon);
    setShowPresets(false);
  };

  // Handle file selection
  const handleFileSelect = async (e, target) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      toast.error(t("fileTooLarge") || "File size must be less than 5MB");
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
    const fieldName = isLight ? "icon" : "iconDark";

    setUploading(true);

    try {
      const croppedFile = new File([croppedBlob], "link-icon.png", {
        type: "image/png",
      });

      const formData = new FormData();
      formData.append("image", croppedFile);
      const url = await uploadPhoto(formData);

      formik.setFieldValue(fieldName, url);
      toast.success(t("imageUploaded") || "Image uploaded successfully");
    } catch (error) {
      toast.error(t("uploadError") || "Failed to upload image");
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

    return (
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <Icon className={`size-4 ${iconColor}`} />
          <span className="text-sm font-medium text-foreground">
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
              : "ring-1 ring-white/10 hover:ring-white/20"
          }`}
        >
          {hasImage ? (
            <div className={`relative aspect-square ${bgGradient}`}>
              <img
                src={value}
                alt={label}
                className="w-full h-full object-contain p-4"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
              <div className="absolute top-2 left-2 bg-green-500 text-white rounded-full p-1">
                <Check className="size-3" />
              </div>
              <button
                type="button"
                onClick={() => removeImage(fieldName)}
                disabled={formik.isSubmitting}
                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 transition-colors disabled:opacity-50"
              >
                <X className="size-3" />
              </button>
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                disabled={formik.isSubmitting || isUploading}
                className="absolute bottom-2 right-2 bg-black/70 hover:bg-black/90 text-white text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <Upload className="size-3" />
                {t("replace") || "Replace"}
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
                  <div className="size-12 rounded-full bg-white/10 flex items-center justify-center">
                    <Spinner className="size-6" />
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {t("uploading") || "Uploading..."}
                  </span>
                </>
              ) : (
                <>
                  <div className="size-14 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                    <Icon className={`size-7 ${iconColor}`} />
                  </div>
                  <div className="text-center px-4">
                    <p className="text-sm font-medium text-foreground">
                      {t("clickToUpload") || "Click to upload"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PNG, JPG {t("upTo") || "up to"} 5MB
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
              handleFileSelect(e, fieldName === "icon" ? "light" : "dark")
            }
            className="hidden"
          />
        </div>

        {hasError && (
          <div className="flex items-center gap-1.5 mt-2 text-red-500">
            <AlertCircle className="size-3" />
            <span className="text-xs">{t("Icon is required")}</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-5">
      {/* Quick Add Presets */}
      {showPresets && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-amber-400" />
              <span className="text-sm font-medium text-foreground">
                {t("quickAdd") || "Quick Add"}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setShowPresets(false)}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              {t("customLink") || "Custom Link"}
            </button>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {SOCIAL_PRESETS.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => applyPreset(preset)}
                className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all group"
              >
                <img
                  src={preset.icon}
                  alt={preset.name}
                  className="size-8 object-contain group-hover:scale-110 transition-transform"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
                <span className="text-xs text-muted-foreground group-hover:text-foreground truncate w-full text-center">
                  {preset.name.split(" ")[0]}
                </span>
              </button>
            ))}
          </div>
          <div className="border-t border-white/10 pt-3">
            <p className="text-xs text-muted-foreground text-center">
              {t("orAddCustom") || "Or add a custom link below"}
            </p>
          </div>
        </div>
      )}

      {/* Show Presets Button (when hidden) */}
      {!showPresets && !link && (
        <button
          type="button"
          onClick={() => setShowPresets(true)}
          className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-400 transition-all"
        >
          <Sparkles className="size-4" />
          <span className="text-sm">{t("showPresets") || "Show Quick Add Presets"}</span>
        </button>
      )}

      {/* Link Name */}
      <InputApp
        label={t("Name")}
        name="name"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        placeholder={t("namePlaceholder") || "Enter link name (e.g. Twitter, Discord)"}
        icon={<Link2 className="size-5 text-[#677185]" />}
        error={formik.touched.name && formik.errors.name && t(formik.errors.name)}
        disabled={formik.isSubmitting}
        value={formik.values.name}
        required
      />

      {/* Link URL */}
      <InputApp
        label={t("URL")}
        name="url"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        placeholder={
          SOCIAL_PRESETS.find((p) => p.name === formik.values.name)?.placeholder ||
          t("urlPlaceholder") ||
          "https://example.com/profile"
        }
        icon={<Globe className="size-5 text-[#677185]" />}
        error={formik.touched.url && formik.errors.url && t(formik.errors.url)}
        disabled={formik.isSubmitting}
        value={formik.values.url}
        required
      />

      {/* Visibility Toggle */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
        <div className="flex items-center gap-3">
          {formik.values.isActive ? (
            <Eye className="size-5 text-green-500" />
          ) : (
            <EyeOff className="size-5 text-muted-foreground" />
          )}
          <div>
            <p className="text-sm font-medium text-foreground">
              {t("visibility") || "Visibility"}
            </p>
            <p className="text-xs text-muted-foreground">
              {formik.values.isActive
                ? t("visibleInApp") || "Visible in app"
                : t("hiddenInApp") || "Hidden from app"}
            </p>
          </div>
        </div>
        <Switch
          checked={formik.values.isActive}
          onCheckedChange={(checked) => formik.setFieldValue("isActive", checked)}
          disabled={formik.isSubmitting}
        />
      </div>

      {/* Link Icons Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <ImageIcon className="size-4 text-blue-500" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-foreground">
              {t("linkIcons") || "Link Icons"}
            </h3>
            <p className="text-xs text-muted-foreground">
              {t("uploadBothModes") || "Upload icons for light and dark mode"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <ImageUploadCard
            label={t("lightMode") || "Light Mode"}
            icon={Sun}
            iconColor="text-amber-400"
            bgGradient="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-200 dark:to-gray-300"
            borderColor="border-amber-400/30"
            value={formik.values.icon}
            fieldName="icon"
            inputRef={lightInputRef}
            isUploading={uploadingLight}
            isRequired={true}
            hasError={formik.touched.icon && formik.errors.icon}
          />

          <ImageUploadCard
            label={t("darkMode") || "Dark Mode"}
            icon={Moon}
            iconColor="text-indigo-400"
            bgGradient="bg-gradient-to-br from-[#1a1f2e] to-[#0F1017]"
            borderColor="border-indigo-400/30"
            value={formik.values.iconDark}
            fieldName="iconDark"
            inputRef={darkInputRef}
            isUploading={uploadingDark}
            isRequired={false}
            hasError={false}
          />
        </div>

        <p className="text-xs text-muted-foreground text-center">
          {t("darkModeHint") ||
            "Dark mode icon is optional. If not provided, light mode icon will be used."}
        </p>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
        <Button
          type="button"
          variant="outline"
          onClick={() => setOpen(false)}
          disabled={formik.isSubmitting}
          className="border-[#677185] text-[#677185] hover:text-white"
        >
          {t("cancel") || "Cancel"}
        </Button>
        <Button
          disabled={formik.isSubmitting || !formik.isValid}
          type="submit"
          className="text-white min-w-[120px] bg-green-primary cursor-pointer hover:bg-green-primary/80 disabled:opacity-50"
        >
          {formik.isSubmitting ? (
            <Spinner />
          ) : link ? (
            <>
              <Save className="size-4 mr-2" />
              {t("Update Link")}
            </>
          ) : (
            <>
              <Link2 className="size-4 mr-2" />
              {t("Add Link")}
            </>
          )}
        </Button>
      </div>

      {/* Image Cropper */}
      <ImageCropper
        isOpen={showCropper}
        onClose={handleCropperClose}
        imageSrc={cropperImage}
        onCropComplete={handleCropComplete}
      />
    </form>
  );
}

export default LinksForm;
