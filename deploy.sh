#!/bin/bash

echo "🚀 Deploying AI Dev Challenge Hub to GitHub Pages..."

# Navigate to the React app directory
cd ai-dev-challenge-app

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Install gh-pages if not already installed
if ! npm list gh-pages > /dev/null 2>&1; then
    echo "📦 Installing gh-pages..."
    npm install --save-dev gh-pages
fi

# Build and deploy
echo "🔨 Building the app..."
npm run build

echo "🚀 Deploying to GitHub Pages..."
npm run deploy

echo "✅ Deployment complete!"
echo "🌐 Your app should be available at: https://jhand.github.io/ai_dev_challenge"
echo ""
echo "📝 Don't forget to:"
echo "   1. Go to your repository Settings → Pages"
echo "   2. Set source to 'Deploy from a branch'"
echo "   3. Select 'gh-pages' branch"
echo "   4. Click Save" 