import * as assert from 'assert';
import * as path from 'path';
import {
  buildExcludePattern,
  buildNestedTree,
  NestedFolderNode,
  NestedNode,
} from '../../markdownFilesProvider';

function isFolder(node: NestedNode): node is NestedFolderNode {
  return node.kind === 'folder';
}

function findFolder(nodes: NestedNode[], name: string): NestedFolderNode {
  const match = nodes.find(n => isFolder(n) && n.name === name);
  assert.ok(match, `Expected folder "${name}" in ${nodes.map(n => n.name).join(', ')}`);
  return match as NestedFolderNode;
}

suite('buildExcludePattern Test Suite', () => {
  test('returns undefined for empty array', () => {
    assert.strictEqual(buildExcludePattern([]), undefined);
  });

  test('returns undefined for array of empty strings', () => {
    assert.strictEqual(buildExcludePattern(['', '']), undefined);
  });

  test('returns single glob for one folder', () => {
    assert.strictEqual(buildExcludePattern(['node_modules']), '**/node_modules/**');
  });

  test('returns brace-expanded glob for multiple folders', () => {
    const result = buildExcludePattern(['node_modules', '.github']);
    assert.strictEqual(result, '{**/node_modules/**,**/.github/**}');
  });

  test('filters out empty strings from input', () => {
    const result = buildExcludePattern(['', 'node_modules', '', '.github']);
    assert.strictEqual(result, '{**/node_modules/**,**/.github/**}');
  });

  test('handles all default excluded folders', () => {
    const defaults = ['node_modules', '.github', '.git', 'out', 'dist', 'bin', 'obj', '.vscode'];
    const result = buildExcludePattern(defaults);
    assert.ok(result);
    assert.ok(result.startsWith('{'));
    assert.ok(result.endsWith('}'));
    for (const folder of defaults) {
      assert.ok(result.includes(`**/${folder}/**`), `Pattern should include ${folder}`);
    }
  });

  test('handles single folder after filtering empties', () => {
    const result = buildExcludePattern(['', 'dist', '']);
    assert.strictEqual(result, '**/dist/**');
  });
});

suite('buildNestedTree Test Suite', () => {
  test('returns empty array for no entries', () => {
    assert.deepStrictEqual(buildNestedTree([]), []);
  });

  test('places a single root-level file as a leaf', () => {
    const tree = buildNestedTree([{ relativePath: 'README.md', payload: 1 }]);
    assert.strictEqual(tree.length, 1);
    assert.strictEqual(tree[0].kind, 'file');
    assert.strictEqual(tree[0].name, 'README.md');
    assert.strictEqual((tree[0] as { payload: number }).payload, 1);
  });

  test('builds a single folder containing one file', () => {
    const tree = buildNestedTree([
      { relativePath: path.join('docs', 'guide.md'), payload: 'g' },
    ]);
    assert.strictEqual(tree.length, 1);
    const docs = findFolder(tree, 'docs');
    assert.strictEqual(docs.relativePath, 'docs');
    assert.strictEqual(docs.children.length, 1);
    assert.strictEqual(docs.children[0].kind, 'file');
    assert.strictEqual(docs.children[0].name, 'guide.md');
  });

  test('groups multiple sibling subfolders under a common parent', () => {
    const tree = buildNestedTree([
      { relativePath: path.join('.specit', 'Mockery', 'PRD.md'), payload: 1 },
      { relativePath: path.join('.specit', 'Other', 'PRD.md'), payload: 2 },
    ]);
    assert.strictEqual(tree.length, 1);
    const specit = findFolder(tree, '.specit');
    assert.strictEqual(specit.children.length, 2);
    const mockery = findFolder(specit.children, 'Mockery');
    const other = findFolder(specit.children, 'Other');
    assert.strictEqual(mockery.children.length, 1);
    assert.strictEqual(other.children.length, 1);
  });

  test('handles deep nesting (3 levels)', () => {
    const rel = path.join('.specit', 'Mockery', 'feature', 'FEAT-001-thing.md');
    const tree = buildNestedTree([{ relativePath: rel, payload: 0 }]);
    const specit = findFolder(tree, '.specit');
    const mockery = findFolder(specit.children, 'Mockery');
    const feature = findFolder(mockery.children, 'feature');
    assert.strictEqual(feature.relativePath, path.join('.specit', 'Mockery', 'feature'));
    assert.strictEqual(feature.children.length, 1);
    assert.strictEqual(feature.children[0].kind, 'file');
    assert.strictEqual(feature.children[0].name, 'FEAT-001-thing.md');
  });

  test('mixes root-level files with nested folders', () => {
    const tree = buildNestedTree([
      { relativePath: 'README.md', payload: 1 },
      { relativePath: path.join('.specit', 'Mockery', 'PRD.md'), payload: 2 },
    ]);
    assert.strictEqual(tree.length, 2);
    // Folders sort before files at the same level.
    assert.strictEqual(tree[0].kind, 'folder');
    assert.strictEqual(tree[0].name, '.specit');
    assert.strictEqual(tree[1].kind, 'file');
    assert.strictEqual(tree[1].name, 'README.md');
  });

  test('sorts folders before files and alphabetically within each group', () => {
    const tree = buildNestedTree([
      { relativePath: path.join('docs', 'z.md'), payload: 0 },
      { relativePath: path.join('docs', 'a.md'), payload: 0 },
      { relativePath: path.join('docs', 'beta', 'x.md'), payload: 0 },
      { relativePath: path.join('docs', 'alpha', 'y.md'), payload: 0 },
    ]);
    const docs = findFolder(tree, 'docs');
    const names = docs.children.map(c => `${c.kind}:${c.name}`);
    assert.deepStrictEqual(names, [
      'folder:alpha',
      'folder:beta',
      'file:a.md',
      'file:z.md',
    ]);
  });

  test('normalizes forward-slash relative paths', () => {
    const tree = buildNestedTree([{ relativePath: '.specit/Mockery/PRD.md', payload: 1 }]);
    const specit = findFolder(tree, '.specit');
    const mockery = findFolder(specit.children, 'Mockery');
    assert.strictEqual(mockery.children[0].name, 'PRD.md');
  });
});
