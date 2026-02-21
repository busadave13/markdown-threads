import * as crypto from 'crypto';

/**
 * Compute SHA256 hash of the first N characters of content
 */
export function computeContentHash(content: string, maxChars: number = 200): string {
  const truncated = content.substring(0, maxChars);
  return crypto.createHash('sha256').update(truncated).digest('hex').substring(0, 16);
}

/**
 * Generate a URL-safe slug from a heading
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove non-word chars except spaces and hyphens
    .replace(/\s+/g, '-')     // Replace spaces with hyphens
    .replace(/-+/g, '-')      // Collapse multiple hyphens
    .replace(/^-+|-+$/g, ''); // Trim leading/trailing hyphens
}
