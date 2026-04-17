# Changelog

## 1.0.1 — First Official Release as "Markdown: Review & Comment"

This is the first official release of the extension under its new name. Previously published as **Markdown Threads** (`busa-dave-13.markdown-threads`), the extension is now **Markdown: Review & Comment** (`busa-dave-13.markdown-review-and-comment`). The marketplace treats this as a new extension, so existing installs will not auto-upgrade — uninstall the old extension and install the new one to continue receiving updates.

### Renamed & rebranded

- **New display name** — "Markdown Threads" → **"Markdown: Review & Comment"**.
- **New package id** — `busa-dave-13.markdown-review-and-comment` (was `busa-dave-13.markdown-threads`).
- **New command ids** — `markdownReview.openPreview`, `markdownReview.refreshFiles`, `markdownReview.selectFolder` (replacing the `markdownThreads.*` equivalents).
- **New activity-bar view container** — moved from `markdownThreads` to `markdownReview`.
- **New configuration key** — `markdownReview.excludeFolders`. Users with the old `markdownThreads.excludeFolders` setting will need to re-apply it under the new key.

### UX improvements

- **Preview opens in active editor group** — Opening the preview now adds it as a tab in the currently active editor group instead of forcing a side-by-side split. Existing preview panels are revealed in the column they currently live in, so user-moved tabs stay put.
- **Comment cards: click anywhere to jump to the highlight** — Removed the redundant quoted-text excerpt box at the top of each comment card. Clicking anywhere on the card body now scrolls the reading pane to the corresponding text highlight and flashes it. Action buttons (Reply, Edit, Delete, reactions) and the "Show N more replies" expander still behave as before.
- **Cleaner card header** — Author and timestamp now sit at the very top of every card with extra breathing room before the comment body. The stale "⚠ Text Changed" indicator was moved down to just above the actions bar so it no longer pushes the author info off the top of stale cards.
