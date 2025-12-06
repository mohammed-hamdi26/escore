"use client";
import { Button } from "@/components/ui/button";
import {
  Bold,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  Link,
  List,
  ListOrdered,
  Quote,
  Image,
  Strikethrough,
  Eye,
  Edit3,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRef, useState, useEffect } from "react";
import { Label } from "../ui/label";

function MarkDown({ formik, name, label, placeholder, error }) {
  const [content, setContent] = useState(formik?.values[name] || "");
  const [viewMode, setViewMode] = useState("split"); // "edit", "preview", "split"
  const [isFullscreen, setIsFullscreen] = useState(false);
  const textareaRef = useRef(null);
  const containerRef = useRef(null);
  const locale = useLocale();
  const tMarkDown = useTranslations("MarkDown");

  // Sync with formik values
  useEffect(() => {
    if (formik?.values[name] !== content) {
      setContent(formik?.values[name] || "");
    }
  }, [formik?.values[name]]);

  const insertMarkdown = (before, after = "", placeholder = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end) || placeholder;
    const newText =
      content.substring(0, start) +
      before +
      selectedText +
      after +
      content.substring(end);

    formik.setFieldValue(name, newText);
    setContent(newText);

    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + before.length + selectedText.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const insertAtLineStart = (prefix) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const textBeforeCursor = content.substring(0, start);
    const lineStart = textBeforeCursor.lastIndexOf("\n") + 1;

    const newText =
      content.substring(0, lineStart) +
      prefix +
      content.substring(lineStart);

    formik.setFieldValue(name, newText);
    setContent(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length);
    }, 0);
  };

  const handleKeyDown = (e) => {
    // Tab key for indentation
    if (e.key === "Tab") {
      e.preventDefault();
      insertMarkdown("  ");
      return;
    }

    if (e.key === "Enter") {
      const textarea = textareaRef.current;
      const cursorPos = textarea.selectionStart;
      const textBeforeCursor = content.substring(0, cursorPos);
      const textAfterCursor = content.substring(cursorPos);

      const lines = textBeforeCursor.split("\n");
      const currentLine = lines[lines.length - 1];

      // Handle numbered lists
      const numberedMatch = currentLine.match(/^(\s*)(\d+)\.\s(.*)$/);
      if (numberedMatch) {
        e.preventDefault();
        const indent = numberedMatch[1];
        const currentNumber = parseInt(numberedMatch[2]);
        const lineContent = numberedMatch[3];

        if (lineContent.trim() === "") {
          const newContent =
            textBeforeCursor.slice(0, -currentLine.length) + textAfterCursor;
          setContent(newContent);
          formik.setFieldValue(name, newContent);
          setTimeout(() => {
            textarea.setSelectionRange(
              cursorPos - currentLine.length,
              cursorPos - currentLine.length
            );
          }, 0);
        } else {
          const nextNumber = currentNumber + 1;
          const newContent =
            textBeforeCursor +
            "\n" +
            indent +
            nextNumber +
            ". " +
            textAfterCursor;
          setContent(newContent);
          formik.setFieldValue(name, newContent);
          setTimeout(() => {
            const newPos =
              cursorPos + indent.length + nextNumber.toString().length + 3;
            textarea.setSelectionRange(newPos, newPos);
          }, 0);
        }
        return;
      }

      // Handle bullet lists
      const bulletMatch = currentLine.match(/^(\s*)([-*+])\s(.*)$/);
      if (bulletMatch) {
        e.preventDefault();
        const indent = bulletMatch[1];
        const bulletChar = bulletMatch[2];
        const lineContent = bulletMatch[3];

        if (lineContent.trim() === "") {
          const newContent =
            textBeforeCursor.slice(0, -currentLine.length) + textAfterCursor;
          setContent(newContent);
          formik.setFieldValue(name, newContent);

          setTimeout(() => {
            textarea.setSelectionRange(
              cursorPos - currentLine.length,
              cursorPos - currentLine.length
            );
          }, 0);
        } else {
          const newContent =
            textBeforeCursor +
            "\n" +
            indent +
            bulletChar +
            " " +
            textAfterCursor;
          setContent(newContent);
          formik.setFieldValue(name, newContent);
          setTimeout(() => {
            const newPos = cursorPos + indent.length + 3;
            textarea.setSelectionRange(newPos, newPos);
          }, 0);
        }
        return;
      }
    }

    // Keyboard shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch (e.key.toLowerCase()) {
        case "b":
          e.preventDefault();
          insertMarkdown("**", "**", "bold text");
          break;
        case "i":
          e.preventDefault();
          insertMarkdown("*", "*", "italic text");
          break;
        case "k":
          e.preventDefault();
          insertMarkdown("[", "](url)", "link text");
          break;
      }
    }
  };

  const toolbarButtons = [
    {
      icon: Bold,
      action: () => insertMarkdown("**", "**", "bold"),
      title: "Bold (Ctrl+B)",
      shortcut: "Ctrl+B"
    },
    {
      icon: Italic,
      action: () => insertMarkdown("*", "*", "italic"),
      title: "Italic (Ctrl+I)",
      shortcut: "Ctrl+I"
    },
    {
      icon: Strikethrough,
      action: () => insertMarkdown("~~", "~~", "strikethrough"),
      title: "Strikethrough"
    },
    { type: "divider" },
    {
      icon: Heading1,
      action: () => insertAtLineStart("# "),
      title: "Heading 1"
    },
    {
      icon: Heading2,
      action: () => insertAtLineStart("## "),
      title: "Heading 2"
    },
    {
      icon: Heading3,
      action: () => insertAtLineStart("### "),
      title: "Heading 3"
    },
    { type: "divider" },
    {
      icon: List,
      action: () => insertAtLineStart("- "),
      title: "Bullet List"
    },
    {
      icon: ListOrdered,
      action: () => insertAtLineStart("1. "),
      title: "Numbered List",
    },
    {
      icon: Quote,
      action: () => insertAtLineStart("> "),
      title: "Quote"
    },
    { type: "divider" },
    {
      icon: Link,
      action: () => insertMarkdown("[", "](url)", "link text"),
      title: "Link (Ctrl+K)",
      shortcut: "Ctrl+K"
    },
    {
      icon: Image,
      action: () => insertMarkdown("![", "](image-url)", "alt text"),
      title: "Image"
    },
    {
      icon: Code,
      action: () => insertMarkdown("`", "`", "code"),
      title: "Inline Code",
    },
  ];

  const renderMarkdown = (text) => {
    if (!text) return "";
    let html = text;

    // Code blocks
    html = html.replace(
      /```(\w*)\n([\s\S]*?)```/g,
      '<pre class="bg-gray-800 text-gray-100 p-4 rounded-lg overflow-x-auto my-4"><code>$2</code></pre>'
    );

    // Headings
    html = html.replace(
      /^### (.*$)/gim,
      '<h3 class="text-lg font-bold mt-4 mb-2 text-gray-800">$1</h3>'
    );
    html = html.replace(
      /^## (.*$)/gim,
      '<h2 class="text-xl font-bold mt-4 mb-2 text-gray-800">$1</h2>'
    );
    html = html.replace(
      /^# (.*$)/gim,
      '<h1 class="text-2xl font-bold mt-4 mb-2 text-gray-800">$1</h1>'
    );

    // Bold and Italic
    html = html.replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>");
    html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");
    html = html.replace(/~~(.+?)~~/g, "<del>$1</del>");

    // Links and Images
    html = html.replace(
      /!\[([^\]]*)\]\(([^)]+)\)/g,
      '<img src="$2" alt="$1" class="max-w-full my-2 rounded-lg" />'
    );
    html = html.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" class="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">$1</a>'
    );

    // Inline code
    html = html.replace(
      /`([^`]+)`/g,
      '<code class="bg-gray-200 text-red-600 px-1.5 py-0.5 rounded text-sm">$1</code>'
    );

    // Blockquotes
    html = html.replace(
      /^> (.+)$/gim,
      '<blockquote class="border-l-4 border-green-500 pl-4 py-2 my-2 bg-gray-50 text-gray-700 italic">$1</blockquote>'
    );

    // Lists - Unordered
    html = html.replace(
      /^[-*+] (.+)$/gim,
      '<li class="ml-4 list-disc">$1</li>'
    );

    // Lists - Ordered
    html = html.replace(
      /^\d+\. (.+)$/gim,
      '<li class="ml-4 list-decimal">$1</li>'
    );

    // Horizontal rule
    html = html.replace(
      /^---$/gim,
      '<hr class="my-4 border-gray-300" />'
    );

    // Line breaks
    html = html.replace(/\n/g, "<br />");

    return html;
  };

  const containerClasses = isFullscreen
    ? "fixed inset-0 z-50 bg-white"
    : "w-full min-h-[50vh]";

  return (
    <div className="flex-1" ref={containerRef}>
      {label && (
        <Label className="text-[#677185] dark:text-white mb-2 block">
          {label} <span className="text-red-500">*</span>
        </Label>
      )}
      <div
        dir={locale === "ar" ? "rtl" : "ltr"}
        className={`${containerClasses} flex flex-col bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm`}
      >
        {/* Toolbar */}
        <div className="bg-gray-50 border-b border-gray-200 p-2 flex items-center gap-1 flex-wrap">
          {toolbarButtons.map((btn, idx) =>
            btn.type === "divider" ? (
              <div key={idx} className="h-6 w-px bg-gray-300 mx-1" />
            ) : (
              <button
                type="button"
                key={idx}
                onClick={btn.action}
                title={btn.title}
                className="p-2 hover:bg-gray-200 rounded transition-colors text-gray-600 hover:text-gray-900"
              >
                <btn.icon size={18} />
              </button>
            )
          )}

          <div className="flex-1" />

          {/* View Mode Toggle */}
          <div className="flex items-center bg-gray-200 rounded-lg p-0.5">
            <button
              type="button"
              onClick={() => setViewMode("edit")}
              className={`p-1.5 rounded transition-colors ${viewMode === "edit" ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
              title="Edit only"
            >
              <Edit3 size={16} />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("split")}
              className={`p-1.5 rounded transition-colors ${viewMode === "split" ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
              title="Split view"
            >
              <span className="text-xs font-medium px-1">Split</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("preview")}
              className={`p-1.5 rounded transition-colors ${viewMode === "preview" ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
              title="Preview only"
            >
              <Eye size={16} />
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 hover:bg-gray-200 rounded transition-colors text-gray-600 hover:text-gray-900 ml-2"
            title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
        </div>

        {/* Editor Area */}
        <div className="flex-1 flex overflow-hidden" style={{ minHeight: isFullscreen ? "calc(100vh - 120px)" : "350px" }}>
          {/* Edit Panel */}
          {(viewMode === "edit" || viewMode === "split") && (
            <div className={`flex flex-col ${viewMode === "split" ? "w-1/2" : "w-full"}`}>
              {viewMode === "split" && (
                <div className="bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600 flex items-center gap-2">
                  <Edit3 size={14} />
                  <span>{tMarkDown("Markdown")}</span>
                </div>
              )}
              <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                  formik.setFieldValue(name, e.target.value);
                }}
                onBlur={() => {
                  formik.setFieldTouched(name, true);
                }}
                onKeyDown={handleKeyDown}
                placeholder={placeholder || "Write your content here using Markdown..."}
                className="flex-1 p-4 font-mono text-sm resize-none focus:outline-none bg-white text-gray-800 placeholder:text-gray-400"
                style={{ minHeight: "300px" }}
              />
            </div>
          )}

          {/* Preview Panel */}
          {(viewMode === "preview" || viewMode === "split") && (
            <div className={`flex flex-col ${viewMode === "split" ? "w-1/2 border-l border-gray-200" : "w-full"}`}>
              {viewMode === "split" && (
                <div className="bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600 flex items-center gap-2">
                  <Eye size={14} />
                  <span>{tMarkDown("Preview")}</span>
                </div>
              )}
              <div
                className="flex-1 p-4 overflow-auto bg-gray-50 prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 border-t border-gray-200 px-4 py-2 text-xs text-gray-500 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span>
              {content.length} {tMarkDown("characters")}
            </span>
            <span>
              {content.split(/\s+/).filter((w) => w.length > 0).length}{" "}
              {tMarkDown("words")}
            </span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <span>Ctrl+B Bold</span>
            <span>|</span>
            <span>Ctrl+I Italic</span>
            <span>|</span>
            <span>Ctrl+K Link</span>
          </div>
        </div>
      </div>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
}

export default MarkDown;
