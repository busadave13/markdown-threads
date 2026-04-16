import * as vscode from 'vscode';
import * as path from 'path';
import MarkdownIt from 'markdown-it';
import { sidecarManager } from './sidecarManager';
import type { SidecarChangeEvent } from './sidecarManager';
import { anchorEngine } from './anchorEngine';
import { gitService } from './gitService';
import { slugify } from './utils/hash';
import { markdownItMermaid } from './utils/markdownItMermaid';
import type { CommentThread as AppCommentThread } from './models/types';
import { v4 as uuidv4 } from 'uuid';

/**
 * Manages a WebView panel that renders the markdown document
 * with inline comment threads visible — a "preview with comments" mode.
 */
export class PreviewPanel implements vscode.Disposable {
  public static readonly viewType = 'markdownThreads.preview';

  private static instance: PreviewPanel | undefined;
  private static extensionUri: vscode.Uri | undefined;

  private readonly panel: vscode.WebviewPanel;
  private document: vscode.TextDocument;
  private readonly md: MarkdownIt;
  private readonly disposables: vscode.Disposable[] = [];
  private updateTimeout: ReturnType<typeof setTimeout> | undefined;
  private readonly mermaidUri: vscode.Uri;

  // ───────────────── public API ─────────────────

  /** Set the extension URI (call once during activation). */
  public static setExtensionUri(uri: vscode.Uri): void {
    PreviewPanel.extensionUri = uri;
  }

  /** Create a new preview panel or reveal an existing one. */
  public static async show(document: vscode.TextDocument): Promise<void> {
    if (PreviewPanel.instance) {
      PreviewPanel.instance.document = document;
      PreviewPanel.instance.panel.reveal(vscode.ViewColumn.Beside, true);
      await PreviewPanel.instance.update();
      return;
    }

    if (!PreviewPanel.extensionUri) {
      vscode.window.showErrorMessage('PreviewPanel.extensionUri not set');
      return;
    }

    const mermaidPath = vscode.Uri.joinPath(
      PreviewPanel.extensionUri,
      'node_modules',
      'mermaid',
      'dist',
      'mermaid.min.js'
    );

    const localResourceRoots = [
      ...(vscode.workspace.workspaceFolders?.map(f => f.uri) ?? []),
      vscode.Uri.joinPath(PreviewPanel.extensionUri, 'node_modules'),
    ];

    const panel = vscode.window.createWebviewPanel(
      PreviewPanel.viewType,
      `Preview: ${path.basename(document.uri.fsPath)}`,
      { viewColumn: vscode.ViewColumn.Beside, preserveFocus: true },
      {
        enableScripts: true,
        retainContextWhenHidden: true,
        localResourceRoots,
      },
    );

    PreviewPanel.instance = new PreviewPanel(panel, document, mermaidPath);
    await PreviewPanel.instance.update();
  }

  // ───────────────── constructor ─────────────────

  private constructor(panel: vscode.WebviewPanel, document: vscode.TextDocument, mermaidPath: vscode.Uri) {
    this.panel = panel;
    this.document = document;
    this.mermaidUri = panel.webview.asWebviewUri(mermaidPath);
    this.md = new MarkdownIt({ html: true, linkify: true, typographer: true });
    this.md.use(markdownItMermaid);
    this.installHeadingPlugin();

    // Dispose cleanup
    this.panel.onDidDispose(() => this.dispose(), null, this.disposables);

    // Re-render on document save (not on every keystroke edit,
    // which would disrupt the comment widget by refreshing the webview)
    this.disposables.push(
      vscode.workspace.onDidSaveTextDocument(doc => {
        if (doc.uri.toString() === this.document.uri.toString()) {
          this.scheduleUpdate();
        }
      }),
    );

    // Re-render when sidecar data changes (from any origin except preview itself)
    this.disposables.push(
      sidecarManager.onDidChange((e: SidecarChangeEvent) => {
        if (e.origin === 'preview') {
          // We wrote this ourselves — no need to reload (we already called this.update())
          return;
        }
        // Only refresh if the change is for the document we're currently previewing
        if (e.docPath === this.document.uri.fsPath) {
          this.scheduleUpdate();
        }
      }),
    );

    // Follow the active editor when switching to another markdown file.
    // Ignore VS Code's virtual comment-input documents (scheme !== 'file'
    // or path containing 'commentinput-') to prevent the preview from
    // switching away when the user clicks a comment widget.
    this.disposables.push(
      vscode.window.onDidChangeActiveTextEditor(editor => {
        if (
          editor &&
          editor.document.languageId === 'markdown' &&
          editor.document.uri.scheme === 'file' &&
          !editor.document.uri.path.includes('commentinput-') &&
          editor.document.uri.toString() !== this.document.uri.toString()
        ) {
          this.document = editor.document;
          this.scheduleUpdate();
        }
      }),
    );

    // Handle messages from the WebView
    this.panel.webview.onDidReceiveMessage(
      msg => this.handleWebViewMessage(msg),
      null,
      this.disposables,
    );
  }

  // ───────────────── Document refresh helper ─────────────────

  /**
   * Ensure this.document is a fresh reference.
   * Needed when the editor tab was closed but the preview panel remains open.
   */
  private async ensureDocumentFresh(): Promise<void> {
    this.document = await vscode.workspace.openTextDocument(this.document.uri);
  }

  // ───────────────── WebView message handler ─────────────────

