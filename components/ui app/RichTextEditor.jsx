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
        [{ direction: "rtl" }], // RTL/LTR toggle
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
    "direction", // RTL support
    "list",      // handles both ordered and bullet lists
    "blockquote",
    "code-block",
    "link",
    "image",
    "video",
  ];

  // Helper function to detect RTL text
  const isRTL = (text) => {
    if (!text) return false;
    // Arabic, Hebrew, Persian, Urdu character ranges
    const rtlRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\u0590-\u05FF]/;
    // Get first non-whitespace character
    const firstChar = text.replace(/\s/g, '').charAt(0);
    return rtlRegex.test(firstChar);
  };

  // Helper function to detect if text is HTML
  const isHTML = (text) => {
    if (!text) return false;
    const trimmed = text.trim();
    // Check if it starts with < and contains closing tags
    return trimmed.startsWith('<') && /<\/?[a-z][\s\S]*>/i.test(trimmed);
  };

  // Helper function to convert Markdown to HTML
  const markdownToHTML = (md) => {
    if (!md) return '';
    let html = md
      // Headers
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      // Bold
      .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
      .replace(/__(.*?)__/gim, '<strong>$1</strong>')
      // Italic
      .replace(/\*(.*?)\*/gim, '<em>$1</em>')
      .replace(/_(.*?)_/gim, '<em>$1</em>')
      // Strikethrough
      .replace(/~~(.*?)~~/gim, '<s>$1</s>')
      // Links
      .replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2">$1</a>')
      // Images
      .replace(/!\[(.*?)\]\((.*?)\)/gim, '<img alt="$1" src="$2" />')
      // Inline code
      .replace(/`([^`]+)`/gim, '<code>$1</code>')
      // Code blocks
      .replace(/```[\s\S]*?```/gim, (match) => {
        const code = match.replace(/```\w*\n?/g, '').replace(/```/g, '');
        return '<pre>' + code + '</pre>';
      })
      // Blockquotes
      .replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>')
      // Unordered lists
      .replace(/^\* (.*$)/gim, '<li>$1</li>')
      .replace(/^\- (.*$)/gim, '<li>$1</li>')
      // Line breaks
      .replace(/\n/gim, '<br />');

    // Wrap consecutive <li> in <ul>
    html = html.replace(/(<li>.*<\/li>)(\s*<br \/>)*(<li>)/gim, '$1$3');
    html = html.replace(/(<li>.*<\/li>)+/gim, '<ul>$&</ul>');

    return html;
  };

  // Helper function to detect if text is Markdown
  const isMarkdown = (text) => {
    if (!text) return false;
    const mdPatterns = [
      /^#{1,6}\s/m,           // Headers
      /\*\*.*?\*\*/,          // Bold
      /\*.*?\*/,              // Italic
      /\[.*?\]\(.*?\)/,       // Links
      /^\s*[-*]\s/m,          // Lists
      /^\s*\d+\.\s/m,         // Numbered lists
      /```/,                  // Code blocks
      /^\>/m,                 // Blockquotes
    ];
    return mdPatterns.some(pattern => pattern.test(text));
  };

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
    const rawText = text || "";

    // Character count (excluding trailing newline from Quill)
    const charText = rawText.replace(/\n$/, '');
    setCharCount(charText.length);

    // Word count - match actual words (letters/numbers sequences)
    // This regex matches words in any language including Arabic, English, etc.
    const wordMatches = rawText.match(/[\p{L}\p{N}]+/gu);
    setWordCount(wordMatches ? wordMatches.length : 0);
  }, []);

  // Handle content change with smart RTL detection
  const handleChange = useCallback(
    (content, delta, source, editor) => {
      // Quill returns <p><br></p> for empty content
      const isEmpty = content === "<p><br></p>" || content === "<p></p>" || !content;
      const value = isEmpty ? "" : content;

      formik?.setFieldValue(name, value);
      formik?.validateField(name);
      updateCounts(editor.getText());

      // Smart auto-direction: detect RTL and apply direction
      if (quillRef.current && source === 'user') {
        const quill = quillRef.current.getEditor();
        const text = editor.getText();
        const shouldBeRTL = isRTL(text);

        // Get current selection to restore it
        const selection = quill.getSelection();

        // Apply direction to the whole document based on first character
        if (text.trim().length > 0) {
          const currentFormat = quill.getFormat();
          const currentDirection = currentFormat.direction === 'rtl';

          // Only change if different and user hasn't manually set it
          if (shouldBeRTL !== currentDirection && delta.ops && delta.ops.some(op => op.insert)) {
            quill.formatLine(0, quill.getLength(), 'direction', shouldBeRTL ? 'rtl' : false);
            quill.formatLine(0, quill.getLength(), 'align', shouldBeRTL ? 'right' : false);
          }
        }

        // Restore selection
        if (selection) {
          quill.setSelection(selection);
        }
      }
    },
    [formik, name, updateCounts]
  );

  // Handle blur
  const handleBlur = useCallback(() => {
    formik?.setFieldTouched(name, true);
    formik?.validateField(name);
  }, [formik, name]);

  // Setup paste handler for HTML/Markdown
  useEffect(() => {
    if (!quillRef.current) return;

    const quill = quillRef.current.getEditor();
    if (!quill) return;

    const handlePaste = (e) => {
      const clipboardData = e.clipboardData || window.clipboardData;
      if (!clipboardData) return;

      const pastedText = clipboardData.getData('text/plain');

      // Check if pasted text looks like HTML code (from code editor)
      if (isHTML(pastedText)) {
        e.preventDefault();
        e.stopPropagation();

        const selection = quill.getSelection(true);
        const index = selection ? selection.index : quill.getLength();

        // Delete any selected content
        if (selection && selection.length > 0) {
          quill.deleteText(selection.index, selection.length);
        }

        // Extract just the body content if it's a full HTML document
        let htmlToInsert = pastedText;

        // If it's a full HTML document, extract the body content
        const bodyMatch = pastedText.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
        if (bodyMatch) {
          htmlToInsert = bodyMatch[1];
        } else {
          // Remove doctype, html, head tags if present
          htmlToInsert = pastedText
            .replace(/<!DOCTYPE[^>]*>/gi, '')
            .replace(/<html[^>]*>/gi, '')
            .replace(/<\/html>/gi, '')
            .replace(/<head>[\s\S]*?<\/head>/gi, '')
            .replace(/<body[^>]*>/gi, '')
            .replace(/<\/body>/gi, '')
            .trim();
        }

        // Insert the cleaned HTML content
        quill.clipboard.dangerouslyPasteHTML(index, htmlToInsert);

        // Trigger change event
        const newContent = quill.root.innerHTML;
        formik?.setFieldValue(name, newContent);
        updateCounts(quill.getText());

        return;
      }

      // Check if pasted text is Markdown
      if (isMarkdown(pastedText)) {
        e.preventDefault();
        e.stopPropagation();

        const selection = quill.getSelection(true);
        const index = selection ? selection.index : quill.getLength();

        // Delete any selected content
        if (selection && selection.length > 0) {
          quill.deleteText(selection.index, selection.length);
        }

        // Convert Markdown to HTML and insert
        const html = markdownToHTML(pastedText);
        quill.clipboard.dangerouslyPasteHTML(index, html);

        // Trigger change event
        const newContent = quill.root.innerHTML;
        formik?.setFieldValue(name, newContent);
        updateCounts(quill.getText());

        return;
      }
    };

    // Add paste listener to Quill's root element
    const editorRoot = quill.root;
    editorRoot.addEventListener('paste', handlePaste, true);

    return () => {
      editorRoot.removeEventListener('paste', handlePaste, true);
    };
  }, [QuillComponent, formik, name, updateCounts]);

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

  const editorHeight = isFullscreen ? "calc(100vh - 140px)" : minHeight;

  // Fullscreen wrapper
  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-[9999] bg-background p-4 flex flex-col">
        <div
          className={`flex-1 flex flex-col rounded-xl overflow-hidden border border-border ${
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
                onClick={() => setIsFullscreen(false)}
                className="p-1.5 rounded-lg bg-muted dark:bg-[#252a3d] text-muted-foreground hover:text-foreground transition-all"
                title={t("exitFullscreen") || "Exit Fullscreen"}
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
                value={formik?.values[name] || ""}
                onChange={handleChange}
                onBlur={handleBlur}
                modules={modules}
                formats={formats}
                placeholder={placeholder || t("placeholder") || "Start writing..."}
              />
            </div>
          ) : (
            <div
              className={`flex-1 flex items-center justify-center ${
                isDark ? "bg-[#0f1118]" : "bg-white"
              }`}
            >
              <span className="text-muted-foreground text-sm">Loading editor...</span>
            </div>
          )}
        </div>

        {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
      </div>
    );
  }

  // Normal view
  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium text-muted-foreground">
          {label} <span className="text-red-500">*</span>
        </label>
      )}

      <div
        className={`relative rounded-xl overflow-hidden border border-border ${
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
              onClick={() => setIsFullscreen(true)}
              className="p-1.5 rounded-lg bg-muted dark:bg-[#252a3d] text-muted-foreground hover:text-foreground transition-all"
              title={t("fullscreen") || "Fullscreen"}
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

        /* Light mode picker dropdown text */
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

        /* RTL Support */
        .ql-editor[dir="rtl"],
        .ql-editor .ql-direction-rtl {
          direction: rtl;
          text-align: right;
        }

        /* RTL button styling */
        .ql-snow .ql-picker.ql-direction {
          width: 40px;
        }

        .ql-snow .ql-picker.ql-direction .ql-picker-label::before {
          content: "⇄";
          font-size: 14px;
        }

        .ql-snow .ql-picker.ql-direction .ql-picker-item::before {
          content: "LTR";
        }

        .ql-snow .ql-picker.ql-direction .ql-picker-item[data-value="rtl"]::before {
          content: "RTL";
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

        .quill-light .ql-tooltip a.ql-action::after,
        .quill-light .ql-tooltip a.ql-remove::before {
          color: #22c55e;
        }

        /* Headers styling for light mode */
        .quill-light .ql-editor h1,
        .quill-light .ql-editor h2,
        .quill-light .ql-editor h3,
        .quill-light .ql-editor h4 {
          color: #111827;
        }

        /* Paragraphs in light mode */
        .quill-light .ql-editor p {
          color: #1f2937;
        }

        /* Lists in light mode */
        .quill-light .ql-editor ul li,
        .quill-light .ql-editor ol li {
          color: #1f2937;
        }

        /* Blockquote in light mode */
        .quill-light .ql-editor blockquote {
          color: #4b5563;
        }
      `}</style>
    </div>
  );
}
