import React from 'react';
import { useRepositoryStats } from '../../hooks/useGitHubData';
import { Star, GitFork, AlertCircle, Users } from 'lucide-react';

interface Props {
  repoUrl: string;
  description: string;
  contributors: string[];
  demoUrl?: string;
}

export const EnhancedRepositoryCard: React.FC<Props> = ({
  repoUrl,
  description,
  contributors,
  demoUrl
}) => {
  const { repository, repositoryStats, loading, error } = useRepositoryStats(repoUrl);
  
  // Extract repo name from URL for fallback display
  const repoName = repoUrl.split('/').pop()?.replace(/-/g, ' ') || 'Repository';
  const displayName = repository?.name || repoName;

  // Show loading state only if we're actively loading and have no fallback data
  if (loading && !repository) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
        <div className="h-4 bg-gray-200 rounded mb-4"></div>
        <div className="h-3 bg-gray-200 rounded mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-800">
            {displayName}
          </h3>
          <p className="text-gray-600 text-sm">{description}</p>
        </div>
        {repository?.primaryLanguage && (
          <span 
            className="px-2 py-1 rounded text-xs font-medium text-white"
            style={{ backgroundColor: repository.primaryLanguage.color }}
          >
            {repository.primaryLanguage.name}
          </span>
        )}
      </div>

      {/* Live GitHub Stats - Show fallback when not connected */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <Star size={16} className="mr-1" />
          {repository?.stargazerCount || '—'}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <GitFork size={16} className="mr-1" />
          {repository?.forkCount || '—'}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Users size={16} className="mr-1" />
          {contributors.length}
        </div>
      </div>

      {/* Challenge-specific stats - Only show when GitHub data is available */}
      {repositoryStats && (
        <div className="bg-gray-50 rounded p-3 mb-4">
          <h4 className="font-semibold text-sm mb-2">Challenge Stats</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>PRs: {repositoryStats.totalPullRequests}</div>
            <div>Issues: {repositoryStats.totalIssues}</div>
          </div>
        </div>
      )}

      {/* Show connection status when GitHub data isn't available */}
      {error && !repository && (
        <div className="bg-blue-50 rounded p-3 mb-4 border border-blue-200">
          <div className="flex items-center text-sm text-blue-700">
            <AlertCircle className="mr-2" size={16} />
            <span>
              {error.message?.includes('401') || error.message?.includes('403') 
                ? 'Connect GitHub to see live stats'
                : 'GitHub data temporarily unavailable'
              }
            </span>
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-2">
        <a
          href={repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700 transition-colors text-center"
        >
          View Repository
        </a>
        {demoUrl && (
          <a
            href={demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-green-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-green-700 transition-colors text-center"
          >
            View Demo
          </a>
        )}
      </div>
    </div>
  );
}; 