import type { MarkdownSection } from '../models/types';
import { computeContentHash, slugify } from './hash';

/**
 * Parse a markdown document and extract sections by heading
 */
export function parseMarkdownSections(content: string): MarkdownSection[] {
  // Normalize line endings (Windows \r\n → \n)
  const normalizedContent = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const lines = normalizedContent.split('\n');
  const sections: MarkdownSection[] = [];
  
  let currentSection: Partial<MarkdownSection> | null = null;
  let contentLines: string[] = [];
  let inCodeBlock = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Track fenced code blocks (``` or ~~~)
    if (/^(`{3,}|~{3,})/.test(line)) {
      inCodeBlock = !inCodeBlock;
      if (currentSection) {
        contentLines.push(line);
      }
      continue;
    }

    // Skip heading detection inside code blocks
    const headingMatch = !inCodeBlock ? line.match(/^(#{1,6})\s+(.+)$/) : null;

    if (headingMatch) {
      // Save previous section if exists
      if (currentSection && currentSection.heading) {
        const sectionContent = contentLines.join('\n').trim();
        sections.push({
          heading: currentSection.heading,
          slug: currentSection.slug!,
          level: currentSection.level!,
          startLine: currentSection.startLine!,
          endLine: i,
          content: sectionContent,
          contentHash: computeContentHash(sectionContent),
        });
      }

      // Start new section
      const level = headingMatch[1].length;
      const heading = headingMatch[2].trim();
      currentSection = {
        heading,
        slug: slugify(heading),
        level,
        startLine: i,
      };
      contentLines = [];
    } else if (currentSection) {
      contentLines.push(line);
    }
  }

  // Don't forget the last section
  if (currentSection && currentSection.heading) {
    const sectionContent = contentLines.join('\n').trim();
    sections.push({
      heading: currentSection.heading,
      slug: currentSection.slug!,
      level: currentSection.level!,
      startLine: currentSection.startLine!,
      endLine: lines.length,
      content: sectionContent,
      contentHash: computeContentHash(sectionContent),
    });
  }

  return sections;
}

/**
 * Find a section by slug
 */
export function findSectionBySlug(sections: MarkdownSection[], slug: string): MarkdownSection | undefined {
  return sections.find(s => s.slug === slug);
}

/**
 * Find the section that contains a given 0-indexed line number.
 * A section spans from its startLine (inclusive) to its endLine (exclusive).
 */
export function findSectionByLine(sections: MarkdownSection[], line: number): MarkdownSection | undefined {
  return sections.find(s => line >= s.startLine && line < s.endLine);
}

/**
 * Check if a section's content hash has drifted from the stored hash
 */
export function hasContentDrifted(section: MarkdownSection, storedHash: string): boolean {
  return section.contentHash !== storedHash;
}

/**
 * Find selected text (from rendered HTML) in raw markdown.
 *
 * WebView `Selection.toString()` strips markdown block prefixes such as list
 * markers (`- `, `* `, `1. `) and blockquote markers (`> `).  When a selection
 * spans multiple list items the plain text won't appear verbatim in the raw
 * source.  This function first tries an exact `indexOf` match and, if that
 * fails, falls back to a regex that allows optional block-level prefixes
 * before each line.
 *
 * @returns `{ start, text }` where `text` is the raw-markdown version of the
 *          match (including any list markers), or `null` if nothing matched.
 */
