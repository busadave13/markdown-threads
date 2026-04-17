import * as assert from 'assert';
import * as path from 'path';
import { resolveInternalDocLink } from '../../utils/docLinks';

suite('docLinks Utility Test Suite', () => {

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
