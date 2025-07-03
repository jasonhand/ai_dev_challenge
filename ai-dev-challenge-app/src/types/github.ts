// Define interfaces for GitHub API responses
export interface Repository {
  id: string;
  name: string;
  owner: {
    login: string;
    avatarUrl: string;
  };
  description: string;
  stargazerCount: number;
  forkCount: number;
  primaryLanguage: {
    name: string;
    color: string;
  };
  createdAt: string;
  updatedAt: string;
  defaultBranch: string;
}

export interface Contributor {
  login: string;
  avatarUrl: string;
  contributions: number;
  name: string;
}

export interface CommitActivity {
  committedDate: string;
  author: {
    user: {
      login: string;
      avatarUrl: string;
    };
  };
  message: string;
  additions: number;
  deletions: number;
}

export interface RepositoryStats {
  totalCommits: number;
  totalPullRequests: number;
  totalIssues: number;
  contributors: Contributor[];
  languages: { [key: string]: number };
  weeklyActivity: number[];
} 