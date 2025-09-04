"use client";

import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

type CKEditorFieldProps = {
  value: string;
  onChange: (html: string) => void;
  className?: string;
  height?: number;
  licenseKey?: string; // optional CKEditor license key
};

// Client-only CKEditor wrapper that lazy-loads the editor to avoid SSR issues.
export default function CKEditorField({ value, onChange, className, height = 200, licenseKey = 'GPL' }: CKEditorFieldProps) {
  const [mods, setMods] = useState<{ CKEditor: any; ClassicEditor: any } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mounted = true;
    // Dynamically import to prevent SSR/window issues
    Promise.all([
      import('@ckeditor/ckeditor5-react'),
      import('@ckeditor/ckeditor5-build-classic'),
    ])
      .then(([reactMod, classicMod]) => {
        if (!mounted) return;
        const CKEditor = (reactMod as any).CKEditor;
        const ClassicEditor = (classicMod as any).default || (classicMod as any);
        setMods({ CKEditor, ClassicEditor });
      })
      .catch(() => {
        // Keep silent; caller can render a fallback if needed
      });
    return () => {
      mounted = false;
    };
  }, []);

  // Apply min-height to the editable area once the editor mounts.
  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;
    const editable = root.querySelector('.ck-editor__editable_inline') as HTMLElement | null;
    if (editable) {
      editable.style.minHeight = `${height}px`;
    }
  }, [mods, height]);

  if (!mods) {
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

  const { CKEditor, ClassicEditor } = mods;

  return (
    <div ref={containerRef} className={cn('w-full', className)}>
      <CKEditor
        editor={ClassicEditor}
        data={value || ''}
        onChange={(_event: any, editor: any) => {
          const data = editor.getData?.() ?? '';
          onChange(data);
        }}
        config={{
          // CKEditor 5 (v40+) requires a license key.
          // For open-source, use 'GPL'; override with NEXT_PUBLIC_CKEDITOR_LICENSE_KEY for commercial keys.
          licenseKey,
          toolbar: [
            'heading',
            '|',
            'bold',
            'italic',
            'underline',
            'link',
            'bulletedList',
            'numberedList',
            'blockQuote',
            'undo',
            'redo',
          ],
        }}
      />
    </div>
  );
}
