import React, { useState } from 'react';
import { GitBranch, Copy, Check, ExternalLink, Terminal, Github, Code, GitPullRequest } from 'lucide-react';

interface GitWorkflowGuideProps {
  repoUrl: string;
  onClose: () => void;
}

export const GitWorkflowGuide: React.FC<GitWorkflowGuideProps> = ({ repoUrl, onClose }) => {
  const [copiedStep, setCopiedStep] = useState<number | null>(null);

  const steps = [
    {
      id: 1,
      title: "Fork the Repository",
      description: "Create your own copy of the project on GitHub",
      command: `# Visit the repository and click "Fork" button
# Or use GitHub CLI:
gh repo fork ${repoUrl}`,
      details: "This creates a copy of the repository under your GitHub account that you can modify without affecting the original.",
      icon: <Github className="h-5 w-5" />
    },
    {
      id: 2,
      title: "Clone Your Fork",
      description: "Download the repository to your local machine",
      command: `# Replace YOUR_USERNAME with your GitHub username
git clone https://github.com/YOUR_USERNAME/${repoUrl.split('/').pop()}.git
cd ${repoUrl.split('/').pop()}`,
      details: "This downloads the repository to your computer so you can work on it locally.",
      icon: <Terminal className="h-5 w-5" />
    },
    {
      id: 3,
      title: "Add Original Repository as Upstream",
      description: "Keep your fork in sync with the original repository",
      command: `git remote add upstream ${repoUrl}
git fetch upstream`,
      details: "This allows you to pull updates from the original repository to keep your fork current.",
      icon: <GitBranch className="h-5 w-5" />
    },
    {
      id: 4,
      title: "Create a New Branch",
      description: "Create a feature branch for your changes",
      command: `# Create and switch to a new branch
git checkout -b feature/your-feature-name

# Or create a branch with a descriptive name
git checkout -b fix/issue-description
git checkout -b add/new-feature`,
      details: "Always work on a new branch, never directly on main. Use descriptive branch names that explain what you're working on.",
      icon: <GitBranch className="h-5 w-5" />
    },
    {
      id: 5,
      title: "Make Your Changes",
      description: "Write code, add features, or fix bugs",
      command: `# Make your changes to the code
# Then stage and commit your changes
git add .
git commit -m "Add descriptive commit message

- Explain what you changed
- Why you made the change
- Any important details"`,
      details: "Write clear, descriptive commit messages. Explain what you changed and why. Use present tense and be specific.",
      icon: <Code className="h-5 w-5" />
    },
    {
      id: 6,
      title: "Push Your Branch",
      description: "Upload your changes to your fork",
      command: `git push origin feature/your-feature-name`,
      details: "This uploads your branch to your fork on GitHub, making it available for creating a pull request.",
      icon: <GitBranch className="h-5 w-5" />
    },
    {
      id: 7,
      title: "Create Pull Request",
      description: "Submit your changes for review",
      command: `# Visit your fork on GitHub and click "Compare & pull request"
# Or use GitHub CLI:
gh pr create --title "Your PR Title" --body "Description of changes"`,
      details: "A pull request is a request to merge your changes into the original repository. Include a clear title and description.",
      icon: <GitPullRequest className="h-5 w-5" />
    }
  ];

  const copyToClipboard = async (text: string, stepId: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStep(stepId);
      setTimeout(() => setCopiedStep(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const getForkUrl = () => {
    return `${repoUrl}/fork`;
  };

  const getPrUrl = () => {
    return `${repoUrl}/compare`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Git Workflow Guide</h2>
              <p className="text-gray-600 mt-1">Step-by-step instructions for contributing to this project</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Quick Actions */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">Quick Actions</h3>
            <div className="flex flex-wrap gap-3">
              <a
                href={getForkUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Github className="h-4 w-4 mr-2" />
                Fork Repository
              </a>
              <a
                href={getPrUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <GitPullRequest className="h-4 w-4 mr-2" />
                Create PR
              </a>
            </div>
          </div>

          {/* Steps */}
          <div className="space-y-6">
            {steps.map((step) => (
              <div key={step.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 font-semibold text-sm">{step.id}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      {step.icon}
                      <h3 className="text-lg font-semibold text-gray-900">{step.title}</h3>
                    </div>
                    <p className="text-gray-600 mb-3">{step.description}</p>
                    
                    <div className="bg-gray-900 rounded-lg p-4 mb-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-400 text-sm">Terminal Commands</span>
                        <button
                          onClick={() => copyToClipboard(step.command, step.id)}
                          className="flex items-center text-gray-400 hover:text-white transition-colors"
                        >
                          {copiedStep === step.id ? (
                            <Check className="h-4 w-4 mr-1" />
                          ) : (
                            <Copy className="h-4 w-4 mr-1" />
                          )}
                          <span className="text-xs">
                            {copiedStep === step.id ? 'Copied!' : 'Copy'}
                          </span>
                        </button>
                      </div>
                      <pre className="text-green-400 text-sm whitespace-pre-wrap">{step.command}</pre>
                    </div>
                    
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3">
                      <p className="text-yellow-800 text-sm">{step.details}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Best Practices */}
          <div className="mt-8 bg-green-50 rounded-lg p-4">
            <h3 className="font-semibold text-green-900 mb-3">💡 Best Practices</h3>
            <ul className="text-green-800 text-sm space-y-2">
              <li>• <strong>Keep branches focused:</strong> One feature or fix per branch</li>
              <li>• <strong>Write clear commit messages:</strong> Use present tense and be descriptive</li>
              <li>• <strong>Test your changes:</strong> Make sure everything works before submitting</li>
              <li>• <strong>Keep PRs small:</strong> Smaller changes are easier to review</li>
              <li>• <strong>Respond to feedback:</strong> Be open to suggestions and improvements</li>
              <li>• <strong>Update your fork:</strong> Regularly sync with the original repository</li>
            </ul>
          </div>

          {/* Common Issues */}
          <div className="mt-6 bg-red-50 rounded-lg p-4">
            <h3 className="font-semibold text-red-900 mb-3">⚠️ Common Issues & Solutions</h3>
            <div className="text-red-800 text-sm space-y-2">
              <p><strong>Permission denied:</strong> Make sure you've forked the repository to your account</p>
              <p><strong>Branch conflicts:</strong> Always pull the latest changes before creating your branch</p>
              <p><strong>Commit history:</strong> Use <code className="bg-red-100 px-1 rounded">git log --oneline</code> to see your commits</p>
              <p><strong>Undo changes:</strong> Use <code className="bg-red-100 px-1 rounded">git reset --hard HEAD~1</code> to undo last commit</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 