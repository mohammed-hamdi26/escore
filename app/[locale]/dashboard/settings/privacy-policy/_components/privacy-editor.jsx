"use client";
import {
  addPrivacyContent,
  getPrivacyContent,
  updatePrivacyContent,
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
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import PrivacyDeleteDialog from "./privacy-delete-dialog";

const contentCache = new Map();
export default function PrivacyEditor({ languageCode }) {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasPrivacy, setHasPrivacy] = useState(false);
  const textareaRef = useRef(null);
  useEffect(() => {
    const fetchContent = async () => {
      if (!languageCode) return;
      if (contentCache.has(languageCode)) {
        setContent(contentCache.get(languageCode));
        setHasPrivacy(true);
        return;
      }
      setIsLoading(true);
      try {
        const { data } = await getPrivacyContent(languageCode);
        if (data && data.content) {
          const cleanedData = data.content
            .replace(/\\n/g, "\n")
            .replace(/^"|"$/g, "");
          setContent(cleanedData);
          contentCache.set(languageCode, cleanedData);
          setHasPrivacy(true);
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setContent("");
          setHasPrivacy(false);
        } else {
          console.error("Failed to fetch privacy content:", error);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, [languageCode]);

  const submitContent = async (languageCode) => {
    setIsLoading(true);
    try {
      if (!hasPrivacy) {
        await addPrivacyContent(languageCode, content);
        toast.success("Privacy content has created sucessfully");
        contentCache.set(languageCode, content);
      } else if (hasPrivacy) {
        await updatePrivacyContent(languageCode, content);
        toast.success("Privacy content has updated sucessfully");
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
      toast.error("Please enter some content before submitting");
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
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  const handleKeyDown = (e) => {
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
          setTimeout(() => {
            const newPos = cursorPos + indent.length + 3;
            textarea.setSelectionRange(newPos, newPos);
          }, 0);
        }
        return;
      }
    }
  };

  const toolbarButtons = [
    { icon: Bold, action: () => insertMarkdown("**", "**"), title: "Bold" },
    { icon: Italic, action: () => insertMarkdown("*", "*"), title: "Italic" },
    { icon: Heading1, action: () => insertMarkdown("# "), title: "Heading 1" },
    { icon: Heading2, action: () => insertMarkdown("## "), title: "Heading 2" },
    { icon: List, action: () => insertMarkdown("- "), title: "Bullet List" },
    {
      icon: ListOrdered,
      action: () => insertMarkdown("1. "),
      title: "Numbered List",
    },
    { icon: Link, action: () => insertMarkdown("[", "](url)"), title: "Link" },
    {
      icon: Code,
      action: () => insertMarkdown("`", "`"),
      title: "Inline Code",
    },
  ];

  const renderMarkdown = (text) => {
    let html = text;

    html = html.replace(
      /^### (.*$)/gim,
      '<h3 class="text-lg font-bold mt-4 mb-2">$1</h3>'
    );
    html = html.replace(
      /^## (.*$)/gim,
      '<h2 class="text-xl font-bold mt-4 mb-2">$1</h2>'
    );
    html = html.replace(
      /^# (.*$)/gim,
      '<h1 class="text-2xl font-bold mt-4 mb-2">$1</h1>'
    );
    html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");
    html = html.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" class="text-blue-600 underline">$1</a>'
    );
    html = html.replace(
      /!\[([^\]]*)\]\(([^)]+)\)/g,
      '<img src="$2" alt="$1" class="max-w-full my-2" />'
    );
    html = html.replace(
      /`([^`]+)`/g,
      '<code class="bg-gray-200 px-1 rounded">$1</code>'
    );
    html = html.replace(/\n/g, "<br />");

    return html;
  };

  return (
    <>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <div
          dir={languageCode === "ar" ? "rtl" : "ltr"}
          className="w-full min-h-[65vh] flex flex-col bg-gray-50 text-stone-900"
        >
          <div className="bg-white border-b border-gray-300 p-2 flex items-center gap-1 flex-wrap">
            {toolbarButtons.map((btn, idx) => (
              <button
                key={idx}
                onClick={btn.action}
                title={btn.title}
                className="p-2 hover:bg-gray-100 rounded transition-colors"
              >
                <btn.icon size={18} />
              </button>
            ))}

            <div className="h-6 w-px bg-gray-300 mx-2" />
            <Button
              onClick={handleSubmit}
              disabled={isLoading || !languageCode}
              className="rounded-full min-w-[50px] bg-blue-600 hover:bg-blue-500 text-amber-50 cursor-pointer transition-all duration-300 font-medium text-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {hasPrivacy ? "Update" : "Submit"}
            </Button>
            {hasPrivacy && (
              <PrivacyDeleteDialog
                contentCache={contentCache}
                languageCode={languageCode}
                setHasPrivacy={setHasPrivacy}
                setContent={setContent}
              />
            )}
          </div>

          <div className="flex-1 flex overflow-hidden">
            <div className={`w-1/2 flex flex-col`}>
              <div className="bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 flex justify-between">
                <span>Markdown</span>
              </div>
              <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Select language first then start typing..."
                disabled={isLoading}
                className="flex-1 p-4 font-mono text-sm resize-none focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
            <div className="w-1/2 flex flex-col border-l border-gray-300">
              <div className="bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700">
                Preview
              </div>
              <div
                className="flex-1 p-4 overflow-auto bg-white prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
              />
            </div>
          </div>

          <div className="bg-gray-200 px-4 py-2 text-xs text-gray-600 flex justify-between">
            <span>{content.length} characters</span>
            <span>
              {content.split(/\s+/).filter((w) => w.length > 0).length} words
            </span>
          </div>
        </div>
      )}
    </>
  );
}
