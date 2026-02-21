import { Octokit } from '@octokit/rest';
import type { PRResult, ProviderInfo } from '../models/types';
import { authManager } from '../auth/authManager';

/**
 * GitHub PR creation provider
 */
export class GitHubProvider {
  private octokit: Octokit | null = null;

  /**
   * Initialize Octokit with auth token (prompts sign-in if needed)
   */
  async initialize(): Promise<boolean> {
    const token = await authManager.ensureAuthenticated('github');
    if (!token) {
      return false;
    }

    this.octokit = new Octokit({ auth: token });
    return true;
  }

  /**
   * Create a pull request
   */
  async createPullRequest(
    providerInfo: ProviderInfo,
    branchName: string,
    baseBranch: string,
    title: string,
    body: string
  ): Promise<PRResult> {
    if (!this.octokit) {
      const initialized = await this.initialize();
      if (!initialized) {
        return { success: false, error: 'Failed to authenticate with GitHub' };
      }
    }

    try {
      const response = await this.octokit!.pulls.create({
        owner: providerInfo.owner,
        repo: providerInfo.repo,
        title,
        body,
        head: branchName,
        base: baseBranch,
      });

      return {
        success: true,
        prUrl: response.data.html_url,
        prNumber: response.data.number,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error('Failed to create GitHub PR:', error);
      return { success: false, error: message };
    }
  }
}

export const gitHubProvider = new GitHubProvider();
