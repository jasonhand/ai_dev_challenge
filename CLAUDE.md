# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Structure

This is a dual-project repository for tracking GitHub repositories participating in the AI Dev Challenge:

1. **Root level**: Contains a standalone React component (`index.tsx`) with Tailwind CSS styling
2. **ai-dev-challenge-app/**: A full Create React App project for development and testing

The main application is a React component called `ChallengeHub` that displays a dashboard for tracking GitHub repositories across a 5-day challenge period.

## Development Commands

### For the Create React App (ai-dev-challenge-app/)
```bash
cd ai-dev-challenge-app
npm start          # Start development server on http://localhost:3000
npm test           # Run test suite in watch mode
npm run build      # Build production bundle
```

### For the root project
```bash
npm install        # Install dependencies for Tailwind CSS build tools
```

## Architecture Overview

### Main Component Structure
- **ChallengeHub**: Main dashboard component that manages the entire application state
- **AdminPanel**: Modal component for repository management (add/remove/refresh)
- **AddRepositoryModal**: Form component for adding new repositories to track

### Key Features
- **Repository Tracking**: Tracks GitHub repositories by URL with metadata (name, description, date added)
- **Mock GitHub API**: Simulates GitHub API calls for repository data (stars, forks, commits, contributors)
- **Local Storage**: Persists repository configurations and cached data in browser localStorage
- **Challenge Timeline**: Dynamic timeline showing current challenge week progress (Monday-Friday)
- **GitHub Fork/PR Integration**: Direct links to fork repositories and create pull requests
- **Standard Git Workflow**: Uses GitHub's built-in fork and pull request system
- **Statistics Dashboard**: Shows aggregate stats (total repos, contributors, commits, stars)

### State Management
The application uses React hooks for state management:
- `challengeRepos`: Array of repository configurations
- `repoData`: Cached GitHub API response data
- `selectedDay`: Filter for viewing repositories by day
- Local storage integration for persistence

### Styling
- Uses Tailwind CSS for styling
- Responsive design with mobile-first approach
- Consistent color scheme (purple/blue theme)
- Modal-based admin interface

## Key Dependencies

### Root Project
- `lucide-react`: Icon library
- `tailwindcss`: Utility-first CSS framework
- `postcss` & `autoprefixer`: CSS processing

### React App
- `react` & `react-dom`: React framework
- `typescript`: Type checking
- `@testing-library/*`: Testing utilities
- `react-scripts`: Create React App tooling

## Challenge Workflow

The app supports a 5-day collaborative coding challenge:

- **Monday**: Challenge starts, developers submit projects, all repositories become available
- **Tuesday-Thursday**: Developers choose different projects each day to contribute to
- **Friday**: Final day of contributions, challenge ends
- **Following week**: Results compilation and sharing

### Challenge Features

- **Dynamic Timeline**: Automatically calculates current challenge day based on Monday start date
- **Fork & Pull Request Workflow**: Uses standard GitHub workflow for contributions
- **Project Availability**: All projects are available from Monday onwards (no day-based restrictions)
- **Direct GitHub Integration**: Fork and Create PR buttons link directly to GitHub URLs
- **Contribution Tracking**: Mock system for tracking contributors and project evolution

## Development Notes

- The root `index.tsx` contains the complete standalone component
- The `ai-dev-challenge-app/` directory contains the same component within a full React app structure
- Repository data is mocked but follows GitHub API response structure
- All repository URLs must be public GitHub repositories
- Component is designed to be self-contained with no external API dependencies in demo mode
- Challenge timeline automatically starts on Monday of current week