import * as assert from 'assert';
import * as path from 'path';
import * as fs from 'fs';

suite('Configuration: enableSpecitRendering', () => {

  let pkgJson: {
    contributes: {
      configuration: {
        properties: Record<string, { type: string; default: unknown; description: string }>;
      };
    };
  };

  suiteSetup(() => {
    // Read package.json from project root
    const pkgPath = path.resolve(__dirname, '..', '..', '..', 'package.json');
    pkgJson = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
  });

  test('setting is registered in package.json', () => {
    const props = pkgJson.contributes.configuration.properties;
    assert.ok(props['markdownThreads.enableSpecitRendering'], 'enableSpecitRendering should be registered');
  });

  test('setting type is boolean', () => {
    const setting = pkgJson.contributes.configuration.properties['markdownThreads.enableSpecitRendering'];
    assert.strictEqual(setting.type, 'boolean');
  });

  test('setting defaults to true', () => {
    const setting = pkgJson.contributes.configuration.properties['markdownThreads.enableSpecitRendering'];
    assert.strictEqual(setting.default, true);
  });

  test('setting has a description', () => {
    const setting = pkgJson.contributes.configuration.properties['markdownThreads.enableSpecitRendering'];
    assert.ok(setting.description && setting.description.length > 0, 'description should be non-empty');
  });
});
