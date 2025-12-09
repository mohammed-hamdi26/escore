"use client";
import {
  addAboutContent,
  getAboutContent,
  updateAboutContent,
} from "@/app/[locale]/_Lib/actions";
import LoadingScreen from "@/components/ui app/loading-screen";
import { Button } from "@/components/ui/button";
import {
  Bold,
  Code,
  Heading1,
  Heading2,
  Italic,
  Link,
  List,
  ListOrdered,
  Undo2,
  Redo2,
} from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import toast from "react-hot-toast";
import AboutDeleteDialog from "./about-delete-dialog";

const contentCache = new Map();
function AboutEditor({ languageCode }) {
  const t = useTranslations("AboutPage");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasAbout, setHasAbout] = useState(false);
  const [history, setHistory] = useState([""]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const textareaRef = useRef(null);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchContent = async () => {
      if (!languageCode) return;
      if (contentCache.has(languageCode)) {
        const cachedContent = contentCache.get(languageCode);
        setContent(cachedContent);
        setHistory([cachedContent]);
        setHistoryIndex(0);
        setHasAbout(true);
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
          setHistory([cleanedData]);
          setHistoryIndex(0);
          contentCache.set(languageCode, cleanedData);
          setHasAbout(true);
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setContent("");
          setHistory([""]);
          setHistoryIndex(0);
          setHasAbout(false);
        } else {
          console.error("Failed to fetch about content:", error);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, [languageCode]);

  // Add to history for undo/redo
  const addToHistory = useCallback((newContent) => {
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(newContent);
      if (newHistory.length > 50) newHistory.shift();
      return newHistory;
    });
    setHistoryIndex(prev => Math.min(prev + 1, 49));
  }, [historyIndex]);

  // Undo function
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setContent(history[newIndex]);
    }
  }, [historyIndex, history]);

  // Redo function
  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setContent(history[newIndex]);
    }
  }, [historyIndex, history]);

  // Handle paste
  const handlePaste = useCallback(async (e) => {
    const clipboardData = e.clipboardData;
    const items = clipboardData.items;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        e.preventDefault();
        const file = items[i].getAsFile();
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            const base64 = event.target.result;
            const textarea = textareaRef.current;
            const start = textarea.selectionStart;
            const imageMarkdown = `![pasted-image](${base64})`;
            const newContent = content.substring(0, start) + imageMarkdown + content.substring(start);
            setContent(newContent);
            addToHistory(newContent);
          };
          reader.readAsDataURL(file);
        }
        return;
      }
    }

    setTimeout(() => {
      const newContent = textareaRef.current?.value || "";
      if (newContent !== content) {
        addToHistory(newContent);
      }
    }, 0);
  }, [content, addToHistory]);

  const submitContent = async (languageCode) => {
    setIsLoading(true);
    try {
      if (!hasAbout) {
        await addAboutContent(languageCode, content);
        toast.success(t("Content created successfully"));
        contentCache.set(languageCode, content);
      } else if (hasAbout) {
        await updateAboutContent(languageCode, content);
        toast.success(t("Content updated successfully"));
        contentCache.set(languageCode, content);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!content.trim()) {
      toast.error(t("Please enter content"));
      return;
    }
    await submitContent(languageCode);
  };

  const insertMarkdown = (before, after = "") => {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const newText =
      content.substring(0, start) +
      before +
      selectedText +
      after +
      content.substring(end);

    setContent(newText);
    addToHistory(newText);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  const handleKeyDown = (e) => {
    // Undo: Ctrl+Z
    if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
      e.preventDefault();
      handleUndo();
      return;
    }

    // Redo: Ctrl+Y or Ctrl+Shift+Z
    if ((e.ctrlKey || e.metaKey) && (e.key === "y" || (e.key === "z" && e.shiftKey))) {
      e.preventDefault();
      handleRedo();
      return;
    }

    if (e.key === "Enter") {
      const textarea = textareaRef.current;
      const cursorPos = textarea.selectionStart;
      const textBeforeCursor = content.substring(0, cursorPos);
      const textAfterCursor = content.substring(cursorPos);

      const lines = textBeforeCursor.split("\n");
      const currentLine = lines[lines.length - 1];

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
          addToHistory(newContent);
          setTimeout(() => {
            const newPos =
              cursorPos + indent.length + nextNumber.toString().length + 3;
            textarea.setSelectionRange(newPos, newPos);
          }, 0);
        }
        return;
      }

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
          addToHistory(newContent);
          setTimeout(() => {
            const newPos = cursorPos + indent.length + 3;
            textarea.setSelectionRange(newPos, newPos);
          }, 0);
        }
        return;
      }
    }
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  // Debounced history update
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
    { icon: Bold, action: () => insertMarkdown("**", "**"), title: t("Bold") },
    { icon: Italic, action: () => insertMarkdown("*", "*"), title: t("Italic") },
    { icon: Heading1, action: () => insertMarkdown("# "), title: t("Heading 1") },
    { icon: Heading2, action: () => insertMarkdown("## "), title: t("Heading 2") },
    { icon: List, action: () => insertMarkdown("- "), title: t("Bullet List") },
    {
      icon: ListOrdered,
      action: () => insertMarkdown("1. "),
      title: t("Numbered List"),
    },
    { icon: Link, action: () => insertMarkdown("[", "](url)"), title: t("Link") },
    {
      icon: Code,
      action: () => insertMarkdown("`", "`"),
      title: t("Inline Code"),
    },
  ];

  const renderMarkdown = (text) => {
    let html = text;

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
    html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");
    html = html.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      `<a href="$2" class="${isDark ? 'text-blue-400' : 'text-blue-600'} underline">$1</a>`
    );
    html = html.replace(
      /!\[([^\]]*)\]\(([^)]+)\)/g,
      '<img src="$2" alt="$1" class="max-w-full my-2" />'
    );
    html = html.replace(
      /`([^`]+)`/g,
      `<code class="${isDark ? 'bg-gray-700 text-red-400' : 'bg-gray-200 text-red-600'} px-1 rounded">$1</code>`
    );
    html = html.replace(/\n/g, "<br />");

    return html;
  };

  if (!mounted) {
    return (
      <div className="w-full min-h-[65vh] bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
    );
  }

  return (
    <>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <div
          dir={languageCode === "ar" ? "rtl" : "ltr"}
          className={`w-full min-h-[65vh] flex flex-col rounded-lg overflow-hidden border ${
            isDark
              ? 'bg-gray-900 border-gray-700 text-gray-100'
              : 'bg-gray-50 border-gray-200 text-gray-900'
          }`}
        >
          <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'} border-b p-2 flex items-center gap-1 flex-wrap`}>
            {toolbarButtons.map((btn, idx) =>
              btn.type === "divider" ? (
                <div key={idx} className={`h-6 w-px ${isDark ? 'bg-gray-600' : 'bg-gray-300'} mx-1`} />
              ) : (
                <button
                  key={idx}
                  onClick={btn.action}
                  title={btn.title}
                  disabled={btn.disabled}
                  className={`p-2 rounded transition-colors ${
                    btn.disabled
                      ? 'opacity-40 cursor-not-allowed'
                      : isDark
                        ? 'hover:bg-gray-700 text-gray-300 hover:text-white'
                        : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <btn.icon size={18} />
                </button>
              )
            )}

            <div className={`h-6 w-px ${isDark ? 'bg-gray-600' : 'bg-gray-300'} mx-2`} />
            <Button
              onClick={handleSubmit}
              disabled={isLoading || !languageCode}
              className="rounded-full min-w-[50px] bg-blue-600 hover:bg-blue-500 text-white cursor-pointer transition-all duration-300 font-medium text-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {hasAbout ? t("Update") : t("Submit")}
            </Button>
            {hasAbout && (
              <AboutDeleteDialog
                contentCache={contentCache}
                languageCode={languageCode}
                setHasAbout={setHasAbout}
                setContent={setContent}
              />
            )}
          </div>

          <div className="flex-1 flex overflow-hidden">
            <div className={`w-1/2 flex flex-col`}>
              <div className={`${isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-200 text-gray-700'} px-4 py-2 text-sm font-medium flex justify-between`}>
                <span>{t("Markdown")}</span>
              </div>
              <textarea
                ref={textareaRef}
                value={content}
                onChange={handleContentChange}
                onKeyDown={handleKeyDown}
                onPaste={handlePaste}
                placeholder={t("Select language first")}
                disabled={isLoading}
                className={`flex-1 p-4 font-mono text-sm resize-none focus:outline-none ${
                  isDark
                    ? 'bg-gray-900 text-gray-100 placeholder:text-gray-500 disabled:bg-gray-800'
                    : 'bg-white text-gray-900 placeholder:text-gray-400 disabled:bg-gray-100'
                } disabled:cursor-not-allowed`}
              />
            </div>
            <div className={`w-1/2 flex flex-col ${isDark ? 'border-gray-700' : 'border-gray-300'} border-l`}>
              <div className={`${isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-200 text-gray-700'} px-4 py-2 text-sm font-medium`}>
                {t("Preview")}
              </div>
              <div
                className={`flex-1 p-4 overflow-auto prose prose-sm max-w-none ${
                  isDark
                    ? 'bg-gray-800 prose-invert text-gray-100'
                    : 'bg-white text-gray-900'
                }`}
                dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
              />
            </div>
          </div>

          <div className={`${isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-200 text-gray-600'} px-4 py-2 text-xs flex justify-between`}>
            <span>{content.length} {t("characters")}</span>
            <span>
              {content.split(/\s+/).filter((w) => w.length > 0).length} {t("words")}
            </span>
          </div>
        </div>
      )}
    </>
  );
}

export default AboutEditor;
