# Image Cropper Feature Plan

## Overview
إضافة ميزة قص وتعديل الصور في `FileInput` component قبل رفعها، مع زيادة الحد الأقصى لحجم الملف إلى 5MB.

## Current State (الحالة الحالية)
- `FileInput.jsx` يسمح برفع الصور مباشرة
- الحد الأقصى الحالي: 2MB
- لا يوجد تعديل أو قص للصورة قبل الرفع

## Proposed Solution (الحل المقترح)

### 1. Install Dependencies
```bash
npm install react-image-crop
```

**Why react-image-crop?**
- مكتبة خفيفة وسريعة
- تدعم React 19
- سهلة الاستخدام
- لا تحتاج canvas library خارجية

### 2. New Component: `ImageCropper.jsx`

**Location:** `components/ui app/ImageCropper.jsx`

**Features:**
- عرض الصورة في Dialog
- قص الصورة بنسب مختلفة (free, 1:1, 16:9, 4:3)
- Zoom in/out
- Preview الصورة بعد القص
- حفظ/إلغاء

### 3. Updated FileInput Flow

```
[اختيار ملف] → [فتح Dialog للقص] → [تعديل الصورة] → [تأكيد] → [رفع الصورة]
```

**New Flow:**
1. المستخدم يختار صورة
2. إذا كان حجم الصورة > 5MB → رسالة خطأ
3. تفتح نافذة القص
4. المستخدم يقص/يعدل الصورة
5. عند الضغط على "تأكيد" → تتحول الصورة المقصوصة إلى Blob
6. الصورة جاهزة للرفع

## Technical Implementation

### ImageCropper Component Structure

```jsx
// components/ui app/ImageCropper.jsx
"use client";
import { useState, useRef, useCallback } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";

function ImageCropper({
  isOpen,
  onClose,
  imageSrc,
  onCropComplete,
  aspectRatios = ["free", "1:1", "16:9", "4:3"],
}) {
  // Crop state, aspect ratio selection, zoom
  // Canvas-based crop extraction
  // Return cropped image as Blob
}
```

### Updated FileInput Logic

```jsx
// في FileInput.jsx
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

async function handleAddFile(e) {
  if (e.target.files && e.target.files.length > 0) {
    const selectedFile = e.target.files[0];

    // Check file size (5MB max)
    if (selectedFile.size > MAX_FILE_SIZE) {
      toast.error(t("fileTooLarge")); // "File size must be less than 5MB"
      return;
    }

    // Create preview URL and open cropper
    const imageUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(imageUrl);
    setShowCropper(true);
  }
}

function handleCropComplete(croppedBlob) {
  // Convert blob to File object
  const croppedFile = new File([croppedBlob], "cropped-image.jpg", {
    type: "image/jpeg",
  });
  setFiles(croppedFile);
  setShowCropper(false);
}
```

## UI/UX Design

### Cropper Dialog Layout

```
┌─────────────────────────────────────────────┐
│  ✕                    Crop Image            │
├─────────────────────────────────────────────┤
│                                             │
│     ┌─────────────────────────────┐         │
│     │                             │         │
│     │    [Image with crop area]   │         │
│     │                             │         │
│     └─────────────────────────────┘         │
│                                             │
│  Aspect Ratio: [Free] [1:1] [16:9] [4:3]    │
│                                             │
│  Zoom: ──────●────────────────              │
│                                             │
├─────────────────────────────────────────────┤
│              [Cancel]    [Apply Crop]       │
└─────────────────────────────────────────────┘
```

## Translations Required

### English (messages/en.json)
```json
{
  "imageCropper": {
    "title": "Crop Image",
    "aspectRatio": "Aspect Ratio",
    "free": "Free",
    "zoom": "Zoom",
    "cancel": "Cancel",
    "apply": "Apply Crop",
    "fileTooLarge": "File size must be less than 5MB"
  }
}
```

### Arabic (messages/ar.json)
```json
{
  "imageCropper": {
    "title": "قص الصورة",
    "aspectRatio": "نسبة العرض للارتفاع",
    "free": "حر",
    "zoom": "تكبير",
    "cancel": "إلغاء",
    "apply": "تطبيق القص",
    "fileTooLarge": "حجم الملف يجب أن يكون أقل من 5 ميجابايت"
  }
}
```

## Files to Create/Modify

### New Files:
1. `components/ui app/ImageCropper.jsx` - مكون القص الجديد

### Modified Files:
1. `components/ui app/FileInput.jsx` - إضافة منطق القص وتغيير الحد الأقصى
2. `messages/en.json` - إضافة الترجمات الإنجليزية
3. `messages/ar.json` - إضافة الترجمات العربية

## Testing Checklist

- [ ] اختيار صورة أقل من 5MB يفتح نافذة القص
- [ ] اختيار صورة أكبر من 5MB يظهر رسالة خطأ
- [ ] القص الحر يعمل بشكل صحيح
- [ ] نسب القص المختلفة (1:1, 16:9, 4:3) تعمل
- [ ] Zoom يعمل بشكل صحيح
- [ ] إلغاء القص يغلق النافذة بدون تغييرات
- [ ] تطبيق القص يحفظ الصورة المقصوصة
- [ ] الرفع يعمل بشكل صحيح مع الصورة المقصوصة
- [ ] الواجهة تعمل بالعربية والإنجليزية
- [ ] الـ Dark mode يعمل بشكل صحيح

## Implementation Steps

1. **تثبيت المكتبة:**
   ```bash
   cd escore-1
   npm install react-image-crop
   ```

2. **إنشاء ImageCropper component**

3. **تحديث FileInput.jsx**

4. **إضافة الترجمات**

5. **اختبار الفيتشر**
