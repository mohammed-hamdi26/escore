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
};

function ImageCropper({ isOpen, onClose, imageSrc, onCropComplete }) {
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
      setSelectedRatio("free");
    }
  }, [isOpen, imageSrc]);

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

  // ✅ شفافية حقيقية
  const getCroppedImage = useCallback(() => {
    if (!completedCrop || !imgRef.current) return null;

    const image = imgRef.current;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) return null;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = completedCrop.width * scaleX;
    canvas.height = completedCrop.height * scaleY;

    // مهم جدًا
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height
    );

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => resolve(blob),
        "image/png" // ✅ PNG = شفافية
      );
    });
  }, [completedCrop]);

  const handleApplyCrop = async () => {
    const croppedBlob = await getCroppedImage();
    if (croppedBlob) onCropComplete(croppedBlob);
    onClose();
  };

  const handleReset = () => {
    setScale(1);
    setSelectedRatio("free");
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
            <label className="text-sm font-medium">{t("aspectRatio")}</label>
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
