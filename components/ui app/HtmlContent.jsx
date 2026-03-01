"use client";

/**
 * Renders content as HTML (rich text) or plain text with automatic detection.
 * Backward compatible: existing plain-text descriptions render with whitespace-pre-wrap,
 * while new HTML content from RichTextEditor renders with prose styling.
 */
export default function HtmlContent({ content, className = "" }) {
  if (!content) return null;

  const isHtml = /<[a-z][\s\S]*>/i.test(content);

  if (isHtml) {
    return (
      <div
        className={`prose prose-sm prose-gray dark:prose-invert max-w-none ${className}`}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }

  return (
    <p className={`whitespace-pre-wrap ${className}`}>
      {content}
    </p>
  );
}
