import type { CommentAnchor, CommentThread, MarkdownRange, TextContext } from './models/types';

const CONTEXT_CHARS = 40;
const SEARCH_WINDOW = 500;

/**
 * Engine for anchoring comments to selected text ranges in markdown.
 * Supports fuzzy re-anchoring when document content has been edited.
 */
export class AnchorEngine {

  /**
   * Extract surrounding context (~40 chars) from the raw markdown source.
   */
  extractContext(source: string, startOffset: number, endOffset: number): TextContext {
    const prefix = source.slice(Math.max(0, startOffset - CONTEXT_CHARS), startOffset);
    const suffix = source.slice(endOffset, endOffset + CONTEXT_CHARS);
    return { prefix, suffix };
  }

  /**
   * Create an anchor from a user's text selection.
   */
  createAnchor(
    selectedText: string,
    startOffset: number,
    endOffset: number,
    rawMarkdown: string,
  ): CommentAnchor {
    return {
      selectedText,
      textContext: this.extractContext(rawMarkdown, startOffset, endOffset),
      markdownRange: { startOffset, endOffset },
    };
  }

  /**
   * Try to re-anchor a comment's selected text in the (possibly edited)
   * markdown source. Returns updated offsets or null if the text can no
   * longer be located (orphaned).
   *
   * Cascading strategy:
   * 1. Exact match at original offsets
   * 2. Search near original position (±500 chars)
   * 3. prefix + text + suffix concatenation
   * 4. prefix + text  OR  text + suffix
   * 5. Global exact-text search
   */
  anchorComment(anchor: CommentAnchor, currentSource: string): MarkdownRange | null {
    const { selectedText, textContext, markdownRange } = anchor;

    // Strategy 1: exact match at original offsets
    if (currentSource.slice(markdownRange.startOffset, markdownRange.endOffset) === selectedText) {
      return markdownRange;
    }

    // Strategy 2: search near original position (±500 chars) — pick closest match
    const windowStart = Math.max(0, markdownRange.startOffset - SEARCH_WINDOW);
    const windowEnd = Math.min(currentSource.length, markdownRange.endOffset + SEARCH_WINDOW);
    const window = currentSource.slice(windowStart, windowEnd);
    let bestNearIdx = -1;
    let bestNearDist = Infinity;
    let searchFrom = 0;
    for (;;) {
      const idx = window.indexOf(selectedText, searchFrom);
      if (idx === -1) { break; }
      const absStart = windowStart + idx;
      const dist = Math.abs(absStart - markdownRange.startOffset);
      if (dist < bestNearDist) {
        bestNearDist = dist;
        bestNearIdx = idx;
      }
      searchFrom = idx + 1;
    }
    if (bestNearIdx !== -1) {
      const start = windowStart + bestNearIdx;
      return { startOffset: start, endOffset: start + selectedText.length };
    }

    // Strategy 3: search with full context (prefix + text + suffix)
    const contextPattern = textContext.prefix + selectedText + textContext.suffix;
    const contextIdx = currentSource.indexOf(contextPattern);
    if (contextIdx !== -1) {
      const start = contextIdx + textContext.prefix.length;
      return { startOffset: start, endOffset: start + selectedText.length };
    }

    // Strategy 3b: partial context — prefix + text
    if (textContext.prefix) {
      const prefixPattern = textContext.prefix + selectedText;
      const prefixIdx = currentSource.indexOf(prefixPattern);
      if (prefixIdx !== -1) {
        const start = prefixIdx + textContext.prefix.length;
        return { startOffset: start, endOffset: start + selectedText.length };
      }
    }

    // Strategy 3c: partial context — text + suffix
    if (textContext.suffix) {
      const suffixPattern = selectedText + textContext.suffix;
      const suffixIdx = currentSource.indexOf(suffixPattern);
      if (suffixIdx !== -1) {
        return { startOffset: suffixIdx, endOffset: suffixIdx + selectedText.length };
      }
    }

    // Strategy 4: global search for exact text
    const globalIdx = currentSource.indexOf(selectedText);
    if (globalIdx !== -1) {
      return { startOffset: globalIdx, endOffset: globalIdx + selectedText.length };
    }

    // Could not anchor — thread is orphaned
    return null;
  }

  /**
   * Detect threads whose anchors have drifted or can no longer be found.
   * Updates anchors in-place when re-anchoring succeeds at a new offset.
   * Returns a list of status changes to apply and whether any anchors moved.
   */
  detectStaleThreads(
    currentSource: string,
    threads: CommentThread[],
  ): { updates: { thread: CommentThread; newStatus: 'stale' | 'open' }[]; anchorsMoved: boolean } {
    const updates: { thread: CommentThread; newStatus: 'stale' | 'open' }[] = [];
    let anchorsMoved = false;

    for (const thread of threads) {
      if (thread.status === 'resolved') {
        continue; // Don't touch resolved threads
      }

      const result = this.anchorComment(thread.anchor, currentSource);

      if (!result) {
        // Text can no longer be found → stale / orphaned
        if (thread.status !== 'stale') {
          updates.push({ thread, newStatus: 'stale' });
        }
      } else {
        // Check if offsets moved
        if (result.startOffset !== thread.anchor.markdownRange.startOffset ||
            result.endOffset !== thread.anchor.markdownRange.endOffset) {
          anchorsMoved = true;
        }

        // Update anchor offsets and context
        thread.anchor.markdownRange = result;
        thread.anchor.textContext = this.extractContext(
          currentSource, result.startOffset, result.endOffset,
        );

        if (thread.status === 'stale') {
          // Successfully re-anchored → open again
          updates.push({ thread, newStatus: 'open' });
        }
      }
    }

    return { updates, anchorsMoved };
  }
}

export const anchorEngine = new AnchorEngine();
