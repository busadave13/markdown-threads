import * as vscode from 'vscode';
import * as path from 'path';
import { sidecarManager } from './sidecarManager';

/**
 * Represents a markdown file in the tree view.
 */
export class MarkdownFileItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly uri: vscode.Uri,
    public readonly commentCount: number,
  ) {
    super(label, vscode.TreeItemCollapsibleState.None);

    this.resourceUri = uri;
    this.tooltip = uri.fsPath;
    this.contextValue = 'markdownFile';

    // Click action opens preview
    this.command = {
      command: 'markdownThreads.openPreview',
      title: 'Open Preview',
      arguments: [uri],
    };

    // Show comment count as description
    if (commentCount > 0) {
      this.description = `${commentCount} comment${commentCount > 1 ? 's' : ''}`;
    }

    // Use markdown icon
    this.iconPath = new vscode.ThemeIcon('markdown');
  }
}

/**
 * Represents a folder containing markdown files.
 */
export class FolderItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly folderPath: string,
    public readonly children: (MarkdownFileItem | FolderItem)[],
    relativePath?: string,
  ) {
    super(label, vscode.TreeItemCollapsibleState.Expanded);
    this.contextValue = 'folder';
    this.iconPath = vscode.ThemeIcon.Folder;
    this.tooltip = relativePath ?? folderPath;
  }
}

type TreeItem = MarkdownFileItem | FolderItem;

/**
 * Represents a node in the intermediate nested-tree structure produced by
 * {@link buildNestedTree}. This is a plain data structure (no VS Code types)
 * so it can be unit-tested without mocking the editor APIs.
 */
export interface NestedFolderNode<T = unknown> {
  kind: 'folder';
  /** Leaf segment, e.g. "Mockery". */
  name: string;
  /** Full relative path from workspace root, using the platform separator. */
  relativePath: string;
  children: NestedNode<T>[];
}

export interface NestedFileNode<T = unknown> {
  kind: 'file';
  /** File name, e.g. "PRD.md". */
  name: string;
  /** Full relative path from workspace root, using the platform separator. */
  relativePath: string;
  payload: T;
}

export type NestedNode<T = unknown> = NestedFolderNode<T> | NestedFileNode<T>;

export interface NestedEntry<T = unknown> {
  /** Relative path from workspace root, using the platform separator. */
  relativePath: string;
  payload: T;
}

/**
 * Builds a nested folder tree from a flat list of file entries. Pure helper —
 * does not touch VS Code APIs, so it is safe to unit-test directly.
 *
 * Sorting at every level: folders first (alphabetical, case-insensitive), then
 * files (alphabetical, case-insensitive).
 */
export function buildNestedTree<T>(entries: NestedEntry<T>[]): NestedNode<T>[] {
  const root: NestedFolderNode<T> = {
    kind: 'folder',
    name: '',
    relativePath: '',
    children: [],
  };

  for (const entry of entries) {
    const normalized = entry.relativePath.replace(/\\/g, '/').replace(/^\/+|\/+$/g, '');
    if (normalized.length === 0) {
      continue;
    }
    const parts = normalized.split('/');
    const fileName = parts.pop()!;

    let current = root;
    const accumulated: string[] = [];
    for (const segment of parts) {
      accumulated.push(segment);
      let next = current.children.find(
        (c): c is NestedFolderNode<T> => c.kind === 'folder' && c.name === segment,
      );
      if (!next) {
        next = {
          kind: 'folder',
          name: segment,
          relativePath: accumulated.join(path.sep),
          children: [],
        };
        current.children.push(next);
      }
      current = next;
    }

    current.children.push({
      kind: 'file',
      name: fileName,
      relativePath: parts.length === 0 ? fileName : [...parts, fileName].join(path.sep),
      payload: entry.payload,
    });
  }

  sortNodes(root);
  return root.children;
}

function sortNodes<T>(node: NestedFolderNode<T>): void {
  node.children.sort((a, b) => {
    if (a.kind !== b.kind) {
      return a.kind === 'folder' ? -1 : 1;
    }
    return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
  });
  for (const child of node.children) {
    if (child.kind === 'folder') {
      sortNodes(child);
    }
  }
}

/**
 * Builds a glob exclude pattern from an array of folder names.
 * Returns a brace-expanded glob string or undefined if the array is empty.
 */
export function buildExcludePattern(folders: string[]): string | undefined {
  const filtered = folders.filter(f => f.length > 0);
  if (filtered.length === 0) {
    return undefined;
  }
  if (filtered.length === 1) {
    return `**/${filtered[0]}/**`;
  }
  const parts = filtered.map(f => `**/${f}/**`);
  return `{${parts.join(',')}}`;
}

/**
 * Provides markdown files for the sidebar tree view.
 */
export class MarkdownFilesProvider implements vscode.TreeDataProvider<TreeItem> {
  private _onDidChangeTreeData = new vscode.EventEmitter<TreeItem | undefined | null | void>();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  private fileWatcher: vscode.FileSystemWatcher | undefined;
  private sidecarWatcher: vscode.FileSystemWatcher | undefined;
  private configWatcher: vscode.Disposable | undefined;
  private selectedFolder: string | undefined; // undefined = show all folders

