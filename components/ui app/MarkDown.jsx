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
  Undo2,
  Redo2,
  Clipboard,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRef, useState, useEffect, useCallback } from "react";
import { Label } from "../ui/label";
import { useTheme } from "next-themes";

function MarkDown({ formik, name, label, placeholder, error }) {
  const [content, setContent] = useState(formik?.values[name] || "");
  const [viewMode, setViewMode] = useState("split"); // "edit", "preview", "split"
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [history, setHistory] = useState([formik?.values[name] || ""]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const textareaRef = useRef(null);
  const containerRef = useRef(null);
  const locale = useLocale();
  const tMarkDown = useTranslations("MarkDown");
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  // Mount state for hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync with formik values
  useEffect(() => {
    if (formik?.values[name] !== content) {
      setContent(formik?.values[name] || "");
    }
  }, [formik?.values[name]]);

  // Add to history for undo/redo
  const addToHistory = useCallback((newContent) => {
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(newContent);
      // Keep only last 50 states
      if (newHistory.length > 50) {
        newHistory.shift();
      }
      return newHistory;
    });
    setHistoryIndex(prev => Math.min(prev + 1, 49));
  }, [historyIndex]);

  // Undo function
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      const previousContent = history[newIndex];
      setContent(previousContent);
      formik.setFieldValue(name, previousContent);
    }
  }, [historyIndex, history, formik, name]);

  // Redo function
  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      const nextContent = history[newIndex];
      setContent(nextContent);
      formik.setFieldValue(name, nextContent);
    }
  }, [historyIndex, history, formik, name]);

  // Handle paste (including images)
  const handlePaste = useCallback(async (e) => {
    const clipboardData = e.clipboardData;

    // Check for images
    const items = clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        e.preventDefault();
        const file = items[i].getAsFile();
        if (file) {
          // Convert image to base64 for preview (in production, upload to server)
          const reader = new FileReader();
          reader.onload = (event) => {
            const base64 = event.target.result;
            const textarea = textareaRef.current;
            const start = textarea.selectionStart;
            const imageMarkdown = `![pasted-image](${base64})`;
            const newContent = content.substring(0, start) + imageMarkdown + content.substring(start);
            setContent(newContent);
            formik.setFieldValue(name, newContent);
            addToHistory(newContent);
          };
          reader.readAsDataURL(file);
        }
        return;
      }
    }

    // Handle text paste normally but add to history
    setTimeout(() => {
      const newContent = textareaRef.current?.value || "";
      if (newContent !== content) {
        addToHistory(newContent);
      }
    }, 0);
  }, [content, formik, name, addToHistory]);

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
    addToHistory(newText);

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
    addToHistory(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length);
    }, 0);
  };

  const handleKeyDown = (e) => {
    // Undo: Ctrl+Z
    if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
      e.preventDefault();
      handleUndo();
      return;
    }

    // Redo: Ctrl+Shift+Z or Ctrl+Y
    if ((e.ctrlKey || e.metaKey) && (e.key === "y" || (e.key === "z" && e.shiftKey))) {
      e.preventDefault();
      handleRedo();
      return;
    }

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
          addToHistory(newContent);
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
          addToHistory(newContent);
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
          addToHistory(newContent);

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
          addToHistory(newContent);
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

  const handleContentChange = (e) => {
    const newContent = e.target.value;
    setContent(newContent);
    formik.setFieldValue(name, newContent);
  };

  // Debounced history update on typing
  useEffect(() => {
    const timer = setTimeout(() => {
      if (content !== history[historyIndex]) {
        addToHistory(content);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [content]);

  const toolbarButtons = [
    {
      icon: Undo2,
      action: handleUndo,
      title: "Undo (Ctrl+Z)",
      disabled: historyIndex <= 0,
    },
    {
      icon: Redo2,
      action: handleRedo,
      title: "Redo (Ctrl+Y)",
      disabled: historyIndex >= history.length - 1,
    },
    { type: "divider" },
    {
      icon: Bold,
      action: () => insertMarkdown("**", "**", "bold"),
      title: "Bold (Ctrl+B)",
    },
    {
      icon: Italic,
      action: () => insertMarkdown("*", "*", "italic"),
      title: "Italic (Ctrl+I)",
    },
    {
      icon: Strikethrough,
      action: () => insertMarkdown("~~", "~~", "strikethrough"),
      title: "Strikethrough",
    },
    { type: "divider" },
    {
      icon: Heading1,
      action: () => insertAtLineStart("# "),
      title: "Heading 1",
    },
    {
      icon: Heading2,
      action: () => insertAtLineStart("## "),
      title: "Heading 2",
    },
    {
      icon: Heading3,
      action: () => insertAtLineStart("### "),
      title: "Heading 3",
    },
    { type: "divider" },
    {
      icon: List,
      action: () => insertAtLineStart("- "),
      title: "Bullet List",
    },
    {
      icon: ListOrdered,
      action: () => insertAtLineStart("1. "),
      title: "Numbered List",
    },
    {
      icon: Quote,
      action: () => insertAtLineStart("> "),
      title: "Quote",
    },
    { type: "divider" },
    {
      icon: Link,
      action: () => insertMarkdown("[", "](url)", "link text"),
      title: "Link (Ctrl+K)",
    },
    {
      icon: Image,
      action: () => insertMarkdown("![", "](image-url)", "alt text"),
      title: "Image",
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
      `<pre class="${isDark ? 'bg-gray-900 text-gray-100' : 'bg-gray-800 text-gray-100'} p-4 rounded-lg overflow-x-auto my-4"><code>$2</code></pre>`
    );

    // Headings
    html = html.replace(
      /^### (.*$)/gim,
      `<h3 class="text-lg font-bold mt-4 mb-2 ${isDark ? 'text-gray-100' : 'text-gray-800'}">$1</h3>`
    );
    html = html.replace(
      /^## (.*$)/gim,
      `<h2 class="text-xl font-bold mt-4 mb-2 ${isDark ? 'text-gray-100' : 'text-gray-800'}">$1</h2>`
    );
    html = html.replace(
      /^# (.*$)/gim,
      `<h1 class="text-2xl font-bold mt-4 mb-2 ${isDark ? 'text-gray-100' : 'text-gray-800'}">$1</h1>`
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
      `<a href="$2" class="${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'} underline" target="_blank" rel="noopener noreferrer">$1</a>`
    );

    // Inline code
    html = html.replace(
      /`([^`]+)`/g,
      `<code class="${isDark ? 'bg-gray-700 text-red-400' : 'bg-gray-200 text-red-600'} px-1.5 py-0.5 rounded text-sm">$1</code>`
    );

    // Blockquotes
    html = html.replace(
      /^> (.+)$/gim,
      `<blockquote class="border-l-4 border-green-500 pl-4 py-2 my-2 ${isDark ? 'bg-gray-800 text-gray-300' : 'bg-gray-50 text-gray-700'} italic">$1</blockquote>`
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
      `<hr class="my-4 ${isDark ? 'border-gray-600' : 'border-gray-300'}" />`
    );

    // Line breaks
    html = html.replace(/\n/g, "<br />");

    return html;
  };

  const containerClasses = isFullscreen
    ? "fixed inset-0 z-50"
    : "w-full min-h-[50vh]";

  // Loading state for hydration
  if (!mounted) {
    return (
      <div className="flex-1">
        {label && (
          <Label className="text-[#677185] dark:text-white mb-2 block">
            {label} <span className="text-red-500">*</span>
          </Label>
        )}
        <div className="w-full min-h-[400px] bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
      </div>
    );
  }

  return (
    <div className="flex-1" ref={containerRef}>
      {label && (
        <Label className="text-[#677185] dark:text-white mb-2 block">
          {label} <span className="text-red-500">*</span>
        </Label>
      )}
      <div
        dir={locale === "ar" ? "rtl" : "ltr"}
        className={`${containerClasses} flex flex-col ${isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg overflow-hidden shadow-sm`}
      >
        {/* Toolbar */}
        <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'} border-b p-2 flex items-center gap-1 flex-wrap`}>
          {toolbarButtons.map((btn, idx) =>
            btn.type === "divider" ? (
              <div key={idx} className={`h-6 w-px ${isDark ? 'bg-gray-600' : 'bg-gray-300'} mx-1`} />
            ) : (
              <button
                type="button"
                key={idx}
                onClick={btn.action}
                title={btn.title}
                disabled={btn.disabled}
                className={`p-2 rounded transition-colors ${
                  btn.disabled
                    ? 'opacity-40 cursor-not-allowed'
                    : isDark
                      ? 'hover:bg-gray-700 text-gray-300 hover:text-white'
                      : 'hover:bg-gray-200 text-gray-600 hover:text-gray-900'
                }`}
              >
                <btn.icon size={18} />
              </button>
            )
          )}

          <div className="flex-1" />

          {/* View Mode Toggle */}
          <div className={`flex items-center ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded-lg p-0.5`}>
            <button
              type="button"
              onClick={() => setViewMode("edit")}
              className={`p-1.5 rounded transition-colors ${
                viewMode === "edit"
                  ? isDark
                    ? "bg-gray-600 shadow-sm text-white"
                    : "bg-white shadow-sm text-gray-900"
                  : isDark
                    ? "text-gray-400 hover:text-gray-200"
                    : "text-gray-500 hover:text-gray-700"
              }`}
              title="Edit only"
            >
              <Edit3 size={16} />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("split")}
              className={`p-1.5 rounded transition-colors ${
                viewMode === "split"
                  ? isDark
                    ? "bg-gray-600 shadow-sm text-white"
                    : "bg-white shadow-sm text-gray-900"
                  : isDark
                    ? "text-gray-400 hover:text-gray-200"
                    : "text-gray-500 hover:text-gray-700"
              }`}
              title="Split view"
            >
              <span className="text-xs font-medium px-1">Split</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("preview")}
              className={`p-1.5 rounded transition-colors ${
                viewMode === "preview"
                  ? isDark
                    ? "bg-gray-600 shadow-sm text-white"
                    : "bg-white shadow-sm text-gray-900"
                  : isDark
                    ? "text-gray-400 hover:text-gray-200"
                    : "text-gray-500 hover:text-gray-700"
              }`}
              title="Preview only"
            >
              <Eye size={16} />
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className={`p-2 rounded transition-colors ml-2 ${
              isDark
                ? 'hover:bg-gray-700 text-gray-300 hover:text-white'
                : 'hover:bg-gray-200 text-gray-600 hover:text-gray-900'
            }`}
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
                <div className={`${isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'} px-4 py-2 text-sm font-medium flex items-center gap-2`}>
                  <Edit3 size={14} />
                  <span>{tMarkDown("Markdown")}</span>
                </div>
              )}
              <textarea
                ref={textareaRef}
                value={content}
                onChange={handleContentChange}
                onBlur={() => {
                  formik.setFieldTouched(name, true);
                }}
                onKeyDown={handleKeyDown}
                onPaste={handlePaste}
                placeholder={placeholder || "Write your content here using Markdown..."}
                className={`flex-1 p-4 font-mono text-sm resize-none focus:outline-none ${
                  isDark
                    ? 'bg-gray-900 text-gray-100 placeholder:text-gray-500'
                    : 'bg-white text-gray-800 placeholder:text-gray-400'
                }`}
                style={{ minHeight: "300px" }}
              />
            </div>
          )}

          {/* Divider */}
          {viewMode === "split" && (
            <div className={`w-px ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
          )}

          {/* Preview Panel */}
          {(viewMode === "preview" || viewMode === "split") && (
            <div className={`flex flex-col ${viewMode === "split" ? "w-1/2" : "w-full"}`}>
              {viewMode === "split" && (
                <div className={`${isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'} px-4 py-2 text-sm font-medium flex items-center gap-2`}>
                  <Eye size={14} />
                  <span>{tMarkDown("Preview")}</span>
                </div>
              )}
              <div
                className={`flex-1 p-4 overflow-auto prose prose-sm max-w-none ${
                  isDark
                    ? 'bg-gray-800 prose-invert'
                    : 'bg-gray-50'
                }`}
                dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`${isDark ? 'bg-gray-800 border-gray-700 text-gray-400' : 'bg-gray-50 border-gray-200 text-gray-500'} border-t px-4 py-2 text-xs flex justify-between items-center`}>
          <div className="flex items-center gap-4">
            <span>
              {content.length} {tMarkDown("characters")}
            </span>
            <span>
              {content.split(/\s+/).filter((w) => w.length > 0).length}{" "}
              {tMarkDown("words")}
            </span>
          </div>
          <div className={`flex items-center gap-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            <span>Ctrl+Z Undo</span>
            <span>|</span>
            <span>Ctrl+Y Redo</span>
            <span>|</span>
            <span>Ctrl+B Bold</span>
            <span>|</span>
            <span>Ctrl+I Italic</span>
          </div>
        </div>
      </div>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
}

export default MarkDown;
