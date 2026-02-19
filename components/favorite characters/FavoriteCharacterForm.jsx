"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import { useState, useRef } from "react";
import InputApp from "../ui app/InputApp";
import SelectInput from "../ui app/SelectInput";
import { mappedArrayToSelectOptions } from "@/app/[locale]/_Lib/helps";
import { getImgUrl } from "@/lib/utils";
import { Button } from "../ui/button";
import {
  addFavoriteCharacter,
  editFavoriteCharacter,
  uploadPhoto,
} from "@/app/[locale]/_Lib/actions";
import toast from "react-hot-toast";
import { Spinner } from "../ui/spinner";
import {
  Gamepad2,
  ImageIcon,
  Save,
  Star,
  Sun,
  Moon,
  Upload,
  X,
  Check,
  AlertCircle,
} from "lucide-react";
import ImageCropper from "../ui app/ImageCropper";

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  imageLight: Yup.string().required("Image is required"),
  imageDark: Yup.string(),
  game: Yup.string().required("Game Name is required"),
});

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

function FavoriteCharacterForm({
  id,
  character,
  games,
  favoriteCharacterFor = "players",
  t,
  setOpen,
}) {
  const [uploadingLight, setUploadingLight] = useState(false);
  const [uploadingDark, setUploadingDark] = useState(false);
  const [showCropper, setShowCropper] = useState(false);
  const [cropperImage, setCropperImage] = useState(null);
  const [cropperTarget, setCropperTarget] = useState(null);
  const lightInputRef = useRef(null);
  const darkInputRef = useRef(null);

  const formik = useFormik({
    initialValues: {
      name: character?.name || "",
      imageLight: getImgUrl(character?.image?.light) || "",
      imageDark: getImgUrl(character?.image?.dark) || "",
      game: character?.game?.id || character?.game?._id || "",
    },
    onSubmit: async (values) => {
      const favoriteCharacterData = {
        ...(character ? { id: character.id } : {}),
        name: values.name,
        image: {
          light: values.imageLight,
          dark: values.imageDark || values.imageLight,
        },
        game: values.game,
      };

      try {
        if (character) {
          await editFavoriteCharacter(
            favoriteCharacterFor,
            id,
            favoriteCharacterData
          );
        } else {
          await addFavoriteCharacter(
            favoriteCharacterFor,
            id,
            favoriteCharacterData
          );
        }
        formik.resetForm();
        toast.success(
          character
            ? t("Favorite character updated successfully")
            : t("Favorite character added successfully")
        );
        setOpen(false);
      } catch (error) {
        toast.error(error.message);
      }
    },
    validationSchema,
  });

  // Find the selected game to show preview
  const getGameId = (game) => game?.id || game?._id;
  const selectedGame = games?.find(
    (g) => getGameId(g) === formik.values.game
  );

  // Handle file selection
  const handleFileSelect = async (e, target) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      toast.error(t("fileTooLarge") || "File size must be less than 5MB");
      return;
    }

    // Show cropper
    const imageUrl = URL.createObjectURL(file);
    setCropperImage(imageUrl);
    setCropperTarget(target);
    setShowCropper(true);

    // Reset input
    e.target.value = "";
  };

  // Handle crop complete
  const handleCropComplete = async (croppedBlob) => {
    setShowCropper(false);

    const isLight = cropperTarget === "light";
    const setUploading = isLight ? setUploadingLight : setUploadingDark;
    const fieldName = isLight ? "imageLight" : "imageDark";

    setUploading(true);

    try {
      const croppedFile = new File([croppedBlob], "character-image.png", {
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

  // Handle cropper close
  const handleCropperClose = () => {
    setShowCropper(false);
    if (cropperImage) {
      URL.revokeObjectURL(cropperImage);
      setCropperImage(null);
    }
  };

  // Remove image
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
        {/* Label */}
        <div className="flex items-center gap-2 mb-2">
          <Icon className={`size-4 ${iconColor}`} />
          <span className="text-sm font-medium text-foreground">
            {label}
            {isRequired && <span className="text-red-500 ml-1">*</span>}
          </span>
        </div>

        {/* Upload Area / Preview */}
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
            /* Image Preview */
            <div className={`relative aspect-square ${bgGradient}`}>
              <img
                src={getImgUrl(value, "thumbnail")}
                alt={label}
                className="w-full h-full object-contain p-4"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />

              {/* Success Badge */}
              <div className="absolute top-2 left-2 bg-green-500 text-white rounded-full p-1">
                <Check className="size-3" />
              </div>

              {/* Remove Button */}
              <button
                type="button"
                onClick={() => removeImage(fieldName)}
                disabled={formik.isSubmitting}
                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 transition-colors disabled:opacity-50"
              >
                <X className="size-3" />
              </button>

              {/* Replace Button */}
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
            /* Upload Dropzone */
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
                  <div
                    className={`size-14 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors`}
                  >
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
                  <div
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors`}
                  >
                    <Upload className="size-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {t("browse") || "Browse"}
                    </span>
                  </div>
                </>
              )}
            </button>
          )}

          {/* Hidden File Input */}
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={(e) =>
              handleFileSelect(e, fieldName === "imageLight" ? "light" : "dark")
            }
            className="hidden"
          />
        </div>

        {/* Error Message */}
        {hasError && (
          <div className="flex items-center gap-1.5 mt-2 text-red-500">
            <AlertCircle className="size-3" />
            <span className="text-xs">{t("Image is required")}</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-5">
      {/* Character Name */}
      <InputApp
        value={formik.values.name}
        onBlur={formik.handleBlur}
        label={t("Name")}
        name="name"
        onChange={formik.handleChange}
        placeholder={t("characterNamePlaceholder") || "Enter character name"}
        icon={<Star className="size-5 text-[#677185]" />}
        error={
          formik.touched.name && formik.errors.name && t(formik.errors.name)
        }
        disabled={formik.isSubmitting}
        required
      />

      {/* Game Selection */}
      <SelectInput
        label={t("Game Name")}
        name="game"
        formik={formik}
        onChange={(value) => formik.setFieldValue("game", value)}
        placeholder={t("gamePlaceholder") || "Select game"}
        value={formik.values.game}
        error={
          formik.touched.game && formik.errors.game && t(formik.errors.game)
        }
        options={mappedArrayToSelectOptions(games, "name", "id")}
        disabled={formik.isSubmitting}
        icon={<Gamepad2 className="size-5 text-[#677185]" />}
        required
      />

      {/* Selected Game Preview */}
      {selectedGame && (
        <div className="flex items-center gap-3 p-3 bg-green-primary/10 rounded-lg border border-green-primary/20">
          {(selectedGame.logo?.light || selectedGame.logo?.dark) && (
            <img
              src={getImgUrl(selectedGame.logo?.light, "thumbnail") || getImgUrl(selectedGame.logo?.dark, "thumbnail")}
              alt={selectedGame.name}
              className="size-8 rounded object-cover"
            />
          )}
          <span className="text-sm text-green-primary font-medium">
            {selectedGame.name}
          </span>
        </div>
      )}

      {/* Character Images Section */}
      <div className="space-y-4">
        {/* Section Header */}
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-lg bg-yellow-500/10 flex items-center justify-center">
            <ImageIcon className="size-4 text-yellow-500" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-foreground">
              {t("characterImages") || "Character Images"}
            </h3>
            <p className="text-xs text-muted-foreground">
              {t("uploadBothModes") || "Upload images for light and dark mode"}
            </p>
          </div>
        </div>

        {/* Image Upload Cards */}
        <div className="grid grid-cols-2 gap-4">
          <ImageUploadCard
            label={t("lightMode") || "Light Mode"}
            icon={Sun}
            iconColor="text-amber-400"
            bgGradient="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-200 dark:to-gray-300"
            borderColor="border-amber-400/30"
            value={formik.values.imageLight}
            fieldName="imageLight"
            inputRef={lightInputRef}
            isUploading={uploadingLight}
            isRequired={true}
            hasError={formik.touched.imageLight && formik.errors.imageLight}
          />

          <ImageUploadCard
            label={t("darkMode") || "Dark Mode"}
            icon={Moon}
            iconColor="text-indigo-400"
            bgGradient="bg-gradient-to-br from-[#1a1f2e] to-[#0F1017]"
            borderColor="border-indigo-400/30"
            value={formik.values.imageDark}
            fieldName="imageDark"
            inputRef={darkInputRef}
            isUploading={uploadingDark}
            isRequired={false}
            hasError={false}
          />
        </div>

        {/* Hint */}
        <p className="text-xs text-muted-foreground text-center">
          {t("darkModeHint") ||
            "Dark mode image is optional. If not provided, light mode image will be used."}
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
          ) : character ? (
            <>
              <Save className="size-4 mr-2" />
              {t("Edit")}
            </>
          ) : (
            <>
              <Star className="size-4 mr-2" />
              {t("Add Favorite Character")}
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

export default FavoriteCharacterForm;
