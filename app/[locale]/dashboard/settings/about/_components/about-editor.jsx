"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import {
  addAboutContent,
  getAboutContent,
  updateAboutContent,
} from "@/app/[locale]/_Lib/actions";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { useTheme } from "next-themes";
import { Loader2, Save, Maximize2, Minimize2 } from "lucide-react";
import toast from "react-hot-toast";
import AboutDeleteDialog from "./about-delete-dialog";

const contentCache = new Map();

function AboutEditor({ languageCode }) {
  const t = useTranslations("AboutPage");
  const tEditor = useTranslations("RichTextEditor");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasAbout, setHasAbout] = useState(false);
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
        [{ direction: "rtl" }],
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

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "align",
    "direction",
    "list",
    "blockquote",
    "code-block",
    "link",
    "image",
    "video",
  ];

  useEffect(() => {
    setMounted(true);
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

  useEffect(() => {
    const fetchContent = async () => {
      if (!languageCode) return;
      if (contentCache.has(languageCode)) {
        const cachedContent = contentCache.get(languageCode);
        setContent(cachedContent);
        setHasAbout(true);
        updateCounts(cachedContent);
        return;
      }
      setIsLoading(true);
      try {
        const { data } = await getAboutContent(languageCode);
        if (data && data.content) {
          const cleanedData = data.content
            .replace(/\\n/g, "\n")
            .replace(/^"|"$/g, "");
          setContent(cleanedData);
          contentCache.set(languageCode, cleanedData);
          setHasAbout(true);
          updateCounts(cleanedData);
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setContent("");
          setHasAbout(false);
          updateCounts("");
        } else {
          console.error("Failed to fetch about content:", error);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchContent();
  }, [languageCode]);

  const updateCounts = useCallback((text) => {
    const plainText = text.replace(/<[^>]*>/g, "").replace(/\n$/, "");
    setCharCount(plainText.length);
    const wordMatches = plainText.match(/[\p{L}\p{N}]+/gu);
    setWordCount(wordMatches ? wordMatches.length : 0);
  }, []);

  const handleChange = useCallback(
    (value, delta, source, editor) => {
      const isEmpty = value === "<p><br></p>" || value === "<p></p>" || !value;
      const newContent = isEmpty ? "" : value;
      setContent(newContent);
      updateCounts(editor.getText());
    },
    [updateCounts]
  );

  const handleSubmit = async () => {
    if (!content.trim() || content === "<p><br></p>") {
      toast.error(t("Please enter content"));
      return;
    }
    setIsSaving(true);
    try {
      if (!hasAbout) {
        await addAboutContent(languageCode, content);
        toast.success(t("Content created successfully"));
        contentCache.set(languageCode, content);
        setHasAbout(true);
      } else {
        await updateAboutContent(languageCode, content);
        toast.success(t("Content updated successfully"));
        contentCache.set(languageCode, content);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (!mounted) {
    return (
      <div className="p-6">
        <div
          className="w-full bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse"
          style={{ minHeight: "400px" }}
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div
        className="flex items-center justify-center"
        style={{ minHeight: "400px" }}
      >
        <Spinner className="size-8" />
      </div>
    );
  }

  const editorHeight = isFullscreen ? "calc(100vh - 180px)" : "400px";

  // Fullscreen mode
  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-[9999] bg-white dark:bg-[#0F1017] p-4 flex flex-col">
        <div
          className={`flex-1 flex flex-col rounded-xl overflow-hidden border border-gray-200 dark:border-white/5 ${
            isDark ? "quill-dark" : "quill-light"
          }`}
        >
          {/* Header */}
          <div
            className={`flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-white/5 ${
              isDark ? "bg-[#1a1d2e]" : "bg-gray-50"
            }`}
          >
            <div className="flex items-center gap-4">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {charCount} {tEditor("characters") || "characters"} · {wordCount}{" "}
                {tEditor("words") || "words"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <AboutDeleteDialog
                contentCache={contentCache}
                languageCode={languageCode}
                setHasAbout={setHasAbout}
                setContent={setContent}
              />
              <Button
                onClick={handleSubmit}
                disabled={isSaving || !languageCode}
                className="bg-green-primary hover:bg-green-primary/90 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                {isSaving ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Save className="size-4" />
                )}
                {hasAbout ? t("Update") : t("Submit")}
              </Button>
              <button
                type="button"
                onClick={() => setIsFullscreen(false)}
                className="p-2 rounded-lg bg-gray-100 dark:bg-[#252a3d] text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all"
                title={tEditor("exitFullscreen") || "Exit Fullscreen"}
              >
                <Minimize2 className="size-4" />
              </button>
            </div>
          </div>

          {/* Editor */}
          {QuillComponent ? (
            <div
              className={`quill-wrapper ${isDark ? "dark" : ""} flex-1 overflow-hidden`}
              style={{ height: "calc(100vh - 120px)" }}
            >
              <QuillComponent
                ref={quillRef}
                theme="snow"
                value={content}
                onChange={handleChange}
                modules={modules}
                formats={formats}
                placeholder={t("placeholder")}
              />
            </div>
          ) : (
            <div
              className={`flex-1 flex items-center justify-center ${
                isDark ? "bg-[#0f1118]" : "bg-white"
              }`}
            >
              <Spinner className="size-6" />
            </div>
          )}
        </div>
        <style jsx global>{quillStyles}</style>
      </div>
    );
  }

  // Normal mode
  return (
    <div className="p-4">
      <div
        className={`relative rounded-xl overflow-hidden border border-gray-200 dark:border-white/5 ${
          isDark ? "quill-dark" : "quill-light"
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-white/5 ${
            isDark ? "bg-[#1a1d2e]" : "bg-gray-50"
          }`}
        >
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {charCount} {tEditor("characters") || "characters"} · {wordCount}{" "}
              {tEditor("words") || "words"}
            </span>
            <span className="text-xs text-gray-400 dark:text-gray-500 hidden sm:block">
              Ctrl+B Bold · Ctrl+I Italic · Ctrl+U Underline
            </span>
          </div>
          <div className="flex items-center gap-2">
            {hasAbout && (
              <AboutDeleteDialog
                contentCache={contentCache}
                languageCode={languageCode}
                setHasAbout={setHasAbout}
                setContent={setContent}
              />
            )}
            <Button
              onClick={handleSubmit}
              disabled={isSaving || !languageCode}
              className="bg-green-primary hover:bg-green-primary/90 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              {isSaving ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Save className="size-4" />
              )}
              {hasAbout ? t("Update") : t("Submit")}
            </Button>
            <button
              type="button"
              onClick={() => setIsFullscreen(true)}
              className="p-2 rounded-lg bg-gray-100 dark:bg-[#252a3d] text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all"
              title={tEditor("fullscreen") || "Fullscreen"}
            >
              <Maximize2 className="size-4" />
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
              value={content}
              onChange={handleChange}
              modules={modules}
              formats={formats}
              placeholder={t("placeholder")}
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
            <Spinner className="size-6" />
          </div>
        )}
      </div>
      <style jsx global>{quillStyles}</style>
    </div>
  );
}

const quillStyles = `
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
    background: #ffffff;
  }

  .quill-light .ql-editor {
    color: #1f2937 !important;
    font-size: 15px;
    line-height: 1.7;
    padding: 20px 24px;
    min-height: inherit;
  }

  .quill-light .ql-editor * {
    color: inherit;
  }

  .quill-light .ql-editor.ql-blank::before {
    color: #9ca3af;
    font-style: normal;
  }

  .quill-light .ql-picker-options .ql-picker-item {
    color: #1f2937;
  }

  .quill-light .ql-snow .ql-picker.ql-expanded .ql-picker-options {
    background: #ffffff;
    border-color: #e5e7eb;
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
  .quill-wrapper {
    display: flex;
    flex-direction: column;
  }

  .quill-wrapper .quill {
    display: flex;
    flex-direction: column;
    flex: 1;
    height: 100%;
  }

  .quill-wrapper .ql-toolbar {
    flex-shrink: 0;
  }

  .quill-wrapper .ql-container {
    flex: 1;
    overflow: auto;
    height: auto !important;
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

  /* Headers styling for light mode */
  .quill-light .ql-editor h1,
  .quill-light .ql-editor h2,
  .quill-light .ql-editor h3,
  .quill-light .ql-editor h4 {
    color: #111827;
  }

  .quill-light .ql-editor p {
    color: #1f2937;
  }

  .quill-light .ql-editor ul li,
  .quill-light .ql-editor ol li {
    color: #1f2937;
  }

  .quill-light .ql-editor blockquote {
    color: #4b5563;
  }

  /* Dark mode tooltip */
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

  /* Light mode tooltip */
  .quill-light .ql-tooltip {
    background: #ffffff;
    border-color: #e5e7eb;
    color: #1f2937;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }

  .quill-light .ql-tooltip input[type="text"] {
    background: #f9fafb;
    border-color: #e5e7eb;
    color: #1f2937;
  }

  /* Dark picker items */
  .quill-dark .ql-picker-options .ql-picker-item {
    color: #e5e7eb;
  }

  /* RTL Support */
  .ql-editor[dir="rtl"],
  .ql-editor .ql-direction-rtl {
    direction: rtl;
    text-align: right;
  }
`;

export default AboutEditor;
