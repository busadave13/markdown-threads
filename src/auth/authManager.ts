import * as vscode from 'vscode';
import type { GitProvider, ProviderInfo } from '../models/types';

const GITHUB_SCOPES = ['repo', 'read:user'];
// Azure DevOps resource ID (https://learn.microsoft.com/en-us/azure/devops/integrate/get-started/authentication/oauth?view=azure-devops#scopes)
const MICROSOFT_SCOPES = ['499b84ac-1321-427f-aa17-267ca6975798/.default'];

/**
 * Manages authentication with GitHub and Azure DevOps
 */
export class AuthManager {
  /**
   * Get a GitHub authentication token (silent — returns null if not signed in)
   */
  async getGitHubToken(): Promise<string | null> {
    try {
      const session = await vscode.authentication.getSession('github', GITHUB_SCOPES, {
        createIfNone: false,
      });
      return session?.accessToken ?? null;
    } catch (error) {
      console.error('Failed to get GitHub token:', error);
      return null;
    }
  }

  /**
   * Get an Azure DevOps authentication token (silent — returns null if not signed in)
   */
  async getAzureDevOpsToken(): Promise<string | null> {
    try {
      const session = await vscode.authentication.getSession('microsoft', MICROSOFT_SCOPES, {
        createIfNone: false,
      });
      return session?.accessToken ?? null;
    } catch (error) {
      console.error('Failed to get Azure DevOps token:', error);
      return null;
    }
  }

  /**
   * Ensure the user is authenticated for the given provider (prompts sign-in if needed).
   * Call this only when the user explicitly triggers a publish action.
   */
  async ensureAuthenticated(provider: GitProvider): Promise<string | null> {
    try {
      switch (provider) {
        case 'github': {
          const session = await vscode.authentication.getSession('github', GITHUB_SCOPES, {
            createIfNone: true,
          });
          return session?.accessToken ?? null;
        }
        case 'azuredevops': {
          const session = await vscode.authentication.getSession('microsoft', MICROSOFT_SCOPES, {
            createIfNone: true,
          });
          return session?.accessToken ?? null;
        }
        default:
          return null;
      }
    } catch (error) {
      console.error(`Failed to authenticate with ${provider}:`, error);
      return null;
    }
  }

  /**
   * Get token for the specified provider (silent)
   */
  async getToken(provider: GitProvider): Promise<string | null> {
    switch (provider) {
      case 'github':
        return this.getGitHubToken();
      case 'azuredevops':
        return this.getAzureDevOpsToken();
      default:
        return null;
    }
  }

  /**
   * Detect the git provider from remote URL
   */
  detectProvider(remoteUrl: string): GitProvider {
    if (remoteUrl.includes('github.com')) {
      return 'github';
    }
    if (remoteUrl.includes('dev.azure.com') || remoteUrl.includes('visualstudio.com')) {
      return 'azuredevops';
    }
    return 'unknown';
  }

  /**
   * Parse owner and repo from remote URL
   */
  parseRemoteUrl(remoteUrl: string): ProviderInfo | null {
    const provider = this.detectProvider(remoteUrl);

    // GitHub: https://github.com/owner/repo.git or git@github.com:owner/repo.git
    if (provider === 'github') {
      const httpsMatch = remoteUrl.match(/github\.com\/([^/]+)\/([^/.]+)/);
      const sshMatch = remoteUrl.match(/github\.com:([^/]+)\/([^/.]+)/);
      const match = httpsMatch || sshMatch;
      
      if (match) {
        return {
          provider,
          owner: match[1],
          repo: match[2].replace(/\.git$/, ''),
          remoteUrl,
        };
      }
    }

    // Azure DevOps: https://dev.azure.com/org/project/_git/repo
    if (provider === 'azuredevops') {
      const match = remoteUrl.match(/dev\.azure\.com\/([^/]+)\/([^/]+)\/_git\/([^/.]+)/);
      if (match) {
        return {
          provider,
          owner: `${match[1]}/${match[2]}`, // org/project
          repo: match[3],
          remoteUrl,
        };
      }

      // Legacy: https://org.visualstudio.com/project/_git/repo
      const legacyMatch = remoteUrl.match(/([^/.]+)\.visualstudio\.com\/([^/]+)\/_git\/([^/.]+)/);
      if (legacyMatch) {
        return {
          provider,
          owner: `${legacyMatch[1]}/${legacyMatch[2]}`,
          repo: legacyMatch[3],
          remoteUrl,
        };
      }
    }

    return null;
  }
}

export const authManager = new AuthManager();
