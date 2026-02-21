import * as azdev from 'azure-devops-node-api';
import type { PRResult, ProviderInfo } from '../models/types';
import { authManager } from '../auth/authManager';

/**
 * Azure DevOps PR creation provider
 */
export class AdoProvider {
  private connection: azdev.WebApi | null = null;

  /**
   * Initialize Azure DevOps connection (prompts sign-in if needed)
   */
  async initialize(orgUrl: string): Promise<boolean> {
    const token = await authManager.ensureAuthenticated('azuredevops');
    if (!token) {
      return false;
    }

    try {
      const authHandler = azdev.getBearerHandler(token);
      this.connection = new azdev.WebApi(orgUrl, authHandler);
      return true;
    } catch (error) {
      console.error('Failed to initialize ADO connection:', error);
      return false;
    }
  }

  /**
   * Parse org URL from provider info
   */
  private getOrgUrl(providerInfo: ProviderInfo): string {
    // owner is "org/project" for ADO
    const org = providerInfo.owner.split('/')[0];
    return `https://dev.azure.com/${org}`;
  }

  /**
   * Parse project from provider info
   */
  private getProject(providerInfo: ProviderInfo): string {
    const parts = providerInfo.owner.split('/');
    return parts[1] || parts[0];
  }

  /**
   * Create a pull request
   */
  async createPullRequest(
    providerInfo: ProviderInfo,
    branchName: string,
    baseBranch: string,
    title: string,
    description: string
  ): Promise<PRResult> {
    const orgUrl = this.getOrgUrl(providerInfo);
    
    if (!this.connection) {
      const initialized = await this.initialize(orgUrl);
      if (!initialized) {
        return { success: false, error: 'Failed to authenticate with Azure DevOps' };
      }
    }

    try {
      const gitApi = await this.connection!.getGitApi();
      const project = this.getProject(providerInfo);

      const pr = await gitApi.createPullRequest(
        {
          sourceRefName: `refs/heads/${branchName}`,
          targetRefName: `refs/heads/${baseBranch}`,
          title,
          description,
        },
        providerInfo.repo,
        project
      );

      if (!pr.pullRequestId) {
        return { success: false, error: 'PR created but no ID returned' };
      }

      const prUrl = `${orgUrl}/${project}/_git/${providerInfo.repo}/pullrequest/${pr.pullRequestId}`;

      return {
        success: true,
        prUrl,
        prNumber: pr.pullRequestId,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error('Failed to create ADO PR:', error);
      return { success: false, error: message };
    }
  }
}

export const adoProvider = new AdoProvider();
