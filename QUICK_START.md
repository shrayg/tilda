# Quick Start Guide

## Start Everything (Easiest Way)

**From project root, run:**
```bash
.\start-all.bat
```

This will:
- ✅ Create `.env` file if needed
- ✅ Set up database if needed  
- ✅ Start backend in one window
- ✅ Start frontend in another window

---

## Manual Start

### Terminal 1 - Backend:
```bash
cd backend-node
.\start.bat
```
Backend runs on: **http://localhost:5000**

### Terminal 2 - Frontend:
```bash
npm run dev
```
Frontend runs on: **http://localhost:8080**

---

## Verify It's Working

1. **Backend Health**: http://localhost:5000/health
   - Should show: `{"status":"healthy"}`

2. **Frontend**: http://localhost:8080
   - Should show the map interface

3. **Test Route**: 
   - Enter origin: "Times Square, NYC"
   - Enter destination: "Central Park, NYC"
   - Click or wait - routes should appear!

---

## Troubleshooting

### "DATABASE_URL not found"
Run: `cd backend-node && .\create-env.bat`

### "Cannot find module"
Run: `cd backend-node && npm install`

### Port already in use
- Backend: Change `PORT=5000` to `PORT=5001` in `backend-node/.env`
- Frontend: Vite will auto-use next port (check console)

### Build errors
```bash
cd backend-node
npm run build
```
Check for TypeScript errors.

---

## First Time Setup

If this is your first time:

1. **Backend setup**:
   ```bash
   cd backend-node
   .\create-env.bat          # Creates .env file
   npm install                # Install dependencies
   npx prisma migrate dev --name init  # Set up database
   .\start.bat                # Start server
   ```

2. **Frontend setup** (usually already done):
   ```bash
   npm install                # Install dependencies
   npm run dev                # Start server
   ```

That's it! 🚀

