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

const DOC_TYPE_LABELS: Record<SpecitDocType, string> = {
  PRD: 'Product Requirements Document',
  Architecture: 'Architecture Document',
  ADR: 'Architecture Decision Record',
  Feature: 'Feature Spec',
  Other: '',
};

/**
 * Return a human-friendly display label for a SPECIT document type.
 * Returns an empty string for 'Other' (no subtitle warranted).
 */
export function specitDocTypeLabel(docType: SpecitDocType): string {
  return DOC_TYPE_LABELS[docType] ?? '';
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Result of resolving an internal document link */
export interface ResolvedDocLink {
  /** Absolute file path to the target markdown document */
  filePath: string;
  /** Optional fragment identifier (without leading '#'), or null */
  fragment: string | null;
}

/**
 * Resolve a relative markdown link against the current document's directory.
 *
 * Returns the resolved file path and optional fragment, or `null` when:
 * - The href is empty, an anchor-only fragment, or external (http/https/data/vscode-)
 * - The resolved target does not end with `.md` (case-insensitive)
 * - The resolved path escapes the given workspace root
 *
 * @param currentDocPath Absolute path of the document containing the link
 * @param href           Raw href value from the rendered anchor tag
 * @param workspaceRoot  Absolute path of the workspace root for boundary enforcement
 */
export function resolveInternalDocLink(
  currentDocPath: string,
  href: string,
  workspaceRoot: string,
): ResolvedDocLink | null {
  if (!href) { return null; }

  // Decode URL-encoded characters (e.g. %20 → space)
  let decoded: string;
  try {
    decoded = decodeURIComponent(href);
  } catch {
    return null;
  }

  // Reject external/special protocols
  if (/^(?:https?|data|mailto):/i.test(decoded)) { return null; }
  if (/^vscode-/i.test(decoded)) { return null; }

  // Pure fragment on the same document (e.g. "#section")
  if (decoded.startsWith('#')) { return null; }

  // Split off fragment
  let fragment: string | null = null;
  const hashIdx = decoded.indexOf('#');
  let filePart = decoded;
  if (hashIdx !== -1) {
    fragment = decoded.slice(hashIdx + 1) || null;
    filePart = decoded.slice(0, hashIdx);
  }

  // Must target a .md file
  if (!/\.md$/i.test(filePart)) { return null; }

  // Resolve against the directory of the current document
  const resolved = path.resolve(path.dirname(currentDocPath), filePart);

  // Enforce workspace boundary (normalize to remove trailing separators)
  const normalizedRoot = path.normalize(workspaceRoot) + path.sep;
  const normalizedResolved = path.normalize(resolved);
  if (!normalizedResolved.startsWith(normalizedRoot) && normalizedResolved !== path.normalize(workspaceRoot)) {
    return null;
  }

  return { filePath: resolved, fragment };
}
