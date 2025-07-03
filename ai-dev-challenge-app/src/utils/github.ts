/**
 * Parse GitHub URL to extract owner and repository name
 */
export function parseGitHubUrl(url: string): { owner: string; name: string } {
  const match = url.match(/github\.com\/([^/]+)\/([^/]+)/);
  return match ? { owner: match[1], name: match[2] } : { owner: '', name: '' };
}

/**
 * Generate fork URL for a GitHub repository
 */
export function getForkUrl(repoUrl: string): string {
  const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (match) {
    return `${repoUrl}/fork`;
  }
  return repoUrl;
}

/**
 * Generate pull request URL for a GitHub repository
 */
export function getPullRequestUrl(repoUrl: string): string {
  const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (match) {
    return `${repoUrl}/compare`;
  }
  return repoUrl;
}

/**
 * Format time ago from date string
 */
export function getTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffHours < 1) return 'Just now';
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
} 