export function findSelectionInRawMarkdown(
  selectedText: string,
  rawMarkdown: string,
  contentOffset: number,
): { start: number; text: string } | null {
  if (!selectedText) { return null; }

  // ── 1. Exact match (fast path) ──
  let bestStart = -1;
  let bestDistance = Infinity;
  let searchFrom = 0;

  while (searchFrom <= rawMarkdown.length - selectedText.length) {
    const idx = rawMarkdown.indexOf(selectedText, searchFrom);
    if (idx === -1) { break; }
    const distance = Math.abs(idx - contentOffset);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestStart = idx;
    }
    searchFrom = idx + 1;
  }

  if (bestStart !== -1) {
    return { start: bestStart, text: selectedText };
  }

  // ── 2. Fallback: strip block + inline markdown from raw, search there,
  //       map matched offsets back to the raw source.
  //
  // This handles cases where the WebView's `Selection.toString()` returns
  // visible text without:
  //   • block markers ("- ", "* ", "1. ", "> ", "# ")
  //   • inline emphasis (`**bold**`, `*em*`, `_em_`, `__bold__`)
  //   • inline code (`` `code` ``) or strikethrough (`~~s~~`)
  //   • link wrappers (`[text](url)` keeps only `text`)
  //   • image syntax (`![alt](url)` collapses to `alt`)
  //   • backslash escapes (`\*` → `*`)
  const { stripped, map } = stripMarkdownPreservingMap(rawMarkdown);
  if (stripped.length === 0) { return null; }

  let bestStripIdx = -1;
  let bestStripDistance = Infinity;
  let from = 0;
  while (from <= stripped.length - selectedText.length) {
    const idx = stripped.indexOf(selectedText, from);
    if (idx === -1) { break; }
    const rawIdx = map[idx];
    const distance = Math.abs(rawIdx - contentOffset);
    if (distance < bestStripDistance) {
      bestStripDistance = distance;
      bestStripIdx = idx;
    }
    from = idx + 1;
  }

  if (bestStripIdx !== -1) {
    const rawStart = map[bestStripIdx];
    const rawEnd = map[bestStripIdx + selectedText.length - 1] + 1;
    return { start: rawStart, text: rawMarkdown.slice(rawStart, rawEnd) };
  }

  // ── 3. Whitespace-tolerant fallback ──
  // Selection.toString() collapses block-level boundaries differently across
  // browsers — e.g. paragraphs separated by `\n\n` in raw may render with a
  // single `\n` in the selection. We collapse all whitespace runs in both
  // the stripped raw text and the selection to single spaces, search there,
  // and map back to raw offsets.
  const { norm, mapStart, mapEnd } = collapseWhitespaceWithMap(stripped, map);
  const normSel = selectedText.replace(/\s+/g, ' ').trim();
  if (!normSel) { return null; }

  let bestNormIdx = -1;
  let bestNormDistance = Infinity;
  let nFrom = 0;
  while (nFrom <= norm.length - normSel.length) {
    const idx = norm.indexOf(normSel, nFrom);
    if (idx === -1) { break; }
    const rawIdx = mapStart[idx];
    const distance = Math.abs(rawIdx - contentOffset);
    if (distance < bestNormDistance) {
      bestNormDistance = distance;
      bestNormIdx = idx;
    }
    nFrom = idx + 1;
  }

  if (bestNormIdx !== -1) {
    const rawStart = mapStart[bestNormIdx];
    const rawEnd = mapEnd[bestNormIdx + normSel.length - 1];
    return { start: rawStart, text: rawMarkdown.slice(rawStart, rawEnd) };
  }

  return null;
}

/**
 * Collapse runs of whitespace in `stripped` to single spaces and return a
 * normalized string with parallel raw-offset maps.
 *
 * - `mapStart[i]` — raw offset of the FIRST raw char represented by the
 *   i-th normalized char.
 * - `mapEnd[i]`   — raw offset (exclusive) AFTER the LAST raw char
 *   represented by the i-th normalized char.
 */
function collapseWhitespaceWithMap(
  stripped: string,
  map: number[],
): { norm: string; mapStart: number[]; mapEnd: number[] } {
  const out: string[] = [];
  const mapStart: number[] = [];
  const mapEnd: number[] = [];
  let i = 0;
  while (i < stripped.length) {
    const c = stripped[i];
    if (/\s/.test(c)) {
      const startRaw = map[i];
      let j = i;
      while (j < stripped.length && /\s/.test(stripped[j])) { j++; }
      const lastRaw = map[j - 1];
      out.push(' ');
      mapStart.push(startRaw);
      mapEnd.push(lastRaw + 1);
      i = j;
    } else {
      out.push(c);
      mapStart.push(map[i]);
      mapEnd.push(map[i] + 1);
      i++;
    }
  }
  return { norm: out.join(''), mapStart, mapEnd };
}

/**
 * Strip block-level prefixes and inline markdown delimiters from a raw
 * markdown string, returning the visible text plus a parallel array that
 * maps each character of the visible string back to its index in the raw
 * source. The map allows callers to translate matches found in the visible
 * text back to raw-source offsets.
 *
 * Exported for unit testing.
 */
