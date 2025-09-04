import React, { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

type RichTextEditorProps = {
  value: string
  onChange: (html: string) => void
  className?: string
  toolbarClassName?: string
  minHeight?: number
}

export function RichTextEditor({
  value,
  onChange,
  className,
  toolbarClassName,
  minHeight = 120,
}: RichTextEditorProps) {
  const ref = useRef<HTMLDivElement>(null)

  // Keep content in sync when parent value changes
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (el.innerHTML !== (value || '')) {
      el.innerHTML = value || ''
    }
  }, [value])

  const exec = (command: string, value?: string) => {
    // Prevent loss of selection when clicking toolbar
    ref.current?.focus()
    document.execCommand(command, false, value)
  }

  const onInput = () => {
    const html = ref.current?.innerHTML ?? ''
    onChange(html)
  }

  const insertLink = () => {
    const url = window.prompt('Enter URL')
    if (url) exec('createLink', url)
  }

  const clearFormatting = () => {
    exec('removeFormat')
    exec('unlink')
  }

  return (
    <div className={cn('w-full', className)}>
      <div
        className={cn(
          'mb-2 flex flex-wrap gap-1',
          toolbarClassName
        )}
        onMouseDown={(e) => e.preventDefault()}
      >
        <Button type="button" variant="outline" size="sm" onClick={() => exec('bold')}>B</Button>
        <Button type="button" variant="outline" size="sm" onClick={() => exec('italic')}><em>I</em></Button>
        <Button type="button" variant="outline" size="sm" onClick={() => exec('underline')}><u>U</u></Button>
        <Button type="button" variant="outline" size="sm" onClick={() => exec('formatBlock', 'H1')}>H1</Button>
        <Button type="button" variant="outline" size="sm" onClick={() => exec('formatBlock', 'H2')}>H2</Button>
        <Button type="button" variant="outline" size="sm" onClick={() => exec('formatBlock', 'P')}>P</Button>
        <Button type="button" variant="outline" size="sm" onClick={() => exec('insertUnorderedList')}>• List</Button>
        <Button type="button" variant="outline" size="sm" onClick={() => exec('insertOrderedList')}>1. List</Button>
        <Button type="button" variant="outline" size="sm" onClick={insertLink}>Link</Button>
        <Button type="button" variant="outline" size="sm" onClick={clearFormatting}>Clear</Button>
      </div>
      <div
        ref={ref}
        contentEditable
        onInput={onInput}
        className={cn(
          'flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'min-h-[80px]'
        )}
        style={{ minHeight }}
        suppressContentEditableWarning
      />
    </div>
  )
}

export default RichTextEditor

