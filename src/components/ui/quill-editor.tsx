"use client";

import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import './quill-editor.css';
import { sanitizeHtml } from '@/lib/sanitize-html';

type QuillEditorProps = {
  value: string;
  onChange: (html: string) => void;
  className?: string;
  height?: number;
  placeholder?: string;
  theme?: 'snow' | 'bubble';
  toolbar?: any;
};

// Client-only React Quill wrapper with lazy import to avoid SSR issues.
export default function QuillEditor({
  value,
  onChange,
  className,
  height = 200,
  placeholder = '',
  theme = 'snow',
  toolbar,
}: QuillEditorProps) {
  const [Quill, setQuill] = useState<any>(null);

  useEffect(() => {
    let mounted = true;
    // Dynamically import to ensure client-only usage
    import('react-quill')
      .then((m) => {
        if (!mounted) return;
        setQuill(() => m.default || (m as any));
      })
      .catch(() => {/* ignore */});
    // Load default Snow CSS if available; safe no-op if bundler ignores
    import('react-quill/dist/quill.snow.css').catch(() => {/* ignore */});
    return () => {
      mounted = false;
    };
  }, []);

  if (!Quill) {
    return (
      <div
        className={cn(
          'flex w-full rounded-md border border-input bg-muted/30 px-3 py-2 text-sm text-muted-foreground',
          className
        )}
        style={{ minHeight: height }}
      >
        Loading editor…
      </div>
    );
  }

  const modules = {
    toolbar:
      toolbar || [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link'],
        ['clean'],
      ],
  };

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'list',
    'bullet',
    'link',
  ];

  return (
    <div className={cn('w-full quill-editor-container', className)}>
      <Quill
        theme={theme}
        value={value || ''}
        onChange={(_content: string, _delta: any, _source: any, editor: any) => {
          const rawHtml = editor?.getHTML?.() ?? '';
          const sanitized = sanitizeHtml(rawHtml);
          onChange(sanitized);
        }}
        placeholder={placeholder}
        modules={modules}
        formats={formats}
        style={{ minHeight: height }}
      />
    </div>
  );
}
