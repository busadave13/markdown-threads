import * as vscode from 'vscode';
import { execSync } from 'child_process';
import { simpleGit, SimpleGit } from 'simple-git';

/**
 * Git operations service — provides user identity for comment authoring.
 */
export class GitService {
  private git: SimpleGit | null = null;

  /**
   * Initialize git for the workspace
   */
  async initialize(): Promise<boolean> {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder) {
      console.log('[MarkdownThreads] gitService.initialize: no workspace folder');
      return false;
    }

    console.log('[MarkdownThreads] gitService.initialize: folder =', workspaceFolder.uri.fsPath);
    this.git = simpleGit(workspaceFolder.uri.fsPath);
    
    try {
      const isRepo = await this.git.checkIsRepo();
      console.log('[MarkdownThreads] gitService.initialize: isRepo =', isRepo);
      if (!isRepo) {
        this.git = null;
      }
      return isRepo;
    } catch (err) {
      console.log('[MarkdownThreads] gitService.initialize: error', err);
      this.git = null;
      return false;
    }
  }

  /**
   * Get git user display name (user.name), falling back to user.email
   */
  async getUserName(): Promise<string> {
    // Lazy-init if git wasn't ready at startup
    if (!this.git) {
      console.log('[MarkdownThreads] getUserName: git not initialized, retrying...');
      await this.initialize();
    }

    // Try via simpleGit first
    if (this.git) {
      try {
        const name = await this.git.raw(['config', 'user.name']);
        if (name.trim()) {
          return name.trim();
        }
      } catch {
        // fall through
      }
      try {
        const email = await this.git.raw(['config', 'user.email']);
        if (email.trim()) {
          return email.trim();
        }
      } catch {
        // fall through
      }
    }

    // Fallback: shell out to git directly (works even without a workspace folder)
    console.log('[MarkdownThreads] getUserName: falling back to execSync');
    try {
      const name = execSync('git config --global user.name', { encoding: 'utf8' }).trim();
      if (name) { return name; }
    } catch { /* ignore */ }
    try {
      const email = execSync('git config --global user.email', { encoding: 'utf8' }).trim();
      if (email) { return email; }
    } catch { /* ignore */ }

    return 'Unknown';
  }
}

export const gitService = new GitService();
