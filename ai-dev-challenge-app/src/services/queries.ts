import { gql } from '@apollo/client';

export const GET_REPOSITORY_STATS = gql`
  query GetRepositoryStats($owner: String!, $name: String!) {
    repository(owner: $owner, name: $name) {
      id
      name
      description
      stargazerCount
      forkCount
      primaryLanguage {
        name
        color
      }
      createdAt
      updatedAt
      defaultBranch: defaultBranchRef {
        name
      }
      pullRequests(states: [OPEN, CLOSED, MERGED]) {
        totalCount
      }
      issues(states: [OPEN, CLOSED]) {
        totalCount
      }
      languages(first: 10) {
        edges {
          size
          node {
            name
            color
          }
        }
      }
    }
  }
`;

export const GET_REPOSITORY_CONTRIBUTORS = gql`
  query GetRepositoryContributors($owner: String!, $name: String!) {
    repository(owner: $owner, name: $name) {
      collaborators(first: 100) {
        nodes {
          login
          avatarUrl
          name
        }
      }
    }
  }
`;

export const GET_COMMIT_ACTIVITY = gql`
  query GetCommitActivity($owner: String!, $name: String!, $since: GitTimestamp!) {
    repository(owner: $owner, name: $name) {
      defaultBranchRef {
        target {
          ... on Commit {
            history(first: 100, since: $since) {
              nodes {
                committedDate
                message
                additions
                deletions
                author {
                  user {
                    login
                    avatarUrl
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`; 