"use client";
import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Slider } from "../ui/slider";
import { useTranslations } from "next-intl";
import { Crop, ZoomIn, RotateCcw, Lock, Move } from "lucide-react";
import { getImageSpec, isValidImageType } from "@/app/[locale]/_Lib/imageSpecs";

/**
 * ImageCropper Component using react-easy-crop
 * Provides Instagram/Facebook-like crop experience
 */
function ImageCropper({
  isOpen,
  onClose,
  imageSrc,
  onCropComplete,
  defaultAspect = "free",
  imageType = null,
}) {
  const t = useTranslations("imageCropper");

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  // Get spec if imageType is provided
  const imageSpec = imageType && isValidImageType(imageType) ? getImageSpec(imageType) : null;
  const isLocked = !!imageSpec;

  // Determine aspect ratio
  const getAspect = () => {
    if (isLocked && imageSpec?.cropAspect) {
      return imageSpec.cropAspect;
    }
    // Legacy support
    const aspectMap = {
      square: 1,
      landscape: 16 / 9,
      portrait: 3 / 4,
      "news-cover": 1200 / 630,
      wide: 2 / 1,
      free: 4 / 3, // Default for free
    };
    return aspectMap[defaultAspect] || 4 / 3;
  };

  const aspect = getAspect();
  const outputSize = imageSpec?.sizes?.large || { width: 800, height: 800 / aspect };

  const onCropCompleteCallback = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // Create cropped image
  const createCroppedImage = useCallback(async () => {
    if (!croppedAreaPixels || !imageSrc) return null;

    const image = new Image();
    image.src = imageSrc;

    await new Promise((resolve) => {
      image.onload = resolve;
    });

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) return null;

    // Set output size
    canvas.width = outputSize.width;
    canvas.height = outputSize.height;

    // Clear canvas for transparency
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Enable image smoothing for better quality
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    // Draw the cropped image scaled to output size
    ctx.drawImage(
      image,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      canvas.width,
      canvas.height
    );

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => resolve(blob),
        "image/png",
        1.0
      );
    });
  }, [croppedAreaPixels, imageSrc, outputSize]);

  const handleApplyCrop = async () => {
    const croppedBlob = await createCroppedImage();
    if (croppedBlob) {
      onCropComplete(croppedBlob);
    }
    onClose();
  };

  const handleReset = () => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-hidden p-0">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="flex items-center gap-2">
            <Crop className="size-5" />
            {t("title")}
            {isLocked && (
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full flex items-center gap-1">
                <Lock className="size-3" />
                {imageSpec?.name}
              </span>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 space-y-4">
          {/* Crop Area */}
          <div className="relative h-[350px] bg-black rounded-lg overflow-hidden">
            {imageSrc && (
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={aspect}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropCompleteCallback}
                cropShape="rect"
                showGrid={true}
                style={{
                  containerStyle: {
                    borderRadius: "8px",
                  },
                }}
              />
            )}

            {/* Drag hint overlay */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 pointer-events-none">
              <Move className="size-3" />
              {t("dragToPosition") || "Drag to position"}
            </div>
          </div>

          {/* Info bar */}
          <div className="bg-muted/50 rounded-lg p-3 flex items-center justify-between">
            <span className="text-sm font-medium flex items-center gap-2">
              {isLocked && <Lock className="size-4 text-primary" />}
              {t("aspectRatio")}: {imageSpec?.aspectRatioString || `${aspect.toFixed(2)}`}
            </span>
            <span className="text-xs text-muted-foreground bg-background px-2 py-1 rounded">
              {t("output") || "Output"}: {outputSize.width} × {outputSize.height}px
            </span>
          </div>

          {/* Zoom Control */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <ZoomIn className="size-4" />
              {t("zoom")}
            </label>
            <div className="flex items-center gap-4">
              <span className="text-xs text-muted-foreground w-8">1x</span>
              <Slider
                value={[zoom]}
                onValueChange={(v) => setZoom(v[0])}
                min={1}
                max={3}
                step={0.1}
                className="flex-1"
              />
              <span className="text-xs text-muted-foreground w-8">3x</span>
            </div>
            <p className="text-xs text-center text-muted-foreground">
              {zoom.toFixed(1)}x
            </p>
          </div>
        </div>

        <DialogFooter className="px-6 py-4 border-t flex gap-2">
          <Button
            variant="ghost"
            onClick={handleReset}
            className="gap-2 text-black dark:text-white"
          >
            <RotateCcw className="size-4" />
            {t("reset")}
          </Button>

          <div className="flex-1" />

          <Button
            variant="outline"
            className="text-black dark:text-white"
            onClick={handleClose}
          >
            {t("cancel")}
          </Button>

          <Button
            onClick={handleApplyCrop}
            className="bg-green-primary text-white hover:bg-green-primary/80"
          >
            {t("apply")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ImageCropper;
