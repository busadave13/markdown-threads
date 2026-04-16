import * as path from 'path';

/** Known SPECIT header field names (in display order) */
export const SPECIT_FIELD_NAMES = ['Version', 'Created', 'Last Updated', 'Owner', 'Project', 'Status'] as const;

/** Fields that may be edited inline via the preview pane */
export const EDITABLE_FIELDS = new Set<string>(['Version', 'Owner', 'Project']);

/** Status options keyed by inferred document type */
export const STATUS_OPTIONS: Record<string, string[]> = {
  PRD: ['Draft', 'Approved'],
  Architecture: ['Draft', 'Approved'],
  ADR: ['Draft', 'Approved'],
  Feature: ['Draft', 'Approved', 'Implemented'],
  Other: ['Draft', 'Approved', 'Implemented'],
};

export type SpecitDocType = keyof typeof STATUS_OPTIONS;

export interface SpecitHeader {
  fields: Record<string, string>;
  /** 0-based line index where the blockquote starts */
  blockquoteStartLine: number;
  /** 0-based line index *after* the last blockquote line (exclusive) */
  blockquoteEndLine: number;
}

/**
 * Returns true when the first non-empty line of the document is the
 * `<!-- SPECIT -->` marker (case-insensitive, whitespace-tolerant).
 */
export function isSpecitDocument(rawMarkdown: string): boolean {
  const normalized = rawMarkdown.replace(/\r\n/g, '\n');
  const firstLine = normalized.split('\n')[0]?.trim() ?? '';
  return /^<!--\s*SPECIT\s*-->$/i.test(firstLine);
}

/**
 * Parse the blockquote metadata header from a SPECIT document.
 * Returns null when the marker is absent or no blockquote header is found.
 */
export function parseSpecitHeader(rawMarkdown: string): SpecitHeader | null {
  if (!isSpecitDocument(rawMarkdown)) { return null; }

  const lines = rawMarkdown.replace(/\r\n/g, '\n').split('\n');
  const fields: Record<string, string> = {};
  let blockquoteStart = -1;
  let blockquoteEnd = -1;

  // Walk lines looking for the first blockquote block after the marker
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim() === '') { continue; }
    // Skip H1 title (e.g. "# Product Requirements Document")
    if (/^#{1,6}\s/.test(line)) { continue; }

    if (line.startsWith('>')) {
      if (blockquoteStart === -1) { blockquoteStart = i; }
      blockquoteEnd = i + 1;

      // Parse field: > **Key**: Value<br> or > **Key**: Value
      const fieldMatch = line.match(/^>\s*\*\*(.+?)\*\*:\s*(.+?)(?:<br>)?\s*$/);
      if (fieldMatch) {
        fields[fieldMatch[1]] = fieldMatch[2].trim();
      }
    } else if (blockquoteStart !== -1) {
      // Left the blockquote block
      break;
    }
  }

  if (blockquoteStart === -1) { return null; }
  return { fields, blockquoteStartLine: blockquoteStart, blockquoteEndLine: blockquoteEnd };
}

/**
 * Replace the value of a single blockquote field and auto-update "Last Updated".
 * Returns the updated raw markdown string.
 */
export function updateSpecitField(rawMarkdown: string, fieldName: string, newValue: string): string {
  const normalized = rawMarkdown.replace(/\r\n/g, '\n');
  const fieldRegex = new RegExp(
    `^(>\\s*\\*\\*${escapeRegex(fieldName)}\\*\\*:\\s*).+?((?:<br>)?\\s*)$`,
    'm',
  );
  if (!fieldRegex.test(normalized)) { return rawMarkdown; }

  let updated = normalized.replace(fieldRegex, `$1${newValue}$2`);

  // Auto-update "Last Updated" if we changed a different field
  if (fieldName !== 'Last Updated') {
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const lastUpdatedRegex = /^(>\s*\*\*Last Updated\*\*:\s*).+?((?:<br>)?\s*)$/m;
    updated = updated.replace(lastUpdatedRegex, `$1${today}$2`);
  }

  return updated;
}

/**
 * Infer the SPECIT document type from its file path (matches spec-it-viewer heuristics).
 */
export function inferSpecitDocType(filePath: string): SpecitDocType {
  const basename = path.basename(filePath).toUpperCase();
  const dirName = path.basename(path.dirname(filePath)).toLowerCase();

  if (basename === 'PRD.MD') { return 'PRD'; }
  if (basename === 'ARCHITECTURE.MD') { return 'Architecture'; }
  if (dirName === 'adr' || basename.startsWith('ADR-')) { return 'ADR'; }
  if (dirName === 'feature' || basename.startsWith('FEAT-')) { return 'Feature'; }
  return 'Other';
}

/**
 * Remove the blockquote header lines from the raw markdown so the
 * rendered body does not duplicate the custom header widget.
 */
export function stripSpecitBlockquote(rawMarkdown: string, header: SpecitHeader): string {
  const lines = rawMarkdown.replace(/\r\n/g, '\n').split('\n');
  const before = lines.slice(0, header.blockquoteStartLine);
  const after = lines.slice(header.blockquoteEndLine);
  return [...before, ...after].join('\n');
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
