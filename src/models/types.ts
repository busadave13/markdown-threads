/**
 * Core types for the Markdown Review extension
 */

/** Surrounding context for fuzzy re-anchoring */
export interface TextContext {
  /** ~40 characters before the selected text */
  prefix: string;
  /** ~40 characters after the selected text */
  suffix: string;
}

/** Byte-offset range into raw markdown source */
export interface MarkdownRange {
  /** Start offset (inclusive) */
  startOffset: number;
  /** End offset (exclusive) */
  endOffset: number;
}

/** Anchor information for locating a comment within a document */
export interface CommentAnchor {
  /** The exact text the user selected */
  selectedText: string;
  /** Surrounding context for fuzzy re-anchoring when offsets drift */
  textContext: TextContext;
  /** Character offsets into the raw markdown source */
  markdownRange: MarkdownRange;
}

/** A single comment entry within a thread */
export interface CommentEntry {
  /** Unique identifier (UUID) */
  id: string;
  /** Author email (from git config) */
  author: string;
  /** Comment body text (markdown supported) */
  body: string;
  /** ISO-8601 timestamp when created */
  created: string;
  /** ISO-8601 timestamp when last edited, or null */
  edited: string | null;
  /** Thumbs-up reactions — array of author names who reacted */
  reactions?: string[];
}

/** Status of a comment thread */
export type ThreadStatus = 'open' | 'resolved' | 'stale';

/** A comment thread anchored to selected text in a document */
export interface CommentThread {
  /** Unique identifier (UUID) */
  id: string;
  /** Anchor information for locating this thread */
  anchor: CommentAnchor;
  /** Current status of the thread */
  status: ThreadStatus;
  /** Whether this is a draft (not yet published to PR) */
  isDraft: boolean;
  /** All comments in this thread */
  thread: CommentEntry[];
  /** Highlight color for the selected text (hex, e.g. "#FFD700") */
  color?: string;
}

/** The sidecar file schema for storing comments */
export interface SidecarFile {
  /** Name of the markdown document this file is for */
  doc: string;
  /** Schema version for future compatibility */
  version: '2.0';
  /** All comment threads for this document */
  comments: CommentThread[];
}

/** A parsed markdown section */
export interface MarkdownSection {
  /** The heading text */
  heading: string;
  /** Slug derived from heading */
  slug: string;
  /** Heading level (1-6) */
  level: number;
  /** Line number where section starts (0-indexed) */
  startLine: number;
  /** Line number where section ends (0-indexed, exclusive) */
  endLine: number;
  /** Content of the section (excluding heading) */
  content: string;
  /** Hash of first 200 chars of content */
  contentHash: string;
}

/** Git provider type */
export type GitProvider = 'github' | 'azuredevops' | 'unknown';

/** Result of provider detection */
export interface ProviderInfo {
  provider: GitProvider;
  owner: string;
  repo: string;
  remoteUrl: string;
}

/** PR creation result */
export interface PRResult {
  success: boolean;
  prUrl?: string;
  prNumber?: number;
  error?: string;
}

/** Extension configuration */
export interface ExtensionConfig {
  docPaths: string[];
  autoOpenPR: boolean;
  branchPrefix: string;
  defaultProvider: 'auto' | 'github' | 'azuredevops';
}
