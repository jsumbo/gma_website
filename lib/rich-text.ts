// Biographies used to be plain text with blank lines between paragraphs; newer ones are HTML from
// the rich text editor. These helpers let both kinds render and edit the same way.

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!)

export function isHtml(text: string) {
  return /<\/?[a-z][\s\S]*>/i.test(text)
}

export function toRichHtml(text: string) {
  if (!text) return ""
  if (isHtml(text)) return text
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `<p>${escapeHtml(p).replace(/\n/g, "<br>")}</p>`)
    .join("")
}

export function htmlToPlainText(html: string) {
  return html
    .replace(/<\/(p|div|h[1-6]|li|blockquote)>/gi, "\n\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
}

// First paragraph as plain text, e.g. for structured data / meta descriptions.
export function firstParagraph(text: string) {
  return htmlToPlainText(toRichHtml(text)).split("\n\n")[0] ?? ""
}