  private async handleWebViewMessage(msg: { command: string; [key: string]: unknown }): Promise<void> {
    switch (msg.command) {
      case 'addComment': {
        await this.ensureDocumentFresh();
        const selectedText = msg.selectedText as string;
        const body = (msg.body as string || '').trim();
        const contentOffset = (msg.contentOffset as number) || 0;
        if (!selectedText || !body) { return; }

        const author = await gitService.getUserName();
        const rawMarkdown = this.document.getText().replace(/\r\n/g, '\n');

        // Find the selected text in raw markdown, preferring the occurrence nearest contentOffset
        let bestStart = -1;
        let bestDistance = Infinity;
        let searchFrom = 0;
        while (searchFrom <= rawMarkdown.length - selectedText.length) {
          const idx = rawMarkdown.indexOf(selectedText, searchFrom);
          if (idx === -1) { break; }
          const distance = Math.abs(idx - contentOffset);
          if (distance < bestDistance) {
            bestDistance = distance;
            bestStart = idx;
          }
          searchFrom = idx + 1;
        }

        if (bestStart === -1) {
          vscode.window.showErrorMessage('Could not find selected text in document');
          return;
        }

        const endOffset = bestStart + selectedText.length;
        const anchor = anchorEngine.createAnchor(selectedText, bestStart, endOffset, rawMarkdown);

        let sidecar = await sidecarManager.readSidecar(this.document.uri.fsPath);
        if (!sidecar) {
          sidecar = sidecarManager.createEmptySidecar(path.basename(this.document.uri.fsPath));
        }

        const now = new Date().toISOString();
        sidecarManager.addThread(sidecar, {
          anchor,
          status: 'open',
          thread: [{ id: uuidv4(), author, body, created: now, edited: null }],
        });

        await sidecarManager.writeSidecar(this.document.uri.fsPath, sidecar, 'preview');
        await this.update();
        break;
      }

      case 'replyComment': {
        const threadId = msg.threadId as string;
        const body = (msg.body as string || '').trim();
        if (!body || !threadId) { return; }

        const author = await gitService.getUserName();
        const sidecar = await sidecarManager.readSidecar(this.document.uri.fsPath);
        if (!sidecar) { return; }

        sidecarManager.addReply(sidecar, threadId, {
          author,
          body,
          created: new Date().toISOString(),
          edited: null,
        });

        await sidecarManager.writeSidecar(this.document.uri.fsPath, sidecar, 'preview');
        await this.update();
        break;
      }

      case 'deleteThread': {
        const threadId = msg.threadId as string;
        if (!threadId) { return; }
        const currentUser = await gitService.getUserName();
        const sidecar = await sidecarManager.readSidecar(this.document.uri.fsPath);
        if (!sidecar) { return; }
        const thread = sidecar.comments.find(t => t.id === threadId);
        if (!thread) { return; }
        // Only the thread creator (first comment author) may delete the thread
        if (thread.thread[0]?.author !== currentUser) {
          vscode.window.showWarningMessage('You can only delete threads you created.');
          return;
        }
        sidecarManager.deleteThread(sidecar, threadId);
        await sidecarManager.writeSidecar(this.document.uri.fsPath, sidecar, 'preview');
        await this.update();
        break;
      }

      case 'deleteComment': {
        const threadId = msg.threadId as string;
        const commentId = msg.commentId as string;
        if (!threadId || !commentId) { return; }
        const currentUser = await gitService.getUserName();
        const sidecar = await sidecarManager.readSidecar(this.document.uri.fsPath);
        if (!sidecar) { return; }
        const thread = sidecar.comments.find(t => t.id === threadId);
        if (!thread) { return; }
        const entry = thread.thread.find(c => c.id === commentId);
        if (!entry) { return; }
        // Only the comment author may delete their own comment
        if (entry.author !== currentUser) {
          vscode.window.showWarningMessage('You can only delete your own comments.');
          return;
        }
        sidecarManager.deleteCommentById(sidecar, threadId, commentId);
        await sidecarManager.writeSidecar(this.document.uri.fsPath, sidecar, 'preview');
        await this.update();
        break;
      }

      case 'editComment': {
        const threadId = msg.threadId as string;
        const commentId = msg.commentId as string;
        const body = (msg.body as string || '').trim();
        if (!threadId || !commentId || !body) { return; }
        const currentUser = await gitService.getUserName();
        const sidecar = await sidecarManager.readSidecar(this.document.uri.fsPath);
        if (!sidecar) { return; }
        const editThread = sidecar.comments.find(t => t.id === threadId);
        if (!editThread) { return; }
        // Verify ownership
        const editEntry = editThread.thread.find(c => c.id === commentId);
        if (!editEntry || editEntry.author !== currentUser) {
          vscode.window.showWarningMessage('You can only edit your own comments.');
          return;
        }
        sidecarManager.editComment(sidecar, threadId, commentId, body);
        await sidecarManager.writeSidecar(this.document.uri.fsPath, sidecar, 'preview');
        await this.update();
        break;
      }
    }
  }

  // ───────────────── markdown-it heading plugin ─────────────────

  /** Adds slug-based IDs and data attributes to heading tokens. */
  private installHeadingPlugin(): void {
    const originalRule = this.md.renderer.rules.heading_open;

    this.md.renderer.rules.heading_open = (tokens, idx, options, env, self) => {
      const token = tokens[idx];
      const nextToken = tokens[idx + 1];
      if (nextToken?.type === 'inline' && nextToken.content) {
        const slug = slugify(nextToken.content);
        token.attrSet('id', slug);
        token.attrSet('data-slug', slug);
        token.attrJoin('class', 'section-heading');
      }
      if (originalRule) {
        return originalRule(tokens, idx, options, env, self);
      }
      return self.renderToken(tokens, idx, options);
    };
  }

  // ───────────────── update / render ─────────────────

  private scheduleUpdate(): void {
    if (this.updateTimeout) {
      clearTimeout(this.updateTimeout);
    }
    // Only refresh when the panel is actually visible to the user
    if (!this.panel.visible) {
      return;
    }
    this.updateTimeout = setTimeout(() => this.update(), 300);
  }

