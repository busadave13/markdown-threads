# Changelog

## 0.2.2 — Exclude Folders & Enhanced Reading Pane

- **Configurable folder exclusions** — New `markdownThreads.excludeFolders` setting to hide markdown files from specified folders (e.g., `node_modules`, `.github`, `.git`, `out`, `dist`, `bin`, `obj`, `.vscode`) in the Markdown Files sidebar. The tree view and folder filter picker both respect the setting. Changes take effect immediately.
- **Client-side markdown rendering** — Switched from server-side markdown-it to client-side rendering via CDN, improving consistency and enabling richer post-processing (checkboxes, mermaid diagrams with zoom/pan).
- **Sticky document header** — Document title bar with refresh button stays visible while scrolling.
- **Find in document** — Press Ctrl+F / Cmd+F to search within the rendered document with match navigation (Enter/Shift+Enter) and highlight.
- **Checkbox rendering** — Markdown task lists (`[ ]` / `[x]`) now render as styled checkboxes.
- **External CSS** — All preview styles moved to `media/preview-styles.css` for easier maintenance.
- **Visual refresh** — Reading pane styling aligned with mark-it-up for improved typography, code blocks, tables, and blockquotes.
- **Extension bundling** — Switched to esbuild for single-file bundling. VSIX reduced from 4164 files to 13 files (53 KB). Removed unused `markdown-it` and `mermaid` npm dependencies (now loaded from CDN).

## 0.2.1 — Documentation Update

- **Improved README** — Reorganized features into categories, added quick start guide, documented orphan handling and reparenting

## 0.2.0 — Orphaned Thread Support & Reparenting

- **Bug fix: Orphaned comment threads now displayed** — When a markdown section is deleted, its comment threads now appear in a dedicated "Orphaned Comments" section at the bottom of the sidebar with a "⚠ Section Removed" indicator. Users can still resolve or delete orphaned threads. The statistics chart now includes an "Orphaned" category. (Fixes #6)
- **Reparent orphaned threads** — When a heading is renamed (changing its slug), orphaned threads can now be reparented. If the thread's original line number or content hash matches an existing section, a "🔗 Reparent to: [Section Name]" button appears for one-click reparenting. Otherwise, a dropdown allows manual selection of the target section.
- **UI improvements** — Sidebar header changed from "Comments" to "Threads" with thread count badge. Heading badges in preview now show thread count (e.g., "2 threads") with tooltip showing full comment count.

## 0.1.0 — Initial Release

- **Preview-only commenting** — WebView sidebar for adding threaded comments to any markdown file
- **Sidecar JSON storage** — Comments persist as `.comments.json` files alongside markdown docs
- **Section-level anchoring** — Comments anchor to markdown headings via slug + content hash
- **Stale detection** — Comments flagged when the underlying section content drifts
- **Thumbs-up reactions** — Toggle reactions on individual comments
- **Statistics chart** — Open vs resolved thread counts in the sidebar
- **Resolve / Reopen threads** — Mark discussions as resolved with author-gating
- **One-click PR creation** — Publish draft comments as a pull request to GitHub or Azure DevOps
- **Explorer context menu** — Right-click any `.md` file → "Markdown: Review and Comment"
- **Activity Bar sidebar** — New Markdown Threads icon in the Activity Bar opens a sidebar showing all markdown files in the workspace
- **Folder picker** — Filter the sidebar file list by selecting a specific folder from a dropdown
- **Comment count badges** — Sidebar shows comment count for each markdown file
- **Click to preview** — Click any file in the sidebar to open the preview panel
- **Bug fix: Publish button not appearing** — Fixed issue where the Publish button wouldn't appear after adding replies or resolving threads on already-published comments
- **Mermaid rendering** — Mermaid code blocks now render as diagrams in the preview panel
- **Theme-aware diagrams** — Mermaid diagrams automatically adapt to VS Code light/dark theme