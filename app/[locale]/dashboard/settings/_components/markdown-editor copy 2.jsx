"use client"
import React, { useState, useRef, useEffect } from 'react';
import { Bold, Italic, List, ListOrdered, Heading1, Heading2, Link, Image, Code, Eye, FileDown } from 'lucide-react';

export default function MarkdownEditor({ initialContent = null, contentId = null, mode = 'create' }) {
  const [content, setContent] = useState(initialContent?.content || '');
  const [showPreview, setShowPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (contentId && mode === 'edit') {
      loadContent(contentId);
    }
  }, [contentId, mode]);

  const loadContent = async (id) => {
    setIsLoading(true);
    console.log('Loading content with ID:', id);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockContent = "# Sample Content\n\nThis is **loaded** content from the server.\n\n- Item 1\n- Item 2";
        setContent(mockContent);
        setIsLoading(false);
        resolve();
      }, 500);
    });
  };

  const submitContent = async (languageCode = "ar") => {
    // Content is already in markdown format from the textarea
    const payload = {
      languageCode: languageCode,
      content: content // This is the raw markdown string
    };
    
    setIsLoading(true);
    
    // Display the markdown content in console
    console.log('=== MARKDOWN CONTENT TO BE SENT ===');
    console.log('Raw Markdown String:');
    console.log(content);
    console.log('\n=== FULL PAYLOAD ===');
    console.log(JSON.stringify(payload, null, 2));
    console.log('\n=== API PAYLOAD (stringified) ===');
    console.log(JSON.stringify(payload));
    
    return new Promise((resolve) => {
      setTimeout(() => {
        setIsLoading(false);
        alert(`Content ${mode === 'edit' ? 'updated' : 'created'} successfully! (Placeholder)\n\nCheck console for markdown data.`);
        resolve(payload);
      }, 500);
    });
  };

  const handleSubmit = async () => {
    if (!content.trim()) {
      alert('Please enter some content before submitting');
      return;
    }
    
    await submitContent("ar");
  };

  const insertMarkdown = (before, after = '') => {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const newText = content.substring(0, start) + before + selectedText + after + content.substring(end);
    
    setContent(newText);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      const textarea = textareaRef.current;
      const cursorPos = textarea.selectionStart;
      const textBeforeCursor = content.substring(0, cursorPos);
      const textAfterCursor = content.substring(cursorPos);
      
      // Get the current line
      const lines = textBeforeCursor.split('\n');
      const currentLine = lines[lines.length - 1];
      
      // Check for numbered list (e.g., "1. ", "2. ", "123. ")
      const numberedMatch = currentLine.match(/^(\s*)(\d+)\.\s(.*)$/);
      if (numberedMatch) {
        e.preventDefault();
        const indent = numberedMatch[1];
        const currentNumber = parseInt(numberedMatch[2]);
        const lineContent = numberedMatch[3];
        
        // If line is empty (just the number), remove the number
        if (lineContent.trim() === '') {
          const newContent = textBeforeCursor.slice(0, -currentLine.length) + textAfterCursor;
          setContent(newContent);
          setTimeout(() => {
            textarea.setSelectionRange(cursorPos - currentLine.length, cursorPos - currentLine.length);
          }, 0);
        } else {
          // Add new numbered line with incremented number
          const nextNumber = currentNumber + 1;
          const newContent = textBeforeCursor + '\n' + indent + nextNumber + '. ' + textAfterCursor;
          setContent(newContent);
          setTimeout(() => {
            const newPos = cursorPos + indent.length + nextNumber.toString().length + 3;
            textarea.setSelectionRange(newPos, newPos);
          }, 0);
        }
        return;
      }
      
      // Check for bullet list (e.g., "- ", "* ", "+ ")
      const bulletMatch = currentLine.match(/^(\s*)([-*+])\s(.*)$/);
      if (bulletMatch) {
        e.preventDefault();
        const indent = bulletMatch[1];
        const bulletChar = bulletMatch[2];
        const lineContent = bulletMatch[3];
        
        // If line is empty (just the bullet), remove the bullet
        if (lineContent.trim() === '') {
          const newContent = textBeforeCursor.slice(0, -currentLine.length) + textAfterCursor;
          setContent(newContent);
          setTimeout(() => {
            textarea.setSelectionRange(cursorPos - currentLine.length, cursorPos - currentLine.length);
          }, 0);
        } else {
          // Add new bullet line
          const newContent = textBeforeCursor + '\n' + indent + bulletChar + ' ' + textAfterCursor;
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
    { icon: Bold, action: () => insertMarkdown('**', '**'), title: 'Bold' },
    { icon: Italic, action: () => insertMarkdown('*', '*'), title: 'Italic' },
    { icon: Heading1, action: () => insertMarkdown('# '), title: 'Heading 1' },
    { icon: Heading2, action: () => insertMarkdown('## '), title: 'Heading 2' },
    { icon: List, action: () => insertMarkdown('- '), title: 'Bullet List' },
    { icon: ListOrdered, action: () => insertMarkdown('1. '), title: 'Numbered List' },
    { icon: Link, action: () => insertMarkdown('[', '](url)'), title: 'Link' },
    { icon: Image, action: () => insertMarkdown('![alt](', ')'), title: 'Image' },
    { icon: Code, action: () => insertMarkdown('`', '`'), title: 'Inline Code' },
  ];

  const renderMarkdown = (text) => {
    let html = text;
    
    html = html.replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold mt-4 mb-2">$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mt-4 mb-2">$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-4 mb-2">$1</h1>');
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 underline">$1</a>');
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full my-2" />');
    html = html.replace(/`([^`]+)`/g, '<code class="bg-gray-200 px-1 rounded">$1</code>');
    html = html.replace(/\n/g, '<br />');
    
    return html;
  };

  const exportToFormat = () => {
    const exportData = {
      languageCode: "ar",
      content: content
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'content.json';
    a.click();
    URL.revokeObjectURL(url);
    
    console.log('Exported content:', exportData);
    alert('Content exported! Check console and downloads.');
  };

  return (
    <div className="w-full h-screen flex flex-col bg-gray-50 text-stone-900">
      {isLoading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-700">Loading...</p>
          </div>
        </div>
      )}
      
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
        
        <button
          onClick={() => setShowPreview(!showPreview)}
          title="Toggle Preview"
          className={`p-2 rounded transition-colors ${showPreview ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
        >
          <Eye size={18} />
        </button>
        
        <button
          onClick={exportToFormat}
          title="Export Content"
          className="p-2 hover:bg-gray-100 rounded transition-colors"
        >
          <FileDown size={18} />
        </button>
        
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="ml-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-medium text-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {mode === 'edit' ? 'Update' : 'Submit'}
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className={`${showPreview ? 'w-1/2' : 'w-full'} flex flex-col`}>
          <div className="bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 flex justify-between">
            <span>Markdown</span>
            <span className="text-xs text-gray-500">
              {mode === 'edit' ? 'Edit Mode' : 'Create Mode'}
            </span>
          </div>
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={mode === 'edit' ? 'Edit your content...' : 'Start typing in markdown...'}
            disabled={isLoading}
            className="flex-1 p-4 font-mono text-sm resize-none focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>

        {showPreview && (
          <div className="w-1/2 flex flex-col border-l border-gray-300">
            <div className="bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700">
              Preview
            </div>
            <div 
              className="flex-1 p-4 overflow-auto bg-white prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
            />
          </div>
        )}
      </div>

      <div className="bg-gray-200 px-4 py-2 text-xs text-gray-600 flex justify-between">
        <span>{content.length} characters</span>
        <span>{content.split(/\s+/).filter(w => w.length > 0).length} words</span>
      </div>
    </div>
  );
}