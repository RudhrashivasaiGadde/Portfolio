# Oryzo Clone

A high-performance 3D web experience built with React, Vite, and Three.js.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## 🌐 Deployment to GitHub Pages

This project is pre-configured for automatic deployment to GitHub Pages using GitHub Actions.

### Steps to Deploy:
1. **Create a GitHub Repository**: Create a new repository on GitHub.
2. **Push your code**:
   ```bash
   # If you have git installed:
   git init
   git add .
   git commit -m "initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```
3. **Enable GitHub Actions Deployment**:
   - Go to your GitHub Repository **Settings**.
   - Navigate to **Pages**.
   - Under **Build and deployment** > **Source**, select **GitHub Actions**.
4. **Wait for Build**: Every time you push to the `main` branch, the site will automatically build and deploy.

## 🛠️ Tech Stack
- **React**: UI Framework
- **Three.js / React Three Fiber**: 3D Rendering
- **GSAP**: Animations
- **Vite**: Build Tool
