import { Pipe, PipeTransform, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';

marked.setOptions({ breaks: true, gfm: true } as object);

@Pipe({ name: 'markdown', standalone: true })
export class MarkdownPipe implements PipeTransform {
  private readonly sanitizer = inject(DomSanitizer);

  transform(value: string | null | undefined): SafeHtml {
    if (!value) return '';
    const html = marked.parse(normalizeMarkdown(value), { async: false }) as string;
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}

function normalizeMarkdown(text: string): string {
  return text

    // ── 1. Blank line before markdown headings (## / ### style) ──────────────
    .replace(/([^\n])(#{1,6} )/g, '$1\n\n$2')

    // ── 2. Break after **HEADER** when immediately touching next sentence ─────
    // e.g. "**ANALYSIS**Your current" → "**ANALYSIS**\nYour current"
    // Only triggers when closing ** is followed directly by a word/currency char.
    .replace(/(\*\*[A-Z][^*\n]*\*\*)([A-Za-z₹("'])/g, '$1\n\n$2')

    // ── 3. Separator after % when immediately followed by an uppercase word ───
    // e.g. "17.41%Target" → "17.41%\nTarget"
    .replace(/(%)([A-Z])/g, '$1\n$2')

    // ── 4. Separator after a colon-ending label touching the next sentence ────
    // e.g. "allocations:- IT" — already caught by rule 5; this covers plain text
    // "PLAN (continued):Following" → "PLAN (continued):\nFollowing"
    .replace(/([a-z]):([A-Z])/g, '$1:\n$2')

    // ── 5. Newline before hyphen list items that run on from previous text ────
    // Deliberately skips "* " to avoid breaking inline bold/italic markers.
    .replace(/([^\n])(- )/g, '$1\n$2')

    // ── 6. Newline before numbered list items that run together ───────────────
    // e.g. "₹2,240.2. Reallocate" → "₹2,240.\n2. Reallocate"
    // Matches: sentence-ending char, then a list-number "N. Capital/₹/quote"
    .replace(/([.!?])\s*(\d+\.\s+[A-Z₹"'(])/g, '$1\n$2')

    // ── 7. Fix unmatched lone opening * on a list-item line ──────────────────
    // "- *text without closing asterisk" → "- text"
    .replace(/^(\s*[-*]\s+)\*([^*\n]+)$/gm, '$1$2')

    // ── 8. Collapse 3+ blank lines ───────────────────────────────────────────
    .replace(/\n{3,}/g, '\n\n')

    .trim();
}
