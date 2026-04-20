import * as assert from 'assert';
import { parseMarkdownSections, findSectionBySlug, findSectionByLine, hasContentDrifted, findSelectionInRawMarkdown, stripMarkdownPreservingMap } from '../../utils/markdown';

suite('Markdown Utils Test Suite', () => {
  test('parseMarkdownSections extracts sections correctly', () => {
    const markdown = `# Introduction

This is the introduction.

## Authentication Flow

The auth flow works like this...

## API Endpoints

Here are the endpoints.

### GET /users

Returns all users.
`;

    const sections = parseMarkdownSections(markdown);
    
    assert.strictEqual(sections.length, 4);
    
    assert.strictEqual(sections[0].heading, 'Introduction');
    assert.strictEqual(sections[0].slug, 'introduction');
    assert.strictEqual(sections[0].level, 1);
    
    assert.strictEqual(sections[1].heading, 'Authentication Flow');
    assert.strictEqual(sections[1].slug, 'authentication-flow');
    assert.strictEqual(sections[1].level, 2);
    
    assert.strictEqual(sections[2].heading, 'API Endpoints');
    assert.strictEqual(sections[2].slug, 'api-endpoints');
    assert.strictEqual(sections[2].level, 2);
    
    assert.strictEqual(sections[3].heading, 'GET /users');
    assert.strictEqual(sections[3].slug, 'get-users');
    assert.strictEqual(sections[3].level, 3);
  });

  test('parseMarkdownSections handles empty document', () => {
    const sections = parseMarkdownSections('');
    assert.strictEqual(sections.length, 0);
  });

  test('parseMarkdownSections handles document without headings', () => {
    const markdown = `Just some text here.

No headings at all.`;
    
    const sections = parseMarkdownSections(markdown);
    assert.strictEqual(sections.length, 0);
  });

  test('findSectionBySlug finds correct section', () => {
    const markdown = `# First

Content

## Second

More content`;

    const sections = parseMarkdownSections(markdown);
    
    const found = findSectionBySlug(sections, 'second');
    assert.ok(found);
    assert.strictEqual(found.heading, 'Second');
    
    const notFound = findSectionBySlug(sections, 'nonexistent');
    assert.strictEqual(notFound, undefined);
  });

  test('hasContentDrifted detects changes', () => {
    const markdown = `# Test Section

Original content here.`;

    const sections = parseMarkdownSections(markdown);
    const originalHash = sections[0].contentHash;
    
    // Same hash should not be drifted
    assert.strictEqual(hasContentDrifted(sections[0], originalHash), false);
    
    // Different hash should be drifted
    assert.strictEqual(hasContentDrifted(sections[0], 'different-hash'), true);
  });

  test('parseMarkdownSections calculates content hashes', () => {
    const markdown = `# Section One

Content for section one.

# Section Two

Content for section two.`;

    const sections = parseMarkdownSections(markdown);
    
    // Each section should have a content hash
    assert.ok(sections[0].contentHash);
    assert.ok(sections[1].contentHash);
    
    // Different content should have different hashes
    assert.notStrictEqual(sections[0].contentHash, sections[1].contentHash);
  });

  test('parseMarkdownSections ignores headings inside fenced code blocks', () => {
    const markdown = `# Real Heading

Some content.

\`\`\`markdown
# This is inside a code block
## Also inside
\`\`\`

## Another Real Heading

More content.

~~~python
# A python comment that looks like a heading
~~~
`;

    const sections = parseMarkdownSections(markdown);
    
    assert.strictEqual(sections.length, 2);
    assert.strictEqual(sections[0].heading, 'Real Heading');
    assert.strictEqual(sections[1].heading, 'Another Real Heading');
  });

  test('findSectionByLine returns section containing the line', () => {
    const markdown = `# Intro

Intro content line 1.
Intro content line 2.

## Details

Details content.

## Conclusion

Conclusion content.`;

    const sections = parseMarkdownSections(markdown);
    // Sections: Intro (0-4), Details (5-8), Conclusion (9-11)

    // Heading line itself
    const s0 = findSectionByLine(sections, 0);
    assert.ok(s0);
    assert.strictEqual(s0!.heading, 'Intro');

    // Content inside first section
    const s2 = findSectionByLine(sections, 2);
    assert.ok(s2);
    assert.strictEqual(s2!.heading, 'Intro');

    // Line right before next heading
    const s4 = findSectionByLine(sections, 4);
    assert.ok(s4);
    assert.strictEqual(s4!.heading, 'Intro');

    // Second section heading
    const s5 = findSectionByLine(sections, 5);
    assert.ok(s5);
    assert.strictEqual(s5!.heading, 'Details');

    // Content line in second section
    const s7 = findSectionByLine(sections, 7);
    assert.ok(s7);
    assert.strictEqual(s7!.heading, 'Details');

    // Last section
    const s11 = findSectionByLine(sections, 11);
    assert.ok(s11);
    assert.strictEqual(s11!.heading, 'Conclusion');
  });

  test('findSectionByLine returns undefined for line before any section', () => {
    const sections = parseMarkdownSections('# Only heading');
    const result = findSectionByLine(sections, 99);
    assert.strictEqual(result, undefined);
  });

  test('findSectionByLine returns undefined for empty sections list', () => {
    assert.strictEqual(findSectionByLine([], 0), undefined);
  });
});

