import * as assert from 'assert';
import { AnchorEngine } from '../../anchorEngine';
import type { CommentThread, CommentAnchor } from '../../models/types';

const SAMPLE_MD = `# Introduction

This is the introduction paragraph with some important text that we might want to comment on.

## API Endpoints

GET /users returns all users. POST /users creates a new user.

## Authentication

Authentication is handled via JWT tokens. Users must provide a valid token.`;

/** Helper: build a CommentAnchor for the given text within SAMPLE_MD */
function anchorFor(text: string, source = SAMPLE_MD): CommentAnchor {
  const engine = new AnchorEngine();
  const start = source.indexOf(text);
  if (start === -1) { throw new Error(`Text "${text}" not found in source`); }
  return engine.createAnchor(text, start, start + text.length, source);
}

/** Helper: build a CommentThread */
function thread(overrides: Partial<CommentThread> = {}): CommentThread {
  return {
    id: overrides.id ?? 'thread-1',
    anchor: overrides.anchor ?? anchorFor('important text'),
    status: overrides.status ?? 'open',
    isDraft: overrides.isDraft ?? false,
    thread: overrides.thread ?? [
      {
        id: 'entry-1',
        author: 'alice',
        body: 'Looks good',
        created: new Date().toISOString(),
        edited: null,
      },
    ],
  };
}

