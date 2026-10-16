"use client"

import { useRef, useCallback, useEffect, useState } from "react"
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Quote,
  Heading1,
  Heading2,
  Heading3,
  Link as LinkIcon,
  ImageIcon,
  Undo,
  Redo,
  Code,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Unlink,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { SITE_DOMAIN } from "@/lib/site"

// "gayduoma.com/x" or "www.x.com" would otherwise become a relative link to /blog/gayduoma.com/x.
function normalizeUrl(raw: string) {
  const url = raw.trim()
  if (!url) return ""
  if (/^(https?:|mailto:|tel:|\/|#)/i.test(url)) return url
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(url)) return `mailto:${url}`
  return `https://${url}`
}

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!)

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const isInitialMount = useRef(true)

  // Set initial content only once
  useEffect(() => {
    if (isInitialMount.current && editorRef.current && value) {
      editorRef.current.innerHTML = value
      isInitialMount.current = false
    }
  }, [value])

  const execCommand = useCallback((command: string, commandValue?: string) => {
    editorRef.current?.focus()
    document.execCommand(command, false, commandValue)
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }, [onChange])

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }, [onChange])

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault()
    const text = e.clipboardData.getData("text/plain")
    document.execCommand("insertText", false, text)
  }, [])

  // Link editing: the selection is saved when the link bar opens (focus moves to the URL input,
  // which would otherwise drop it) and restored before the link is applied.
  const savedRange = useRef<Range | null>(null)
  const editingAnchor = useRef<HTMLAnchorElement | null>(null)
  const [linkOpen, setLinkOpen] = useState(false)
  const [linkUrl, setLinkUrl] = useState("")
  const [linkText, setLinkText] = useState("")
  const [linkHasSelection, setLinkHasSelection] = useState(false)

  const openLinkBar = () => {
    const editor = editorRef.current
    const sel = window.getSelection()
    if (!editor) return
    let range: Range
    if (sel && sel.rangeCount && editor.contains(sel.getRangeAt(0).commonAncestorContainer)) {
      range = sel.getRangeAt(0).cloneRange()
    } else {
      // Nothing selected in the editor: insert at the end.
      range = document.createRange()
      range.selectNodeContents(editor)
      range.collapse(false)
    }
    savedRange.current = range
    const node = range.commonAncestorContainer
    const anchor = (node instanceof Element ? node : node.parentElement)?.closest("a")
    editingAnchor.current = anchor && editor.contains(anchor) ? anchor : null
    setLinkUrl(editingAnchor.current?.getAttribute("href") ?? "")
    setLinkText(range.toString())
    setLinkHasSelection(!range.collapsed || !!editingAnchor.current)
    setLinkOpen(true)
  }

  const restoreSelection = () => {
    const sel = window.getSelection()
    editorRef.current?.focus()
    if (sel && savedRange.current) {
      sel.removeAllRanges()
      sel.addRange(savedRange.current)
    }
  }

  const syncLinks = () => {
    const editor = editorRef.current
    if (!editor) return
    // External links open in a new tab; links to our own site stay in the same tab.
    editor.querySelectorAll("a").forEach((a) => {
      const href = a.getAttribute("href") ?? ""
      if (/^https?:/i.test(href) && !href.includes(SITE_DOMAIN)) {
        a.setAttribute("target", "_blank")
        a.setAttribute("rel", "noopener noreferrer")
      } else {
        a.removeAttribute("target")
        a.removeAttribute("rel")
      }
    })
    onChange(editor.innerHTML)
  }

  const closeLinkBar = () => {
    setLinkOpen(false)
    restoreSelection()
  }

  const applyLink = () => {
    const url = normalizeUrl(linkUrl)
    if (!url) return closeLinkBar()
    setLinkOpen(false)
    restoreSelection()
    if (editingAnchor.current) {
      editingAnchor.current.setAttribute("href", url)
    } else if (savedRange.current && !savedRange.current.collapsed) {
      document.execCommand("createLink", false, url)
    } else {
      const text = linkText.trim() || linkUrl.trim()
      document.execCommand("insertHTML", false, `<a href="${escapeHtml(url)}">${escapeHtml(text)}</a>&nbsp;`)
    }
    syncLinks()
  }

  const removeLink = () => {
    setLinkOpen(false)
    restoreSelection()
    const anchor = editingAnchor.current
    if (anchor) {
      anchor.replaceWith(...Array.from(anchor.childNodes))
    } else {
      document.execCommand("unlink")
    }
    syncLinks()
  }

  useEffect(() => {
    const editor = editorRef.current
    if (!editor) return
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        openLinkBar()
      }
    }
    editor.addEventListener("keydown", onKey)
    return () => editor.removeEventListener("keydown", onKey)
  })

  const insertImage = () => {
    const url = prompt("Enter image URL:")
    if (url) {
      execCommand("insertImage", url)
    }
  }

  const ToolbarButton = ({ 
    onClick, 
    icon: Icon, 
    title,
    label
  }: { 
    onClick: () => void
    icon?: typeof Bold
    title: string
    label?: string
  }) => (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      // Stop the button taking focus on mousedown so the editor keeps its text selection.
      onMouseDown={(e) => e.preventDefault()}
      onClick={(e) => {
        e.preventDefault()
        onClick()
      }}
      className="h-8 px-2 text-xs font-medium hover:bg-foreground/10"
      title={title}
    >
      {Icon ? <Icon className="h-4 w-4" /> : label}
    </Button>
  )

  const ToolbarDivider = () => (
    <div className="w-px h-6 bg-border mx-1" />
  )

  return (
    <div className="border border-border rounded-lg overflow-hidden bg-background">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 p-2 border-b border-border bg-muted/30">
        <ToolbarButton onClick={() => execCommand("undo")} icon={Undo} title="Undo" />
        <ToolbarButton onClick={() => execCommand("redo")} icon={Redo} title="Redo" />
        
        <ToolbarDivider />
        
        <ToolbarButton onClick={() => execCommand("formatBlock", "h1")} label="H1" title="Heading 1" />
        <ToolbarButton onClick={() => execCommand("formatBlock", "h2")} label="H2" title="Heading 2" />
        <ToolbarButton onClick={() => execCommand("formatBlock", "h3")} label="H3" title="Heading 3" />
        <ToolbarButton onClick={() => execCommand("formatBlock", "p")} label="P" title="Paragraph" />
        
        <ToolbarDivider />
        
        <ToolbarButton onClick={() => execCommand("bold")} icon={Bold} title="Bold (Ctrl+B)" />
        <ToolbarButton onClick={() => execCommand("italic")} icon={Italic} title="Italic (Ctrl+I)" />
        <ToolbarButton onClick={() => execCommand("underline")} icon={Underline} title="Underline (Ctrl+U)" />
        <ToolbarButton onClick={() => execCommand("formatBlock", "pre")} icon={Code} title="Code Block" />
        
        <ToolbarDivider />
        
        <ToolbarButton onClick={() => execCommand("justifyLeft")} icon={AlignLeft} title="Align Left" />
        <ToolbarButton onClick={() => execCommand("justifyCenter")} icon={AlignCenter} title="Align Center" />
        <ToolbarButton onClick={() => execCommand("justifyRight")} icon={AlignRight} title="Align Right" />
        
        <ToolbarDivider />
        
        <ToolbarButton onClick={() => execCommand("insertUnorderedList")} icon={List} title="Bullet List" />
        <ToolbarButton onClick={() => execCommand("insertOrderedList")} icon={ListOrdered} title="Numbered List" />
        <ToolbarButton onClick={() => execCommand("formatBlock", "blockquote")} icon={Quote} title="Quote" />
        
        <ToolbarDivider />
        
        <ToolbarButton onClick={openLinkBar} icon={LinkIcon} title="Insert or edit link (Ctrl/Cmd+K)" />
        <ToolbarButton onClick={() => { savedRange.current = null; document.execCommand("unlink"); syncLinks() }} icon={Unlink} title="Remove link" />
        <ToolbarButton onClick={insertImage} icon={ImageIcon} title="Insert Image" />
      </div>

      {linkOpen && (
        <div className="flex flex-wrap items-center gap-2 p-2 border-b border-border bg-muted/20">
          {!linkHasSelection && (
            <input
              type="text"
              value={linkText}
              onChange={(e) => setLinkText(e.target.value)}
              placeholder="Link text"
              className="h-8 w-40 rounded-md border border-border bg-background px-2 text-sm focus:border-foreground focus:outline-none"
            />
          )}
          <input
            type="text"
            autoFocus
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => {
              // Enter would otherwise submit the whole post form.
              if (e.key === "Enter") { e.preventDefault(); applyLink() }
              if (e.key === "Escape") { e.preventDefault(); closeLinkBar() }
            }}
            placeholder="Paste or type a link, e.g. gayduoma.com/talent"
            className="h-8 min-w-0 flex-1 rounded-md border border-border bg-background px-2 text-sm focus:border-foreground focus:outline-none"
          />
          <Button type="button" size="sm" className="h-8" onClick={applyLink}>
            {editingAnchor.current ? "Update" : "Add link"}
          </Button>
          {editingAnchor.current && (
            <Button type="button" size="sm" variant="ghost" className="h-8" onClick={removeLink}>
              Remove
            </Button>
          )}
          <Button type="button" size="sm" variant="ghost" className="h-8" onClick={closeLinkBar}>
            Cancel
          </Button>
        </div>
      )}

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        dir="ltr"
        suppressContentEditableWarning
        className="rich-content min-h-[300px] p-4 focus:outline-none max-w-none [&>*]:text-left"
        onInput={handleInput}
        onPaste={handlePaste}
        data-placeholder={placeholder || "Start writing..."}
        style={{
          minHeight: "300px",
          direction: "ltr",
          textAlign: "left",
          writingMode: "horizontal-tb",
        }}
      />
      
      <style jsx>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: hsl(var(--muted-foreground));
          pointer-events: none;
          position: absolute;
        }
        [contenteditable] {
          position: relative;
        }
        [contenteditable] * {
          direction: ltr !important;
          unicode-bidi: embed !important;
          text-align: left;
        }
      `}</style>
    </div>
  )
}
