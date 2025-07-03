# 🚀 Deployment Guide

This guide will help you deploy the AI Dev Challenge Hub to GitHub Pages.

## Quick Deploy

### Option 1: Using the deployment script (Easiest)

```bash
# Make the script executable
chmod +x deploy.sh

# Run the deployment
./deploy.sh
```

### Option 2: Manual deployment

```bash
# Navigate to the React app
cd ai-dev-challenge-app

# Install dependencies
npm install

# Deploy to GitHub Pages
npm run deploy
```

### Option 3: From root directory

```bash
# Install dependencies and deploy
npm run deploy
```

## 🔧 One-time Setup

### 1. Update Homepage URL

If your GitHub username or repository name is different, update the `homepage` field in `ai-dev-challenge-app/package.json`:

```json
{
  "homepage": "https://YOUR_USERNAME.github.io/YOUR_REPO_NAME"
}
```

### 2. Configure GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under **Source**, select **Deploy from a branch**
4. Choose the **gh-pages** branch
5. Click **Save**

### 3. Enable GitHub Actions (Optional)

The repository includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that will automatically deploy your app when you push to the main branch.

To enable it:
1. Go to your repository on GitHub
2. Click **Actions** tab
3. The workflow will run automatically on your next push to main

## 🌐 Access Your App

After deployment, your app will be available at:
`https://jhand.github.io/ai_dev_challenge`

**Note**: It may take a few minutes for the changes to appear.

## 🔄 Updating Your App

To update your deployed app:

1. Make your changes to the code
2. Commit and push to GitHub
3. Run the deployment command again:
   ```bash
   npm run deploy
   ```
   Or use the script:
   ```bash
   ./deploy.sh
   ```

## 🛠️ Troubleshooting

### Build Errors
- Make sure all dependencies are installed: `npm install`
- Check for TypeScript errors: `npm run test`
- Verify the build works locally: `npm run build`

### Deployment Issues
- Ensure the `homepage` URL in package.json is correct
- Check that the gh-pages branch was created
- Verify GitHub Pages is configured to use the gh-pages branch

### App Not Loading
- Check the GitHub Pages URL is correct
- Ensure the gh-pages branch contains the built files
- Wait a few minutes for changes to propagate

## 📁 What Gets Deployed

The deployment process:
1. Builds your React app (`npm run build`)
2. Creates a `gh-pages` branch
3. Pushes the `build/` folder contents to that branch
4. GitHub Pages serves the files from the gh-pages branch

## 🔒 Security Notes

- Your app is served over HTTPS by default
- No sensitive data should be in the client-side code
- The app uses localStorage for data persistence (client-side only)

## 📞 Support

If you encounter issues:
1. Check the GitHub Actions logs (if enabled)
2. Verify your repository settings
3. Check the browser console for errors
4. Review the deployment logs in your terminal 