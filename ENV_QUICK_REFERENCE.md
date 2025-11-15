# Environment Variables Quick Reference

## 🎯 What You MUST Have (Critical)

### Frontend (`.env` in project root):
✅ **Already Set**:
```
VITE_MAPBOX_TOKEN=pk.eyJ1IjoicmlhemExNjIiLCJhIjoiY21nMmhkeG05MDdtcDJycG95aDNkNGRrayJ9.okIiL_beCCP6u1W6kdX02w
VITE_API_URL=http://localhost:5000
```
✅ Both are already configured!

### Backend (`backend-node/.env`):
**Required** - Run `.\create-env.bat` to create:
```
MAPBOX_ACCESS_TOKEN=pk.eyJ1IjoicmlhemExNjIiLCJhIjoiY21nMmhdeG05MDdtcDJycG95aDNkNGRrayJ9.okIiL_beCCP6u1W6kdX02w
DATABASE_URL=file:./dev.db
JWT_SECRET=dev-secret-key-change-in-production
JWT_EXPIRES_IN=30d
PORT=5000
NODE_ENV=development
CORS_ORIGINS=http://localhost:8080,http://localhost:5173
```

---

## 🔵 What You SHOULD Get (Recommended)

### Backend Only:

#### 1. **NYC Open Data API Key** 🔵 HIGHLY RECOMMENDED
- **Get it here**: https://data.cityofnewyork.us/profile/app_tokens
- **Free**: Yes (sign up required)
- **Why**: Enables crash, crime, and construction data
- **Add to**: `backend-node/.env`
  ```
  NYC_OPEN_DATA_API_KEY=your_token_here
  ```

#### 2. **511NY API Key** 🔵 RECOMMENDED
- **Get it here**: https://511ny.org/developers/help
- **Free**: Yes (registration required)
- **Why**: Enables live traffic, road work, and incident data
- **Add to**: `backend-node/.env`
  ```
  NYC_511_API_KEY=your_key_here
  ```

---

## ⚪ What You CAN Get (Optional)

### Backend Only:

#### 3. **Google OAuth** ⚪ Optional
- **Get it here**: https://console.cloud.google.com/
- **Free**: Yes
- **Why**: Enables "Sign in with Google" button
- **Add to**: `backend-node/.env`
  ```
  GOOGLE_CLIENT_ID=your_client_id
  GOOGLE_CLIENT_SECRET=your_client_secret
  ```

#### 4. **Apple OAuth** ⚪ Optional
- **Get it here**: https://developer.apple.com/
- **Cost**: $99/year (Apple Developer account)
- **Why**: Enables "Sign in with Apple" button
- **Skip if**: You don't need Apple login (email/Google is enough)

#### 5. **OpenWeatherMap API Key** ⚪ Optional
- **Get it here**: https://openweathermap.org/api
- **Free**: Yes (with limits)
- **Why**: Alternative weather source (NWS works without a key)
- **Skip if**: You're okay with National Weather Service (free, no key needed)

---

## 📋 Setup Checklist

### Frontend `.env` (Already Done ✅):
- [x] VITE_MAPBOX_TOKEN - ✅ Already set
- [x] VITE_API_URL - ✅ Already set

### Backend `.env` Setup:

**Step 1: Create the file**
```bash
cd backend-node
.\create-env.bat
```

**Step 2: Get recommended keys** (5-10 minutes):

1. **NYC Open Data Key** 🔵
   - Visit: https://data.cityofnewyork.us/profile/app_tokens
   - Sign up/login (free NYC.gov account)
   - Create app token
   - Copy to `backend-node/.env`:
     ```
     NYC_OPEN_DATA_API_KEY=your_token_here
     ```

2. **511NY API Key** 🔵
   - Visit: https://511ny.org/developers/help
   - Register as developer
   - Request API key
   - Copy to `backend-node/.env`:
     ```
     NYC_511_API_KEY=your_key_here
     ```

**Step 3: Run database setup**
```bash
cd backend-node
npx prisma migrate dev --name init
```

---

## 🚀 Minimum Setup (Works Without Optional Keys)

**Frontend** ✅ Already configured:
```
VITE_MAPBOX_TOKEN=...
VITE_API_URL=http://localhost:5000
```

**Backend** (after running `create-env.bat`):
```
MAPBOX_ACCESS_TOKEN=...
DATABASE_URL=file:./dev.db
JWT_SECRET=dev-secret-key-change-in-production
PORT=5000
NODE_ENV=development
```

**This minimum setup will work**, but you'll have:
- ✅ Map and routes working
- ⚠️ Limited crash/crime data (without NYC Open Data key)
- ⚠️ No live traffic data (without 511NY key)
- ✅ Weather data (NWS works without key)
- ✅ Email/password login (OAuth keys not needed)

---

## 📍 Where to Get Each Key

| Key | Where to Get | Free? | Priority | Time |
|-----|--------------|-------|----------|------|
| **Mapbox Token** | https://account.mapbox.com/access-tokens/ | ✅ Yes | ✅ REQUIRED | 2 min |
| **NYC Open Data** | https://data.cityofnewyork.us/profile/app_tokens | ✅ Yes | 🔵 HIGH | 5 min |
| **511NY API** | https://511ny.org/developers/help | ✅ Yes | 🔵 HIGH | 5 min |
| **Google OAuth** | https://console.cloud.google.com/ | ✅ Yes | ⚪ LOW | 10 min |
| **Apple OAuth** | https://developer.apple.com/ | ❌ $99/yr | ⚪ LOW | Skip |

---

## 💡 Quick Answer

**What you MUST have:**
1. ✅ **Mapbox Token** - Already set in both frontend and backend
2. ✅ **VITE_API_URL** - Already set in frontend  
3. ✅ **DATABASE_URL** - Auto-set when you run `create-env.bat`

**What you SHOULD get:**
1. 🔵 **NYC Open Data Key** - For crash/crime data (5 min, free)
2. 🔵 **511NY API Key** - For live traffic data (5 min, free)

**What you CAN skip:**
- OAuth keys (email/password login works fine)
- Weather API key (NWS works without it)

---

## 🔧 Quick Setup Commands

```bash
# 1. Create backend .env
cd backend-node
.\create-env.bat

# 2. Set up database
npx prisma migrate dev --name init

# 3. Start backend
npm run dev

# 4. Start frontend (in another terminal)
cd ..
npm run dev
```

For the recommended keys (NYC Open Data and 511NY), visit the links above and add them to `backend-node/.env` after running `create-env.bat`.

