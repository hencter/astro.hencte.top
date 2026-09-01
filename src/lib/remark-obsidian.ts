/**
 * Unified remark plugin to transform Obsidian-flavored Markdown syntax
 * into standard Markdown/HTML that Astro's built-in renderer can handle.
 *
 * Handles:
 *  - Callouts:     > [!NOTE] Title  →  <div class="callout callout-note">...
 *  - Wiki links:   [[page|alias]]   →  [alias](/blog/page)
 *  - Highlights:   ==text==          →  <mark>text</mark>
 *  - Math blocks:  $$...$$           →  <div class="math-block">\[...\]</div>
 *  - Mermaid:      ```mermaid ...``` →  <div class="mermaid-container"><pre class="mermaid">...</pre></div>
 */
import { visit } from "unist-util-visit"
import type { Root, Parent, Node } from "mdast"

/* ── Public plugin ─────────────────────────────────────────── */

export function remarkObsidian() {
  return (tree: Root) => {
    transformCallouts(tree)
    transformWikiLinks(tree)
    transformHighlights(tree)
    transformMathBlocks(tree)
    transformMermaidBlocks(tree)
  }
}

/* ── Callouts ──────────────────────────────────────────────── */
/* > [!note] Title              <div class="callout callout-note">
 * > Content line          →       <div class="callout-header">Title</div>
 * > More content                  Content line\nMore content
 *                            </div>
 */

function transformCallouts(tree: Root) {
  visit(tree, "blockquote", (node, index, parent) => {
    if (node.children.length === 0) return

    const firstChild = node.children[0]
    if (firstChild.type !== "paragraph") return
    if (firstChild.children.length === 0) return

    const firstText = firstChild.children[0]
    if (firstText.type !== "text") return

    const m = firstText.value.match(/^\[!(\w+)\]\s*([+-])?\s*(.*)/)
    if (!m) return

    const type = m[1].toLowerCase()
    const title = m[3].trim() || type.charAt(0).toUpperCase() + type.slice(1)
    const remaining = firstText.value.slice(m[0].length)

    if (remaining) {
      firstText.value = remaining
    } else {
      firstChild.children.shift()
      if (firstChild.children.length === 0) {
        node.children.shift()
      }
    }

    const bodyHtmlParts: string[] = []
    for (const child of node.children) {
      bodyHtmlParts.push(nodeToMarkdown(child))
    }

    const bodyHtml = bodyHtmlParts.join("\n")
    const calloutHtml =
      `<div class="callout callout-${type}">\n` +
      `<div class="callout-header"><span class="callout-icon"></span><strong class="callout-title">${escapeHtml(title)}</strong></div>\n` +
      `<div class="callout-body">\n${bodyHtml}\n</div>\n` +
      `</div>`

    const htmlNode: any = { type: "html", value: calloutHtml }

    if (parent && typeof index === "number") {
      parent.children.splice(index, 1, htmlNode)
    }
  })
}

/* ── Wiki Links ────────────────────────────────────────────── */

function transformWikiLinks(tree: Root) {
  visit(tree, "text", (node: any, index, parent) => {
    if (!parent || typeof index !== "number") return
    if (!node.value.includes("[[")) return

    const parts = splitWikiLinks(node.value)
    if (parts.length <= 1) return

    const newNodes: any[] = []
    for (const part of parts) {
      if (typeof part === "string") {
        newNodes.push({ type: "text", value: part })
      } else {
        const { page, alias } = part
        const display = alias || page
        let href: string
        if (page.startsWith("/")) {
          href = page
        } else {
          const slug = page.replace(/\s+/g, "-").toLowerCase()
          href = `/blog/${slug}`
        }
        newNodes.push({
          type: "link",
          url: href,
          title: null,
          children: [{ type: "text", value: display }],
        })
      }
    }

    parent.children.splice(index, 1, ...newNodes)
  })
}

