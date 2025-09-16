#!/bin/bash

echo "🚀 Deploying Janani's Portfolio Website..."

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git not initialized. Run 'git init' first."
    exit 1
fi

# Check if GitHub CLI is authenticated
if ! gh auth status > /dev/null 2>&1; then
    echo "❌ GitHub CLI not authenticated."
    echo "Please run: gh auth login"
    exit 1
fi

# Add any new changes
echo "📁 Adding files to git..."
git add .
git status

# Commit if there are changes
if ! git diff --cached --quiet; then
    echo "💾 Committing changes..."
    git commit -m "Update portfolio: $(date '+%Y-%m-%d %H:%M:%S')"
else
    echo "ℹ️  No changes to commit."
fi

# Create repository if it doesn't exist
if ! gh repo view > /dev/null 2>&1; then
    echo "📦 Creating GitHub repository..."
    gh repo create portfolio-website --public --source=. --remote=origin --push
    
    echo "⚙️  Enabling GitHub Pages..."
    sleep 3  # Wait for repo to be fully created
    gh repo edit --enable-pages --pages-branch=main
else
    echo "📤 Pushing to existing repository..."
    git push origin main
fi

echo ""
echo "✅ Deployment complete!"
echo ""
echo "🌐 Your portfolio will be available at:"
echo "   https://$(gh api user --jq .login).github.io/portfolio-website"
echo ""
echo "📋 Note: GitHub Pages may take 1-10 minutes to deploy."
echo "📋 You can check deployment status at:"
echo "   https://github.com/$(gh api user --jq .login)/portfolio-website/deployments"