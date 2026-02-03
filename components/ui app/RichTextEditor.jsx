"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { Maximize2, Minimize2 } from "lucide-react";

export default function RichTextEditor({
  formik,
  name,
  label,
  placeholder,
  error,
  minHeight = "400px",
}) {
  const t = useTranslations("RichTextEditor");
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const [mounted, setMounted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [QuillComponent, setQuillComponent] = useState(null);
  const quillRef = useRef(null);

  // Quill modules configuration
  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, 4, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }],
        [{ align: [] }],
        [{ list: "ordered" }, { list: "bullet" }],
        ["blockquote", "code-block"],
        ["link", "image", "video"],
        ["clean"],
      ],
    },
    clipboard: {
      matchVisual: false,
    },
  };

  // Quill formats
  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "align",
    "list",
    "bullet",
    "blockquote",
    "code-block",
    "link",
    "image",
    "video",
  ];

  // Handle hydration and load Quill
  useEffect(() => {
    setMounted(true);

    // Dynamically import Quill
    const loadQuill = async () => {
      try {
        const ReactQuill = (await import("react-quill-new")).default;
        await import("react-quill-new/dist/quill.snow.css");
        setQuillComponent(() => ReactQuill);
      } catch (err) {
        console.error("Failed to load Quill:", err);
      }
    };

    loadQuill();
  }, []);

  // Calculate word and character count
  const updateCounts = useCallback((text) => {
    const trimmedText = (text || "").trim();
    setCharCount(trimmedText.length);
    setWordCount(
      trimmedText.length > 0
        ? trimmedText.split(/\s+/).filter((w) => w.length > 0).length
        : 0
    );
  }, []);

  // Handle content change
  const handleChange = useCallback(
    (content, delta, source, editor) => {
      // Quill returns <p><br></p> for empty content
      const isEmpty = content === "<p><br></p>" || content === "<p></p>" || !content;
      const value = isEmpty ? "" : content;

      formik?.setFieldValue(name, value);
      updateCounts(editor.getText());
    },
    [formik, name, updateCounts]
  );

  // Handle blur
  const handleBlur = useCallback(() => {
    formik?.setFieldTouched(name, true);
  }, [formik, name]);

  // Update counts on initial load
  useEffect(() => {
    if (mounted && formik?.values[name]) {
      // Strip HTML to get text for counting
      const plainText = formik.values[name].replace(/<[^>]*>/g, "");
      updateCounts(plainText);
    }
  }, [mounted, formik?.values[name], updateCounts]);

  if (!mounted) {
    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-medium text-muted-foreground">
            {label} <span className="text-red-500">*</span>
          </label>
        )}
        <div
          className="w-full bg-muted/50 dark:bg-[#1a1d2e] rounded-xl animate-pulse flex items-center justify-center"
          style={{ minHeight }}
        >
          <span className="text-muted-foreground text-sm">Loading editor...</span>
        </div>
      </div>
    );
  }

  const containerClass = isFullscreen
    ? "fixed inset-0 z-50 bg-background p-4"
    : "relative";

  const editorHeight = isFullscreen ? "calc(100vh - 180px)" : minHeight;

  return (
    <div className="space-y-2">
      {label && !isFullscreen && (
        <label className="text-sm font-medium text-muted-foreground">
          {label} <span className="text-red-500">*</span>
        </label>
      )}

      <div
        className={`${containerClass} rounded-xl overflow-hidden border border-border ${
          isDark ? "quill-dark" : "quill-light"
        }`}
      >
        {/* Custom header with Preview and Fullscreen */}
        <div
          className={`flex items-center justify-between px-3 py-2 border-b border-border ${
            isDark ? "bg-[#1a1d2e]" : "bg-gray-50"
          }`}
        >
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground">
              {charCount} {t("characters") || "characters"} · {wordCount}{" "}
              {t("words") || "words"}
            </span>
            <span className="text-xs text-muted-foreground/60 hidden sm:block">
              Ctrl+B Bold · Ctrl+I Italic · Ctrl+U Underline
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Fullscreen toggle */}
            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 rounded-lg bg-muted dark:bg-[#252a3d] text-muted-foreground hover:text-foreground transition-all"
              title={
                isFullscreen
                  ? t("exitFullscreen") || "Exit Fullscreen"
                  : t("fullscreen") || "Fullscreen"
              }
            >
              {isFullscreen ? (
                <Minimize2 className="size-4" />
              ) : (
                <Maximize2 className="size-4" />
              )}
            </button>
          </div>
        </div>

        {/* Editor */}
        {QuillComponent ? (
          <div
            className={`quill-wrapper ${isDark ? "dark" : ""}`}
            style={{ minHeight: editorHeight }}
          >
            <QuillComponent
              ref={quillRef}
              theme="snow"
              value={formik?.values[name] || ""}
              onChange={handleChange}
              onBlur={handleBlur}
              modules={modules}
              formats={formats}
              placeholder={placeholder || t("placeholder") || "Start writing..."}
              style={{ height: editorHeight }}
            />
          </div>
        ) : (
          <div
            className={`flex items-center justify-center ${
              isDark ? "bg-[#0f1118]" : "bg-white"
            }`}
            style={{ minHeight: editorHeight }}
          >
            <span className="text-muted-foreground text-sm">Loading editor...</span>
          </div>
        )}
      </div>

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}

      {/* Quill Custom Styles */}
      <style jsx global>{`
        /* Light mode styles */
        .quill-light .ql-toolbar {
          background: #f9fafb;
          border: none !important;
          border-bottom: 1px solid #e5e7eb !important;
          padding: 12px !important;
        }

        .quill-light .ql-container {
          border: none !important;
          font-family: inherit;
        }

        .quill-light .ql-editor {
          font-size: 15px;
          line-height: 1.7;
          padding: 20px 24px;
          min-height: inherit;
        }

        .quill-light .ql-editor.ql-blank::before {
          color: #9ca3af;
          font-style: normal;
        }

        /* Dark mode styles */
        .quill-dark .ql-toolbar {
          background: #1a1d2e;
          border: none !important;
          border-bottom: 1px solid #2d3348 !important;
          padding: 12px !important;
        }

        .quill-dark .ql-container {
          border: none !important;
          background: #0f1118;
          font-family: inherit;
        }

        .quill-dark .ql-editor {
          color: #e5e7eb;
          font-size: 15px;
          line-height: 1.7;
          padding: 20px 24px;
          min-height: inherit;
        }

        .quill-dark .ql-editor.ql-blank::before {
          color: #6b7280;
          font-style: normal;
        }

        /* Dark mode toolbar buttons */
        .quill-dark .ql-toolbar .ql-stroke {
          stroke: #9ca3af;
        }

        .quill-dark .ql-toolbar .ql-fill {
          fill: #9ca3af;
        }

        .quill-dark .ql-toolbar .ql-picker {
          color: #9ca3af;
        }

        .quill-dark .ql-toolbar .ql-picker-options {
          background: #1a1d2e;
          border-color: #2d3348;
        }

        .quill-dark .ql-toolbar .ql-picker-item:hover,
        .quill-dark .ql-toolbar .ql-picker-item.ql-selected {
          color: #22c55e;
        }

        .quill-dark .ql-toolbar button:hover .ql-stroke,
        .quill-dark .ql-toolbar button.ql-active .ql-stroke {
          stroke: #22c55e;
        }

        .quill-dark .ql-toolbar button:hover .ql-fill,
        .quill-dark .ql-toolbar button.ql-active .ql-fill {
          fill: #22c55e;
        }

        /* Light mode toolbar hover */
        .quill-light .ql-toolbar button:hover .ql-stroke,
        .quill-light .ql-toolbar button.ql-active .ql-stroke {
          stroke: #22c55e;
        }

        .quill-light .ql-toolbar button:hover .ql-fill,
        .quill-light .ql-toolbar button.ql-active .ql-fill {
          fill: #22c55e;
        }

        .quill-light .ql-toolbar .ql-picker-item:hover,
        .quill-light .ql-toolbar .ql-picker-item.ql-selected {
          color: #22c55e;
        }

        /* Quill wrapper for proper height */
        .quill-wrapper .quill {
          display: flex;
          flex-direction: column;
        }

        .quill-wrapper .ql-container {
          flex: 1;
          overflow: auto;
        }

        /* Code block styling */
        .ql-editor pre.ql-syntax {
          background: #1e1e1e;
          color: #d4d4d4;
          border-radius: 8px;
          padding: 16px;
          overflow-x: auto;
        }

        .quill-light .ql-editor pre.ql-syntax {
          background: #f3f4f6;
          color: #1f2937;
        }

        /* Blockquote styling */
        .ql-editor blockquote {
          border-left: 4px solid #22c55e;
          padding-left: 16px;
          margin: 16px 0;
          color: #6b7280;
        }

        .quill-dark .ql-editor blockquote {
          color: #9ca3af;
        }

        /* Link styling */
        .ql-editor a {
          color: #22c55e;
        }

        /* Image styling */
        .ql-editor img {
          max-width: 100%;
          border-radius: 8px;
          margin: 16px 0;
        }

        /* Dropdown styling fix */
        .ql-toolbar .ql-picker-label {
          padding: 4px 8px;
        }

        .quill-dark .ql-snow .ql-picker.ql-expanded .ql-picker-label {
          border-color: #2d3348;
        }

        .quill-dark .ql-snow .ql-picker.ql-expanded .ql-picker-options {
          border-color: #2d3348;
        }

        /* Header dropdown items */
        .quill-dark .ql-picker-options .ql-picker-item {
          color: #e5e7eb;
        }

        /* Tooltip styling */
        .quill-dark .ql-tooltip {
          background: #1a1d2e;
          border-color: #2d3348;
          color: #e5e7eb;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        }

        .quill-dark .ql-tooltip input[type="text"] {
          background: #0f1118;
          border-color: #2d3348;
          color: #e5e7eb;
        }

        .quill-dark .ql-tooltip a.ql-action::after,
        .quill-dark .ql-tooltip a.ql-remove::before {
          color: #22c55e;
        }

        /* Video styling */
        .ql-editor .ql-video {
          width: 100%;
          aspect-ratio: 16/9;
          border-radius: 8px;
        }
      `}</style>
    </div>
  );
}