function splitWikiLinks(
  text: string,
): (string | { page: string; alias: string | null })[] {
  const result: (string | { page: string; alias: string | null })[] = []
  let last = 0

  const re = /\[\[([^\]]+?)\]\]/g
  let m: RegExpExecArray | null
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) {
      result.push(text.slice(last, m.index))
    }
    const inner = m[1]
    const pipe = inner.indexOf("|")
    const page = pipe >= 0 ? inner.slice(0, pipe).trim() : inner.trim()
    const alias = pipe >= 0 ? inner.slice(pipe + 1).trim() : null
    result.push({ page, alias })
    last = m.index + m[0].length
  }
  if (last < text.length) {
    result.push(text.slice(last))
  }
  return result
}

/* ── Highlights: ==text==  →  <mark>text</mark> ────────────── */

function transformHighlights(tree: Root) {
  visit(tree, "text", (node: any, index, parent) => {
    if (!parent || typeof index !== "number") return
    if (!node.value.includes("==")) return

    const parts = splitHighlights(node.value)
    if (parts.length <= 1) return

    const newNodes: any[] = []
    for (const part of parts) {
      if (typeof part === "string") {
        newNodes.push({ type: "text", value: part })
      } else {
        newNodes.push({
          type: "html",
          value: `<mark>${escapeHtml(part)}</mark>`,
        })
      }
    }
    parent.children.splice(index, 1, ...newNodes)
  })
}

function splitHighlights(text: string): (string | string)[] {
  const result: (string | string)[] = []
  let last = 0
  const re = /==([^=\n]+?)==/g
  let m: RegExpExecArray | null
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) result.push(text.slice(last, m.index))
    result.push(m[1])
    last = m.index + m[0].length
  }
  if (last < text.length) result.push(text.slice(last))
  return result
}

/* ── Math Blocks: $$...$$  →  HTML div ──────────────────────── */

function transformMathBlocks(tree: Root) {
  visit(tree, "paragraph", (node: any, index, parent) => {
    if (!parent || typeof index !== "number") return
    if (node.children.length !== 1) return
    const child = node.children[0]
    if (child.type !== "text") return

    const m = child.value.match(/^\$\$([\s\S]*?)\$\$$/)
    if (!m) return

    const mathHtml =
      `<div class="math-block">\\[${m[1].trim()}\\]</div>`
    parent.children.splice(index, 1, { type: "html", value: mathHtml })
  })
}

/* ── Mermaid Blocks ─────────────────────────────────────────── */

function transformMermaidBlocks(tree: Root) {
  visit(tree, "code", (node: any, index, parent) => {
    if (!parent || typeof index !== "number") return
    if (node.lang !== "mermaid") return

    const mermaidHtml =
      `<div class="mermaid-container"><pre class="mermaid">${escapeHtml(node.value)}</pre></div>`
    parent.children.splice(index, 1, { type: "html", value: mermaidHtml })
  })
}

/* ── Helpers ────────────────────────────────────────────────── */

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

function nodeToMarkdown(node: any): string {
  if (node.type === "text") return escapeHtml(node.value)
  if (node.type === "html") return node.value
  if (node.type === "inlineCode") return `<code>${escapeHtml(node.value)}</code>`
  if (node.type === "strong")
    return `<strong>${node.children.map(nodeToMarkdown).join("")}</strong>`
  if (node.type === "emphasis")
    return `<em>${node.children.map(nodeToMarkdown).join("")}</em>`
  if (node.type === "delete")
    return `<del>${node.children.map(nodeToMarkdown).join("")}</del>`
  if (node.type === "link")
    return `<a href="${escapeHtml(node.url)}">${node.children.map(nodeToMarkdown).join("")}</a>`
  if (node.type === "image")
    return `<img src="${escapeHtml(node.url)}" alt="${escapeHtml(node.alt || "")}">`
  if (node.type === "paragraph")
    return `<p>${node.children.map(nodeToMarkdown).join("")}</p>`
  if (node.type === "code")
    return `<pre><code>${escapeHtml(node.value)}</code></pre>`
  if (node.type === "list") {
    const tag = node.ordered ? "ol" : "ul"
    const items = node.children
      .map((c: any) => `<li>${c.children.map(nodeToMarkdown).join("")}</li>`)
      .join("")
    return `<${tag}>${items}</${tag}>`
  }
  if (node.children) {
    return node.children.map(nodeToMarkdown).join("")
  }
  return ""
}
