import * as vscode from 'vscode';
import * as path from 'path';
import { sidecarManager } from './sidecarManager';
import type { SidecarChangeEvent } from './sidecarManager';
import { anchorEngine } from './anchorEngine';
import { gitService } from './gitService';
import type { CommentThread as AppCommentThread } from './models/types';
import { v4 as uuidv4 } from 'uuid';
import { findSelectionInRawMarkdown } from './utils/markdown';
import {
  parseSpecitHeader, updateSpecitField,
  inferSpecitDocType, specitDocTypeLabel,
  resolveInternalDocLink,
  EDITABLE_FIELDS, STATUS_OPTIONS,
} from './utils/specit';

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
  private readonly disposables: vscode.Disposable[] = [];
  private updateTimeout: ReturnType<typeof setTimeout> | undefined;
  private _isUpdating = false;
  /** Temporarily suppress follow-active-editor after internal doc navigation */
  private _suppressFollowEditor = false;
  private _suppressFollowTimeout: ReturnType<typeof setTimeout> | undefined;
  /** Navigation history stack for back-button support */
  private _navHistory: vscode.Uri[] = [];
  private readonly styleUri: vscode.Uri;
  private readonly markdownItUri: vscode.Uri;
  private readonly docDirUri: () => vscode.Uri;

  // ───────────────── public API ─────────────────

  /** Set the extension URI (call once during activation). */
  public static setExtensionUri(uri: vscode.Uri): void {
    PreviewPanel.extensionUri = uri;
  }

  /** Create a new preview panel or reveal an existing one. */
  public static async show(document: vscode.TextDocument): Promise<void> {
    // When an editor is open, open beside it and keep focus on the editor.
    // When no editor is open, open in the main column and let the panel take focus
    // so the webview renderer activates reliably.
    const hasEditor = vscode.window.activeTextEditor !== undefined;
    const viewColumn = hasEditor ? vscode.ViewColumn.Beside : vscode.ViewColumn.One;
    const preserveFocus = hasEditor;

    if (PreviewPanel.instance) {
      PreviewPanel.instance.document = document;
      PreviewPanel.instance.panel.reveal(viewColumn, preserveFocus);
      await PreviewPanel.instance.update();
      return;
    }

    if (!PreviewPanel.extensionUri) {
      vscode.window.showErrorMessage('PreviewPanel.extensionUri not set');
      return;
    }

    const localResourceRoots = [
      ...(vscode.workspace.workspaceFolders?.map(f => f.uri) ?? []),
      vscode.Uri.joinPath(PreviewPanel.extensionUri, 'media'),
    ];

    const panel = vscode.window.createWebviewPanel(
      PreviewPanel.viewType,
      `Preview: ${path.basename(document.uri.fsPath)}`,
      { viewColumn, preserveFocus },
      {
        enableScripts: true,
        retainContextWhenHidden: true,
        localResourceRoots,
      },
    );

    PreviewPanel.instance = new PreviewPanel(panel, document);
    await PreviewPanel.instance.update();
  }

  // ───────────────── constructor ─────────────────

  private constructor(panel: vscode.WebviewPanel, document: vscode.TextDocument) {
    this.panel = panel;
    this.document = document;
    this.styleUri = panel.webview.asWebviewUri(
      vscode.Uri.joinPath(PreviewPanel.extensionUri!, 'media', 'preview-styles.css')
    );
    this.markdownItUri = panel.webview.asWebviewUri(
      vscode.Uri.joinPath(PreviewPanel.extensionUri!, 'media', 'markdown-it.min.js')
    );
    this.docDirUri = () => {
      const dirUri = vscode.Uri.file(path.dirname(this.document.uri.fsPath));
      return panel.webview.asWebviewUri(dirUri);
    };

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
        if (this._suppressFollowEditor) { return; }
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

  /**
   * Replace the entire document content via WorkspaceEdit (updates VS Code's
   * in-memory model), save to disk, then refresh the preview.
   */
  private async replaceDocumentContent(newContent: string): Promise<void> {
    const doc = this.document;
    const fullRange = new vscode.Range(
      doc.positionAt(0),
      doc.positionAt(doc.getText().length),
    );
    const edit = new vscode.WorkspaceEdit();
    edit.replace(doc.uri, fullRange, newContent);
    await vscode.workspace.applyEdit(edit);
    await doc.save();
    this.document = doc;
    await this.update();
  }

  // ───────────────── WebView message handler ─────────────────

  private async handleWebViewMessage(msg: { command: string; [key: string]: unknown }): Promise<void> {
    switch (msg.command) {
      case 'refresh': {
        await this.update();
        break;
      }

      case 'addComment': {
        await this.ensureDocumentFresh();
        const selectedText = msg.selectedText as string;
        const body = (msg.body as string || '').trim();
        const contentOffset = (msg.contentOffset as number) || 0;
        if (!selectedText || !body) { return; }

        const author = await gitService.getUserName();
        const rawMarkdown = this.document.getText().replace(/\r\n/g, '\n');

        const match = findSelectionInRawMarkdown(selectedText, rawMarkdown, contentOffset);
        if (!match) {
          vscode.window.showErrorMessage('Could not find selected text in document');
          return;
        }

        const endOffset = match.start + match.text.length;
        const anchor = anchorEngine.createAnchor(match.text, match.start, endOffset, rawMarkdown);

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

      case 'openExternal': {
        const url = msg.url as string;
        if (url && /^https?:\/\//i.test(url)) {
          vscode.commands.executeCommand('simpleBrowser.show', url);
        }
        break;
      }

      case 'openInternalDoc': {
        const relativePath = msg.relativePath as string;
        if (!relativePath) { return; }

        const workspaceFolder = vscode.workspace.getWorkspaceFolder(this.document.uri);
        if (!workspaceFolder) {
          vscode.window.showWarningMessage('Cannot navigate: document is not in a workspace.');
          return;
        }

        const resolved = resolveInternalDocLink(
          this.document.uri.fsPath,
          relativePath,
          workspaceFolder.uri.fsPath,
        );
        if (!resolved) {
          vscode.window.showWarningMessage('Cannot open link: target is not a valid markdown file within the workspace.');
          return;
        }

        try {
          const targetUri = vscode.Uri.file(resolved.filePath);
          const targetDoc = await vscode.workspace.openTextDocument(targetUri);

          // Push current document onto navigation history before switching
          this._navHistory.push(this.document.uri);

          // Suppress follow-editor briefly so the preview doesn't snap back
          this._suppressFollowEditor = true;
          if (this._suppressFollowTimeout) { clearTimeout(this._suppressFollowTimeout); }
          this._suppressFollowTimeout = setTimeout(() => { this._suppressFollowEditor = false; }, 2000);

          this.document = targetDoc;
          this.panel.title = `Preview: ${path.basename(targetDoc.uri.fsPath)}`;
          await this.update();

          // Scroll to fragment if present
          if (resolved.fragment) {
            this.panel.webview.postMessage({ command: 'scrollToFragment', fragment: resolved.fragment });
          }
        } catch {
          vscode.window.showWarningMessage(`Cannot open document: file not found.`);
        }
        break;
      }

      case 'navigateBack': {
        if (this._navHistory.length === 0) { return; }
        const previousUri = this._navHistory.pop()!;
        try {
          const previousDoc = await vscode.workspace.openTextDocument(previousUri);

          this._suppressFollowEditor = true;
          if (this._suppressFollowTimeout) { clearTimeout(this._suppressFollowTimeout); }
          this._suppressFollowTimeout = setTimeout(() => { this._suppressFollowEditor = false; }, 2000);

          this.document = previousDoc;
          this.panel.title = `Preview: ${path.basename(previousDoc.uri.fsPath)}`;
          await this.update();
        } catch {
          vscode.window.showWarningMessage('Cannot navigate back: previous document is no longer available.');
        }
        break;
      }

      case 'editSpecitField': {
        await this.ensureDocumentFresh();
        const fieldName = msg.fieldName as string;
        const newValue = (msg.newValue as string || '').trim();
        if (!fieldName || !newValue) { return; }
        const raw = this.document.getText().replace(/\r\n/g, '\n');
        const updated = updateSpecitField(raw, fieldName, newValue);
        if (updated === raw) { return; }
        await this.replaceDocumentContent(updated);
        break;
      }

      case 'changeSpecitStatus': {
        await this.ensureDocumentFresh();
        const newStatus = (msg.newStatus as string || '').trim();
        if (!newStatus) { return; }
        const raw = this.document.getText().replace(/\r\n/g, '\n');
        const updated = updateSpecitField(raw, 'Status', newStatus);
        if (updated === raw) { return; }
        await this.replaceDocumentContent(updated);
        break;
      }
    }
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
    if (this._isUpdating) { return; }
    this._isUpdating = true;
    try {
    // Ensure document reference is fresh (in case editor tab was closed)
    await this.ensureDocumentFresh();

    const rawMarkdown = this.document.getText().replace(/\r\n/g, '\n');

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
    this.panel.webview.html = this.buildHtml(rawMarkdown, threadsData, currentUser);
    } finally {
      this._isUpdating = false;
    }
  }

  // ───────────────── HTML template ─────────────────

  private buildHtml(
    rawMarkdown: string,
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
    let docTitle = path.basename(this.document.uri.fsPath);
    const docDirBase = this.docDirUri().toString();

    // SPECIT header detection — pass data to WebView JS for in-place replacement
    // SPECIT header detection
    let specitDataJson = 'null';
    let specitStatusRowHtml = '';

    let docSubtitleHtml = '';

    const specitHeader = parseSpecitHeader(rawMarkdown);
    if (specitHeader) {
      const docType = inferSpecitDocType(this.document.uri.fsPath);
      const statusOptions = STATUS_OPTIONS[docType] ?? STATUS_OPTIONS['Other'];
      specitDataJson = JSON.stringify({
        fields: specitHeader.fields,
        editableFields: [...EDITABLE_FIELDS],
        statusOptions,
      }).replace(/</g, '\\u003c');

      // Override title with Project name when available
      if (specitHeader.fields['Project']) {
        docTitle = specitHeader.fields['Project'];
      }

      // Subtitle with the doc type label
      const typeLabel = specitDocTypeLabel(docType);
      if (typeLabel) {
        docSubtitleHtml = `\n          <p class="doc-subtitle">${escapeHtml(typeLabel)}</p>`;
      }

      // Status toggle buttons for the static doc-header
      const statusValue = specitHeader.fields['Status'];
      if (statusValue) {
        const normalized = statusValue.toLowerCase();
        const btns = statusOptions
          .map(opt => {
            const optNorm = opt.toLowerCase();
            const isActive = optNorm === normalized;
            const colorClass = `specit-status-btn-${optNorm}`;
            const activeClass = isActive ? 'specit-status-btn-active' : '';
            return `<button class="specit-status-btn ${colorClass} ${activeClass}" data-status="${escapeHtml(opt)}">${escapeHtml(opt)}</button>`;
          })
          .join('');
        specitStatusRowHtml = `\n        <div class="specit-status-row">${btns}</div>`;
      }
    }

    return /* html */ `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy"
        content="default-src 'none'; style-src ${cspSource} 'unsafe-inline'; script-src ${cspSource} 'unsafe-inline' https://cdn.jsdelivr.net 'nonce-${nonce}' 'unsafe-eval'; img-src ${cspSource} https: data:; font-src ${cspSource};">
  <link href="${this.styleUri}" rel="stylesheet">
  <title>${escapeHtml(docTitle)}</title>
</head>
<body>
  <div id="layout">
    <div id="content-scroll">
      <div class="doc-header">
        <div class="doc-header-row">
          <h1>${escapeHtml(docTitle)}</h1>
          <div class="doc-header-actions">
            <button class="back-btn" id="backBtn" title="Go back to previous document" style="display:${this._navHistory.length > 0 ? 'inline-flex' : 'none'}">&#x2190; Back</button>
            <button class="refresh-btn" id="refreshBtn" title="Refresh document">&#x21bb; Refresh</button>
          </div>
        </div>${docSubtitleHtml}${specitStatusRowHtml}
      </div>
      <div class="find-bar" id="findBar">
        <input type="text" id="findInput" placeholder="Find in document\u2026" autocomplete="off" />
        <span class="find-info" id="findInfo"></span>
        <button id="findPrev" title="Previous match (Shift+Enter)" disabled>&#x25B2;</button>
        <button id="findNext" title="Next match (Enter)" disabled>&#x25BC;</button>
        <button id="findClose" title="Close (Escape)">&#x2715;</button>
      </div>
      <div class="doc-content" id="content"></div>
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
  <script src="${this.markdownItUri}"></script>
  <script src="https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js"></script>
  <script nonce="${nonce}">
    const threads = ${threadsJson};
    const currentUser = ${userJson};
    const rawMarkdown = ${JSON.stringify(rawMarkdown)};
    const docDirBase = ${JSON.stringify(docDirBase)};
    const specitData = ${specitDataJson};
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

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ───────────────── JS (runs inside the WebView) ─────────────────

const PREVIEW_JS = /* js */ `
(function () {
  const vscode = acquireVsCodeApi();
  const contentEl = document.getElementById('content');
  const contentScroll = document.getElementById('content-scroll');
  const sidebarContent = document.getElementById('sidebar-content');
  const toolbar = document.getElementById('comment-toolbar');
  const toolbarBtn = document.getElementById('toolbar-comment-btn');

  // ── client-side markdown rendering ─────────
  function renderMarkdown() {
    if (typeof window.markdownit !== 'function') {
      // markdown-it not yet loaded — retry after window load
      window.addEventListener('load', function() {
        renderMarkdown();
        if (typeof setupSpecitHeader === 'function') { setupSpecitHeader(); }
      }, { once: true });
      return;
    }
    const md = window.markdownit({
      html: true,
      linkify: true,
      typographer: true,
      breaks: false,
    });

    // Mermaid fence renderer
    var diagramCounter = 0;
    const defaultFenceRenderer = md.renderer.rules.fence;
    md.renderer.rules.fence = function(tokens, idx, options, env, self) {
      const token = tokens[idx];
      if (token.info.trim() === 'mermaid') {
        var dId = 'diagram-' + (diagramCounter++);
        return '<div class="mermaid-frame" data-diagram-id="' + dId + '">'
          + '<div class="mermaid-frame-toolbar">'
          + '<span class="diagram-label">&#x1F4CA; Diagram</span>'
          + '<button data-zoom-diagram="' + dId + '" data-zoom-dir="-1" title="Zoom out">&#x2796;</button>'
          + '<span class="zoom-level" id="zoom-label-' + dId + '">100%</span>'
          + '<button data-zoom-diagram="' + dId + '" data-zoom-dir="1" title="Zoom in">&#x2795;</button>'
          + '<button data-reset-diagram="' + dId + '" title="Reset view">Reset</button>'
          + '</div>'
          + '<div class="mermaid-frame-viewport" id="viewport-' + dId + '">'
          + '<div class="mermaid-frame-content" id="content-' + dId + '">'
          + '<div class="mermaid">' + md.utils.escapeHtml(token.content) + '</div>'
          + '</div></div></div>';
      }
      if (defaultFenceRenderer) {
        return defaultFenceRenderer(tokens, idx, options, env, self);
      }
      return '<pre><code>' + md.utils.escapeHtml(token.content) + '</code></pre>';
    };

    // Heading slug renderer
    const defaultHeadingOpen = md.renderer.rules.heading_open;
    md.renderer.rules.heading_open = function(tokens, idx, options, env, self) {
      var token = tokens[idx];
      var nextToken = tokens[idx + 1];
      if (nextToken && nextToken.type === 'inline' && nextToken.content) {
        var slug = nextToken.content
          .toLowerCase()
          .replace(/[^a-z0-9\\s-]/g, '')
          .trim()
          .replace(/\\s+/g, '-')
          .replace(/-+/g, '-');
        token.attrSet('id', slug);
        token.attrSet('data-slug', slug);
        token.attrJoin('class', 'section-heading');
      }
      if (defaultHeadingOpen) {
        return defaultHeadingOpen(tokens, idx, options, env, self);
      }
      return self.renderToken(tokens, idx, options);
    };

    const rendered = md.render(rawMarkdown);
    contentEl.innerHTML = rendered;

    // Checkbox post-processing
    document.querySelectorAll('#content li').forEach(function(li) {
      var text = li.innerHTML;
      if (text.startsWith('[ ] ')) {
        li.innerHTML = '<input type="checkbox" disabled> ' + text.slice(4);
      } else if (text.startsWith('[x] ') || text.startsWith('[X] ')) {
        li.innerHTML = '<input type="checkbox" checked disabled> ' + text.slice(4);
      }
    });

    // Fix relative image paths using the document directory base URI
    document.querySelectorAll('#content img[src]').forEach(function(img) {
      var src = img.getAttribute('src');
      if (src && !/^https?:\\/\\//i.test(src) && !/^data:/i.test(src) && !/^vscode-/i.test(src)) {
        img.setAttribute('src', docDirBase + '/' + src);
      }
    });

    // Rewrite external links to data attributes to avoid VS Code interception
    document.querySelectorAll('#content a[href]').forEach(function(a) {
      var href = a.getAttribute('href');
      if (href && /^https?:\\/\\//i.test(href)) {
        a.setAttribute('data-external-url', href);
        a.setAttribute('href', '#');
      }
    });

    // Mark relative .md links as internal document links for in-preview navigation
    document.querySelectorAll('#content a[href]').forEach(function(a) {
      var href = a.getAttribute('href');
      if (!href || href === '#') { return; }
      // Skip already-handled external links, anchors, and special protocols
      if (a.hasAttribute('data-external-url')) { return; }
      if (/^(?:https?|data|vscode-|mailto):/i.test(href)) { return; }
      if (href.charAt(0) === '#') { return; }
      // Check if the link targets a .md file (with optional #fragment)
      var filePart = href.split('#')[0];
      if (filePart && /\\.md$/i.test(filePart)) {
        a.setAttribute('data-internal-doc', href);
        a.setAttribute('href', '#');
        a.classList.add('internal-doc-link');
      }
    });

    // Initialize mermaid
    if (typeof mermaid !== 'undefined') {
      var isDark = document.body.classList.contains('vscode-dark') ||
                   document.body.classList.contains('vscode-high-contrast');
      mermaid.initialize({
        startOnLoad: true,
        theme: isDark ? 'dark' : 'default',
        securityLevel: 'strict',
      });
    }
  }
  renderMarkdown();

  // ── handle messages from extension host (e.g., scrollToFragment) ──
  window.addEventListener('message', function(event) {
    var msg = event.data;
    if (msg && msg.command === 'scrollToFragment' && msg.fragment) {
      var target = document.getElementById(msg.fragment);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  });

  // ── SPECIT: wire up status buttons in static header + blockquote field card ──
  function setupSpecitHeader() {
    if (!specitData) { return; }

    // Wire up status toggle buttons in the static doc-header
    document.querySelectorAll('.specit-status-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        if (btn.classList.contains('specit-status-btn-active')) { return; }
        var newStatus = btn.getAttribute('data-status');
        if (newStatus) {
          vscode.postMessage({ command: 'changeSpecitStatus', newStatus: newStatus });
        }
      });
    });

    // Replace the first blockquote with an interactive fields card
    var bq = contentEl.querySelector('blockquote');
    if (!bq) { return; }

    var fields = specitData.fields;
    var editableFields = specitData.editableFields;

    var fieldsHtml = '';
    var fieldKeys = Object.keys(fields);
    for (var fi = 0; fi < fieldKeys.length; fi++) {
      var key = fieldKeys[fi];
      var val = fields[key];
      var isEditable = editableFields.indexOf(key) !== -1;
      var editBtn = isEditable
        ? ' <button class="specit-edit-btn" data-field="' + key + '" title="Edit ' + key + '">Edit</button>'
        : '';
      fieldsHtml += '<div class="specit-field" data-field-name="' + key + '">'
        + '<span class="specit-field-label">' + key + ':</span> '
        + '<span class="specit-field-value">' + val + '</span>' + editBtn
        + '</div>';
    }

    var card = document.createElement('div');
    card.className = 'specit-header-card';
    card.innerHTML = fieldsHtml;
    bq.parentNode.replaceChild(card, bq);

    // Wire up inline field editing
    card.querySelectorAll('.specit-edit-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var fieldName = btn.getAttribute('data-field');
        if (!fieldName) { return; }
        var fieldEl = btn.closest('.specit-field');
        if (!fieldEl) { return; }
        var valueEl = fieldEl.querySelector('.specit-field-value');
        if (!valueEl) { return; }
        if (fieldEl.querySelector('.specit-edit-input')) { return; }

        var currentValue = valueEl.textContent || '';
        valueEl.style.display = 'none';
        btn.style.display = 'none';

        var input = document.createElement('input');
        input.type = 'text';
        input.className = 'specit-edit-input';
        input.value = currentValue;
        fieldEl.appendChild(input);
        input.focus();
        input.select();

        function commit() {
          var newValue = input.value.trim();
          if (newValue && newValue !== currentValue) {
            vscode.postMessage({ command: 'editSpecitField', fieldName: fieldName, newValue: newValue });
          } else {
            cancel();
          }
        }
        function cancel() {
          input.remove();
          valueEl.style.display = '';
          btn.style.display = '';
        }

        input.addEventListener('keydown', function(e) {
          if (e.key === 'Enter') { e.preventDefault(); commit(); }
          if (e.key === 'Escape') { e.preventDefault(); cancel(); }
        });
        input.addEventListener('blur', function() {
          setTimeout(function() { if (document.contains(input)) { commit(); } }, 100);
        });
      });
    });
  }
  setupSpecitHeader();

  // ── refresh button ─────────────────────────
  document.getElementById('refreshBtn').addEventListener('click', function() {
    vscode.postMessage({ command: 'refresh' });
  });

  // ── back button ───────────────────────────
  var backBtn = document.getElementById('backBtn');
  if (backBtn) {
    backBtn.addEventListener('click', function() {
      vscode.postMessage({ command: 'navigateBack' });
    });
  }

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

  // ── link handling (external + internal docs) ─────────────────
  contentEl.addEventListener('click', function(e) {
    var anchor = e.target.closest('a');
    if (!anchor) { return; }
    // Internal document link — navigate preview to linked .md file
    var internalDoc = anchor.getAttribute('data-internal-doc');
    if (internalDoc) {
      e.preventDefault();
      vscode.postMessage({ command: 'openInternalDoc', relativePath: internalDoc });
      return;
    }
    // External URL — open in simple browser
    var externalUrl = anchor.getAttribute('data-external-url');
    if (externalUrl) {
      e.preventDefault();
      vscode.postMessage({ command: 'openExternal', url: externalUrl });
    }
  });

  // ── mermaid diagram zoom & pan ─────────────
  var diagramStates = {};

  function getDiagramState(dId) {
    if (!diagramStates[dId]) {
      diagramStates[dId] = { scale: 1, translateX: 0, translateY: 0 };
    }
    return diagramStates[dId];
  }

  function applyTransform(dId) {
    var s = getDiagramState(dId);
    var el = document.getElementById('content-' + dId);
    if (el) {
      var svg = el.querySelector('svg');
      if (svg) {
        if (!s.origWidth) {
          var vb = svg.getAttribute('viewBox');
          if (vb) {
            var parts = vb.split(/[\\s,]+/);
            s.origWidth = parseFloat(parts[2]) || 0;
            s.origHeight = parseFloat(parts[3]) || 0;
          }
          if (!s.origWidth || !s.origHeight) {
            var rect = svg.getBoundingClientRect();
            s.origWidth = s.origWidth || rect.width || 400;
            s.origHeight = s.origHeight || rect.height || 300;
          }
        }
        var newW = s.origWidth * s.scale;
        var newH = s.origHeight * s.scale;
        svg.setAttribute('width', newW + 'px');
        svg.setAttribute('height', newH + 'px');
        svg.style.width = newW + 'px';
        svg.style.height = newH + 'px';
        svg.style.maxWidth = 'none';
      }
      el.style.transform = 'translate(' + s.translateX + 'px, ' + s.translateY + 'px)';
    }
    var label = document.getElementById('zoom-label-' + dId);
    if (label) {
      label.textContent = Math.round(s.scale * 100) + '%';
    }
  }

  function zoomDiagram(dId, direction) {
    var s = getDiagramState(dId);
    var newScale = s.scale + direction * 0.15;
    newScale = Math.max(0.25, Math.min(4, newScale));
    s.scale = Math.round(newScale * 100) / 100;
    applyTransform(dId);
  }

  function resetDiagram(dId) {
    var s = getDiagramState(dId);
    s.scale = 1;
    s.translateX = 0;
    s.translateY = 0;
    applyTransform(dId);
  }

  // Delegated click handler for mermaid toolbar buttons (CSP blocks inline onclick)
  document.addEventListener('click', function(e) {
    var btn = e.target.closest('[data-zoom-diagram], [data-reset-diagram]');
    if (!btn) { return; }
    var zoomId = btn.getAttribute('data-zoom-diagram');
    if (zoomId) {
      var dir = parseInt(btn.getAttribute('data-zoom-dir'), 10) || 1;
      zoomDiagram(zoomId, dir);
      return;
    }
    var resetId = btn.getAttribute('data-reset-diagram');
    if (resetId) {
      resetDiagram(resetId);
    }
  });

  // Attach wheel + drag handlers to all diagram viewports
  (function() {
    function setupViewport(vp) {
      var dId = vp.id.replace('viewport-', '');
      var dragging = false;
      var lastX = 0, lastY = 0;

      vp.addEventListener('mousedown', function(e) {
        if (e.button !== 0) { return; }
        dragging = true;
        lastX = e.clientX;
        lastY = e.clientY;
        vp.classList.add('panning');
        e.preventDefault();
      });

      document.addEventListener('mousemove', function(e) {
        if (!dragging) { return; }
        var s = getDiagramState(dId);
        s.translateX += e.clientX - lastX;
        s.translateY += e.clientY - lastY;
        lastX = e.clientX;
        lastY = e.clientY;
        applyTransform(dId);
      });

      document.addEventListener('mouseup', function() {
        if (dragging) {
          dragging = false;
          vp.classList.remove('panning');
        }
      });

      // Double-click to reset
      vp.addEventListener('dblclick', function() {
        resetDiagram(dId);
      });
    }

    // Wait for Mermaid to finish rendering SVGs
    setTimeout(function() {
      document.querySelectorAll('.mermaid-frame-viewport').forEach(setupViewport);
    }, 500);
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
    preRange.selectNodeContents(contentEl);
    preRange.setEnd(range.startContainer, range.startOffset);
    return preRange.toString().length;
  }

  contentEl.addEventListener('mouseup', function(e) {
    setTimeout(function() {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed || !sel.toString().trim()) {
        toolbar.style.display = 'none';
        pendingSelection = null;
        return;
      }
      // Ensure selection is within #content
      const range = sel.getRangeAt(0);
      if (!contentEl.contains(range.commonAncestorContainer)) {
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
  contentScroll.addEventListener('scroll', function() { toolbar.style.display = 'none'; });
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
    contentEl.querySelectorAll('.comment-highlight').forEach(function(mark) {
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
    if (!contentEl || !searchText) { return; }

    // Build flat text map from DOM text nodes
    var walker = document.createTreeWalker(contentEl, NodeFilter.SHOW_TEXT, {
      acceptNode: function(node) {
        var parent = node.parentNode;
        while (parent && parent !== contentEl) {
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
  contentEl.addEventListener('click', function(e) {
    var mark = e.target.closest('.comment-highlight');
    if (!mark) { return; }
    var threadId = mark.dataset.threadId;
    var threadBlock = document.querySelector('.comment-thread-block[data-thread-id="' + threadId + '"]');
    if (threadBlock) {
      threadBlock.scrollIntoView({ behavior: 'smooth', block: 'center' });
      threadBlock.classList.add('focused');
      if (threadBlock.dataset.collapsible === 'true') { expandThread(threadBlock); }
      // Remove active from other highlights
      contentEl.querySelectorAll('.comment-highlight.active').forEach(function(m) { m.classList.remove('active'); });
      contentEl.querySelectorAll('.comment-highlight[data-thread-id="' + threadId + '"]').forEach(function(m) { m.classList.add('active'); });
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
      var marks = contentEl.querySelectorAll('.comment-highlight[data-thread-id="' + thread.id + '"]');
      if (marks.length > 0) {
        marks[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
        contentEl.querySelectorAll('.comment-highlight.active').forEach(function(m) { m.classList.remove('active'); });
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

  // ── Find / Search feature ──────────────────
  (function() {
    var findBar = document.getElementById('findBar');
    var findInput = document.getElementById('findInput');
    var findInfo = document.getElementById('findInfo');
    var findPrevBtn = document.getElementById('findPrev');
    var findNextBtn = document.getElementById('findNext');
    var findCloseBtn = document.getElementById('findClose');

    var matches = [];
    var currentMatch = -1;
    var originalContentHTML = '';

    function openFindBar() {
      originalContentHTML = originalContentHTML || contentEl.innerHTML;
      findBar.classList.add('visible');
      findInput.focus();
      findInput.select();
    }

    function closeFindBar() {
      findBar.classList.remove('visible');
      clearHighlights();
      findInput.value = '';
      findInfo.textContent = '';
      findPrevBtn.disabled = true;
      findNextBtn.disabled = true;
    }

    function clearHighlights() {
      if (originalContentHTML) {
        contentEl.innerHTML = originalContentHTML;
      }
      matches = [];
      currentMatch = -1;
    }

    function escapeRegex(str) {
      return str.replace(/[.*+?^$\\{\\}()|[\\]\\\\]/g, '\\\\$&');
    }

    function highlightMatches(query) {
      clearHighlights();
      if (!query) {
        findInfo.textContent = '';
        findPrevBtn.disabled = true;
        findNextBtn.disabled = true;
        return;
      }

      var escaped = escapeRegex(query);
      var regex = new RegExp('(' + escaped + ')', 'gi');

      var walker = document.createTreeWalker(contentEl, NodeFilter.SHOW_TEXT, null);
      var textNodes = [];
      while (walker.nextNode()) { textNodes.push(walker.currentNode); }

      var matchIdx = 0;
      textNodes.forEach(function(node) {
        var parent = node.parentNode;
        if (!parent || parent.closest('.find-bar') || parent.tagName === 'SCRIPT' || parent.tagName === 'STYLE') { return; }

        var text = node.nodeValue;
        if (!regex.test(text)) { return; }
        regex.lastIndex = 0;

        var fragment = document.createDocumentFragment();
        var lastIdx = 0;
        var m;
        while ((m = regex.exec(text)) !== null) {
          if (m.index > lastIdx) {
            fragment.appendChild(document.createTextNode(text.slice(lastIdx, m.index)));
          }
          var mk = document.createElement('mark');
          mk.className = 'search-highlight';
          mk.dataset.matchIndex = String(matchIdx++);
          mk.textContent = m[0];
          fragment.appendChild(mk);
          lastIdx = regex.lastIndex;
        }
        if (lastIdx < text.length) {
          fragment.appendChild(document.createTextNode(text.slice(lastIdx)));
        }
        parent.replaceChild(fragment, node);
      });

      matches = contentEl.querySelectorAll('.search-highlight');
      if (matches.length > 0) {
        currentMatch = 0;
        setActiveMatch(0);
        findPrevBtn.disabled = false;
        findNextBtn.disabled = false;
      } else {
        findInfo.textContent = 'No results';
        findPrevBtn.disabled = true;
        findNextBtn.disabled = true;
      }
    }

    function setActiveMatch(idx) {
      matches.forEach(function(m) { m.classList.remove('active'); });
      if (matches.length === 0) { return; }
      currentMatch = idx;
      var el = matches[currentMatch];
      el.classList.add('active');
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      findInfo.textContent = (currentMatch + 1) + ' of ' + matches.length;
    }

    function goNext() {
      if (matches.length === 0) { return; }
      setActiveMatch((currentMatch + 1) % matches.length);
    }

    function goPrev() {
      if (matches.length === 0) { return; }
      setActiveMatch((currentMatch - 1 + matches.length) % matches.length);
    }

    var debounceTimer;
    findInput.addEventListener('input', function() {
      clearTimeout(debounceTimer);
      if (originalContentHTML) { contentEl.innerHTML = originalContentHTML; }
      debounceTimer = setTimeout(function() {
        originalContentHTML = contentEl.innerHTML;
        highlightMatches(findInput.value);
      }, 200);
    });

    findInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); goNext(); }
      if (e.key === 'Enter' && e.shiftKey) { e.preventDefault(); goPrev(); }
      if (e.key === 'Escape') { e.preventDefault(); closeFindBar(); }
    });

    findPrevBtn.addEventListener('click', goPrev);
    findNextBtn.addEventListener('click', goNext);
    findCloseBtn.addEventListener('click', closeFindBar);

    document.addEventListener('keydown', function(e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        openFindBar();
      }
      if (e.key === 'Escape' && findBar.classList.contains('visible')) {
        closeFindBar();
      }
    });
  })();

})();
`;
