import React, { useState, useEffect } from 'react';
import { Github, ExternalLink, Calendar, Users, Code, Zap, Clock, Star, GitBranch, Settings, Plus, X, Trash2 } from 'lucide-react';

const ChallengeHub = () => {
  const [challengeRepos, setChallengeRepos] = useState([]);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showAddRepo, setShowAddRepo] = useState(false);
  const [selectedDay, setSelectedDay] = useState('all');
  const [repoData, setRepoData] = useState({});
  const [loading, setLoading] = useState(false);

  // Load challenge repos from browser storage on mount
  useEffect(() => {
    const savedRepos = JSON.parse(localStorage.getItem('challengeRepos') || '[]');
    setChallengeRepos(savedRepos);
    
    // Load cached repo data
    const savedRepoData = JSON.parse(localStorage.getItem('repoData') || '{}');
    setRepoData(savedRepoData);

    // If we have repos but no data, fetch it
    if (savedRepos.length > 0 && Object.keys(savedRepoData).length === 0) {
      fetchAllRepoData(savedRepos);
    }
  }, []);

  // Save to localStorage whenever challengeRepos changes
  useEffect(() => {
    localStorage.setItem('challengeRepos', JSON.stringify(challengeRepos));
  }, [challengeRepos]);

  // Save repo data to localStorage
  useEffect(() => {
    localStorage.setItem('repoData', JSON.stringify(repoData));
  }, [repoData]);

  // Mock GitHub API fetch (in real app, use actual GitHub API)
  const fetchRepoData = async (repoUrl) => {
    // Extract owner/repo from GitHub URL
    const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (!match) return null;
    
    const [, owner, repo] = match;
    
    // Mock data - in real app, fetch from GitHub API
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          name: repo.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          description: `A demo project for the AI Dev Challenge`,
          owner: owner,
          repo: repo,
          url: repoUrl,
          stars: Math.floor(Math.random() * 20),
          forks: Math.floor(Math.random() * 10),
          language: ['React', 'Vue.js', 'Next.js', 'JavaScript', 'TypeScript'][Math.floor(Math.random() * 5)],
          updated: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
          contributors: [
            owner,
            ...Array.from({length: Math.floor(Math.random() * 4)}, () => 
              ['alice', 'bob', 'charlie', 'diana', 'eve', 'frank'][Math.floor(Math.random() * 6)]
            )
          ],
          commits: Math.floor(Math.random() * 50) + 5
        });
      }, 500);
    });
  };

  const fetchAllRepoData = async (repos) => {
    setLoading(true);
    const newRepoData = {};
    
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
  };

  const addRepository = (repoConfig) => {
    const newRepos = [...challengeRepos, { ...repoConfig, id: Date.now() }];
    setChallengeRepos(newRepos);
    fetchRepoData(repoConfig.repoUrl).then(data => {
      if (data) {
        setRepoData(prev => ({ ...prev, [repoConfig.repoUrl]: data }));
      }
    });
    setShowAddRepo(false);
  };

  const removeRepository = (repoUrl) => {
    setChallengeRepos(prev => prev.filter(repo => repo.repoUrl !== repoUrl));
    setRepoData(prev => {
      const newData = { ...prev };
      delete newData[repoUrl];
      return newData;
    });
  };

  const refreshRepoData = () => {
    fetchAllRepoData(challengeRepos);
  };

  // Get unique contributors across all repos
  const allContributors = [
    ...new Set(
      Object.values(repoData).flatMap(repo => repo.contributors || [])
    )
  ];

  const totalCommits = Object.values(repoData).reduce((sum, repo) => sum + (repo.commits || 0), 0);
  const totalStars = Object.values(repoData).reduce((sum, repo) => sum + (repo.stars || 0), 0);

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
  const currentDay = 'wednesday'; // This would be dynamic in a real app

  const filteredRepos = selectedDay === 'all' 
    ? challengeRepos 
    : challengeRepos.filter(repo => repo.day === selectedDay);

  const getDayColor = (day) => {
    const dayIndex = days.indexOf(day);
    const currentIndex = days.indexOf(currentDay);
    
    if (dayIndex < currentIndex) return 'bg-green-500';
    if (dayIndex === currentIndex) return 'bg-blue-500';
    return 'bg-gray-300';
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.floor((now - date) / (1000 * 60 * 60));
    
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
            <button
              onClick={() => setShowAdminPanel(true)}
              className="ml-4 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title="Admin Panel"
            >
              <Settings className="h-5 w-5" />
            </button>
          </div>
          <p className="text-xl text-gray-600 mb-6">Track GitHub repositories as they evolve through the AI Dev Challenge</p>
          
          {/* Progress Timeline */}
          <div className="flex justify-center items-center space-x-4 mb-6">
            {days.map((day, index) => (
              <div key={day} className="flex items-center">
                <div className={`w-12 h-12 rounded-full ${getDayColor(day)} flex items-center justify-center text-white font-semibold`}>
                  {day.slice(0, 1).toUpperCase()}
                </div>
                <span className={`ml-2 text-sm font-medium ${days.indexOf(currentDay) >= index ? 'text-gray-900' : 'text-gray-500'}`}>
                  {day.charAt(0).toUpperCase() + day.slice(1)}
                </span>
                {index < days.length - 1 && <div className="w-8 h-0.5 bg-gray-300 ml-4" />}
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <GitBranch className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Commits</p>
                <p className="text-2xl font-bold text-gray-900">{totalCommits}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <Star className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Stars</p>
                <p className="text-2xl font-bold text-gray-900">{totalStars}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center mb-8">
          <button
            onClick={() => setSelectedDay('all')}
            className={`px-4 py-2 mr-2 mb-2 rounded-lg font-medium transition-colors ${
              selectedDay === 'all' 
                ? 'bg-purple-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            All Repositories
          </button>
          {days.map(day => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-4 py-2 mr-2 mb-2 rounded-lg font-medium transition-colors capitalize ${
                selectedDay === day 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {day}
            </button>
          ))}
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
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredRepos.map(repoConfig => {
              const data = repoData[repoConfig.repoUrl];
              
              return (
                <div key={repoConfig.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {data?.name || repoConfig.name || 'Loading...'}
                      </h3>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium capitalize">
                        {repoConfig.day}
                      </span>
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
                            <span className="flex items-center">
                              <GitBranch className="h-4 w-4 mr-1" />
                              {data.commits}
                            </span>
                            <span className="flex items-center">
                              <Star className="h-4 w-4 mr-1" />
                              {data.stars}
                            </span>
                            <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                              {data.language}
                            </span>
                          </div>
                        </div>

                        <div className="mb-4">
                          <p className="text-xs text-gray-500 mb-1">Contributors:</p>
                          <div className="flex flex-wrap gap-1">
                            {data.contributors.slice(0, 5).map((contributor, index) => (
                              <span key={index} className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                                @{contributor}
                              </span>
                            ))}
                            {data.contributors.length > 5 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                                +{data.contributors.length - 5} more
                              </span>
                            )}
                          </div>
                        </div>
                      </>
                    )}

                    <div className="flex space-x-2">
                      <a 
                        href={repoConfig.repoUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex-1 bg-gray-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center"
                      >
                        <Github className="h-4 w-4 mr-2" />
                        Repo
                      </a>
                      {repoConfig.demoUrl && (
                        <a 
                          href={repoConfig.demoUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center justify-center"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Demo
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
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

        {/* Instructions */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">About the Challenge</h2>
          <div className="prose text-gray-600">
            <p className="mb-4">
              This hub tracks public GitHub repositories participating in the 5-Day AI Dev Challenge. 
              Repositories evolve as different developers work on them throughout the week, creating a 
              unique collaborative development experience.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">For Participants</h3>
                <ul className="space-y-1 text-sm">
                  <li>• Fork any repository from the challenge</li>
                  <li>• Add features while keeping it functional</li>
                  <li>• Deploy your changes to update the demo</li>
                  <li>• Never work on the same repo twice</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">For Organizers</h3>
                <ul className="space-y-1 text-sm">
                  <li>• Use the admin panel to add repositories</li>
                  <li>• All repositories must be public on GitHub</li>
                  <li>• Contributors are tracked automatically</li>
                  <li>• Repository data refreshes automatically</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminPanel = ({ challengeRepos, onAddRepo, onRemoveRepo, onRefresh, onClose }) => {
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
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs capitalize">
                        {repo.day}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{repo.description}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <a href={repo.repoUrl} target="_blank" rel="noopener noreferrer" className="hover:text-purple-600">
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

const AddRepositoryModal = ({ onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    repoUrl: '',
    demoUrl: '',
    day: 'monday'
  });

  const handleSubmit = (e) => {
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
                rows="3"
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Challenge Day</label>
              <select
                value={formData.day}
                onChange={(e) => setFormData(prev => ({ ...prev, day: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="monday">Monday</option>
                <option value="tuesday">Tuesday</option>
                <option value="wednesday">Wednesday</option>
                <option value="thursday">Thursday</option>
                <option value="friday">Friday</option>
              </select>
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

export default ChallengeHub;