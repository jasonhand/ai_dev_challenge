import React, { useState, useEffect, useCallback } from 'react';
import { Github, ExternalLink, Calendar, Users, Code, Zap, Settings, Plus, X, Trash2, BookOpen, Share2, Copy } from 'lucide-react';
import { DatadogRUM, useDatadogTracking } from './components/DatadogRUM';
import { ErrorBoundary } from './components/ErrorBoundary';
import { GitWorkflowGuide } from './components/GitWorkflowGuide';

interface RepoConfig {
  id: number;
  name: string;
  description: string;
  repoUrl: string;
  demoUrl?: string;
  contributors: string[];
  dateAdded: string;
}

interface RepoData {
  name: string;
  description: string;
  owner: string;
  repo: string;
  url: string;
  updated: string;
  contributors: string[];
}

interface AdminPanelProps {
  challengeRepos: RepoConfig[];
  onAddRepo: () => void;
  onRemoveRepo: (repoUrl: string) => void;
  onRefresh: () => void;
  onClose: () => void;
}

interface AddRepositoryModalProps {
  onSubmit: (repoConfig: Omit<RepoConfig, 'id' | 'dateAdded'>) => void;
  onClose: () => void;
}

const ChallengeHub = () => {
  const [challengeRepos, setChallengeRepos] = useState<RepoConfig[]>([]);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showAddRepo, setShowAddRepo] = useState(false);
  const [showGitGuide, setShowGitGuide] = useState(false);
  const [selectedRepoForGuide, setSelectedRepoForGuide] = useState<string>('');
  const { trackRepositoryAction, trackAdminAction, trackError, trackUserInteraction } = useDatadogTracking();
  const [challengeStartDate] = useState<Date>(() => {
    // Get Monday of current week as default start date
    const today = new Date();
    const dayOfWeek = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    monday.setHours(0, 0, 0, 0);
    return monday;
  });
  const [repoData, setRepoData] = useState<Record<string, RepoData>>({});
  const [loading, setLoading] = useState(false);
  const [sharedUrl, setSharedUrl] = useState<string>('');
  const [dataCaptureDate, setDataCaptureDate] = useState<string>('');
  const [showShareModal, setShowShareModal] = useState(false);

  // Mock GitHub API fetch (in real app, use actual GitHub API)
  const fetchRepoData = async (repoUrl: string): Promise<RepoData | null> => {
    // Extract owner/repo from GitHub URL
    const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
    if (!match) return null;
    
    const [, owner, repo] = match;
    
      // Return basic repo info without mock data
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        name: repo.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        description: `A demo project for the AI Dev Challenge`,
        owner: owner,
        repo: repo,
        url: repoUrl,
        updated: new Date().toISOString(),
        contributors: [owner]
      });
    }, 100);
  });
  };

  const fetchAllRepoData = useCallback(async (repos: RepoConfig[]) => {
    setLoading(true);
    const newRepoData: Record<string, RepoData> = {};
    
    for (const repoConfig of repos) {
      try {
        const data = await fetchRepoData(repoConfig.repoUrl);
        if (data) {
          newRepoData[repoConfig.repoUrl] = data;
        }
      } catch (error) {
        console.error(`Failed to fetch data for ${repoConfig.repoUrl}:`, error);
      }
    }
    
    setRepoData(prev => ({ ...prev, ...newRepoData }));
    setLoading(false);
  }, []);

  // Load challenge repos from browser storage on mount
  useEffect(() => {
    // Check for shared data in URL first
    const urlParams = new URLSearchParams(window.location.search);
    const sharedData = urlParams.get('data');
    const captureDate = urlParams.get('captured');
    
    if (sharedData && captureDate) {
      try {
        const decodedData = JSON.parse(atob(sharedData));
        setChallengeRepos(decodedData.repos || []);
        setRepoData(decodedData.repoData || {});
        setDataCaptureDate(captureDate);
        setSharedUrl(window.location.href);
        
        // Save to localStorage
        localStorage.setItem('challengeRepos', JSON.stringify(decodedData.repos || []));
        localStorage.setItem('repoData', JSON.stringify(decodedData.repoData || {}));
        
        // Track shared data load
        trackUserInteraction('load_shared_data', { 
          repo_count: (decodedData.repos || []).length,
          capture_date: captureDate 
        });
      } catch (error) {
        console.error('Failed to decode shared data:', error);
        trackError(error as Error, { action: 'decode_shared_data' });
      }
    } else {
      // Clear URL parameters if they exist but are invalid
      if (window.location.search) {
        window.history.replaceState({}, document.title, window.location.pathname);
      }
      // Load from localStorage
      const savedRepos = JSON.parse(localStorage.getItem('challengeRepos') || '[]');
      console.log('Loading saved repos from localStorage:', savedRepos);
      setChallengeRepos(savedRepos);
      
      const savedRepoData = JSON.parse(localStorage.getItem('repoData') || '{}');
      console.log('Loading saved repo data from localStorage:', savedRepoData);
      setRepoData(savedRepoData);

      if (savedRepos.length > 0 && Object.keys(savedRepoData).length === 0) {
        fetchAllRepoData(savedRepos);
      }
    }
  }, [fetchAllRepoData, trackError, trackUserInteraction]);

  // Save to localStorage whenever challengeRepos changes
  useEffect(() => {
    console.log('Saving challengeRepos to localStorage:', challengeRepos);
    localStorage.setItem('challengeRepos', JSON.stringify(challengeRepos));
  }, [challengeRepos]);

  // Save repo data to localStorage
  useEffect(() => {
    console.log('Saving repoData to localStorage:', repoData);
    localStorage.setItem('repoData', JSON.stringify(repoData));
  }, [repoData]);

  const addRepository = (repoConfig: Omit<RepoConfig, 'id' | 'dateAdded'>) => {
    console.log('Adding repository:', repoConfig);
    const newRepo = { 
      ...repoConfig, 
      id: Date.now(), 
      dateAdded: new Date().toISOString() 
    };
    console.log('New repo object:', newRepo);
    const newRepos = [...challengeRepos, newRepo];
    console.log('Updated repos array:', newRepos);
    setChallengeRepos(newRepos);
    
    // Track repository addition
    trackRepositoryAction('added', repoConfig.repoUrl, repoConfig.name);
    trackAdminAction('add_repository', { repo_url: repoConfig.repoUrl, repo_name: repoConfig.name });
    
    fetchRepoData(repoConfig.repoUrl).then(data => {
      if (data) {
        setRepoData(prev => ({ ...prev, [repoConfig.repoUrl]: data }));
      }
    }).catch(error => {
      trackError(error, { action: 'fetch_repo_data', repo_url: repoConfig.repoUrl });
    });
    
    setShowAddRepo(false);
  };

  const removeRepository = (repoUrl: string) => {
    setChallengeRepos(prev => prev.filter(repo => repo.repoUrl !== repoUrl));
    setRepoData(prev => {
      const newData = { ...prev };
      delete newData[repoUrl];
      return newData;
    });
    
    // Track repository removal
    trackRepositoryAction('removed', repoUrl);
    trackAdminAction('remove_repository', { repo_url: repoUrl });
  };

  const refreshRepoData = () => {
    trackAdminAction('refresh_data', { repo_count: challengeRepos.length });
    fetchAllRepoData(challengeRepos);
  };

  const generateShareUrl = () => {
    const dataToShare = {
      repos: challengeRepos,
      repoData: repoData
    };
    
    const encodedData = btoa(JSON.stringify(dataToShare));
    const captureDate = new Date().toISOString();
    const shareUrl = `${window.location.origin}${window.location.pathname}?data=${encodedData}&captured=${encodeURIComponent(captureDate)}`;
    
    setSharedUrl(shareUrl);
    setDataCaptureDate(captureDate);
    setShowShareModal(true);
    
    trackUserInteraction('generate_share_url', { 
      repo_count: challengeRepos.length,
      capture_date: captureDate 
    });
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(sharedUrl);
      trackUserInteraction('copy_share_url', { url_length: sharedUrl.length });
      // You could add a toast notification here
    } catch (error) {
      console.error('Failed to copy URL:', error);
      trackError(error as Error, { action: 'copy_share_url' });
    }
  };

  // Get unique contributors across all repos
  const allContributors = Array.from(new Set(
    challengeRepos.flatMap(repo => repo.contributors || [])
  ));



  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  
  // Calculate current challenge day
  const getCurrentChallengeDay = () => {
    const today = new Date();
    const diffTime = today.getTime() - challengeStartDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return -1; // Challenge hasn't started
    if (diffDays >= 5) return 5; // Challenge is over
    return diffDays; // 0-4 for Monday-Friday
  };
  
  const currentDayIndex = getCurrentChallengeDay();

  const getDayColor = (dayIndex: number) => {
    if (currentDayIndex === -1) return 'bg-gray-300'; // Challenge hasn't started
    if (currentDayIndex >= 5) {
      return dayIndex < 5 ? 'bg-green-500' : 'bg-gray-300'; // Challenge completed
    }
    if (dayIndex < currentDayIndex) return 'bg-green-500'; // Completed days
    if (dayIndex === currentDayIndex) return 'bg-blue-500'; // Current day
    return 'bg-gray-300'; // Future days
  };
  
  const getForkUrl = (repoUrl: string): string => {
    // Convert GitHub repo URL to fork URL
    const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
    if (match) {
      return `${repoUrl}/fork`;
    }
    return repoUrl;
  };
  
  const getPullRequestUrl = (repoUrl: string): string => {
    // Convert GitHub repo URL to create PR URL
    const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
    if (match) {
      return `${repoUrl}/compare`;
    }
    return repoUrl;
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Zap className="h-8 w-8 text-purple-600 mr-2" />
            <h1 className="text-4xl font-bold text-gray-900">AI Dev Challenge Hub</h1>
            <div className="ml-4 flex space-x-2">
              <button
                onClick={generateShareUrl}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                title="Share Challenge"
              >
                <Share2 className="h-5 w-5" />
              </button>
              <button
                onClick={() => {
                  setShowGitGuide(true);
                  trackUserInteraction('open_git_guide');
                }}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                title="Git Workflow Guide"
              >
                <BookOpen className="h-5 w-5" />
              </button>
              <button
                onClick={() => {
                  setShowAdminPanel(true);
                  trackUserInteraction('open_admin_panel');
                }}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                title="Admin Panel"
              >
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>
          <p className="text-xl text-gray-600 mb-6">Track GitHub repositories as they evolve through the AI Dev Challenge</p>
          
          {/* Shared Data Info */}
          {dataCaptureDate && (
            <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800 text-sm">
                📅 <strong>Shared Challenge Data</strong> - Captured on {new Date(dataCaptureDate).toLocaleString()}
              </p>
            </div>
          )}
          
          {/* Progress Timeline */}
          <div className="flex justify-center items-center space-x-4 mb-6">
            {days.map((day, index) => (
              <div key={day} className="flex items-center">
                <div className={`w-12 h-12 rounded-full ${getDayColor(index)} flex items-center justify-center text-white font-semibold`}>
                  {day.slice(0, 1)}
                </div>
                <span className={`ml-2 text-sm font-medium ${currentDayIndex >= index ? 'text-gray-900' : 'text-gray-500'}`}>
                  {day}
                </span>
                {index < days.length - 1 && <div className="w-8 h-0.5 bg-gray-300 ml-4" />}
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <Code className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Challenge Repos</p>
                <p className="text-2xl font-bold text-gray-900">{challengeRepos.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Active Developers</p>
                <p className="text-2xl font-bold text-gray-900">{allContributors.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Challenge Info */}
        <div className="text-center mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">How the Challenge Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
              <div>
                <h3 className="font-semibold text-purple-600 mb-2">1. Fork Repository</h3>
                <p className="text-gray-600">Click "Fork & Contribute" to create your own copy of the project on GitHub.</p>
              </div>
              <div>
                <h3 className="font-semibold text-blue-600 mb-2">2. Clone & Develop</h3>
                <p className="text-gray-600">Clone your fork locally, create a feature branch, and add your contributions.</p>
              </div>
              <div>
                <h3 className="font-semibold text-green-600 mb-2">3. Submit Pull Request</h3>
                <p className="text-gray-600">Push your changes and click "Create PR" to submit your contribution back to the original repo.</p>
              </div>
              <div>
                <h3 className="font-semibold text-orange-600 mb-2">4. Collaborate & Iterate</h3>
                <p className="text-gray-600">Repo owners review PRs, provide feedback, and merge contributions. Repeat with different projects!</p>
              </div>
            </div>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-blue-800 text-sm font-medium">💡 Pro Tip: Work on different projects each day (Tuesday-Friday) to maximize learning and collaboration!</p>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-white bg-purple-500">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Fetching repository data...
            </div>
          </div>
        )}

        {/* Repositories Grid */}
        {challengeRepos.length === 0 ? (
          <div className="text-center py-12">
            <Code className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No repositories yet</h3>
            <p className="text-gray-600 mb-6">Use the admin panel to add GitHub repositories to the challenge</p>
            <button
              onClick={() => setShowAdminPanel(true)}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors"
            >
              Configure Challenge
            </button>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Available Projects ({challengeRepos.length})</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {challengeRepos.map(repoConfig => {
              const data = repoData[repoConfig.repoUrl];
              
              return (
                <div key={repoConfig.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="p-6">
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {data?.name || repoConfig.name || 'Loading...'}
                      </h3>
                    </div>
                    
                    <p className="text-gray-600 mb-4 text-sm">
                      {data?.description || repoConfig.description || 'Repository description loading...'}
                    </p>
                    
                    {data && (
                      <>
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center text-sm text-gray-500">
                            <Github className="h-4 w-4 mr-2" />
                            <span>{data.owner}/{data.repo}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="h-4 w-4 mr-2" />
                            <span>Updated {getTimeAgo(data.updated)}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                              Challenge Repo
                            </span>
                          </div>
                        </div>

                        <div className="mb-4">
                          <p className="text-xs text-gray-500 mb-1">Contributors:</p>
                          <div className="flex flex-wrap gap-1">
                            {repoConfig.contributors && repoConfig.contributors.length > 0 ? (
                              <>
                                {repoConfig.contributors.slice(0, 5).map((contributor, index) => (
                                  <span key={index} className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                                    @{contributor}
                                  </span>
                                ))}
                                {repoConfig.contributors.length > 5 && (
                                  <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                                    +{repoConfig.contributors.length - 5} more
                                  </span>
                                )}
                              </>
                            ) : (
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                                No contributors added yet
                              </span>
                            )}
                          </div>
                        </div>
                      </>
                    )}

                    <div className="space-y-3">
                      {/* Get Started Button */}
                      <button
                        onClick={() => {
                          setSelectedRepoForGuide(repoConfig.repoUrl);
                          setShowGitGuide(true);
                          trackUserInteraction('open_git_guide_for_repo', { repo_url: repoConfig.repoUrl });
                        }}
                        className={`w-full px-3 py-2 rounded-lg font-medium transition-colors flex items-center justify-center text-sm ${
                          currentDayIndex === -1 || currentDayIndex >= 5
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                        disabled={currentDayIndex === -1 || currentDayIndex >= 5}
                      >
                        <BookOpen className="h-4 w-4 mr-1" />
                        {currentDayIndex === -1 ? 'Challenge Not Started' : currentDayIndex >= 5 ? 'Challenge Ended' : 'Get Started Guide'}
                      </button>
                      
                      {/* Contribution Actions */}
                      <div className="grid grid-cols-2 gap-2">
                        <a
                          href={getForkUrl(repoConfig.repoUrl)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`px-3 py-2 rounded-lg font-medium transition-colors flex items-center justify-center text-sm ${
                            currentDayIndex === -1 || currentDayIndex >= 5
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed pointer-events-none'
                              : 'bg-purple-600 text-white hover:bg-purple-700'
                          }`}
                        >
                          <Github className="h-4 w-4 mr-1" />
                          {currentDayIndex === -1 ? 'Not Started' : currentDayIndex >= 5 ? 'Challenge Ended' : 'Fork & Contribute'}
                        </a>
                        <a
                          href={getPullRequestUrl(repoConfig.repoUrl)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`px-3 py-2 rounded-lg font-medium transition-colors flex items-center justify-center text-sm ${
                            currentDayIndex === -1 || currentDayIndex >= 5
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed pointer-events-none'
                              : 'bg-green-600 text-white hover:bg-green-700'
                          }`}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Create PR
                        </a>
                      </div>
                      
                      {/* Repository Links */}
                      <div className="flex space-x-2">
                        <a 
                          href={repoConfig.repoUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex-1 bg-gray-900 text-white px-3 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center text-sm"
                        >
                          <Github className="h-4 w-4 mr-1" />
                          View Repo
                        </a>
                        {repoConfig.demoUrl && (
                          <a 
                            href={repoConfig.demoUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center text-sm"
                          >
                            <ExternalLink className="h-4 w-4 mr-1" />
                            Live Demo
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            </div>
          </div>
        )}

        {/* Admin Panel Modal */}
        {showAdminPanel && (
          <AdminPanel 
            challengeRepos={challengeRepos}
            onAddRepo={() => setShowAddRepo(true)}
            onRemoveRepo={removeRepository}
            onRefresh={refreshRepoData}
            onClose={() => setShowAdminPanel(false)}
          />
        )}

        {/* Add Repository Modal */}
        {showAddRepo && (
          <AddRepositoryModal
            onSubmit={addRepository}
            onClose={() => setShowAddRepo(false)}
          />
        )}

        {/* Git Workflow Guide Modal */}
        {showGitGuide && (
          <GitWorkflowGuide
            repoUrl={selectedRepoForGuide}
            onClose={() => setShowGitGuide(false)}
          />
        )}

        {/* Share Challenge Modal */}
        {showShareModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Share Challenge</h2>
                  <button
                    onClick={() => setShowShareModal(false)}
                    className="p-2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                
                <div className="mb-6">
                  <p className="text-gray-600 mb-4">
                    Share this URL with others to let them see your current challenge setup. 
                    The URL contains all repository data and will be captured at the current time.
                  </p>
                  
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <div className="flex items-center justify-between">
                      <input
                        type="text"
                        value={sharedUrl}
                        readOnly
                        className="flex-1 bg-transparent text-sm text-gray-700 mr-2"
                      />
                      <button
                        onClick={copyToClipboard}
                        className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors flex items-center"
                      >
                        <Copy className="h-4 w-4 mr-1" />
                        Copy
                      </button>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-500">
                    <p><strong>Data captured:</strong> {new Date(dataCaptureDate).toLocaleString()}</p>
                    <p><strong>Repositories:</strong> {challengeRepos.length}</p>
                    <p><strong>Contributors:</strong> {allContributors.length}</p>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowShareModal(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">GitHub Fork & Pull Request Workflow</h2>
          <div className="prose text-gray-600">
            <p className="mb-6">
              The AI Dev Challenge uses the standard GitHub fork and pull request workflow. No special permissions needed - 
              just fork, develop, and submit PRs like any open source project!
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">For Contributors</h3>
                <ul className="space-y-2 text-sm">
                  <li>• <strong>Fork:</strong> Click "Fork & Contribute" to create your copy of the repo</li>
                  <li>• <strong>Clone:</strong> Clone your fork to your local machine</li>
                  <li>• <strong>Branch:</strong> Create a feature branch: <code className="bg-gray-100 px-1 rounded">git checkout -b feature/my-feature</code></li>
                  <li>• <strong>Develop:</strong> Make your changes and commit them</li>
                  <li>• <strong>Push:</strong> Push your branch: <code className="bg-gray-100 px-1 rounded">git push origin feature/my-feature</code></li>
                  <li>• <strong>PR:</strong> Click "Create PR" to submit your contribution</li>
                  <li>• <strong>Collaborate:</strong> Work with repo owners on feedback and reviews</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">For Project Owners</h3>
                <ul className="space-y-2 text-sm">
                  <li>• <strong>Submit:</strong> Add your public repository to the challenge</li>
                  <li>• <strong>Monitor:</strong> Watch for incoming pull requests from contributors</li>
                  <li>• <strong>Review:</strong> Provide constructive feedback on PRs</li>
                  <li>• <strong>Guide:</strong> Help contributors with setup and code questions</li>
                  <li>• <strong>Merge:</strong> Accept quality contributions that improve your project</li>
                  <li>• <strong>Deploy:</strong> Update your live demo with new features</li>
                  <li>• <strong>Celebrate:</strong> Showcase the collaborative results!</li>
                </ul>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">✅ Best Practices</h4>
                <ul className="text-green-700 text-sm space-y-1">
                  <li>• Make focused, single-purpose PRs</li>
                  <li>• Write clear commit messages</li>
                  <li>• Test your changes before submitting</li>
                  <li>• Follow the project's coding style</li>
                </ul>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">🎯 Challenge Goal</h4>
                <p className="text-blue-700 text-sm">
                  Experience real collaborative development workflows while building cool projects and learning from diverse coding approaches!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminPanel: React.FC<AdminPanelProps> = ({ challengeRepos, onAddRepo, onRemoveRepo, onRefresh, onClose }) => {
  const { trackUserInteraction } = useDatadogTracking();
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Challenge Configuration</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-gray-600">Manage GitHub repositories participating in the challenge</p>
              <p className="text-sm text-gray-500 mt-1">{challengeRepos.length} repositories configured</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={onRefresh}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center"
              >
                <Zap className="h-4 w-4 mr-2" />
                Refresh Data
              </button>
              <button
                onClick={onAddRepo}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Repository
              </button>
            </div>
          </div>

          {challengeRepos.length === 0 ? (
            <div className="text-center py-8">
              <Github className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No repositories configured yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {challengeRepos.map(repo => (
                <div key={repo.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h4 className="font-medium text-gray-900">{repo.name}</h4>
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                        Added {new Date(repo.dateAdded).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{repo.description}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                                          <a 
                      href={repo.repoUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="hover:text-purple-600"
                      onClick={() => trackUserInteraction('click_github_link', { repo_url: repo.repoUrl })}
                    >
                      GitHub Repository
                    </a>
                      {repo.demoUrl && (
                        <a href={repo.demoUrl} target="_blank" rel="noopener noreferrer" className="hover:text-purple-600">
                          Live Demo
                        </a>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => onRemoveRepo(repo.repoUrl)}
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const AddRepositoryModal: React.FC<AddRepositoryModalProps> = ({ onSubmit, onClose }) => {
  const [formData, setFormData] = useState<Omit<RepoConfig, 'id' | 'dateAdded'>>({
    name: '',
    description: '',
    repoUrl: '',
    demoUrl: '',
    contributors: []
  });
  const [contributorInput, setContributorInput] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Add Repository</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Repository Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="My Awesome Project"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                rows={3}
                placeholder="Brief description of the project..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">GitHub Repository URL *</label>
              <input
                type="url"
                required
                value={formData.repoUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, repoUrl: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="https://github.com/username/repository"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Live Demo URL (optional)</label>
              <input
                type="url"
                value={formData.demoUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, demoUrl: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="https://your-demo.vercel.app"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contributors (optional)</label>
              <div className="space-y-2">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={contributorInput}
                    onChange={(e) => setContributorInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (contributorInput.trim() && !formData.contributors.includes(contributorInput.trim())) {
                          setFormData(prev => ({ ...prev, contributors: [...prev.contributors, contributorInput.trim()] }));
                          setContributorInput('');
                        }
                      }
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter GitHub username and press Enter"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (contributorInput.trim() && !formData.contributors.includes(contributorInput.trim())) {
                        setFormData(prev => ({ ...prev, contributors: [...prev.contributors, contributorInput.trim()] }));
                        setContributorInput('');
                      }
                    }}
                    className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Add
                  </button>
                </div>
                {formData.contributors.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.contributors.map((contributor, index) => (
                      <span key={index} className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                        @{contributor}
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ 
                            ...prev, 
                            contributors: prev.contributors.filter((_, i) => i !== index) 
                          }))}
                          className="ml-2 text-purple-600 hover:text-purple-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                <p className="text-xs text-gray-500">Add GitHub usernames of contributors to this project</p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
              >
                Add Repository
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <DatadogRUM>
        <ChallengeHub />
      </DatadogRUM>
    </ErrorBoundary>
  );
}

export default App;