  private async update(): Promise<void> {
    // Ensure document reference is fresh (in case editor tab was closed)
    await this.ensureDocumentFresh();

    const rawMarkdown = this.document.getText().replace(/\r\n/g, '\n');

    // Render markdown → HTML
    let html = this.md.render(rawMarkdown);
    html = this.fixLocalImagePaths(html);

    // Load comments and run stale detection
    const sidecar = await sidecarManager.readSidecar(this.document.uri.fsPath);
    let threads: AppCommentThread[] = [];

    if (sidecar) {
      // Stale detection updates anchors in-place when text moves
      const { updates: staleUpdates, anchorsMoved } = anchorEngine.detectStaleThreads(rawMarkdown, sidecar.comments);
      for (const { thread, newStatus } of staleUpdates) {
        thread.status = newStatus;
      }
      threads = sidecar.comments;
      // Persist any anchor/status updates (including drift)
      if (staleUpdates.length > 0 || anchorsMoved) {
        await sidecarManager.writeSidecar(this.document.uri.fsPath, sidecar, 'internal');
      }
    }

    // Sort threads by document position
    threads.sort((a, b) => a.anchor.markdownRange.startOffset - b.anchor.markdownRange.startOffset);

    // Build WebView data with occurrence indices for highlight disambiguation
    const threadsData = threads.map(t => {
      const sameTextBefore = threads.filter(
        other => other.anchor.selectedText === t.anchor.selectedText &&
                 other.anchor.markdownRange.startOffset < t.anchor.markdownRange.startOffset,
      ).length;
      return {
        id: t.id,
        selectedText: t.anchor.selectedText,
        occurrenceIndex: sameTextBefore,
        status: t.status,
        color: t.color,
        thread: t.thread,
        startOffset: t.anchor.markdownRange.startOffset,
      };
    });

    const currentUser = await gitService.getUserName();

    this.panel.title = `Preview: ${path.basename(this.document.uri.fsPath)}`;
    this.panel.webview.html = this.buildHtml(html, threadsData, currentUser);
  }

  /** Convert relative image paths to webview-safe URIs. */
  private fixLocalImagePaths(html: string): string {
    const docDir = path.dirname(this.document.uri.fsPath);
    return html.replace(
      /(<img[^>]*\ssrc=")(?!https?:\/\/|data:)([^"]+)/g,
      (_match, prefix: string, src: string) => {
        const absPath = path.resolve(docDir, src);
        const webviewUri = this.panel.webview.asWebviewUri(vscode.Uri.file(absPath));
        return prefix + webviewUri.toString();
      },
    );
  }

  // ───────────────── HTML template ─────────────────

  private buildHtml(
    renderedMarkdown: string,
    threads: Array<{
      id: string;
      selectedText: string;
      occurrenceIndex: number;
      status: string;
      color?: string;
      thread: Array<{ id: string; author: string; body: string; created: string; edited: string | null }>;
      startOffset: number;
    }>,
    currentUser: string,
  ): string {
    const nonce = getNonce();
    const cspSource = this.panel.webview.cspSource;
    const threadsJson = JSON.stringify(threads).replace(/</g, '\\u003c');
    const userJson = JSON.stringify(currentUser).replace(/</g, '\\u003c');

    return /* html */ `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy"
        content="default-src 'none'; style-src 'unsafe-inline'; script-src ${cspSource} 'nonce-${nonce}' 'unsafe-eval'; img-src ${cspSource} https: data:; font-src ${cspSource};">
  <script src="${this.mermaidUri}"></script>
  <style>
${PREVIEW_CSS}
  </style>
</head>
<body>
  <div id="layout">
    <div id="content">
      ${renderedMarkdown}
    </div>
    <div id="resize-handle" title="Drag to resize sidebar"></div>
    <div id="sidebar">
      <div class="sidebar-header">
        <span>Comments <span id="thread-count-badge" class="thread-count-badge"></span></span>
      </div>
      <div id="sidebar-content"></div>
    </div>
  </div>
  <div id="comment-toolbar">
    <button id="toolbar-comment-btn">\uD83D\uDCAC Comment</button>
  </div>
  <script nonce="${nonce}">
    const threads = ${threadsJson};
    const currentUser = ${userJson};
${PREVIEW_JS}
  </script>
</body>
</html>`;
  }

  // ───────────────── dispose ─────────────────

  dispose(): void {
    PreviewPanel.instance = undefined;
    if (this.updateTimeout) {
      clearTimeout(this.updateTimeout);
    }
    this.panel.dispose();
    for (const d of this.disposables) {
      d.dispose();
    }
  }
}

// ───────────────── helpers ─────────────────