export function stripMarkdownPreservingMap(raw: string): { stripped: string; map: number[] } {
  const out: string[] = [];
  const map: number[] = [];
  let i = 0;
  let atLineStart = true;
  let inFence = false;
  let inTableRow = false;
  // Stack of opened emphasis delimiters we have already committed to strip.
  // When we encounter a matching closer we drop it without re-checking.
  const emphasisStack: string[] = [];
  const len = raw.length;

  const push = (ch: string, idx: number): void => {
    out.push(ch);
    map.push(idx);
  };

  while (i < len) {
    if (atLineStart) {
      // Detect fenced code block start/end (``` or ~~~). Drop the fence line
      // itself from the stripped output (rendered HTML has no fence markers),
      // but preserve the inner content verbatim.
      const fenceMatch = raw.slice(i).match(/^[ \t]{0,3}(`{3,}|~{3,})/);
      if (fenceMatch) {
        const lineEnd = raw.indexOf('\n', i);
        if (lineEnd !== -1) { i = lineEnd + 1; atLineStart = true; }
        else { i = len; }
        inFence = !inFence;
        continue;
      }

      if (!inFence) {
        // Skip a markdown table separator row entirely:
        //   |---|---|   |:---|:---:|---:|   etc.
        const lineEnd = raw.indexOf('\n', i);
        const lineStop = lineEnd === -1 ? len : lineEnd;
        const lineText = raw.slice(i, lineStop);
        if (/^[ \t]*\|?[ \t]*:?-{3,}:?[ \t]*(\|[ \t]*:?-{3,}:?[ \t]*)+\|?[ \t]*$/.test(lineText)) {
          if (lineEnd !== -1) { i = lineEnd + 1; atLineStart = true; }
          else { i = len; }
          continue;
        }

        // A table row starts with optional whitespace then `|`. Only when
        // the current line is a table row do we treat `|` as a cell
        // separator — otherwise `|` is preserved as a literal character
        // (e.g. union types in code: `'preview' | 'internal'`).
        inTableRow = /^[ \t]*\|/.test(lineText);

        // Skip leading whitespace, then optional list/quote/heading prefix.
        let j = i;
        while (j < len && (raw[j] === ' ' || raw[j] === '\t')) { j++; }
        const rest = raw.slice(j);
        const m = rest.match(/^(?:[-*+] |\d+[.)] |> |#{1,6} )/);
        if (m) {
          i = j + m[0].length;
          atLineStart = false;
          continue;
        }
      }
      atLineStart = false;
    }

    const c = raw[i];

    if (c === '\n') {
      push('\n', i);
      i++;
      atLineStart = true;
      inTableRow = false;
      // Emphasis does not span hard line breaks in our model.
      emphasisStack.length = 0;
      continue;
    }

    if (inFence) {
      push(c, i);
      i++;
      continue;
    }

    // Backslash escape: keep the next char literally, drop the backslash.
    if (c === '\\' && i + 1 < len) {
      push(raw[i + 1], i + 1);
      i += 2;
      continue;
    }

    // Image: ![alt](url) — collapse to alt
    if (c === '!' && raw[i + 1] === '[') {
      const closeBracket = raw.indexOf(']', i + 2);
      if (closeBracket !== -1 && raw[closeBracket + 1] === '(') {
        const closeParen = raw.indexOf(')', closeBracket + 2);
        if (closeParen !== -1) {
          for (let k = i + 2; k < closeBracket; k++) { push(raw[k], k); }
          i = closeParen + 1;
          continue;
        }
      }
    }

    // Link: [text](url) → text   |   [text][ref] / [text] → text
    if (c === '[') {
      const closeBracket = raw.indexOf(']', i + 1);
      if (closeBracket !== -1) {
        const next = raw[closeBracket + 1];
        if (next === '(') {
          const closeParen = raw.indexOf(')', closeBracket + 2);
          if (closeParen !== -1) {
            for (let k = i + 1; k < closeBracket; k++) { push(raw[k], k); }
            i = closeParen + 1;
            continue;
          }
        } else if (next === '[') {
          const refClose = raw.indexOf(']', closeBracket + 2);
          if (refClose !== -1) {
            for (let k = i + 1; k < closeBracket; k++) { push(raw[k], k); }
            i = refClose + 1;
            continue;
          }
        }
      }
    }

    // Inline code span: `code` or ``co`de``
    if (c === '`') {
      // Count opening backticks
      let openCount = 0;
      while (i + openCount < len && raw[i + openCount] === '`') { openCount++; }
      const closeRe = '`'.repeat(openCount);
      const closeIdx = raw.indexOf(closeRe, i + openCount);
      if (closeIdx !== -1) {
        for (let k = i + openCount; k < closeIdx; k++) { push(raw[k], k); }
        i = closeIdx + openCount;
        continue;
      }
      // No closing fence — drop this single backtick and keep going
      i++;
      continue;
    }

    // Strikethrough: ~~text~~ → drop the delimiters
    if (c === '~' && raw[i + 1] === '~') {
      i += 2;
      continue;
    }

    // Table cell separator — only when we're inside a recognized table row.
    // Outside table rows `|` is preserved as a literal (e.g. union types
    // inside inline code spans).
    if (c === '|' && inTableRow) {
      out.push(' ');
      map.push(i);
      i++;
      continue;
    }

    // Bold/italic delimiters: **, __, *, _ — only strip when there is a
    // plausible matching closing delimiter on the same line, mirroring
    // CommonMark left-/right-flanking rules in a lightweight way. This
    // prevents stripping a `*` inside expressions like `(.*)`.
    if (c === '*' || c === '_') {
      const isDouble = raw[i + 1] === c;
      const delimLen = isDouble ? 2 : 1;
      const delim = isDouble ? c + c : c;

      // First: are we closing a previously-opened emphasis?
      if (emphasisStack.length > 0 && emphasisStack[emphasisStack.length - 1] === delim) {
        emphasisStack.pop();
        i += delimLen;
        continue;
      }

      const after = raw[i + delimLen];
      if (!after || /\s/.test(after)) {
        push(c, i);
        i++;
        continue;
      }
      const lineEnd = raw.indexOf('\n', i + delimLen);
      const searchEnd = lineEnd === -1 ? Math.min(len, i + delimLen + 400) : lineEnd;
      let found = -1;
      let p = i + delimLen;
      while (p < searchEnd) {
        const idx = raw.indexOf(delim, p);
        if (idx === -1 || idx >= searchEnd) { break; }
        const before = raw[idx - 1];
        if (before && !/\s/.test(before)) { found = idx; break; }
        p = idx + delimLen;
      }
      if (found === -1) {
        push(c, i);
        i++;
        continue;
      }
      emphasisStack.push(delim);
      i += delimLen;
      continue;
    }

    push(c, i);
    i++;
  }

  return { stripped: out.join(''), map };
}
