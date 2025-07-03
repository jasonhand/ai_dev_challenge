# AI Dev Challenge Hub

A React application for tracking GitHub repositories during the AI Dev Challenge, enhanced with GitHub GraphQL API integration for real-time repository statistics.

## Features

- **GitHub GraphQL Integration**: Real-time repository data including stars, forks, and activity
- **Live Repository Statistics**: Pull requests, issues, and contributor information
- **GitHub OAuth Authentication**: Secure authentication with GitHub API
- **Interactive Charts**: Visualize repository activity with Chart.js
- **Responsive Design**: Works on desktop and mobile devices
- **GitHub Pages Compatible**: Deploy directly to GitHub Pages

## GitHub Integration Setup

This app uses GitHub Personal Access Tokens for authentication, which works perfectly with GitHub Pages deployment.

### For Development

1. **Create a GitHub Personal Access Token**:
   - Go to [GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)](https://github.com/settings/tokens)
   - Click "Generate new token (classic)"
   - Select scopes: `repo` and `read:user`
   - Copy the token (starts with `ghp_`)

2. **Create a `.env` file** in the project root:
   ```
   REACT_APP_GITHUB_TOKEN=ghp_your_token_here
   ```

### For GitHub Pages Deployment

The app will automatically prompt users to enter their GitHub Personal Access Token when they click "Connect GitHub". No additional setup is needed for deployment.

**Note**: Each user needs their own GitHub Personal Access Token. The token is stored locally in the browser's session storage and is never sent to any server.

## Getting Started

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Dependencies

This project uses the following key dependencies for GitHub GraphQL integration:

- `@apollo/client`: GraphQL client for React
- `graphql`: GraphQL query language
- `chart.js` & `react-chartjs-2`: Interactive charts and visualizations
- `date-fns`: Date utility functions
- `lucide-react`: Modern icon library

## Project Structure

```
src/
├── components/
│   ├── dashboard/
│   │   └── EnhancedRepositoryCard.tsx    # Enhanced repo cards with live data
│   ├── visualizations/
│   │   └── ActivityChart.tsx             # Chart.js activity visualizations
│   └── ... (existing components)
├── hooks/
│   └── useGitHubData.ts                  # Custom hook for GitHub data
├── services/
│   ├── apolloClient.ts                   # Apollo GraphQL client setup
│   ├── githubAuth.ts                     # GitHub OAuth authentication
│   └── queries.ts                        # GraphQL queries
├── types/
│   └── github.ts                         # TypeScript interfaces
└── ... (existing files)
```

## Deployment to GitHub Pages

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Deploy to GitHub Pages**:
   ```bash
   npm run deploy
   ```

3. **Configure GitHub Pages** (if not already done):
   - Go to your repository settings
   - Navigate to "Pages"
   - Set source to "GitHub Actions" or "Deploy from a branch"
   - Select the `gh-pages` branch

4. **Access your app** at `https://yourusername.github.io/ai_dev_challenge`

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

For GitHub GraphQL API, see the [GitHub GraphQL documentation](https://docs.github.com/en/graphql).
