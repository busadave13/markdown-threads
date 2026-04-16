import * as assert from 'assert';
import { buildExcludePattern } from '../../markdownFilesProvider';

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