suite('findSelectionInRawMarkdown Test Suite', () => {
  test('exact match returns correct start and text', () => {
    const raw = '# Title\n\nSome paragraph text here.';
    const result = findSelectionInRawMarkdown('paragraph text', raw, 10);
    assert.ok(result);
    assert.strictEqual(result!.text, 'paragraph text');
    assert.strictEqual(result!.start, raw.indexOf('paragraph text'));
  });

  test('exact match prefers occurrence nearest contentOffset', () => {
    const raw = 'hello world\nhello world';
    const result = findSelectionInRawMarkdown('hello world', raw, 12);
    assert.ok(result);
    assert.strictEqual(result!.start, 12); // second occurrence
  });

  test('matches text across unordered list items with dash markers', () => {
    const raw = '# Goals\n\n- Reduce startup overhead\n- Remove hand-maintained stubs';
    const selected = 'Reduce startup overhead\nRemove hand-maintained stubs';
    const result = findSelectionInRawMarkdown(selected, raw, 0);
    assert.ok(result);
    assert.strictEqual(result!.text, 'Reduce startup overhead\n- Remove hand-maintained stubs');
    assert.strictEqual(result!.start, raw.indexOf('Reduce'));
  });

  test('matches text across unordered list items with asterisk markers', () => {
    const raw = '* Item A\n* Item B';
    const selected = 'Item A\nItem B';
    const result = findSelectionInRawMarkdown(selected, raw, 0);
    assert.ok(result);
    assert.strictEqual(result!.text, 'Item A\n* Item B');
    assert.strictEqual(result!.start, raw.indexOf('Item A'));
  });

  test('matches text across ordered list items', () => {
    const raw = '1. First step\n2. Second step\n3. Third step';
    const selected = 'First step\nSecond step\nThird step';
    const result = findSelectionInRawMarkdown(selected, raw, 0);
    assert.ok(result);
    assert.strictEqual(result!.text, 'First step\n2. Second step\n3. Third step');
    assert.strictEqual(result!.start, raw.indexOf('First step'));
  });

  test('matches text across blockquote lines', () => {
    const raw = '> Line one\n> Line two';
    const selected = 'Line one\nLine two';
    const result = findSelectionInRawMarkdown(selected, raw, 0);
    assert.ok(result);
    assert.strictEqual(result!.text, 'Line one\n> Line two');
    assert.strictEqual(result!.start, raw.indexOf('Line one'));
  });

  test('matches text with indented list markers', () => {
    const raw = '  - Nested A\n  - Nested B';
    const selected = 'Nested A\nNested B';
    const result = findSelectionInRawMarkdown(selected, raw, 0);
    assert.ok(result);
    assert.strictEqual(result!.text, 'Nested A\n  - Nested B');
    assert.strictEqual(result!.start, raw.indexOf('Nested A'));
  });

  test('returns null when text is not found at all', () => {
    const raw = '# Title\n\nSome content.';
    const result = findSelectionInRawMarkdown('nonexistent text', raw, 0);
    assert.strictEqual(result, null);
  });

  test('returns null for empty selected text', () => {
    const raw = '# Title\n\nContent.';
    const result = findSelectionInRawMarkdown('', raw, 0);
    assert.strictEqual(result, null);
  });

  test('handles special regex characters in selected text', () => {
    const raw = '- Use regex (.*) pattern\n- Check {brackets}';
    const selected = 'Use regex (.*) pattern\nCheck {brackets}';
    const result = findSelectionInRawMarkdown(selected, raw, 0);
    assert.ok(result);
    assert.strictEqual(result!.text, 'Use regex (.*) pattern\n- Check {brackets}');
  });

  test('single line in a list still uses exact match', () => {
    const raw = '- Single item in a list';
    // Selecting text within a single list item — this text appears verbatim
    const result = findSelectionInRawMarkdown('Single item in a list', raw, 0);
    assert.ok(result);
    assert.strictEqual(result!.text, 'Single item in a list');
  });

  test('fallback prefers match nearest contentOffset', () => {
    const raw = '- Alpha\n- Beta\n\n- Alpha\n- Beta';
    const selected = 'Alpha\nBeta';
    const result = findSelectionInRawMarkdown(selected, raw, 20);
    assert.ok(result);
    // Should prefer the second occurrence (closer to offset 20)
    assert.ok(result!.start > 10, 'should match second occurrence');
  });

  test('matches selection across bolded numbered list items (Goals scenario)', () => {
    const raw = [
      '## Goals',
      '',
      '1. **Rich preview experience** \u2014 Purpose-built WebView sidebar for commenting on markdown sections',
      '2. **Git-native storage** \u2014 All comments stored as JSON files in the repository',
      '3. **Stable anchoring** \u2014 Comments survive document edits when possible',
    ].join('\n');
    const selected = [
      'Rich preview experience \u2014 Purpose-built WebView sidebar for commenting on markdown sections',
      'Git-native storage \u2014 All comments stored as JSON files in the repository',
      'Stable anchoring \u2014 Comments survive document edits when possible',
    ].join('\n');
    const result = findSelectionInRawMarkdown(selected, raw, 0);
    assert.ok(result, 'expected to anchor across bolded list items');
    assert.strictEqual(result!.start, raw.indexOf('Rich preview'));
  });

  test('matches selection inside a single bold span', () => {
    const raw = 'Lead in **highlighted phrase** trailing words.';
    const result = findSelectionInRawMarkdown('highlighted phrase', raw, 0);
    assert.ok(result);
    assert.strictEqual(result!.start, raw.indexOf('highlighted phrase'));
    assert.strictEqual(result!.text, 'highlighted phrase');
  });

  test('matches selection that crosses out of a bold span', () => {
    const raw = 'Lead in **highlighted phrase** trailing words.';
    const result = findSelectionInRawMarkdown('phrase trailing', raw, 0);
    assert.ok(result);
    assert.strictEqual(result!.start, raw.indexOf('phrase'));
    // Raw substring includes the closing ** between the two visible tokens.
    assert.strictEqual(result!.text, 'phrase** trailing');
  });

  test('matches selection containing italic with underscores', () => {
    const raw = 'plain _italicized text_ continues';
    const result = findSelectionInRawMarkdown('italicized text', raw, 0);
    assert.ok(result);
    assert.strictEqual(result!.text, 'italicized text');
  });

  test('matches selection containing inline code', () => {
    const raw = 'Use the `simple-git` library here.';
    const result = findSelectionInRawMarkdown('simple-git', raw, 0);
    assert.ok(result);
    assert.strictEqual(result!.text, 'simple-git');
  });

  test('matches selection that strips a markdown link wrapper', () => {
    const raw = 'See [the spec](https://example.com/spec) for details.';
    const result = findSelectionInRawMarkdown('the spec for details', raw, 0);
    assert.ok(result);
    assert.strictEqual(result!.start, raw.indexOf('the spec'));
  });

  test('matches selection containing image alt text', () => {
    const raw = 'Logo: ![Alt label](https://example.com/img.png) end.';
    const result = findSelectionInRawMarkdown('Logo: Alt label end.', raw, 0);
    assert.ok(result);
  });

  test('matches selection containing escaped markdown chars', () => {
    const raw = 'Literal \\*not bold\\* here.';
    const result = findSelectionInRawMarkdown('Literal *not bold* here.', raw, 0);
    assert.ok(result);
  });

  test('does not strip markdown chars inside a fenced code block', () => {
    const raw = [
      'Before fence.',
      '```ts',
      'const x = "**not bold**";',
      '```',
      'After fence.',
    ].join('\n');
    // The selection comes from rendered text where the code block keeps its
    // contents verbatim; selecting the line should still match exactly.
    const result = findSelectionInRawMarkdown('const x = "**not bold**";', raw, 0);
    assert.ok(result);
    assert.strictEqual(result!.text, 'const x = "**not bold**";');
  });

  test('matches selection that spans paragraphs separated by blank lines', () => {
    const raw = 'First paragraph here.\n\nSecond paragraph here.';
    // Selection.toString() in browsers typically uses single \n at block boundaries
    const selected = 'First paragraph here.\nSecond paragraph here.';
    const result = findSelectionInRawMarkdown(selected, raw, 0);
    assert.ok(result, 'expected to anchor across paragraph boundary');
    assert.strictEqual(result!.start, 0);
  });

  test('matches large selection spanning headings, paragraphs, and lists (Problem Statement scenario)', () => {
    const raw = [
      '## Problem Statement',
      '',
      'Markdown files checked into Git repositories lack a native review mechanism comparable to code review. Teams resort to:',
      '',
      '- Google Docs or Confluence (loses version control benefits)',
      '- PR comments on the entire file (no inline anchoring)',
      '- Manual editing of markdown with inline comments (messy, no threading)',
      '',
      'This extension bridges the gap by providing inline, threaded comments anchored to specific sections of markdown documents, with all data stored in Git.',
      '',
      '## Goals',
      '',
      '1. **Rich preview experience** \u2014 Purpose-built WebView sidebar for commenting on markdown sections',
      '2. **Git-native storage** \u2014 All comments stored as JSON files in the repository',
      '',
      '## Architecture',
    ].join('\n');
    // Browser-style selection: single \n between block elements, no blank lines,
    // no list markers, no bold delimiters.
    const selected = [
      'Problem Statement',
      'Markdown files checked into Git repositories lack a native review mechanism comparable to code review. Teams resort to:',
      'Google Docs or Confluence (loses version control benefits)',
      'PR comments on the entire file (no inline anchoring)',
      'Manual editing of markdown with inline comments (messy, no threading)',
      'This extension bridges the gap by providing inline, threaded comments anchored to specific sections of markdown documents, with all data stored in Git.',
      'Goals',
      'Rich preview experience \u2014 Purpose-built WebView sidebar for commenting on markdown sections',
      'Git-native storage \u2014 All comments stored as JSON files in the repository',
      'Architecture',
    ].join('\n');
    const result = findSelectionInRawMarkdown(selected, raw, 0);
    assert.ok(result, 'expected to anchor large multi-block selection');
    assert.strictEqual(result!.start, raw.indexOf('Problem Statement'));
  });

  test('matches selection across markdown table rows (Component table scenario)', () => {
    const raw = [
      '| Component | Responsibility |',
      '|-----------|----------------|',
      '| extension.ts | Activation, command registration, explorer context menu handling |',
      '| sidecarManager.ts | Read/write .comments.json files, change event bus with WriteOrigin tagging |',
      '| anchorEngine.ts | Markdown parsing, section detection, hash computation, stale detection |',
    ].join('\n');
    // Browser-style table selection: cells separated by \t, rows by \n,
    // separator row omitted, no surrounding pipes.
    const selected = [
      'Component\tResponsibility',
      'extension.ts\tActivation, command registration, explorer context menu handling',
      'sidecarManager.ts\tRead/write .comments.json files, change event bus with WriteOrigin tagging',
      'anchorEngine.ts\tMarkdown parsing, section detection, hash computation, stale detection',
    ].join('\n');
    const result = findSelectionInRawMarkdown(selected, raw, 0);
    assert.ok(result, 'expected to anchor across markdown table rows');
    assert.strictEqual(result!.start, raw.indexOf('Component'));
  });

  test('matches selection that spans across a fenced code block', () => {
    const raw = [
      'Before the fence.',
      '',
      '```typescript',
      '// In previewPanel \u2014 skip own writes:',
      'sidecarManager.onDidChange((e) => {',
      '  if (e.origin === \'preview\') return;',
      '  this.update();',
      '});',
      '```',
      '',
      'After the fence.',
    ].join('\n');
    // Browser selection: no fence markers, paragraphs collapsed to single \n.
    const selected = [
      'Before the fence.',
      '// In previewPanel \u2014 skip own writes:',
      'sidecarManager.onDidChange((e) => {',
      '  if (e.origin === \'preview\') return;',
      '  this.update();',
      '});',
      'After the fence.',
    ].join('\n');
    const result = findSelectionInRawMarkdown(selected, raw, 0);
    assert.ok(result, 'expected to anchor selection across a fenced code block');
    assert.strictEqual(result!.start, raw.indexOf('Before the fence.'));
  });

  test('preserves literal | inside inline code (union type scenario)', () => {
    const raw = [
      '1. Every `writeSidecar()` call passes a `WriteOrigin` (`\'preview\'` | `\'internal\'`)',
      '2. After a successful write, `SidecarManager` fires `onDidChange({ docPath, origin })`',
      '3. The preview panel listens for changes and skips reloads when `origin === \'preview\'` to avoid echo loops',
    ].join('\n');
    const selected = [
      'Every writeSidecar() call passes a WriteOrigin (\'preview\' | \'internal\')',
      'After a successful write, SidecarManager fires onDidChange({ docPath, origin })',
      'The preview panel listens for changes and skips reloads when origin === \'preview\' to avoid echo loops',
    ].join('\n');
    const result = findSelectionInRawMarkdown(selected, raw, 0);
    assert.ok(result, 'expected to anchor selection containing literal pipe in inline code');
    assert.strictEqual(result!.start, raw.indexOf('Every'));
  });
});

