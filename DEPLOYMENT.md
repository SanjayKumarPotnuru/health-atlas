# Health Atlas - Render Deployment Guide

This guide walks you through deploying Health Atlas to [Render](https://render.com) for free.

## Prerequisites

1. **GitHub Account** - Your code needs to be in a GitHub repository
2. **Render Account** - Sign up at [render.com](https://render.com) (free)
3. **GitHub Token** - For the AI chatbot (get from [GitHub Settings](https://github.com/settings/tokens))

## Quick Deploy

### Option 1: Blueprint Deploy (Recommended)

1. Push your code to a GitHub repository
2. Go to [Render Dashboard](https://dashboard.render.com)
3. Click **Blueprints** → **New Blueprint Instance**
4. Connect your GitHub repository
5. Render will automatically detect `render.yaml` and create:
   - PostgreSQL database
   - Backend API service
   - Frontend web service
   - AI Chatbot service

### Option 2: Manual Deploy

#### Step 1: Create PostgreSQL Database

1. Go to Render Dashboard → **New** → **PostgreSQL**
2. Settings:
   - Name: `health-atlas-db`
   - Database: `healthatlas`
   - User: `healthatlas`
   - Plan: **Free**
3. Click **Create Database**
4. Note the connection details (Internal URL, Username, Password)

#### Step 2: Deploy Backend

1. Go to **New** → **Web Service**
2. Connect your GitHub repository
3. Settings:
   - Name: `health-atlas-backend`
   - Root Directory: `backend`
   - Runtime: **Docker**
   - Plan: **Free**
4. Add Environment Variables:
   ```
   SPRING_PROFILES_ACTIVE=prod
   DATABASE_URL=jdbc:postgresql://<host>:5432/healthatlas
   DATABASE_USERNAME=<from database>
   DATABASE_PASSWORD=<from database>
   JWT_SECRET=<generate a secure 64-char string>
   CORS_ALLOWED_ORIGINS=https://health-atlas-frontend.onrender.com
   ```
5. Click **Create Web Service**

#### Step 3: Deploy Frontend

1. Go to **New** → **Web Service**
2. Connect your GitHub repository
3. Settings:
   - Name: `health-atlas-frontend`
   - Root Directory: `frontend`
   - Runtime: **Docker**
   - Plan: **Free**
4. Add Environment Variables:
   ```
   VITE_API_URL=https://health-atlas-backend.onrender.com/api
   VITE_CHATBOT_URL=https://health-atlas-chatbot.onrender.com
   ```
5. Click **Create Web Service**

#### Step 4: Deploy AI Chatbot

1. Go to **New** → **Web Service**
2. Connect your GitHub repository
3. Settings:
   - Name: `health-atlas-chatbot`
   - Root Directory: `medical-chatbot`
   - Runtime: **Docker**
   - Plan: **Free**
4. Add Environment Variables:
   ```
   GITHUB_TOKEN=<your GitHub token with models access>
   CORS_ORIGINS=https://health-atlas-frontend.onrender.com
   BACKEND_URL=https://health-atlas-backend.onrender.com
   ```
5. Click **Create Web Service**

## Post-Deployment

### Update CORS Settings

After deployment, update the frontend URL in:
- Backend: `CORS_ALLOWED_ORIGINS` environment variable
- Chatbot: `CORS_ORIGINS` environment variable

### Create Admin User

The first user needs to be created manually. You can:
1. Use the H2 console (dev) or database client (prod) to insert admin
2. Or modify FlywayDBmigration to seed an admin user

### Verify Deployment

1. **Backend Health**: `https://health-atlas-backend.onrender.com/api/health`
2. **Chatbot Health**: `https://health-atlas-chatbot.onrender.com/health`
3. **Frontend**: `https://health-atlas-frontend.onrender.com`

## Environment Variables Reference

### Backend
| Variable | Description | Example |
|----------|-------------|---------|
| `SPRING_PROFILES_ACTIVE` | Spring profile | `prod` |
| `DATABASE_URL` | PostgreSQL JDBC URL | `jdbc:postgresql://...` |
| `DATABASE_USERNAME` | Database username | `healthatlas` |
| `DATABASE_PASSWORD` | Database password | `<secret>` |
| `JWT_SECRET` | JWT signing key (64+ chars) | Auto-generated |
| `CORS_ALLOWED_ORIGINS` | Allowed origins | `https://...` |

### Frontend
| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `https://.../api` |
| `VITE_CHATBOT_URL` | Chatbot URL | `https://...` |

### Chatbot
| Variable | Description | Example |
|----------|-------------|---------|
| `GITHUB_TOKEN` | GitHub PAT for AI models | `ghp_...` |
| `CORS_ORIGINS` | Allowed origins | `https://...` |
| `BACKEND_URL` | Backend API URL | `https://...` |

## Troubleshooting

### Build Fails
- Check Docker logs in Render dashboard
- Ensure all dependencies are in requirements.txt / pom.xml / package.json

### Database Connection Issues
- Verify DATABASE_URL uses Internal Database URL (not External)
- Check credentials match the database settings

### CORS Errors
- Ensure frontend URL is in backend's CORS_ALLOWED_ORIGINS
- Ensure frontend URL is in chatbot's CORS_ORIGINS

### Free Tier Limits
- Services spin down after 15 minutes of inactivity
- First request after wake-up takes ~30-60 seconds
- PostgreSQL free tier: 1GB storage, expires after 90 days

## Upgrading

To upgrade from free tier:
1. Go to service settings
2. Change plan to **Starter** ($7/month per service)
3. Benefits: No spin-down, better performance, custom domains
