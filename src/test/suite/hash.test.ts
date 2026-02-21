import * as assert from 'assert';
import { computeContentHash, slugify } from '../../utils/hash';

suite('Hash Utils Test Suite', () => {
  test('slugify creates URL-safe slugs', () => {
    assert.strictEqual(slugify('Hello World'), 'hello-world');
    assert.strictEqual(slugify('Authentication Flow'), 'authentication-flow');
    assert.strictEqual(slugify('API v2.0 Endpoints'), 'api-v20-endpoints');
    assert.strictEqual(slugify('  Leading and Trailing  '), 'leading-and-trailing');
    assert.strictEqual(slugify('Multiple   Spaces'), 'multiple-spaces');
    assert.strictEqual(slugify('Special!@#$Characters'), 'specialcharacters');
  });

  test('slugify handles edge cases', () => {
    assert.strictEqual(slugify(''), '');
    assert.strictEqual(slugify('---'), '');
    assert.strictEqual(slugify('A'), 'a');
  });

  test('computeContentHash returns consistent hash', () => {
    const content = 'This is some content for hashing';
    const hash1 = computeContentHash(content);
    const hash2 = computeContentHash(content);
    
    assert.strictEqual(hash1, hash2);
    assert.strictEqual(hash1.length, 16); // truncated to 16 chars
  });

  test('computeContentHash truncates long content', () => {
    const shortContent = 'Short';
    const longContent = 'A'.repeat(500);
    
    const shortHash = computeContentHash(shortContent, 200);
    const longHash = computeContentHash(longContent, 200);
    
    // Different content should produce different hashes
    assert.notStrictEqual(shortHash, longHash);
    
    // Hash of 500 A's truncated to 200 should equal hash of 200 A's
    const hash200As = computeContentHash('A'.repeat(200), 200);
    assert.strictEqual(longHash, hash200As);
  });

  test('computeContentHash is sensitive to changes', () => {
    const content1 = 'Authentication flow description';
    const content2 = 'Authentication flow description.'; // added period
    
    const hash1 = computeContentHash(content1);
    const hash2 = computeContentHash(content2);
    
    assert.notStrictEqual(hash1, hash2);
  });
});
