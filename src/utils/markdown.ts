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
  let bestText = selectedText;
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
    return { start: bestStart, text: bestText };
  }

  // ── 2. Fallback: allow optional markdown block prefixes per line ──
  const selLines = selectedText.split('\n');
  if (selLines.length === 0 || !selLines[0].trim()) {
    return null;
  }

  // Escape each line for use in a regex pattern
  const escaped = selLines.map(l => l.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  // Optional list marker or blockquote prefix: "- ", "* ", "+ ", "1. ", "1) ", "> "
  const blockPrefix = '(?:[ \\t]*(?:[-*+]|\\d+[.)]) |[ \\t]*> )?';
  const pattern = escaped.map(l => blockPrefix + l).join('\\n');

  try {
    const re = new RegExp(pattern, 'g');
    let m;
    while ((m = re.exec(rawMarkdown)) !== null) {
      const distance = Math.abs(m.index - contentOffset);
      if (distance < bestDistance) {
        bestDistance = distance;
        bestStart = m.index;
        bestText = m[0];
      }
      re.lastIndex = m.index + 1;
    }
  } catch (_) {
    // Invalid regex — give up on fallback
    return null;
  }

  if (bestStart !== -1) {
    return { start: bestStart, text: bestText };
  }

  return null;
}