function getNonce(): string {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

// ───────────────── CSS ─────────────────

const PREVIEW_CSS = /* css */ `
* { box-sizing: border-box; }

body {
  font-family: var(--vscode-markdown-font-family,
    var(--vscode-font-family, -apple-system, BlinkMacSystemFont,
    'Segoe WPC', 'Segoe UI', system-ui, 'Ubuntu', 'Droid Sans', sans-serif));
  font-size: var(--vscode-markdown-font-size, var(--vscode-font-size, 14px));
  line-height: var(--vscode-markdown-line-height, 1.6);
  color: var(--vscode-foreground);
  background-color: var(--vscode-editor-background);
  margin: 0;
  padding: 0;
  overflow: hidden;
}

/* ── two‑column layout ─────────────────────── */

#layout {
  display: flex;
  height: 100vh;
  width: 100%;
}

#content {
  flex: 1;
  overflow-y: auto;
  padding: 16px 32px;
  word-wrap: break-word;
}

#sidebar {
  width: 360px;
  min-width: 200px;
  max-width: 70vw;
  border-left: 1px solid var(--vscode-widget-border, rgba(127,127,127,.35));
  background: var(--vscode-sideBar-background, var(--vscode-editor-background));
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* ── resize handle ─────────────────────────── */

#resize-handle {
  width: 5px;
  cursor: col-resize;
  background: transparent;
  flex-shrink: 0;
  position: relative;
  z-index: 10;
  transition: background .15s ease;
}
#resize-handle:hover,
#resize-handle.active {
  background: var(--vscode-focusBorder, #007fd4);
}

body.resizing {
  cursor: col-resize !important;
  user-select: none;
}

.sidebar-header {
  padding: 12px 16px;
  border-bottom: 1px solid var(--vscode-widget-border, rgba(127,127,127,.35));
  font-weight: 600;
  font-size: 14px;
  flex-shrink: 0;
  color: var(--vscode-foreground);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.thread-count-badge {
  font-size: 11px;
  font-weight: normal;
  color: var(--vscode-badge-foreground);
  background: var(--vscode-badge-background);
  padding: 1px 7px;
  border-radius: 8px;
  margin-left: 6px;
}

#sidebar-content {
  flex: 1;
  overflow-y: auto;
  padding: 0;
}

.sidebar-empty {
  padding: 20px 16px;
  text-align: center;
  color: var(--vscode-descriptionForeground);
  font-size: 13px;
}

/* ── typography ─────────────────────────────── */

h1, h2, h3, h4, h5, h6 {
  font-weight: 600;
  margin-top: 24px;
  margin-bottom: 16px;
  line-height: 1.25;
  color: var(--vscode-foreground);
}
h1 { font-size: 2em;   border-bottom: 1px solid var(--vscode-widget-border, rgba(127,127,127,.35)); padding-bottom: .3em; }
h2 { font-size: 1.5em; border-bottom: 1px solid var(--vscode-widget-border, rgba(127,127,127,.35)); padding-bottom: .3em; }
h3 { font-size: 1.25em; }
h4 { font-size: 1em; }

p { margin: 0 0 16px; }

a { color: var(--vscode-textLink-foreground); text-decoration: none; }
a:hover { text-decoration: underline; }

code {
  font-family: var(--vscode-editor-font-family, 'Menlo', 'Monaco', 'Courier New', monospace);
  font-size: .9em;
  background: var(--vscode-textCodeBlock-background, rgba(127,127,127,.15));
  padding: 2px 6px;
  border-radius: 3px;
}
pre {
  background: var(--vscode-textCodeBlock-background, rgba(127,127,127,.15));
  padding: 16px;
  border-radius: 6px;
  overflow-x: auto;
}
pre code { background: none; padding: 0; }

blockquote {
  margin: 16px 0;
  padding: 0 16px;
  border-left: 4px solid var(--vscode-textBlockQuote-border, rgba(127,127,127,.35));
  color: var(--vscode-textBlockQuote-foreground, inherit);
}

table { border-collapse: collapse; width: 100%; margin: 16px 0; }
th, td {
  border: 1px solid var(--vscode-widget-border, rgba(127,127,127,.35));
  padding: 8px 12px; text-align: left;
}
th {
  background: var(--vscode-editor-inactiveSelectionBackground, rgba(127,127,127,.1));
  font-weight: 600;
}

img { max-width: 100%; }
hr { border: none; border-top: 1px solid var(--vscode-widget-border, rgba(127,127,127,.35)); margin: 24px 0; }

ul, ol { padding-left: 2em; }

/* ── text highlight on commented selections ─── */

.comment-highlight {
  border-radius: 2px;
  cursor: pointer;
  transition: filter .15s ease;
}
.comment-highlight:hover {
  filter: brightness(1.2);
}
.comment-highlight.active {
  outline: 2px solid var(--vscode-focusBorder, #007fd4);
  outline-offset: 1px;
}

/* ── floating comment toolbar ──────────────── */

#comment-toolbar {
  display: none;
  position: fixed;
  z-index: 1000;
  background: var(--vscode-editor-background);
  border: 1px solid var(--vscode-widget-border, rgba(127,127,127,.35));
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0,0,0,.25);
  padding: 4px;
}
#comment-toolbar button {
  background: var(--vscode-button-background);
  color: var(--vscode-button-foreground);
  border: none;
  border-radius: 4px;
  padding: 4px 12px;
  font-size: 12px;
  cursor: pointer;
  white-space: nowrap;
}
#comment-toolbar button:hover {
  background: var(--vscode-button-hoverBackground);
}

/* ── thread excerpt in sidebar ─────────────── */

.thread-excerpt {
  font-size: 12px;
  color: var(--vscode-descriptionForeground);
  background: var(--vscode-textCodeBlock-background, rgba(127,127,127,.1));
  padding: 4px 8px;
  border-radius: 4px;
  margin-bottom: 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  border-left: 3px solid;
  cursor: pointer;
}
.thread-excerpt:hover {
  background: var(--vscode-editor-hoverHighlightBackground, rgba(127,127,127,.15));
}

/* ── comment thread blocks (in sidebar) ─────── */

.comment-thread-block {
  border-left: 3px solid var(--vscode-editorInfo-foreground, #3794ff);
  border-radius: 8px;
  background: var(--vscode-editor-inactiveSelectionBackground, rgba(127,127,127,.06));
  padding: 10px 14px;
  margin: 6px 16px;
  transition: box-shadow 0.2s ease;
  cursor: pointer;
}
.comment-thread-block.focused {
  box-shadow: 0 0 0 1px var(--vscode-focusBorder, #007fd4);
}
.comment-thread-block.stale    { border-left-color: var(--vscode-editorWarning-foreground, #cca700); }

.thread-status-label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: .5px;
  margin-bottom: 6px;
}
.thread-status-label.open     { color: var(--vscode-editorInfo-foreground, #3794ff); }
.thread-status-label.stale    { color: var(--vscode-editorWarning-foreground, #cca700); }

.comment-entry { padding: 6px 0; }
.comment-entry + .comment-entry {
  border-top: 1px solid var(--vscode-widget-border, rgba(127,127,127,.15));
  margin-top: 4px;
}

.comment-header { display: flex; flex-direction: column; gap: 1px; margin-bottom: 2px; }
.comment-author { font-weight: 600; font-size: 12px; color: var(--vscode-textLink-foreground); }
.comment-time   { font-size: 11px; color: var(--vscode-descriptionForeground); }

.comment-body { font-size: 13px; line-height: 1.5; margin-top: 2px; white-space: pre-wrap; }

/* ── comment form ──────────────────────────── */

.comment-form {
  margin: 8px 0 4px;
  border: 1px solid var(--vscode-input-border, rgba(127,127,127,.35));
  border-radius: 6px;
  overflow: hidden;
  background: var(--vscode-input-background, rgba(0,0,0,.15));
}
.comment-form textarea {
  width: 100%;
  min-height: 60px;
  padding: 8px 10px;
  border: none;
  outline: none;
  resize: vertical;
  font-family: inherit;
  font-size: 13px;
  line-height: 1.5;
  color: var(--vscode-input-foreground, var(--vscode-foreground));
  background: transparent;
}
.comment-form textarea::placeholder { color: var(--vscode-input-placeholderForeground, rgba(127,127,127,.6)); }
.comment-form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 6px;
  padding: 6px 8px;
  background: var(--vscode-editor-inactiveSelectionBackground, rgba(127,127,127,.06));
}
.comment-form-actions button {
  padding: 4px 14px;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
}
.btn-submit {
  background: var(--vscode-button-background);
  color: var(--vscode-button-foreground);
}
.btn-submit:hover { background: var(--vscode-button-hoverBackground); }
.btn-cancel {
  background: var(--vscode-button-secondaryBackground, rgba(127,127,127,.2));
  color: var(--vscode-button-secondaryForeground, var(--vscode-foreground));
}
.btn-cancel:hover { background: var(--vscode-button-secondaryHoverBackground, rgba(127,127,127,.3)); }

/* ── thread action buttons ─────────────── */

.thread-actions {
  display: flex;
  gap: 8px;
  margin-top: 8px;
  padding-top: 6px;
  border-top: 1px solid var(--vscode-widget-border, rgba(127,127,127,.12));
}
.thread-action-btn {
  background: transparent;
  border: none;
  color: var(--vscode-textLink-foreground);
  font-size: 11px;
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 3px;
}
.thread-action-btn:hover {
  background: var(--vscode-button-secondaryBackground, rgba(127,127,127,.15));
}

/* ── comment action links ─────────────────── */

.comment-actions {
  display: flex;
  gap: 10px;
  margin-top: 4px;
}

.action-link {
  background: none;
  border: none;
  color: var(--vscode-textLink-foreground);
  font-size: 11px;
  cursor: pointer;
  padding: 0;
  text-decoration: none;
}
.action-link:hover {
  text-decoration: underline;
}

/* ── collapsed thread divider ──────────────── */

.collapsed-divider {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  cursor: pointer;
  color: var(--vscode-textLink-foreground);
  font-size: 12px;
  font-weight: 500;
}
.collapsed-divider:hover {
  text-decoration: underline;
}
.collapsed-divider::before,
.collapsed-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--vscode-widget-border, rgba(127,127,127,.25));
}

/* ── sidebar statistics chart ─────────────── */

/* ── mermaid diagrams ─────────────────────────── */

pre.mermaid {
  background: transparent;
  border: none;
  text-align: center;
  padding: 16px 0;
}

pre.mermaid svg {
  max-width: 100%;
  height: auto;
}
`;

// ───────────────── JS (runs inside the WebView) ─────────────────

const PREVIEW_JS = /* js */ `
(function () {
  const vscode = acquireVsCodeApi();
  const content = document.getElementById('content');
  const sidebarContent = document.getElementById('sidebar-content');
  const toolbar = document.getElementById('comment-toolbar');
  const toolbarBtn = document.getElementById('toolbar-comment-btn');

  // ── highlight color palette ────────────────
  const HIGHLIGHT_COLORS = [
    'rgba(255, 235, 59, 0.35)',
    'rgba(129, 199, 132, 0.35)',
    'rgba(100, 181, 246, 0.35)',
    'rgba(255, 183, 77, 0.35)',
    'rgba(186, 104, 200, 0.35)',
    'rgba(77, 208, 225, 0.35)',
    'rgba(229, 115, 115, 0.35)',
    'rgba(240, 98, 146, 0.35)',
  ];
  function getThreadColor(index) {
    return HIGHLIGHT_COLORS[index % HIGHLIGHT_COLORS.length];
  }

  // ── mermaid initialization ─────────────────
  (function initMermaid() {
    if (typeof mermaid !== 'undefined') {
      const isDark = document.body.classList.contains('vscode-dark') ||
                     document.body.classList.contains('vscode-high-contrast') ||
                     getComputedStyle(document.body).getPropertyValue('--vscode-editor-background').trim().match(/^#[0-4]/);
      mermaid.initialize({
        startOnLoad: true,
        theme: isDark ? 'dark' : 'default',
        securityLevel: 'loose',
      });
    }
  })();

  // ── sidebar resize logic ───────────────────
  (function initResize() {
    const handle = document.getElementById('resize-handle');
    const sidebar = document.getElementById('sidebar');
    if (!handle || !sidebar) { return; }
    let startX = 0;
    let startWidth = 0;

    function onMouseDown(e) {
      e.preventDefault();
      startX = e.clientX;
      startWidth = sidebar.getBoundingClientRect().width;
      handle.classList.add('active');
      document.body.classList.add('resizing');
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    }

    function onMouseMove(e) {
      const delta = startX - e.clientX;
      const newWidth = Math.min(Math.max(startWidth + delta, 200), window.innerWidth * 0.7);
      sidebar.style.width = newWidth + 'px';
    }

    function onMouseUp() {
      handle.classList.remove('active');
      document.body.classList.remove('resizing');
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }

    handle.addEventListener('mousedown', onMouseDown);
  })();

  // ── helper: create a comment form ──────────
  function createCommentForm(opts) {
    const form = document.createElement('div');
    form.className = 'comment-form';

    const textarea = document.createElement('textarea');
    textarea.placeholder = opts.placeholder || 'Write a comment...';
    form.appendChild(textarea);

    const actions = document.createElement('div');
    actions.className = 'comment-form-actions';

    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'btn-cancel';
    cancelBtn.textContent = 'Cancel';
    cancelBtn.addEventListener('click', () => form.remove());
    actions.appendChild(cancelBtn);

    const submitBtn = document.createElement('button');
    submitBtn.className = 'btn-submit';
    submitBtn.textContent = opts.submitLabel || 'Comment';
    submitBtn.addEventListener('click', () => {
      const text = textarea.value.trim();
      if (!text) { textarea.focus(); return; }
      opts.onSubmit(text);
      form.remove();
    });
    actions.appendChild(submitBtn);

    form.appendChild(actions);

    textarea.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        submitBtn.click();
      }
    });

    return { form, textarea };
  }

  // ── helper: expand/collapse thread ─────────
  function expandThread(block) {
    block.classList.add('focused');
    var divider = block.querySelector('.collapsed-divider');
    if (divider) { divider.style.display = 'none'; }
    block.querySelectorAll('.collapsed-entry').forEach(function(el) {
      el.style.display = '';
      el.classList.remove('collapsed-entry');
    });
  }

  function collapseThread(block) {
    if (!block.dataset.collapsible) { return; }
    block.classList.remove('focused');
    var entries = block.querySelectorAll('.comment-entry');
    if (entries.length <= 2) { return; }
    var divider = block.querySelector('.collapsed-divider');
    if (divider) {
      divider.style.display = '';
      var moreCount = entries.length - 2;
      divider.textContent = moreCount + ' more ' + (moreCount === 1 ? 'reply' : 'replies');
    }
    for (var i = 1; i < entries.length - 1; i++) {
      entries[i].style.display = 'none';
      entries[i].classList.add('collapsed-entry');
    }
  }

  // ── auto-collapse on outside click ─────────
  document.addEventListener('click', function(e) {
    document.querySelectorAll('.comment-thread-block.focused').forEach(function(block) {
      if (!block.contains(e.target)) {
        collapseThread(block);
      }
    });
  });

  // ── text selection → floating toolbar ──────
  let pendingSelection = null;

  function getContentTextOffset() {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || sel.isCollapsed) { return 0; }
    const range = sel.getRangeAt(0);
    const preRange = document.createRange();
    preRange.selectNodeContents(content);
    preRange.setEnd(range.startContainer, range.startOffset);
    return preRange.toString().length;
  }

  content.addEventListener('mouseup', function(e) {
    setTimeout(function() {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed || !sel.toString().trim()) {
        toolbar.style.display = 'none';
        pendingSelection = null;
        return;
      }
      // Ensure selection is within #content
      const range = sel.getRangeAt(0);
      if (!content.contains(range.commonAncestorContainer)) {
        toolbar.style.display = 'none';
        return;
      }
      // Don't show toolbar if selection is inside an existing comment-highlight
      if (range.commonAncestorContainer.parentElement &&
          range.commonAncestorContainer.parentElement.closest('.comment-highlight')) {
        toolbar.style.display = 'none';
        return;
      }
      pendingSelection = {
        text: sel.toString(),
        contentOffset: getContentTextOffset(),
      };
      // Position toolbar near the selection
      const rect = range.getBoundingClientRect();
      toolbar.style.display = 'block';
      toolbar.style.left = Math.max(4, rect.left + rect.width / 2 - 50) + 'px';
      toolbar.style.top = Math.max(4, rect.top - 40) + 'px';
    }, 10);
  });

  // Hide toolbar on scroll or click outside
  content.addEventListener('scroll', function() { toolbar.style.display = 'none'; });
  document.addEventListener('mousedown', function(e) {
    if (!toolbar.contains(e.target) && e.target !== toolbar) {
      toolbar.style.display = 'none';
    }
  });

  // Toolbar "Comment" button → open form in sidebar
  toolbarBtn.addEventListener('click', function() {
    if (!pendingSelection) { return; }
    const selData = pendingSelection;
    toolbar.style.display = 'none';

    // Create inline form at the top of sidebar
    const existing = sidebarContent.querySelector('.new-comment-form');
    if (existing) { existing.remove(); }

    const wrapper = document.createElement('div');
    wrapper.className = 'new-comment-form';
    wrapper.style.padding = '12px 16px';
    wrapper.style.borderBottom = '1px solid var(--vscode-widget-border, rgba(127,127,127,.12))';

    const excerpt = document.createElement('div');
    excerpt.className = 'thread-excerpt';
    excerpt.style.borderLeftColor = 'var(--vscode-textLink-foreground)';
    var excerptText = selData.text.length > 60 ? selData.text.substring(0, 60) + '\\u2026' : selData.text;
    excerpt.textContent = '\\u201C' + excerptText + '\\u201D';
    wrapper.appendChild(excerpt);

    const { form, textarea } = createCommentForm({
      placeholder: 'Comment on selected text...',
      submitLabel: 'Add Comment',
      onSubmit: function(text) {
        vscode.postMessage({
          command: 'addComment',
          selectedText: selData.text,
          contentOffset: selData.contentOffset,
          body: text,
        });
        wrapper.remove();
      }
    });
    // Augment cancel to also remove wrapper
    var cancelBtn = form.querySelector('.btn-cancel');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', function() { wrapper.remove(); });
    }
    wrapper.appendChild(form);
    sidebarContent.insertBefore(wrapper, sidebarContent.firstChild);
    textarea.focus();
  });

  // ── highlight rendering ────────────────────
  function applyHighlights() {
    // Remove existing highlights
    content.querySelectorAll('.comment-highlight').forEach(function(mark) {
      var parent = mark.parentNode;
      while (mark.firstChild) { parent.insertBefore(mark.firstChild, mark); }
      parent.removeChild(mark);
      parent.normalize();
    });

    // Apply highlights for each thread
    threads.forEach(function(thread, threadIndex) {
      var color = thread.color || getThreadColor(threadIndex);
      findAndWrapText(thread.selectedText, thread.occurrenceIndex, color, thread.id);
    });
  }

  function findAndWrapText(searchText, occurrenceIndex, color, threadId) {
    if (!content || !searchText) { return; }

    // Build flat text map from DOM text nodes
    var walker = document.createTreeWalker(content, NodeFilter.SHOW_TEXT, {
      acceptNode: function(node) {
        var parent = node.parentNode;
        while (parent && parent !== content) {
          var tag = parent.nodeName.toLowerCase();
          if (tag === 'script' || tag === 'style') { return NodeFilter.FILTER_REJECT; }
          parent = parent.parentNode;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    });

    var fullText = '';
    var nodes = [];
    var current;
    while ((current = walker.nextNode())) {
      nodes.push({ node: current, offset: fullText.length });
      fullText += current.textContent;
    }

    // Find Nth occurrence
    var found = 0;
    var pos = 0;
    var matchStart = -1;
    while (pos <= fullText.length - searchText.length) {
      var idx = fullText.indexOf(searchText, pos);
      if (idx === -1) { break; }
      if (found === occurrenceIndex) {
        matchStart = idx;
        break;
      }
      found++;
      pos = idx + 1;
    }

    if (matchStart === -1) { return; }
    var matchEnd = matchStart + searchText.length;

    // Find affected text nodes and wrap them
    var affected = [];
    for (var i = 0; i < nodes.length; i++) {
      var nd = nodes[i];
      var nodeEnd = nd.offset + nd.node.textContent.length;
      if (nodeEnd <= matchStart || nd.offset >= matchEnd) { continue; }
      affected.push(nd);
    }

    // Process in reverse to avoid offset shifts
    for (var j = affected.length - 1; j >= 0; j--) {
      var nd = affected[j];
      var nodeLen = nd.node.textContent.length;
      var wrapStart = Math.max(0, matchStart - nd.offset);
      var wrapEnd = Math.min(nodeLen, matchEnd - nd.offset);

      var text = nd.node.textContent;
      var before = text.substring(0, wrapStart);
      var middle = text.substring(wrapStart, wrapEnd);
      var after = text.substring(wrapEnd);

      var parent = nd.node.parentNode;
      var mark = document.createElement('mark');
      mark.className = 'comment-highlight';
      mark.dataset.threadId = threadId;
      mark.style.backgroundColor = color;
      mark.textContent = middle;

      if (after) {
        parent.insertBefore(document.createTextNode(after), nd.node.nextSibling);
      }
      parent.insertBefore(mark, nd.node.nextSibling);
      if (before) {
        nd.node.textContent = before;
      } else {
        parent.removeChild(nd.node);
      }
    }
  }

  // Apply highlights on load
  applyHighlights();

  // ── click highlight → scroll to sidebar thread ──
  content.addEventListener('click', function(e) {
    var mark = e.target.closest('.comment-highlight');
    if (!mark) { return; }
    var threadId = mark.dataset.threadId;
    var threadBlock = document.querySelector('.comment-thread-block[data-thread-id="' + threadId + '"]');
    if (threadBlock) {
      threadBlock.scrollIntoView({ behavior: 'smooth', block: 'center' });
      threadBlock.classList.add('focused');
      if (threadBlock.dataset.collapsible === 'true') { expandThread(threadBlock); }
      // Remove active from other highlights
      content.querySelectorAll('.comment-highlight.active').forEach(function(m) { m.classList.remove('active'); });
      content.querySelectorAll('.comment-highlight[data-thread-id="' + threadId + '"]').forEach(function(m) { m.classList.add('active'); });
    }
  });

  // ── build sidebar thread list ──────────────
  var emptyState = document.createElement('div');
  emptyState.className = 'sidebar-empty';
  emptyState.textContent = 'Select text in the document and click Comment to start a discussion.';

  if (threads.length === 0) {
    sidebarContent.appendChild(emptyState);
  }

  threads.forEach(function(thread, threadIndex) {
    var status = thread.status;
    var color = thread.color || getThreadColor(threadIndex);

    var block = document.createElement('div');
    block.className = 'comment-thread-block ' + status;
    block.dataset.threadId = thread.id;

    // Highlighted text excerpt
    var excerpt = document.createElement('div');
    excerpt.className = 'thread-excerpt';
    excerpt.style.borderLeftColor = color;
    var excerptText = thread.selectedText.length > 60 ? thread.selectedText.substring(0, 60) + '\\u2026' : thread.selectedText;
    excerpt.textContent = '\\u201C' + excerptText + '\\u201D';
    excerpt.addEventListener('click', function(e) {
      e.stopPropagation();
      // Scroll to the highlight in the content
      var marks = content.querySelectorAll('.comment-highlight[data-thread-id="' + thread.id + '"]');
      if (marks.length > 0) {
        marks[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
        content.querySelectorAll('.comment-highlight.active').forEach(function(m) { m.classList.remove('active'); });
        marks.forEach(function(m) { m.classList.add('active'); });
        setTimeout(function() { marks.forEach(function(m) { m.classList.remove('active'); }); }, 2000);
      }
    });
    block.appendChild(excerpt);

    // Status label (only shown for stale threads)
    var statusLabel = document.createElement('div');
    statusLabel.className = 'thread-status-label ' + status;
    if (status === 'stale') {
      var statusText = document.createElement('span');
      statusText.textContent = '\\u26A0 Text Changed';
      statusLabel.appendChild(statusText);
    }

    block.appendChild(statusLabel);

    // Comment entries
    var entryElements = [];
    thread.thread.forEach(function(entry) {
      var entryEl = document.createElement('div');
      entryEl.className = 'comment-entry';

      var header = document.createElement('div');
      header.className = 'comment-header';

      var authorSpan = document.createElement('span');
      authorSpan.className = 'comment-author';
      authorSpan.textContent = entry.author;
      header.appendChild(authorSpan);

      var time = document.createElement('span');
      time.className = 'comment-time';
      try { time.textContent = new Date(entry.created).toLocaleString(); }
      catch (_) { time.textContent = entry.created; }
      header.appendChild(time);

      entryEl.appendChild(header);

      var body = document.createElement('div');
      body.className = 'comment-body';
      body.textContent = entry.body;
      entryEl.appendChild(body);

      // Per-comment action links (only for the comment author)
      if (entry.author === currentUser) {
        var commentActions = document.createElement('div');
        commentActions.className = 'comment-actions';

        var editLink = document.createElement('button');
        editLink.className = 'action-link';
        editLink.textContent = 'Edit';
        editLink.addEventListener('click', function(e) {
          e.stopPropagation();
          var existing = entryEl.querySelector('.comment-form');
          if (existing) { existing.remove(); body.style.display = ''; return; }
          body.style.display = 'none';
          var result = createCommentForm({
            placeholder: 'Edit your comment...',
            submitLabel: 'Save',
            onSubmit: function(text) {
              vscode.postMessage({ command: 'editComment', threadId: thread.id, commentId: entry.id, body: text });
            }
          });
          result.textarea.value = entry.body;
          var formCancelBtn = result.form.querySelector('.btn-cancel');
          if (formCancelBtn) {
            formCancelBtn.addEventListener('click', function() { body.style.display = ''; });
          }
          entryEl.insertBefore(result.form, commentActions);
          result.textarea.focus();
        });
        commentActions.appendChild(editLink);

        var deleteLink = document.createElement('button');
        deleteLink.className = 'action-link';
        deleteLink.textContent = 'Delete';
        deleteLink.addEventListener('click', function(e) {
          e.stopPropagation();
          vscode.postMessage({ command: 'deleteComment', threadId: thread.id, commentId: entry.id });
        });
        commentActions.appendChild(deleteLink);

        entryEl.appendChild(commentActions);
      }

      entryElements.push(entryEl);
    });

    // Collapse/expand logic: show first & last, hide middle
    if (entryElements.length > 2) {
      block.appendChild(entryElements[0]);

      var divider = document.createElement('div');
      divider.className = 'collapsed-divider';
      var moreCount = entryElements.length - 2;
      divider.textContent = moreCount + ' more ' + (moreCount === 1 ? 'reply' : 'replies');
      divider.addEventListener('click', function(e) {
        e.stopPropagation();
        expandThread(block);
      });
      block.appendChild(divider);

      for (var i = 1; i < entryElements.length - 1; i++) {
        entryElements[i].classList.add('collapsed-entry');
        entryElements[i].style.display = 'none';
        block.appendChild(entryElements[i]);
      }

      block.appendChild(entryElements[entryElements.length - 1]);
      block.dataset.collapsible = 'true';
    } else {
      entryElements.forEach(function(el) { block.appendChild(el); });
    }

    // Auto-expand on click
    block.addEventListener('click', function() {
      if (block.dataset.collapsible === 'true' && !block.classList.contains('focused')) {
        expandThread(block);
      }
    });

    // Thread-level actions bar
    var actionsBar = document.createElement('div');
    actionsBar.className = 'thread-actions';

    var replyBtn = document.createElement('button');
    replyBtn.className = 'action-link';
    replyBtn.textContent = '\\u21A9 Reply';
    replyBtn.addEventListener('click', function() {
      var existing = block.querySelector('.comment-form');
      if (existing) { existing.remove(); return; }
      var result = createCommentForm({
        placeholder: 'Write a reply...',
        submitLabel: 'Reply',
        onSubmit: function(text) {
          vscode.postMessage({ command: 'replyComment', threadId: thread.id, body: text });
        }
      });
      block.appendChild(result.form);
      result.textarea.focus();
    });
    actionsBar.appendChild(replyBtn);

    // Delete Thread link — only for the thread creator
    if (thread.thread.length > 0 && thread.thread[0].author === currentUser) {
      var deleteThreadLink = document.createElement('button');
      deleteThreadLink.className = 'action-link';
      deleteThreadLink.textContent = '\\u2715 Delete Thread';
      deleteThreadLink.addEventListener('click', function() {
        vscode.postMessage({ command: 'deleteThread', threadId: thread.id });
      });
      actionsBar.appendChild(deleteThreadLink);
    }

    block.appendChild(actionsBar);
    sidebarContent.appendChild(block);
  });

  // ── thread count badge ─────────────────────
  (function updateThreadCount() {
    var badge = document.getElementById('thread-count-badge');
    if (!badge) { return; }
    badge.textContent = String(threads.length);
    if (threads.length === 0) { badge.style.display = 'none'; }
  })();

})();
`;
