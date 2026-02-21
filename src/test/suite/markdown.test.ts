import * as assert from 'assert';
import { parseMarkdownSections, findSectionBySlug, findSectionByLine, hasContentDrifted } from '../../utils/markdown';

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
