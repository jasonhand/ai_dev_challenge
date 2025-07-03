import { useQuery } from '@apollo/client';
import { GET_REPOSITORY_STATS } from '../services/queries';
import { RepositoryStats } from '../types/github';
import { parseGitHubUrl } from '../utils/github';

export const useRepositoryStats = (repoUrl: string) => {
  const { owner, name } = parseGitHubUrl(repoUrl);
  
  const { data, loading, error, refetch } = useQuery(GET_REPOSITORY_STATS, {
    variables: { owner, name },
    skip: !owner || !name,
    pollInterval: 300000, // Poll every 5 minutes
  });

  const repositoryStats: RepositoryStats | null = data?.repository ? {
    totalCommits: 0, // Will be populated by commit activity query
    totalPullRequests: data.repository.pullRequests.totalCount,
    totalIssues: data.repository.issues.totalCount,
    contributors: [],
    languages: data.repository.languages.edges.reduce((acc: any, edge: any) => {
      acc[edge.node.name] = edge.size;
      return acc;
    }, {}),
    weeklyActivity: [], // Will be calculated from commit activity
  } : null;

  return {
    repository: data?.repository,
    repositoryStats,
    loading,
    error,
    refetch,
  };
}; 