suite('AnchorEngine Test Suite', () => {

  // ── extractContext ────────────────────────────────────────────────

  test('extractContext returns prefix and suffix around selection', () => {
    const engine = new AnchorEngine();
    const text = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz';
    const ctx = engine.extractContext(text, 10, 15);
    assert.strictEqual(ctx.prefix, text.slice(0, 10));
    assert.strictEqual(ctx.suffix, text.slice(15, 55));
  });

  test('extractContext handles start-of-document selection', () => {
    const engine = new AnchorEngine();
    const ctx = engine.extractContext('Hello world', 0, 5);
    assert.strictEqual(ctx.prefix, '');
    assert.strictEqual(ctx.suffix, ' world');
  });

  test('extractContext handles end-of-document selection', () => {
    const engine = new AnchorEngine();
    const ctx = engine.extractContext('Hello world', 6, 11);
    assert.strictEqual(ctx.suffix, '');
    assert.ok(ctx.prefix.length > 0);
  });

  // ── createAnchor ─────────────────────────────────────────────────

  test('createAnchor returns correct selectedText and range', () => {
    const engine = new AnchorEngine();
    const source = 'The quick brown fox jumps over the lazy dog.';
    const anchor = engine.createAnchor('brown fox', 10, 19, source);

    assert.strictEqual(anchor.selectedText, 'brown fox');
    assert.strictEqual(anchor.markdownRange.startOffset, 10);
    assert.strictEqual(anchor.markdownRange.endOffset, 19);
    assert.ok(anchor.textContext.prefix.length > 0);
    assert.ok(anchor.textContext.suffix.length > 0);
  });

  test('createAnchor captures context from markdown source', () => {
    const anchor = anchorFor('important text');
    assert.strictEqual(anchor.selectedText, 'important text');
    assert.ok(anchor.textContext.prefix.length > 0, 'should have prefix context');
    assert.ok(anchor.textContext.suffix.length > 0, 'should have suffix context');
  });

  // ── anchorComment — Strategy 1: exact offset match ───────────────

  test('anchorComment finds text at exact original offsets', () => {
    const engine = new AnchorEngine();
    const anchor = anchorFor('GET /users');
    const result = engine.anchorComment(anchor, SAMPLE_MD);

    assert.ok(result);
    assert.strictEqual(SAMPLE_MD.slice(result!.startOffset, result!.endOffset), 'GET /users');
  });

  // ── anchorComment — Strategy 2: nearby window search ─────────────

  test('anchorComment finds text when offsets shift slightly', () => {
    const engine = new AnchorEngine();
    const anchor = anchorFor('JWT tokens');

    // Insert text before the anchor location to shift offsets
    const edited = SAMPLE_MD.replace('# Introduction', '# Introduction\n\nNew paragraph added here.');
    const result = engine.anchorComment(anchor, edited);

    assert.ok(result, 'Should find text in nearby window');
    assert.strictEqual(edited.slice(result!.startOffset, result!.endOffset), 'JWT tokens');
  });

  // ── anchorComment — Strategy 3: context search ───────────────────

  test('anchorComment finds text via context when far from original position', () => {
    const engine = new AnchorEngine();
    const anchor = anchorFor('JWT tokens');

    // Build a very different document but with the same passage preserved
    const farAway = 'X'.repeat(2000) + '\n\nAuthentication is handled via JWT tokens. Users must provide a valid token.';
    const result = engine.anchorComment(anchor, farAway);

    assert.ok(result, 'Should find text via context concatenation or partial context');
    assert.strictEqual(farAway.slice(result!.startOffset, result!.endOffset), 'JWT tokens');
  });

  // ── anchorComment — Strategy 5: global search ────────────────────

  test('anchorComment falls back to global search when context is gone', () => {
    const engine = new AnchorEngine();
    const anchor: CommentAnchor = {
      selectedText: 'unique phrase xyz',
      textContext: { prefix: 'completely different prefix', suffix: 'completely different suffix' },
      markdownRange: { startOffset: 9999, endOffset: 10016 },
    };

    const source = 'Some content. Then unique phrase xyz appears here.';
    const result = engine.anchorComment(anchor, source);

    assert.ok(result, 'Should find via global search');
    assert.strictEqual(source.slice(result!.startOffset, result!.endOffset), 'unique phrase xyz');
  });

  // ── anchorComment — orphaned ─────────────────────────────────────

  test('anchorComment returns null when text is completely gone', () => {
    const engine = new AnchorEngine();
    const anchor: CommentAnchor = {
      selectedText: 'this text does not exist anywhere',
      textContext: { prefix: 'nope', suffix: 'nope' },
      markdownRange: { startOffset: 0, endOffset: 32 },
    };

    const result = engine.anchorComment(anchor, SAMPLE_MD);
    assert.strictEqual(result, null);
  });

  // ── detectStaleThreads ───────────────────────────────────────────

  test('detectStaleThreads returns empty when all threads match', () => {
    const engine = new AnchorEngine();
    const t = thread({ anchor: anchorFor('important text') });

    const { updates } = engine.detectStaleThreads(SAMPLE_MD, [t]);
    assert.strictEqual(updates.length, 0);
  });

  test('detectStaleThreads marks thread stale when text is removed', () => {
    const engine = new AnchorEngine();
    const t = thread({
      status: 'open',
      anchor: anchorFor('important text'),
    });

    const edited = SAMPLE_MD.replace('important text', 'replaced content');
    const { updates } = engine.detectStaleThreads(edited, [t]);
    assert.strictEqual(updates.length, 1);
    assert.strictEqual(updates[0].newStatus, 'stale');
  });

  test('detectStaleThreads reverts stale to open when text reappears', () => {
    const engine = new AnchorEngine();
    const t = thread({
      status: 'stale',
      anchor: anchorFor('important text'),
    });

    // Text is still there — should revert to open
    const { updates } = engine.detectStaleThreads(SAMPLE_MD, [t]);
    assert.strictEqual(updates.length, 1);
    assert.strictEqual(updates[0].newStatus, 'open');
  });

  test('detectStaleThreads skips resolved threads', () => {
    const engine = new AnchorEngine();
    const t = thread({
      status: 'resolved',
      anchor: anchorFor('important text'),
    });

    const edited = SAMPLE_MD.replace('important text', 'gone');
    const { updates } = engine.detectStaleThreads(edited, [t]);
    assert.strictEqual(updates.length, 0);
  });

  test('detectStaleThreads does not re-report already stale threads', () => {
    const engine = new AnchorEngine();
    const t = thread({
      status: 'stale',
      anchor: {
        selectedText: 'nonexistent text that is not in the document',
        textContext: { prefix: 'nope', suffix: 'nope' },
        markdownRange: { startOffset: 0, endOffset: 44 },
      },
    });

    const { updates } = engine.detectStaleThreads(SAMPLE_MD, [t]);
    assert.strictEqual(updates.length, 0);
  });

  test('detectStaleThreads updates anchor offsets when text moves', () => {
    const engine = new AnchorEngine();
    const t = thread({
      status: 'open',
      anchor: anchorFor('JWT tokens'),
    });
    const originalStart = t.anchor.markdownRange.startOffset;

    // Insert text before JWT tokens to shift offsets
    const edited = SAMPLE_MD.replace('# Introduction', '# Introduction\n\nExtra paragraph.');
    const { updates, anchorsMoved } = engine.detectStaleThreads(edited, [t]);

    // Thread should still be found (no stale update)
    assert.strictEqual(updates.length, 0);
    // Anchors should have moved
    assert.strictEqual(anchorsMoved, true);
    // Offsets should have been updated in-place
    assert.notStrictEqual(t.anchor.markdownRange.startOffset, originalStart);
    assert.strictEqual(edited.slice(t.anchor.markdownRange.startOffset, t.anchor.markdownRange.endOffset), 'JWT tokens');
  });

  test('detectStaleThreads handles multiple threads with mixed states', () => {
    const engine = new AnchorEngine();

    const threads = [
      // open, text present → no update
      thread({ id: 't1', status: 'open', anchor: anchorFor('GET /users') }),
      // open, text will be removed → stale
      thread({ id: 't2', status: 'open', anchor: anchorFor('JWT tokens') }),
      // resolved, text removed → skip (resolved)
      thread({ id: 't3', status: 'resolved', anchor: anchorFor('important text') }),
      // stale, text present → open
      thread({ id: 't4', status: 'stale', anchor: anchorFor('GET /users') }),
    ];

    const edited = SAMPLE_MD.replace('JWT tokens', 'OAuth2 tokens').replace('important text', 'crucial info');
    const { updates } = engine.detectStaleThreads(edited, threads);

    const t2Update = updates.find(u => u.thread.id === 't2');
    assert.ok(t2Update);
    assert.strictEqual(t2Update!.newStatus, 'stale');

    const t4Update = updates.find(u => u.thread.id === 't4');
    assert.ok(t4Update);
    assert.strictEqual(t4Update!.newStatus, 'open');

    // t1 and t3 should not appear in updates
    assert.ok(!updates.find(u => u.thread.id === 't1'));
    assert.ok(!updates.find(u => u.thread.id === 't3'));
  });

  // ── Duplicate text handling ──────────────────────────────────────

  test('anchorComment picks nearest match for duplicate text in window search', () => {
    const engine = new AnchorEngine();
    // Source with "the" appearing multiple times
    const source = 'AAA the BBB CCC the DDD EEE the FFF';
    // Anchor originally pointed to second "the" at offset 16
    const anchor = engine.createAnchor('the', 16, 19, source);

    // Shift content so original offset is wrong but text is still nearby
    const edited = 'XX AAA the BBB CCC the DDD EEE the FFF';
    const result = engine.anchorComment(anchor, edited);
    assert.ok(result);
    // Should pick the occurrence nearest to original offset (the second "the" at 19)
    assert.strictEqual(edited.slice(result!.startOffset, result!.endOffset), 'the');
    // The nearest "the" to offset 16 should be around 19 (shifted by 3), not 7
    assert.ok(result!.startOffset > 10, `Expected nearest match, got offset ${result!.startOffset}`);
  });

  // ── anchorsMoved flag ────────────────────────────────────────────

  test('detectStaleThreads reports anchorsMoved=false when nothing changes', () => {
    const engine = new AnchorEngine();
    const t = thread({ anchor: anchorFor('important text') });

    const { anchorsMoved } = engine.detectStaleThreads(SAMPLE_MD, [t]);
    assert.strictEqual(anchorsMoved, false);
  });

  // ── CRLF normalization ───────────────────────────────────────────

  test('anchorComment works with CRLF line endings', () => {
    const engine = new AnchorEngine();
    const lfSource = 'Line one\nLine two\nLine three';
    const anchor = engine.createAnchor('Line two', 9, 17, lfSource);

    // Same content but with CRLF — after normalization offsets may differ
    // but the text should still be found
    const crlfSource = 'Line one\r\nLine two\r\nLine three';
    const result = engine.anchorComment(anchor, crlfSource);
    assert.ok(result, 'Should find text despite CRLF');
    assert.strictEqual(crlfSource.slice(result!.startOffset, result!.endOffset), 'Line two');
  });
});
