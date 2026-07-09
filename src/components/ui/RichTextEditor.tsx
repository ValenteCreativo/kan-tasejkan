'use client';

import dynamic from 'next/dynamic';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  return (
    <div className="rich-editor">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        placeholder={placeholder || 'Escribe aquí...'}
        modules={{
          toolbar: [
            [{ header: [2, 3, false] }],
            ['bold', 'italic', 'underline'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link', 'image'],
            ['clean'],
          ],
        }}
      />
      <style jsx global>{`
        .rich-editor .ql-container { min-height: 200px; font-size: 14px; border-radius: 0 0 8px 8px; border-color: #F0EEF5; }
        .rich-editor .ql-toolbar { border-radius: 8px 8px 0 0; border-color: #F0EEF5; }
        .rich-editor .ql-editor { min-height: 200px; }
      `}</style>
    </div>
  );
}
