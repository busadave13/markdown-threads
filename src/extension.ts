import * as vscode from 'vscode';
import { gitService } from './gitService';
import { PreviewPanel } from './previewPanel';
import { MarkdownFilesProvider } from './markdownFilesProvider';

let markdownFilesProvider: MarkdownFilesProvider;

export async function activate(context: vscode.ExtensionContext) {
  console.log('[MarkdownReview] Extension activating...');
  console.log('[MarkdownReview] Workspace folders:', vscode.workspace.workspaceFolders?.map(f => f.uri.fsPath));

  // Set extension URI for PreviewPanel to locate bundled resources (e.g., media/)
  PreviewPanel.setExtensionUri(context.extensionUri);

  // Create and register the tree view for markdown files
  markdownFilesProvider = new MarkdownFilesProvider();
  const treeView = vscode.window.createTreeView('markdownReview.files', {
    treeDataProvider: markdownFilesProvider,
    showCollapseAll: true,
  });
  context.subscriptions.push(treeView);
  context.subscriptions.push({ dispose: () => markdownFilesProvider.dispose() });

  // Update tree view description when folder selection changes
  markdownFilesProvider.onDidChangeTreeData(() => {
    treeView.description = markdownFilesProvider.getSelectedFolderName();
  });

  // Register commands
  context.subscriptions.push(
    vscode.commands.registerCommand('markdownReview.refreshFiles', () => markdownFilesProvider.refresh()),
    vscode.commands.registerCommand('markdownReview.selectFolder', () => markdownFilesProvider.selectFolder()),
    vscode.commands.registerCommand('markdownReview.openPreview', async (uri?: vscode.Uri) => {
      let document: vscode.TextDocument | undefined;
      if (uri) {
        // Invoked from explorer context menu or tree view — load document without opening an editor
        document = await vscode.workspace.openTextDocument(uri);
        // Close any editor tab the explorer may have opened BEFORE showing preview
        // to avoid active-editor-change events triggering a spurious re-render
        for (const tabGroup of vscode.window.tabGroups.all) {
          for (const tab of tabGroup.tabs) {
            const tabUri = (tab.input as { uri?: vscode.Uri })?.uri;
            if (tabUri && tabUri.toString() === uri.toString()) {
              await vscode.window.tabGroups.close(tab);
            }
          }
        }
        await PreviewPanel.show(document);
        return;
      } else {
        // Invoked from command palette or editor title
        const editor = vscode.window.activeTextEditor;
        if (editor && editor.document.languageId === 'markdown') {
          document = editor.document;
        }
      }
      if (!document || document.languageId !== 'markdown') {
        vscode.window.showWarningMessage('Open a markdown file to preview with comments');
        return;
      }
      await PreviewPanel.show(document);
    })
  );

  // Initialize git service for user name detection
  try {
    await gitService.initialize();
  } catch (err) {
    console.error('[MarkdownReview] Git initialization failed:', err);
  }
}

export function deactivate() {
  // Cleanup handled by disposables
}
