# Environment Configuration Guide

## 📋 Overview

This document explains how to configure the OrderApp frontend for different environments.

## 🔧 Local Development

### Create `.env.local` file

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# Optional debugging
DEBUG=false
```

**Notes:**
- `NEXT_PUBLIC_` prefix makes variables accessible in browser
- API should be running locally at http://localhost:3001
- Change port if your API runs on different port

## 🏗️ Staging Environment

### Create `.env.staging` file

```env
# API Configuration
NEXT_PUBLIC_API_URL=https://api-staging.yourdomain.com/api

# Features
NEXT_PUBLIC_DEBUG=false
NEXT_PUBLIC_ANALYTICS_ID=your-staging-id
```

### Deploy to staging

```bash
npm run build
# Deploy the .next folder to your staging server
```

## 🚀 Production Environment

### Create `.env.production` file

```env
# API Configuration
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api

# Features
NEXT_PUBLIC_DEBUG=false
NEXT_PUBLIC_ANALYTICS_ID=your-prod-id

# Performance
NODE_ENV=production
```

### Build for production

```bash
npm run build
npm run start
```

## 🔐 Security Best Practices

### Never Commit Secrets

```env
# ❌ WRONG - Do not commit
API_KEY=secret123456
DB_PASSWORD=mypassword
OAUTH_SECRET=verysecret
```

```env
# ✓ CORRECT - Use for non-sensitive config
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_APP_NAME=OrderApp
NEXT_PUBLIC_ENVIRONMENT=production
```

### Use `.gitignore`

The project already includes:
```
.env
.env.local
.env.*.local
```

### Environment Variable Categories

**Public (Browser-Accessible)**
- Use `NEXT_PUBLIC_` prefix
- API endpoints
- Feature flags
- Analytics IDs

**Private (Server-Only)**
- Database credentials
- API secrets
- OAuth tokens
- Encryption keys

## 📦 Vercel Deployment

### Environment Setup on Vercel

1. Go to Project Settings
2. Navigate to Environment Variables
3. Add your variables:

```
NEXT_PUBLIC_API_URL = https://api.yourdomain.com/api
```

4. Set environment for each variable:
   - Development
   - Preview
   - Production

### Deploy Command
```bash
# Vercel automatically runs:
npm run build
```

## 🐳 Docker Deployment

### Dockerfile

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Build
COPY . .
ARG NEXT_PUBLIC_API_URL=http://api:3001/api
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
RUN npm run build

# Production image
FROM node:18-alpine
WORKDIR /app
RUN npm install -g @next/cli
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./

RUN npm ci --only=production
EXPOSE 3000

CMD ["npm", "start"]
```

### Docker Compose

```yaml
version: '3.8'

services:
  frontend:
    build:
      context: .
      args:
        NEXT_PUBLIC_API_URL: http://backend:3001/api
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:3001/api
    depends_on:
      - backend

  backend:
    image: backend:latest
    ports:
      - "3001:3001"
```

### Run with Docker

```bash
# Build
docker build -t orderapp-frontend:latest .

# Run
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api \
  orderapp-frontend:latest
```

## 🌍 Multi-Environment Setup

### Different API Endpoints

**Local Development**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

**Testing/QA**
```env
NEXT_PUBLIC_API_URL=https://api-qa.yourdomain.com/api
```

**Staging**
```env
NEXT_PUBLIC_API_URL=https://api-staging.yourdomain.com/api
```

**Production**
```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
```

## 🔄 CI/CD Integration

### GitHub Actions Example

```yaml
name: Deploy

on:
  push:
    branches:
      - main
      - develop

env:
  NEXT_PUBLIC_API_URL: ${{ secrets.API_URL }}
  NODE_ENV: production

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Deploy
        run: npm run deploy
```

## 📊 Environment Variables Reference

### Available Variables

| Variable | Type | Required | Example |
|----------|------|----------|---------|
| `NEXT_PUBLIC_API_URL` | Public | Yes | `https://api.example.com/api` |
| `NEXT_PUBLIC_ENVIRONMENT` | Public | No | `production` |
| `NEXT_PUBLIC_DEBUG` | Public | No | `false` |
| `NODE_ENV` | System | Auto | `production` |

## ✅ Verification Checklist

- [ ] `.env.local` created for local development
- [ ] API URL points to correct endpoint
- [ ] API is accessible from browser
- [ ] `npm run dev` starts without errors
- [ ] Login page loads correctly
- [ ] Can successfully login
- [ ] Order page loads with data
- [ ] Filters work correctly
- [ ] No console errors

## 🆘 Common Issues

### API Connection Error

**Problem**: `Failed to fetch orders`

**Solution**:
1. Verify API is running: `curl http://localhost:3001/api/health`
2. Check `.env.local` has correct API URL
3. Verify CORS settings on backend
4. Check network tab for actual URL being called

### Build Fails with Missing Variable

**Problem**: `NEXT_PUBLIC_API_URL is not defined`

**Solution**:
1. Create `.env.local` with the variable
2. Restart `npm run dev`
3. Clear Next.js cache: `rm -rf .next`

### Production Build Fails

**Problem**: `Failed to compile` during `npm run build`

**Solution**:
1. Set all required environment variables
2. Run `npm run lint` to check for errors
3. Clear cache: `rm -rf .next node_modules`
4. Reinstall: `npm install`
5. Rebuild: `npm run build`

## 🎯 Best Practices

1. **Use environment-specific configs**
   - One `.env.local` per machine
   - Never commit environment files

2. **Document all variables**
   - List in README
   - Provide examples
   - Note if required

3. **Validate on startup**
   - Check required variables exist
   - Verify API connectivity
   - Log configuration (without secrets)

4. **Use semantic versioning**
   - Track config changes
   - Test before deploying
   - Document changes

## 📞 Support

For environment-related issues:
1. Check this guide
2. Review `.env.example` (if exists)
3. Check documentation
4. Review CI/CD logs

---

Last Updated: February 1, 2026
