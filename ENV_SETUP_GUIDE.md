# Environment Variables Setup Guide

Complete guide for setting up environment variables for both frontend and backend.

## Frontend Environment Variables

### Location: `.env` in project root

```env
# Mapbox Token (REQUIRED)
VITE_MAPBOX_TOKEN=pk.eyJ1IjoicmlhemExNjIiLCJhIjoiY21nMmhkeG05MDdtcDJycG95aDNkNGRrayJ9.okIiL_beCCP6u1W6kdX02w

# Backend API URL (REQUIRED)
VITE_API_URL=http://localhost:5000
```

### Frontend Keys Needed:

#### 1. **VITE_MAPBOX_TOKEN** ⭐ REQUIRED
- **What it is**: Mapbox access token for displaying maps
- **Status**: ✅ Already configured with your token
- **Where to get**: https://account.mapbox.com/access-tokens/
- **Free tier**: 50,000 map loads/month
- **Priority**: CRITICAL - Maps won't work without this

#### 2. **VITE_API_URL** ⭐ REQUIRED
- **What it is**: Backend API URL
- **Current value**: `http://localhost:5000` (for local development)
- **For production**: Set to your Vercel backend URL (e.g., `https://your-app.vercel.app`)
- **Priority**: CRITICAL - Frontend needs this to communicate with backend

---

## Backend Environment Variables

### Location: `backend-node/.env`

```env
# Mapbox Token (REQUIRED)
MAPBOX_ACCESS_TOKEN=pk.eyJ1IjoicmlhemExNjIiLCJhIjoiY21nMmhkeG05MDdtcDJycG95aDNkNGRrayJ9.okIiL_beCCP6u1W6kdX02w

# Database (REQUIRED)
DATABASE_URL=file:./dev.db

# JWT (REQUIRED)
JWT_SECRET=dev-secret-key-change-in-production
JWT_EXPIRES_IN=30d

# Server (REQUIRED)
PORT=5000
NODE_ENV=development
CORS_ORIGINS=http://localhost:8080,http://localhost:5173

# NYC API Keys (OPTIONAL - but recommended)
NYC_OPEN_DATA_API_KEY=
NYC_511_API_KEY=
WEATHER_API_KEY=

# OAuth - Google (OPTIONAL)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# OAuth - Apple (OPTIONAL)
APPLE_CLIENT_ID=
APPLE_TEAM_ID=
APPLE_KEY_ID=
APPLE_PRIVATE_KEY=
```

---

## Required Keys (Must Have)

### Frontend:

1. **VITE_MAPBOX_TOKEN** ✅ Already set
   - **Get from**: https://account.mapbox.com/access-tokens/
   - **Current**: Already configured

2. **VITE_API_URL** ✅ Already set  
   - **Local**: `http://localhost:5000`
   - **Production**: Your Vercel backend URL

### Backend:

1. **MAPBOX_ACCESS_TOKEN** ✅ Already set
   - **Get from**: https://account.mapbox.com/access-tokens/
   - **Current**: Already configured
   - **Same token** as frontend VITE_MAPBOX_TOKEN

2. **DATABASE_URL** ✅ Default set
   - **Local**: `file:./dev.db` (SQLite - no setup needed)
   - **Production**: Use Vercel Postgres URL

3. **JWT_SECRET** ✅ Default set
   - **Local**: `dev-secret-key-change-in-production` (fine for dev)
   - **Production**: Generate a secure random string

4. **CORS_ORIGINS** ✅ Default set
   - **Local**: `http://localhost:8080,http://localhost:5173`
   - **Production**: Add your production frontend URL

---

## Optional Keys (Recommended for Full Functionality)

### Backend Only:

#### 1. **NYC_OPEN_DATA_API_KEY** 🔵 Recommended
- **What it enables**: Crash data, crime data, construction permits
- **Priority**: HIGH - Enables core safety data features
- **How to get**:
  1. Visit: https://data.cityofnewyork.us/profile/app_tokens
  2. Sign in or create free NYC.gov account
  3. Go to "My Account" → "Manage App Tokens"
  4. Create new token
  5. Copy token to `.env`
- **Free**: Yes, unlimited for registered users
- **Impact**: Without this, crash/crime data will be limited

#### 2. **NYC_511_API_KEY** 🔵 Recommended  
- **What it enables**: Live traffic data, road work, incidents
- **Priority**: MEDIUM - Enables real-time traffic features
- **How to get**:
  1. Visit: https://511ny.org/developers/help
  2. Register as developer
  3. Request API key via form
  4. Copy key to `.env`
- **Free**: Yes (registration required)
- **Impact**: Without this, no live traffic/construction data

#### 3. **WEATHER_API_KEY** ⚪ Optional
- **What it enables**: Weather data (alternative to NWS)
- **Priority**: LOW - NWS API works without a key
- **How to get**: https://openweathermap.org/api
- **Alternative**: Use NWS API (no key needed) - already implemented
- **Impact**: Minimal - weather works without this

---

## OAuth Keys (Optional - Only if you want Google/Apple login)

### 4. **GOOGLE_CLIENT_ID & GOOGLE_CLIENT_SECRET** ⚪ Optional
- **What it enables**: Sign in with Google
- **Priority**: LOW - Email/password auth works without this
- **How to get**:
  1. Visit: https://console.cloud.google.com/
  2. Create project or select existing
  3. Enable "Google+ API"
  4. Go to "Credentials" → "Create Credentials" → "OAuth client ID"
  5. Choose "Web application"
  6. Add authorized redirect URI: `http://localhost:5000/api/auth/google/callback`
  7. Copy Client ID and Secret to `.env`
