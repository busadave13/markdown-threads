import * as assert from 'assert';
import { AuthManager } from '../../auth/authManager';

/** Fresh instance for each suite (no VS Code API calls in these tests). */
function makeAuth(): AuthManager {
  return new AuthManager();
}

suite('AuthManager Test Suite', () => {
  // ── detectProvider ───────────────────────────────────────────────

  test('detectProvider returns github for github.com HTTPS URL', () => {
    const auth = makeAuth();
    assert.strictEqual(auth.detectProvider('https://github.com/org/repo.git'), 'github');
  });

  test('detectProvider returns github for github.com SSH URL', () => {
    const auth = makeAuth();
    assert.strictEqual(auth.detectProvider('git@github.com:org/repo.git'), 'github');
  });

  test('detectProvider returns azuredevops for dev.azure.com URL', () => {
    const auth = makeAuth();
    assert.strictEqual(
      auth.detectProvider('https://dev.azure.com/myorg/myproject/_git/myrepo'),
      'azuredevops'
    );
  });

  test('detectProvider returns azuredevops for visualstudio.com URL', () => {
    const auth = makeAuth();
    assert.strictEqual(
      auth.detectProvider('https://myorg.visualstudio.com/myproject/_git/myrepo'),
      'azuredevops'
    );
  });

  test('detectProvider returns unknown for unrecognised URL', () => {
    const auth = makeAuth();
    assert.strictEqual(auth.detectProvider('https://gitlab.com/org/repo.git'), 'unknown');
    assert.strictEqual(auth.detectProvider('https://bitbucket.org/org/repo.git'), 'unknown');
    assert.strictEqual(auth.detectProvider(''), 'unknown');
  });

  // ── parseRemoteUrl — GitHub ──────────────────────────────────────

  test('parseRemoteUrl parses GitHub HTTPS URL', () => {
    const auth = makeAuth();
    const info = auth.parseRemoteUrl('https://github.com/my-org/my-repo.git');

    assert.ok(info);
    assert.strictEqual(info!.provider, 'github');
    assert.strictEqual(info!.owner, 'my-org');
    assert.strictEqual(info!.repo, 'my-repo');
    assert.strictEqual(info!.remoteUrl, 'https://github.com/my-org/my-repo.git');
  });

  test('parseRemoteUrl parses GitHub HTTPS URL without .git suffix', () => {
    const auth = makeAuth();
    const info = auth.parseRemoteUrl('https://github.com/owner/repo');

    assert.ok(info);
    assert.strictEqual(info!.provider, 'github');
    assert.strictEqual(info!.owner, 'owner');
    assert.strictEqual(info!.repo, 'repo');
  });

  test('parseRemoteUrl parses GitHub SSH URL', () => {
    const auth = makeAuth();
    const info = auth.parseRemoteUrl('git@github.com:my-org/my-repo.git');

    assert.ok(info);
    assert.strictEqual(info!.provider, 'github');
    assert.strictEqual(info!.owner, 'my-org');
    assert.strictEqual(info!.repo, 'my-repo');
  });

  // ── parseRemoteUrl — Azure DevOps ────────────────────────────────

  test('parseRemoteUrl parses Azure DevOps URL', () => {
    const auth = makeAuth();
    const info = auth.parseRemoteUrl('https://dev.azure.com/my-org/my-project/_git/my-repo');

    assert.ok(info);
    assert.strictEqual(info!.provider, 'azuredevops');
    assert.strictEqual(info!.owner, 'my-org/my-project');
    assert.strictEqual(info!.repo, 'my-repo');
  });

  test('parseRemoteUrl parses legacy visualstudio.com URL', () => {
    const auth = makeAuth();
    const info = auth.parseRemoteUrl('https://myorg.visualstudio.com/myproject/_git/myrepo');

    assert.ok(info);
    assert.strictEqual(info!.provider, 'azuredevops');
    assert.strictEqual(info!.owner, 'myorg/myproject');
    assert.strictEqual(info!.repo, 'myrepo');
  });

  // ── parseRemoteUrl — edge cases ──────────────────────────────────

  test('parseRemoteUrl returns null for unknown provider', () => {
    const auth = makeAuth();
    const info = auth.parseRemoteUrl('https://gitlab.com/org/repo.git');
    assert.strictEqual(info, null);
  });

  test('parseRemoteUrl returns null for empty string', () => {
    const auth = makeAuth();
    assert.strictEqual(auth.parseRemoteUrl(''), null);
  });

  test('parseRemoteUrl returns null for malformed github URL', () => {
    const auth = makeAuth();
    // Missing repo segment
    const info = auth.parseRemoteUrl('https://github.com/');
    assert.strictEqual(info, null);
  });

  // ── getToken routing ─────────────────────────────────────────────
  // (These exercise the switch logic; actual token retrieval requires VS Code APIs)

  test('getToken returns null for unknown provider', async () => {
    const auth = makeAuth();
    // 'unknown' provider should short-circuit to null without hitting VS Code
    const token = await auth.getToken('unknown');
    assert.strictEqual(token, null);
  });
});
