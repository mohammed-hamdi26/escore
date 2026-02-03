"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
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
import { Crop, ZoomIn, RotateCcw } from "lucide-react";

const ASPECT_RATIOS = {
  free: undefined,
  "1:1": 1,
  "16:9": 16 / 9,
  "4:3": 4 / 3,
  "3:2": 3 / 2,
  "2:1": 2 / 1,
  "1200x630": 1200 / 630, // Social media / News cover
  "3:4": 3 / 4,
};

// Standard output sizes for each aspect ratio (width x height)
const OUTPUT_SIZES = {
  "1:1": { width: 800, height: 800 },
  "16:9": { width: 1280, height: 720 },
  "4:3": { width: 1024, height: 768 },
  "3:2": { width: 1200, height: 800 },
  "2:1": { width: 1200, height: 600 },
  "1200x630": { width: 1200, height: 630 },
  "3:4": { width: 600, height: 800 },
  free: null, // Use original crop size
};

// Map aspect ratio names to cropper ratios
const ASPECT_TO_RATIO = {
  square: "1:1",
  landscape: "16:9",
  portrait: "3:4",
  "news-cover": "1200x630",
  "wide": "2:1",
};

function ImageCropper({ isOpen, onClose, imageSrc, onCropComplete, defaultAspect = "free" }) {
  const t = useTranslations("imageCropper");
  const imgRef = useRef(null);

  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState(null);
  const [scale, setScale] = useState(1);
  const [selectedRatio, setSelectedRatio] = useState("free");

  // Reset when open
  useEffect(() => {
    if (isOpen && imageSrc) {
      setCrop(undefined);
      setCompletedCrop(null);
      setScale(1);
      // Set default aspect ratio based on prop
      const initialRatio = ASPECT_TO_RATIO[defaultAspect] || defaultAspect;
      setSelectedRatio(initialRatio in ASPECT_RATIOS ? initialRatio : "free");
    }
  }, [isOpen, imageSrc, defaultAspect]);

  const onImageLoad = useCallback(
    (e) => {
      const { width, height } = e.currentTarget;

      const cropWidth = Math.min(width * 0.8, 300);
      const cropHeight =
        selectedRatio === "free"
          ? Math.min(height * 0.8, 300)
          : cropWidth / (ASPECT_RATIOS[selectedRatio] || 1);

      setCrop({
        unit: "px",
        x: (width - cropWidth) / 2,
        y: (height - cropHeight) / 2,
        width: cropWidth,
        height: cropHeight,
      });
    },
    [selectedRatio]
  );

  const handleRatioChange = (ratio) => {
    setSelectedRatio(ratio);

    if (!imgRef.current) return;

    const { width, height } = imgRef.current;
    const aspect = ASPECT_RATIOS[ratio];

    if (!aspect) return;

    const cropWidth = Math.min(width * 0.8, 300);
    const cropHeight = cropWidth / aspect;

    setCrop({
      unit: "px",
      x: (width - cropWidth) / 2,
      y: (height - cropHeight) / 2,
      width: cropWidth,
      height: Math.min(cropHeight, height * 0.8),
    });
  };

  // Get cropped image with standardized output size
  const getCroppedImage = useCallback(() => {
    if (!completedCrop || !imgRef.current) return null;

    const image = imgRef.current;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) return null;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    // Source crop dimensions (from original image)
    const srcX = completedCrop.x * scaleX;
    const srcY = completedCrop.y * scaleY;
    const srcWidth = completedCrop.width * scaleX;
    const srcHeight = completedCrop.height * scaleY;

    // Get standard output size for the selected aspect ratio
    const outputSize = OUTPUT_SIZES[selectedRatio];

    if (outputSize) {
      // Use standardized output size
      canvas.width = outputSize.width;
      canvas.height = outputSize.height;
    } else {
      // Free aspect - use cropped size but limit to max 1600px
      const maxDimension = 1600;
      if (srcWidth > maxDimension || srcHeight > maxDimension) {
        const ratio = Math.min(maxDimension / srcWidth, maxDimension / srcHeight);
        canvas.width = Math.round(srcWidth * ratio);
        canvas.height = Math.round(srcHeight * ratio);
      } else {
        canvas.width = Math.round(srcWidth);
        canvas.height = Math.round(srcHeight);
      }
    }

    // Clear canvas for transparency
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Enable image smoothing for better quality
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Draw the cropped image scaled to output size
    ctx.drawImage(
      image,
      srcX,
      srcY,
      srcWidth,
      srcHeight,
      0,
      0,
      canvas.width,
      canvas.height
    );

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => resolve(blob),
        "image/png", // PNG for transparency support
        1.0 // Maximum quality
      );
    });
  }, [completedCrop, selectedRatio]);

  const handleApplyCrop = async () => {
    const croppedBlob = await getCroppedImage();
    if (croppedBlob) onCropComplete(croppedBlob);
    onClose();
  };

  const handleReset = () => {
    setScale(1);
    const initialRatio = ASPECT_TO_RATIO[defaultAspect] || defaultAspect;
    setSelectedRatio(initialRatio in ASPECT_RATIOS ? initialRatio : "free");
    if (imgRef.current) {
      onImageLoad({ currentTarget: imgRef.current });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Crop className="size-5" />
            {t("title")}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Crop Area */}
          <div className="flex justify-center bg-muted/30 rounded-lg p-4 min-h-[300px] items-center">
            {imageSrc && (
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={ASPECT_RATIOS[selectedRatio]}
                className="bg-transparent"
              >
                <img
                  ref={imgRef}
                  src={imageSrc}
                  alt="Crop preview"
                  onLoad={onImageLoad}
                  style={{
                    transform: `scale(${scale})`,
                    maxHeight: "400px",
                    maxWidth: "100%",
                  }}
                  className="rounded"
                />
              </ReactCrop>
            )}
          </div>

          {/* Aspect Ratio */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">{t("aspectRatio")}</label>
              {OUTPUT_SIZES[selectedRatio] && (
                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                  {t("output") || "Output"}: {OUTPUT_SIZES[selectedRatio].width} × {OUTPUT_SIZES[selectedRatio].height}px
                </span>
              )}
            </div>
            <div className="flex gap-2 flex-wrap">
              {Object.keys(ASPECT_RATIOS).map((ratio) => (
                <Button
                  key={ratio}
                  size="sm"
                  variant={selectedRatio === ratio ? "default" : "outline"}
                  onClick={() => handleRatioChange(ratio)}
                  className={`${
                    selectedRatio === ratio
                      ? "text-white dark:text-black"
                      : "dark:text-white text-black"
                  }`}
                >
                  {ratio === "free" ? t("free") : ratio}
                </Button>
              ))}
            </div>
          </div>

          {/* Zoom */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <ZoomIn className="size-4" />
              {t("zoom")}
            </label>
            <Slider
              value={[scale * 100]}
              onValueChange={(v) => setScale(v[0] / 100)}
              min={50}
              max={200}
              step={5}
            />
            <p className="text-xs text-center text-muted-foreground">
              {Math.round(scale * 100)}%
            </p>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
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
            className={"text-black dark:text-white"}
            onClick={onClose}
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
