import * as path from 'path';

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
