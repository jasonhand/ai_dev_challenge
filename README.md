# AI Dev Challenge Hub

A React-based dashboard for tracking GitHub repositories as they evolve through the AI Dev Challenge. This application provides a comprehensive view of participating repositories, their progress, and contribution statistics across a 5-day collaborative coding challenge.

## 🚀 Features

- **Repository Tracking**: Monitor GitHub repositories by URL with user-provided metadata
- **Challenge Timeline**: Dynamic 5-day timeline showing current challenge progress (Monday-Friday)
- **Statistics Dashboard**: Real-time stats including total repos and active contributors
- **URL Sharing**: Generate shareable URLs with encoded challenge data and capture timestamps
- **Local Storage**: Persists repository configurations and cached data in browser localStorage
- **GitHub Integration**: Direct links to fork repositories and create pull requests
- **Git Workflow Guide**: Step-by-step instructions for contributors and project owners
- **Responsive Design**: Mobile-first design with Tailwind CSS styling
- **Admin Panel**: Easy repository management (add/remove/refresh)

## 📁 Project Structure

This repository contains two project setups:

1. **Root level**: Standalone React component (`index.tsx`) with Tailwind CSS styling
2. **ai-dev-challenge-app/**: Full Create React App project for development and testing

```
ai_dev_challenge/
├── index.tsx                    # Main standalone React component
├── package.json                 # Root dependencies (Tailwind CSS tools)
├── ai-dev-challenge-app/        # Full React app
│   ├── src/                     # React source files
│   ├── public/                  # Static assets
│   ├── package.json             # React app dependencies
│   └── .gitignore              # React-specific ignores
├── README.md                    # This file
├── CLAUDE.md                    # Development documentation
└── .gitignore                   # Root-level ignores
```

## 🛠️ Installation & Setup

### Option 1: Run the Full React App (Recommended)

```bash
# Navigate to the React app directory
cd ai-dev-challenge-app

# Install dependencies
npm install

# Start the development server
npm start
```

The app will open at `http://localhost:3000`

## 🌐 Deployment

### GitHub Pages

This app is configured for GitHub Pages deployment. To deploy:

```bash
# Install dependencies (if not already done)
cd ai-dev-challenge-app
npm install

# Deploy to GitHub Pages
npm run deploy
```

**Or from the root directory:**
```bash
npm run deploy
```

The app will be available at: `https://jhand.github.io/ai_dev_challenge`

### Setup GitHub Pages (One-time setup)

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under **Source**, select **Deploy from a branch**
4. Choose the **gh-pages** branch
5. Click **Save**

**Note**: The `homepage` field in `ai-dev-challenge-app/package.json` is set to `https://jhand.github.io/ai_dev_challenge`. Update this URL if your GitHub username or repository name is different.

### Option 2: Run the Standalone Component

```bash
# Install root dependencies (for Tailwind CSS)
npm install

# The standalone component can be used in any React project
# Copy index.tsx to your project and import the ChallengeHub component
```

## 🧪 Testing

```bash
# Navigate to the React app directory
cd ai-dev-challenge-app

# Run tests in watch mode
npm test

# Run tests with coverage
npm test -- --coverage
```

## 🎯 Usage

### Adding Repositories

1. Click the **Settings** icon in the header to open the Admin Panel
2. Click **"Add Repository"** to open the repository form
3. Enter the GitHub repository URL (e.g., `https://github.com/username/repo-name`)
4. Add a description for the repository
5. Enter contributor usernames (comma-separated)
6. Optionally add a demo URL
7. Click **"Add Repository"** to save

### Managing Repositories

- **View**: All repositories are displayed in the main dashboard
- **Refresh**: Click the refresh button in the Admin Panel to update repository data
- **Remove**: Use the trash icon in the Admin Panel to remove repositories
- **Share**: Click the share icon in the header to generate a shareable URL with all challenge data

### Sharing Challenge Data

- **Generate URL**: Click the share button to create a URL with encoded challenge data
- **Copy to Clipboard**: One-click copying of the shared URL
- **Data Capture**: Each shared URL includes a timestamp showing when the data was captured
- **Automatic Loading**: When someone visits a shared URL, all challenge data loads automatically
- **Freshness Indicator**: Clear display of when the shared data was captured

### Challenge Workflow

The app supports a 5-day collaborative coding challenge:

- **Monday**: Challenge starts, developers submit projects
- **Tuesday-Thursday**: Developers contribute to different projects each day
- **Friday**: Final day of contributions
- **Following week**: Results compilation and sharing

## 🎨 Key Components

- **ChallengeHub**: Main dashboard component managing application state
- **AdminPanel**: Modal component for repository management
- **AddRepositoryModal**: Form component for adding new repositories
- **GitWorkflowGuide**: Modal component with step-by-step Git instructions
- **Repository Cards**: Individual repository display with stats and actions
- **Share Modal**: Component for generating and copying shareable URLs

## 🔧 Development

### Available Scripts

```bash
# Development
npm start          # Start development server
npm test           # Run test suite
npm run build      # Build production bundle

# Root level (for Tailwind CSS)
npm run dev        # Start development with Tailwind
```

## 📊 Monitoring & Analytics

This app is instrumented with **Datadog RUM (Real User Monitoring)** using the official React SDK to track:

- **User Interactions**: Repository additions, removals, admin panel usage
- **Performance Metrics**: Page load times, component render times
- **Error Tracking**: JavaScript errors and API failures
- **Session Replay**: User session recordings for debugging
- **Custom Events**: Challenge-specific actions and workflows
- **React Component Tracking**: Automatic tracking of React component lifecycle

### Datadog Configuration

The app is configured with:
- **Service**: `ai-dev-challenge-hub`
- **Environment**: `prod`
- **Session Sample Rate**: 100%
- **Session Replay Sample Rate**: 100%
- **Privacy Level**: `mask-user-input`
- **React Plugin**: Enabled with router tracking

### Custom Events Tracked

- `repository_added` - When a new repository is added
- `repository_removed` - When a repository is removed
- `admin_panel_opened` - When admin panel is accessed
- `data_refreshed` - When repository data is refreshed
- `github_link_clicked` - When users click GitHub links
- `git_guide_opened` - When users open the Git workflow guide
- `share_url_generated` - When users generate a shareable URL
- `share_url_copied` - When users copy a shareable URL
- `shared_data_loaded` - When users load data from a shared URL
- `app_initialized` - When the app loads

### Viewing Data

1. Log into your Datadog account
2. Navigate to **RUM** → **Applications**
3. Select the `ai-dev-challenge` service
4. View sessions, performance, and custom events

### State Management

The application uses React hooks for state management:
- `challengeRepos`: Array of repository configurations
- `repoData`: Cached repository metadata
- `sharedUrl`: Generated shareable URL with encoded data
- `dataCaptureDate`: Timestamp when shared data was captured
- `showShareModal`: Controls the share modal visibility
- Local storage integration for persistence

### Styling

- **Tailwind CSS**: Utility-first CSS framework
- **Responsive Design**: Mobile-first approach
- **Color Scheme**: Purple/blue theme
- **Icons**: Lucide React icon library

## 📊 Data Management

The application uses user-provided data for repository information:

- **Repository Metadata**: Basic info extracted from GitHub URLs (owner, repo name)
- **Contributor Management**: Users manually input contributor usernames
- **URL Sharing**: All challenge data is encoded in shareable URLs with timestamps
- **Local Storage**: Data persists in browser localStorage for convenience
- **No External APIs**: No GitHub API calls required, reducing complexity and rate limiting concerns

### Future Enhancements

For enhanced functionality, you could:
1. Integrate with GitHub API for real-time repository statistics
2. Add GitHub OAuth for authenticated access
3. Implement webhook support for automatic updates
4. Add collaborative features with real-time synchronization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For questions or issues:
1. Check the [CLAUDE.md](CLAUDE.md) file for detailed development documentation
2. Open an issue on GitHub
3. Review the component structure in `index.tsx`

---

**Built with React, TypeScript, and Tailwind CSS** 🎉
