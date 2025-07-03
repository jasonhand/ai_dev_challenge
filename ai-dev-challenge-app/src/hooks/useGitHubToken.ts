import { useState, useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';
import { GitHubAuth } from '../services/githubAuth';

const VALIDATE_TOKEN = gql`
  query ValidateToken {
    viewer {
      login
      name
      avatarUrl
    }
  }
`;

export const useGitHubToken = () => {
  const [isValidating, setIsValidating] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [lastValidationTime, setLastValidationTime] = useState<number>(0);

  const token = GitHubAuth.getStoredToken();

  const { data, loading, error, refetch } = useQuery(VALIDATE_TOKEN, {
    skip: !token,
    errorPolicy: 'all',
    // Disable automatic refetching to avoid rate limits
    pollInterval: 0,
    notifyOnNetworkStatusChange: false,
    // Use cache-first to reduce API calls
    fetchPolicy: 'cache-first',
  });

  useEffect(() => {
    console.log('Token validation effect:', { 
      hasToken: !!token, 
      loading, 
      hasData: !!data?.viewer, 
      hasError: !!error,
      errorMessage: error?.message 
    });
    
    if (token && !loading) {
      if (data?.viewer) {
        console.log('Token is valid, user:', data.viewer.login);
        setIsValid(true);
        setUser(data.viewer);
      } else if (error) {
        console.log('Token validation error:', error.message);
        // Check if it's a rate limit error
        if (error.message && error.message.includes('rate limit exceeded')) {
          console.log('Rate limit exceeded - token is likely valid but API is throttled');
          // For rate limit errors, we'll assume the token is valid but API is throttled
          // We'll keep the token and show a message to the user
          setIsValid(true);
          setUser({ login: 'Rate Limited', name: 'GitHub API Rate Limited' });
        } else {
          console.log('Clearing invalid token');
          setIsValid(false);
          setUser(null);
          // Token is invalid, clear it
          GitHubAuth.clearToken();
        }
      }
    } else if (!token) {
      console.log('No token available');
      setIsValid(false);
      setUser(null);
    }
  }, [token, data, loading, error]);

  const validateToken = async () => {
    // Prevent too frequent validation attempts
    const now = Date.now();
    if (now - lastValidationTime < 5000) { // 5 second cooldown
      console.log('Skipping token validation - too soon since last attempt');
      return;
    }
    
    setIsValidating(true);
    setLastValidationTime(now);
    
    try {
      await refetch();
    } finally {
      setIsValidating(false);
    }
  };

  return {
    token,
    isValid,
    isValidating,
    user,
    validateToken,
    clearToken: GitHubAuth.clearToken,
  };
}; 