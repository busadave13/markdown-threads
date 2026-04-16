import * as assert from 'assert';
import * as path from 'path';
import {
  isSpecitDocument,
  parseSpecitHeader,
  updateSpecitField,
  stripSpecitBlockquote,
  inferSpecitDocType,
  specitDocTypeLabel,
  resolveInternalDocLink,
} from '../../utils/specit';

suite('SPECIT Utility Test Suite', () => {

  // ─── isSpecitDocument ───

  suite('isSpecitDocument', () => {
    test('returns true for standard marker', () => {
      assert.strictEqual(isSpecitDocument('<!-- SPECIT -->\n\n# Title'), true);
    });

    test('returns true for marker with extra whitespace', () => {
      assert.strictEqual(isSpecitDocument('<!--  SPECIT  -->\n# Title'), true);
    });

    test('returns true for lowercase marker', () => {
      assert.strictEqual(isSpecitDocument('<!-- specit -->\n# Title'), true);
    });

    test('returns true for mixed case marker', () => {
      assert.strictEqual(isSpecitDocument('<!-- SpecIt -->\n# Title'), true);
    });

    test('returns false when marker is missing', () => {
      assert.strictEqual(isSpecitDocument('# Title\n\nSome content'), false);
    });

    test('returns false when marker is not on first line', () => {
      assert.strictEqual(isSpecitDocument('\n<!-- SPECIT -->\n# Title'), false);
    });

    test('returns false for empty string', () => {
      assert.strictEqual(isSpecitDocument(''), false);
    });

    test('handles CRLF line endings', () => {
      assert.strictEqual(isSpecitDocument('<!-- SPECIT -->\r\n\r\n# Title'), true);
    });
  });

  // ─── parseSpecitHeader ───

  suite('parseSpecitHeader', () => {
    const sampleDoc = [
      '<!-- SPECIT -->',
      '',
      '# Product Requirements Document',
      '',
      '> **Version**: 1.0<br>',
      '> **Created**: 2026-04-01<br>',
      '> **Last Updated**: 2026-04-12<br>',
      '> **Owner**: Dave Harding<br>',
      '> **Project**: Mockery<br>',
      '> **Status**: Draft',
      '',
      '---',
    ].join('\n');

    test('parses all fields from blockquote header', () => {
      const result = parseSpecitHeader(sampleDoc);
      assert.ok(result);
      assert.strictEqual(result.fields['Version'], '1.0');
      assert.strictEqual(result.fields['Created'], '2026-04-01');
      assert.strictEqual(result.fields['Last Updated'], '2026-04-12');
      assert.strictEqual(result.fields['Owner'], 'Dave Harding');
      assert.strictEqual(result.fields['Project'], 'Mockery');
      assert.strictEqual(result.fields['Status'], 'Draft');
    });

    test('returns correct blockquote line range', () => {
      const result = parseSpecitHeader(sampleDoc);
      assert.ok(result);
      assert.strictEqual(result.blockquoteStartLine, 4);
      assert.strictEqual(result.blockquoteEndLine, 10);
    });

    test('returns null for non-SPECIT document', () => {
      assert.strictEqual(parseSpecitHeader('# Regular Doc\n\nContent'), null);
    });

    test('returns null when no blockquote exists', () => {
      const doc = '<!-- SPECIT -->\n\n# Title\n\nJust content';
      assert.strictEqual(parseSpecitHeader(doc), null);
    });

    test('handles CRLF line endings', () => {
      const crlfDoc = sampleDoc.replace(/\n/g, '\r\n');
      const result = parseSpecitHeader(crlfDoc);
      assert.ok(result);
      assert.strictEqual(result.fields['Version'], '1.0');
      assert.strictEqual(result.fields['Status'], 'Draft');
    });

    test('handles last line without <br>', () => {
      const result = parseSpecitHeader(sampleDoc);
      assert.ok(result);
      assert.strictEqual(result.fields['Status'], 'Draft');
    });
  });

  // ─── updateSpecitField ───

  suite('updateSpecitField', () => {
    const sampleDoc = [
      '<!-- SPECIT -->',
      '',
      '# Title',
      '',
      '> **Version**: 1.0<br>',
      '> **Last Updated**: 2026-04-12<br>',
      '> **Owner**: Dave<br>',
      '> **Status**: Draft',
      '',
      '---',
    ].join('\n');

    test('updates a field value', () => {
      const updated = updateSpecitField(sampleDoc, 'Owner', 'Alice');
      assert.ok(updated.includes('> **Owner**: Alice<br>'));
    });

    test('auto-updates Last Updated when changing another field', () => {
      const updated = updateSpecitField(sampleDoc, 'Owner', 'Alice');
      const today = new Date().toISOString().slice(0, 10);
      assert.ok(updated.includes(`> **Last Updated**: ${today}<br>`));
    });

    test('does not auto-update Last Updated when changing Last Updated itself', () => {
      const updated = updateSpecitField(sampleDoc, 'Last Updated', '2099-01-01');
      assert.ok(updated.includes('> **Last Updated**: 2099-01-01<br>'));
    });

    test('returns original content when field not found', () => {
      const updated = updateSpecitField(sampleDoc, 'NonExistent', 'value');
      assert.strictEqual(updated, sampleDoc);
    });

    test('handles CRLF input', () => {
      const crlfDoc = sampleDoc.replace(/\n/g, '\r\n');
      const updated = updateSpecitField(crlfDoc, 'Version', '2.0');
      assert.ok(updated.includes('> **Version**: 2.0<br>'));
    });

    test('updates Status field', () => {
      const updated = updateSpecitField(sampleDoc, 'Status', 'Approved');
      assert.ok(updated.includes('> **Status**: Approved'));
    });
  });

  // ─── stripSpecitBlockquote ───

  suite('stripSpecitBlockquote', () => {
    test('removes blockquote lines from document', () => {
      const doc = [
        '<!-- SPECIT -->',
        '',
        '# Title',
        '',
        '> **Version**: 1.0<br>',
        '> **Status**: Draft',
        '',
        '---',
        'Content',
      ].join('\n');
      const header = parseSpecitHeader(doc);
      assert.ok(header);
      const stripped = stripSpecitBlockquote(doc, header);
      assert.ok(!stripped.includes('> **Version**'));
      assert.ok(!stripped.includes('> **Status**'));
      assert.ok(stripped.includes('# Title'));
      assert.ok(stripped.includes('Content'));
    });
  });

  // ─── inferSpecitDocType ───

  suite('inferSpecitDocType', () => {
    test('identifies PRD', () => {
      assert.strictEqual(inferSpecitDocType(path.join('project', 'PRD.md')), 'PRD');
    });

    test('identifies Architecture', () => {
      assert.strictEqual(inferSpecitDocType(path.join('project', 'ARCHITECTURE.md')), 'Architecture');
    });

    test('identifies ADR by directory', () => {
      assert.strictEqual(inferSpecitDocType(path.join('adr', 'ADR-001.md')), 'ADR');
    });

    test('identifies Feature by directory', () => {
      assert.strictEqual(inferSpecitDocType(path.join('feature', 'FEAT-001-login.md')), 'Feature');
    });

    test('returns Other for unknown type', () => {
      assert.strictEqual(inferSpecitDocType(path.join('docs', 'random.md')), 'Other');
    });
  });

  // ─── specitDocTypeLabel ───

  suite('specitDocTypeLabel', () => {
    test('returns full label for PRD', () => {
      assert.strictEqual(specitDocTypeLabel('PRD'), 'Product Requirements Document');
    });

    test('returns full label for Architecture', () => {
      assert.strictEqual(specitDocTypeLabel('Architecture'), 'Architecture Document');
    });

    test('returns full label for ADR', () => {
      assert.strictEqual(specitDocTypeLabel('ADR'), 'Architecture Decision Record');
    });

    test('returns full label for Feature', () => {
      assert.strictEqual(specitDocTypeLabel('Feature'), 'Feature Spec');
    });

    test('returns empty string for Other', () => {
      assert.strictEqual(specitDocTypeLabel('Other'), '');
    });
  });

  // ─── resolveInternalDocLink ───

  suite('resolveInternalDocLink', () => {
    const workspaceRoot = path.resolve(path.sep, 'workspace', 'project');
    const docsDir = path.join(workspaceRoot, '.docs');
    const currentDoc = path.join(docsDir, 'feature', 'FEAT-001-login.md');

    test('resolves a sibling .md file', () => {
      const result = resolveInternalDocLink(currentDoc, 'FEAT-002-auth.md', workspaceRoot);
      assert.ok(result);
      assert.strictEqual(result.filePath, path.join(docsDir, 'feature', 'FEAT-002-auth.md'));
      assert.strictEqual(result.fragment, null);
    });

    test('resolves a parent-relative path (../)', () => {
      const result = resolveInternalDocLink(currentDoc, '../PRD.md', workspaceRoot);
      assert.ok(result);
      assert.strictEqual(result.filePath, path.join(docsDir, 'PRD.md'));
      assert.strictEqual(result.fragment, null);
    });

    test('resolves with ./ prefix', () => {
      const result = resolveInternalDocLink(currentDoc, './FEAT-003.md', workspaceRoot);
      assert.ok(result);
      assert.strictEqual(result.filePath, path.join(docsDir, 'feature', 'FEAT-003.md'));
    });

    test('resolves path with fragment', () => {
      const result = resolveInternalDocLink(currentDoc, '../ARCHITECTURE.md#overview', workspaceRoot);
      assert.ok(result);
      assert.strictEqual(result.filePath, path.join(docsDir, 'ARCHITECTURE.md'));
      assert.strictEqual(result.fragment, 'overview');
    });

    test('returns null for empty href', () => {
      assert.strictEqual(resolveInternalDocLink(currentDoc, '', workspaceRoot), null);
    });

    test('returns null for anchor-only fragment', () => {
      assert.strictEqual(resolveInternalDocLink(currentDoc, '#section', workspaceRoot), null);
    });

    test('returns null for external http link', () => {
      assert.strictEqual(resolveInternalDocLink(currentDoc, 'https://example.com/doc.md', workspaceRoot), null);
    });

    test('returns null for mailto link', () => {
      assert.strictEqual(resolveInternalDocLink(currentDoc, 'mailto:test@example.com', workspaceRoot), null);
    });

    test('returns null for non-.md file', () => {
      assert.strictEqual(resolveInternalDocLink(currentDoc, '../image.png', workspaceRoot), null);
    });

    test('returns null for path escaping workspace root', () => {
      const result = resolveInternalDocLink(currentDoc, '../../../outside.md', workspaceRoot);
      assert.strictEqual(result, null);
    });

    test('handles URL-encoded paths', () => {
      const result = resolveInternalDocLink(currentDoc, 'My%20Document.md', workspaceRoot);
      assert.ok(result);
      assert.strictEqual(result.filePath, path.join(docsDir, 'feature', 'My Document.md'));
    });

    test('handles uppercase .MD extension', () => {
      const result = resolveInternalDocLink(currentDoc, '../README.MD', workspaceRoot);
      assert.ok(result);
      assert.strictEqual(result.filePath, path.join(docsDir, 'README.MD'));
    });

    test('returns null for data: protocol', () => {
      assert.strictEqual(resolveInternalDocLink(currentDoc, 'data:text/html,test', workspaceRoot), null);
    });

    test('returns null for vscode- protocol', () => {
      assert.strictEqual(resolveInternalDocLink(currentDoc, 'vscode-resource://file.md', workspaceRoot), null);
    });

    test('returns null for invalid URL encoding', () => {
      assert.strictEqual(resolveInternalDocLink(currentDoc, '%ZZbad.md', workspaceRoot), null);
    });

    test('fragment with empty file part returns null', () => {
      // "#frag" with no file part is anchor-only
      assert.strictEqual(resolveInternalDocLink(currentDoc, '#heading', workspaceRoot), null);
    });

    test('resolves doc at workspace root boundary', () => {
      const rootDoc = path.join(workspaceRoot, 'README.md');
      const result = resolveInternalDocLink(rootDoc, 'docs.md', workspaceRoot);
      assert.ok(result);
      assert.strictEqual(result.filePath, path.join(workspaceRoot, 'docs.md'));
    });
  });
});
