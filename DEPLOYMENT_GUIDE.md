# Deployment Guide

## GitHub Setup

### Step 1: Create GitHub Repository
1. Go to https://github.com/new
2. Repository name: `shosholoza-website` (or your preferred name)
3. Description: "Official website for Shosholoza Progressive Party"
4. Choose Public or Private
5. **DO NOT** initialize with README, .gitignore, or license (we already have these)
6. Click "Create repository"

### Step 2: Push to GitHub
After creating the repository, run these commands:

```bash
git remote add origin https://github.com/YOUR_USERNAME/shosholoza-website.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

## Netlify Deployment

### Option 1: Deploy via Netlify UI (Recommended)

1. **Sign up/Login to Netlify**
   - Go to https://www.netlify.com/
   - Sign up with GitHub (recommended for easy integration)

2. **Import Project**
   - Click "Add new site" → "Import an existing project"
   - Choose "Deploy with GitHub"
   - Authorize Netlify to access your GitHub account
   - Select your `shosholoza-website` repository

3. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - (These should be auto-detected from netlify.toml)

4. **Deploy**
   - Click "Deploy site"
   - Wait 2-3 minutes for the build to complete
   - Your site will be live at: `https://random-name-12345.netlify.app`

5. **Custom Domain (Optional)**
   - Go to Site settings → Domain management
   - Click "Add custom domain"
   - Enter your domain (e.g., `shosh.org.za`)
   - Follow DNS configuration instructions

### Option 2: Deploy via Netlify CLI

1. **Install Netlify CLI**
```bash
npm install -g netlify-cli
```

2. **Login to Netlify**
```bash
netlify login
```

3. **Initialize and Deploy**
```bash
netlify init
```
Follow the prompts to connect to your GitHub repo.

4. **Deploy**
```bash
netlify deploy --prod
```

## Post-Deployment Configuration

### 1. Environment Variables (if needed in future)
- Go to Site settings → Environment variables
- Add any API keys or secrets

### 2. Enable Form Submissions (for Contact form)
- Netlify automatically handles form submissions
- Go to Site settings → Forms to view submissions

### 3. Set up Email Notifications
- For membership form submissions, you'll need to:
  - Set up Netlify Functions (serverless)
  - Or use a third-party email service (see EMAIL_SETUP.md)

### 4. Configure Custom Domain
- Add your domain in Netlify
- Update DNS records:
  - A record: `104.198.14.52`
  - Or CNAME: `your-site.netlify.app`
- Enable HTTPS (automatic with Netlify)

## Continuous Deployment

Once connected to GitHub, Netlify will automatically:
- Deploy on every push to main branch
- Create preview deployments for pull requests
- Run build checks before deploying

## Build Status Badge

Add this to your README.md:
```markdown
[![Netlify Status](https://api.netlify.com/api/v1/badges/YOUR-SITE-ID/deploy-status)](https://app.netlify.com/sites/YOUR-SITE-NAME/deploys)
```

## Troubleshooting

### Build Fails
- Check build logs in Netlify dashboard
- Ensure all dependencies are in package.json
- Verify Node version (set to 18 in netlify.toml)

### 404 Errors on Routes
- Ensure netlify.toml has the redirect rule (already configured)

### Slow Build Times
- Consider using build plugins
- Enable build cache in Netlify settings

## Monitoring

- **Analytics**: Enable Netlify Analytics in Site settings
- **Performance**: Use Lighthouse in Chrome DevTools
- **Uptime**: Set up monitoring with UptimeRobot or similar

## Security

- Enable HTTPS (automatic)
- Set up security headers in netlify.toml if needed
- Regular dependency updates: `npm audit fix`

## Cost

- Netlify Free Tier includes:
  - 100GB bandwidth/month
  - 300 build minutes/month
  - Automatic HTTPS
  - Continuous deployment
  - Form submissions (100/month)

Perfect for this project!