suite('stripMarkdownPreservingMap Test Suite', () => {
  test('strips bold delimiters and maps back to raw offsets', () => {
    const raw = '**bold**';
    const { stripped, map } = stripMarkdownPreservingMap(raw);
    assert.strictEqual(stripped, 'bold');
    assert.strictEqual(map[0], 2);
    assert.strictEqual(map[3], 5);
  });

  test('strips list marker but keeps the rest of the line', () => {
    const raw = '- hello';
    const { stripped, map } = stripMarkdownPreservingMap(raw);
    assert.strictEqual(stripped, 'hello');
    assert.strictEqual(map[0], 2);
  });

  test('preserves code block contents verbatim and drops fence lines', () => {
    const raw = '```\n**x**\n```';
    const { stripped } = stripMarkdownPreservingMap(raw);
    assert.ok(stripped.includes('**x**'), 'inner code content preserved');
    assert.ok(!stripped.includes('```'), 'fence markers should be dropped');
  });

  test('skips table separator row in stripped output', () => {
    const raw = '| A | B |\n|---|---|\n| 1 | 2 |';
    const { stripped } = stripMarkdownPreservingMap(raw);
    assert.ok(!stripped.includes('---'), 'separator row should be skipped');
    assert.ok(stripped.includes('A'));
    assert.ok(stripped.includes('1'));
  });
});