  constructor() {
    // Watch for markdown file changes
    this.fileWatcher = vscode.workspace.createFileSystemWatcher('**/*.md');
    this.fileWatcher.onDidCreate(() => this.refresh());
    this.fileWatcher.onDidDelete(() => this.refresh());
    this.fileWatcher.onDidChange(() => this.refresh());

    // Watch for sidecar file changes (comment count updates)
    this.sidecarWatcher = vscode.workspace.createFileSystemWatcher('**/*.comments.json');
    this.sidecarWatcher.onDidCreate(() => this.refresh());
    this.sidecarWatcher.onDidDelete(() => this.refresh());
    this.sidecarWatcher.onDidChange(() => this.refresh());

    // Refresh tree when exclude folders setting changes
    this.configWatcher = vscode.workspace.onDidChangeConfiguration(e => {
      if (e.affectsConfiguration('markdownThreads.excludeFolders')) {
        this.refresh();
      }
    });
  }

  /**
   * Shows a QuickPick to select a folder to filter markdown files.
   */
  async selectFolder(): Promise<void> {
    const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
    if (!workspaceRoot) {
      return;
    }

    // Find all directories containing markdown files
    const excludeFolders = vscode.workspace.getConfiguration('markdownThreads').get<string[]>('excludeFolders', []);
    const excludePattern = buildExcludePattern(excludeFolders);
    const mdFiles = await vscode.workspace.findFiles('**/*.md', excludePattern);
    const folders = new Set<string>();
    folders.add(''); // Root option (show all)

    for (const file of mdFiles) {
      const relativePath = path.relative(workspaceRoot, file.fsPath);
      const dir = path.dirname(relativePath);
      if (dir !== '.') {
        // Add all parent directories
        const parts = dir.split(path.sep);
        let current = '';
        for (const part of parts) {
          current = current ? path.join(current, part) : part;
          folders.add(current);
        }
      }
    }

    // Build QuickPick items
    const items: vscode.QuickPickItem[] = [
      { label: '$(home) All Folders', description: 'Show all markdown files', detail: '' },
    ];

    const sortedFolders = Array.from(folders).filter(f => f !== '').sort();
    for (const folder of sortedFolders) {
      items.push({
        label: `$(folder) ${folder}`,
        description: '',
        detail: folder,
      });
    }

    const selected = await vscode.window.showQuickPick(items, {
      placeHolder: 'Select a folder to filter markdown files',
      title: 'Filter by Folder',
    });

    if (selected) {
      this.selectedFolder = selected.detail || undefined;
      this.refresh();
    }
  }

  /**
   * Gets the currently selected folder name for display.
   */
  getSelectedFolderName(): string {
    return this.selectedFolder || 'All Folders';
  }

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: TreeItem): vscode.TreeItem {
    return element;
  }

  async getChildren(element?: TreeItem): Promise<TreeItem[]> {
    if (!vscode.workspace.workspaceFolders) {
      return [];
    }

    if (element instanceof FolderItem) {
      return element.children;
    }

    if (element) {
      return [];
    }

    const workspaceRoot = vscode.workspace.workspaceFolders[0].uri.fsPath;

    // Build search pattern based on selected folder
    const searchPattern = this.selectedFolder
      ? `${this.selectedFolder}/**/*.md`
      : '**/*.md';

    // Find markdown files (filtered by folder if selected, excluding configured folders)
    const excludeFolders = vscode.workspace.getConfiguration('markdownThreads').get<string[]>('excludeFolders', []);
    const excludePattern = buildExcludePattern(excludeFolders);
    let mdFiles = await vscode.workspace.findFiles(searchPattern, excludePattern);

    // If a folder is selected, also filter to ensure files are within that folder
    if (this.selectedFolder) {
      const selectedPath = path.join(workspaceRoot, this.selectedFolder);
      mdFiles = mdFiles.filter(uri => uri.fsPath.startsWith(selectedPath));
    }

    if (mdFiles.length === 0) {
      return [];
    }

    // Build tree structure grouped by folder
    const tree = await this.buildTree(mdFiles);
    return tree;
  }

  private async buildTree(files: vscode.Uri[]): Promise<TreeItem[]> {
    const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath ?? '';

    // Resolve comment counts in parallel and build flat entry list.
    const entries: NestedEntry<{ uri: vscode.Uri; commentCount: number }>[] = await Promise.all(
      files.map(async file => ({
        relativePath: path.relative(workspaceRoot, file.fsPath),
        payload: {
          uri: file,
          commentCount: await this.getCommentCount(file.fsPath),
        },
      })),
    );

    const nested = buildNestedTree(entries);
    return nested.map(node => this.toTreeItem(node, workspaceRoot));
  }

  private toTreeItem(
    node: NestedNode<{ uri: vscode.Uri; commentCount: number }>,
    workspaceRoot: string,
  ): TreeItem {
    if (node.kind === 'file') {
      return new MarkdownFileItem(node.name, node.payload.uri, node.payload.commentCount);
    }
    const children = node.children.map(child => this.toTreeItem(child, workspaceRoot));
    return new FolderItem(
      node.name,
      path.join(workspaceRoot, node.relativePath),
      children,
      node.relativePath,
    );
  }

  private async getCommentCount(filePath: string): Promise<number> {
    const sidecar = await sidecarManager.readSidecar(filePath);
    return sidecar?.comments.length ?? 0;
  }

  dispose(): void {
    this.fileWatcher?.dispose();
    this.sidecarWatcher?.dispose();
    this.configWatcher?.dispose();
    this._onDidChangeTreeData.dispose();
  }
}
