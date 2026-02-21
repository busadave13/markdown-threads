import * as vscode from 'vscode';
import * as path from 'path';
import { sidecarManager } from './sidecarManager';
import { anchorEngine } from './anchorEngine';

/**
 * Provides gutter decorations showing comment bubbles
 */
export class DecorationProvider implements vscode.Disposable {
  private openDecoration: vscode.TextEditorDecorationType;
  private resolvedDecoration: vscode.TextEditorDecorationType;
  private staleDecoration: vscode.TextEditorDecorationType;
  private disposables: vscode.Disposable[] = [];

  constructor(extensionPath: string) {
    this.openDecoration = vscode.window.createTextEditorDecorationType({
      gutterIconPath: path.join(extensionPath, 'media', 'comment-bubble.svg'),
      gutterIconSize: 'contain',
    });

    this.resolvedDecoration = vscode.window.createTextEditorDecorationType({
      gutterIconPath: path.join(extensionPath, 'media', 'comment-resolved.svg'),
      gutterIconSize: 'contain',
    });

    this.staleDecoration = vscode.window.createTextEditorDecorationType({
      gutterIconPath: path.join(extensionPath, 'media', 'comment-stale.svg'),
      gutterIconSize: 'contain',
    });

    this.disposables.push(
      this.openDecoration,
      this.resolvedDecoration,
      this.staleDecoration
    );
  }

  /**
   * Update decorations for a document
   */
  async updateDecorations(editor: vscode.TextEditor): Promise<void> {
    const document = editor.document;
    
    if (document.languageId !== 'markdown') {
      this.clearDecorations(editor);
      return;
    }

    if (!this.isMarkdownFile(document)) {
      this.clearDecorations(editor);
      return;
    }

    const sidecar = await sidecarManager.readSidecar(document.uri.fsPath);
    if (!sidecar || sidecar.comments.length === 0) {
      this.clearDecorations(editor);
      return;
    }

    const sections = anchorEngine.getSections(document);
    
    const openRanges: vscode.DecorationOptions[] = [];
    const resolvedRanges: vscode.DecorationOptions[] = [];
    const staleRanges: vscode.DecorationOptions[] = [];

    for (const thread of sidecar.comments) {
      const result = anchorEngine.findAnchoredSection(sections, thread.anchor);
      if (!result) {
        continue;
      }

      const range = anchorEngine.getSectionRange(document, result.section);
      const threadCount = thread.thread.length;
      const firstComment = thread.thread[0]?.body ?? '';
      const preview = firstComment.length > 50 
        ? firstComment.substring(0, 50) + '...' 
        : firstComment;

      const decoration: vscode.DecorationOptions = {
        range,
        hoverMessage: new vscode.MarkdownString(
          `**${threadCount} comment${threadCount > 1 ? 's' : ''}**\n\n${preview}`
        ),
      };

      if (result.isStale || thread.status === 'stale') {
        staleRanges.push(decoration);
      } else if (thread.status === 'resolved') {
        resolvedRanges.push(decoration);
      } else {
        openRanges.push(decoration);
      }
    }

    editor.setDecorations(this.openDecoration, openRanges);
    editor.setDecorations(this.resolvedDecoration, resolvedRanges);
    editor.setDecorations(this.staleDecoration, staleRanges);
  }

  /**
   * Clear all decorations from an editor
   */
  clearDecorations(editor: vscode.TextEditor): void {
    editor.setDecorations(this.openDecoration, []);
    editor.setDecorations(this.resolvedDecoration, []);
    editor.setDecorations(this.staleDecoration, []);
  }

  /**
   * Check if document is a markdown file eligible for decorations.
   * Any .md file in the workspace can receive comments (Issue #2).
   */
  private isMarkdownFile(document: vscode.TextDocument): boolean {
    return document.languageId === 'markdown';
  }

  dispose(): void {
    for (const d of this.disposables) {
      d.dispose();
    }
  }
}
