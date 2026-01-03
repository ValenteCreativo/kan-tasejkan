'use client';

import { useState, useRef } from 'react';
import { Bold, Italic, Underline, List, ListOrdered, Link, Code, Heading1, Heading2, Quote } from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const TOOLBAR_ITEMS = [
  { id: 'bold', icon: Bold, label: 'Bold' },
  { id: 'italic', icon: Italic, label: 'Italic' },
  { id: 'underline', icon: Underline, label: 'Underline' },
  { id: 'h1', icon: Heading1, label: 'Heading 1' },
  { id: 'h2', icon: Heading2, label: 'Heading 2' },
  { id: 'list', icon: List, label: 'Bullet List' },
  { id: 'ordered', icon: ListOrdered, label: 'Numbered List' },
  { id: 'quote', icon: Quote, label: 'Quote' },
  { id: 'code', icon: Code, label: 'Inline Code' },
  { id: 'link', icon: Link, label: 'Insert Link' },
];

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');

  function insertAtCursor(before: string, after: string = '') {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);

    onChange(newText);

    // Set cursor position after the inserted text
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + before.length + selectedText.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  }

  function wrapSelection(wrapper: string, endWrapper?: string) {
    insertAtCursor(wrapper, endWrapper || wrapper);
  }

  function insertLinePrefix(prefix: string) {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const lines = value.substring(0, start).split('\n');
    const currentLineStart = start - lines[lines.length - 1].length;

    const newText = value.substring(0, currentLineStart) + prefix + value.substring(currentLineStart);
    onChange(newText);

    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + prefix.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  }

  function handleInsertLink() {
    if (linkUrl && linkText) {
      insertAtCursor(`[${linkText}](${linkUrl})`);
      setLinkUrl('');
      setLinkText('');
      setShowLinkInput(false);
    }
  }

  function handleToolbarAction(id: string) {
    switch (id) {
      case 'bold': wrapSelection('**'); break;
      case 'italic': wrapSelection('*'); break;
      case 'underline': wrapSelection('<u>', '</u>'); break;
      case 'h1': insertLinePrefix('# '); break;
      case 'h2': insertLinePrefix('## '); break;
      case 'list': insertLinePrefix('- '); break;
      case 'ordered': insertLinePrefix('1. '); break;
      case 'quote': insertLinePrefix('> '); break;
      case 'code': wrapSelection('`'); break;
      case 'link': setShowLinkInput(!showLinkInput); break;
    }
  }

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      <div className="glass-minimal p-3 rounded-lg flex flex-wrap gap-2">
        {TOOLBAR_ITEMS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => handleToolbarAction(item.id)}
            className="p-2 hover:bg-[#8b7d7b]/20 rounded transition-colors group relative"
            title={item.label}
          >
            <item.icon size={18} className="text-[#8b7d7b] group-hover:text-white transition-colors" />
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs bg-black/90 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
              {item.label}
            </span>
          </button>
        ))}
      </div>

      {/* Link Input */}
      {showLinkInput && (
        <div className="glass-minimal p-4 rounded-lg space-y-3 animate-fade-in">
          <div>
            <label className="elegant-text text-xs mb-2 block">Link Text</label>
            <input
              type="text"
              value={linkText}
              onChange={(e) => setLinkText(e.target.value)}
              className="w-full px-3 py-2 minimal-border rounded bg-transparent text-white font-light text-sm focus:border-[#8b7d7b] transition-colors"
              placeholder="Text to display"
            />
          </div>
          <div>
            <label className="elegant-text text-xs mb-2 block">URL</label>
            <input
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              className="w-full px-3 py-2 minimal-border rounded bg-transparent text-white font-light text-sm focus:border-[#8b7d7b] transition-colors"
              placeholder="https://example.com"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleInsertLink}
              className="flex-1 btn-elegant text-xs py-2"
            >
              Insert Link
            </button>
            <button
              type="button"
              onClick={() => {
                setShowLinkInput(false);
                setLinkUrl('');
                setLinkText('');
              }}
              className="flex-1 px-4 py-2 border border-[#8b7d7b]/30 text-[#8b7d7b] hover:bg-[#8b7d7b]/10 rounded elegant-text text-xs transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Text Area */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 minimal-border rounded bg-transparent text-white font-light focus:border-[#8b7d7b] transition-colors min-h-[400px] resize-y"
        placeholder={placeholder || "Write your journal entry here..."}
      />

      {/* Help Text */}
      <div className="text-xs text-[#8b7d7b] font-light space-y-1">
        <p>✨ Supports Markdown and HTML formatting</p>
        <p>💡 Select text and click a formatting button to apply styles</p>
      </div>
    </div>
  );
}