- **Free**: Yes
- **Impact**: Without this, users can only use email/password login

### 5. **APPLE_CLIENT_ID, APPLE_TEAM_ID, APPLE_KEY_ID, APPLE_PRIVATE_KEY** ⚪ Optional
- **What it enables**: Sign in with Apple
- **Priority**: VERY LOW - Requires paid Apple Developer account
- **Cost**: $99/year for Apple Developer account
- **How to get**: https://developer.apple.com/ (requires Apple Developer account)
- **Impact**: Minimal - email/password and Google auth are sufficient

---

## Priority Summary

### Must Have (Critical):
- ✅ **VITE_MAPBOX_TOKEN** (Frontend) - Already set
- ✅ **MAPBOX_ACCESS_TOKEN** (Backend) - Already set
- ✅ **VITE_API_URL** (Frontend) - Already set
- ✅ **DATABASE_URL** (Backend) - Default set

### Highly Recommended:
- 🔵 **NYC_OPEN_DATA_API_KEY** - For crash/crime/construction data
- 🔵 **NYC_511_API_KEY** - For live traffic data

### Nice to Have:
- ⚪ **GOOGLE_CLIENT_ID/SECRET** - For Google OAuth login
- ⚪ **WEATHER_API_KEY** - Alternative weather source (NWS works without)

### Optional:
- ⚪ **APPLE_*** keys - Only if you want Apple login ($99/year)

---

## Quick Setup Steps

### 1. Frontend `.env` (Already done ✅)
Your frontend `.env` already has:
- VITE_MAPBOX_TOKEN ✅
- VITE_API_URL ✅

**For production**, update `VITE_API_URL` to your Vercel backend URL.

### 2. Backend `.env` Setup

**Step 1: Create the file**
Run from `backend-node` directory:
```bash
.\create-env.bat
```

**Step 2: Get NYC Open Data Key (Recommended)**
1. Go to: https://data.cityofnewyork.us/profile/app_tokens
2. Sign up/login (free)
3. Create app token
4. Add to `backend-node/.env`:
   ```
   NYC_OPEN_DATA_API_KEY=your_token_here
   ```

**Step 3: Get 511NY API Key (Recommended)**
1. Go to: https://511ny.org/developers/help
2. Register as developer
3. Request API key
4. Add to `backend-node/.env`:
   ```
   NYC_511_API_KEY=your_key_here
   ```

### 3. Verify Setup

**Frontend:**
```bash
# Check .env exists and has:
# VITE_MAPBOX_TOKEN=...
# VITE_API_URL=http://localhost:5000
```

**Backend:**
```bash
cd backend-node
# Verify .env exists
.\create-env.bat  # Run if not exists

# Verify DATABASE_URL is set
npx prisma migrate dev --name init
```

---

## For Production Deployment

### Frontend (Vercel/Netlify):
```env
VITE_MAPBOX_TOKEN=pk.your_token_here
VITE_API_URL=https://your-backend.vercel.app
```

### Backend (Vercel):
Set these in Vercel Dashboard → Settings → Environment Variables:
- `MAPBOX_ACCESS_TOKEN` - Your Mapbox token
- `DATABASE_URL` - Vercel Postgres connection string (or external PostgreSQL)
- `JWT_SECRET` - Generate secure random string
- `NYC_OPEN_DATA_API_KEY` - (Optional)
- `NYC_511_API_KEY` - (Optional)
- `CORS_ORIGINS` - Your frontend URL (e.g., `https://your-frontend.vercel.app`)

---

## Testing Without Optional Keys

The app will work with **minimal functionality** without optional keys:
- ✅ Routes will work (uses Mapbox - already configured)
- ✅ Map will display
- ⚠️ Crash/crime data may be limited (without NYC Open Data key)
- ⚠️ Live traffic data won't work (without 511NY key)
- ✅ Weather data works (uses free NWS API)
- ✅ Email/password auth works (no OAuth keys needed)

---

## Quick Reference

### Essential Keys (Must Have):
1. Frontend: `VITE_MAPBOX_TOKEN` ✅
2. Frontend: `VITE_API_URL` ✅  
3. Backend: `MAPBOX_ACCESS_TOKEN` ✅
4. Backend: `DATABASE_URL` ✅

### Recommended Keys (Get these):
1. Backend: `NYC_OPEN_DATA_API_KEY` - https://data.cityofnewyork.us/profile/app_tokens
2. Backend: `NYC_511_API_KEY` - https://511ny.org/developers/help

### Optional Keys (Later):
- Google OAuth keys - https://console.cloud.google.com/
- Apple OAuth keys - https://developer.apple.com/ ($99/year)

---

## Links Quick Access

- **Mapbox Token**: https://account.mapbox.com/access-tokens/ ✅ Already have
- **NYC Open Data**: https://data.cityofnewyork.us/profile/app_tokens 🔵 Get this
- **511NY API**: https://511ny.org/developers/help 🔵 Get this
- **Google OAuth**: https://console.cloud.google.com/ ⚪ Optional
- **Apple OAuth**: https://developer.apple.com/ ⚪ Optional ($99/year)

